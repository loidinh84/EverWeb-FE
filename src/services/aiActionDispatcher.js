import weddingApi from "./weddingApi";

// Dữ liệu dự phòng mặc định đồng bộ với GuestListPage & SeatingChartPage
const DEFAULT_TABLES = [
  { id: "t1", name: "Bàn 1 · Nhà gái", capacity: 8, guests: ["Nguyễn Thị Lan Anh", "Phạm Thị Minh Thư", "Trần Thu Hà", "Mai Linh", "Ánh Kiều", "Bích Ngọc"] },
  { id: "t2", name: "Bàn 2 · Nhà trai", capacity: 8, guests: ["Trần Văn Minh Khoa", "Trần Quốc Bảo", "Lê Tuấn", "Phạm Nam", "Hoàng Khang", "Đức Toàn"] },
  { id: "t3", name: "Bàn 3 · Bạn đại học", capacity: 8, guests: ["Hải Nam", "Kim Liên", "Thanh Tùng", "Văn Anh", "Minh Phúc"] },
  { id: "t4", name: "Bàn 4 · Đồng nghiệp", capacity: 8, guests: ["Đình Long", "Cẩm Tú", "Nhật Quang", "Hồng Thắm"] },
  { id: "t5", name: "Bàn 5 · Họ hàng", capacity: 10, guests: ["Bác Văn", "Cô Mai", "Thanh Phong", "Lê Dũng", "Kim Ngân", "Hoàng Sơn"] },
  { id: "t6", name: "Bàn 6 · Khách vip gia đình", capacity: 8, guests: ["Ông Trần Xuân", "Bà Nguyễn Hương", "Bác Quang", "Cô Mỹ Trang"] },
];

const INITIAL_GUESTS = [
  { id: "g1", firstName: "Lan Anh", lastName: "Nguyễn Thị", side: "Nhà gái", phone: "0909 123 456", email: "lananh.nguyen@gmail.com", address: "Chung cư Richmond City, Q. Bình Thạnh, TP.HCM", rsvp: "Tham dự", companions: 1, tag: "Bạn đại học", tableId: "t1", tableName: "Bàn 1 · Nhà gái" },
  { id: "g2", firstName: "Minh Khoa", lastName: "Trần Văn", side: "Nhà trai", phone: "0912 345 678", email: "minhkhoa.tran@fpt.com", address: "45 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM", rsvp: "Tham dự", companions: 2, tag: "Đồng nghiệp", tableId: "t2", tableName: "Bàn 2 · Nhà trai" },
  { id: "g3", firstName: "Hùng", lastName: "Nguyễn Văn", side: "Nhà trai", phone: "0908 777 888", email: "hung.nv@vinamilk.com", address: "TP. Thủ Đức, TP.HCM", rsvp: "Từ chối", companions: 0, tag: "Đồng nghiệp", tableId: null, tableName: "Chưa xếp bàn" },
  { id: "g4", firstName: "Minh Thư", lastName: "Phạm Thị", side: "Nhà gái", phone: "0933 222 111", email: "thu.pham@gmail.com", address: "12 Võ Văn Tần, Q.3, TP.HCM", rsvp: "Chờ phản hồi", companions: 1, tag: "Phù dâu", tableId: "t1", tableName: "Bàn 1 · Nhà gái" },
  { id: "g5", firstName: "Hoàng Nam", lastName: "Lê", side: "Bạn bè", phone: "0977 555 444", email: "nam.le@techcombank.com.vn", address: "Khu Sunrise City, Q.7, TP.HCM", rsvp: "Chờ phản hồi", companions: 0, tag: "Phù rể", tableId: null, tableName: "Chưa xếp bàn" },
  { id: "g6", firstName: "Quốc Bảo", lastName: "Trần", side: "Nhà trai", phone: "0968 111 222", email: "bao.tran@gmail.com", address: "Quận 1, TP.HCM", rsvp: "Tham dự", companions: 1, tag: "Gia đình", tableId: "t2", tableName: "Bàn 2 · Nhà trai" },
  { id: "g7", firstName: "Thảo Vy", lastName: "Nguyễn", side: "Nhà gái", phone: "0918 333 444", email: "thaovy@gmail.com", address: "Quận Bình Thạnh, TP.HCM", rsvp: "Tham dự", companions: 0, tag: "Bạn cô dâu", tableId: null, tableName: "Chưa xếp bàn" },
];

function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

