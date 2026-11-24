import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTE_PATHS } from "../../constants/roles";

/**
 * Suy luận metadata thương hiệu .EverWeb từ tiêu đề trang
 */
function getFeatureMeta(title = "") {
  const t = title.toLowerCase();
  if (t.includes("khách") || t.includes("guest")) {
    return { badge: "KHÁCH MỜI+" };
  }
  if (t.includes("liên hệ") || t.includes("contact")) {
    return { badge: "LIÊN HỆ+" };
  }
  if (t.includes("rsvp")) {
    return { badge: "RSVP+" };
  }
  if (t.includes("quà") || t.includes("registry")) {
    return { badge: "QUÀ MỪNG+" };
  }
  if (t.includes("lưu trú") || t.includes("di chuyển") || t.includes("travel")) {
    return { badge: "LƯU TRÚ+" };
  }
  if (t.includes("thiệp") || t.includes("invitation") || t.includes("stationery")) {
    return { badge: "THIỆP CƯỚI+" };
  }
  if (t.includes("album") || t.includes("photo") || t.includes("khoảnh khắc")) {
    return { badge: "ALBUM+" };
  }
  if (t.includes("lịch") || t.includes("schedule")) {
    return { badge: "LỊCH TRÌNH+" };
  }
  if (t.includes("bàn") || t.includes("seating")) {
    return { badge: "BÀN TIỆC+" };
  }
  return { badge: "TÍNH NĂNG+" };
}

/**
 * Khung layout chuẩn .EverWeb toàn màn hình cho các trang chức năng mở từ Trung tâm sự kiện (/hub).
 * Giữ nguyên không gian rộng rãi, header chuyên nghiệp với 1 nút quay lại duy nhất và badge nhận diện.
 */
export default function FeatureShell({
  title,
  subtitle,
  badgeText,
  wedding,
  actions,
  children,
}) {
  const navigate = useNavigate();
  const meta = useMemo(() => getFeatureMeta(title), [title]);
  const displayBadge = badgeText || meta.badge;

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1F1A17] font-sans antialiased">
      {/* Top Header: 1 nút quay lại duy nhất, không lặp lại */}
      <header className="h-14 flex items-center justify-between px-6 sm:px-10 border-b border-stone-200 bg-white sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          {/* Nút quay lại Trung tâm sự kiện duy nhất */}
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-black transition cursor-pointer shrink-0"
            title="Quay lại Trung tâm sự kiện"
          >
            <ArrowLeft size={15} />
            <span>Trung tâm sự kiện</span>
          </button>

          <span className="h-4 w-px bg-stone-200 shrink-0" />

          {/* Logo thương hiệu .EverWeb */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-display italic font-bold text-lg text-[#1F1A17]">
              .EverWeb
            </span>
            <span className="text-stone-300">|</span>
            <h1 className="text-sm font-semibold text-[#1F1A17] truncate max-w-[200px] sm:max-w-none">
              {title}
            </h1>
          </div>

          {/* Pill Badge */}
          <span className="rounded-md border border-stone-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase shrink-0">
            {displayBadge}
          </span>

          {/* Subtitle nếu có */}
          {subtitle && (
            <span className="hidden lg:inline text-xs text-stone-400 truncate max-w-[320px]">
              · {subtitle}
            </span>
          )}
        </div>

        {/* Action buttons của trang (Thêm mới, Lưu, Bộ lọc...) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      </header>

      {/* Nội dung chính toàn màn hình, thoáng đãng */}
      <main className="ew-slide-up mx-auto w-full max-w-[1440px] flex-1 px-6 sm:px-10 py-6 sm:py-8 bg-white text-[#1F1A17]">
        {children}
      </main>
    </div>
  );
}
