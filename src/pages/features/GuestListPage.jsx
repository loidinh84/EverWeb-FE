import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  FileSpreadsheet,
  Mail,
  Map,
  Plus,
  Search,
  Share2,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import {
  createGuest,
  deleteGuest,
  getGuests,
  updateGuest,
} from "../../services/guestApi";
import { extractApiError } from "../../services/api";
import {
  downloadSampleGuestsExcel,
  parseGuestsExcelFile,
} from "../../utils/guestExcel";

function mapDbRsvpToUi(status) {
  if (status === "attending" || status === "accepted") return "Tham dự";
  if (status === "declined") return "Từ chối";
  return "Chờ phản hồi";
}

function mapUiRsvpToDb(rsvp) {
  if (rsvp === "Tham dự") return "accepted";
  if (rsvp === "Từ chối") return "declined";
  return "pending";
}

function splitFullName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { lastName: "", firstName: parts[0] || "" };
  }
  return {
    lastName: parts.slice(0, -1).join(" "),
    firstName: parts[parts.length - 1],
  };
}

const INITIAL_GUESTS = [
  {
    id: "g1",
    firstName: "Lan Anh",
    lastName: "Nguyễn Thị",
    side: "Nhà gái",
    phone: "0909 123 456",
    email: "lananh.nguyen@gmail.com",
    address: "Chung cư Richmond City, Q. Bình Thạnh, TP.HCM",
    rsvp: "Tham dự",
    companions: 1,
    tag: "Bạn đại học",
    tableId: "t1",
    tableName: "Bàn 1 · Nhà gái",
  },
  {
    id: "g2",
    firstName: "Minh Khoa",
    lastName: "Trần Văn",
    side: "Nhà trai",
    phone: "0912 345 678",
    email: "minhkhoa.tran@fpt.com",
    address: "45 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM",
    rsvp: "Tham dự",
    companions: 2,
    tag: "Đồng nghiệp",
    tableId: "t2",
    tableName: "Bàn 2 · Nhà trai",
  },
  {
    id: "g3",
    firstName: "Hùng",
    lastName: "Nguyễn Văn",
    side: "Nhà trai",
    phone: "0908 777 888",
    email: "hung.nv@vinamilk.com",
    address: "TP. Thủ Đức, TP.HCM",
    rsvp: "Từ chối",
    companions: 0,
    tag: "Đồng nghiệp",
    tableId: null,
    tableName: "Chưa xếp bàn",
  },
  {
    id: "g4",
    firstName: "Minh Thư",
    lastName: "Phạm Thị",
    side: "Nhà gái",
    phone: "0933 222 111",
    email: "thu.pham@gmail.com",
    address: "12 Võ Văn Tần, Q.3, TP.HCM",
    rsvp: "Chờ phản hồi",
    companions: 1,
    tag: "Phù dâu",
    tableId: "t1",
    tableName: "Bàn 1 · Nhà gái",
  },
  {
    id: "g5",
    firstName: "Hoàng Nam",
    lastName: "Lê",
    side: "Bạn bè",
    phone: "0977 555 444",
    email: "nam.le@techcombank.com.vn",
    address: "Khu Sunrise City, Q.7, TP.HCM",
    rsvp: "Chờ phản hồi",
    companions: 0,
    tag: "Phù rể",
    tableId: null,
    tableName: "Chưa xếp bàn",
  },
  {
    id: "g6",
    firstName: "Quốc Bảo",
    lastName: "Trần",
    side: "Nhà trai",
    phone: "0968 111 222",
    email: "bao.tran@gmail.com",
    address: "Quận 1, TP.HCM",
    rsvp: "Tham dự",
    companions: 1,
    tag: "Gia đình",
    tableId: "t2",
    tableName: "Bàn 2 · Nhà trai",
  },
  {
    id: "g7",
    firstName: "Thảo Vy",
    lastName: "Nguyễn",
    side: "Nhà gái",
    phone: "0918 333 444",
    email: "thaovy@gmail.com",
    address: "Quận Bình Thạnh, TP.HCM",
    rsvp: "Tham dự",
    companions: 0,
    tag: "Bạn cô dâu",
    tableId: null,
    tableName: "Chưa xếp bàn",
  },
];

