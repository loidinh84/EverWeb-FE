import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  LayoutGrid,
  List,
  Map,
  Minus,
  MoveHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserMinus,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const DEFAULT_TABLES = [
  { id: "t1", name: "Bàn 1 · Nhà gái", capacity: 8, guests: ["NL", "PT", "ML", "TH", "AK", "BN"] },
  { id: "t2", name: "Bàn 2 · Nhà trai", capacity: 8, guests: ["TM", "VH", "QD", "LT", "PN", "HK", "DT"] },
  { id: "t3", name: "Bàn 3 · Bạn đại học", capacity: 8, guests: ["HN", "KL", "TT", "VA", "MP"] },
  { id: "t4", name: "Bàn 4 · Đồng nghiệp", capacity: 8, guests: ["DL", "CT", "NQ", "HT"] },
  { id: "t5", name: "Bàn 5 · Họ hàng", capacity: 8, guests: ["BV", "MC", "TP", "LD", "KN", "HS"] },
  { id: "t6", name: "Bàn 6 · Khách VIP", capacity: 8, guests: ["TX", "NH", "QP", "MT"] },
];

const SAMPLE_UNSEATED = [
  { id: "u1", name: "Nguyễn Thảo Vy", initials: "TV", status: "Tham dự" },
  { id: "u2", name: "Trần Quốc Bảo", initials: "QB", status: "Tham dự" },
  { id: "u3", name: "Lê Minh Anh", initials: "MA", status: "Tham dự" },
  { id: "u4", name: "Phạm Gia Huy", initials: "GH", status: "Tham dự" },
  { id: "u5", name: "Võ Ngọc Hân", initials: "NH", status: "Tham dự" },
];

