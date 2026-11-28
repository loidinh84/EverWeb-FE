import weddingApi from "./weddingApi";
import { getGuests, createGuest, updateGuest, deleteGuest } from "./guestApi";
import giftApi from "./giftApi";
import {
  DEFAULT_TABLES,
  INITIAL_GUESTS,
} from "../pages/features/seating-chart/constants";

const HIGH_RISK_ACTIONS = new Set([
  "DELETE_GUEST",
  "DELETE_TABLE",
  "DELETE_GIFT",
  "SEND_EMAIL",
  "AUTO_SEAT",
  "UPDATE_WEDDING_INFO",
]);

function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function matchGuest(nameQuery, guests = [], tables = []) {
  const q = normalize(nameQuery);
  if (!q) return null;

  const found = guests.find((g) => {
    const fullName = normalize(g.full_name || `${g.lastName || ""} ${g.firstName || ""}`);
    const shortName = normalize(g.firstName || "");
    return fullName.includes(q) || q.includes(fullName) || (shortName && shortName === q) || fullName.endsWith(q);
  });

  if (found) {
    return {
      id: found.id,
      fullName: found.full_name || `${found.lastName || ""} ${found.firstName || ""}`.trim(),
      raw: found,
    };
  }

  for (const t of tables) {
    for (const gName of t.guests || []) {
      if (gName && (normalize(gName).includes(q) || q.includes(normalize(gName)))) {
        return {
          id: `guest-${normalize(gName).replace(/\s+/g, "-")}`,
          fullName: gName,
          raw: null,
          currentTableId: t.id,
        };
      }
    }
  }

  return null;
}

function matchTable(tableQuery, tables = []) {
  const q = normalize(tableQuery);
  if (!q) return null;

  const numMatch = q.match(/\d+/);
  const targetNum = numMatch ? numMatch[0] : null;

  return (
    tables.find((t) => {
      const tNorm = normalize(t.name);
      if (targetNum && (tNorm.includes(`ban ${targetNum}`) || t.id === `t${targetNum}`)) {
        return true;
      }
      return tNorm.includes(q) || q.includes(tNorm);
    }) || null
  );
}

/**
 * Phân tích ý định thao tác trực tiếp từ câu lệnh người dùng (fallback khi LLM không gắn tag).
 */
export function parseIntentFromUserPrompt(prompt = "") {
  const text = normalize(prompt);
  if (!text) return null;

  if (
    text.includes("tu dong xep") ||
    text.includes("tu xep cho") ||
    text.includes("tu dong chia ban") ||
    text.includes("xep cho toan bo") ||
    text.includes("xep tat ca khach")
  ) {
    return { type: "AUTO_SEAT" };
  }

  const moveMatch = text.match(
    /(?:chuyen|doi|dua)\s+(?:khach\s+)?(.+?)\s+(?:sang|den|toi|qua|vao)\s+(.+)/i
  );
  if (moveMatch) {
    return {
      type: "MOVE_GUEST",
      guestQuery: moveMatch[1].replace(/^(khach|ban|anh|chi|em)\s+/i, "").trim(),
      tableQuery: moveMatch[2].trim(),
    };
  }

  const removeFromTableMatch = text.match(
    /(?:xoa|bo|rut|loai)\s+(?:khach\s+)?(.+?)\s+(?:khoi|ra khoi)\s+(?:ban|ghe|so do)/i
  );
  if (removeFromTableMatch) {
    return {
      type: "REMOVE_GUEST",
      guestQuery: removeFromTableMatch[1].replace(/^(khach|ban|anh|chi|em)\s+/i, "").trim(),
    };
  }

  const assignMatch = text.match(/(?:xep|gan|dat|cho)\s+(?:khach\s+)?(.+?)\s+(?:vao|ngoi|tai)\s+(.+)/i);
  if (assignMatch) {
    return {
      type: "ASSIGN_GUEST",
      guestQuery: assignMatch[1].replace(/^(khach|ban|anh|chi|em)\s+/i, "").trim(),
      tableQuery: assignMatch[2].trim(),
    };
  }

  const addTableMatch = text.match(/(?:them|tao)\s+ban(?:\s+moi)?(?:\s+ten\s+la)?\s+(.+)/i);
  if (addTableMatch) {
    const rawName = addTableMatch[1];
    const capMatch = rawName.match(/(\d+)\s*(?:ghe|cho|nguoi)/i);
    const capacity = capMatch ? Number(capMatch[1]) : 8;
    const cleanedName = rawName.replace(/(\d+)\s*(?:ghe|cho|nguoi)/i, "").replace(/co\s+/i, "").trim();
    return {
      type: "ADD_TABLE",
      name: cleanedName.startsWith("ban") ? cleanedName : `Bàn ${cleanedName}`,
      capacity: Math.max(4, Math.min(20, capacity)),
    };
  }

  const deleteTableMatch = text.match(/(?:xoa|huy|bo)\s+ban\s+(.+)/i);
  if (deleteTableMatch) {
    return { type: "DELETE_TABLE", tableQuery: deleteTableMatch[1].trim() };
  }

  const templateMatch = text.match(/(?:doi|chuyen|chon)\s+(?:mau\s+)?thiep\s+(n0[0-3])/i);
  if (templateMatch) {
    return { type: "SET_INVITATION_TEMPLATE", templateId: templateMatch[1].toUpperCase() };
  }

  return null;
}

