const ACTIVITIES = [
  { id: "a1", text: "Nguyễn Văn A gửi 1.000.000 đ kèm lời chúc", time: "2 phút trước", dot: "bg-emerald-600" },
  { id: "a2", text: "Trần Thị B xác nhận tham gia", time: "15 phút trước", dot: "bg-[#C5A059]" },
  { id: "a3", text: "4 ảnh mới được khách tải lên album", time: "1 giờ trước", dot: "bg-sky-600" },
  { id: "a4", text: "Đã đặt cọc 10M cho Meraki Studio", time: "Hôm qua", dot: "bg-[#8C7A68]" },
];

export default function RecentActivityCard() {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Hoạt động & Tin mới nhất
      </h2>

      <div className="mt-3 divide-y divide-[#F1ECE3]">
        {ACTIVITIES.map((act) => (
          <div
            key={act.id}
            className="flex items-start justify-between gap-3 py-3 first:pt-1 last:pb-0"
          >
            <div className="flex min-w-0 items-start gap-2">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${act.dot}`}
              />
              <p className="text-xs text-[#2C2117]">{act.text}</p>
            </div>
            <span className="shrink-0 text-[11px] text-[#9C8B7A]">
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