/**
 * Tìm khách mời khớp theo tên (hỗ trợ tên viết gọn hoặc đầy đủ)
 */
function matchGuest(nameQuery, guests = [], tables = []) {
  const q = normalize(nameQuery);
  if (!q) return null;

  // 1. Tìm trong guests
  let found = guests.find((g) => {
    const fullName = normalize(`${g.lastName} ${g.firstName}`);
    const shortName = normalize(g.firstName);
    return fullName.includes(q) || q.includes(fullName) || shortName === q || fullName.endsWith(q);
  });

  if (found) {
    return {
      id: found.id,
      fullName: `${found.lastName} ${found.firstName}`.trim(),
      raw: found,
    };
  }

  // 2. Tìm trong danh sách các bàn nếu khách chưa có trong guestList
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

/**
 * Tìm bàn tiệc khớp theo tên hoặc số bàn
 */
function matchTable(tableQuery, tables = []) {
  const q = normalize(tableQuery);
  if (!q) return null;

  // Tìm số trong chuỗi: vd "bàn 2", "2", "bàn số 2"
  const numMatch = q.match(/\d+/);
  const targetNum = numMatch ? numMatch[0] : null;

  let found = tables.find((t) => {
    const tNorm = normalize(t.name);
    if (targetNum && (tNorm.includes(`ban ${targetNum}`) || t.id === `t${targetNum}`)) {
      return true;
    }
    return tNorm.includes(q) || q.includes(tNorm);
  });

  return found || null;
}

/**
 * Phân tích và phát hiện lệnh điều khiển trực tiếp từ câu hỏi người dùng
 */
export function parseIntentFromUserPrompt(prompt = "") {
  const text = prompt.trim();
  const lower = normalize(text);

  // 1. Lệnh tự động xếp chỗ (Auto-seat)
  if (
    lower.includes("tu dong xep") ||
    lower.includes("tu xep cho") ||
    lower.includes("xep cho tu dong") ||
    lower.includes("chia ban tu dong") ||
    lower.includes("xep het khach vao ban")
  ) {
    return { type: "AUTO_SEAT" };
  }

  // 2. Lệnh chuyển khách: "chuyển [khách] sang [bàn]", "đổi bàn cho [khách] sang [bàn]"
  const moveRegex = /(?:chuyen|doi ban(?: cho)?|doi|doi sang|cho|mang)\s+(?:khach\s+)?(.+?)\s+(?:sang|qua|vao|den)\s+(.+)/i;
  const moveMatch = text.match(moveRegex);
  if (moveMatch) {
    return {
      type: "MOVE_GUEST",
      guestQuery: moveMatch[1].replace(/^(khach|ban|anh|chi|em)\s+/i, "").trim(),
      tableQuery: moveMatch[2].trim(),
    };
  }

  // 3. Lệnh xóa khách khỏi bàn: "xóa [khách] khỏi bàn", "bỏ [khách] ra khỏi bàn", "bỏ [khách] khỏi ghế"
  const removeRegex = /(?:xoa|bo|rut|loai)\s+(?:khach\s+)?(.+?)\s+(?:khoi|ra khoi)\s+(?:ban|ghe|so do)/i;
  const removeMatch = text.match(removeRegex);
  if (removeMatch) {
    return {
      type: "REMOVE_GUEST",
      guestQuery: removeMatch[1].replace(/^(khach|ban|anh|chi|em)\s+/i, "").trim(),
    };
  }

  // 4. Lệnh xếp khách vào bàn: "xếp [khách] vào [bàn]", "gán [khách] vào [bàn]"
  const assignRegex = /(?:xep|gan|dat|cho)\s+(?:khach\s+)?(.+?)\s+(?:vao|ngoi|tai)\s+(.+)/i;
  const assignMatch = text.match(assignRegex);
  if (assignMatch) {
    return {
      type: "ASSIGN_GUEST",
      guestQuery: assignMatch[1].replace(/^(khach|ban|anh|chi|em)\s+/i, "").trim(),
      tableQuery: assignMatch[2].trim(),
    };
  }

  // 5. Lệnh thêm bàn mới: "thêm bàn [mới] [tên]", "tạo bàn [tên]"
  const addTableRegex = /(?:them|tao)\s+ban(?:\s+moi)?(?:\s+ten\s+la)?\s+(.+)/i;
  const addTableMatch = text.match(addTableRegex);
  if (addTableMatch) {
    const rawName = addTableMatch[1];
    // Tìm số ghế nếu có: vd "10 ghế", "12 chỗ"
    const capMatch = rawName.match(/(\d+)\s*(?:ghe|cho|nguoi)/i);
    const capacity = capMatch ? Number(capMatch[1]) : 8;
    const cleanedName = rawName.replace(/(\d+)\s*(?:ghe|cho|nguoi)/i, "").replace(/co\s+/i, "").trim();

    return {
      type: "ADD_TABLE",
      name: cleanedName.startsWith("Bàn") || cleanedName.startsWith("bàn") ? cleanedName : `Bàn ${cleanedName}`,
      capacity: Math.max(4, Math.min(20, capacity)),
    };
  }

  // 6. Lệnh xóa bàn: "xóa bàn [tên/số]", "hủy bàn [tên/số]"
  const deleteTableRegex = /(?:xoa|huy|bo)\s+ban\s+(.+)/i;
  const deleteTableMatch = text.match(deleteTableRegex);
  if (deleteTableMatch) {
    return {
      type: "DELETE_TABLE",
      tableQuery: deleteTableMatch[1].trim(),
    };
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

  const paramRegex = /(\w+)="([^"]+)"|(\w+)=(\d+)/g;
  let pMatch;
  while ((pMatch = paramRegex.exec(paramsStr)) !== null) {
    const key = pMatch[1] || pMatch[3];
    const val = pMatch[2] !== undefined ? pMatch[2] : Number(pMatch[4]);
    params[key] = val;
  }

  return { type, ...params };
}

