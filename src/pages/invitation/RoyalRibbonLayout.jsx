import { useState } from "react";
import {
  Calendar,
  Car,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Gift,
  Heart,
  MapPin,
  Navigation,
  Plus,
  Minus,
  Train,
  Camera,
} from "lucide-react";

const DEFAULT_FAQS = [
  {
    q: "Tôi có thể đi cùng người thân hoặc trẻ nhỏ không?",
    a: "Rất hân hạnh được đón tiếp bạn và gia đình! Bạn vui lòng chọn đúng số lượng người đi cùng ở mục Xác nhận tham dự (RSVP) bên dưới để tụi mình chuẩn bị chỗ ngồi chu đáo nhất.",
  },
  {
    q: "Trang phục gợi ý khi tham dự lễ cưới là gì?",
    a: "Tụi mình gợi ý trang phục lịch sự, thanh lịch (tông kem, xanh navy, pastel). Vui lòng tránh trang phục màu trắng tinh dành riêng cho cô dâu nhé.",
  },
  {
    q: "Khu vực sảnh tiệc có bãi đỗ xe cho khách không?",
    a: "Tại sảnh tiệc có bãi đỗ xe ô tô và xe máy rộng rãi, hoàn toàn miễn phí cho khách mời tham dự.",
  },
];

function ToileCornerSvg({ className = "" }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15 160 C 35 115, 65 75, 115 40 M40 165 C 65 130, 95 95, 145 75"
        stroke="#224578"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <g fill="#224578" opacity="0.85">
        <circle cx="52" cy="64" r="14" opacity="0.2" />
        <circle cx="52" cy="64" r="9" opacity="0.35" />
        <circle cx="52" cy="64" r="4" />
        <circle cx="88" cy="44" r="11" opacity="0.25" />
        <circle cx="88" cy="44" r="5" />
        <circle cx="34" cy="105" r="12" opacity="0.25" />
        <circle cx="34" cy="105" r="5" />
        <path d="M64 56 C76 42, 92 48, 82 64 C74 72, 62 66, 64 56Z" opacity="0.45" />
        <path d="M32 76 C22 60, 38 48, 46 66 C48 76, 38 82, 32 76Z" opacity="0.45" />
        <path d="M98 72 C112 60, 128 70, 116 84 C106 90, 96 82, 98 72Z" opacity="0.35" />
      </g>
    </svg>
  );
}

