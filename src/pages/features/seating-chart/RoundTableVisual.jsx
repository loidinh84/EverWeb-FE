import { X } from "lucide-react";
import { getInitials } from "./constants";

/**
 * Thành phần Sơ đồ Bàn tròn (Round Table Floor Plan Visual)
 * Vẽ đĩa bàn tròn ở trung tâm và các ghế ngồi hình tròn bao quanh theo hình học lượng giác
 */
export default function RoundTableVisual({
  table,
  isSelected,
  onSelectTable,
  onOpenMenu,
  onSeatClick,
  onRemoveSeat,
}) {
  const capacity = table.capacity || 8;
  const seatedCount = table.guests.filter(Boolean).length;
  const isFull = seatedCount >= capacity;

  return (
    <div
      onClick={onSelectTable}
      className={`relative flex flex-col items-center justify-center p-5 rounded-3xl transition-all cursor-pointer ${
        isSelected
          ? "bg-white ring-2 ring-[#1F1A17] shadow-md border border-stone-300"
          : "bg-white hover:bg-stone-50/50 border border-stone-200 hover:border-stone-400 shadow-2xs"
      }`}
    >
      {/* Khung chứa bàn tròn và các ghế xung quanh */}
      <div className="relative w-56 h-56 flex items-center justify-center my-2">
        {/* Đĩa bàn tròn ở giữa — Bấm để mở Thực đơn bàn */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectTable();
            onOpenMenu?.();
          }}
          title="Bấm vào trung tâm bàn để xem & chọn thực đơn"
          className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center text-center p-2 transition-all cursor-pointer hover:border-[#3B52DE] ${
            isSelected
              ? "border-[#1F1A17] bg-stone-50/80 shadow-inner"
              : "border-stone-200 bg-white shadow-2xs"
          }`}
        >
          <span className="text-xs font-bold text-[#1F1A17] line-clamp-1">
            {table.name.split("·")[0].trim()}
          </span>
          <span className="text-[10px] text-stone-500 line-clamp-1">
            {table.name.includes("·") ? table.name.split("·")[1].trim() : ""}
          </span>
          <span
            className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isFull ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
            }`}
          >
            {seatedCount}/{capacity} ghế
          </span>
          <span className="mt-0.5 text-[9px] font-semibold text-[#3B52DE]">
            Thực đơn ▾
          </span>
        </button>

        {/* Các ghế ngồi hình tròn bao quanh bàn tròn */}
        {Array.from({ length: capacity }).map((_, seatIdx) => {
          const guestName = table.guests[seatIdx];
          const angle = (seatIdx / capacity) * 2 * Math.PI - Math.PI / 2;
          const leftPercent = 50 + 40 * Math.cos(angle);
          const topPercent = 50 + 40 * Math.sin(angle);

          return (
            <div
              key={seatIdx}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (guestName) {
                  onRemoveSeat(table.id, seatIdx);
                } else {
                  onSeatClick(table.id, seatIdx);
                }
              }}
              title={
                guestName
                  ? `Ghế ${seatIdx + 1}: ${guestName} (Nhấp để bỏ khách)`
                  : `Ghế ${seatIdx + 1}: Trống (Nhấp để xếp khách)`
              }
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-2xs group ${
                guestName
                  ? "bg-[#1F1A17] text-white hover:bg-rose-600 hover:scale-110 cursor-pointer"
                  : "border-2 border-dashed border-stone-300 bg-white text-stone-400 hover:border-[#1F1A17] hover:text-[#1F1A17] hover:bg-stone-50 cursor-pointer"
              }`}
            >
              {guestName ? (
                <>
                  <span className="group-hover:hidden">{getInitials(guestName)}</span>
                  <X size={12} className="hidden group-hover:block" />
                </>
              ) : (
                <span>{seatIdx + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Thông tin chân bàn */}
      <div className="text-center mt-1">
        <p className="text-xs font-semibold text-[#1F1A17]">{table.name}</p>
        <p className="text-[11px] text-stone-500">
          {seatedCount === 0
            ? "Chưa có khách"
            : seatedCount >= capacity
            ? "Đã đủ khách"
            : `Còn trống ${capacity - seatedCount} chỗ`}
        </p>
      </div>
    </div>
  );
}
