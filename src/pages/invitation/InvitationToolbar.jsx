import { ArrowLeft, BarChart3, Edit3, Eye, QrCode } from "lucide-react";
import { ROUTE_PATHS } from "../../constants/roles";

export default function InvitationToolbar({
  navigate,
  wedding,
  isPublished,
  publicInvitationUrl,
  onOpenShare,
  onOpenStats,
  onOpenEdit,
}) {
  return (
    <aside
      aria-label="Thanh công cụ quản lý thiệp"
      className="fixed top-3 left-0 right-0 z-50 px-2 sm:px-4 pointer-events-none"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between pointer-events-auto gap-2">
        {/* Nhóm trái: Nút quay lại, Tên sự kiện hiện tại, và trạng thái Xuất bản Live */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-stone-200 text-xs">
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.EVENT_HUB)}
            className="inline-flex items-center gap-1 font-semibold text-stone-700 hover:text-black transition cursor-pointer"
            title="Quay lại Trung tâm sự kiện"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Hub</span>
          </button>
          <span className="h-3.5 w-px bg-stone-200" />
          <span
            className="font-bold text-stone-900 hidden sm:inline max-w-[160px] truncate"
            title={`Sự kiện đang chọn: ${wedding.groom_name} & ${wedding.bride_name}`}
          >
            {wedding.groom_name} & {wedding.bride_name}
          </span>
          <span className="h-3.5 w-px bg-stone-200 hidden sm:inline" />
          <button
            type="button"
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 cursor-pointer px-1 py-0.5 rounded-full hover:bg-emerald-50 transition"
            title="Nhấn để xem trạng thái xuất bản & lấy link"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPublished ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
              }`}
            />
            <span
              className={`font-semibold text-[11px] ${
                isPublished ? "text-emerald-700" : "text-stone-500"
              }`}
            >
              {isPublished ? "Đã xuất bản (Live)" : "Bản nháp"}
            </span>
          </button>
        </div>

        {/* Nhóm phải: Thống kê xem/RSVP, Lấy Link & QR, Xem bản khách, Chỉnh sửa thiệp */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-full shadow-lg border border-stone-200 text-xs">
          <button
            type="button"
            onClick={onOpenStats}
            className="inline-flex items-center gap-1 font-semibold text-stone-700 hover:text-stone-900 transition cursor-pointer px-2 py-1 rounded-full hover:bg-amber-50"
            title="Kiểm tra số người đã click link và khách chưa phản hồi RSVP"
          >
            <BarChart3 size={13} className="text-amber-600" />
            <span className="hidden sm:inline font-medium">Thống kê RSVP</span>
          </button>

          <span className="h-3.5 w-px bg-stone-200" />

          <button
            type="button"
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 font-bold text-[#8C6D3F] hover:text-[#5E4726] transition cursor-pointer px-2.5 py-1 rounded-full bg-amber-50/70 hover:bg-amber-100/80 shadow-2xs"
            title="Lấy đường link xuất bản và mã QR vào thiệp này"
          >
            <QrCode size={13} />
            <span>Lấy Link & QR</span>
          </button>

          <span className="h-3.5 w-px bg-stone-200" />

          <button
            type="button"
            onClick={() => window.open(publicInvitationUrl, "_blank")}
            className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 transition cursor-pointer px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100/80 shadow-2xs"
            title="Mở tab mới xem đúng góc nhìn khách mời"
          >
            <Eye size={13} className="text-emerald-600" />
            <span className="hidden md:inline">Xem bản khách</span>
          </button>

          <span className="h-3.5 w-px bg-stone-200" />

          <button
            type="button"
            onClick={onOpenEdit}
            className="inline-flex items-center gap-1 font-medium text-stone-700 hover:text-black transition cursor-pointer px-1.5 py-1 rounded-full hover:bg-stone-100"
            title="Chỉnh sửa nội dung & ảnh thiệp"
          >
            <Edit3 size={13} />
            <span className="hidden md:inline">Sửa thiệp</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
