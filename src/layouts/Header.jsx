import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Heart,
  LogOut,
  Menu,
  PanelLeft,
  ShieldCheck,
} from "lucide-react";
import { ROLE_LABELS, ROLES } from "../constants/roles";

function getInitials(name, fallback = "LB") {
  const trimmed = String(name || "").trim();
  if (!trimmed) return fallback;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Header({
  sectionLabel = "Quản lý tiệc",
  pageLabel,
  onOpenMobileMenu,
  onToggleSidebar,
  onGoHome,
  onGoServices,
  onBellClick,
  user,
  onLogout,
  onGoAdmin,
  onGoProfile,
  userName = "Lê Bảo",
  userInitials = "LB",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.full_name || user?.email || userName;
  const displayInitials = user
    ? getInitials(displayName, userInitials)
    : userInitials;
  const roleLabel = user?.role
    ? ROLE_LABELS[user.role] || user.role
    : "Thành viên";

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[#EAE3D8] bg-[#FCFBF8]/90 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Sidebar toggle + Breadcrumb */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-[#5A4228] transition hover:bg-[#F3ECE1] lg:hidden"
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>

        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden rounded-lg p-1.5 text-[#7D6D5E] transition hover:bg-[#F3ECE1] hover:text-[#2C2117] lg:inline-flex"
            aria-label="Thu gọn hoặc mở rộng menu"
            title="Thu gọn / mở rộng menu"
          >
            <PanelLeft size={18} />
          </button>
        )}

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <span className="text-[#8C7A68]">{sectionLabel}</span>
          <ChevronRight size={14} className="text-[#B6A38E]" />
          <span className="font-semibold text-[#2C2117]">{pageLabel}</span>
        </nav>
      </div>

      {/* Right: Quick links + Bell + User profile dropdown */}
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-4 text-xs font-medium text-[#6D5B4B] sm:flex">
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="transition hover:text-[#2C2117]"
            >
              Trang chủ
            </button>
          )}
          {onGoServices && (
            <button
              type="button"
              onClick={onGoServices}
              className="transition hover:text-[#2C2117]"
            >
              Dịch vụ
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onBellClick}
          className="relative rounded-full p-1.5 text-[#5A4228] transition hover:bg-[#F3ECE1]"
          aria-label="Thông báo"
        >
          <Bell size={17} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full border border-[#EAE3D8] bg-white py-1 pr-2.5 pl-1.5 transition hover:border-[#C5A059]"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFE6D6] text-[11px] font-bold text-[#7A5622]">
              {displayInitials}
            </div>
            <span className="hidden max-w-[140px] truncate text-xs font-medium text-[#2C2117] sm:inline">
              {displayName}
            </span>
            <ChevronDown
              size={13}
              className={`hidden text-[#8C7A68] transition-transform sm:inline ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="ew-zoom-in absolute right-0 mt-2 w-60 rounded-2xl border border-[#EAE3D8] bg-white p-2 shadow-lg"
            >
              <div className="border-b border-[#F3ECE1] px-3 py-2.5">
                <p className="truncate text-xs font-bold text-[#2C2117]">
                  {displayName}
                </p>
                {user?.email && (
                  <p className="mt-0.5 truncate text-[11px] text-[#8C7A68]">
                    {user.email}
                  </p>
                )}
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    user?.role === ROLES.ADMIN
                      ? "bg-[#2F241D] text-[#E8CD94]"
                      : "bg-[#EFE6D6] text-[#7A5622]"
                  }`}
                >
                  {roleLabel}
                </span>
              </div>

              <div className="mt-1 space-y-0.5">
                {user?.role === ROLES.ADMIN && onGoAdmin && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onGoAdmin();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#2C2117] transition hover:bg-[#FBF5EA]"
                  >
                    <ShieldCheck size={14} className="text-[#A67C37]" />
                    <span>Quản trị hệ thống</span>
                  </button>
                )}

                {onGoProfile && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onGoProfile();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#2C2117] transition hover:bg-[#F6F2EA]"
                  >
                    <Heart size={14} className="text-[#7D6D5E]" />
                    <span>Hồ sơ cặp đôi</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={14} />
                    <span>Đăng xuất</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