/**
 * Trích xuất lệnh từ chuỗi phản hồi AI có chứa thẻ [ACTION: ...]
 */
export function parseActionTagFromAiResponse(aiText = "") {
  const match = aiText.match(/\[ACTION:\s*([A-Z_]+)([^\]]*)\]/i);
  if (!match) return null;

  const type = match[1].toUpperCase();
  const paramsStr = match[2];
  const params = {};

  const paramRegex = /(\w+)="([^"]*)"|(\w+)=(\d+)/g;
  let pMatch;
  while ((pMatch = paramRegex.exec(paramsStr)) !== null) {
    const key = pMatch[1] || pMatch[3];
    const val = pMatch[2] !== undefined ? pMatch[2] : Number(pMatch[4]);
    params[key] = val;
  }

  return { type, ...params };
}

/**
 * Tạo mô tả xem trước cho bước Xác nhận trước khi thực thi.
 */
function buildActionPreview(parsedIntent) {
  const riskLevel = HIGH_RISK_ACTIONS.has(parsedIntent.type) ? "high" : "normal";
  const base = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: parsedIntent.type,
    params: parsedIntent,
    riskLevel,
    requiresConfirmation: true,
    status: "pending",
  };

  switch (parsedIntent.type) {
    case "MOVE_GUEST":
    case "ASSIGN_GUEST": {
      const guest = parsedIntent.guest || parsedIntent.guestQuery || "Khách mời";
      const table = parsedIntent.toTable || parsedIntent.tableQuery || "Bàn mới";
      return { ...base, title: "Xếp / Chuyển bàn tiệc", summary: `Đưa **${guest}** vào **${table}**.` };
    }
    case "REMOVE_GUEST":
      return {
        ...base,
        title: "Rút khách khỏi bàn",
        summary: `Đưa **${parsedIntent.guest || parsedIntent.guestQuery}** ra khỏi bàn hiện tại về danh sách chờ.`,
      };
    case "AUTO_SEAT":
      return {
        ...base,
        title: "Tự động xếp chỗ toàn bộ",
        summary: "Tự động phân bổ tất cả khách tham dự chưa có chỗ vào các bàn còn trống.",
      };
    case "ADD_TABLE":
      return {
        ...base,
        title: "Thêm bàn tiệc mới",
        summary: `Tạo **${parsedIntent.name || "Bàn mới"}** (${Number(parsedIntent.capacity) || 8} ghế).`,
      };
    case "DELETE_TABLE":
      return {
        ...base,
        title: "Xóa bàn tiệc",
        summary: `Xóa **${parsedIntent.name || parsedIntent.tableQuery}** khỏi sơ đồ và đưa khách về danh sách chờ.`,
      };
    case "ADD_GUEST":
      return {
        ...base,
        title: "Thêm khách mời vào CSDL",
        summary: `Thêm **${parsedIntent.name}**${parsedIntent.phone ? ` · SĐT: ${parsedIntent.phone}` : ""}${parsedIntent.email ? ` · Email: ${parsedIntent.email}` : ""}.`,
      };
    case "UPDATE_GUEST_RSVP": {
      const label = parsedIntent.status === "attending" ? "Tham dự" : parsedIntent.status === "declined" ? "Từ chối" : "Chờ phản hồi";
      return {
        ...base,
        title: "Cập nhật trạng thái RSVP",
        summary: `Đổi trạng thái tham dự của **${parsedIntent.guest}** thành **${label}**.`,
      };
    }
    case "DELETE_GUEST":
      return {
        ...base,
        title: "Xóa khách mời khỏi CSDL",
        summary: `Xóa vĩnh viễn khách mời **${parsedIntent.guest}** khỏi danh sách cưới.`,
      };
    case "ADD_GIFT":
      return {
        ...base,
        title: "Ghi nhận quà mừng cưới",
        summary: `Ghi nhận **${parsedIntent.giver}** mừng **${Number(parsedIntent.amount || 0).toLocaleString("vi-VN")} VNĐ**.`,
      };
    case "UPDATE_GIFT_STATUS":
      return {
        ...base,
        title: "Cập nhật trạng thái quà mừng",
        summary: `Cập nhật quà mừng của **${parsedIntent.giver}** sang trạng thái **${parsedIntent.status === "pending" ? "Chờ xác nhận" : "Đã xác nhận"}**.`,
      };
    case "DELETE_GIFT":
      return {
        ...base,
        title: "Xóa khoản quà mừng",
        summary: `Xóa khoản mừng của **${parsedIntent.giver}** khỏi sổ quà mừng.`,
      };
    case "UPDATE_BANK_ACCOUNT":
      return {
        ...base,
        title: "Cập nhật tài khoản VietQR",
        summary: `Cập nhật tài khoản nhận mừng: **${parsedIntent.bankName || ""}** - **${parsedIntent.accountNumber || ""}** (${parsedIntent.accountHolder || ""}).`,
      };
    case "UPDATE_WEDDING_INFO":
      return {
        ...base,
        title: "Cập nhật thông tin đám cưới",
        summary: "Lưu các thay đổi thông tin chính của hồ sơ đám cưới lên hệ thống.",
      };
    case "SET_INVITATION_TEMPLATE":
      return {
        ...base,
        title: "Đổi mẫu thiệp điện tử",
        summary: `Áp dụng mẫu thiệp **${parsedIntent.templateId}** cho trang thiệp mời của bạn.`,
      };
    case "ADD_SCHEDULE_ITEM":
      return {
        ...base,
        title: "Thêm mốc lịch trình ngày cưới",
        summary: `Thêm mốc **${parsedIntent.time || ""} - ${parsedIntent.title || ""}**${parsedIntent.location ? ` tại ${parsedIntent.location}` : ""}.`,
      };
    case "SEND_EMAIL":
      return {
        ...base,
        title: "Gửi Email mời cưới",
        summary: `Gửi email tiêu đề **"${parsedIntent.subject || "Thiệp mời cưới"}"** tới **${parsedIntent.recipients || "toàn bộ khách có email"}**.`,
      };
    default:
      return null;
  }
}