const DEFAULT_TABLES = [
  { id: "t1", name: "Bàn 1 · Nhà gái", capacity: 8, guests: ["Nguyễn Thị Lan Anh", "Phạm Thị Minh Thư", "Trần Thu Hà", "Mai Linh", "Ánh Kiều", "Bích Ngọc"] },
  { id: "t2", name: "Bàn 2 · Nhà trai", capacity: 8, guests: ["Trần Văn Minh Khoa", "Trần Quốc Bảo", "Lê Tuấn", "Phạm Nam", "Hoàng Khang", "Đức Toàn"] },
  { id: "t3", name: "Bàn 3 · Bạn đại học", capacity: 8, guests: ["Hải Nam", "Kim Liên", "Thanh Tùng", "Văn Anh", "Minh Phúc"] },
  { id: "t4", name: "Bàn 4 · Đồng nghiệp", capacity: 8, guests: ["Đình Long", "Cẩm Tú", "Nhật Quang", "Hồng Thắm"] },
  { id: "t5", name: "Bàn 5 · Họ hàng xa", capacity: 10, guests: ["Bác Văn", "Cô Mai", "Thanh Phong", "Lê Dũng", "Kim Ngân", "Hoàng Sơn"] },
  { id: "t6", name: "Bàn 6 · Bàn VIP gia đình", capacity: 8, guests: ["Ông Trần Xuân", "Bà Nguyễn Hương", "Bác Quang", "Cô Mỹ Trang"] },
];

const RSVP_BADGE = {
  "Tham dự": "bg-emerald-50 text-emerald-700",
  "Từ chối": "bg-stone-100 text-stone-600",
  "Chờ phản hồi": "bg-amber-50 text-amber-800",
};

