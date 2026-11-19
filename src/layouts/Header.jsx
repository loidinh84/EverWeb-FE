import { Bell, ChevronDown, ChevronRight, Menu } from "lucide-react";

export default function Header({
  sectionLabel = "Quản lý tiệc",
  pageLabel,
  onOpenMobileMenu,
  onGoHome,
  onGoServices,
  onBellClick,
  userName = "Lê Bảo",
  userInitials = "LB",
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[#EAE3D8] bg-[#FCFBF8]/90 px-4 backdrop-blur-md sm:px-8">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-[#5A4228] transition hover:bg-[#F3ECE1] lg:hidden"
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <span className="text-[#8C7A68]">{sectionLabel}</span>
          <ChevronRight size={14} className="text-[#B6A38E]" />
          <span className="font-semibold text-[#2C2117]">{pageLabel}</span>
        </nav>
      </div>

      {/* Right: Quick links + Bell + User profile */}
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

        <div className="flex items-center gap-2 rounded-full border border-[#EAE3D8] bg-white py-1 pr-2.5 pl-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFE6D6] text-[11px] font-bold text-[#7A5622]">
            {userInitials}
          </div>
          <span className="hidden text-xs font-medium text-[#2C2117] sm:inline">
            {userName}
          </span>
          <ChevronDown size={13} className="hidden text-[#8C7A68] sm:inline" />
        </div>
      </div>
    </header>
  );
}
