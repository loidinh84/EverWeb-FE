import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Menu,
  MessageSquare,
  Search,
  Sparkles,
  Store,
  Users,
  Wallet,
  X,
} from "lucide-react";
import everwebLogo from "../assets/image/everweb-logo.jpg";
import heroWedding from "../assets/image/hero-wedding.jpg";
import {
  AiConciergePreview,
  BudgetRingPreview,
  GuestSeatingPreview,
  VendorLookbookPreview,
} from "../components/FolioPreviews";
import {
  EditorialMarquee,
  Reveal,
  ScrollProgressBar,
  StackingFolioCard,
} from "../components/MotionPrimitives";
import {
  CHAPTER_NAV,
  COVER_PRESETS,
  JOURNEY_MILESTONES,
  LOOKBOOK_SLIDES,
  MARQUEE_ITEMS,
  PRICING_TIERS,
} from "../data/landingData";

const EASE = [0.22, 1, 0.36, 1];

const FOLIOS = [
  {
    num: "01",
    icon: Users,
    title: "Quản lý khách mời",
    desc: "Sắp xếp danh sách nhà trai, nhà gái và bạn bè theo từng cụm bàn. Cập nhật trạng thái RSVP trực tiếp để chốt số bàn không sai lệch.",
    dark: false,
    surface: "bg-white text-[#23111B] border-rose-200/80",
    preview: <GuestSeatingPreview />,
  },
  {
    num: "02",
    icon: Wallet,
    title: "Kiểm soát ngân sách",
    desc: "Dự toán thông minh theo tổng ngân sách thực tế, tách bạch từng hạng mục chi tiêu, khoản đã đặt cọc và quỹ dự phòng.",
    dark: false,
    surface: "bg-[#FCEBF2] text-[#23111B] border-rose-200/90",
    preview: <BudgetRingPreview />,
  },
  {
    num: "03",
    icon: Store,
    title: "Kết nối nhà cung cấp",
    desc: "Tuyển chọn sảnh tiệc, đơn vị hoa cưới, studio và trang trí theo phong cách đồng nhất, lưu giữ đối tác yêu thích để so sánh báo giá.",
    dark: true,
    surface: "bg-[#181216] text-[#FCE7F3] border-pink-400/25",
    preview: <VendorLookbookPreview />,
  },
  {
    num: "04",
    icon: MessageSquare,
    title: "Trợ lý Chatbot AI",
    desc: "Cố vấn cưới hoạt động 24/7 dựa trên đúng dữ liệu khách mời và ngân sách của bạn, sẵn sàng gợi ý timeline và concept phù hợp.",
    dark: true,
    surface: "bg-[#0F0B0E] text-[#FCE7F3] border-pink-400/35",
    preview: <AiConciergePreview />,
  },
];

