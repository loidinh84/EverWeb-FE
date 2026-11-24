import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  List,
  Map,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

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
  { id: "t5", name: "Bàn 5 · Họ hàng", capacity: 10, guests: ["Bác Văn", "Cô Mai", "Thanh Phong", "Lê Dũng", "Kim Ngân", "Hoàng Sơn"] },
  { id: "t6", name: "Bàn 6 · Khách vip gia đình", capacity: 8, guests: ["Ông Trần Xuân", "Bà Nguyễn Hương", "Bác Quang", "Cô Mỹ Trang"] },
];

function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]);
}

/**
 * Thành phần Sơ đồ Bàn tròn (Round Table Floor Plan Visual)
 * Vẽ đĩa bàn tròn ở trung tâm và các ghế ngồi hình tròn bao quanh theo hình học lượng giác
 */
function RoundTableVisual({ table, isSelected, onSelectTable, onSeatClick, onRemoveSeat }) {
  const capacity = table.capacity || 8;
  const seatedCount = table.guests.filter(Boolean).length;
  const isFull = seatedCount >= capacity;

  return (
    <div
      onClick={onSelectTable}
      className={`relative flex flex-col items-center justify-center p-5 rounded-3xl transition-all cursor-pointer ${
        isSelected
          ? "bg-white ring-2 ring-[#1F1A17] shadow-md border border-stone-300"
          : "bg-white hover:bg-stone-50/50 border border-stone-200 hover:border-stone-400 shadow-2xs"
      }`}
    >
      {/* Khung chứa bàn tròn và các ghế xung quanh */}
      <div className="relative w-56 h-56 flex items-center justify-center my-2">
        {/* Đĩa bàn tròn ở giữa */}
        <div
          className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center text-center p-2 transition-all ${
            isSelected
              ? "border-[#1F1A17] bg-stone-50/80 shadow-inner"
              : "border-stone-200 bg-white shadow-2xs"
          }`}
        >
          <span className="text-xs font-bold text-[#1F1A17] line-clamp-1">
            {table.name.split("·")[0].trim()}
          </span>
          <span className="text-[10px] text-stone-500 line-clamp-1">
            {table.name.includes("·") ? table.name.split("·")[1].trim() : ""}
          </span>
          <span
            className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isFull ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
            }`}
          >
            {seatedCount}/{capacity} ghế
          </span>
        </div>

        {/* Các ghế ngồi hình tròn bao quanh bàn tròn */}
        {Array.from({ length: capacity }).map((_, seatIdx) => {
          const guestName = table.guests[seatIdx];
          const angle = (seatIdx / capacity) * 2 * Math.PI - Math.PI / 2;
          const leftPercent = 50 + 40 * Math.cos(angle);
          const topPercent = 50 + 40 * Math.sin(angle);

          return (
            <div
              key={seatIdx}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (guestName) {
                  onRemoveSeat(table.id, seatIdx);
                } else {
                  onSeatClick(table.id, seatIdx);
                }
              }}
              title={
                guestName
                  ? `Ghế ${seatIdx + 1}: ${guestName} (Nhấp để bỏ khách)`
                  : `Ghế ${seatIdx + 1}: Trống (Nhấp để xếp khách)`
              }
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-2xs group ${
                guestName
                  ? "bg-[#1F1A17] text-white hover:bg-rose-600 hover:scale-110 cursor-pointer"
                  : "border-2 border-dashed border-stone-300 bg-white text-stone-400 hover:border-[#1F1A17] hover:text-[#1F1A17] hover:bg-stone-50 cursor-pointer"
              }`}
            >
              {guestName ? (
                <>
                  <span className="group-hover:hidden">{getInitials(guestName)}</span>
                  <X size={12} className="hidden group-hover:block" />
                </>
              ) : (
                <span>{seatIdx + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Thông tin chân bàn */}
      <div className="text-center mt-1">
        <p className="text-xs font-semibold text-[#1F1A17]">{table.name}</p>
        <p className="text-[11px] text-stone-500">
          {seatedCount === 0
            ? "Chưa có khách"
            : seatedCount >= capacity
            ? "Đã đủ khách"
            : `Còn trống ${capacity - seatedCount} chỗ`}
        </p>
      </div>
    </div>
  );
}

export default function SeatingChartPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();
  const coupleNames = (wedding?.title || "Trần Thanh Khang & Mai Khanh").normalize("NFC");

  // 1. Quản lý danh sách khách mời từ feature "collect_contacts"
  const { data: ccData } = useWeddingFeature(
    wedding,
    "collect_contacts",
    {
      guestList: INITIAL_GUESTS,
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

  const guests = useMemo(
    () => (Array.isArray(ccData.guestList) && ccData.guestList.length > 0 ? ccData.guestList : INITIAL_GUESTS),
    [ccData.guestList]
  );

  const tables = useMemo(
    () => (Array.isArray(webConfig.seatingTables) && webConfig.seatingTables.length > 0 ? webConfig.seatingTables : DEFAULT_TABLES),
    [webConfig.seatingTables]
  );

  // State
  const [seatingViewMode, setSeatingViewMode] = useState("floor"); // "floor" | "cards"
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || "t1");
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCap, setNewTableCap] = useState(8);
  const [seatingSearch, setSeatingSearch] = useState("");

  // Metrics
  const totalSeats = useMemo(() => tables.reduce((sum, t) => sum + t.capacity, 0), [tables]);
  const totalSeated = useMemo(() => tables.reduce((sum, t) => sum + t.guests.filter(Boolean).length, 0), [tables]);
  const seatPercentage = Math.round((totalSeated / Math.max(1, totalSeats)) * 100);

  // Khách chưa có chỗ ngồi (Unseated guests)
  const seatedNames = useMemo(() => new Set(tables.flatMap((t) => t.guests.filter(Boolean))), [tables]);
  const unseatedGuests = useMemo(() => {
    return guests.filter((g) => {
      const fullName = `${g.lastName} ${g.firstName}`.trim();
      return g.rsvp === "Tham dự" && !seatedNames.has(fullName) && !g.tableId;
    });
  }, [guests, seatedNames]);

  // Actions
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    const created = {
      id: `t-${Date.now()}`,
      name: newTableName.trim(),
      capacity: Math.max(2, Number(newTableCap) || 8),
      guests: [],
    };
    saveSeatingData({ seatingTables: [...tables, created] });
    setSelectedTableId(created.id);
    setNewTableName("");
    setIsAddTableOpen(false);
    toast.success(`Đã thêm ${created.name} (${created.capacity} ghế)`);
  };

  const handleDeleteTable = (id) => {
    if (tables.length <= 1) {
      toast.info("Cần giữ ít nhất 1 bàn tiệc");
      return;
    }
    const nextTables = tables.filter((t) => t.id !== id);
    saveSeatingData({ seatingTables: nextTables });
    if (selectedTableId === id) setSelectedTableId(nextTables[0]?.id || "");
    toast.info("Đã xóa bàn tiệc");
  };

  const handleAssignToSeat = (tableId, seatIdx, guestName) => {
    const nextTables = tables.map((t) => {
      if (t.id === tableId) {
        const nextGuests = [...t.guests];
        nextGuests[seatIdx] = guestName;
        return { ...t, guests: nextGuests };
      }
      return t;
    });
    saveSeatingData({ seatingTables: nextTables });
    toast.success(`Đã xếp ${guestName} vào ghế`);
  };

  const handleRemoveFromSeat = (tableId, seatIdx) => {
    const nextTables = tables.map((t) => {
      if (t.id === tableId) {
        const nextGuests = [...t.guests];
        const removed = nextGuests[seatIdx];
        nextGuests.splice(seatIdx, 1);
        if (removed) toast.info(`Đã bỏ ${removed} khỏi ghế`);
        return { ...t, guests: nextGuests };
      }
      return t;
    });
    saveSeatingData({ seatingTables: nextTables });
  };

  const handleSeatClick = (tableId, seatIdx) => {
    setSelectedTableId(tableId);
    if (unseatedGuests.length === 0) {
      toast.info("Không có khách chưa xếp chỗ. Hãy chọn khách từ danh sách.");
      return;
    }
    // Gán khách chưa xếp đầu tiên vào ghế này
    const firstUnseated = unseatedGuests[0];
    const fullName = `${firstUnseated.lastName} ${firstUnseated.firstName}`.trim();
    handleAssignToSeat(tableId, seatIdx, fullName);
  };

  const handleAutoSeat = () => {
    if (unseatedGuests.length === 0) {
      toast.info("Không còn khách nào chưa xếp chỗ");
      return;
    }
    const nextTables = tables.map((t) => ({ ...t, guests: [...t.guests] }));
    let count = 0;
    for (const g of unseatedGuests) {
      const fullName = `${g.lastName} ${g.firstName}`.trim();
      const openTable = nextTables.find((t) => t.guests.length < t.capacity);
      if (openTable) {
        openTable.guests.push(fullName);
        count++;
      }
    }
    saveSeatingData({ seatingTables: nextTables });
    toast.success(`Đã tự động xếp chỗ cho ${count} khách mời vào các bàn còn trống`);
  };

  const activeTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  return (
    <FeatureShell
      title="Sơ đồ bàn tiệc"
      subtitle={`Quản lý ${tables.length} bàn tiệc · Đã xếp ${totalSeated}/${totalSeats} chỗ ngồi`}
      badgeText="Bàn tiệc"
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.GUEST_LIST)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-[#1F1A17] hover:bg-stone-50 transition cursor-pointer"
          >
            <Users size={13} /> Danh sách khách mời →
          </button>
          <button
            type="button"
            onClick={handleAutoSeat}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-[#3B52DE] hover:text-[#3B52DE] transition cursor-pointer"
          >
            <Sparkles size={13} /> Tự động xếp chỗ
          </button>
          <button
            type="button"
            onClick={() => setIsAddTableOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus size={14} /> Thêm bàn mới
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* =========================================================================
            1. THẺ CHỈ SỐ TIẾN ĐỘ & TỔNG QUAN (KHÔNG DÙNG UPPERCASE)
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 block">Tổng số bàn</span>
            <span className="text-2xl font-bold text-[#1F1A17] tabular-nums mt-1 block">{tables.length} bàn tiệc</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">8 - 12 khách/bàn</span>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 block">Tổng số ghế</span>
            <span className="text-2xl font-bold text-[#1F1A17] tabular-nums mt-1 block">{totalSeats} ghế</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">Sức chứa toàn sảnh</span>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-emerald-700 block">Đã xếp chỗ</span>
            <span className="text-2xl font-bold text-emerald-700 tabular-nums mt-1 block">{totalSeated} khách</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">Đã có vị trí bàn</span>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-amber-700 block">Chưa xếp chỗ</span>
            <span className="text-2xl font-bold text-amber-700 tabular-nums mt-1 block">{unseatedGuests.length} khách</span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">Cần gán vào bàn</span>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 block">Tỷ lệ lấp đầy</span>
            <span className="text-2xl font-bold text-[#1F1A17] tabular-nums mt-1 block">{seatPercentage}%</span>
            <div className="h-1.5 w-full bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#1F1A17] rounded-full" style={{ width: `${seatPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. THANH ĐIỀU KHIỂN & CHUYỂN CHẾ ĐỘ XEM
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="inline-flex rounded-2xl border border-stone-200 bg-white p-1 text-xs">
            <button
              type="button"
              onClick={() => setSeatingViewMode("floor")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold transition cursor-pointer ${
                seatingViewMode === "floor"
                  ? "bg-[#1F1A17] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Map size={14} /> Mặt bằng sảnh cưới (Bàn tròn)
            </button>
            <button
              type="button"
              onClick={() => setSeatingViewMode("cards")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold transition cursor-pointer ${
                seatingViewMode === "cards"
                  ? "bg-[#1F1A17] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <List size={14} /> Dạng danh sách chi tiết
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Bàn đang chọn:</span>
            <span className="rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-xs font-semibold text-[#1F1A17]">
              {activeTable?.name} ({activeTable?.guests.filter(Boolean).length}/{activeTable?.capacity} ghế)
            </span>
          </div>
        </div>

        {/* =========================================================================
            3. BỐ CỤC CHÍNH SƠ ĐỒ BÀN TIỆC
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (4 cols): DANH SÁCH KHÁCH CHƯA XẾP CHỖ & QUẢN LÝ BÀN ĐANG CHỌN */}
          <div className="lg:col-span-4 space-y-5">
            {/* Box 1: Khách chưa xếp chỗ */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-[#1F1A17]">Khách chưa xếp bàn</h4>
                  <p className="text-[11px] text-stone-500">Khách RSVP tham dự nhưng chưa có chỗ</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {unseatedGuests.length}
                </span>
              </div>

              {/* Tìm kiếm nhanh khách chưa xếp */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={seatingSearch}
                  onChange={(e) => setSeatingSearch(e.target.value)}
                  placeholder="Tìm khách chưa xếp..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#3B52DE]"
                />
              </div>

              {/* Danh sách khách chưa xếp */}
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto divide-y divide-stone-100 pr-1">
                {unseatedGuests
                  .filter((g) => `${g.lastName} ${g.firstName}`.toLowerCase().includes(seatingSearch.toLowerCase()))
                  .map((g) => {
                    const fullName = `${g.lastName} ${g.firstName}`.trim();
                    return (
                      <div key={g.id} className="pt-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-[#1F1A17]">{fullName}</p>
                          <p className="text-[10px] text-stone-500">
                            {g.side} · {g.tag}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const openIdx = activeTable.guests.length;
                            if (openIdx < activeTable.capacity) {
                              handleAssignToSeat(activeTable.id, openIdx, fullName);
                            } else {
                              toast.info(`Bàn "${activeTable.name}" đã đủ ${activeTable.capacity} chỗ`);
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-stone-100 hover:bg-[#1F1A17] hover:text-white px-2.5 py-1 text-[11px] font-semibold text-stone-700 transition cursor-pointer"
                        >
                          <UserPlus size={12} /> Xếp vào {activeTable.name.split("·")[0]}
                        </button>
                      </div>
                    );
                  })}

                {unseatedGuests.length === 0 && (
                  <div className="py-8 text-center text-xs text-stone-400">
                    <Check size={20} className="mx-auto text-emerald-600 mb-1" />
                    <span>Toàn bộ khách tham dự đã được xếp bàn đầy đủ.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Thông tin bàn đang chọn */}
            <div className="rounded-3xl border border-stone-200 bg-stone-50/70 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-[#1F1A17]">{activeTable?.name}</h4>
                  <p className="text-[11px] text-stone-500">
                    {activeTable?.guests.filter(Boolean).length}/{activeTable?.capacity} khách đã ngồi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTable(activeTable.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-200/50 transition cursor-pointer"
                  title="Xóa bàn này"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Danh sách ghế ngồi trong bàn */}
              <div className="space-y-1.5 text-xs">
                {Array.from({ length: activeTable?.capacity || 8 }).map((_, seatIdx) => {
                  const guestName = activeTable?.guests[seatIdx];
                  return (
                    <div
                      key={seatIdx}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-xl border ${
                        guestName
                          ? "border-stone-200 bg-white text-[#1F1A17]"
                          : "border-dashed border-stone-200 bg-stone-100/50 text-stone-400"
                      }`}
                    >
                      <span className="truncate max-w-[170px] font-medium text-[11px]">
                        Ghế {seatIdx + 1}: {guestName || "Ghế trống"}
                      </span>
                      {guestName ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveFromSeat(activeTable.id, seatIdx)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="Bỏ khách khỏi ghế"
                        >
                          <X size={12} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400">Trống</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (8 cols): MẶT BẰNG SẢNH TIỆC BÀN TRÒN HOẶC DẠNG DANH SÁCH */}
          <div className="lg:col-span-8 space-y-5">
            {/* Thanh lựa chọn bàn tiệc nhanh */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">Bàn tiệc:</span>
              {tables.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTableId(t.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    selectedTableId === t.id
                      ? "bg-[#1F1A17] text-white shadow-xs"
                      : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>{t.name}</span>
                  <span className="ml-1.5 opacity-70">
                    ({t.guests.filter(Boolean).length}/{t.capacity})
                  </span>
                </button>
              ))}
            </div>

            {seatingViewMode === "floor" ? (
              /* SƠ ĐỒ MẶT BẰNG SẢNH TIỆC CƯỚI - MÔ HÌNH BÀN TRÒN THỰC TẾ */
              <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-inner min-h-[640px] flex flex-col justify-between">
                {/* Sân khấu chính CD-CR (Sweetheart Stage) */}
                <div className="mx-auto max-w-sm w-full rounded-2xl bg-[#1F1A17] text-white py-3 px-6 text-center shadow-md">
                  <p className="text-xs font-medium text-amber-400">Sân khấu chính & lễ đường</p>
                  <p className="font-display italic text-sm font-bold mt-0.5">{coupleNames}</p>
                </div>

                {/* Lưới các bàn tròn thực tế (Round Tables Floor Layout) */}
                <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                  {tables.map((t) => (
                    <RoundTableVisual
                      key={t.id}
                      table={t}
                      isSelected={selectedTableId === t.id}
                      onSelectTable={() => setSelectedTableId(t.id)}
                      onSeatClick={handleSeatClick}
                      onRemoveSeat={handleRemoveFromSeat}
                    />
                  ))}
                </div>

                {/* Cửa đón khách chính */}
                <div className="mx-auto max-w-xs w-full text-center border-t-2 border-dashed border-stone-300 pt-3 text-xs font-medium text-stone-400">
                  ↓ Lối vào sảnh tiệc & bàn lễ tân
                </div>
              </div>
            ) : (
              /* DẠNG DANH SÁCH CHI TIẾT */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tables.map((t) => (
                  <div key={t.id} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-[#1F1A17]">{t.name}</h4>
                        <p className="text-xs text-stone-500">Sức chứa: {t.capacity} ghế bàn tròn</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteTable(t.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          title="Xóa bàn"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs divide-y divide-stone-100">
                      {t.guests.map((name, i) => (
                        <div key={i} className="pt-1.5 flex items-center justify-between">
                          <span className="font-medium text-[#1F1A17]">
                            Ghế {i + 1}: {name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromSeat(t.id, i)}
                            className="text-xs text-stone-400 hover:text-rose-600 font-semibold cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: THÊM BÀN TIỆC MỚI
         ========================================================================= */}
      <Modal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        title="Thêm bàn tiệc mới"
        size="sm"
      >
        <form onSubmit={handleAddTable} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Tên bàn tiệc *</label>
            <input
              type="text"
              required
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="VD: Bàn 7 · Bạn cấp 3"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
              autoFocus
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Số ghế (Sức chứa)</label>
            <select
              value={newTableCap}
              onChange={(e) => setNewTableCap(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
            >
              <option value={8}>8 ghế (Tiêu chuẩn)</option>
              <option value={10}>10 ghế (Mâm lớn)</option>
              <option value={12}>12 ghế (Bàn dài)</option>
              <option value={6}>6 ghế (Bàn nhỏ)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddTableOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1F1A17] px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition cursor-pointer"
            >
              Tạo bàn tiệc
            </button>
          </div>
        </form>
      </Modal>
    </FeatureShell>
  );
}
