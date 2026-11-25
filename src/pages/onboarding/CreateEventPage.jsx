import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Flower2,
  Gift,
  Globe,
  HeartHandshake,
  Loader2,
  LogOut,
  MapPin,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { Modal, useToast, UserProfileModal } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import weddingApi from "../../services/weddingApi";
import everwebLogo from "../../assets/image/everweb-logo.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";

export default function CreateEventPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [weddings, setWeddings] = useState(() => {
    try {
      const cached =
        sessionStorage.getItem("everweb_pending_wedding") ||
        localStorage.getItem("everweb_recent_wedding");
      return cached ? [JSON.parse(cached)] : [];
    } catch {
      return [];
    }
  });

  const initials = (user?.full_name || user?.email || "U")
    .slice(0, 1)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      await weddingApi.remove(deleteTarget.id);
      setWeddings((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      try {
        const cached = sessionStorage.getItem("everweb_pending_wedding");
        if (cached && JSON.parse(cached)?.id === deleteTarget.id) {
          sessionStorage.removeItem("everweb_pending_wedding");
        }
        const recent = localStorage.getItem("everweb_recent_wedding");
        if (recent && JSON.parse(recent)?.id === deleteTarget.id) {
          localStorage.removeItem("everweb_recent_wedding");
        }
      } catch (err) {
        void err;
      }
      toast.success("Đã xoá sự kiện thành công");
      setDeleteTarget(null);
    } catch {
      toast.error("Không thể xoá sự kiện, vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenWedding = useCallback(
    (w) => {
      try {
        sessionStorage.setItem("everweb_pending_wedding", JSON.stringify(w));
        localStorage.setItem("everweb_recent_wedding", JSON.stringify(w));
      } catch (err) {
        void err;
      }
      navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding: w } });
    },
    [navigate]
  );

  useEffect(() => {
    let cancelled = false;
    weddingApi
      .getAll()
      .then((items) => {
        if (cancelled) return;
        if (Array.isArray(items) && items.length > 0) {
          setWeddings(items);
          try {
            sessionStorage.setItem(
              "everweb_pending_wedding",
              JSON.stringify(items[0])
            );
            localStorage.setItem(
              "everweb_recent_wedding",
              JSON.stringify(items[0])
            );
          } catch (err) {
            void err;
          }
        }
      })
      .catch(() => {
        // Fallback already loaded from cache
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-[#1F1A17]">
      {/* Minimal Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#EAE3DB] bg-white/95 px-6 sm:px-10 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          title="Quay lại trang trước"
          className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-80"
        >
          <img
            src={everwebLogo}
            alt="EverWeb Logo"
            className="h-8 w-8 rounded-lg object-cover shadow-2xs"
          />
          <span className="text-base font-bold tracking-tight text-[#1F1A17]">
            EverWeb
          </span>
        </button>

        <div className="flex items-center gap-3">
          {weddings.length > 0 && (
            <button
              type="button"
              onClick={() => handleOpenWedding(weddings[0])}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-[#3B52DE] hover:text-[#3B52DE]"
            >
              <Search size={13} />
              Vào sự kiện gần nhất
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1A17] transition hover:border-[#3B52DE] hover:text-[#3B52DE] cursor-pointer"
          >
            <User size={13} className="text-[#3B52DE]" />
            <span>Xem hồ sơ</span>
          </button>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            title="Xem hồ sơ tài khoản"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B52DE] text-xs font-bold text-white shadow-xs transition hover:ring-2 hover:ring-[#3B52DE]/30 cursor-pointer"
          >
            {initials}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất"
            aria-label="Đăng xuất"
            className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-50 hover:text-[#1F1A17] transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Area */}
      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B52DE]" />
          <p className="mt-3 text-xs font-medium text-stone-500">
            Đang tải danh sách sự kiện của bạn...
          </p>
        </div>
      ) : weddings.length > 0 ? (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
          {/* Header Bar */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EAE3DB] pb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1F1A17] sm:text-3xl">
                Dự án sự kiện của bạn
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-stone-500">
                Chọn sự kiện bên dưới để tiếp tục chỉnh sửa kế hoạch cưới hoặc tạo thêm sự kiện mới.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsTypeModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#3B52DE] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F43C2] active:scale-95"
            >
              <Plus size={16} />
              Tạo sự kiện mới
            </button>
          </div>

          {/* Event Cards Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weddings.map((w, idx) => {
              const weddingTitle =
                w.title ||
                (w.groom_name && w.bride_name
                  ? `${w.groom_name} & ${w.bride_name}`
                  : "Hồ sơ sự kiện cưới");
              const dateText = w.wedding_date
                ? new Date(w.wedding_date).toLocaleDateString("vi-VN")
                : "Chưa chọn ngày";
              const venueText = w.venue_name || "Địa điểm đang cập nhật";
              const slugText = w.slug ? `everweb.vn/${w.slug}` : "";

              return (
                <div
                  key={w.id || idx}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs transition duration-200 hover:border-[#3B52DE] hover:shadow-md"
                >
                  {/* Card Cover */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-50">
                    <img
                      src={heroWedding}
                      alt={weddingTitle}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-[#1F1A17] shadow-xs backdrop-blur-xs">
                      {w.status === "published" ? "Đã công bố" : "Đang chuẩn bị"}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[10px] uppercase tracking-wider text-white/80">
                        Đám cưới
                      </p>
                      <h2 className="font-display text-lg font-bold leading-tight truncate text-white drop-shadow-xs">
                        {weddingTitle}
                      </h2>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div className="space-y-2 text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="shrink-0 text-[#3B52DE]" />
                        <span className="font-medium text-[#1F1A17]">{dateText}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="shrink-0 text-stone-500" />
                        <span className="truncate">{venueText}</span>
                      </div>
                      {slugText && (
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <Globe size={13} className="shrink-0" />
                          <span className="truncate">{slugText}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Action */}
                    <div className="mt-5 pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(ROUTE_PATHS.EVENT_SETTINGS, { state: { wedding: w } })}
                          className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-[#3B52DE] transition cursor-pointer"
                        >
                          <User size={12} />
                          <span>Hồ sơ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(w)}
                          title="Xoá sự kiện"
                          className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-700 transition cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Xoá</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenWedding(w)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#2F43C2] active:scale-95 cursor-pointer"
                      >
                        <span>Mở sự kiện</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      ) : (
        /* Center Empty Hero when no events exist yet */
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
          <div className="relative mb-6 w-72 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-2 shadow-sm">
            <img
              src={heroWedding}
              alt="Mẫu trang sự kiện cưới"
              className="aspect-[16/10] w-full rounded-xl object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A17] sm:text-3xl">
            Tạo sự kiện đầu tiên của bạn
          </h1>
          <p className="mt-2 max-w-md text-sm text-stone-500">
            Bắt đầu lên kế hoạch đám cưới trọn vẹn hoặc tạo không gian lưu giữ
            kỷ niệm cho ngày trọng đại.
          </p>

          <button
            type="button"
            onClick={() => setIsTypeModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#3B52DE] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F43C2]"
          >
            <Plus size={16} />
            Create Event
          </button>
        </main>
      )}

      {/* Modal chọn loại sự kiện */}
      <Modal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        title=""
        size="sm"
      >
        <div className="space-y-4 pb-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-[#1F1A17] font-bold">
            <Flower2 size={20} />
          </div>
          <h2 className="text-lg font-bold text-[#1F1A17]">
            Bạn muốn tạo loại sự kiện nào?
          </h2>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsTypeModalOpen(false);
                navigate(ROUTE_PATHS.WEDDING_SETUP);
              }}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-6 transition hover:border-[#3B52DE] hover:bg-[#FCF9F3]"
            >
              <HeartHandshake size={28} className="text-[#3B52DE]" />
              <span className="text-sm font-semibold text-[#1F1A17]">
                Wedding
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                toast.info("Mục Baby Registry đang được phát triển, hãy chọn Wedding!")
              }
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-6 transition hover:border-[#3B52DE] hover:bg-[#FCF9F3]"
            >
              <Gift size={28} className="text-stone-500" />
              <span className="text-sm font-semibold text-[#1F1A17]">
                Baby Registry
              </span>
            </button>
          </div>
        </div>
      </Modal>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        wedding={weddings[0]}
      />

      {/* Confirm Delete Event Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Xác nhận xoá sự kiện"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="leading-relaxed text-stone-600">
            Bạn có chắc chắn muốn xoá sự kiện{" "}
            <b className="text-[#1F1A17]">{deleteTarget?.title || "này"}</b>{" "}
            không? Toàn bộ dữ liệu cấu hình liên quan sẽ bị xoá khỏi hệ thống.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg border border-stone-200 px-4 py-2 font-medium text-stone-600 hover:bg-stone-50"
            >
              Huỷ
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {isDeleting ? "Đang xoá..." : "Xoá vĩnh viễn"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