export default function LandingPage({ onOpenDashboard }) {
  const [presetId, setPresetId] = useState(COVER_PRESETS[0].id);
  const [activeChapter, setActiveChapter] = useState(CHAPTER_NAV[0].id);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const heroRef = useRef(null);
  const lookbookRef = useRef(null);
  const journeyRef = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const archY = useTransform(heroScroll, [0, 1], ["0%", "14%"]);
  const archScale = useTransform(heroScroll, [0, 1], [1, 1.08]);

  const { scrollYProgress: lookbookScroll } = useScroll({
    target: lookbookRef,
    offset: ["start start", "end end"],
  });
  const lookbookX = useTransform(lookbookScroll, [0, 1], ["0%", "-52%"]);

  const { scrollYProgress: journeyScroll } = useScroll({
    target: journeyRef,
    offset: ["start 0.75", "end 0.75"],
  });

  useEffect(() => {
    const sections = CHAPTER_NAV.map((c) => document.getElementById(c.id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        }
      },
      { rootMargin: "-38% 0px -45% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const currentPreset = COVER_PRESETS.find((p) => p.id === presetId) ?? COVER_PRESETS[0];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-[#FAF8F5] text-[#231F1C]">
        <ScrollProgressBar />

        {/* Top Royal Blue Utility Bar (chuẩn WithJoy) */}
        <div className="bg-[#3446EB] text-white text-xs font-medium relative z-40">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-8">
            {/* Left service pills */}
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
                Khách mời & RSVP
              </a>
              <a
                href="#pillars"
                className="hidden sm:inline-block rounded-full px-2.5 py-1 text-white/80 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
              >
                Trợ lý AI
              </a>
            </div>

            {/* Center Promo */}
            <div className="hidden lg:flex items-center gap-2 text-white/95">
              <span>Ưu đãi mùa cưới: Giảm 25% các mẫu thiệp số & website cưới cao cấp</span>
              <a
                href="#pricing"
                className="underline underline-offset-4 font-semibold text-white hover:text-white/90"
              >
                Khám phá ngay →
              </a>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4 text-white/90 shrink-0">
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="hidden sm:flex items-center gap-1.5 hover:text-white transition cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Vào Dashboard</span>
                </button>
              )}
              <div className="flex items-center gap-1 text-white">
                <Globe className="h-3.5 w-3.5" />
                <span>Tiếng Việt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section with Full-Bleed Photo & Overlaid Navigation (chuẩn WithJoy) */}
        <section id="cover" ref={heroRef} className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
          {/* Background Image with Dark Vignette Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroWedding}
              alt="EverWeb Wedding Background"
              className="h-full w-full object-cover object-center scale-105 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
          </div>

          {/* Overlaid Main Header */}
          <header className="relative z-30 w-full border-b border-white/10 transition-all">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
              {/* Logo (WithJoy-style elegant cursive/serif wordmark) */}
              <a href="#cover" className="flex items-center gap-2 group">
                <span className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-white">
                  Ever<span className="italic font-light text-[#E8D5CE]">Web</span>
                </span>
              </a>

              {/* Center Menu Links with dropdown chevrons */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
                <a
                  href="#pillars"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>Kế hoạch & Thiệp cưới</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </a>
                <a
                  href="#lookbook"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>Bộ sưu tập Mẫu</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </a>
                <a
                  href="#journey"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>Cố vấn cưới AI</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </a>
                <a
                  href="#pricing"
                  className="hover:text-white transition"
                >
                  Bảng giá
                </a>
              </nav>

              {/* Right User Actions */}
              <div className="flex items-center gap-4">
                {onOpenDashboard ? (
                  <button
                    type="button"
                    onClick={onOpenDashboard}
                    className="hidden sm:inline-block text-sm font-medium text-white hover:text-white/80 transition cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                ) : (
                  <a
                    href="#pricing"
                    className="hidden sm:inline-block text-sm font-medium text-white hover:text-white/80 transition"
                  >
                    Đăng nhập
                  </a>
                )}
                <a
                  href="#pricing"
                  className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1C1917] shadow-md transition hover:bg-neutral-100"
                >
                  Bắt đầu ngay
                </a>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden cursor-pointer"
                  aria-label="Mở menu"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-white/10 bg-black/85 backdrop-blur-md px-6 py-4 md:hidden"
                >
                  <div className="flex flex-col gap-3 text-sm font-medium text-white/90">
                    <a
                      href="#pillars"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 hover:text-white"
                    >
                      Kế hoạch & Thiệp cưới
                    </a>
                    <a
                      href="#lookbook"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 hover:text-white"
                    >
                      Bộ sưu tập Mẫu
                    </a>
                    <a
                      href="#journey"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 hover:text-white"
                    >
                      Cố vấn cưới AI
                    </a>
                    <a
                      href="#pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 hover:text-white"
                    >
                      Bảng giá
                    </a>
                    {onOpenDashboard && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenDashboard();
                        }}
                        className="mt-2 text-left font-semibold text-[#C5A059]"
                      >
                        ← Mở Bảng điều khiển (Dashboard)
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Hero Center Text Content (chuẩn WithJoy: Plan your forever, better) */}
          <div className="relative z-20 mx-auto my-auto max-w-4xl px-4 py-16 text-center sm:px-8 sm:py-24">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.08] tracking-tight text-white"
            >
              Lập kế hoạch cho ngày hạnh phúc, trọn vẹn hơn.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
              className="mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-white/90 font-light"
            >
              Thiết kế website cưới mang dấu ấn riêng, tạo sổ mừng cưới đa năng và tận hưởng trọn vẹn từng khoảnh khắc chuẩn bị theo cách nhẹ nhàng nhất.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
            >
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full bg-[#5239D8] hover:bg-[#432BC2] px-7 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <span>Bắt đầu ngay</span>
                <ChevronRight className="h-4 w-4" />
              </a>

              {onOpenDashboard ? (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Tìm kiếm sự kiện / Vào Dashboard</span>
                </button>
              ) : (
                <a
                  href="#pillars"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition"
                >
                  <Search className="h-4 w-4" />
                  <span>Khám phá công cụ</span>
                </a>
              )}
            </motion.div>
          </div>

          {/* Bottom Organic Wave Transition (cắt mượt mà xuống nền #FAF8F5) */}
          <div className="relative z-20 w-full overflow-hidden leading-none pointer-events-none -mb-1">
            <svg
              viewBox="0 0 1440 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-12 sm:h-16 md:h-24 text-[#FAF8F5] preserve-3d"
            >
              <path
                d="M0,45 C280,90 520,10 760,50 C1000,90 1240,20 1440,60 L1440,90 L0,90 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </section>

        <main className="relative z-20 bg-[#FAF8F5]">
          <EditorialMarquee items={MARQUEE_ITEMS} />

          {/* Chương 1: 4 Stacking Folio Cards (Nền Trắng Hồng, 2 thẻ đầu Trắng Hồng + 2 thẻ sau Đen Hồng) */}
          <section id="pillars" className="bg-[#FFF5F8] py-20 text-[#23111B] lg:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-8">
              <Reveal className="mb-12 flex flex-col justify-between gap-4 border-b border-rose-200 pb-8 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono-num text-xs font-medium text-[#BE185D]">
                    Chương 01 · Bộ công cụ
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-medium tracking-[-0.02em] sm:text-5xl">
                    Bốn trụ cột cho ngày cưới trọn vẹn
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-[#6E4758]">
                  Cuộn xuống để khám phá từng bảng điều khiển tương tác: khách mời, ngân sách, nhà
                  cung cấp và trợ lý Chatbot AI.
                </p>
              </Reveal>

              <div>
                {FOLIOS.map(({ num, icon: Icon, title, desc, dark, surface, preview }, idx) => (
                  <StackingFolioCard key={num} index={idx} total={FOLIOS.length}>
                    <article
                      className={`rounded-3xl border p-6 shadow-[0_20px_50px_rgba(35,17,27,0.12)] sm:p-8 lg:p-10 ${surface}`}
                    >
                      <div className="grid items-center gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-mono-num text-xs font-medium ${
                                dark ? "text-[#F472B6]" : "text-[#BE185D]"
                              }`}
                            >
                              Folio {num}
                            </span>
                            <span
                              className={`h-px flex-1 ${
                                dark ? "bg-pink-400/20" : "bg-rose-200"
                              }`}
                            />
                            <Icon
                              className={`h-4 w-4 ${dark ? "text-[#F472B6]" : "text-[#BE185D]"}`}
                              strokeWidth={1.5}
                            />
                          </div>

                          <h3 className="mt-5 font-display text-3xl font-medium sm:text-4xl">
                            {title}
                          </h3>
                          <p
                            className={`mt-4 text-sm leading-relaxed sm:text-base ${
                              dark ? "text-[#C4A7B7]" : "text-[#6E4758]"
                            }`}
                          >
                            {desc}
                          </p>
                        </div>

                        <div className="lg:col-span-7">{preview}</div>
                      </div>
                    </article>
                  </StackingFolioCard>
                ))}
              </div>
            </div>
          </section>

          {/* Chương 2: Horizontal Scroll-Linked Lookbook (Nền Đen Hồng) */}
          <section id="lookbook" className="bg-[#0D0A0C] text-[#FCE7F3]">
            {/* Desktop Scroll-Linked Filmstrip */}
            <div ref={lookbookRef} className="hidden h-[240vh] lg:block">
              <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
                <div className="mx-auto mb-8 flex w-full max-w-6xl items-end justify-between px-8">
                  <div>
                    <p className="font-mono-num text-xs font-medium text-[#F472B6]">
                      Chương 02 · Lookbook Không Gian
                    </p>
                    <h2 className="mt-2 font-display text-5xl font-medium tracking-[-0.02em] text-white">
                      Cảm hứng tiệc cưới tuyển chọn
                    </h2>
                  </div>
                  <p className="max-w-xs text-right text-xs text-[#C4A7B7]">
                    Cuộn dọc để trượt ngang bộ sưu tập, nhấn vào từng khung hình để phóng lớn
                  </p>
                </div>

                <motion.div
                  style={{ x: lookbookX }}
                  className="flex gap-6 pl-[max(2rem,calc((100vw-72rem)/2+2rem))] pr-16 will-change-transform"
                >
                  {LOOKBOOK_SLIDES.map((slide) => (
                    <button
                      key={slide.index}
                      type="button"
                      onClick={() => setLightboxItem(slide)}
                      className="group relative h-[56vh] w-[42vw] max-w-[540px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-pink-400/25 bg-[#151014] text-left"
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-[#0D0A0C]/90 via-[#0D0A0C]/20 to-transparent p-7">
                        <div className="flex items-center justify-between">
                          <span className="font-mono-num rounded-full border border-pink-400/30 bg-[#0D0A0C]/70 px-3 py-1 text-xs font-medium text-[#F9A8D4] backdrop-blur-sm">
                            {slide.index} · {slide.meta}
                          </span>
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EC4899] text-[#0D0A0C] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                          </span>
                        </div>
                        <div>
                          <p className="font-display text-3xl font-medium text-white">
                            {slide.title}
                          </p>
                          <p className="mt-1.5 text-sm text-[#FCE7F3]">{slide.caption}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Mobile / Tablet Snap Carousel */}
            <div className="py-16 lg:hidden">
              <div className="px-4 sm:px-8">
                <p className="font-mono-num text-xs font-medium text-[#F472B6]">
                  Chương 02 · Lookbook Không Gian
                </p>
                <h2 className="mt-2 font-display text-3xl font-medium text-white">
                  Cảm hứng tiệc cưới tuyển chọn
                </h2>
              </div>
              <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-8">
                {LOOKBOOK_SLIDES.map((slide) => (
                  <button
                    key={slide.index}
                    type="button"
                    onClick={() => setLightboxItem(slide)}
                    className="relative h-80 w-[82vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-pink-400/25 text-left sm:w-[60vw]"
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0D0A0C]/90 via-[#0D0A0C]/25 to-transparent p-5">
                      <span className="font-mono-num text-[11px] text-[#F472B6]">
                        {slide.index} · {slide.meta}
                      </span>
                      <p className="mt-1 font-display text-2xl font-medium text-white">
                        {slide.title}
                      </p>
                      <p className="mt-1 text-xs text-[#FCE7F3]">{slide.caption}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Chương 3A: Pink Thread Journey (Nền Đen Nhung) */}
          <section id="journey" ref={journeyRef} className="bg-[#141013] py-20 text-[#FCE7F3] lg:py-28">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-8 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <p className="font-mono-num text-xs font-medium text-[#F472B6]">
                  Chương 03 · Hành trình
                </p>
                <h2 className="mt-2 font-display text-4xl font-medium tracking-[-0.02em] text-white sm:text-5xl">
                  Ba chặng chuẩn bị khoa học
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#C4A7B7]">
                  Quy trình tinh giản giúp hai bạn kiểm soát mọi đầu việc mà không bị quá tải thông
                  tin.
                </p>
              </Reveal>

              <div className="relative pl-8 lg:col-span-7">
                <div
                  aria-hidden="true"
                  className="absolute bottom-2 left-2 top-2 w-px bg-pink-400/20"
                />
                <motion.div
                  aria-hidden="true"
                  style={{ scaleY: journeyScroll }}
                  className="absolute bottom-2 left-2 top-2 w-px origin-top bg-[#EC4899]"
                />

                <div className="space-y-12">
                  {JOURNEY_MILESTONES.map((item, idx) => (
                    <Reveal key={item.step} delay={idx * 0.08} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-[#EC4899] bg-[#141013]"
                      />
                      <span className="font-mono-num text-xs font-medium text-[#F472B6]">
                        Chặng {item.step}
                      </span>
                      <h3 className="mt-2 font-display text-2xl font-medium text-white sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#C4A7B7]">
                        {item.desc}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Chương 3B: Asymmetric Atelier Pricing (Nền Trắng Hồng + Gói Chính Đen Hồng + 2 Gói Phụ Trắng Hồng) */}
          <section id="pricing" className="bg-[#FFF5F8] py-20 text-[#23111B] lg:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-8">
              <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono-num text-xs font-medium text-[#BE185D]">
                    Chương 04 · Gói trải nghiệm
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-medium tracking-[-0.02em] sm:text-5xl">
                    Lựa chọn đồng hành cùng bạn
                  </h2>
                </div>
                <p className="max-w-xs text-sm text-[#6E4758]">
                  Bắt đầu miễn phí hoặc nâng cấp trọn gói một lần duy nhất cho cả tiệc cưới.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-6 lg:grid-cols-12">
                {/* Featured Large Card (Đen - Hồng nổi bật trên nền Trắng Hồng) */}
                <Reveal className="lg:col-span-7">
                  <div className="flex h-full flex-col justify-between rounded-3xl border border-pink-400/35 bg-[#120D10] p-8 text-[#FCE7F3] shadow-[0_24px_54px_rgba(35,17,27,0.2)] sm:p-10">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-display text-3xl font-medium text-white">
                          {PRICING_TIERS.featured.name}
                        </span>
                        <span className="rounded-full bg-[#EC4899] px-3 py-1 text-[11px] font-semibold text-[#0D0A0C]">
                          {PRICING_TIERS.featured.badge}
                        </span>
                      </div>

                      <div className="mt-5 flex items-baseline gap-3">
                        <span className="font-mono-num text-4xl font-medium text-[#F472B6] sm:text-5xl">
                          {PRICING_TIERS.featured.price}
                        </span>
                        <span className="text-xs text-[#C4A7B7]">
                          / {PRICING_TIERS.featured.period}
                        </span>
                      </div>

                      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#C4A7B7]">
                        {PRICING_TIERS.featured.desc}
                      </p>

                      <ul className="mt-8 grid gap-3.5 border-t border-pink-400/20 pt-7 text-sm sm:grid-cols-2">
                        {PRICING_TIERS.featured.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-[#FCE7F3]">
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-[#F472B6]"
                              strokeWidth={1.5}
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="#cover"
                      className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#EC4899] px-6 text-sm font-semibold text-[#0D0A0C] transition-colors duration-150 hover:bg-[#F472B6]"
                    >
                      <span>Bắt đầu với gói {PRICING_TIERS.featured.name}</span>
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </a>
                  </div>
                </Reveal>

                {/* Two Stacked Companion Cards (Trắng - Hồng) */}
                <div className="flex flex-col gap-6 lg:col-span-5">
                  {PRICING_TIERS.companions.map((tier, idx) => (
                    <Reveal key={tier.name} delay={(idx + 1) * 0.08} className="flex-1">
                      <div className="flex h-full flex-col justify-between rounded-3xl border border-rose-200 bg-white p-7 shadow-[0_10px_28px_rgba(190,24,93,0.06)]">
                        <div>
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-display text-2xl font-medium text-[#23111B]">
                              {tier.name}
                            </h3>
                            <span className="font-mono-num text-2xl font-medium text-[#BE185D]">
                              {tier.price}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-[#6E4758]">{tier.desc}</p>
                          <ul className="mt-5 space-y-2.5 border-t border-rose-100 pt-4 text-xs sm:text-sm">
                            {tier.features.map((feat) => (
                              <li key={feat} className="flex items-start gap-2 text-[#23111B]">
                                <Check
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#BE185D]"
                                  strokeWidth={1.5}
                                />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <a
                          href="#cover"
                          className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-[#23111B]/20 text-xs font-semibold text-[#23111B] transition-colors duration-150 hover:bg-[#23111B] hover:text-[#FCE7F3]"
                        >
                          Chọn gói {tier.name}
                        </a>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Chương 4: Typographic Footer Curtain (Đen - Hồng) */}
        <footer className="border-t border-pink-400/15 bg-[#0D0A0C] px-4 pb-24 pt-16 text-[#FCE7F3] sm:px-8 lg:pt-20">
          <div className="mx-auto max-w-6xl">
            <p className="font-display select-none text-center text-[clamp(3.5rem,15vw,13rem)] font-medium leading-[0.86] tracking-[-0.03em] text-[#FCE7F3]/90">
              EVERWEB
            </p>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-pink-400/15 pt-6 text-xs text-[#C4A7B7] sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-white p-1">
                  <img src={everwebLogo} alt="EverWeb" className="h-6 w-6 object-contain" />
                </div>
                <span>
                  Website lập kế hoạch tiệc cưới · Khách mời · Ngân sách · Nhà cung cấp · Chatbot AI
                </span>
              </div>
              <p>© {new Date().getFullYear()} EverWeb</p>
            </div>
          </div>
        </footer>

        {/* Floating Bottom Chapter Dock */}
        <nav
          aria-label="Điều hướng theo chương"
          className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-[#EAE3DB] bg-white/95 p-1.5 shadow-[0_12px_32px_rgba(35,31,28,0.1)] backdrop-blur-md"
        >
          <ul className="flex items-center gap-1">
            {CHAPTER_NAV.map((item) => {
              const isActive = activeChapter === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`relative block rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 ${
                      isActive ? "text-[#FAF8F5]" : "text-[#70665D] hover:text-[#231F1C]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dockActive"
                        transition={{ duration: 0.25, ease: EASE }}
                        className="absolute inset-0 rounded-full bg-[#231F1C]"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Lookbook Lightbox Modal */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.25, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-3xl overflow-hidden rounded-2xl border border-pink-400/25 bg-[#151014] text-[#FCE7F3] shadow-2xl"
              >
                <button
                  type="button"
                  aria-label="Đóng ảnh"
                  onClick={() => setLightboxItem(null)}
                  className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-black/65 p-2 text-white transition-colors hover:bg-[#EC4899] hover:text-[#0D0A0C]"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="max-h-[70vh] w-full object-cover"
                />
                <div className="p-5">
                  <p className="font-mono-num text-xs font-medium text-[#F472B6]">
                    {lightboxItem.index} · {lightboxItem.meta}
                  </p>
                  <p className="mt-1 font-display text-2xl font-medium text-white">
                    {lightboxItem.title}
                  </p>
                  <p className="mt-1 text-sm text-[#C4A7B7]">{lightboxItem.caption}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