export default function SeatingChartPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const { data: webConfig, saveSection } = useWeddingFeature(
    wedding,
    "website_config",
    {
      seatingTables: DEFAULT_TABLES,
      unseatedGuests: SAMPLE_UNSEATED,
    }
  );

  const tables = useMemo(
    () =>
      Array.isArray(webConfig.seatingTables) &&
      webConfig.seatingTables.length > 0
        ? webConfig.seatingTables
        : DEFAULT_TABLES,
    [webConfig.seatingTables]
  );

  const unseated = useMemo(
    () =>
      Array.isArray(webConfig.unseatedGuests)
        ? webConfig.unseatedGuests
        : SAMPLE_UNSEATED,
    [webConfig.unseatedGuests]
  );

  const [viewMode, setViewMode] = useState("floor");
  const [sidebarTab, setSidebarTab] = useState("guests");
  const [search, setSearch] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("t1");
  const [zoom, setZoom] = useState(100);
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCap, setNewTableCap] = useState(8);
  const [editingTable, setEditingTable] = useState(null);
  const [seatPicker, setSeatPicker] = useState(null); // { tableId, seatIdx }
  const [customGuestName, setCustomGuestName] = useState("");
  const [dragGuest, setDragGuest] = useState(null);

  const filteredUnseated = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? unseated.filter((u) => u.name.toLowerCase().includes(q)) : unseated;
  }, [unseated, search]);

  const totalSeated = tables.reduce(
    (sum, t) => sum + t.guests.filter(Boolean).length,
    0
  );

  const handleAssignGuest = (guest) => {
    const findOpenIdx = (t) => {
      for (let i = 0; i < t.capacity; i++) {
        if (!t.guests[i]) return i;
      }
      return -1;
    };
    const target =
      tables.find((t) => t.id === selectedTableId && findOpenIdx(t) !== -1) ||
      tables.find((t) => findOpenIdx(t) !== -1);
    if (!target) {
      toast.info("Tất cả bàn đã đủ chỗ, hãy bấm '+ Thêm bàn'");
      return;
    }
    const openIdx = findOpenIdx(target);
    handlePlaceAtSeat(target.id, openIdx, guest, guest.id);
  };

  const handleAutoSeat = () => {
    if (unseated.length === 0) {
      toast.info("Không còn khách nào chưa xếp chỗ");
      return;
    }
    let nextTables = tables.map((t) => ({ ...t, guests: [...t.guests] }));
    const remaining = [];
    for (const g of unseated) {
      const openTable = nextTables.find((t) => t.guests.length < t.capacity);
      if (openTable) {
        openTable.guests.push(g.initials);
      } else {
        remaining.push(g);
      }
    }
    saveSection({
      seatingTables: nextTables,
      unseatedGuests: remaining,
    });
    toast.success("Đã tự động xếp chỗ cho khách mời & lưu Neon DB");
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    const created = {
      id: `t-${Date.now()}`,
      name: newTableName.trim(),
      capacity: Math.max(2, Number(newTableCap) || 8),
      guests: [],
    };
    saveSection({ seatingTables: [...tables, created] });
    setSelectedTableId(created.id);
    setNewTableName("");
    setIsAddTableOpen(false);
    toast.success(`Đã thêm "${created.name}"`);
  };

  const handleDuplicateTable = (table) => {
    const dup = {
      ...table,
      id: `t-${tables.length + 1}-${table.name.length}`,
      name: `${table.name} (Bản sao)`,
      guests: [],
    };
    saveSection({ seatingTables: [...tables, dup] });
    setSelectedTableId(dup.id);
    toast.success("Đã nhân đôi bàn tiệc");
  };

  const handleDeleteTable = (id) => {
    saveSection({ seatingTables: tables.filter((t) => t.id !== id) });
    if (selectedTableId === id) setSelectedTableId(null);
    toast.info("Đã xoá bàn tiệc");
  };

  const handleSaveEditTable = (e) => {
    e.preventDefault();
    if (!editingTable || !editingTable.name.trim()) return;
    const cap = Math.max(2, Math.min(14, Number(editingTable.capacity) || 8));
    saveSection({
      seatingTables: tables.map((t) =>
        t.id === editingTable.id
          ? {
              ...t,
              name: editingTable.name.trim(),
              capacity: cap,
              guests: t.guests.slice(0, cap),
            }
          : t
      ),
    });
    toast.success("Đã cập nhật thông tin bàn tiệc");
    setEditingTable(null);
  };

  const handlePlaceAtSeat = (tableId, seatIdx, guestObj, removeUnseatedId) => {
    saveSection({
      seatingTables: tables.map((t) => {
        if (t.id !== tableId) return t;
        const padded = Array.from({ length: t.capacity }, (_, i) => t.guests[i] || "");
        padded[seatIdx] = guestObj.initials;
        return { ...t, guests: padded };
      }),
      ...(removeUnseatedId
        ? { unseatedGuests: unseated.filter((u) => u.id !== removeUnseatedId) }
        : {}),
    });
    setSeatPicker(null);
    setCustomGuestName("");
    toast.success(`Đã xếp ${guestObj.name} vào ghế ${seatIdx + 1}`);
  };

  const handleRemoveFromSeat = (tableId, seatIdx) => {
    const targetTable = tables.find((t) => t.id === tableId);
    const initials = targetTable?.guests[seatIdx];
    saveSection({
      seatingTables: tables.map((t) => {
        if (t.id !== tableId) return t;
        const padded = Array.from({ length: t.capacity }, (_, i) => t.guests[i] || "");
        padded[seatIdx] = "";
        return { ...t, guests: padded };
      }),
      ...(initials
        ? {
            unseatedGuests: [
              {
                id: `u-${tableId}-${seatIdx}`,
                name: `Khách (${initials})`,
                initials,
                status: "Tham dự",
              },
              ...unseated,
            ],
          }
        : {}),
    });
    setSeatPicker(null);
    toast.info("Đã đưa khách về danh sách chưa xếp chỗ");
  };

  const activeSeatTable = seatPicker
    ? tables.find((t) => t.id === seatPicker.tableId)
    : null;
  const activeSeatOccupant =
    activeSeatTable && seatPicker
      ? activeSeatTable.guests[seatPicker.seatIdx] || ""
      : "";

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6F3] text-[#2C2117]">
      {/* WithJoy Seating Chart Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[#EAE6DF] bg-white/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-[#5E5042] transition hover:bg-[#F3F0EA] hover:text-[#2C2117]"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Trung tâm sự kiện</span>
          </button>
          <span className="hidden h-4 w-px bg-[#E6DFD3] sm:block" />
          <h1 className="font-display text-lg font-semibold text-[#2C2117]">
            Sơ đồ bàn tiệc (Seating Chart)
          </h1>
        </div>

        {/* Center View Switcher (List View | Floor Plan) */}
        <div className="flex items-center rounded-full border border-[#E2D9CB] bg-[#FAF8F5] p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 transition ${
              viewMode === "list"
                ? "bg-white text-[#2C2117] shadow-2xs"
                : "text-[#8C7A68]"
            }`}
          >
            <List size={13} /> Danh sách
          </button>
          <button
            type="button"
            onClick={() => setViewMode("floor")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 transition ${
              viewMode === "floor"
                ? "bg-white text-[#2C2117] shadow-2xs"
                : "text-[#8C7A68]"
            }`}
          >
            <Map size={13} /> Sơ đồ sảnh
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddTableOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-[#E2D9CB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE]"
          >
            <Plus size={13} /> Thêm bàn
          </button>
          <button
            type="button"
            onClick={handleAutoSeat}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
          >
            <Sparkles size={13} /> Xếp chỗ nhanh
          </button>
          <button
            type="button"
            onClick={() => navigate(`${ROUTE_PATHS.DASHBOARD}/seating`)}
            title="Mở trong Dashboard"
            className="hidden rounded-full border border-[#E2D9CB] bg-white p-1.5 text-[#5E5042] hover:border-[#3B52DE] sm:inline-flex"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 items-start">
        {/* Left Sidebar (Guests | Tables) */}
        <aside className="sticky top-14 flex h-[calc(100vh-3.5rem)] w-72 shrink-0 flex-col border-r border-[#EAE6DF] bg-white">
          <div className="border-b border-[#F1ECE3] p-3">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F7F6F3] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSidebarTab("guests")}
                className={`rounded-lg py-1.5 ${
                  sidebarTab === "guests"
                    ? "bg-white text-[#2C2117] shadow-2xs"
                    : "text-[#8C7A68]"
                }`}
              >
                Khách mời
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab("tables")}
                className={`rounded-lg py-1.5 ${
                  sidebarTab === "tables"
                    ? "bg-white text-[#2C2117] shadow-2xs"
                    : "text-[#8C7A68]"
                }`}
              >
                Bàn tiệc ({tables.length})
              </button>
            </div>
            <div className="relative mt-3">
              <Search
                size={13}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9C8B7A]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm khách hoặc bàn..."
                className="w-full rounded-full border border-[#E2D9CB] bg-[#FAF8F5] py-1.5 pr-3 pl-8 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-3 text-xs">
            {sidebarTab === "guests" ? (
              <>
                <div>
                  <p className="mb-2 font-bold text-[#2C2117]">
                    Chưa xếp chỗ ({filteredUnseated.length})
                  </p>
                  <div className="space-y-1.5">
                    {filteredUnseated.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        draggable
                        onDragStart={() => setDragGuest(g)}
                        onDragEnd={() => setDragGuest(null)}
                        onClick={() => handleAssignGuest(g)}
                        title="Kéo thả vào ghế bất kỳ hoặc bấm để xếp vào bàn đang chọn"
                        className="flex w-full cursor-grab items-center justify-between rounded-xl border border-[#F1ECE3] bg-[#FAF8F5] px-2.5 py-2 text-left transition hover:border-[#3B52DE] hover:bg-white active:cursor-grabbing"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1F1A17] text-[9px] font-bold text-white">
                            {g.initials}
                          </span>
                          <span>
                            <span className="block font-semibold text-[#2C2117]">
                              {g.name}
                            </span>
                            <span className="text-[10px] text-emerald-600">
                              ● {g.status}
                            </span>
                          </span>
                        </span>
                        <Plus size={13} className="text-[#3B52DE]" />
                      </button>
                    ))}
                    {filteredUnseated.length === 0 && (
                      <p className="py-3 text-center text-[11px] text-[#8C7A68]">
                        Tất cả khách đã có chỗ ngồi!
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 font-bold text-[#2C2117]">
                    Đã xếp chỗ ({totalSeated})
                  </p>
                  <p className="text-[11px] text-[#8C7A68]">
                    Bấm vào bàn trên sơ đồ để xem hoặc chỉnh sửa ghế ngồi.
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                {tables.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTableId(t.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                      selectedTableId === t.id
                        ? "border-[#3B52DE] bg-[#EEF2FF]/60"
                        : "border-[#F1ECE3] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <span className="font-semibold text-[#2C2117]">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-[#6D5B4B] tabular-nums">
                      {t.guests.length}/{t.capacity}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Canvas: Floor Plan or List View */}
        <main className="relative min-h-[calc(100vh-3.5rem)] min-w-0 flex-1 overflow-auto p-6">
          {viewMode === "floor" ? (
            <div
              className="mx-auto max-w-5xl rounded-3xl border border-[#E6DFD3] bg-white p-8 shadow-sm transition-transform"
              style={{
                backgroundImage:
                  "radial-gradient(#E5DED2 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              {/* Top Landmarks (Bar, Sweetheart Table, DJ/Band) */}
              <div className="mb-10 grid grid-cols-3 items-center gap-6">
                <div className="rounded-xl border border-dashed border-[#D6CFC4] bg-[#FAF8F5]/90 py-4 text-center text-xs font-semibold text-[#7D6D5E]">
                  Quầy Bar
                </div>
                <div className="rounded-xl border border-[#2C2117]/20 bg-[#FAF8F5] py-3 text-center shadow-2xs">
                  <div className="mb-1 flex justify-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1F1A17] text-[9px] font-bold text-white">
                      CR
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1F1A17] text-[9px] font-bold text-white">
                      CD
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#2C2117]">
                    Bàn Cô Dâu & Chú Rể
                  </p>
                  <p className="text-[10px] text-[#8C7A68]">2/2</p>
                </div>
                <div className="rounded-xl border border-dashed border-[#D6CFC4] bg-[#FAF8F5]/90 py-4 text-center text-xs font-semibold text-[#7D6D5E]">
                  DJ / Âm thanh
                </div>
              </div>

              {/* Dance Floor Center Strip */}
              <div className="mx-auto mb-10 max-w-md rounded-2xl border border-dashed border-[#D6CFC4] bg-[#FAF8F5]/80 py-5 text-center text-xs font-semibold tracking-wider text-[#7D6D5E] uppercase">
                Sân khấu & Sàn nhảy (Dance Floor)
              </div>

              {/* Round Tables Grid with Surrounding Circular Seats */}
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {tables.map((t) => {
                  const isSelected = selectedTableId === t.id;
                  const seats = Array.from({ length: t.capacity });
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTableId(t.id)}
                      className="relative flex cursor-pointer flex-col items-center justify-center py-6"
                    >
                      {isSelected && (
                        <div className="ew-zoom-in absolute -top-3 z-20 flex items-center gap-2 rounded-full bg-[#1F1A17] px-3 py-1 text-[10px] font-semibold text-white shadow-lg">
                          <span>{t.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTable({
                                id: t.id,
                                name: t.name,
                                capacity: t.capacity,
                              });
                            }}
                            title="Sửa tên & số ghế"
                            className="hover:text-[#93C5FD]"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateTable(t);
                            }}
                            title="Nhân đôi"
                            className="hover:text-[#93C5FD]"
                          >
                            <Copy size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTable(t.id);
                            }}
                            title="Xoá bàn"
                            className="hover:text-rose-400"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )}

                      <div className="relative flex h-44 w-44 items-center justify-center">
                        {/* Center Round Table */}
                        <div
                          className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 bg-[#FAF8F5] text-center shadow-sm transition ${
                            isSelected
                              ? "border-[#3B52DE] ring-4 ring-[#3B52DE]/15"
                              : "border-[#D6CFC4]"
                          }`}
                        >
                          <p className="px-2 text-[11px] leading-tight font-bold text-[#2C2117]">
                            {t.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#8C7A68] tabular-nums">
                            {t.guests.filter(Boolean).length}/{t.capacity}
                          </p>
                        </div>

                        {/* Surrounding Circular Seats (Click or Drop to Assign!) */}
                        {seats.map((_, idx) => {
                          const angle = (idx / t.capacity) * 2 * Math.PI - Math.PI / 2;
                          const radius = 68;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          const initials = t.guests[idx];
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTableId(t.id);
                                setSeatPicker({ tableId: t.id, seatIdx: idx });
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (dragGuest) {
                                  handlePlaceAtSeat(
                                    t.id,
                                    idx,
                                    dragGuest,
                                    dragGuest.id
                                  );
                                  setDragGuest(null);
                                }
                              }}
                              title={
                                initials
                                  ? `Ghế ${idx + 1}: ${initials} (Bấm để đổi/gỡ)`
                                  : `Ghế ${idx + 1} trống (Bấm hoặc kéo khách vào)`
                              }
                              style={{
                                transform: `translate(${x}px, ${y}px)`,
                              }}
                              className={`absolute flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold shadow-2xs transition hover:scale-115 ${
                                initials
                                  ? "bg-[#1F1A17] text-white hover:bg-[#3B52DE]"
                                  : "border border-dashed border-[#C9BFB0] bg-white text-[#9C8B7A] hover:border-[#3B52DE] hover:text-[#3B52DE]"
                              }`}
                            >
                              {initials || idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-[#E6DFD3] bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#2C2117]">
                      {t.name}
                    </h3>
                    <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-xs font-semibold text-[#5E5042]">
                      {t.guests.length}/{t.capacity} ghế
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.guests.map((g, i) => (
                      <span
                        key={`${g}-${i}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F1A17] text-[10px] font-bold text-white"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom-Right Zoom Pill (WithJoy Style) */}
          {viewMode === "floor" && (
            <div className="fixed right-6 bottom-6 z-20 flex items-center gap-2 rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-semibold shadow-md">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                className="rounded-full p-1 hover:bg-[#FAF8F5]"
              >
                <Minus size={13} />
              </button>
              <span className="w-10 text-center tabular-nums">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(130, z + 10))}
                className="rounded-full p-1 hover:bg-[#FAF8F5]"
              >
                <Plus size={13} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Table Modal */}
      <Modal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        title="Thêm bàn tiệc mới"
        size="sm"
      >
        <form onSubmit={handleAddTable} className="space-y-3 text-xs">
          <input
            type="text"
            placeholder="Tên bàn (VD: Bàn 7 · Gia đình cô dâu)"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            autoFocus
          />
          <input
            type="number"
            min={2}
            max={14}
            value={newTableCap}
            onChange={(e) => setNewTableCap(e.target.value)}
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
          />
            <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddTableOpen(false)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2 font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white hover:bg-[#2F43C2]"
            >
              Thêm bàn
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Table Modal */}
      <Modal
        isOpen={Boolean(editingTable)}
        onClose={() => setEditingTable(null)}
        title="Chỉnh sửa bàn tiệc"
        size="sm"
      >
        {editingTable && (
          <form onSubmit={handleSaveEditTable} className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#5E5042]">
                Tên bàn
              </label>
              <input
                type="text"
                value={editingTable.name}
                onChange={(e) =>
                  setEditingTable({ ...editingTable, name: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5E5042]">
                Số ghế (2 - 14)
              </label>
              <input
                type="number"
                min={2}
                max={14}
                value={editingTable.capacity}
                onChange={(e) =>
                  setEditingTable({ ...editingTable, capacity: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTable(null)}
                className="rounded-lg border border-[#E2D9CB] px-4 py-2 font-medium"
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white hover:bg-[#2F43C2]"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Interactive Seat Picker Modal */}
      <Modal
        isOpen={Boolean(seatPicker)}
        onClose={() => setSeatPicker(null)}
        title={
          activeSeatTable && seatPicker
            ? `${activeSeatTable.name} · Ghế số ${seatPicker.seatIdx + 1}`
            : "Chọn chỗ ngồi"
        }
        size="sm"
      >
        {seatPicker && activeSeatTable && (
          <div className="space-y-4 text-xs">
            {activeSeatOccupant ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] p-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F1A17] text-[10px] font-bold text-white">
                      {activeSeatOccupant}
                    </span>
                    <div>
                      <p className="font-bold text-[#2C2117]">
                        Đang ngồi: {activeSeatOccupant}
                      </p>
                      <p className="text-[11px] text-[#8C7A68]">
                        Ghế số {seatPicker.seatIdx + 1}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFromSeat(
                        seatPicker.tableId,
                        seatPicker.seatIdx
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 font-semibold text-rose-600 hover:bg-rose-100"
                  >
                    <UserMinus size={13} /> Gỡ khỏi ghế
                  </button>
                </div>

                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5E5042]">
                  <MoveHorizontal size={13} className="text-[#3B52DE]" />
                  Hoặc đổi sang khách khác vào ghế này:
                </p>
              </div>
            ) : (
              <p className="text-[#6D5B4B]">
                Chọn khách mời chưa xếp chỗ hoặc nhập tên khách để xếp vào{" "}
                <b>ghế số {seatPicker.seatIdx + 1}</b>:
              </p>
            )}

            <div className="max-h-44 space-y-1.5 overflow-y-auto">
              {unseated.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() =>
                    handlePlaceAtSeat(
                      seatPicker.tableId,
                      seatPicker.seatIdx,
                      g,
                      g.id
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-[#EFEAE1] bg-white px-3 py-2 text-left transition hover:border-[#3B52DE] hover:bg-[#FAF8F5]"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3B52DE] text-[9px] font-bold text-white">
                      {g.initials}
                    </span>
                    <span className="font-semibold text-[#2C2117]">
                      {g.name}
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#3B52DE]">
                    Chọn
                  </span>
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customGuestName.trim()) return;
                const parts = customGuestName.trim().split(/\s+/);
                const initials =
                  parts.length >= 2
                    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                    : customGuestName.trim().slice(0, 2).toUpperCase();
                handlePlaceAtSeat(
                  seatPicker.tableId,
                  seatPicker.seatIdx,
                  { name: customGuestName.trim(), initials },
                  null
                );
              }}
              className="flex gap-2 border-t border-[#F1ECE3] pt-3"
            >
              <input
                type="text"
                value={customGuestName}
                onChange={(e) => setCustomGuestName(e.target.value)}
                placeholder="Hoặc nhập tên khách mới..."
                className="flex-1 rounded-xl border border-[#E2D9CB] px-3 py-1.5 text-xs outline-none focus:border-[#3B52DE]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#3B52DE] px-3 py-1.5 font-semibold text-white hover:bg-[#2F43C2]"
              >
                Xếp vào ghế
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