/**
 * Thực thi Lệnh điều khiển Trực tiếp trên Cơ sở Dữ liệu & UI
 */
export async function executeAiDirectAction({ wedding, userPrompt, aiResponseText }) {
  // Ưu tiên 1: Lệnh từ AI Response [ACTION: ...]
  // Ưu tiên 2: Phân tích trực tiếp từ câu hỏi của người dùng
  const parsedIntent = parseActionTagFromAiResponse(aiResponseText) || parseIntentFromUserPrompt(userPrompt);

  if (!parsedIntent) {
    return { handled: false };
  }

  const weddingId = wedding?.id;

  // Lấy dữ liệu hiện tại
  let currentFeatures = {};
  if (weddingId) {
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

  // -------------------------------------------------------------
  // THỰC THI HÀNH ĐỘNG CỤ THỂ
  // -------------------------------------------------------------
  switch (parsedIntent.type) {
    case "MOVE_GUEST":
    case "ASSIGN_GUEST": {
      const gQuery = parsedIntent.guest || parsedIntent.guestQuery;
      const tQuery = parsedIntent.toTable || parsedIntent.tableQuery;

      const matchedG = matchGuest(gQuery, guests, tables);
      if (!matchedG) {
        return {
          handled: true,
          success: false,
          message: `Không tìm thấy khách mời nào có tên "${gQuery}" trong danh sách cưới.`,
        };
      }

      const matchedT = matchTable(tQuery, tables);
      if (!matchedT) {
        return {
          handled: true,
          success: false,
          message: `Không tìm thấy bàn tiệc phù hợp với yêu cầu "${tQuery}".`,
        };
      }

      // Xóa khỏi bàn cũ trong tables
      let nextTables = tables.map((t) => ({
        ...t,
        guests: t.guests.filter((name) => name !== matchedG.fullName),
      }));

      // Thêm vào bàn mới
      nextTables = nextTables.map((t) => {
        if (t.id === matchedT.id) {
          if (t.guests.length >= t.capacity) {
            return t; // Hết chỗ
          }
          return { ...t, guests: [...t.guests, matchedG.fullName] };
        }
        return t;
      });

      // Cập nhật trong guestList
      const nextGuests = guests.map((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        if (fName === matchedG.fullName || g.id === matchedG.id) {
          return { ...g, tableId: matchedT.id, tableName: matchedT.name };
        }
        return g;
      });

      tables = nextTables;
      guests = nextGuests;

      actionResult = {
        title: "Đã chuyển bàn tiệc thành công",
        detail: `Khách **${matchedG.fullName}** đã được chuyển sang **${matchedT.name}**.`,
        actionType: "MOVE_GUEST",
      };
      break;
    }

    case "REMOVE_GUEST": {
      const gQuery = parsedIntent.guest || parsedIntent.guestQuery;
      const matchedG = matchGuest(gQuery, guests, tables);

      if (!matchedG) {
        return {
          handled: true,
          success: false,
          message: `Không tìm thấy khách mời "${gQuery}" trong các bàn tiệc.`,
        };
      }

      // Xóa khỏi tất cả bàn trong tables
      tables = tables.map((t) => ({
        ...t,
        guests: t.guests.filter((name) => name !== matchedG.fullName),
      }));

      // Cập nhật guestList về null
      guests = guests.map((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        if (fName === matchedG.fullName || g.id === matchedG.id) {
          return { ...g, tableId: null, tableName: "Chưa xếp bàn" };
        }
        return g;
      });

      actionResult = {
        title: "Đã xóa khách khỏi bàn",
        detail: `Khách **${matchedG.fullName}** đã được rút khỏi bàn và đưa về danh sách *Khách chưa xếp bàn*.`,
        actionType: "REMOVE_GUEST",
      };
      break;
    }

    case "AUTO_SEAT": {
      // Tìm khách chưa xếp bàn có RSVP Tham dự
      const seatedSet = new Set(tables.flatMap((t) => t.guests.filter(Boolean)));
      const unseated = guests.filter((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        return g.rsvp === "Tham dự" && !seatedSet.has(fName) && !g.tableId;
      });

      if (unseated.length === 0) {
        actionResult = {
          title: "Tất cả đã có chỗ",
          detail: "Không còn khách tham dự nào đang chờ xếp bàn.",
          actionType: "AUTO_SEAT",
        };
        break;
      }

      let count = 0;
      let nextTables = tables.map((t) => ({ ...t, guests: [...t.guests] }));
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
      guests = guests.map((g) => {
        if (updatedGuestMap.has(g.id)) {
          return { ...g, ...updatedGuestMap.get(g.id) };
        }
        return g;
      });

      actionResult = {
        title: "Tự động xếp chỗ thành công",
        detail: `Đã tự động xếp **${count} khách mời** vào các bàn tiệc còn ghế trống.`,
        actionType: "AUTO_SEAT",
      };
      break;
    }

    case "ADD_TABLE": {
      const name = parsedIntent.name || "Bàn tiệc mới";
      const capacity = Number(parsedIntent.capacity) || 8;
      const newTable = {
        id: `t-${Date.now()}`,
        name,
        capacity,
        guests: [],
      };

      tables = [...tables, newTable];

      actionResult = {
        title: "Đã tạo bàn tiệc mới",
        detail: `Đã thêm **${name}** (sức chứa ${capacity} ghế) vào sảnh tiệc.`,
        actionType: "ADD_TABLE",
      };
      break;
    }

    case "DELETE_TABLE": {
      const tQuery = parsedIntent.name || parsedIntent.tableQuery;
      const matchedT = matchTable(tQuery, tables);

      if (!matchedT) {
        return {
          handled: true,
          success: false,
          message: `Không tìm thấy bàn tiệc "${tQuery}" để xóa.`,
        };
      }

      // Rút tất cả khách trong bàn này về chưa xếp bàn
      const guestsInTable = new Set(matchedT.guests || []);
      guests = guests.map((g) => {
        const fName = `${g.lastName} ${g.firstName}`.trim();
        if (g.tableId === matchedT.id || guestsInTable.has(fName)) {
          return { ...g, tableId: null, tableName: "Chưa xếp bàn" };
        }
        return g;
      });

      tables = tables.filter((t) => t.id !== matchedT.id);

      actionResult = {
        title: "Đã xóa bàn tiệc",
        detail: `Đã xóa bàn **${matchedT.name}**. Các khách trong bàn đã được đưa về danh sách chờ.`,
        actionType: "DELETE_TABLE",
      };
      break;
    }

    default:
      return { handled: false };
  }

  // -------------------------------------------------------------
  // LƯU CSDL NEON DB & BẮN EVENT ĐỒNG BỘ THỜI GIAN THỰC CHO GIAO DIỆN
  // -------------------------------------------------------------
  if (weddingId) {
    try {
      await weddingApi.updateFeatureSection(weddingId, "website_config", {
        seatingTables: tables,
      });
      await weddingApi.updateFeatureSection(weddingId, "collect_contacts", {
        guestList: guests,
      });
    } catch (err) {
      console.warn("Lỗi lưu trực tiếp xuống DB từ AI Dispatcher:", err.message);
    }
  }

  // Phát tín hiệu đồng bộ hóa Real-time cho React Component
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
