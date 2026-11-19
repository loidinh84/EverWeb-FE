import { useState } from "react";
import {
  Armchair,
  ArrowUpRight,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock,
  Crown,
  DoorOpen,
  Download,
  Minus,
  MoreHorizontal,
  Plus,
  Sparkles,
  Users,
  Utensils,
  Volume2,
  X,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";

const INITIAL_TABLES = [
  {
    id: 1,
    name: "Bàn 01",
    shortName: "Bàn 1",
    label: "Nhà cô dâu",
    vip: true,
    capacity: 10,
    guests: [
      { id: "g1", name: "Ông Nguyễn Văn Hùng", status: "confirmed" },
      { id: "g2", name: "Bà Trần Thị Mai", status: "confirmed" },
    ],
    assignedCount: 10,
    pendingCount: 0,
  },
  { id: 2, name: "Bàn 02", shortName: "Bàn 2", vip: false, capacity: 10, assignedCount: 5, pendingCount: 3, guests: [] },
  { id: 3, name: "Bàn 03", shortName: "Bàn 3", vip: true, capacity: 10, assignedCount: 9, pendingCount: 1, guests: [] },
  {
    id: 4,
    name: "Bàn 04",
    shortName: "Bàn 4",
    vip: false,
    capacity: 10,
    assignedCount: 3,
    pendingCount: 4,
    guests: [
      { id: "g41", name: "Nguyễn Thị Lan", status: "confirmed" },
      { id: "g42", name: "Trần Văn Minh", status: "pending" },
      { id: "g43", name: "Lê Thị Hoa", status: "confirmed" },
    ],
  },
  { id: 5, name: "Bàn 05", shortName: "Bàn 5", vip: false, capacity: 10, assignedCount: 7, pendingCount: 2, guests: [] },
  { id: 6, name: "Bàn 06", shortName: "Bàn 6", vip: false, capacity: 10, assignedCount: 6, pendingCount: 2, guests: [] },
  { id: 7, name: "Bàn 07", shortName: "Bàn 7", vip: false, capacity: 10, assignedCount: 10, pendingCount: 0, guests: [] },
  { id: 8, name: "Bàn 08", shortName: "Bàn 8", vip: false, capacity: 10, assignedCount: 10, pendingCount: 0, guests: [] },
  { id: 9, name: "Bàn 09", shortName: "Bàn 9", vip: false, capacity: 10, assignedCount: 8, pendingCount: 2, guests: [] },
  { id: 10, name: "Bàn 10", shortName: "Bàn 10", vip: false, capacity: 10, assignedCount: 8, pendingCount: 1, guests: [] },
  { id: 11, name: "Bàn 11", shortName: "Bàn 11", vip: false, capacity: 10, assignedCount: 9, pendingCount: 1, guests: [] },
  { id: 12, name: "Bàn 12", shortName: "Bàn 12", vip: false, capacity: 10, assignedCount: 8, pendingCount: 0, guests: [] },
];

const EXPENSES = [
  { label: "Ẩm thực", amount: "150.000.000 đ", icon: Utensils },
  { label: "Trang trí", amount: "55.000.000 đ", icon: Sparkles },
  { label: "Âm thanh, ánh sáng", amount: "25.000.000 đ", icon: Volume2 },
  { label: "Xe hoa, ảnh", amount: "20.000.000 đ", icon: Car },
];

export default function SeatingPlanPage({ selectedWedding, onOpenBudget }) {
  const toast = useToast();
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [activeTableId, setActiveTableId] = useState(4);
  const [zoom, setZoom] = useState(100);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");

  const activeTable = tables.find((t) => t.id === activeTableId) || tables[0];

  const kpis = [
    { label: "Tổng khách mời", value: "120", unit: "khách", icon: Users },
    { label: "Đã xác nhận", value: "96", unit: "80% khách mời", icon: CheckCircle2 },
    { label: "Chưa phản hồi", value: "24", unit: "chờ xác nhận", icon: Clock },
    { label: "Đã xếp chỗ", value: "108", unit: "/ 120 chỗ", icon: Armchair },
    { label: "Đã rời bàn", value: "8", unit: "/ 120 chỗ", icon: Armchair },
  ];

  const handleRemoveGuest = (guestId) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTable.id
          ? {
              ...t,
              guests: t.guests.filter((g) => g.id !== guestId),
              assignedCount: Math.max(0, t.assignedCount - 1),
            }
          : t
      )
    );
    toast.info(`Đã bỏ khách khỏi ${activeTable.shortName}`);
  };

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTable.id
          ? {
              ...t,
              guests: [
                ...t.guests,
                { id: `g-${Date.now()}`, name: newGuestName.trim(), status: "confirmed" },
              ],
              assignedCount: Math.min(t.capacity, t.assignedCount + 1),
            }
          : t
      )
    );
    toast.success(`Đã thêm ${newGuestName.trim()} vào ${activeTable.shortName}`);
    setNewGuestName("");
    setIsAddGuestOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium tracking-widest text-[#9C8B7A] uppercase">
            Ngày chung đôi · Lịch & bàn
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Mỗi chỗ ngồi, một người thương.
          </h1>
          <p className="mt-1 text-xs text-[#8C7A68]">
            {selectedWedding?.couple || "Lê Cát Linh & Nam"} ·{" "}
            {selectedWedding?.hall || "Sảnh Hoa Mai"} ·{" "}
            {selectedWedding?.time || "18:00, 20/12/2026"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Đang xuất sơ đồ bàn tiệc...")}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059] hover:bg-[#FCF9F3]"
        >
          <Download size={14} className="text-[#7D6D5E]" />
          Xuất sơ đồ
        </button>
      </div>

      {/* 5 KPIs — clean hairline cards without loud icon blobs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map(({ label, value, unit, icon: Icon }) => (
          <div
            key={label}
            className="flex items-start justify-between rounded-xl border border-[#E6DFD3] bg-white px-5 py-4"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#8C7A68]">{label}</p>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-[#2C2117] tabular-nums">
                  {value}
                </span>
                <span className="truncate text-xs text-[#9C8B7A]">{unit}</span>
              </div>
            </div>
            <Icon size={18} className="mt-0.5 shrink-0 text-[#B8A590]" />
          </div>
        ))}
      </div>

      {/* Main 3-Column Bento Grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Left: Sơ đồ xếp bàn (5/12) */}
        <div className="rounded-xl border border-[#E6DFD3] bg-white p-6 lg:col-span-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#2C2117]">Sơ đồ xếp bàn</h2>
              <p className="mt-0.5 text-xs text-[#8C7A68]">
                Chọn bàn để xem và sắp xếp khách mời
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.info("Tính năng thêm bàn mới sẽ kết nối API")}
              className="inline-flex items-center gap-1 rounded-lg bg-[#2F241D] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#44352B]"
            >
              <Plus size={13} />
              Thêm bàn
            </button>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7D6D5E]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Đã xác nhận
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                Chưa phản hồi
              </span>
              <span className="inline-flex items-center gap-1">
                <Crown size={11} className="text-[#B88B3E]" />
                VIP
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-medium text-[#5E5042]">
              Sảnh Hoa Mai <ChevronDown size={12} />
            </span>
          </div>

          {/* Floor Canvas */}
          <div className="mt-3 rounded-xl border border-[#EFEAE1] bg-[#FAF7F2] p-4">
            <div className="mx-auto mb-4 w-32 rounded-md border border-[#E6DDD0] bg-[#EFE8DC] py-1 text-center text-[10px] font-semibold tracking-widest text-[#7D6D5E] uppercase">
              Sân khấu
            </div>

            <div
              className="mx-auto grid max-w-[460px] grid-cols-4 gap-3 transition-transform"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            >
              {tables.map((t) => {
                const isSelected = t.id === activeTableId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTableId(t.id)}
                    className={`flex aspect-square flex-col items-center justify-center rounded-full border-[1.5px] bg-white p-1 text-center transition ${
                      isSelected
                        ? "border-[#B88B3E] bg-[#FBF6EC] shadow-xs"
                        : t.vip
                          ? "border-[#D8BE8D] bg-[#FDF9F1] hover:border-[#B88B3E]"
                          : "border-[#C5CBB8] hover:border-[#8C9678]"
                    }`}
                  >
                    {t.vip && <Crown size={12} className="mb-0.5 text-[#B88B3E]" />}
                    <span className="text-xs font-semibold text-[#2C2117]">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-[#8C7A68] tabular-nums">
                      {t.assignedCount}/{t.capacity}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-[#8C7A68]">
              <span>Sảnh Hoa Mai · {tables.length} bàn</span>
              <span className="inline-flex items-center gap-1 font-medium">
                <DoorOpen size={12} /> Lối vào
              </span>
              <div className="inline-flex items-center gap-1 rounded-md border border-[#E6DDD0] bg-white px-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(80, z - 10))}
                  aria-label="Thu nhỏ"
                  className="p-0.5 hover:text-[#2C2117]"
                >
                  <Minus size={11} />
                </button>
                <span className="text-[10px] tabular-nums">{zoom}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(110, z + 10))}
                  aria-label="Phóng to"
                  className="p-0.5 hover:text-[#2C2117]"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Highlighted table footer */}
          <div className="mt-3 flex items-center justify-between rounded-lg border border-[#EFE6D6] bg-[#FAF7F2] px-3.5 py-2.5">
            <div className="flex items-center gap-2.5">
              <Crown size={15} className="shrink-0 text-[#B88B3E]" />
              <div>
                <p className="text-xs font-semibold text-[#2C2117]">
                  {activeTable.name}
                  {activeTable.label ? ` · ${activeTable.label}` : ""}
                </p>
                <p className="text-[11px] text-[#8C7A68]">
                  {activeTable.assignedCount} khách đã có chỗ ·{" "}
                  {activeTable.vip ? "Bàn danh dự" : "Bàn tiệc"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.info(`Đang xem danh sách khách ${activeTable.name}`)}
              className="text-xs font-medium text-[#6D5B4B] hover:text-[#2C2117]"
            >
              Xem khách →
            </button>
          </div>
        </div>

        {/* Middle: Ngân sách tiệc cưới (4/12) */}
        <div className="rounded-xl border border-[#E6DFD3] bg-white p-6 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#2C2117]">Ngân sách tiệc cưới</h2>
            <button
              type="button"
              onClick={onOpenBudget}
              aria-label="Chi tiết ngân sách"
              className="rounded-md p-1 text-[#8C7A68] hover:bg-[#FAF7F2]"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          <p className="mt-3 text-xs text-[#8C7A68]">Ngân sách của hai bạn</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-[#2C2117] tabular-nums">
            450.000.000 <span className="text-base font-medium text-[#8C7A68]">đ</span>
          </p>

          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFEAE1]">
              <div className="h-full w-[55.6%] rounded-full bg-[#C5A059]" />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-[#8C7A68]">
              <span>Đã dùng 55,6%</span>
              <span className="font-medium text-emerald-700">Đúng kế hoạch</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-y border-[#F1ECE3] py-3">
            <div>
              <p className="text-[11px] text-[#8C7A68]">Đã chi</p>
              <p className="mt-0.5 text-sm font-semibold text-[#2C2117] tabular-nums">
                250.000.000 đ
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8C7A68]">Còn lại</p>
              <p className="mt-0.5 text-sm font-semibold text-[#2C2117] tabular-nums">
                200.000.000 đ
              </p>
            </div>
          </div>

          <p className="mt-4 text-[10px] font-semibold tracking-wider text-[#9C8B7A] uppercase">
            Các khoản đã chi
          </p>
          <div className="mt-2 divide-y divide-[#F5F1EA]">
            {EXPENSES.map(({ label, amount, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-[#5E5042]">
                  <Icon size={15} className="text-[#9C8B7A]" />
                  <span>{label}</span>
                </div>
                <span className="font-semibold text-[#2C2117] tabular-nums">
                  {amount}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenBudget}
            className="mt-3 flex w-full items-center justify-center gap-1 border-t border-[#F1ECE3] pt-3 text-xs font-medium text-[#5E5042] hover:text-[#2C2117]"
          >
            Xem các khoản chi <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Right: Chi tiết bàn + Danh sách bàn (3/12) */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-xl border border-[#E6DFD3] bg-white p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-[#2C2117]">
                {activeTable.shortName}
              </h2>
              <span className="text-xs text-[#8C7A68] tabular-nums">
                {activeTable.assignedCount}/{activeTable.capacity} chỗ
              </span>
            </div>

            <p className="mt-3 text-[10px] font-semibold tracking-wider text-[#9C8B7A] uppercase">
              Khách tại bàn
            </p>

            <div className="mt-2 divide-y divide-[#F1ECE3]">
              {activeTable.guests.length === 0 ? (
                <p className="py-5 text-center text-xs text-[#9C8B7A]">
                  Chưa có khách được gán chi tiết
                </p>
              ) : (
                activeTable.guests.map((g) => (
                  <div
                    key={g.id}
                    className="group flex items-center justify-between gap-2 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            g.status === "confirmed" ? "bg-emerald-600" : "bg-[#C5A059]"
                          }`}
                        />
                        <p className="truncate text-xs font-medium text-[#2C2117]">
                          {g.name}
                        </p>
                      </div>
                      <p className="mt-0.5 pl-3 text-[11px] text-[#8C7A68]">
                        {g.status === "confirmed" ? "Đã xác nhận" : "Chưa phản hồi"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(g.id)}
                      title="Bỏ khỏi bàn"
                      aria-label={`Bỏ ${g.name} khỏi bàn`}
                      className="rounded-md p-1 text-[#9C8B7A] transition hover:bg-[#FAF7F2] hover:text-rose-600"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsAddGuestOpen(true)}
              className="mt-3 w-full rounded-lg bg-[#C5A059] py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
            >
              + Thêm khách vào bàn
            </button>
          </div>

          <div className="rounded-xl border border-[#E6DFD3] bg-white p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-[#2C2117]">Danh sách bàn</h2>
              <span className="text-xs text-[#8C7A68]">{tables.length} bàn</span>
            </div>

            <div className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
              {tables.map((t) => {
                const isSelected = t.id === activeTableId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTableId(t.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                      isSelected
                        ? "bg-[#FBF5EA] font-semibold text-[#2C2117]"
                        : "text-[#5E5042] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{t.shortName}</span>
                      {t.vip && (
                        <span className="rounded border border-[#DFC796] bg-[#FDF8EE] px-1.5 py-0.2 text-[9px] font-semibold text-[#8A6121]">
                          VIP
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#8C7A68] tabular-nums">
                      {t.assignedCount} · {t.pendingCount} chờ /{t.capacity}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm khách vào bàn */}
      <Modal
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        title={`Thêm khách vào ${activeTable.shortName}`}
        size="sm"
      >
        <form onSubmit={handleAddGuest} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Họ tên khách mời
            </label>
            <input
              type="text"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              placeholder="Ví dụ: Phạm Văn Hùng"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddGuestOpen(false)}
              className="rounded-lg border border-[#E6DDD0] px-4 py-2 text-xs font-medium text-[#5E5042]"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2F241D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#44352B]"
            >
              Thêm vào bàn
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
