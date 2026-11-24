import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { UserProfileModal } from "../../components/common";

export default function LandingNavbar({ onOpenDashboard }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const userMenuRef = useRef(null);

  const initials = (user?.full_name || user?.email || "U")
    .slice(0, 1)
    .toUpperCase();
  const displayName = user?.full_name || user?.email?.split("@")[0] || "Tài khoản";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((window.scrollY || 0) > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full select-none">
      <div className="bg-[#3446EB] text-white text-xs font-medium relative w-full h-10 shrink-0">
        <div className="w-full flex h-10 items-center justify-between px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-1.5 overflow-x-auto ew-no-scrollbar">
            <span className="rounded-full bg-white/20 px-3 py-1 font-semibold text-white whitespace-nowrap">
              EverWeb Cưới
            </span>
            <a
              href="#pillars"
              className="rounded-full px-2.5 py-1 text-white/80 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              Thiệp số
            </a>
            <a
              href="#pillars"
              className="rounded-full px-2.5 py-1 text-white/80 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              Xác nhận tham dự
            </a>
            <a
              href="#pillars"
              className="hidden sm:inline-block rounded-full px-2.5 py-1 text-white/80 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              Trợ lý AI
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-white/95">
            <span>
              Ưu đãi mùa cưới: Giảm 25% các mẫu thiệp số & website cưới cao cấp
            </span>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1 underline underline-offset-4 font-semibold text-white hover:text-white/90"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-white/90 shrink-0">
            <a
              href="#pricing"
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Tìm sự kiện</span>
            </a>
            <div className="flex items-center gap-1 text-white">
              <Globe className="h-3.5 w-3.5" />
              <span>Tiếng Việt</span>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#EAE3DB] shadow-xs"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="w-full flex h-18 items-center justify-between px-4 sm:px-8 lg:px-12">
          <a href="#cover" className="flex items-center gap-2 group">
            <span
              className={`font-display text-3xl sm:text-4xl font-normal tracking-tight transition-colors duration-300 ${
                isScrolled
                  ? "text-[#231F1C]"
                  : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
              }`}
            >
              Ever
              <span
                className={`italic font-light transition-colors duration-300 ${
                  isScrolled ? "text-[#C5A059]" : "text-[#F5E6D3]"
                }`}
              >
                Web
              </span>
            </span>
          </a>

          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${
              isScrolled ? "text-[#231F1C]" : "text-white"
            }`}
          >
            <a
              href="#pillars"
              className={`flex items-center gap-1 transition ${
                isScrolled
                  ? "hover:text-[#5239D8]"
                  : "hover:text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
              }`}
            >
              <span>Kế hoạch & Thiệp cưới</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </a>
            <a
              href="#lookbook"
              className={`flex items-center gap-1 transition ${
                isScrolled
                  ? "hover:text-[#5239D8]"
                  : "hover:text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
              }`}
            >
              <span>Bộ sưu tập Mẫu</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </a>
            <a
              href="#journey"
              className={`flex items-center gap-1 transition ${
                isScrolled
                  ? "hover:text-[#5239D8]"
                  : "hover:text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
              }`}
            >
              <span>Cố vấn cưới AI</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </a>
            <a
              href="#pricing"
              className={`transition ${
                isScrolled
                  ? "hover:text-[#5239D8]"
                  : "hover:text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
              }`}
            >
              Bảng giá
            </a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1.5 pr-3 text-xs font-semibold transition cursor-pointer ${
                    isScrolled
                      ? "border-[#EAE3DB] bg-[#FAF8F5] text-[#231F1C] hover:border-[#3B52DE]"
                      : "border-white/30 bg-black/35 text-white hover:bg-black/50 backdrop-blur-md"
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B52DE] text-white font-bold text-xs shadow-xs">
                    {initials}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#EAE3DB] bg-white p-2 text-[#231F1C] shadow-xl z-50 select-none"
                    >
                      <div className="px-3 py-2 border-b border-[#F0EAE1]">
                        <p className="text-xs font-bold truncate text-[#231F1C]">
                          {user?.full_name || "Tài khoản của bạn"}
                        </p>
                        <p className="text-[11px] text-[#8C7A68] truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate(ROUTE_PATHS.CREATE_EVENT);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#231F1C] hover:bg-[#F6F4F0] transition"
                        >
                          <Plus className="h-4 w-4 text-[#3B52DE]" />
                          <span>Tạo sự kiện mới</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProfileModalOpen(true);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2C2117] hover:bg-[#F6F4F0] transition cursor-pointer"
                        >
                          <User className="h-4 w-4 text-[#3B52DE]" />
                          <span>Xem hồ sơ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate(ROUTE_PATHS.EVENT_HUB);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#231F1C] hover:bg-[#F6F4F0] transition"
                        >
                          <CalendarDays className="h-4 w-4 text-[#3B52DE]" />
                          <span>Trung tâm sự kiện</span>
                        </button>
                      </div>
                      <div className="border-t border-[#F0EAE1] pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate(ROUTE_PATHS.LOGIN)}
                className={`hidden sm:inline-block text-sm font-medium transition cursor-pointer ${
                  isScrolled
                    ? "text-[#231F1C] hover:text-[#5239D8]"
                    : "text-white hover:text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                }`}
              >
                Đăng nhập
              </button>
            )}

            <button
              type="button"
              onClick={onOpenDashboard}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition duration-200 cursor-pointer ${
                isScrolled
                  ? "bg-[#5239D8] text-white hover:bg-[#432BC2]"
                  : "bg-white text-[#231F1C] hover:bg-neutral-100"
              }`}
            >
              Bắt đầu ngay
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`rounded-lg p-2 transition md:hidden cursor-pointer ${
                isScrolled
                  ? "text-[#231F1C] hover:bg-[#EAE3DB]"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Mở menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`border-b px-6 py-4 md:hidden backdrop-blur-md ${
                isScrolled
                  ? "border-[#EAE3DB] bg-white text-[#231F1C]"
                  : "border-white/10 bg-black/90 text-white"
              }`}
            >
              <div className="flex flex-col gap-3 text-sm font-medium">
                <a
                  href="#pillars"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5"
                >
                  Kế hoạch & Thiệp cưới
                </a>
                <a
                  href="#lookbook"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5"
                >
                  Bộ sưu tập Mẫu
                </a>
                <a
                  href="#journey"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5"
                >
                  Cố vấn cưới AI
                </a>
                <a
                  href="#pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1.5"
                >
                  Bảng giá
                </a>

                <div className="pt-3 border-t border-stone-200/40">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 pb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B52DE] text-white font-bold text-xs">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs truncate">{displayName}</p>
                          <p className="text-[11px] opacity-70 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate(ROUTE_PATHS.CREATE_EVENT);
                        }}
                        className="w-full text-left py-1.5 text-xs font-semibold text-[#3B52DE]"
                      >
                        + Tạo sự kiện mới
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full text-left py-1.5 text-xs font-semibold text-[#2C2117] flex items-center gap-1.5"
                      >
                        <User className="h-3.5 w-3.5 text-[#3B52DE]" />
                        <span>Xem hồ sơ tài khoản</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate(ROUTE_PATHS.EVENT_HUB);
                        }}
                        className="w-full text-left py-1.5 text-xs font-semibold text-[#3B52DE]"
                      >
                        → Trung tâm sự kiện
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left py-1.5 text-xs font-medium text-rose-500"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate(ROUTE_PATHS.LOGIN);
                        }}
                        className="py-1.5 text-xs font-semibold"
                      >
                        Đăng nhập
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenDashboard();
                        }}
                        className="rounded-full bg-[#5239D8] px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        Bắt đầu ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
