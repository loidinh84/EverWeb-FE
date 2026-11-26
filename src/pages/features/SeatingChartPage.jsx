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
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import {
  DEFAULT_MENU_SETS,
  DEFAULT_TABLES,
  INITIAL_GUESTS,
} from "./seating-chart/constants";
import RoundTableVisual from "./seating-chart/RoundTableVisual";

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

  // 2. Quản lý sơ đồ bàn tiệc & thực đơn từ feature "website_config"
  const { data: webConfig, saveSection: saveSeatingData } = useWeddingFeature(
    wedding,
    "website_config",
    {
      seatingTables: DEFAULT_TABLES,
      menuSets: DEFAULT_MENU_SETS,
      tableMenus: {},
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

  const menuSets = useMemo(
    () => (Array.isArray(webConfig.menuSets) && webConfig.menuSets.length > 0 ? webConfig.menuSets : DEFAULT_MENU_SETS),
    [webConfig.menuSets]
  );
  const tableMenus = webConfig.tableMenus || {};

  // State
  const [seatingViewMode, setSeatingViewMode] = useState("floor"); // "floor" | "cards" | "menu"
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || "t1");
  const [activeSetId, setActiveSetId] = useState("set-main");
  const [newDishCourse, setNewDishCourse] = useState("Món chính");
  const [newDishName, setNewDishName] = useState("");
  const [menuModalTableId, setMenuModalTableId] = useState(null);
  const [isAddSetOpen, setIsAddSetOpen] = useState(false);
  const [newSetName, setNewSetName] = useState("");
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
            <button
              type="button"
              onClick={() => setSeatingViewMode("menu")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold transition cursor-pointer ${
                seatingViewMode === "menu"
                  ? "bg-[#1F1A17] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <UtensilsCrossed size={14} /> Thực đơn bàn tiệc
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
                      onOpenMenu={() => setMenuModalTableId(t.id)}
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
            ) : seatingViewMode === "cards" ? (
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
            ) : (
              /* THỰC ĐƠN BÀN TIỆC (MENU LIST) */
              <div className="space-y-6">
                {/* 1. Quản lý danh sách món trong từng Set thực đơn */}
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1A17]">
                        Danh sách món ăn theo Set thực đơn
                      </h4>
                      <p className="text-xs text-stone-500">
                        Chỉnh sửa món ăn trong từng Set và gán cho từng bàn tiệc bên dưới
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextMenus = {};
                        for (const t of tables) {
                          nextMenus[t.id] = {
                            ...(tableMenus[t.id] || {}),
                            setId: activeSetId,
                          };
                        }
                        saveSeatingData({ tableMenus: nextMenus });
                        toast.success("Đã áp dụng Set này cho tất cả các bàn");
                      }}
                      className="rounded-full bg-[#3B52DE] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
                    >
                      Áp dụng cho tất cả bàn
                    </button>
                  </div>

                  {/* Chọn Set + Tạo Set mới */}
                  <div className="flex flex-wrap items-center gap-2">
                    {menuSets.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveSetId(s.id)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                          activeSetId === s.id
                            ? "bg-[#1F1A17] text-white"
                            : "border border-stone-200 bg-stone-50 text-stone-600 hover:border-[#3B52DE]"
                        }`}
                      >
                        {s.name} ({s.dishes.length} món)
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsAddSetOpen(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#3B52DE]/50 bg-[#EEF2FF]/50 px-3.5 py-1.5 text-xs font-semibold text-[#3B52DE] hover:bg-[#EEF2FF]"
                    >
                      <Plus size={12} /> Tạo Set mới
                    </button>
                  </div>

                  {/* Form thêm món mới vào Set */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newDishName.trim()) return;
                      const updatedSets = menuSets.map((s) =>
                        s.id === activeSetId
                          ? {
                              ...s,
                              dishes: [
                                ...s.dishes,
                                {
                                  id: `dish-${s.dishes.length + 1}-${newDishName.trim().length}`,
                                  course: newDishCourse,
                                  name: newDishName.trim(),
                                },
                              ],
                            }
                          : s
                      );
                      saveSeatingData({ menuSets: updatedSets });
                      setNewDishName("");
                      toast.success("Đã thêm món mới vào thực đơn");
                    }}
                    className="flex flex-wrap gap-2 text-xs"
                  >
                    <select
                      value={newDishCourse}
                      onChange={(e) => setNewDishCourse(e.target.value)}
                      className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 font-medium outline-none focus:border-[#3B52DE]"
                    >
                      <option value="Khai vị">Khai vị</option>
                      <option value="Món chính">Món chính</option>
                      <option value="Tráng miệng">Tráng miệng</option>
                      <option value="Đồ uống">Đồ uống</option>
                    </select>
                    <input
                      type="text"
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      placeholder="Nhập tên món ăn mới (VD: Cá tầm nướng muối ớt)..."
                      className="flex-1 min-w-[200px] rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-[#3B52DE]"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-xl bg-[#1F1A17] px-4 py-2 font-semibold text-white hover:bg-[#3B52DE]"
                    >
                      <Plus size={13} /> Thêm món
                    </button>
                  </form>

                  {/* Danh sách món của Set đang chọn */}
                  <div className="divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-stone-50/50">
                    {(
                      menuSets.find((s) => s.id === activeSetId)?.dishes || []
                    ).map((dish, i) => (
                      <div
                        key={dish.id || i}
                        className="flex items-center justify-between px-4 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#3B52DE] border border-stone-200">
                            {dish.course}
                          </span>
                          <span className="font-medium text-[#1F1A17]">
                            {dish.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedSets = menuSets.map((s) =>
                              s.id === activeSetId
                                ? {
                                    ...s,
                                    dishes: s.dishes.filter(
                                      (d) => d.id !== dish.id
                                    ),
                                  }
                                : s
                            );
                            saveSeatingData({ menuSets: updatedSets });
                            toast.info("Đã xoá món khỏi thực đơn");
                          }}
                          className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Xoá món"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Gán thực đơn & ghi chú cho từng bàn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tables.map((t) => {
                    const cfg = tableMenus[t.id] || {};
                    const currentSetId = cfg.setId || "set-main";
                    const currentNote = cfg.note || "";
                    const currentSet =
                      menuSets.find((s) => s.id === currentSetId) ||
                      menuSets[0];

                    return (
                      <div
                        key={t.id}
                        className="rounded-3xl border border-stone-200 bg-white p-5 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <h5 className="text-sm font-bold text-[#1F1A17]">
                              {t.name}
                            </h5>
                            <p className="text-[11px] text-stone-500">
                              {t.guests.filter(Boolean).length}/{t.capacity} khách
                            </p>
                          </div>
                          <select
                            value={currentSetId}
                            onChange={(e) => {
                              saveSeatingData({
                                tableMenus: {
                                  ...tableMenus,
                                  [t.id]: { ...cfg, setId: e.target.value },
                                },
                              });
                              toast.success(`Đã đổi thực đơn cho ${t.name}`);
                            }}
                            className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                          >
                            {menuSets.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {currentSet?.dishes.map((d) => (
                            <span
                              key={d.id}
                              className="rounded-lg bg-stone-100 px-2 py-1 text-[11px] text-stone-700"
                            >
                              {d.name}
                            </span>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) =>
                            saveSeatingData({
                              tableMenus: {
                                ...tableMenus,
                                [t.id]: { ...cfg, note: e.target.value },
                              },
                            })
                          }
                          placeholder="Ghi chú bàn (VD: 2 suất chay, không hải sản)..."
                          className="w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-1.5 text-xs outline-none focus:border-[#3B52DE]"
                        />
                      </div>
                    );
                  })}
                </div>
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

      {/* Modal Xem & Gán Thực đơn khi bấm vào trung tâm bàn */}
      <Modal
        isOpen={Boolean(menuModalTableId)}
        onClose={() => setMenuModalTableId(null)}
        title={`Thực đơn · ${
          tables.find((t) => t.id === menuModalTableId)?.name || "Bàn tiệc"
        }`}
        size="md"
      >
        {menuModalTableId && (() => {
          const cfg = tableMenus[menuModalTableId] || {};
          const currentSetId = cfg.setId || menuSets[0]?.id || "set-main";
          const currentSet =
            menuSets.find((s) => s.id === currentSetId) || menuSets[0];
          const currentNote = cfg.note || "";

          return (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1F1A17] mb-1.5">
                  Chọn Set thực đơn cho bàn này
                </label>
                <select
                  value={currentSetId}
                  onChange={(e) => {
                    saveSeatingData({
                      tableMenus: {
                        ...tableMenus,
                        [menuModalTableId]: { ...cfg, setId: e.target.value },
                      },
                    });
                    toast.success("Đã cập nhật thực đơn cho bàn");
                  }}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 font-semibold outline-none focus:border-[#3B52DE]"
                >
                  {menuSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.dishes.length} món)
                    </option>
                  ))}
                </select>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-stone-50/50">
                {(currentSet?.dishes || []).map((d, idx) => (
                  <div
                    key={d.id || idx}
                    className="flex items-center justify-between px-3.5 py-2.5"
                  >
                    <span className="font-medium text-[#1F1A17]">{d.name}</span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#3B52DE] border border-stone-200">
                      {d.course}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-[#1F1A17] mb-1">
                  Ghi chú món chay / dị ứng riêng của bàn
                </label>
                <input
                  type="text"
                  value={currentNote}
                  onChange={(e) =>
                    saveSeatingData({
                      tableMenus: {
                        ...tableMenus,
                        [menuModalTableId]: { ...cfg, note: e.target.value },
                      },
                    })
                  }
                  placeholder="VD: 2 suất chay, không hải sản..."
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-[#3B52DE]"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuModalTableId(null);
                    setSeatingViewMode("menu");
                  }}
                  className="font-semibold text-[#3B52DE] hover:underline"
                >
                  Chỉnh sửa / Tạo Set thực đơn mới →
                </button>
                <button
                  type="button"
                  onClick={() => setMenuModalTableId(null)}
                  className="rounded-full bg-[#1F1A17] px-4 py-2 font-semibold text-white"
                >
                  Xong
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Modal Tạo Set Thực đơn mới */}
      <Modal
        isOpen={isAddSetOpen}
        onClose={() => setIsAddSetOpen(false)}
        title="Tạo Set thực đơn mới"
        size="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newSetName.trim()) return;
            const created = {
              id: `set-${menuSets.length + 1}-${newSetName.trim().length}`,
              name: newSetName.trim(),
              dishes: [],
            };
            saveSeatingData({ menuSets: [...menuSets, created] });
            setActiveSetId(created.id);
            setNewSetName("");
            setIsAddSetOpen(false);
            toast.success(`Đã tạo "${created.name}", bạn có thể thêm món ngay!`);
          }}
          className="space-y-3 text-xs"
        >
          <input
            type="text"
            required
            autoFocus
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            placeholder="Tên Set thực đơn (VD: Thực đơn Hải sản cao cấp)"
            className="w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-[#3B52DE]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddSetOpen(false)}
              className="rounded-lg border border-stone-200 px-4 py-2 font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white"
            >
              Tạo Set
            </button>
          </div>
        </form>
      </Modal>
    </FeatureShell>
  );
}
