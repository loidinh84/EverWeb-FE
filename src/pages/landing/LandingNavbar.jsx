import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  Menu,
  Search,
  X,
} from "lucide-react";

export default function LandingNavbar({ onOpenDashboard }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((window.scrollY || 0) > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

          <div className="flex items-center gap-4">
            {onOpenDashboard ? (
              <button
                type="button"
                onClick={onOpenDashboard}
                className={`hidden sm:inline-block text-sm font-medium transition cursor-pointer ${
                  isScrolled
                    ? "text-[#231F1C] hover:text-[#5239D8]"
                    : "text-white hover:text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                }`}
              >
                Đăng nhập
              </button>
            ) : (
              <a
                href="#pricing"
                className={`hidden sm:inline-block text-sm font-medium transition ${
                  isScrolled
                    ? "text-[#231F1C] hover:text-[#5239D8]"
                    : "text-white hover:text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                }`}
              >
                Đăng nhập
              </a>
            )}
            <a
              href="#pricing"
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition duration-200 ${
                isScrolled
                  ? "bg-[#5239D8] text-white hover:bg-[#432BC2]"
                  : "bg-white text-[#231F1C] hover:bg-neutral-100"
              }`}
            >
              Bắt đầu ngay
            </a>

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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