function ChampagneTowerSvg() {
  return (
    <svg
      viewBox="0 0 200 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-36 mx-auto"
    >
      {/* Bottle pouring */}
      <g transform="translate(88, 6) rotate(24)">
        <rect x="0" y="10" width="16" height="36" rx="4" fill="#1B365D" />
        <rect x="5" y="0" width="6" height="12" rx="1.5" fill="#1B365D" />
      </g>
      <path
        d="M95 45 Q98 56 100 64"
        stroke="#3B6AA8"
        strokeWidth="2.5"
        strokeDasharray="3 2"
        strokeLinecap="round"
      />
      {/* Top tier: 1 glass */}
      <path d="M90 66 H110 L105 78 H95 Z" fill="#E3ECF7" stroke="#1B365D" strokeWidth="1.4" />
      <line x1="100" y1="78" x2="100" y2="88" stroke="#1B365D" strokeWidth="1.4" />
      <line x1="94" y1="88" x2="106" y2="88" stroke="#1B365D" strokeWidth="1.4" />
      {/* Middle tier: 2 glasses */}
      {[82, 118].map((cx) => (
        <g key={cx}>
          <path
            d={`M${cx - 10} 90 H${cx + 10} L${cx + 5} 102 H${cx - 5} Z`}
            fill="#E3ECF7"
            stroke="#1B365D"
            strokeWidth="1.4"
          />
          <line x1={cx} y1="102" x2={cx} y2="112" stroke="#1B365D" strokeWidth="1.4" />
          <line x1={cx - 6} y1="112" x2={cx + 6} y2="112" stroke="#1B365D" strokeWidth="1.4" />
        </g>
      ))}
      {/* Bottom tier: 3 glasses */}
      {[64, 100, 136].map((cx) => (
        <g key={cx}>
          <path
            d={`M${cx - 10} 114 H${cx + 10} L${cx + 5} 126 H${cx - 5} Z`}
            fill="#E3ECF7"
            stroke="#1B365D"
            strokeWidth="1.4"
          />
          <line x1={cx} y1="126" x2={cx} y2="136" stroke="#1B365D" strokeWidth="1.4" />
          <line x1={cx - 6} y1="136" x2={cx + 6} y2="136" stroke="#1B365D" strokeWidth="1.4" />
        </g>
      ))}
      {/* Floral accents */}
      <circle cx="58" cy="144" r="6" fill="#224578" opacity="0.25" />
      <circle cx="142" cy="144" r="6" fill="#224578" opacity="0.25" />
      <line x1="42" y1="142" x2="158" y2="142" stroke="#1B365D" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}

export default function RoyalRibbonLayout({
  wedding,
  timeLeft,
  isGuestMode,
  onUploadHero,
  onCloseEnvelope,
}) {
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [copiedBank, setCopiedBank] = useState("");
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const groomInitial = (wedding.groom_name || "C").trim().charAt(0).toUpperCase();
  const brideInitial = (wedding.bride_name || "D").trim().charAt(0).toUpperCase();
  const monogram = `${groomInitial}&${brideInitial}`;

  const handleCopyAccount = (label, accountNo) => {
    if (!accountNo) return;
    navigator.clipboard?.writeText(accountNo);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(""), 2000);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#FAF8F4] text-[#1B365D] font-sans">
      {/* Top Navy Header */}
      <header className="bg-[#1B365D] text-white px-5 py-3 flex items-center justify-between">
        <div className="w-9 h-9 rounded-full border border-white/50 flex items-center justify-center text-[11px] font-display font-bold tracking-wider">
          {monogram}
        </div>
        <button
          type="button"
          onClick={onCloseEnvelope}
          className="text-[11px] text-white/85 hover:text-white underline-offset-4 hover:underline cursor-pointer"
        >
          ← Đóng phong bì ruy-băng
        </button>
      </header>

      {/* Hero Blue Toile Card */}
      <section
        id="cover-section"
        className="relative px-5 py-10 bg-[#F3F6FA] border-b border-[#DCE4F0] overflow-hidden"
      >
        <ToileCornerSvg className="w-44 h-44 absolute -top-4 -left-4 pointer-events-none" />
        <ToileCornerSvg className="w-44 h-44 absolute -top-4 -right-4 -scale-x-100 pointer-events-none" />
        <ToileCornerSvg className="w-44 h-44 absolute -bottom-4 -left-4 -scale-y-100 pointer-events-none" />
        <ToileCornerSvg className="w-44 h-44 absolute -bottom-4 -right-4 scale-[-1] pointer-events-none" />

        <div className="relative z-10 max-w-[300px] mx-auto bg-[#FAF8F4]/95 border border-[#B8C7DD] rounded-sm px-6 py-10 text-center shadow-sm">
          <div className="border border-[#DCE4F0] p-4 space-y-4">
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#4E688E]">
              TRÂN TRỌNG KÍNH MỜI
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1B365D] leading-tight">
              {wedding.groom_name}
              <span className="block text-xl italic font-normal text-[#4E688E] my-1">
                &amp;
              </span>
              {wedding.bride_name}
            </h1>
            <div className="w-10 h-px bg-[#B8C7DD] mx-auto" />
            <p className="text-xs font-semibold tracking-[0.2em] text-[#1B365D]">
              {wedding.date_badge}
            </p>
            <p className="text-[11px] text-[#4E688E] leading-relaxed">
              {wedding.venue_name}
            </p>

            {wedding.hero_photo && (
              <div className="relative mt-3 rounded-lg overflow-hidden border border-[#DCE4F0] aspect-[4/3]">
                <img
                  src={wedding.hero_photo}
                  alt="Ảnh cưới"
                  className="w-full h-full object-cover"
                />
                {!isGuestMode && (
                  <button
                    type="button"
                    onClick={onUploadHero}
                    className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#1B365D] shadow cursor-pointer hover:bg-white"
                  >
                    <Camera size={11} />
                    <span>Đổi ảnh</span>
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => scrollTo("countdown-section")}
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-[#4E688E] hover:text-[#1B365D] pt-2 cursor-pointer"
            >
              <span>Cuộn xuống</span>
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* Countdown + Champagne Tower */}
      <section
        id="countdown-section"
        className="px-6 py-10 text-center space-y-5 border-b border-[#E5E9F0]"
      >
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B82A3]">
            Đếm ngược
          </p>
          <h2 className="font-display italic text-2xl text-[#1B365D]">
            Hành trình hạnh phúc bắt đầu sau
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-[320px] mx-auto">
          {[
            { val: timeLeft.days, label: "Ngày" },
            { val: timeLeft.hours, label: "Giờ" },
            { val: timeLeft.minutes, label: "Phút" },
            { val: timeLeft.seconds, label: "Giây" },
          ].map((item) => (
            <div key={item.label} className="py-2">
              <p className="font-display text-2xl sm:text-3xl font-semibold text-[#1B365D] tabular-nums">
                {String(item.val).padStart(2, "0")}
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#6B82A3] mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <ChampagneTowerSvg />

        <div className="pt-2 space-y-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B82A3]">
            Ngày trọng đại
          </p>
          <p className="font-display text-xl text-[#1B365D]">
            {wedding.wedding_date_display}
          </p>
          <p className="text-xs text-[#6B82A3] italic">{wedding.lunar_date}</p>
        </div>
      </section>

      {/* 01 · Location */}
      <section
        id="location-section"
        className="px-6 py-10 space-y-6 border-b border-[#E5E9F0]"
      >
        <div className="text-center space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#6B82A3]">
            01
          </p>
          <h2 className="font-display text-3xl text-[#1B365D]">Địa Điểm</h2>
        </div>

        <div className="space-y-4">
          {(wedding.events || []).slice(0, 2).map((ev, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#DCE4F0] rounded-xl p-5 text-center space-y-2 shadow-2xs"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B82A3]">
                {idx === 0 ? "Nghi thức & Đón khách" : "Tiệc chiêu đãi"}
              </p>
              <h3 className="font-display text-xl font-semibold text-[#1B365D]">
                {ev.venue || wedding.venue_name}
              </h3>
              <p className="text-xs text-[#4E688E] inline-flex items-center justify-center gap-1">
                <Calendar size={12} />
                <span>{ev.time}</span>
              </p>
              <p className="text-xs text-[#6B82A3]">{ev.address}</p>
              <div className="pt-2">
                <a
                  href={wedding.map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#1B365D] px-4 py-1.5 text-[11px] font-semibold text-[#1B365D] hover:bg-[#1B365D] hover:text-white transition"
                >
                  <Navigation size={11} />
                  <span>Mở Google Maps</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#F3F6FA] rounded-xl p-4 space-y-2.5 text-xs text-[#4E688E] border border-[#DCE4F0]">
          <div className="flex items-start gap-2.5">
            <Car size={15} className="shrink-0 mt-0.5 text-[#1B365D]" />
            <div>
              <span className="font-semibold text-[#1B365D]">Di chuyển ô tô / xe máy: </span>
              <span>Có bãi đỗ xe rộng rãi, miễn phí ngay tại khuôn viên sảnh tiệc.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Train size={15} className="shrink-0 mt-0.5 text-[#1B365D]" />
            <div>
              <span className="font-semibold text-[#1B365D]">Gợi ý đi lại: </span>
              <span>Vui lòng có mặt trước giờ khai lễ 15–20 phút để chụp ảnh lưu niệm cùng cô dâu &amp; chú rể.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · The Day (Timeline) */}
      <section
        id="schedule-section"
        className="px-6 py-10 space-y-6 border-b border-[#E5E9F0]"
      >
        <div className="text-center space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#6B82A3]">
            02
          </p>
          <h2 className="font-display text-3xl text-[#1B365D]">Lịch Trình</h2>
        </div>

        <div className="space-y-4 max-w-[330px] mx-auto">
          {(wedding.timeline || []).map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 border-b border-[#E5E9F0] pb-3.5 last:border-b-0 last:pb-0"
            >
              <span className="font-display text-sm font-semibold text-[#1B365D] w-14 shrink-0 pt-0.5">
                {item.time}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1B365D]">{item.label}</p>
                <p className="text-xs text-[#6B82A3] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03 · Dress Code */}
      <section className="px-6 py-10 text-center space-y-4 border-b border-[#E5E9F0]">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#6B82A3]">
          03
        </p>
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#6B82A3]">
          Trang phục gợi ý
        </p>
        <h2 className="font-display text-3xl text-[#1B365D]">
          Thanh Lịch &amp; Trang Trọng
        </h2>
        <p className="text-xs text-[#4E688E] max-w-[290px] mx-auto leading-relaxed">
          Kính mong quý khách lựa chọn trang phục lịch sự (ưu tiên tông kem, xanh navy hoặc pastel). Vui lòng tránh màu trắng tinh nhé.
        </p>
        <div className="flex justify-center gap-3 pt-1">
          {[
            { name: "Xanh Navy", hex: "#1B365D" },
            { name: "Kem Ngà", hex: "#EFE8DC" },
            { name: "Xanh Pastel", hex: "#A8C0DB" },
            { name: "Xám Bạc", hex: "#C8CDD5" },
          ].map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-1">
              <span
                className="w-7 h-7 rounded-full border border-[#DCE4F0] shadow-2xs"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-[10px] text-[#6B82A3]">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 04 · Gift List (Show / Hide Bank Info) */}
      <section
        id="gift-section"
        className="px-6 py-10 text-center space-y-5 border-b border-[#E5E9F0]"
      >
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#6B82A3]">
            04
          </p>
          <h2 className="font-display text-3xl text-[#1B365D]">Mừng Cưới</h2>
        </div>
        <p className="text-xs text-[#4E688E] max-w-[300px] mx-auto leading-relaxed">
          Sự hiện diện của bạn là món quà quý giá nhất với tụi mình. Nếu bạn muốn gửi lời chúc mừng từ xa, thông tin tài khoản ở ngay bên dưới:
        </p>

        <button
          type="button"
          onClick={() => setShowBankInfo((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-md border border-[#1B365D] px-5 py-2 text-xs font-semibold text-[#1B365D] hover:bg-[#1B365D] hover:text-white transition cursor-pointer"
        >
          <Gift size={14} />
          <span>{showBankInfo ? "Ẩn số tài khoản" : "Xem số tài khoản"}</span>
        </button>

        {showBankInfo && (
          <div className="space-y-3 pt-2 max-w-[330px] mx-auto text-left">
            {[
              { key: "groom", label: "Mừng cưới Chú rể", bank: wedding.groom_bank },
              { key: "bride", label: "Mừng cưới Cô dâu", bank: wedding.bride_bank },
            ].map(({ key, label, bank }) => (
              <div
                key={key}
                className="bg-white border border-[#B8C7DD] rounded-lg p-4 space-y-2 shadow-2xs"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B82A3]">
                  {label}
                </p>
                <p className="text-xs font-bold text-[#1B365D]">
                  {bank?.bank_name || "Ngân hàng"} · {bank?.account_name || "Chưa cập nhật"}
                </p>
                <p className="font-mono text-sm font-semibold text-[#1B365D]">
                  {bank?.account_no || "Chưa cập nhật số tài khoản"}
                </p>
                {bank?.account_no && (
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(key, bank.account_no)}
                    className="inline-flex items-center gap-1.5 rounded bg-[#1B365D] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#132744] transition cursor-pointer"
                  >
                    {copiedBank === key ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedBank === key ? "Đã sao chép" : "Sao chép STK"}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 06 · FAQ Accordion */}
      <section className="px-6 py-10 space-y-5 border-b border-[#E5E9F0]">
        <div className="text-center space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#6B82A3]">
            06
          </p>
          <h2 className="font-display text-2xl text-[#1B365D]">
            Câu Hỏi Thường Gặp
          </h2>
        </div>

        <div className="space-y-2 max-w-[340px] mx-auto">
          {DEFAULT_FAQS.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="border-b border-[#DCE4F0] pb-2.5"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-3 py-2 text-left text-xs font-semibold text-[#1B365D] cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <Minus size={14} className="shrink-0 text-[#6B82A3]" />
                  ) : (
                    <Plus size={14} className="shrink-0 text-[#6B82A3]" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-[#4E688E] leading-relaxed pb-1">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="px-6 py-8 text-center space-y-2 bg-[#FAF8F4]">
        <div className="w-12 h-12 rounded-full border border-[#B8C7DD] mx-auto flex items-center justify-center font-display font-bold text-sm text-[#1B365D]">
          {monogram}
        </div>
        <p className="text-xs italic text-[#6B82A3]">Trân trọng đón tiếp</p>
        <p className="font-display text-2xl text-[#1B365D]">
          {wedding.groom_name} &amp; {wedding.bride_name}
        </p>
        <p className="text-[11px] tracking-[0.2em] text-[#6B82A3]">
          {wedding.date_badge}
        </p>
      </footer>

      {/* Fixed Bottom Navigation Bar (giống clip) */}
      <nav className="sticky bottom-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-md border-t border-[#DCE4F0] px-3 py-2 flex items-center justify-around text-[10px] font-semibold uppercase tracking-wider text-[#4E688E]">
        <button
          type="button"
          onClick={() => scrollTo("cover-section")}
          className="hover:text-[#1B365D] cursor-pointer py-1"
        >
          Trang chủ
        </button>
        <button
          type="button"
          onClick={() => scrollTo("location-section")}
          className="hover:text-[#1B365D] cursor-pointer py-1 inline-flex items-center gap-1"
        >
          <MapPin size={11} /> Địa điểm
        </button>
        <button
          type="button"
          onClick={() => scrollTo("gift-section")}
          className="hover:text-[#1B365D] cursor-pointer py-1 inline-flex items-center gap-1"
        >
          <Gift size={11} /> Mừng cưới
        </button>
        <button
          type="button"
          onClick={() => scrollTo("rsvp-section")}
          className="hover:text-[#1B365D] cursor-pointer py-1 inline-flex items-center gap-1"
        >
          <Heart size={11} /> RSVP
        </button>
        <button
          type="button"
          onClick={() => scrollTo("schedule-section")}
          className="hover:text-[#1B365D] cursor-pointer py-1 inline-flex items-center gap-1"
        >
          <Clock size={11} /> Lịch
        </button>
      </nav>
    </div>
  );
}
