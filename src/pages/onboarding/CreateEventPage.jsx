import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flower2, Gift, HeartHandshake, LogOut, Plus, Search } from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import heroWedding from "../../assets/image/hero-wedding.jpg";

export default function CreateEventPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const initials = (user?.full_name || user?.email || "U")
    .slice(0, 1)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#2C2117]">
      {/* Minimal Header */}
      <header className="flex h-16 items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B52DE] text-white">
            <Flower2 size={17} />
          </div>
          <span className="text-base font-bold tracking-tight text-[#2C2117]">
            EverWed
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.DASHBOARD_DEFAULT)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E6DFD3] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-medium text-[#5E5042] transition hover:border-[#3B52DE]"
          >
            <Search size={13} />
            Vào sự kiện đã tạo
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B52DE] text-xs font-bold text-white transition hover:opacity-90"
          >
            {initials}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Đăng xuất"
            className="rounded-lg p-1.5 text-[#8C7A68] hover:bg-[#FAF8F5] hover:text-[#2C2117]"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Center Empty Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
        <div className="relative mb-6 w-72 overflow-hidden rounded-2xl border border-[#EFEAE1] bg-[#FAF7F2] p-2 shadow-sm">
          <img
            src={heroWedding}
            alt="Mẫu trang sự kiện cưới"
            className="aspect-[16/10] w-full rounded-xl object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-3xl">
          Tạo sự kiện đầu tiên của bạn
        </h1>
        <p className="mt-2 max-w-md text-sm text-[#7D6D5E]">
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

      {/* Modal chọn 2 mục */}
      <Modal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        title=""
        size="sm"
      >
        <div className="space-y-4 pb-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#3B52DE]">
            <Flower2 size={20} />
          </div>
          <h2 className="text-lg font-bold text-[#2C2117]">
            Bạn muốn tạo loại sự kiện nào?
          </h2>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsTypeModalOpen(false);
                navigate(ROUTE_PATHS.WEDDING_SETUP);
              }}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-[#E6DFD3] bg-white px-4 py-6 transition hover:border-[#3B52DE] hover:bg-[#FCF9F3]"
            >
              <HeartHandshake size={28} className="text-[#3B52DE]" />
              <span className="text-sm font-semibold text-[#2C2117]">
                Wedding
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                toast.info("Mục Baby Registry đang được phát triển, hãy chọn Wedding!")
              }
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-[#E6DFD3] bg-white px-4 py-6 transition hover:border-[#3B52DE] hover:bg-[#FCF9F3]"
            >
              <Gift size={28} className="text-[#8C7A68]" />
              <span className="text-sm font-semibold text-[#2C2117]">
                Baby Registry
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
