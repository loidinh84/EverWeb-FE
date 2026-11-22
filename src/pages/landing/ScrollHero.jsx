import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Calendar,
  Check,
  ChevronRight,
  Gift,
  Heart,
  MapPin,
  Music,
  Plane,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import weddingCouple from "../../assets/image/wedding-couple.jpg";

export default function ScrollHero({ onOpenDashboard }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isHeroScrolled, setIsHeroScrolled] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      setIsHeroScrolled(y > 170);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (videoRef.current) {
      if (latest > 380 && !videoRef.current.paused) {
        videoRef.current.pause();
      } else if (latest <= 380 && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  });

  const videoOpacity = useTransform(scrollY, [90, 380], [1, 0]);
  const photoOpacity = useTransform(scrollY, [110, 400], [0, 1]);
  ``;
  const vignetteOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  const titleOpacity = useTransform(scrollY, [0, 170], [1, 0]);
  const titleY = useTransform(scrollY, [0, 170], [0, -36]);

  const heroScale = useTransform(scrollY, [180, 720], [1, 0.44]);
  const heroRadius = useTransform(scrollY, [180, 720], [0, 24]);
  const heroY = useTransform(scrollY, [180, 720], [0, -32]);

  const constellationOpacity = useTransform(scrollY, [400, 800], [0, 1]);
  const leftX = useTransform(scrollY, [400, 800], ["-28vw", "0vw"]);
  const rightX = useTransform(scrollY, [400, 800], ["28vw", "0vw"]);
  const bottomY = useTransform(scrollY, [400, 800], ["6vh", "0vh"]);
  const topY = useTransform(scrollY, [400, 800], ["-6vh", "0vh"]);

  const step2TextOpacity = useTransform(scrollY, [450, 800], [0, 1]);
  const step2TextY = useTransform(scrollY, [450, 800], [22, 0]);

  return (
    <div ref={containerRef} id="cover" className="relative w-full h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#FAF8F5] select-none">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{
              scale: heroScale,
              borderRadius: heroRadius,
              y: heroY,
            }}
            className="absolute inset-0 z-10 overflow-hidden origin-center will-change-transform shadow-[0_24px_60px_rgba(35,31,28,0.18)]"
          >
            <motion.div
              style={{ opacity: videoOpacity }}
              className="absolute inset-0 z-10"
            >
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster="https://withjoy.com/assets/public/marcom-prod/home/hero/joy-header-static.jpg?m_resize=w600&opt=aggressive&ver=2"
                className="h-full w-full object-cover object-center"
              >
                <source
                  src="https://player.vimeo.com/progressive_redirect/playback/463962658/rendition/720p/file.mp4?loc=external&signature=66736d8c449f8f2bc7c1c3e639846830713e810437c6b3794744f993c4fae43c"
                  type="video/mp4"
                />
              </video>
              <img
                src={galleryCeremony}
                alt="EverWeb Wedding Ceremony"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
              />
            </motion.div>

            <motion.div
              style={{ opacity: photoOpacity }}
              className="absolute inset-0 z-12"
            >
              <img
                src={weddingCouple}
                onError={(e) => {
                  e.currentTarget.src = heroWedding;
                }}
                alt="Cô dâu và chú rể trong ngày cưới hạnh phúc"
                className="h-full w-full object-cover object-[center_35%]"
              />
            </motion.div>

            <motion.div
              style={{ opacity: vignetteOpacity }}
              className="absolute inset-0 z-15 bg-gradient-to-b from-black/85 via-black/35 to-black/75 pointer-events-none will-change-opacity"
            />
          </motion.div>

          <motion.div
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center select-text will-change-transform ${
              isHeroScrolled ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.08] tracking-tight text-white max-w-4xl drop-shadow-md">
              Lập kế hoạch cho ngày hạnh phúc, trọn vẹn hơn.
            </h1>

            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-white/95 font-light drop-shadow-md">
              Thiết kế website cưới mang dấu ấn riêng, tạo sổ mừng cưới đa năng
              và tận hưởng trọn vẹn từng khoảnh khắc chuẩn bị theo cách nhẹ
              nhàng nhất.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {onOpenDashboard ? (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5239D8] hover:bg-[#432BC2] px-7 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Bắt đầu ngay</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5239D8] hover:bg-[#432BC2] px-7 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  <span>Bắt đầu ngay</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              )}

              <a
                href="#pricing"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition drop-shadow-md"
              >
                <Search className="h-4 w-4" />
                <span>Tìm kiếm đám cưới</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            style={{
              opacity: step2TextOpacity,
              y: step2TextY,
            }}
            className="absolute top-[71%] sm:top-[73%] left-1/2 -translate-x-1/2 z-25 pointer-events-none text-center px-4 w-full max-w-2xl flex flex-col items-center will-change-transform"
          >
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal tracking-tight text-[#231F1C] leading-snug">
              Tạo website cưới và kế hoạch hoàn mỹ mang đậm dấu ấn riêng.
            </h2>

            <div className="mt-3 flex items-center gap-2 sm:gap-3 rounded-full border border-[#EAE3DB] bg-white/95 px-4 py-2 shadow-[0_10px_28px_rgba(35,31,28,0.08)] backdrop-blur-md pointer-events-auto">
              <div className="flex items-center gap-1.5 text-xs text-[#70665D]">
                <Search className="h-3.5 w-3.5 text-[#8C827A]" />
                <span className="hidden sm:inline">Lọc khách:</span>
                <span className="font-semibold text-[#231F1C]">
                  Bạn đại học (4)
                </span>
              </div>
              <span className="h-3 w-px bg-[#EAE3DB]" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#3446EB]">
                  Bàn 12
                </span>
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EBF0FF] text-[10px] font-bold text-[#3446EB] ring-2 ring-white">
                    T
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FCEBF2] text-[10px] font-bold text-[#BE185D] ring-2 ring-white">
                    H
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF5EE] text-[10px] font-bold text-[#C5A059] ring-2 ring-white">
                    M
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0FDF4] text-[10px] font-bold text-[#16A34A] ring-2 ring-white">
                    <Users className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute inset-0 z-20 pointer-events-none w-full h-full">
            <motion.div
              style={{
                opacity: constellationOpacity,
                x: leftX,
                y: topY,
              }}
              className="absolute top-[16%] left-[3%] xl:left-[5%] w-56 xl:w-64 rounded-2xl border border-[#EAE3DB] bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(35,31,28,0.08)] backdrop-blur-md will-change-transform"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3446EB] text-white font-bold text-xs shadow-sm shrink-0">
                  +1
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#231F1C] truncate">
                    Gia đình anh Tuấn
                  </p>
                  <p className="text-[11px] text-[#16A34A] font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Sẽ tham dự</span>
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-[#F0EAE1] pt-2">
                <span className="text-[11px] text-[#70665D]">
                  Chị Lan (Đi cùng)
                </span>
                <span className="rounded-full bg-[#3446EB] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Xác nhận chung
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{
                opacity: constellationOpacity,
                x: leftX,
              }}
              className="absolute top-[39%] left-[3%] xl:left-[5%] w-48 xl:w-52 rounded-2xl border border-[#EAE3DB] bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(35,31,28,0.08)] backdrop-blur-md will-change-transform"
            >
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono-num text-lg font-bold text-[#231F1C]">
                    76
                  </span>
                  <span className="text-xs text-[#70665D]">Khách mời</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#F5F0E8] pt-1">
                  <span className="font-mono-num text-xs font-semibold text-[#231F1C]">
                    6
                  </span>
                  <span className="text-[10px] text-[#70665D]">Cụm bàn</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#F5F0E8] pt-1">
                  <span className="font-mono-num text-xs font-semibold text-[#16A34A]">
                    45
                  </span>
                  <span className="text-[10px] text-[#16A34A]">
                    Đã phản hồi
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#F5F0E8] pt-1">
                  <span className="font-mono-num text-xs font-semibold text-[#C5A059]">
                    31
                  </span>
                  <span className="text-[10px] text-[#C5A059]">Đang đợi</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                opacity: constellationOpacity,
                x: leftX,
                y: bottomY,
              }}
              className="absolute top-[62%] left-[3%] xl:left-[5%] w-52 xl:w-60 rounded-2xl border border-[#EAE3DB] bg-white/95 p-3 shadow-[0_12px_32px_rgba(35,31,28,0.08)] backdrop-blur-md will-change-transform"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#231F1C]">
                <MapPin className="h-3.5 w-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">Thảo Điền Garden Hall</span>
              </div>
              <div className="mt-2 h-14 w-full rounded-xl bg-[#E8EEF5] border border-[#D5E0ED] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3446EB_1px,transparent_1px)] [background-size:10px_10px]" />
                <span className="relative z-10 text-[10px] font-medium text-[#3446EB] bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">
                  Chỉ đường Google Maps
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{
                opacity: constellationOpacity,
                x: rightX,
                y: topY,
              }}
              className="absolute top-[16%] right-[3%] xl:right-[5%] w-56 xl:w-64 rounded-2xl border border-[#EAE3DB] bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(35,31,28,0.08)] backdrop-blur-md will-change-transform"
            >
              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex items-center justify-between text-[#16A34A] pb-1 border-b border-[#F0EAE1]">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3 w-3" />
                    <span>Đã mở thiệp mời</span>
                  </span>
                  <span className="text-[10px] bg-[#F0FDF4] px-1.5 py-0.5 rounded">
                    92%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#3446EB] pb-1 border-b border-[#F0EAE1]">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3 w-3" />
                    <span>Save the Date đã gửi</span>
                  </span>
                  <span className="text-[10px] bg-[#EBF0FF] px-1.5 py-0.5 rounded">
                    Zalo
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#70665D]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#C5A059]" />
                    <span>Xác nhận thực đơn tiệc</span>
                  </span>
                  <span className="text-[10px] text-[#C5A059]">68/76</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                opacity: constellationOpacity,
                x: rightX,
              }}
              className="absolute top-[39%] right-[3%] xl:right-[5%] w-52 xl:w-60 rounded-2xl border border-[#EAE3DB] bg-white/95 p-3 shadow-[0_12px_32px_rgba(35,31,28,0.08)] backdrop-blur-md will-change-transform"
            >
              <p className="text-[10px] font-semibold text-[#231F1C] mb-1.5">
                Sổ mừng cưới & Quỹ đôi bạn
              </p>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="rounded-lg bg-[#FAF8F5] p-1.5 flex flex-col items-center gap-0.5">
                  <Gift className="h-3 w-3 text-[#C5A059]" />
                  <span className="text-[8px] font-medium text-[#574B40]">
                    Quà mừng
                  </span>
                </div>
                <div className="rounded-lg bg-[#FAF8F5] p-1.5 flex flex-col items-center gap-0.5">
                  <Heart className="h-3 w-3 text-[#E28B88]" />
                  <span className="text-[8px] font-medium text-[#574B40]">
                    Quỹ mừng
                  </span>
                </div>
                <div className="rounded-lg bg-[#FAF8F5] p-1.5 flex flex-col items-center gap-0.5">
                  <Plane className="h-3 w-3 text-[#3446EB]" />
                  <span className="text-[8px] font-medium text-[#574B40]">
                    Trăng mật
                  </span>
                </div>
                <div className="rounded-lg bg-[#FAF8F5] p-1.5 flex flex-col items-center gap-0.5">
                  <Music className="h-3 w-3 text-[#8B5CF6]" />
                  <span className="text-[8px] font-medium text-[#574B40]">
                    Âm nhạc
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                opacity: constellationOpacity,
                x: rightX,
                y: bottomY,
              }}
              className="absolute top-[62%] right-[3%] xl:right-[5%] w-56 xl:w-64 rounded-2xl border border-[#EAE3DB] bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(35,31,28,0.08)] backdrop-blur-md will-change-transform"
            >
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-1.5 font-semibold text-[#231F1C]">
                  <Calendar className="h-3.5 w-3.5 text-[#C5A059]" />
                  <span>Tiệc thân mật gia đình</span>
                </div>
                <span className="rounded-full bg-[#FAF5EE] px-1.5 py-0.5 text-[9px] font-bold text-[#C5A059]">
                  28 THG 11
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#3446EB]">
                <Music className="h-3 w-3" />
                <span>Yêu cầu bài hát khiêu vũ</span>
              </div>
              <p className="mt-0.5 text-[10px] text-[#70665D]">
                Giai điệu nào sẽ kéo bạn lên sàn khiêu vũ?
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden leading-none pointer-events-none -mb-1">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-14 sm:h-20 md:h-28 lg:h-32 text-[#FAF8F5] block drop-shadow-[0_-4px_16px_rgba(35,31,28,0.02)]"
          >
            <path
              d="M0,55 C320,115 680,10 1060,70 C1240,100 1360,40 1440,25 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
