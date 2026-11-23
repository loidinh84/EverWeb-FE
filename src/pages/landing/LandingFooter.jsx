import { Search, ChevronRight, Globe } from "lucide-react";

export default function LandingFooter({ onOpenDashboard }) {
  return (
    <footer className="w-full select-none">
      <div className="w-full bg-[#1F1D1B] py-6 sm:py-7 border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline">
              <div className="w-16 sm:w-28 h-px bg-stone-500/80 mr-2 self-end mb-1" />
              <span className="text-white text-base sm:text-xl font-normal tracking-wide border-b border-stone-500/80 pb-1">
                Celebrate love
              </span>
            </div>
            <span className="font-serif italic text-2xl sm:text-3xl text-white font-normal tracking-tight">
              EverWeb<span className="text-xs not-italic align-super ml-0.5 text-stone-400">™</span>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#2F2D2A] text-white pt-10 pb-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <a
                href="#wedding"
                className="px-4 py-1.5 rounded-full bg-stone-700/90 text-white text-xs font-semibold shadow-xs transition-colors hover:bg-stone-600"
              >
                EverWeb Cưới
              </a>
              <a
                href="#invites"
                className="px-3.5 py-1.5 rounded-full text-stone-300 hover:text-white text-xs font-medium transition-colors"
              >
                Thiệp Số
              </a>
              <a
                href="#events"
                className="px-3.5 py-1.5 rounded-full text-stone-300 hover:text-white text-xs font-medium transition-colors"
              >
                Sự Kiện & Lịch Trình
              </a>
              <a
                href="#pro"
                className="px-3.5 py-1.5 rounded-full text-stone-300 hover:text-white text-xs font-medium transition-colors"
              >
                EverWeb Pro
              </a>
            </div>

            <div className="flex items-center gap-5 sm:gap-6 flex-wrap text-xs text-stone-300 font-normal">
              <a href="#shipping" className="hover:text-white transition-colors">
                Giao hàng
              </a>
              <a href="#returns" className="hover:text-white transition-colors">
                Đổi trả
              </a>
              <a href="#newsroom" className="hover:text-white transition-colors">
                Tin tức
              </a>
              <a href="#careers" className="hover:text-white transition-colors">
                Tuyển dụng
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                Về EverWeb
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Liên hệ
              </a>
              <div className="flex items-center gap-1.5 text-stone-300 hover:text-white cursor-pointer transition-colors">
                <Globe className="w-3.5 h-3.5" />
                <span>Tiếng Việt</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-6 sm:gap-8">
              <button
                onClick={onOpenDashboard}
                type="button"
                className="text-white text-sm sm:text-base font-semibold flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              >
                Bắt đầu ngay <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href="#find"
                className="text-stone-200 hover:text-white text-sm sm:text-base font-medium flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4 text-stone-300" />
                Tìm sự kiện
              </a>
            </div>

            <div className="flex items-center gap-4 sm:gap-5">
              <a
                href="#instagram"
                className="text-stone-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="#pinterest"
                className="text-stone-300 hover:text-white transition-colors"
                aria-label="Pinterest"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.03-.94-.06-2.38.05-3.41l.73-3.1s-.18-.37-.18-.92c0-.86.5-1.5 1.13-1.5.53 0 .79.4.79.88 0 .54-.34 1.34-.52 2.08-.15.63.31 1.14.93 1.14 1.12 0 1.98-1.18 1.98-2.88 0-1.5-.08-2.55-2.62-2.55-2.87 0-3.55 2.15-3.55 3.42 0 .58.22 1.2.5 1.54.06.07.07.13.05.2l-.19.78c-.03.12-.1.15-.23.09-1-.46-1.63-1.9-1.63-3.06 0-2.49 1.81-4.78 5.22-4.78 2.74 0 4.87 1.95 4.87 4.56 0 2.72-1.72 4.91-4.1 4.91-.8 0-1.55-.42-1.81-.91l-.49 1.87c-.18.69-.66 1.55-.99 2.08A12 12 0 1 0 12 0z" />
                </svg>
              </a>

              <a
                href="#facebook"
                className="text-stone-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="#twitter"
                className="text-stone-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <span className="text-white font-bold text-xs sm:text-sm tracking-wide ml-1">
                #everweb
              </span>

              <span className="font-serif italic text-2xl sm:text-3xl text-white font-normal tracking-tight ml-2">
                EverWeb
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-400">
            <p>© 2026 EverWeb. All rights reserved.</p>

            <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
              <a href="#terms" className="hover:text-stone-200 transition-colors">
                Điều khoản & Quyền riêng tư
              </a>
              <a href="#privacy" className="hover:text-stone-200 transition-colors">
                Thông báo quyền riêng tư
              </a>
              <a
                href="#privacy-choices"
                className="hover:text-stone-200 transition-colors inline-flex items-center gap-1.5"
              >
                <span className="inline-block w-4 h-2.5 rounded-xs bg-blue-500 relative overflow-hidden">
                  <span className="absolute inset-y-0 left-0 w-1.5 bg-white" />
                </span>
                Lựa chọn quyền riêng tư
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
