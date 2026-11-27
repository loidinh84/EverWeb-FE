import { ArrowRight, Sparkles } from "lucide-react";
import { INVITATION_TEMPLATES } from "../../constants/invitationTemplates";

export default function EnvelopeIntro({
  guestName,
  dateBadge,
  isOpeningAnimation,
  onOpenEnvelope,
  template = INVITATION_TEMPLATES[0],
  wedding,
}) {
  const layoutType = template?.layoutType || "beach";

  // 1. MẪU N01: CỔNG ĐỎ SONG HỶ TÁCH ĐÔI (TRUYỀN THỐNG HIỆN ĐẠI)
  if (layoutType === "songhy") {
    return (
      <div className="min-h-screen w-full bg-[#4A0D16] flex flex-col justify-between items-center py-12 px-4 relative overflow-hidden">
        {/* Viền chỉ vàng cung đình */}
        <div className="absolute inset-4 sm:inset-8 border border-[#D9B36C]/40 pointer-events-none rounded-2xl" />
        <div className="absolute inset-6 sm:inset-10 border border-[#D9B36C]/20 pointer-events-none rounded-xl" />

        <div className="text-center pt-6 space-y-2 z-20 animate-fade-in">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#F2CF7E] font-medium">
            THIỆP BÁO HỶ · TRÂN TRỌNG KÍNH MỜI
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-semibold text-[#FFF4E6] tracking-wide pt-1">
            {guestName}
          </h1>
        </div>

        {/* Cặp cánh cửa đỏ Song Hỷ tách sang 2 bên khi bấm */}
        <div
          onClick={onOpenEnvelope}
          className="w-full max-w-xs aspect-[3/4] my-auto relative cursor-pointer group z-20 rounded-t-full overflow-hidden border-2 border-[#D9B36C] shadow-2xl bg-[#66111E]"
        >
          {/* Cánh trái */}
          <div
            className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-[#8F1929] to-[#6B101D] border-r border-[#D9B36C]/60 transition-transform duration-700 ease-in-out flex items-center justify-end pr-1 ${
              isOpeningAnimation ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="w-1.5 h-10 rounded-full bg-[#D9B36C]/80 mr-1.5" />
          </div>

          {/* Cánh phải */}
          <div
            className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-bl from-[#8F1929] to-[#6B101D] border-l border-[#D9B36C]/60 transition-transform duration-700 ease-in-out flex items-center justify-start pl-1 ${
              isOpeningAnimation ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="w-1.5 h-10 rounded-full bg-[#D9B36C]/80 ml-1.5" />
          </div>

          {/* Huy hiệu Song Hỷ vàng ở chính giữa */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 ${
              isOpeningAnimation ? "scale-125 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F7DC94] via-[#D4A238] to-[#946B14] p-1 shadow-2xl group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#7A1423] border border-[#F5D78E]/70 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#F7DC94] leading-none select-none">
                  囍
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#F5D78E] mt-1 font-semibold">
                  Chạm mở
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-6 z-20 space-y-1">
          <p className="text-xs text-[#F5D78E]/90 uppercase tracking-[0.25em]">
            {wedding?.groom_name} & {wedding?.bride_name}
          </p>
          <p className="text-xl font-display font-medium text-[#FFF4E6] tracking-[0.22em]">
            {dateBadge}
          </p>
        </div>
      </div>
    );
  }

  // 2. MẪU N02: BÌA TẠP CHÍ MINIMALIST EDITORIAL (AT01)
  if (layoutType === "editorial") {
    return (
      <div
        className={`min-h-screen w-full bg-[#F7F6F3] flex items-center justify-center p-4 sm:p-8 transition-all duration-500 ${
          isOpeningAnimation ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="w-full max-w-[390px] bg-white border border-stone-900 shadow-2xl p-6 sm:p-7 flex flex-col justify-between min-h-[600px] relative">
          {/* Header Tạp chí */}
          <div className="flex items-center justify-between border-b border-stone-900 pb-3 text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-800">
            <span>SAVE THE DATE</span>
            <span>NO. {dateBadge}</span>
          </div>

          {/* Ảnh bìa cắt khung chữ nhật sắc nét */}
          <div className="my-5 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                TRÂN TRỌNG KÍNH MỜI
              </p>
              <h1 className="text-3xl font-display italic font-semibold text-stone-900">
                {guestName}
              </h1>
            </div>

            <div
              onClick={onOpenEnvelope}
              className="relative aspect-[4/5] w-full overflow-hidden border border-stone-900 cursor-pointer group"
            >
              <img
                src={wedding?.hero_photo || template.defaultPhotos.hero_photo}
                alt="Editorial Cover"
                className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] uppercase tracking-[0.28em] opacity-85">
                  THE WEDDING OF
                </p>
                <p className="text-2xl font-display font-semibold tracking-wide mt-0.5">
                  {wedding?.groom_name} & {wedding?.bride_name}
                </p>
              </div>
            </div>
          </div>

          {/* Nút mở thiệp kiểu viên thuốc tối giản */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={onOpenEnvelope}
              className="w-full rounded-full bg-stone-900 hover:bg-black text-white py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.22em] inline-flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <span>Mở Thiệp Mời</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. MẪU N03: THIỆP CỔNG VÒM HOA LÁ BOTANICAL (NA01)
  if (layoutType === "botanical") {
    return (
      <div
        className={`min-h-screen w-full bg-[#EEF3EB] flex flex-col justify-center items-center py-10 px-4 relative overflow-hidden transition-all duration-700 ${
          isOpeningAnimation ? "opacity-0 -translate-y-6" : "opacity-100 translate-y-0"
        }`}
      >
        <div
          onClick={onOpenEnvelope}
          className="w-full max-w-[360px] bg-[#FAFDF8] rounded-t-[180px] rounded-b-2xl border-2 border-[#8FA88E] p-7 pt-12 pb-9 text-center shadow-2xl relative cursor-pointer group hover:shadow-emerald-950/10 transition-all"
        >
          {/* Viền trong mảnh */}
          <div className="absolute inset-3 rounded-t-[170px] rounded-b-xl border border-[#CAD6C4] pointer-events-none" />

          {/* Vòng lá Botanical trên đỉnh vòm */}
          <div className="w-24 h-14 mx-auto mb-3 text-[#4A634E] opacity-90">
            <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
              <path
                d="M15 45 C 35 15, 85 15, 105 45"
                stroke="#4A634E"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <ellipse cx="32" cy="28" rx="9" ry="4.5" transform="rotate(-28 32 28)" fill="#88A889" opacity="0.8" />
              <ellipse cx="48" cy="20" rx="8" ry="4" transform="rotate(-12 48 20)" fill="#4A634E" opacity="0.7" />
              <ellipse cx="72" cy="20" rx="8" ry="4" transform="rotate(12 72 20)" fill="#4A634E" opacity="0.7" />
              <ellipse cx="88" cy="28" rx="9" ry="4.5" transform="rotate(28 88 28)" fill="#88A889" opacity="0.8" />
              <circle cx="60" cy="18" r="4.5" fill="#D8BE74" />
            </svg>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#4A634E] font-semibold">
            TRÂN TRỌNG KÍNH MỜI
          </p>
          <h1 className="text-3xl sm:text-4xl font-display italic font-semibold text-[#243025] mt-1.5 mb-5">
            {guestName}
          </h1>

          {/* Ảnh cưới cắt hình vòm */}
          <div className="w-44 h-56 mx-auto rounded-t-full overflow-hidden border-2 border-[#B8D0B9] shadow-md mb-5">
            <img
              src={wedding?.hero_photo || template.defaultPhotos.hero_photo}
              alt="Botanical Couple"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <p className="text-lg font-display font-bold text-[#2F4232]">
            {wedding?.groom_name} & {wedding?.bride_name}
          </p>
          <p className="text-xs text-[#4A634E] tracking-[0.2em] mt-1 mb-5 font-medium">
            {dateBadge}
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4A634E] group-hover:bg-[#324535] text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition">
            <Sparkles size={13} />
            <span>Chạm để mở thiệp</span>
          </span>
        </div>
      </div>
    );
  }

  // 4. MẪU N00 (MẶC ĐỊNH): PHONG BÌ KEM HOA XANH TÍM & CON DẤU SÁP VÀNG
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between items-center py-16 px-4 relative overflow-hidden transition-all duration-700"
      style={{ backgroundColor: template.envelopeBg }}
    >
      {/* Header text */}
      <div className="text-center pt-8 space-y-2 z-10 animate-fade-in">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#332E2B] font-display font-medium">
          TRÂN TRỌNG KÍNH MỜI
        </p>
        <h1 className={`text-4xl sm:text-5xl ${template.headingFont} font-semibold text-[#1F1B18] tracking-wide pt-1`}>
          {guestName}
        </h1>
      </div>

      {/* Phong bì thiệp với con dấu sáp */}
      <div
        className={`w-full max-w-sm my-auto relative transition-all duration-700 transform ${
          isOpeningAnimation
            ? "scale-105 opacity-0 -translate-y-10"
            : "scale-100 opacity-100"
        }`}
      >
        <div
          onClick={onOpenEnvelope}
          className="w-full aspect-[1.45/1] rounded-xl shadow-xl border relative cursor-pointer overflow-hidden group hover:shadow-2xl transition-all"
          style={{
            backgroundColor: template.envelopeCardBg,
            borderColor: template.envelopeBorder,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1/2 border-b origin-top transition-transform duration-500"
            style={{
              backgroundColor: template.envelopeFlapBg,
              borderColor: template.envelopeBorder,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />

          {/* Nhánh hoa trang trí góc trái */}
          <div className="absolute top-2 left-2 z-20 pointer-events-none w-28 sm:w-32 h-28 sm:h-32 opacity-95">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
              <path d="M15 95 C 25 70, 35 45, 55 25" stroke={template.flowerLeaf} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30 65 C 22 55, 18 42, 22 35 C 30 38, 32 52, 30 65" fill={template.flowerLeaf} opacity="0.8" />
              <path d="M42 45 C 48 35, 58 32, 60 40 C 52 46, 46 48, 42 45" fill={template.flowerLeaf} opacity="0.8" />
              <path d="M25 80 C 15 78, 12 68, 18 64 C 24 67, 26 75, 25 80" fill={template.flowerLeaf} opacity="0.75" />

              <g transform="translate(18, 50)">
                <circle cx="8" cy="8" r="7" fill={template.flowerPrimary} opacity="0.85" />
                <circle cx="16" cy="10" r="6" fill={template.flowerSecondary} opacity="0.85" />
                <circle cx="12" cy="18" r="6.5" fill={template.flowerPrimary} opacity="0.9" />
                <circle cx="4" cy="15" r="6" fill={template.flowerSecondary} opacity="0.85" />
                <circle cx="10" cy="13" r="2" fill="#FFFFFF" />
              </g>
              <g transform="translate(32, 28)">
                <circle cx="8" cy="7" r="7.5" fill={template.flowerPrimary} opacity="0.9" />
                <circle cx="18" cy="9" r="6.5" fill={template.flowerSecondary} opacity="0.9" />
                <circle cx="14" cy="19" r="7" fill={template.flowerPrimary} opacity="0.9" />
                <circle cx="5" cy="16" r="6.5" fill={template.flowerSecondary} opacity="0.9" />
                <circle cx="11" cy="13" r="2.5" fill="#FFFFFF" />
              </g>
              <g transform="translate(6, 75)">
                <circle cx="7" cy="7" r="6.5" fill={template.flowerSecondary} opacity="0.8" />
                <circle cx="15" cy="8" r="5.5" fill={template.flowerPrimary} opacity="0.8" />
                <circle cx="11" cy="16" r="6" fill={template.flowerSecondary} opacity="0.8" />
                <circle cx="4" cy="14" r="5.5" fill={template.flowerPrimary} opacity="0.8" />
                <circle cx="9" cy="11" r="1.8" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Con dấu sáp */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
            <div
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full shadow-xl border-2 border-[#FFF0BA] flex items-center justify-center relative group-hover:scale-105 transition-transform"
              style={{
                backgroundImage: `linear-gradient(135deg, ${template.sealFrom}, ${template.sealVia}, ${template.sealTo})`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shadow-inner"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${template.sealVia}, ${template.sealTo})`,
                }}
              >
                <svg viewBox="0 0 24 24" fill="#4A3205" className="w-7 h-7 drop-shadow-xs opacity-90">
                  <path d="M12 2C13 5 15 7 18 8C15 9 13 11 12 14C11 11 9 9 6 8C9 7 11 5 12 2Z" />
                  <circle cx="12" cy="12" r="3.5" fill="#3D2802" />
                  <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" fill="none" stroke="#4A3205" strokeWidth="1" />
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
