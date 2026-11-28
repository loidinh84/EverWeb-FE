import {
  Calendar,
  Camera,
  Clock,
  Heart,
  MapPin,
  Navigation,
  Shirt,
  Sparkles,
} from "lucide-react";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";
import weddingCouple from "../../assets/image/wedding-couple.jpg";
import beachHero from "../../assets/image/template-beach-hero.webp";
import RoyalRibbonLayout from "./RoyalRibbonLayout";

const LOVE_STORY_MILESTONES = [
  {
    date: "Mùa Thu 2022",
    title: "Lần đầu gặp gỡ",
    desc: "Một cuộc gặp gỡ tình cờ nhưng lại mở ra hành trình dài thật dịu dàng bên nhau.",
  },
  {
    date: "Tháng 05.2024",
    title: "Chuyến đi đáng nhớ",
    desc: "Cùng nhau đi qua những thành phố mới và nhận ra đối phương chính là nhà.",
  },
  {
    date: "Tháng 02.2026",
    title: "Lời cầu hôn",
    desc: "Một chiếc nhẫn nhỏ, một lời hứa trọn đời dưới ánh hoàng hôn thật đẹp.",
  },
];

function MiniWeddingCalendar({ weddingDate, accentColor = "#8F1D2C", pillBg = "#731522", dark = false }) {
  const parsed = weddingDate ? new Date(weddingDate) : new Date(2026, 10, 13);
  const validDate = isNaN(parsed.getTime()) ? new Date(2026, 10, 13) : parsed;
  const year = validDate.getFullYear();
  const month = validDate.getMonth();
  const targetDay = validDate.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=CN
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div
      className={`rounded-2xl p-4 border ${
        dark
          ? "bg-stone-900 border-stone-700 text-white"
          : "bg-white border-stone-200 text-stone-800"
      }`}
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-current/10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: dark ? "#FFFFFF" : accentColor }}>
          Tháng {String(month + 1).padStart(2, "0")} / {year}
        </span>
        <span className="text-[10px] opacity-70">Ngày Trọng Đại</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold opacity-60 mb-1.5">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {cells.map((day, idx) => {
          const isWeddingDay = day === targetDay;
          return (
            <div
              key={idx}
              className="h-7 flex items-center justify-center relative"
            >
              {day ? (
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                    isWeddingDay ? "text-white font-bold shadow-sm" : ""
                  }`}
                  style={isWeddingDay ? { backgroundColor: pillBg } : undefined}
                >
                  {day}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TemplateLayouts({
  template,
  wedding,
  guestName,
  timeLeft,
  isGuestMode,
  onUploadHero,
  onUploadGroom,
  onUploadBride,
  onSelectPhoto,
  onCloseEnvelope,
}) {
  const layoutType = template.layoutType;

  if (layoutType === "royal-ribbon") {
    return (
      <RoyalRibbonLayout
        wedding={wedding}
        timeLeft={timeLeft}
        isGuestMode={isGuestMode}
        onUploadHero={onUploadHero}
        onCloseEnvelope={onCloseEnvelope}
      />
    );
  }

  // =========================================================================
  // MẪU N01: SONG HỶ TRUYỀN THỐNG HIỆN ĐẠI (GIA TIÊN & TIỆC CƯỚI SẢNH)
  // =========================================================================
  if (layoutType === "songhy") {
    const dressColors = [
      { name: "Đỏ Đô", hex: "#731522" },
      { name: "Vàng Kem", hex: "#F3DEC0" },
      { name: "Nâu Trầm", hex: "#5C4033" },
      { name: "Đen", hex: "#1F1B18" },
    ];
    const albumPhotos = [
      wedding.hero_photo,
      heroWedding,
      weddingCouple,
      galleryDining,
    ];

    return (
      <>
        <div className="w-full bg-[#731522] border-b border-[#D9B36C]/40 py-3.5 px-6 text-center">
          <button
            type="button"
            onClick={onCloseEnvelope}
            className="text-xs text-[#F7DC94] hover:underline font-medium cursor-pointer"
          >
            ← Đóng lại Cổng Song Hỷ
          </button>
        </div>

        {/* 1. Banner Song Hỷ & Bìa Thiệp Khung Chỉ Vàng */}
        <section
          id="cover-section"
          className="bg-[#731522] text-[#FFF4E6] px-5 pt-6 pb-9 text-center relative"
        >
          <div className="border border-[#D9B36C]/60 rounded-2xl p-4 space-y-4 bg-[#64101D]/60">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#D9B36C]/20 border border-[#D9B36C] flex items-center justify-center text-2xl font-bold text-[#F7DC94]">
              囍
            </div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#F2CF7E]">
              TRÂN TRỌNG KÍNH MỜI {guestName.toUpperCase()}
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              {wedding.groom_name} & {wedding.bride_name}
            </h2>

            <div className="relative aspect-[4/5] rounded-t-full overflow-hidden border-2 border-[#D9B36C] shadow-xl">
              <img
                src={wedding.hero_photo}
                alt="Ảnh cưới"
                className="w-full h-full object-cover object-top"
              />
              {!isGuestMode && (
                <button
                  type="button"
                  onClick={onUploadHero}
                  className="absolute bottom-3 right-3 bg-black/65 hover:bg-black text-white px-2.5 py-1.5 rounded-full text-[11px] flex items-center gap-1 cursor-pointer z-20"
                >
                  <Camera size={12} />
                  <span>Đổi ảnh bìa</span>
                </button>
              )}
            </div>

            <p className="text-xs text-[#F7E5D4] italic leading-relaxed px-2">
              “{wedding.quote}”
            </p>
          </div>
        </section>

        {/* 2. Thiệp Báo Hỷ Hai Họ Đối Xứng & Chân Dung */}
        <section id="moments-section" className="py-8 px-5 bg-[#FDF6F2] text-center space-y-6">
          <div className="border-y border-[#D9B36C]/50 py-5 grid grid-cols-2 gap-4 relative">
            <div className="space-y-1 pr-2 border-r border-[#D9B36C]/30">
              <p className="text-[10px] uppercase tracking-widest text-[#8F1D2C] font-bold">
                Nhà Trai
              </p>
              <p className="text-xs font-semibold text-stone-800 whitespace-pre-line">
                {wedding.groom_parents}
              </p>
              <p className="text-[10px] text-stone-500">{wedding.groom_address}</p>
              <p className="text-sm font-display font-bold text-[#731522] pt-1">
                {wedding.groom_name}
              </p>
            </div>
            <div className="space-y-1 pl-2">
              <p className="text-[10px] uppercase tracking-widest text-[#8F1D2C] font-bold">
                Nhà Gái
              </p>
              <p className="text-xs font-semibold text-stone-800 whitespace-pre-line">
                {wedding.bride_parents}
              </p>
              <p className="text-[10px] text-stone-500">{wedding.bride_address}</p>
              <p className="text-sm font-display font-bold text-[#731522] pt-1">
                {wedding.bride_name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <div
                onClick={() => onSelectPhoto(wedding.groom_photo)}
                className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#D9B36C] cursor-pointer"
              >
                <img src={wedding.groom_photo} alt="Chú rể" className="w-full h-full object-cover" />
              </div>
              {!isGuestMode && (
                <button
                  type="button"
                  onClick={onUploadGroom}
                  className="absolute bottom-2 right-2 bg-black/65 text-white p-1.5 rounded-full cursor-pointer"
                >
                  <Camera size={12} />
                </button>
              )}
            </div>
            <div className="relative">
              <div
                onClick={() => onSelectPhoto(wedding.bride_photo)}
                className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#D9B36C] cursor-pointer"
              >
                <img src={wedding.bride_photo} alt="Cô dâu" className="w-full h-full object-cover" />
              </div>
              {!isGuestMode && (
                <button
                  type="button"
                  onClick={onUploadBride}
                  className="absolute bottom-2 right-2 bg-black/65 text-white p-1.5 rounded-full cursor-pointer"
                >
                  <Camera size={12} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 3. Mốc Sự Kiện, Âm Lịch & Tờ Lịch Tháng */}
        <section id="arch-events-section" className="px-5 pb-8 bg-[#FDF6F2] space-y-5">
          <div className="text-center space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8F1D2C] font-bold">
              Trân Trọng Báo Hỷ
            </p>
            <h3 className="text-2xl font-display font-bold text-stone-900">
              Thời Gian & Địa Điểm
            </h3>
            <p className="text-xs text-[#8F1D2C] font-medium">
              {wedding.wedding_date_display} · ({wedding.lunar_date})
            </p>
          </div>

          <MiniWeddingCalendar
            weddingDate={wedding.wedding_date}
            accentColor="#8F1D2C"
            pillBg="#731522"
          />

          <div className="space-y-3">
            {wedding.events.map((ev, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#D9B36C]/50 p-4 shadow-xs flex gap-3 items-center"
              >
                <img
                  src={ev.photo}
                  alt={ev.title}
                  className="w-16 h-20 rounded-xl object-cover shrink-0 border border-[#D9B36C]/40"
                />
                <div className="text-left space-y-1">
                  <p className="text-xs font-bold text-[#731522] uppercase tracking-wider">
                    {ev.title}
                  </p>
                  <p className="text-[11px] font-semibold text-stone-800">{ev.time}</p>
                  <p className="text-[11px] text-stone-600">{ev.venue}</p>
                  <p className="text-[10px] text-stone-500">{ev.address}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href={wedding.map_url}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-xl bg-[#731522] hover:bg-[#5E111C] text-[#F7DC94] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Navigation size={13} />
            <span>Xem Chỉ Đường Trên Google Maps</span>
          </a>
        </section>

        {/* 4. Lịch trình hôn lễ & Dress Code */}
        <section id="schedule-section" className="px-5 py-7 bg-white border-y border-[#E8D5C4] space-y-6">
          <div className="space-y-3">
            <h4 className="text-xl font-display font-bold text-[#731522] text-center">
              Lịch Trình Hôn Lễ
            </h4>
            <div className="space-y-2.5">
              {wedding.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#FDF6F2] border border-[#D9B36C]/30"
                >
                  <span className="px-2 py-1 rounded-lg bg-[#731522] text-[#F7DC94] text-[10px] font-bold shrink-0">
                    {item.time}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-stone-900">{item.label}</p>
                    <p className="text-[11px] text-stone-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code */}
          <div className="pt-4 border-t border-[#F0E2D6] text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#8F1D2C]">
              <Shirt size={13} />
              <span>Dress Code Gợi Ý</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Áo dài truyền thống hoặc trang phục lịch sự theo bảng màu:
            </p>
            <div className="flex justify-center gap-4 pt-1">
              {dressColors.map((c) => (
                <div key={c.name} className="flex flex-col items-center gap-1">
                  <span
                    className="w-7 h-7 rounded-full border border-stone-300 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] text-stone-600">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Câu chuyện tình yêu & Album ảnh */}
        <section id="our-story-section" className="px-5 py-8 bg-[#FDF6F2] space-y-5">
          <div className="text-center space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8F1D2C] font-bold">
              Our Love Story
            </p>
            <h3 className="text-2xl font-display font-bold text-stone-900">
              Chặng Đường Yêu Thương
            </h3>
          </div>

          <div className="space-y-3">
            {LOVE_STORY_MILESTONES.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3.5 border border-[#D9B36C]/40 shadow-2xs"
              >
                <span className="text-[10px] font-bold uppercase text-[#8F1D2C]">
                  {m.date}
                </span>
                <p className="text-xs font-bold text-stone-900 mt-0.5">{m.title}</p>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {albumPhotos.map((src, i) => (
              <div
                key={i}
                onClick={() => onSelectPhoto(src)}
                className="aspect-[4/5] rounded-xl overflow-hidden border border-[#D9B36C]/60 cursor-pointer shadow-xs"
              >
                <img src={src} alt={`Album ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* 6. Đếm ngược nhung đỏ */}
        <section
          id="countdown-section"
          className="bg-[#731522] text-white py-8 px-5 text-center space-y-4"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F2CF7E]">
            Đếm Ngược Ngày Chung Đôi
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { v: timeLeft.days, l: "Ngày" },
              { v: timeLeft.hours, l: "Giờ" },
              { v: timeLeft.minutes, l: "Phút" },
              { v: timeLeft.seconds, l: "Giây" },
            ].map((c, idx) => (
              <div
                key={idx}
                className="bg-[#5A0E18] border border-[#D9B36C]/60 rounded-xl py-2.5"
              >
                <span className="block text-xl font-display font-bold text-[#F7DC94]">
                  {c.v}
                </span>
                <span className="text-[10px] uppercase text-[#F5D78E]/80">
                  {c.l}
                </span>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  // =========================================================================
  // MẪU N02: TẠP CHÍ MINIMALIST EDITORIAL (AT01)
  // =========================================================================
  if (layoutType === "editorial") {
    const dressColors = [
      { name: "Đen", hex: "#1C1917" },
      { name: "Trắng", hex: "#FFFFFF" },
      { name: "Be", hex: "#E7DFD3" },
      { name: "Xám Ghi", hex: "#78716C" },
    ];
    const gallery = [weddingCouple, galleryCeremony, galleryBouquet, beachHero];

    return (
      <>
        <div className="w-full bg-white border-b border-stone-900 py-3 px-5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] font-semibold">
          <button
            type="button"
            onClick={onCloseEnvelope}
            className="text-stone-700 hover:text-black cursor-pointer"
          >
            ← Bìa tạp chí
          </button>
          <span>{wedding.date_badge}</span>
        </div>

        {/* 1. Editorial Hero */}
        <section id="cover-section" className="p-6 bg-white border-b border-stone-900 space-y-5">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
              THE WEDDING ISSUE · {guestName}
            </p>
            <h2 className="text-4xl font-display font-semibold tracking-tight text-stone-950 leading-none">
              {wedding.groom_name}{" "}
              <span className="italic font-light text-stone-500">&</span>{" "}
              {wedding.bride_name}
            </h2>
          </div>

          <div className="relative aspect-[4/5] border border-stone-900 overflow-hidden">
            <img
              src={wedding.hero_photo}
              alt="Editorial Hero"
              className="w-full h-full object-cover object-top"
            />
            {!isGuestMode && (
              <button
                type="button"
                onClick={onUploadHero}
                className="absolute bottom-3 right-3 bg-black/75 text-white px-2.5 py-1.5 rounded-full text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Camera size={12} />
                <span>Đổi ảnh bìa</span>
              </button>
            )}
          </div>

          <blockquote className="border-l-2 border-stone-900 pl-3.5 text-xs text-stone-700 italic leading-relaxed">
            {wedding.quote}
          </blockquote>

          {/* Hai họ tối giản */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-200 text-[11px]">
            <div>
              <p className="uppercase tracking-widest text-[9px] text-stone-500 font-bold">
                Groom&apos;s Family
              </p>
              <p className="font-medium text-stone-800 whitespace-pre-line mt-1">
                {wedding.groom_parents}
              </p>
            </div>
            <div>
              <p className="uppercase tracking-widest text-[9px] text-stone-500 font-bold">
                Bride&apos;s Family
              </p>
              <p className="font-medium text-stone-800 whitespace-pre-line mt-1">
                {wedding.bride_parents}
              </p>
            </div>
          </div>
        </section>

        {/* 2. Polaroid Moments */}
        <section id="moments-section" className="p-6 bg-[#F7F6F3] border-b border-stone-900 space-y-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-display italic font-semibold text-stone-900">
              Polaroid Moments
            </h3>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
              02 Frames
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-2 pb-4 border border-stone-300 shadow-sm -rotate-1 relative">
              <div
                onClick={() => onSelectPhoto(wedding.groom_photo)}
                className="aspect-[3/4] overflow-hidden cursor-pointer bg-stone-100"
              >
                <img src={wedding.groom_photo} alt="Chú rể" className="w-full h-full object-cover" />
              </div>
              {!isGuestMode && (
                <button
                  type="button"
                  onClick={onUploadGroom}
                  className="absolute bottom-9 right-3 bg-black/70 text-white p-1.5 rounded-full cursor-pointer"
                >
                  <Camera size={11} />
                </button>
              )}
              <p className="text-[11px] font-display italic text-stone-800 mt-2 text-center">
                Groom · {wedding.groom_name}
              </p>
            </div>

            <div className="bg-white p-2 pb-4 border border-stone-300 shadow-sm rotate-1 relative">
              <div
                onClick={() => onSelectPhoto(wedding.bride_photo)}
                className="aspect-[3/4] overflow-hidden cursor-pointer bg-stone-100"
              >
                <img src={wedding.bride_photo} alt="Cô dâu" className="w-full h-full object-cover" />
              </div>
              {!isGuestMode && (
                <button
                  type="button"
                  onClick={onUploadBride}
                  className="absolute bottom-9 right-3 bg-black/70 text-white p-1.5 rounded-full cursor-pointer"
                >
                  <Camera size={11} />
                </button>
              )}
              <p className="text-[11px] font-display italic text-stone-800 mt-2 text-center">
                Bride · {wedding.bride_name}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Timeline 1px + Lịch Tháng + Dress Code */}
        <section id="schedule-section" className="p-6 bg-white border-b border-stone-900 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">
              ITINERARY & VENUE
            </p>
            <h3 className="text-2xl font-display font-semibold text-stone-900 mt-0.5">
              Lịch Trình & Sự Kiện
            </h3>
            <p className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
              <MapPin size={12} />
              <span>{wedding.venue_name} · {wedding.venue_address}</span>
            </p>
          </div>

          <MiniWeddingCalendar
            weddingDate={wedding.wedding_date}
            accentColor="#1C1917"
            pillBg="#1C1917"
          />

          <div className="border-l border-stone-900 ml-2 pl-5 space-y-4">
            {wedding.timeline.map((item, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-stone-900" />
                <p className="text-[11px] font-mono font-bold text-stone-900">
                  {item.time} — {item.label}
                </p>
                <p className="text-xs text-stone-600 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Dress Code Monochrome */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900">
                DRESS CODE
              </p>
              <p className="text-[11px] text-stone-500">Minimalist / Monochrome</p>
            </div>
            <div className="flex gap-2">
              {dressColors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="w-6 h-6 rounded-full border border-stone-400"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <a
            href={wedding.map_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-stone-900 px-4 py-2 text-xs font-semibold text-stone-900 hover:bg-stone-900 hover:text-white transition"
          >
            <Navigation size={12} />
            <span>Mở Bản Đồ Chỉ Đường</span>
          </a>
        </section>

        {/* 4. Love Story & Editorial Gallery */}
        <section id="our-story-section" className="p-6 bg-[#F7F6F3] border-b border-stone-900 space-y-5">
          <h3 className="text-2xl font-display italic font-semibold text-stone-900">
            Our Story & Gallery
          </h3>
          <div className="space-y-2.5">
            {LOVE_STORY_MILESTONES.map((m, idx) => (
              <div key={idx} className="bg-white border border-stone-300 p-3 space-y-0.5">
                <p className="text-[10px] font-mono uppercase text-stone-500">{m.date}</p>
                <p className="text-xs font-bold text-stone-900">{m.title}</p>
                <p className="text-[11px] text-stone-600">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {gallery.map((src, idx) => (
              <div
                key={idx}
                onClick={() => onSelectPhoto(src)}
                className="aspect-square border border-stone-900 overflow-hidden cursor-pointer"
              >
                <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Countdown Minimalist */}
        <section id="countdown-section" className="p-6 bg-stone-900 text-white text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
            COUNTDOWN TO {wedding.date_badge}
          </p>
          <div className="grid grid-cols-4 divide-x divide-stone-700">
            {[
              { v: timeLeft.days, l: "Days" },
              { v: timeLeft.hours, l: "Hrs" },
              { v: timeLeft.minutes, l: "Min" },
              { v: timeLeft.seconds, l: "Sec" },
            ].map((c, idx) => (
              <div key={idx} className="py-1">
                <span className="block text-2xl font-display font-semibold">{c.v}</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400">
                  {c.l}
                </span>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  // =========================================================================
  // MẪU N03: VÒM HOA BOTANICAL (NA01 - SÂN VƯỜN NGHỆ THUẬT)
  // =========================================================================
  const gardenDressColors = [
    { name: "Sage", hex: "#88A889" },
    { name: "Kem", hex: "#FAF6EE" },
    { name: "Nâu Đất", hex: "#9E7E63" },
    { name: "Rêu", hex: "#4A634E" },
  ];
  const gardenAlbum = [galleryCeremony, galleryBouquet, galleryDining, weddingCouple];

  return (
    <>
      <div className="w-full bg-[#EEF3EB] border-b border-[#CAD6C4] py-3.5 px-6 text-center">
        <button
          type="button"
          onClick={onCloseEnvelope}
          className="text-xs text-[#4A634E] hover:underline font-medium cursor-pointer"
        >
          ← Xem lại Thiệp Vòm Hoa Lá
        </button>
      </div>

      {/* 1. Botanical Arch Cover */}
      <section id="cover-section" className="p-6 text-center space-y-5 bg-[#FAFDF8]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#4A634E] font-semibold">
          GARDEN WEDDING · KÍNH MỜI {guestName.toUpperCase()}
        </p>

        <div className="relative max-w-[290px] mx-auto aspect-[3/4] rounded-t-full overflow-hidden border-2 border-[#8FA88E] p-1.5 bg-white shadow-lg">
          <div className="w-full h-full rounded-t-full overflow-hidden relative">
            <img
              src={wedding.hero_photo}
              alt="Garden Wedding"
              className="w-full h-full object-cover object-top"
            />
            {!isGuestMode && (
              <button
                type="button"
                onClick={onUploadHero}
                className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1.5 rounded-full text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Camera size={12} />
                <span>Đổi ảnh</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-3xl sm:text-4xl font-display italic font-semibold text-[#243025]">
            {wedding.groom_name} & {wedding.bride_name}
          </h2>
          <p className="text-xs text-[#4A634E] font-medium">
            {wedding.wedding_date_display}
          </p>
          <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed pt-1">
            {wedding.quote}
          </p>
        </div>
      </section>

      {/* 2. Vòng tròn Đếm ngược Botanical */}
      <section id="countdown-section" className="py-7 px-5 bg-[#3E5442] text-white text-center space-y-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#CFE0CC]">
          Save The Date · {wedding.date_badge}
        </p>
        <div className="flex justify-center gap-3">
          {[
            { v: timeLeft.days, l: "Ngày" },
            { v: timeLeft.hours, l: "Giờ" },
            { v: timeLeft.minutes, l: "Phút" },
            { v: timeLeft.seconds, l: "Giây" },
          ].map((c, idx) => (
            <div
              key={idx}
              className="w-16 h-16 rounded-full border border-[#B8D0B9]/60 bg-[#314435] flex flex-col items-center justify-center shadow-inner"
            >
              <span className="text-lg font-display font-bold">{c.v}</span>
              <span className="text-[9px] uppercase text-[#CFE0CC]">{c.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Lưới ảnh Sole Nghệ thuật */}
      <section id="moments-section" className="p-6 bg-[#F6F8F4] space-y-4">
        <div className="text-center">
          <Heart className="w-4 h-4 text-[#4A634E] mx-auto mb-1" />
          <h3 className="text-2xl font-display italic font-semibold text-[#243025]">
            Khoảnh Khắc Của Chúng Mình
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 items-start">
          <div className="relative">
            <div
              onClick={() => onSelectPhoto(wedding.groom_photo)}
              className="aspect-[3/4] rounded-3xl overflow-hidden border border-[#CAD6C4] shadow-sm cursor-pointer"
            >
              <img src={wedding.groom_photo} alt="Chú rể" className="w-full h-full object-cover" />
            </div>
            {!isGuestMode && (
              <button
                type="button"
                onClick={onUploadGroom}
                className="absolute bottom-8 right-2 bg-black/60 text-white p-1.5 rounded-full cursor-pointer"
              >
                <Camera size={12} />
              </button>
            )}
            <p className="text-[11px] font-medium text-[#4A634E] text-center mt-1.5">
              Chú rể {wedding.groom_name}
            </p>
          </div>

          <div className="relative mt-6">
            <div
              onClick={() => onSelectPhoto(wedding.bride_photo)}
              className="aspect-[3/4] rounded-3xl overflow-hidden border border-[#CAD6C4] shadow-sm cursor-pointer"
            >
              <img src={wedding.bride_photo} alt="Cô dâu" className="w-full h-full object-cover" />
            </div>
            {!isGuestMode && (
              <button
                type="button"
                onClick={onUploadBride}
                className="absolute bottom-8 right-2 bg-black/60 text-white p-1.5 rounded-full cursor-pointer"
              >
                <Camera size={12} />
              </button>
            )}
            <p className="text-[11px] font-medium text-[#4A634E] text-center mt-1.5">
              Cô dâu {wedding.bride_name}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Lịch tháng + Địa điểm + Lịch trình + Dress Code */}
      <section id="arch-events-section" className="px-6 pb-8 bg-[#F6F8F4] space-y-4">
        <MiniWeddingCalendar
          weddingDate={wedding.wedding_date}
          accentColor="#4A634E"
          pillBg="#4A634E"
        />

        <div className="bg-white rounded-3xl border border-[#CAD6C4] p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-[#4A634E] font-bold text-xs uppercase tracking-wider">
            <Calendar size={14} />
            <span>Địa Điểm & Nghi Lễ</span>
          </div>
          {wedding.events.map((ev, i) => (
            <div
              key={i}
              className="pt-2.5 border-t border-[#EEF3EB] first:border-t-0 first:pt-0"
            >
              <p className="text-xs font-bold text-[#243025]">{ev.title}</p>
              <p className="text-[11px] text-[#4A634E] font-medium">{ev.time}</p>
              <p className="text-[11px] text-stone-600">{ev.venue} — {ev.address}</p>
            </div>
          ))}
          <a
            href={wedding.map_url}
            target="_blank"
            rel="noreferrer"
            className="w-full mt-2 py-2.5 rounded-2xl bg-[#4A634E] hover:bg-[#324535] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Navigation size={12} />
            <span>Chỉ Đường Google Maps</span>
          </a>
        </div>

        {/* Timeline sân vườn */}
        <div id="schedule-section" className="bg-white rounded-3xl border border-[#CAD6C4] p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-[#4A634E] font-bold text-xs uppercase tracking-wider">
            <Clock size={14} />
            <span>Lịch Trình Tiệc Cưới</span>
          </div>
          <div className="space-y-2">
            {wedding.timeline.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs border-b border-[#EEF3EB] pb-2 last:border-b-0 last:pb-0">
                <span className="font-semibold text-[#243025]">{item.label}</span>
                <span className="text-[11px] font-medium text-[#4A634E] bg-[#EEF3EB] px-2.5 py-0.5 rounded-full">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dress code + Album */}
        <div id="our-story-section" className="bg-white rounded-3xl border border-[#CAD6C4] p-5 space-y-4 shadow-xs text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4A634E]">
            <Sparkles size={13} />
            <span>Dress Code & Album Kỷ Niệm</span>
          </div>
          <div className="flex justify-center gap-4">
            {gardenDressColors.map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <span
                  className="w-7 h-7 rounded-full border border-[#CAD6C4]"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[10px] text-stone-600">{c.name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {gardenAlbum.map((src, idx) => (
              <div
                key={idx}
                onClick={() => onSelectPhoto(src)}
                className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#CAD6C4] cursor-pointer"
              >
                <img src={src} alt={`Garden ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