/**
 * Chuẩn bị thao tác cần xác nhận (chưa ghi xuống DB).
 */
export function prepareAiDirectAction({ userPrompt, aiResponseText }) {
  const parsedIntent =
    parseActionTagFromAiResponse(aiResponseText) || parseIntentFromUserPrompt(userPrompt);
  if (!parsedIntent) return null;
  return buildActionPreview(parsedIntent);
}

/**
 * Thực thi thao tác sau khi người dùng đã bấm Xác nhận.
 */
export async function executePreparedAiAction({ wedding, pendingAction }) {
  const parsedIntent = pendingAction?.params || pendingAction;
  if (!parsedIntent?.type) {
    return { handled: false };
  }

  const weddingId = wedding?.id;
  if (!weddingId && !["MOVE_GUEST", "ASSIGN_GUEST", "REMOVE_GUEST", "AUTO_SEAT", "ADD_TABLE", "DELETE_TABLE"].includes(parsedIntent.type)) {
    return {
      handled: true,
      success: false,
      message: "Bạn cần chọn hoặc tạo một đám cưới trước khi thực hiện thao tác này.",
    };
  }

  // Nhóm thao tác cần đọc feature_configs (bàn tiệc / thiệp / lịch trình)
  const needsFeatures = [
    "MOVE_GUEST",
    "ASSIGN_GUEST",
    "REMOVE_GUEST",
    "AUTO_SEAT",
    "ADD_TABLE",
    "DELETE_TABLE",
    "SET_INVITATION_TEMPLATE",
    "ADD_SCHEDULE_ITEM",
  ].includes(parsedIntent.type);

  let currentFeatures = {};
  if (needsFeatures && weddingId) {
    try {
      currentFeatures = (await weddingApi.getFeatures(weddingId)) || {};
    } catch {
      currentFeatures = {};
    }
  }

  let tables = Array.isArray(currentFeatures?.website_config?.seatingTables)
    ? [...currentFeatures.website_config.seatingTables]
    : [...DEFAULT_TABLES];

  let guests = Array.isArray(currentFeatures?.collect_contacts?.guestList)
    ? [...currentFeatures.collect_contacts.guestList]
    : [...INITIAL_GUESTS];

  let actionResult;

  switch (parsedIntent.type) {
    case "MOVE_GUEST":
    case "ASSIGN_GUEST": {
      const gQuery = parsedIntent.guest || parsedIntent.guestQuery;
      const tQuery = parsedIntent.toTable || parsedIntent.tableQuery;
      const matchedG = matchGuest(gQuery, guests, tables);
      if (!matchedG) {
        return { handled: true, success: false, message: `Không tìm thấy khách mời "${gQuery}".` };
      }
      const matchedT = matchTable(tQuery, tables);
      if (!matchedT) {
        return { handled: true, success: false, message: `Không tìm thấy bàn tiệc "${tQuery}".` };
      }

      tables = tables
        .map((t) => ({ ...t, guests: t.guests.filter((name) => name !== matchedG.fullName) }))
        .map((t) => {
          if (t.id !== matchedT.id || t.guests.length >= t.capacity) return t;
          return { ...t, guests: [...t.guests, matchedG.fullName] };
        });

      guests = guests.map((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        return fName === matchedG.fullName || g.id === matchedG.id
          ? { ...g, tableId: matchedT.id, tableName: matchedT.name }
          : g;
      });

      actionResult = {
        title: "Đã chuyển bàn tiệc thành công",
        detail: `Khách **${matchedG.fullName}** đã được xếp vào **${matchedT.name}**.`,
        actionType: parsedIntent.type,
      };
      break;
    }

    case "REMOVE_GUEST": {
      const gQuery = parsedIntent.guest || parsedIntent.guestQuery;
      const matchedG = matchGuest(gQuery, guests, tables);
      if (!matchedG) {
        return { handled: true, success: false, message: `Không tìm thấy khách mời "${gQuery}" trong các bàn tiệc.` };
      }

      tables = tables.map((t) => ({
        ...t,
        guests: t.guests.filter((name) => name !== matchedG.fullName),
      }));
      guests = guests.map((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        return fName === matchedG.fullName || g.id === matchedG.id
          ? { ...g, tableId: null, tableName: "Chưa xếp bàn" }
          : g;
      });

      actionResult = {
        title: "Đã rút khách khỏi bàn",
        detail: `Khách **${matchedG.fullName}** đã được đưa về danh sách chưa xếp bàn.`,
        actionType: "REMOVE_GUEST",
      };
      break;
    }

    case "AUTO_SEAT": {
      const seatedSet = new Set(tables.flatMap((t) => t.guests.filter(Boolean)));
      const unseated = guests.filter((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        return g.rsvp === "Tham dự" && !seatedSet.has(fName) && !g.tableId;
      });

      if (unseated.length === 0) {
        return {
          handled: true,
          success: true,
          actionResult: {
            title: "Tất cả đã có chỗ",
            detail: "Không còn khách tham dự nào đang chờ xếp bàn.",
            actionType: "AUTO_SEAT",
          },
        };
      }

      let count = 0;
      const nextTables = tables.map((t) => ({ ...t, guests: [...t.guests] }));
      const updatedGuestMap = new Map();
      for (const g of unseated) {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        const openTable = nextTables.find((t) => t.guests.length < t.capacity);
        if (openTable) {
          openTable.guests.push(fName);
          updatedGuestMap.set(g.id, { tableId: openTable.id, tableName: openTable.name });
          count++;
        }
      }

      tables = nextTables;
      guests = guests.map((g) => (updatedGuestMap.has(g.id) ? { ...g, ...updatedGuestMap.get(g.id) } : g));

      actionResult = {
        title: "Tự động xếp chỗ thành công",
        detail: `Đã tự động xếp **${count} khách mời** vào các bàn tiệc còn trống.`,
        actionType: "AUTO_SEAT",
      };
      break;
    }

    case "ADD_TABLE": {
      const name = parsedIntent.name || "Bàn tiệc mới";
      const capacity = Number(parsedIntent.capacity) || 8;
      tables = [...tables, { id: `t-${Date.now()}`, name, capacity, guests: [] }];
      actionResult = {
        title: "Đã tạo bàn tiệc mới",
        detail: `Đã thêm **${name}** (${capacity} ghế) vào sảnh tiệc.`,
        actionType: "ADD_TABLE",
      };
      break;
    }

    case "DELETE_TABLE": {
      const tQuery = parsedIntent.name || parsedIntent.tableQuery;
      const matchedT = matchTable(tQuery, tables);
      if (!matchedT) {
        return { handled: true, success: false, message: `Không tìm thấy bàn tiệc "${tQuery}" để xóa.` };
      }

      const guestsInTable = new Set(matchedT.guests || []);
      guests = guests.map((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        return g.tableId === matchedT.id || guestsInTable.has(fName)
          ? { ...g, tableId: null, tableName: "Chưa xếp bàn" }
          : g;
      });
      tables = tables.filter((t) => t.id !== matchedT.id);

      actionResult = {
        title: "Đã xóa bàn tiệc",
        detail: `Đã xóa **${matchedT.name}** và đưa khách trong bàn về danh sách chờ.`,
        actionType: "DELETE_TABLE",
      };
      break;
    }

    case "ADD_GUEST": {
      const created = await createGuest({
        wedding_id: weddingId,
        full_name: parsedIntent.name,
        phone: parsedIntent.phone || null,
        email: parsedIntent.email || null,
        max_companions: Number(parsedIntent.companions) || 0,
      });
      window.dispatchEvent(new CustomEvent("everweb:guests-updated", { detail: { guest: created } }));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã thêm khách mời mới",
          detail: `Đã lưu khách **${created?.full_name || parsedIntent.name}** vào danh sách Neon DB.`,
          actionType: "ADD_GUEST",
        },
      };
    }

    case "UPDATE_GUEST_RSVP": {
      const dbGuests = await getGuests(weddingId);
      const matched = matchGuest(parsedIntent.guest, dbGuests);
      if (!matched) {
        return { handled: true, success: false, message: `Không tìm thấy khách "${parsedIntent.guest}" trong CSDL.` };
      }
      const nextStatus = ["attending", "declined", "pending"].includes(parsedIntent.status)
        ? parsedIntent.status
        : "attending";
      await updateGuest(matched.id, { rsvp_status: nextStatus });
      window.dispatchEvent(new CustomEvent("everweb:guests-updated"));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã cập nhật RSVP",
          detail: `Đã cập nhật trạng thái của **${matched.fullName}** thành **${nextStatus}**.`,
          actionType: "UPDATE_GUEST_RSVP",
        },
      };
    }

    case "DELETE_GUEST": {
      const dbGuests = await getGuests(weddingId);
      const matched = matchGuest(parsedIntent.guest, dbGuests);
      if (!matched) {
        return { handled: true, success: false, message: `Không tìm thấy khách "${parsedIntent.guest}" trong CSDL.` };
      }
      await deleteGuest(matched.id);
      window.dispatchEvent(new CustomEvent("everweb:guests-updated"));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã xóa khách mời",
          detail: `Đã xóa **${matched.fullName}** khỏi cơ sở dữ liệu.`,
          actionType: "DELETE_GUEST",
        },
      };
    }

    case "ADD_GIFT": {
      const createdGift = await giftApi.createGift({
        wedding_id: weddingId,
        giver_name: parsedIntent.giver,
        amount: Number(parsedIntent.amount) || 0,
        message: parsedIntent.message || "",
        status: parsedIntent.status === "pending" ? "pending" : "confirmed",
      });
      window.dispatchEvent(new CustomEvent("everweb:gifts-updated", { detail: { gift: createdGift } }));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã ghi nhận quà mừng",
          detail: `Đã lưu khoản mừng **${Number(parsedIntent.amount || 0).toLocaleString("vi-VN")} VNĐ** từ **${parsedIntent.giver}**.`,
          actionType: "ADD_GIFT",
        },
      };
    }

    case "UPDATE_GIFT_STATUS": {
      const { gifts = [] } = await giftApi.listByWedding(weddingId);
      const q = normalize(parsedIntent.giver || "");
      const matched = gifts.find((g) => normalize(g.giver_name).includes(q) || q.includes(normalize(g.giver_name)));
      if (!matched) {
        return { handled: true, success: false, message: `Không tìm thấy khoản quà mừng của "${parsedIntent.giver}".` };
      }
      const nextStatus = parsedIntent.status === "pending" ? "pending" : "confirmed";
      await giftApi.updateGift(matched.id, { status: nextStatus });
      window.dispatchEvent(new CustomEvent("everweb:gifts-updated"));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã cập nhật quà mừng",
          detail: `Khoản mừng của **${matched.giver_name}** đã chuyển sang **${nextStatus}**.`,
          actionType: "UPDATE_GIFT_STATUS",
        },
      };
    }

    case "DELETE_GIFT": {
      const { gifts = [] } = await giftApi.listByWedding(weddingId);
      const q = normalize(parsedIntent.giver || "");
      const matched = gifts.find((g) => normalize(g.giver_name).includes(q) || q.includes(normalize(g.giver_name)));
      if (!matched) {
        return { handled: true, success: false, message: `Không tìm thấy khoản quà mừng của "${parsedIntent.giver}".` };
      }
      await giftApi.deleteGift(matched.id);
      window.dispatchEvent(new CustomEvent("everweb:gifts-updated"));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã xóa khoản quà mừng",
          detail: `Đã xóa khoản mừng của **${matched.giver_name}** khỏi hệ thống.`,
          actionType: "DELETE_GIFT",
        },
      };
    }

    case "UPDATE_BANK_ACCOUNT": {
      await giftApi.upsertBankAccount({
        wedding_id: weddingId,
        bank_name: parsedIntent.bankName || "",
        account_number: parsedIntent.accountNumber || "",
        account_holder: parsedIntent.accountHolder || "",
        is_active: true,
      });
      window.dispatchEvent(new CustomEvent("everweb:gifts-updated"));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã cập nhật tài khoản VietQR",
          detail: `Đã lưu tài khoản **${parsedIntent.bankName}** - **${parsedIntent.accountNumber}**.`,
          actionType: "UPDATE_BANK_ACCOUNT",
        },
      };
    }

    case "UPDATE_WEDDING_INFO": {
      const patch = {};
      if (parsedIntent.title) patch.title = parsedIntent.title;
      if (parsedIntent.brideName) patch.bride_name = parsedIntent.brideName;
      if (parsedIntent.groomName) patch.groom_name = parsedIntent.groomName;
      if (parsedIntent.weddingDate) patch.wedding_date = parsedIntent.weddingDate;
      if (parsedIntent.venueName) patch.venue_name = parsedIntent.venueName;
      if (parsedIntent.venueAddress) patch.venue_address = parsedIntent.venueAddress;
      if (parsedIntent.totalBudget !== undefined) patch.total_budget = parsedIntent.totalBudget;

      const updated = await weddingApi.update(weddingId, patch);
      window.dispatchEvent(new CustomEvent("everweb:wedding-updated", { detail: { wedding: updated } }));
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã cập nhật hồ sơ đám cưới",
          detail: "Thông tin đám cưới đã được lưu trực tiếp lên hệ thống.",
          actionType: "UPDATE_WEDDING_INFO",
        },
      };
    }

    case "SET_INVITATION_TEMPLATE": {
      const tpl = String(parsedIntent.templateId || "N01").toUpperCase();
      const nextStationery = {
        ...(currentFeatures?.stationery_config || {}),
        selectedTemplateId: tpl,
        templateId: tpl,
      };
      await weddingApi.updateFeatureSection(weddingId, "stationery_config", nextStationery);
      window.dispatchEvent(
        new CustomEvent("everweb:feature-updated", {
          detail: { section: "stationery_config", data: nextStationery },
        })
      );
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã đổi mẫu thiệp điện tử",
          detail: `Đã áp dụng mẫu thiệp **${tpl}** cho trang thiệp mời của bạn.`,
          actionType: "SET_INVITATION_TEMPLATE",
        },
      };
    }

    case "ADD_SCHEDULE_ITEM": {
      const existingSchedule = Array.isArray(currentFeatures?.website_config?.scheduleItems)
        ? currentFeatures.website_config.scheduleItems
        : [];
      const nextSchedule = [
        ...existingSchedule,
        {
          id: `sch-${Date.now()}`,
          time: parsedIntent.time || "18:00",
          title: parsedIntent.title || "Sự kiện mới",
          location: parsedIntent.location || "",
        },
      ];
      await weddingApi.updateFeatureSection(weddingId, "website_config", { scheduleItems: nextSchedule });
      window.dispatchEvent(
        new CustomEvent("everweb:feature-updated", {
          detail: { section: "website_config", data: { scheduleItems: nextSchedule } },
        })
      );
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã thêm lịch trình",
          detail: `Đã thêm mốc **${parsedIntent.time} - ${parsedIntent.title}** vào website cưới.`,
          actionType: "ADD_SCHEDULE_ITEM",
        },
      };
    }

    case "SEND_EMAIL": {
      const recipientsRaw = String(parsedIntent.recipients || "").trim();
      const payload = {
        subject: parsedIntent.subject || `Thư mời cưới từ ${wedding?.title || "EverWed"}`,
        body: parsedIntent.body || "Trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình.",
        ...(recipientsRaw && recipientsRaw.toUpperCase() !== "ALL"
          ? { recipients: recipientsRaw }
          : {}),
      };
      const result = await weddingApi.sendEmail(weddingId, payload);
      return {
        handled: true,
        success: true,
        actionResult: {
          title: "Đã gửi email mời cưới",
          detail: `Đã gửi thành công tới **${result?.sentCount ?? 0} địa chỉ email**.`,
          actionType: "SEND_EMAIL",
        },
      };
    }

    default:
      return { handled: false };
  }

  // Lưu thay đổi sơ đồ bàn tiệc xuống DB & phát sự kiện đồng bộ Real-time
  if (weddingId) {
    try {
      await weddingApi.updateFeatureSection(weddingId, "website_config", { seatingTables: tables });
      await weddingApi.updateFeatureSection(weddingId, "collect_contacts", { guestList: guests });
    } catch (err) {
      console.warn("Lỗi lưu trực tiếp xuống DB từ AI Dispatcher:", err.message);
    }
  }

  window.dispatchEvent(
    new CustomEvent("everweb:feature-updated", {
      detail: { section: "website_config", data: { seatingTables: tables } },
    })
  );
  window.dispatchEvent(
    new CustomEvent("everweb:feature-updated", {
      detail: { section: "collect_contacts", data: { guestList: guests } },
    })
  );

  return {
    handled: true,
    success: true,
    actionResult,
    tables,
    guests,
  };
}

/**
 * Hàm tương thích ngược: chuẩn bị và thực thi ngay (nếu caller cũ không dùng bước xác nhận).
 */
export async function executeAiDirectAction({ wedding, userPrompt, aiResponseText }) {
  const pendingAction = prepareAiDirectAction({ userPrompt, aiResponseText });
  if (!pendingAction) return { handled: false };
  return executePreparedAiAction({ wedding, pendingAction });
}
