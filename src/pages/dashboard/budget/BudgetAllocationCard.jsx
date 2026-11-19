const ALLOCATION = [
  { label: "Ẩm thực", pct: 60, amount: "150.000.000 đ", color: "#A67C37" },
  { label: "Trang trí", pct: 18, amount: "45.000.000 đ", color: "#C5A059" },
  { label: "Âm thanh", pct: 10, amount: "25.000.000 đ", color: "#DFC796" },
  { label: "Trang phục & Ảnh", pct: 8, amount: "20.000.000 đ", color: "#8C9678" },
  { label: "Khác", pct: 4, amount: "10.000.000 đ", color: "#D6CFC4" },
];

export default function BudgetAllocationCard() {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const segments = ALLOCATION.reduce((acc, item) => {
    const prevEnd = acc.length ? acc[acc.length - 1].endPct : 0;
    acc.push({
      ...item,
      startPct: prevEnd,
      endPct: prevEnd + item.pct,
    });
    return acc;
  }, []);

  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Tỷ lệ phân bổ ngân sách
      </h2>

      {/* Donut chart */}
      <div className="my-4 flex justify-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {segments.map((seg) => {
              const dash = (seg.pct / 100) * circumference;
              const offset = -((seg.startPct / 100) * circumference);
              return (
                <circle
                  key={seg.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </svg>
          <div className="absolute text-center">
            <p className="text-xs font-bold text-[#2C2117] tabular-nums">
              250.000.000 đ
            </p>
            <p className="text-[10px] text-[#8C7A68]">Đã chi</p>
          </div>
        </div>
      </div>

      {/* Breakdown list */}
      <div className="space-y-2">
        {ALLOCATION.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 text-[#5E5042]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
            <div className="flex items-center gap-3 tabular-nums">
              <span className="text-[#8C7A68]">{item.pct.toFixed(1)}%</span>
              <span className="w-24 text-right font-semibold text-[#2C2117]">
                {item.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
