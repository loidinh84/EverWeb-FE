import { CalendarDays } from "lucide-react";

const STATUS_STYLE = {
  due: { text: "Sắp đến hạn", className: "bg-[#FBF5EA] text-[#8A6121]" },
  pending: { text: "Chờ thanh toán", className: "bg-stone-100 text-stone-600" },
};

export default function UpcomingPaymentsCard({ payments = [], onViewAll }) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Lịch thanh toán sắp tới
      </h2>

      <div className="mt-3 divide-y divide-[#F1ECE3]">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-2 py-3"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <CalendarDays
                size={15}
                className="mt-0.5 shrink-0 text-[#9C8B7A]"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#2C2117]">
                  {p.title}
                </p>
                <p className="mt-0.5 text-[11px] text-[#8C7A68] tabular-nums">
                  Hạn: {p.dueDate} · {p.amount}
                </p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                STATUS_STYLE[p.status]?.className
              }`}
            >
              {STATUS_STYLE[p.status]?.text}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="mt-3 flex w-full items-center justify-center gap-1 border-t border-[#F1ECE3] pt-3 text-xs font-medium text-[#5E5042] hover:text-[#2C2117]"
      >
        Xem toàn bộ lịch thanh toán →
      </button>
    </div>
  );
}
