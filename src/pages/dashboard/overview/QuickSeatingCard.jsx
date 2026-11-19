const MINI_TABLES = [
  { id: 1, name: "Bàn 1", tone: "gold" },
  { id: 2, name: "Bàn 2", tone: "gold" },
  { id: 3, name: "Bàn 3", tone: "gold" },
  { id: 4, name: "Bàn 4", tone: "gold" },
  { id: 5, name: "Bàn 5", tone: "rose" },
  { id: 6, name: "Bàn 6", tone: "gold" },
  { id: 7, name: "Bàn 7", tone: "gold" },
  { id: 8, name: "Bàn 8", tone: "gold" },
  { id: 9, name: "Bàn 9", tone: "rose" },
  { id: 10, name: "Bàn 10", tone: "muted" },
  { id: 11, name: "Bàn 11", tone: "rose" },
  { id: 12, name: "Bàn 12", tone: "muted" },
];

const TONE_CLASSES = {
  gold: "border-[#D8BE8D] bg-[#FBF5EA] text-[#7A5622]",
  rose: "border-[#E6B8B8] bg-[#FDF2F2] text-[#8E4A4A]",
  muted: "border-[#D8D4CE] bg-[#F5F3F0] text-[#7D756D]",
};

export default function QuickSeatingCard({ onViewDetail }) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#2C2117]">
          Sơ đồ sảnh & Trạng thái bàn tiệc nhanh
        </h2>
        <button
          type="button"
          onClick={onViewDetail}
          className="text-xs font-medium text-[#6D5B4B] hover:text-[#2C2117]"
        >
          Xem sơ đồ chi tiết →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        {/* 12 mini tables */}
        <div className="grid grid-cols-4 gap-3 rounded-xl border border-[#F1ECE3] bg-[#FAF7F2] p-4 sm:grid-cols-6 md:col-span-8">
          {MINI_TABLES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={onViewDetail}
              className={`flex aspect-square items-center justify-center rounded-full border-2 text-[11px] font-semibold transition hover:scale-105 ${
                TONE_CLASSES[t.tone]
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Legend & seat summary */}
        <div className="space-y-3 md:col-span-4">
          <div className="space-y-2 text-xs text-[#5E5042]">
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#D8BE8D]" />
              Đã xác nhận: <b className="text-[#2C2117]">96</b>
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#E6B8B8]" />
              Chưa phản hồi: <b className="text-[#2C2117]">24</b>
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#C5A059]" />
              VIP
            </p>
          </div>

          <div className="rounded-lg border border-[#EFE6D6] bg-[#FAF7F2] p-3 text-xs">
            <p className="font-semibold text-[#2C2117] tabular-nums">
              Đã xếp 108 / 120 chỗ ngồi
            </p>
            <p className="mt-0.5 text-[11px] text-[#8C7A68]">
              (Còn 12 chỗ trống)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
