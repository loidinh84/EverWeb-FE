import { useState } from "react";
import {
  CheckCircle2,
  Heart,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { ROLE_LABELS, ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";

export default function UserProfileModal({
  isOpen,
  onClose,
  wedding = null,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  if (!user) return null;

  const initials = (user?.full_name || user?.email || "U")
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = ROLE_LABELS[user?.role] || user?.role || "Cặp đôi";

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  const handleGoEventHub = () => {
    onClose();
    navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } });
  };

  const handleGoSettings = () => {
    onClose();
    navigate(ROUTE_PATHS.EVENT_SETTINGS, { state: { wedding } });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hồ sơ tài khoản"
      size="md"
    >
      <div className="space-y-5">
        {/* Profile Header Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-[#EAE3DB] bg-[#FAF8F5] p-4 sm:p-5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#3B52DE] text-lg font-bold text-white shadow-sm">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-[#2C2117] truncate">
                {user?.full_name || "Thành viên EverWeb"}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#3B52DE]">
                <ShieldCheck size={12} />
                {roleLabel}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#7D6D5E] truncate">{user?.email}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EAE3DB] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`border-b-2 pb-2.5 px-3 transition cursor-pointer ${
              activeTab === "account"
                ? "border-[#3B52DE] text-[#3B52DE]"
                : "border-transparent text-[#8C7A68] hover:text-[#2C2117]"
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wedding")}
            className={`border-b-2 pb-2.5 px-3 transition cursor-pointer ${
              activeTab === "wedding"
                ? "border-[#3B52DE] text-[#3B52DE]"
                : "border-transparent text-[#8C7A68] hover:text-[#2C2117]"
            }`}
          >
            Hồ sơ sự kiện cưới
          </button>
        </div>

        {/* Tab 1: Account Info */}
        {activeTab === "account" ? (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#E6DFD3] bg-white p-3.5">
                <p className="text-[11px] font-medium text-[#8C7A68]">Họ và tên</p>
                <p className="mt-1 font-semibold text-[#2C2117]">
                  {user?.full_name || "Chưa cập nhật"}
                </p>
              </div>

              <div className="rounded-xl border border-[#E6DFD3] bg-white p-3.5">
                <p className="text-[11px] font-medium text-[#8C7A68]">Email đăng nhập</p>
                <p className="mt-1 font-semibold text-[#2C2117] truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#E6DFD3] bg-white p-3.5">
                <p className="text-[11px] font-medium text-[#8C7A68]">Vai trò tài khoản</p>
                <p className="mt-1 font-semibold text-[#3B52DE]">
                  {roleLabel}
                </p>
              </div>

              <div className="rounded-xl border border-[#E6DFD3] bg-white p-3.5">
                <p className="text-[11px] font-medium text-[#8C7A68]">Trạng thái</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-emerald-600">
                  <CheckCircle2 size={13} />
                  Đang hoạt động (Đã xác thực)
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Wedding / Couple Info */
          <div className="space-y-3 text-xs">
            {wedding ? (
              <div className="rounded-2xl border border-[#E6DFD3] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
                    <Heart size={12} className="fill-rose-500" />
                    Sự kiện đang quản lý
                  </span>
                  <span className="text-[11px] text-[#8C7A68]">
                    {wedding.status === "published" ? "Đã công bố" : "Đang chuẩn bị"}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-base font-bold text-[#2C2117]">
                    {wedding.title ||
                      (wedding.groom_name && wedding.bride_name
                        ? `${wedding.groom_name} & ${wedding.bride_name}`
                        : "Hồ sơ sự kiện cưới")}
                  </h4>
                  <p className="mt-1 text-xs text-[#7D6D5E]">
                    {wedding.wedding_date
                      ? `Ngày cưới: ${new Date(wedding.wedding_date).toLocaleDateString("vi-VN")}`
                      : "Chưa chốt ngày"}
                    {wedding.venue_name ? ` • ${wedding.venue_name}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={handleGoEventHub}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B52DE] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#2F43C2]"
                  >
                    <Sparkles size={13} />
                    Mở trung tâm sự kiện
                  </button>
                  <button
                    type="button"
                    onClick={handleGoSettings}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE]"
                  >
                    Chỉnh sửa hồ sơ cưới
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#E2D9CB] bg-[#FAF8F5] p-6 text-center">
                <p className="text-xs text-[#8C7A68]">
                  Chưa có hồ sơ sự kiện cưới nào đang hoạt động.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(ROUTE_PATHS.CREATE_EVENT);
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white"
                >
                  Tạo sự kiện ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#F0EAE1] pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#2C2117] px-5 py-2 text-xs font-semibold text-white hover:bg-black transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