export default function GuestListPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  // 1. Metadata bổ sung & bàn tiệc từ feature configs
  const { data: ccData, saveSection: saveGuestData } = useWeddingFeature(
    wedding,
    "collect_contacts",
    {
      guestList: [],
      guestMetaById: {},
    }
  );

  // 2. Quản lý sơ đồ bàn tiệc từ feature "website_config"
  const { data: webConfig, saveSection: saveSeatingData } = useWeddingFeature(
    wedding,
    "website_config",
    {
      seatingTables: DEFAULT_TABLES,
    }
  );

  // 3. Tải danh sách khách mời THẬT từ bảng `guests` trên Neon PostgreSQL
  const [dbGuests, setDbGuests] = useState(null);
  const [isSavingGuest, setIsSavingGuest] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importRows, setImportRows] = useState([]);
  const [importFileName, setImportFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (!wedding?.id) return;
    let cancelled = false;
    getGuests(wedding.id)
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) {
          setDbGuests(rows);
        }
      })
      .catch(() => {
        if (!cancelled) setDbGuests(null);
      });
    return () => {
      cancelled = true;
    };
  }, [wedding?.id]);

  const guestMetaById = useMemo(
    () => ccData.guestMetaById || {},
    [ccData.guestMetaById]
  );

  const guests = useMemo(() => {
    if (wedding?.id && Array.isArray(dbGuests)) {
      return dbGuests.map((row) => {
        const meta = guestMetaById[row.id] || {};
        const { lastName, firstName } = splitFullName(row.full_name);
        return {
          id: row.id,
          lastName: meta.lastName ?? lastName,
          firstName: meta.firstName ?? firstName,
          side: meta.side || (row.group?.side === "bride" ? "Nhà gái" : "Nhà trai"),
          phone: row.phone || "",
          email: row.email || "",
          address: meta.address || "",
          rsvp: mapDbRsvpToUi(row.rsvp_status),
          companions: Number(row.max_companions) || 0,
          tag: meta.tag || row.group?.name || "Bạn bè",
          tableId: meta.tableId || "",
          tableName: meta.tableName || "Chưa xếp bàn",
          inviteToken: row.invite_token || "",
        };
      });
    }
    if (Array.isArray(ccData.guestList) && ccData.guestList.length > 0) {
      return ccData.guestList;
    }
    return wedding?.id ? [] : INITIAL_GUESTS;
  }, [dbGuests, guestMetaById, ccData.guestList, wedding?.id]);

  const tables = useMemo(
    () => (Array.isArray(webConfig.seatingTables) && webConfig.seatingTables.length > 0 ? webConfig.seatingTables : DEFAULT_TABLES),
    [webConfig.seatingTables]
  );

  // State
  const [search, setSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("Tất cả");
  const [sideFilter, setSideFilter] = useState("Tất cả");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [guestForm, setGuestForm] = useState({
    lastName: "",
    firstName: "",
    side: "Nhà trai",
    phone: "",
    email: "",
    address: "",
    rsvp: "Tham dự",
    companions: 0,
    tag: "Bạn bè",
    tableId: "",
  });

  // Metrics
  const attendingGuests = useMemo(() => guests.filter((g) => g.rsvp === "Tham dự"), [guests]);
  const declinedGuests = useMemo(() => guests.filter((g) => g.rsvp === "Từ chối"), [guests]);
  const awaitingGuests = useMemo(() => guests.filter((g) => g.rsvp === "Chờ phản hồi"), [guests]);
  const responseRate = Math.round(((attendingGuests.length + declinedGuests.length) / Math.max(1, guests.length)) * 100);

  // Filtered guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        search === "" ||
        `${g.lastName} ${g.firstName}`.toLowerCase().includes(search.toLowerCase()) ||
        (g.phone && g.phone.includes(search)) ||
        (g.email && g.email.toLowerCase().includes(search.toLowerCase()));

      const matchRsvp = rsvpFilter === "Tất cả" || g.rsvp === rsvpFilter;
      const matchSide = sideFilter === "Tất cả" || g.side === sideFilter;

      return matchSearch && matchRsvp && matchSide;
    });
  }, [guests, search, rsvpFilter, sideFilter]);

  // Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredGuests.map((g) => g.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!guestForm.firstName.trim()) {
      toast.error("Vui lòng nhập tên khách mời");
      return;
    }

    const assignedTable = tables.find((t) => t.id === guestForm.tableId);
    const fullName = `${guestForm.lastName} ${guestForm.firstName}`.trim();
    const companionsCount = Number(guestForm.companions) || 0;

    if (wedding?.id && Array.isArray(dbGuests)) {
      try {
        setIsSavingGuest(true);
        const created = await createGuest({
          wedding_id: wedding.id,
          full_name: fullName,
          phone: guestForm.phone.trim() || null,
          email: guestForm.email.trim() || null,
          max_companions: companionsCount,
        });

        let finalRow = created;
        const dbStatus = mapUiRsvpToDb(guestForm.rsvp);
        if (created?.id && dbStatus !== "pending") {
          finalRow = await updateGuest(created.id, { rsvp_status: dbStatus });
        }

        if (finalRow?.id) {
          setDbGuests((prev) => [finalRow, ...(Array.isArray(prev) ? prev : [])]);
          saveGuestData({
            guestMetaById: {
              ...guestMetaById,
              [finalRow.id]: {
                lastName: guestForm.lastName.trim(),
                firstName: guestForm.firstName.trim(),
                side: guestForm.side,
                address: guestForm.address.trim(),
                tag: guestForm.tag,
                tableId: guestForm.tableId || "",
                tableName: assignedTable ? assignedTable.name : "Chưa xếp bàn",
              },
            },
          });
        }
      } catch (err) {
        toast.error(extractApiError(err, "Không thể lưu khách mời vào CSDL."));
        setIsSavingGuest(false);
        return;
      } finally {
        setIsSavingGuest(false);
      }
    } else {
      const newG = {
        id: `g-${Date.now()}`,
        ...guestForm,
        companions: companionsCount,
        tableName: assignedTable ? assignedTable.name : "Chưa xếp bàn",
      };
      saveGuestData({ guestList: [newG, ...guests] });
    }

    if (assignedTable) {
      const nextTables = tables.map((t) =>
        t.id === assignedTable.id && t.guests.length < t.capacity ? { ...t, guests: [...t.guests, fullName] } : t
      );
      saveSeatingData({ seatingTables: nextTables });
    }

    toast.success("Đã lưu khách mời vào Neon Database thành công!");
    setGuestForm({
      lastName: "",
      firstName: "",
      side: "Nhà trai",
      phone: "",
      email: "",
      address: "",
      rsvp: "Tham dự",
      companions: 0,
      tag: "Bạn bè",
      tableId: "",
    });
    setIsAddGuestOpen(false);
  };

  const handleDeleteGuest = async (id) => {
    const target = guests.find((g) => g.id === id);
    if (wedding?.id && Array.isArray(dbGuests)) {
      try {
        await deleteGuest(id);
        setDbGuests((prev) => (Array.isArray(prev) ? prev.filter((g) => g.id !== id) : prev));
        const nextMeta = { ...guestMetaById };
        delete nextMeta[id];
        saveGuestData({ guestMetaById: nextMeta });
      } catch (err) {
        toast.error(extractApiError(err, "Không thể xóa khách mời."));
        return;
      }
    } else {
      const nextGuests = guests.filter((g) => g.id !== id);
      saveGuestData({ guestList: nextGuests });
    }

    if (target) {
      const fullName = `${target.lastName} ${target.firstName}`.trim();
      const nextTables = tables.map((t) => ({
        ...t,
        guests: t.guests.filter((name) => name !== fullName),
      }));
      saveSeatingData({ seatingTables: nextTables });
    }
    toast.info("Đã xóa khách mời khỏi danh sách");
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (wedding?.id && Array.isArray(dbGuests)) {
      try {
        await Promise.all(selectedIds.map((id) => deleteGuest(id)));
        setDbGuests((prev) =>
          Array.isArray(prev) ? prev.filter((g) => !selectedIds.includes(g.id)) : prev
        );
        const nextMeta = { ...guestMetaById };
        selectedIds.forEach((id) => delete nextMeta[id]);
        saveGuestData({ guestMetaById: nextMeta });
      } catch (err) {
        toast.error(extractApiError(err, "Không thể xóa hàng loạt khách mời."));
        return;
      }
    } else {
      const nextGuests = guests.filter((g) => !selectedIds.includes(g.id));
      saveGuestData({ guestList: nextGuests });
    }
    setSelectedIds([]);
    toast.info(`Đã xóa ${count} khách mời đã chọn`);
  };

  const handleBatchAssignTable = (targetTableId) => {
    if (selectedIds.length === 0) return;
    const targetTable = tables.find((t) => t.id === targetTableId);
    const tableName = targetTable ? targetTable.name : "Chưa xếp bàn";

    if (wedding?.id && Array.isArray(dbGuests)) {
      const nextMeta = { ...guestMetaById };
      selectedIds.forEach((id) => {
        nextMeta[id] = {
          ...(nextMeta[id] || {}),
          tableId: targetTableId || "",
          tableName,
        };
      });
      saveGuestData({ guestMetaById: nextMeta });
    } else {
      const nextGuests = guests.map((g) =>
        selectedIds.includes(g.id)
          ? { ...g, tableId: targetTableId || null, tableName }
          : g
      );
      saveGuestData({ guestList: nextGuests });
    }
    setSelectedIds([]);
    toast.success(`Đã cập nhật bàn cho ${selectedIds.length} khách mời`);
  };

  const handleUpdateGuestTable = (guestId, newTableId) => {
    const targetTable = tables.find((t) => t.id === newTableId);
    const targetGuest = guests.find((g) => g.id === guestId);
    if (!targetGuest) return;

    const fullName = `${targetGuest.lastName} ${targetGuest.firstName}`.trim();
    const tableName = targetTable ? targetTable.name : "Chưa xếp bàn";

    if (wedding?.id && Array.isArray(dbGuests)) {
      saveGuestData({
        guestMetaById: {
          ...guestMetaById,
          [guestId]: {
            ...(guestMetaById[guestId] || {}),
            tableId: newTableId || "",
            tableName,
          },
        },
      });
    } else {
      const nextGuests = guests.map((g) =>
        g.id === guestId
          ? { ...g, tableId: newTableId || null, tableName }
          : g
      );
      saveGuestData({ guestList: nextGuests });
    }

    // Cập nhật lại trong tables
    const nextTables = tables.map((t) => {
      // Bỏ khỏi bàn cũ
      const withoutGuest = t.guests.filter((n) => n !== fullName);
      // Thêm vào bàn mới nếu trúng
      if (t.id === newTableId && withoutGuest.length < t.capacity) {
        return { ...t, guests: [...withoutGuest, fullName] };
      }
      return { ...t, guests: withoutGuest };
    });
    saveSeatingData({ seatingTables: nextTables });

    toast.success(targetTable ? `Đã chuyển ${fullName} vào ${targetTable.name}` : `Đã chuyển ${fullName} về Chưa xếp bàn`);
  };

  const handleExportCsv = () => {
    const header = "Họ và tên lót,Tên,Phía gia đình,Số điện thoại,Email,Địa chỉ,Xác nhận RSVP,Người đi cùng,Phân loại,Bàn tiệc\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.lastName}","${g.firstName}","${g.side}","${g.phone}","${g.email}","${g.address || ""}","${g.rsvp}","${g.companions}","${g.tag}","${g.tableName || ""}"`
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${header}${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "danh-sach-khach-moi.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất file CSV danh sách khách mời");
  };

  const handleExcelFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = await parseGuestsExcelFile(file);
      if (parsed.length === 0) {
        toast.error("Không tìm thấy dữ liệu khách mời hợp lệ trong file Excel.");
        return;
      }
      setImportFileName(file.name);
      setImportRows(parsed);
      toast.success(`Đã đọc ${parsed.length} khách từ file "${file.name}".`);
    } catch (err) {
      console.error(err);
      toast.error("Không thể đọc file Excel. Vui lòng dùng đúng định dạng .xlsx, .xls hoặc .csv.");
    }
  };

  const handleConfirmImport = async () => {
    if (importRows.length === 0) return;
    setIsImporting(true);

    try {
      if (wedding?.id && Array.isArray(dbGuests)) {
        const createdRows = [];
        const nextMeta = { ...guestMetaById };
        let failedCount = 0;

        for (const item of importRows) {
          try {
            const created = await createGuest({
              wedding_id: wedding.id,
              full_name: item.fullName,
              phone: item.phone || null,
              email: item.email || null,
              max_companions: item.companions || 0,
            });
            let finalRow = created;
            const dbStatus = mapUiRsvpToDb(item.rsvp);
            if (created?.id && dbStatus !== "pending") {
              try {
                finalRow = await updateGuest(created.id, { rsvp_status: dbStatus });
              } catch {
                // Giữ nguyên bản ghi đã tạo nếu cập nhật RSVP phụ gặp lỗi
              }
            }
            if (finalRow?.id) {
              createdRows.push(finalRow);
              nextMeta[finalRow.id] = {
                lastName: item.lastName,
                firstName: item.firstName,
                side: item.side,
                address: item.address,
                tag: item.tag,
                tableId: "",
                tableName: "Chưa xếp bàn",
              };
            }
          } catch {
            failedCount += 1;
          }
        }

        if (createdRows.length > 0) {
          saveGuestData({ guestMetaById: nextMeta });
        }
        const refreshed = await getGuests(wedding.id).catch(() => null);
        if (Array.isArray(refreshed)) {
          setDbGuests(refreshed);
        } else if (createdRows.length > 0) {
          setDbGuests((prev) => [...createdRows, ...(Array.isArray(prev) ? prev : [])]);
        }

        if (failedCount > 0) {
          toast.info(`Đã nhập ${createdRows.length} khách vào Neon (${failedCount} dòng bỏ qua do trùng hoặc sai định dạng SĐT/Email).`);
        } else {
          toast.success(`Đã nhập thành công ${createdRows.length} khách mời vào Neon Database!`);
        }
      } else {
        const mappedLocal = importRows.map((item, idx) => ({
          id: `g-imp-${Date.now()}-${idx}`,
          lastName: item.lastName,
          firstName: item.firstName,
          side: item.side,
          phone: item.phone,
          email: item.email,
          address: item.address,
          rsvp: item.rsvp,
          companions: item.companions,
          tag: item.tag,
          tableId: "",
          tableName: "Chưa xếp bàn",
        }));
        saveGuestData({ guestList: [...mappedLocal, ...guests] });
        toast.success(`Đã nhập ${mappedLocal.length} khách mời!`);
      }

      setIsImportModalOpen(false);
      setImportRows([]);
      setImportFileName("");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <FeatureShell
      title="Danh sách khách mời"
      subtitle={`Tổng cộng ${guests.length} khách mời · ${attendingGuests.length} khách xác nhận tham dự`}
      badgeText="Khách mời"
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.MESSAGING)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-[#1F1A17] hover:bg-stone-50 transition cursor-pointer"
          >
            <Mail size={13} /> Gửi tin nhắn & Email →
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.SEATING_CHART)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-[#1F1A17] hover:bg-stone-50 transition cursor-pointer"
          >
            <Map size={13} /> Sơ đồ bàn tiệc →
          </button>
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
          >
            <FileSpreadsheet size={13} /> Nhập Excel
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-[#3B52DE] transition cursor-pointer"
          >
            <Download size={13} /> Xuất CSV
          </button>
          <button
            type="button"
            onClick={() => setIsAddGuestOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus size={14} /> Thêm khách mời
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* =========================================================================
            1. THẺ CHỈ SỐ TỔNG QUAN
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 block">Tổng số khách</span>
            <span className="text-2xl font-bold text-[#1F1A17] tabular-nums mt-1 block">{guests.length}</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">Khách trong danh sách</span>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-emerald-700 block">Tham dự chính thức</span>
            <span className="text-2xl font-bold text-emerald-700 tabular-nums mt-1 block">{attendingGuests.length}</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">Đã xác nhận có mặt</span>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-amber-700 block">Chờ phản hồi</span>
            <span className="text-2xl font-bold text-amber-700 tabular-nums mt-1 block">{awaitingGuests.length}</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">Chưa gửi phản hồi</span>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 block">Bận không dự</span>
            <span className="text-2xl font-bold text-stone-700 tabular-nums mt-1 block">{declinedGuests.length}</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">Đã gửi lời chúc</span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 block">Tỷ lệ phản hồi</span>
            <span className="text-2xl font-bold text-[#1F1A17] tabular-nums mt-1 block">{responseRate}%</span>
            <div className="h-1.5 w-full bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#1F1A17] rounded-full" style={{ width: `${responseRate}%` }} />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. THANH BỘ LỌC & TÌM KIẾM
           ========================================================================= */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên khách, số điện thoại, email..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 pl-9 pr-3.5 py-2 text-xs text-[#1F1A17] placeholder:text-stone-400 outline-none focus:border-[#3B52DE] focus:bg-white transition"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2">
              <select
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 outline-none focus:border-[#3B52DE]"
              >
                <option value="Tất cả">Trạng thái RSVP: Tất cả</option>
                <option value="Tham dự">Tham dự</option>
                <option value="Chờ phản hồi">Chờ phản hồi</option>
                <option value="Từ chối">Từ chối</option>
              </select>

              <select
                value={sideFilter}
                onChange={(e) => setSideFilter(e.target.value)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 outline-none focus:border-[#3B52DE]"
              >
                <option value="Tất cả">Phía gia đình: Tất cả</option>
                <option value="Nhà trai">Nhà trai</option>
                <option value="Nhà gái">Nhà gái</option>
                <option value="Bạn bè">Bạn bè</option>
              </select>
            </div>
          </div>

          {/* Hàng thao tác hàng loạt (Batch Actions) */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-stone-100/90 px-3.5 py-2 text-xs">
              <span className="font-semibold text-[#1F1A17]">Đã chọn {selectedIds.length} khách mời</span>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) handleBatchAssignTable(e.target.value);
                  }}
                  defaultValue=""
                  className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700"
                >
                  <option value="" disabled>
                    Gán vào bàn...
                  </option>
                  <option value="">Chưa xếp bàn</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleBatchDelete}
                  className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                >
                  <Trash2 size={12} /> Xóa đã chọn
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            3. BẢNG DANH SÁCH KHÁCH MỜI
           ========================================================================= */}
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-500">
                <tr>
                  <th className="py-3.5 pl-4 pr-2 w-8">
                    <input
                      type="checkbox"
                      checked={filteredGuests.length > 0 && selectedIds.length === filteredGuests.length}
                      onChange={handleSelectAll}
                      className="rounded border-stone-300 text-[#1F1A17] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3">Họ và tên</th>
                  <th className="py-3.5 px-3">Bên gia đình</th>
                  <th className="py-3.5 px-3">Liên hệ</th>
                  <th className="py-3.5 px-3 text-center">Đi cùng</th>
                  <th className="py-3.5 px-3">Phân loại</th>
                  <th className="py-3.5 px-3">Bàn tiệc</th>
                  <th className="py-3.5 px-3">Trạng thái RSVP</th>
                  <th className="py-3.5 pl-3 pr-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((g) => {
                  const isChecked = selectedIds.includes(g.id);
                  const fullName = `${g.lastName} ${g.firstName}`.trim();

                  return (
                    <tr key={g.id} className={`hover:bg-stone-50/60 transition ${isChecked ? "bg-stone-50/80" : ""}`}>
                      <td className="py-3.5 pl-4 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(g.id)}
                          className="rounded border-stone-300 text-[#1F1A17] focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 font-bold text-[10px] text-stone-700">
                            {g.firstName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-[#1F1A17] block">{fullName}</span>
                            {g.address && (
                              <span className="text-[10px] text-stone-400 truncate max-w-[180px] block" title={g.address}>
                                {g.address}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700">
                          {g.side}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[#1F1A17] block font-mono text-[11px] font-medium">{g.phone || "—"}</span>
                        <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-0.5">
                          <Mail size={10} className="text-stone-400 shrink-0" />
                          <span className="truncate max-w-[150px] font-mono text-stone-600" title={g.email || "Chưa có email"}>
                            {g.email || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="font-semibold text-stone-700">
                          {g.companions > 0 ? `+${g.companions}` : "—"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="rounded-full bg-stone-50 border border-stone-200 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600">
                          {g.tag}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <select
                          value={g.tableId || ""}
                          onChange={(e) => handleUpdateGuestTable(g.id, e.target.value)}
                          className={`rounded-lg border px-2 py-1 text-[11px] font-medium outline-none transition cursor-pointer ${
                            g.tableId
                              ? "border-stone-200 bg-white text-[#1F1A17]"
                              : "border-dashed border-stone-300 bg-stone-50 text-stone-400"
                          }`}
                        >
                          <option value="">Chưa xếp bàn</option>
                          {tables.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${RSVP_BADGE[g.rsvp] || "bg-stone-100 text-stone-700"}`}>
                          {g.rsvp}
                        </span>
                      </td>

                      <td className="py-3.5 pl-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(g.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                          title="Xóa khách"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-stone-400">
                      <Users size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="font-medium text-xs">Không tìm thấy khách mời nào phù hợp với bộ lọc</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/50 px-4 py-3 text-xs text-stone-500">
            <span>Hiển thị {filteredGuests.length} / {guests.length} khách mời</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(ROUTE_PATHS.COLLECT_CONTACTS, { state: { wedding } })}
                className="font-semibold text-stone-700 hover:text-[#1F1A17] flex items-center gap-1 cursor-pointer"
              >
                <Share2 size={12} /> Cổng thu thập SĐT & Địa chỉ →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: THÊM KHÁCH MỜI MỚI
         ========================================================================= */}
      <Modal
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        title="Thêm khách mời mới"
        size="md"
      >
        <form onSubmit={handleAddGuest} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Họ và tên lót</label>
              <input
                type="text"
                value={guestForm.lastName}
                onChange={(e) => setGuestForm({ ...guestForm, lastName: e.target.value })}
                placeholder="VD: Nguyễn Văn"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Tên khách mời *</label>
              <input
                type="text"
                required
                value={guestForm.firstName}
                onChange={(e) => setGuestForm({ ...guestForm, firstName: e.target.value })}
                placeholder="VD: Nam"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Phía gia đình</label>
              <select
                value={guestForm.side}
                onChange={(e) => setGuestForm({ ...guestForm, side: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              >
                <option value="Nhà trai">Nhà trai</option>
                <option value="Nhà gái">Nhà gái</option>
                <option value="Bạn bè">Bạn bè</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Số lượng đi cùng</label>
              <input
                type="number"
                min={0}
                max={5}
                value={guestForm.companions}
                onChange={(e) => setGuestForm({ ...guestForm, companions: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Số điện thoại</label>
              <input
                type="text"
                value={guestForm.phone}
                onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                placeholder="VD: 0909 123 456"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Địa chỉ Email (gửi thiệp & tin nhắn)</label>
              <input
                type="email"
                value={guestForm.email}
                onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                placeholder="VD: nam.nguyen@example.com"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Địa chỉ nhận thiệp giấy</label>
            <input
              type="text"
              value={guestForm.address}
              onChange={(e) => setGuestForm({ ...guestForm, address: e.target.value })}
              placeholder="VD: 123 Lê Duẩn, Quận 1, TP.HCM"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Xác nhận RSVP</label>
              <select
                value={guestForm.rsvp}
                onChange={(e) => setGuestForm({ ...guestForm, rsvp: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              >
                <option value="Tham dự">Tham dự</option>
                <option value="Chờ phản hồi">Chờ phản hồi</option>
                <option value="Từ chối">Từ chối</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Gán vào bàn tiệc</label>
              <select
                value={guestForm.tableId}
                onChange={(e) => setGuestForm({ ...guestForm, tableId: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
              >
                <option value="">Chưa xếp bàn</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.guests.length}/{t.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddGuestOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSavingGuest}
              className="rounded-full bg-[#1F1A17] px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-60 transition cursor-pointer"
            >
              {isSavingGuest ? "Đang lưu..." : "Lưu khách mời"}
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL NHẬP DANH SÁCH KHÁCH MỜI TỪ FILE EXCEL (.xlsx, .xls, .csv)
         ========================================================================= */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => !isImporting && setIsImportModalOpen(false)}
        title="Nhập danh sách khách mời từ Excel"
        size="lg"
      >
        <div className="space-y-4 text-xs text-stone-700">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-emerald-950">
                Hỗ trợ file Excel (.xlsx, .xls) và CSV
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Cột chuẩn: Họ và tên lót, Tên (hoặc Họ và tên), Phía gia đình, Số điện thoại, Email, Địa chỉ, Xác nhận RSVP, Người đi cùng, Phân loại.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                downloadSampleGuestsExcel();
                toast.success("Đã tải file Excel mẫu (30 khách)!");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-emerald-300 px-3 py-2 text-[11px] font-bold text-emerald-900 hover:bg-emerald-100 transition shrink-0 cursor-pointer"
            >
              <Download size={13} />
              <span>Tải file Excel mẫu (30 khách)</span>
            </button>
          </div>

          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/60 hover:bg-stone-100/80 p-6 cursor-pointer transition text-center">
            <Upload className="w-7 h-7 text-stone-500 mb-2" />
            <span className="font-bold text-stone-800">
              {importFileName
                ? `Đã chọn: ${importFileName} (${importRows.length} khách)`
                : "Nhấn vào đây để chọn file Excel (.xlsx / .xls / .csv)"}
            </span>
            <span className="text-[11px] text-stone-500 mt-1">
              Dữ liệu sẽ được xem trước và lưu thẳng vào Neon Database
            </span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelFileChange}
              className="hidden"
            />
          </label>

          {importRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">
                  Xem trước danh sách ({importRows.length} khách):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setImportRows([]);
                    setImportFileName("");
                  }}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                >
                  Xóa chọn lại
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-stone-100 sticky top-0 text-stone-700 font-semibold">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Họ và tên</th>
                      <th className="py-2 px-3">Gia đình</th>
                      <th className="py-2 px-3">SĐT</th>
                      <th className="py-2 px-3">RSVP</th>
                      <th className="py-2 px-3">Đi cùng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {importRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 px-3 text-stone-400">{idx + 1}</td>
                        <td className="py-1.5 px-3 font-semibold text-stone-900">
                          {row.fullName}
                        </td>
                        <td className="py-1.5 px-3">{row.side}</td>
                        <td className="py-1.5 px-3 font-mono">{row.phone || "-"}</td>
                        <td className="py-1.5 px-3">{row.rsvp}</td>
                        <td className="py-1.5 px-3">+{row.companions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              disabled={isImporting}
              onClick={() => setIsImportModalOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={importRows.length === 0 || isImporting}
              onClick={handleConfirmImport}
              className="rounded-full bg-[#1F1A17] hover:bg-black disabled:opacity-50 px-5 py-2 text-xs font-semibold text-white transition cursor-pointer"
            >
              {isImporting
                ? "Đang nhập vào Neon..."
                : `Nhập ${importRows.length} khách vào danh sách`}
            </button>
          </div>
        </div>
      </Modal>
    </FeatureShell>
  );
}
