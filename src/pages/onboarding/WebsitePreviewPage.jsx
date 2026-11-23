import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { extractApiError } from "../../services/api";
import weddingApi from "../../services/weddingApi";
import heroWedding from "../../assets/image/hero-wedding.jpg";

const PREVIEW_NAV = [
  "Lời chào",
  "Câu chuyện",
  "Xác nhận tham dự",
  "Lịch trình",
  "Lưu trú",
  "Bộ ảnh",
];

export default function WebsitePreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [wedding, setWedding] = useState(() => {
    if (location.state?.wedding) return location.state.wedding;
    try {
      const cached = sessionStorage.getItem("everweb_pending_wedding");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (wedding) return undefined;
    let cancelled = false;
    weddingApi
      .getAll()
      .then((items) => {
        if (!cancelled && items.length > 0) setWedding(items[0]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [wedding]);

  const coupleName =
    wedding?.title ||
    (wedding?.groom_name && wedding?.bride_name
      ? `${wedding.groom_name} & ${wedding.bride_name}`
      : "Trần Thanh Khang & Trần Ngọc An");

  const displayDate = wedding?.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("vi-VN")
    : "23/08/2027";
  const displayVenue = wedding?.venue_name || "Sảnh Hoa Mai - TP. Hồ Chí Minh";
  const isPublished = wedding?.status === "published";

  const handleTogglePublish = async () => {
    if (!wedding?.id || String(wedding.id).startsWith("local-")) {
      toast.info("Chức năng xuất bản cần kết nối hồ sơ trên máy chủ");
      return;
    }
    const nextStatus = isPublished ? "draft" : "published";
    setIsToggling(true);
    try {
      const updated = await weddingApi.update(wedding.id, { status: nextStatus });
      setWedding(updated);
      sessionStorage.setItem("everweb_pending_wedding", JSON.stringify(updated));
      toast.success(
        nextStatus === "published"
          ? "Website cưới của bạn đã được xuất bản!"
          : "Đã chuyển website về chế độ riêng tư"
      );
    } catch (error) {
      toast.error(extractApiError(error, "Không thể cập nhật trạng thái").message);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#2C2117] text-white">
      {/* Top Publish Banner */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-[#3B52DE] px-4 py-2.5 text-xs text-white">
        <span>
          {isPublished
            ? "Website cưới của bạn đang hiển thị công khai với khách mời."
            : "Website của bạn đang ẩn với khách mời. Xuất bản ngay khi bạn sẵn sàng chia sẻ."}
        </span>
        <button
          type="button"
          disabled={isToggling}
          onClick={handleTogglePublish}
          className="rounded-full border border-white/80 px-4 py-1 text-xs font-semibold text-white transition hover:bg-white hover:text-[#3B52DE] disabled:opacity-60"
        >
          {isToggling
            ? "Đang xử lý..."
            : isPublished
              ? "Ẩn Website"
              : "Xuất bản Website"}
        </button>
      </div>

      {/* Hero Preview */}
      <div className="relative flex flex-1 flex-col">
        <img
          src={heroWedding}
          alt={coupleName}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />

        {/* Preview Nav */}
        <nav className="relative z-10 flex flex-wrap items-center justify-center gap-6 px-6 py-6 text-xs font-medium text-white/90 sm:text-sm">
          {PREVIEW_NAV.map((item, idx) => (
            <span
              key={item}
              className={`cursor-pointer transition hover:text-white ${
                idx === 0 ? "border-b border-white pb-1 font-semibold text-white" : ""
              }`}
            >
              {item}
            </span>
          ))}
        </nav>

        {/* Center Couple Title */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/85">
            Save The Date
          </p>
          <h1 className="font-display mt-3 text-4xl font-medium tracking-wide text-white sm:text-6xl">
            {coupleName}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-white/90 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} />
              {displayDate}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} />
              {displayVenue}
            </span>
          </div>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })}
          className="fixed bottom-5 left-5 z-30 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#2C2117] shadow-lg transition hover:bg-[#FAF8F5]"
        >
          <ArrowLeft size={14} />
          Quay lại Trung tâm sự kiện
        </button>
      </div>
    </div>
  );
}
