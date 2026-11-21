export default function TableStatsCard({ rows = [], onViewDetail }) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Thống kê tương tác theo bàn
      </h2>

      <div className="mt-3 divide-y divide-[#F1ECE3]">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between py-2.5 text-xs"
          >
            <div>
              <p className="font-semibold text-[#2C2117]">{row.name}</p>
              <p className="text-[11px] text-[#8C7A68] tabular-nums">
                {row.amount}
              </p>
            </div>
            <span className="font-semibold text-[#5E5042] tabular-nums">
              {row.photos}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewDetail}
        className="mt-3 w-full rounded-lg bg-[#EFEAE1] py-2 text-xs font-semibold text-[#3B2A1A] transition hover:bg-[#E5DEC9]"
      >
        Xem báo cáo chi tiết mừng cưới
      </button>
    </div>
  );
}
