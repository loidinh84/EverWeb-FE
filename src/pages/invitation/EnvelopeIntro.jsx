export default function EnvelopeIntro({
  guestName,
  dateBadge,
  isOpeningAnimation,
  onOpenEnvelope,
}) {
  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] flex flex-col justify-between items-center py-16 px-4 relative overflow-hidden transition-all duration-700">
      {/* Header text */}
      <div className="text-center pt-8 space-y-2 z-10 animate-fade-in">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#332E2B] font-display font-medium">
          TRÂN TRỌNG KÍNH MỜI
        </p>
        <h1 className="text-4xl sm:text-5xl font-['Dancing_Script'] font-semibold text-[#1F1B18] tracking-wide pt-1">
          {guestName}
        </h1>
      </div>

      {/* Phong bì thiệp hoa xanh tím với con dấu sáp vàng */}
      <div
        className={`w-full max-w-sm my-auto relative transition-all duration-700 transform ${
          isOpeningAnimation
            ? "scale-105 opacity-0 -translate-y-10"
            : "scale-100 opacity-100"
        }`}
      >
        <div
          onClick={onOpenEnvelope}
          className="w-full aspect-[1.45/1] bg-[#FAF8F5] rounded-xl shadow-xl border border-[#E8E2D5] relative cursor-pointer overflow-hidden group hover:shadow-2xl transition-all"
        >
          <div
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#F3EFE6] border-b border-[#DFD8C9] origin-top transition-transform duration-500"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />

          {/* Nhánh hoa màu xanh tím pastel */}
          <div className="absolute top-2 left-2 z-20 pointer-events-none w-28 sm:w-32 h-28 sm:h-32 opacity-95">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
              <path d="M15 95 C 25 70, 35 45, 55 25" stroke="#68846D" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30 65 C 22 55, 18 42, 22 35 C 30 38, 32 52, 30 65" fill="#7D9882" opacity="0.8" />
              <path d="M42 45 C 48 35, 58 32, 60 40 C 52 46, 46 48, 42 45" fill="#7D9882" opacity="0.8" />
              <path d="M25 80 C 15 78, 12 68, 18 64 C 24 67, 26 75, 25 80" fill="#68846D" opacity="0.75" />

              <g transform="translate(18, 50)">
                <circle cx="8" cy="8" r="7" fill="#889BE8" opacity="0.85" />
                <circle cx="16" cy="10" r="6" fill="#A4B3F5" opacity="0.85" />
                <circle cx="12" cy="18" r="6.5" fill="#7C8EE0" opacity="0.85" />
                <circle cx="4" cy="15" r="6" fill="#95A6F0" opacity="0.85" />
                <circle cx="10" cy="13" r="2" fill="#FFFFFF" />
              </g>
              <g transform="translate(32, 28)">
                <circle cx="8" cy="7" r="7.5" fill="#758BE5" opacity="0.9" />
                <circle cx="18" cy="9" r="6.5" fill="#9BAEF5" opacity="0.9" />
                <circle cx="14" cy="19" r="7" fill="#6A80E0" opacity="0.9" />
                <circle cx="5" cy="16" r="6.5" fill="#8FA4F2" opacity="0.9" />
                <circle cx="11" cy="13" r="2.5" fill="#FFFFFF" />
              </g>
              <g transform="translate(6, 75)">
                <circle cx="7" cy="7" r="6.5" fill="#A8A0E8" opacity="0.8" />
                <circle cx="15" cy="8" r="5.5" fill="#C2BBFA" opacity="0.8" />
                <circle cx="11" cy="16" r="6" fill="#9990E0" opacity="0.8" />
                <circle cx="4" cy="14" r="5.5" fill="#B4ABF0" opacity="0.8" />
                <circle cx="9" cy="11" r="1.8" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Con dấu sáp vàng đồng */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#E6C265] via-[#D4A034] to-[#996D14] shadow-xl border-2 border-[#FFF0BA] flex items-center justify-center relative group-hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full border border-[#B38318] flex items-center justify-center bg-gradient-to-br from-[#D9A738] to-[#AC791A] shadow-inner">
                <svg viewBox="0 0 24 24" fill="#664609" className="w-7 h-7 drop-shadow-xs opacity-90">
                  <path d="M12 2C13 5 15 7 18 8C15 9 13 11 12 14C11 11 9 9 6 8C9 7 11 5 12 2Z" />
                  <circle cx="12" cy="12" r="3.5" fill="#543703" />
                  <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" fill="none" stroke="#664609" strokeWidth="1" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 z-40 animate-bounce pointer-events-none">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 drop-shadow-md">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng ngày tháng bên dưới phong bì */}
      <div className="text-center pb-8 z-10">
        <p className="text-xl sm:text-2xl font-display font-medium text-[#221F1C] tracking-[0.2em]">
          {dateBadge}
        </p>
      </div>
    </div>
  );
}
