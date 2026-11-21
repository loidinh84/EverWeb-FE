export default function RecentGiftsCard({ gifts = [] }) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Giao dịch mừng cưới gần đây
      </h2>

      <div className="mt-3 divide-y divide-[#F1ECE3]">
        {gifts.map((gift) => (
          <div key={gift.id} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#2C2117]">{gift.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-[#8C7A68]">
                {gift.message}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-bold text-[#2C2117] tabular-nums">
                {gift.amount}
              </p>
              <p className="mt-0.5 text-[10px] text-[#9C8B7A]">{gift.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
