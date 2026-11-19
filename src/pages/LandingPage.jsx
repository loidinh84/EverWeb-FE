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
  MessageSquare,
  Sparkles,
  Store,
  Users,
  Wallet,
  X,
} from "lucide-react";
import everwebLogo from "../assets/everweb-logo.jpg";
import heroWedding from "../assets/hero-wedding.jpg";
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

export default function LandingPage() {
  const [presetId, setPresetId] = useState(COVER_PRESETS[0].id);
  const [activeChapter, setActiveChapter] = useState(CHAPTER_NAV[0].id);
  const [lightboxItem, setLightboxItem] = useState(null);

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
      <div className="min-h-screen overflow-x-clip bg-[#0D0A0C] text-[#FCE7F3]">
        <ScrollProgressBar />

        {/* Editorial Top Masthead */}
        <header className="sticky top-0 z-40 border-b border-pink-400/15 bg-[#0D0A0C]/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
            <a href="#cover" className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-1">
                <img src={everwebLogo} alt="EverWeb" className="h-8 w-8 object-contain" />
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-2xl font-medium tracking-tight text-white">
                  EverWeb
                </span>
                <span className="hidden text-xs text-[#C4A7B7] sm:inline">Atelier 2026</span>
              </div>
            </a>

            <div className="flex items-center gap-5">
              <a
                href="#pillars"
                className="hidden text-xs font-medium text-[#FCE7F3] transition-colors hover:text-[#F472B6] sm:inline"
              >
                Khám phá 4 công cụ
              </a>
              <a
                href="#pricing"
                className="rounded-full bg-[#EC4899] px-4 py-2 text-xs font-semibold text-[#0D0A0C] transition-colors duration-150 hover:bg-[#F472B6]"
              >
                Lập kế hoạch
              </a>
            </div>
          </div>
        </header>

        <main>
          {/* Chương 0: Magazine Cover Hero (Đen - Hồng) */}
          <section id="cover" ref={heroRef} className="relative bg-[#0D0A0C] pt-10 lg:pt-14">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-20">
              {/* Left Editorial Typography */}
              <div className="lg:col-span-5">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="font-mono-num text-xs font-medium text-[#F472B6]"
                >
                  Nền tảng lập kế hoạch tiệc cưới
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
                  className="mt-4 font-display text-5xl font-normal leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl lg:text-[68px]"
                >
                  Nghệ thuật tổ chức ngày trọng đại
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
                  className="mt-6 max-w-md text-sm leading-relaxed text-[#C4A7B7] sm:text-base"
                >
                  EverWeb kết nối danh sách khách mời, ngân sách chi tiết, nhà cung cấp chọn lọc
                  và trợ lý Chatbot AI trên một không gian tinh giản.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
                  className="mt-8 flex flex-wrap items-center gap-4"
                >
                  <a
                    href="#pillars"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#EC4899] px-6 text-sm font-semibold text-[#0D0A0C] transition-colors duration-150 hover:bg-[#F472B6]"
                  >
                    <span>Trải nghiệm công cụ</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                  <a
                    href="#lookbook"
                    className="inline-flex h-11 items-center rounded-full border border-pink-400/30 px-6 text-sm font-medium text-[#FCE7F3] transition-colors duration-150 hover:border-pink-400/60 hover:bg-pink-400/10"
                  >
                    Xem Lookbook
                  </a>
                </motion.div>
              </div>

              {/* Center Architectural Arch Frame */}
              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
                  className="relative mx-auto max-w-sm overflow-hidden rounded-t-[180px] rounded-b-2xl border border-pink-400/35 bg-[#191217] p-2 shadow-[0_24px_48px_rgba(236,72,153,0.12)]"
                >
                  <div className="overflow-hidden rounded-t-[172px] rounded-b-xl">
                    <motion.img
                      src={heroWedding}
                      alt="Không gian lễ cưới sang trọng EverWeb"
                      style={{ y: archY, scale: archScale }}
                      className="h-[380px] w-full object-cover will-change-transform sm:h-[440px]"
                    />
                  </div>
                  <div className="flex items-center justify-between px-3 py-3 text-xs text-[#C4A7B7]">
                    <span className="font-display text-base italic text-white">
                      EverWeb Atelier
                    </span>
                    <span className="font-mono-num text-[11px] font-medium text-[#F472B6]">
                      04 Trụ cột
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Right Interactive Scale Configurator (Thẻ Trắng Hồng nổi bật trên nền Đen) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
                className="lg:col-span-3"
              >
                <div className="rounded-2xl border border-rose-200 bg-[#FFF5F8] p-5 text-[#23111B] shadow-[0_20px_44px_rgba(0,0,0,0.45)]">
                  <p className="text-xs font-semibold text-[#BE185D]">Ước tính nhanh theo quy mô</p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {COVER_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setPresetId(preset.id)}
                        className={`cursor-pointer rounded-lg px-3 py-2 text-left text-xs transition-colors duration-150 ${
                          presetId === preset.id
                            ? "bg-[#23111B] font-semibold text-[#FCE7F3]"
                            : "bg-white text-[#6E4758] hover:bg-rose-100/70"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPreset.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="mt-5 space-y-3 border-t border-rose-200 pt-4 text-xs"
                    >
                      <div className="flex justify-between">
                        <span className="text-[#6E4758]">Số bàn dự kiến</span>
                        <span className="font-mono-num font-semibold text-[#23111B]">
                          {currentPreset.tables} bàn
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E4758]">Ngân sách gợi ý</span>
                        <span className="font-mono-num font-semibold text-[#BE185D]">
                          {currentPreset.budget}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E4758]">Đối tác đề xuất</span>
                        <span className="font-mono-num font-semibold text-[#23111B]">
                          {currentPreset.vendors}
                        </span>
                      </div>
                      <div className="rounded-xl border border-rose-200/80 bg-white p-3 text-[11px] leading-relaxed text-[#6E4758]">
                        <p className="mb-1 flex items-center gap-1.5 font-semibold text-[#BE185D]">
                          <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                          Gợi ý AI
                        </p>
                        <p>{currentPreset.aiTip}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            <EditorialMarquee items={MARQUEE_ITEMS} />
          </section>

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
          className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-pink-400/25 bg-[#151014]/90 p-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <ul className="flex items-center gap-1">
            {CHAPTER_NAV.map((item) => {
              const isActive = activeChapter === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`relative block rounded-full px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-xs ${
                      isActive ? "text-[#0D0A0C]" : "text-[#FCE7F3] hover:text-[#F472B6]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dockActive"
                        transition={{ duration: 0.25, ease: EASE }}
                        className="absolute inset-0 rounded-full bg-[#EC4899]"
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
