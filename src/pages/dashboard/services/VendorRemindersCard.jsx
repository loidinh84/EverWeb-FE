import { Mail, Phone } from "lucide-react";

export default function VendorRemindersCard({
  reminders = [],
  onCall,
  onMessage,
  onViewAll,
}) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Nhắc nhở & Liên hệ sắp tới
      </h2>

      <div className="mt-3 divide-y divide-[#F1ECE3]">
        {reminders.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#2C2117]">
                {item.title}
              </p>
              <p className="mt-0.5 text-[11px] text-[#8C7A68]">
                Đối tác: {item.vendor} · Hạn: {item.dueDate}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onCall?.(item)}
                aria-label={`Gọi ${item.vendor}`}
                className="rounded-md p-1.5 text-[#8C7A68] hover:bg-[#FAF7F2] hover:text-[#2C2117]"
              >
                <Phone size={13} />
              </button>
              <button
                type="button"
                onClick={() => onMessage?.(item)}
                aria-label={`Nhắn ${item.vendor}`}
                className="rounded-md p-1.5 text-[#8C7A68] hover:bg-[#FAF7F2] hover:text-[#2C2117]"
              >
                <Mail size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="mt-3 flex w-full items-center justify-center gap-1 border-t border-[#F1ECE3] pt-3 text-xs font-medium text-[#5E5042] hover:text-[#2C2117]"
      >
        Xem toàn bộ danh bạ đối tác →
      </button>
    </div>
  );
}
