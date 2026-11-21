const CATEGORIES = [
  { name: "Ẩm thực", spent: "150.000.000 đ", total: "150.000.000 đ", pct: 100, label: "100% - Đã chi" },
  { name: "Trang trí & Hoa", spent: "45.000.000 đ", total: "55.000.000 đ", pct: 81.8, label: "81.8%" },
  { name: "Âm thanh & MC", spent: "25.000.000 đ", total: "25.000.000 đ", pct: 100, label: "100%" },
  { name: "Trang phục & Ảnh", spent: "20.000.000 đ", total: "35.000.000 đ", pct: 57.1, label: "57.1%" },
];

export default function BudgetProgressCard({ onViewDetail }) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#2C2117]">
          Tiến độ ngân sách theo hạng mục
        </h2>
        <button
          type="button"
          onClick={onViewDetail}
          className="text-xs font-medium text-[#6D5B4B] hover:text-[#2C2117]"
        >
          Chi tiết ngân sách →
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-32 font-medium text-[#5E5042]">
                  {cat.name}
                </span>
                <span className="tabular-nums text-[#8C7A68]">
                  <b className="text-[#2C2117]">{cat.spent}</b> / {cat.total}
                </span>
              </div>
              <span className="font-semibold text-[#2C2117] tabular-nums">
                {cat.label}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFEAE1]">
              <div
                className="h-full rounded-full bg-[#C5A059]"
                style={{ width: `${cat.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
