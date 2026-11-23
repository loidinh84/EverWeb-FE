import { useRef, useState, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronRight } from "lucide-react";

import ww1 from "../../assets/image/router/ww-1.png";
import ww2 from "../../assets/image/router/ww-2.png";
import registryBg from "../../assets/image/router/registry-background.png";
import registryProducts from "../../assets/image/router/registry-products.png";
import registryCouple from "../../assets/image/router/registry-couple.png";

import glBg from "../../assets/image/router/router-gl-bg.jpg";
import glUiBg from "../../assets/image/router/router-gl-ui-bg.png";
import glUi from "../../assets/image/router/router-gl-ui.png";
import glCouple from "../../assets/image/router/router-gl-couple.png";

import stdBg from "../../assets/image/router/router-std-bg-v2.png";
import stdCards from "../../assets/image/router/router-std-cards-v2.png";
import stdEnvelopeBack from "../../assets/image/router/router-std-envelope-back.png";
import stdMainCard from "../../assets/image/router/router-std-main-card.png";
import stdEnvelopeFront from "../../assets/image/router/router-std-envelope-front.png";
import stdShadow from "../../assets/image/router/router-std-shadow.png";

import invitesBg from "../../assets/image/router/invites-background-v4.png";
import invitesCards from "../../assets/image/router/invites-cards-v5.png";
import invitesShadow from "../../assets/image/router/invites-shadow.png";
import invitesCouple from "../../assets/image/router/invites-couple-v4.png";
import invitesCouple2 from "../../assets/image/router/invites-couple-2-v4.png";

import rsvpBg from "../../assets/image/router/router-inv-rsvp-bg.jpg";
import rsvpCard from "../../assets/image/router/router-inv-rsvp-card.jpg";
import rsvpBubbles from "../../assets/image/router/router-inv-rsvp-ui-bubbles.png";
import rsvpCouple from "../../assets/image/router/router-inv-rsvp-couple.png";

const FEATURES = [
  {
    id: "website",
    title: "Website Cưới",
    desc: "Website cưới tinh tế, miễn phí và mang đậm dấu ấn riêng với đầy đủ tính năng thông minh cho mọi nhu cầu lập kế hoạch.",
  },
  {
    id: "registry",
    title: "Sổ Mừng Cưới",
    desc: "Sổ mừng cưới đa năng tất cả trong một: từ quà tặng gia dụng, mừng cưới không phí, đến trải nghiệm trăng mật.",
  },
  {
    id: "guests",
    title: "Danh Sách Khách Mời",
    desc: "Quản lý khách mời hai họ trực quan, nắm bắt thông tin và gửi thông báo dễ dàng từ trung tâm điều hành.",
  },
  {
    id: "std",
    title: "Save the Date",
    desc: "Hàng trăm mẫu thiết kế thanh lịch báo hỷ ngày cưới theo phong cách riêng. Gửi trực tuyến hoặc in ấn đồng bộ.",
  },
  {
    id: "invites",
    title: "Thiệp Mời Số",
    desc: "Bộ sưu tập thiệp cưới số cao cấp, đồng bộ hoàn hảo cùng giao diện website của bạn.",
  },
  {
    id: "rsvp",
    title: "Xác Nhận Tham Dự",
    desc: "Kiểm soát phản hồi hai họ minh bạch, tự động hóa số lượng bàn tiệc theo thời gian thực.",
  },
];

export default function FeatureShowcase() {
  const containerRef = useRef(null);
  const scene1Ref = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);
  const scene4Ref = useRef(null);
  const scene5Ref = useRef(null);
  const scene6Ref = useRef(null);
  const [activeId, setActiveId] = useState("website");

  useEffect(() => {
    const sceneIds = ["website", "registry", "guests", "std", "invites", "rsvp"];
    const handleScroll = () => {
      const viewportTrigger = window.scrollY + window.innerHeight * 0.45;

      for (let i = sceneIds.length - 1; i >= 0; i--) {
        const id = sceneIds[i];
        const el = document.getElementById(`scene-${id}`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (viewportTrigger >= top) {
            setActiveId(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress: scene1Progress } = useScroll({
    target: scene1Ref,
    offset: ["start start", "end end"],
  });
  const col13Y = useTransform(scene1Progress, [0, 1], [-85, 85]);
  const col2Y = useTransform(scene1Progress, [0, 1], [95, -95]);

  const { scrollYProgress: scene2Progress } = useScroll({
    target: scene2Ref,
    offset: ["start end", "end end"],
  });
  const productsY = useTransform(scene2Progress, [0.35, 0.75, 1.0], [220, 0, 0]);
  const productsScale = useTransform(scene2Progress, [0.35, 0.75, 1.0], [0.75, 1.04, 1.04]);
  const coupleY = useTransform(scene2Progress, [0.35, 0.75, 1.0], [15, 0, 0]);

  const { scrollYProgress: scene3Progress } = useScroll({
    target: scene3Ref,
    offset: ["start start", "end end"],
  });
  const glBgScale = useTransform(scene3Progress, [0, 0.8, 1.0], [1.0, 1.06, 1.06]);
  const glBgY = useTransform(scene3Progress, [0, 0.8, 1.0], [0, -22, -22]);
  const glTableScale = useTransform(scene3Progress, [0.0, 0.75, 1.0], [0.94, 1.08, 1.08]);
  const glTableY = useTransform(scene3Progress, [0.0, 0.75, 1.0], [18, 0, 0]);
  const glCoupleY = useTransform(scene3Progress, [0.0, 0.75, 1.0], [10, 0, 0]);

  const { scrollYProgress: scene4Progress } = useScroll({
    target: scene4Ref,
    offset: ["start start", "end end"],
  });
  const stdBgScale = useTransform(scene4Progress, [0, 0.85, 1.0], [1.0, 1.04, 1.04]);

  const stdCardY = useTransform(scene4Progress, [0.0, 0.26, 0.36, 0.68, 1.0], [-45, -180, -180, 0, 0]);
  const stdCardScale = useTransform(scene4Progress, [0.0, 0.26, 0.36, 0.68, 1.0], [1.0, 1.04, 1.04, 0.51, 0.51]);

  const stdEnvelopeOpacity = useTransform(scene4Progress, [0.0, 0.28, 0.36, 0.55, 1.0], [1, 1, 0.50, 0, 0]);
  const stdEnvelopeScale = useTransform(scene4Progress, [0.28, 0.55, 1.0], [1, 0.88, 0.88]);
  const stdEnvelopeY = useTransform(scene4Progress, [0.28, 0.55, 1.0], [0, 140, 140]);

  const stdCardsOpacity = useTransform(scene4Progress, [0.0, 0.24, 0.36, 0.68, 1.0], [0, 0, 0.35, 1.0, 1.0]);
  const stdCardsScale = useTransform(scene4Progress, [0.0, 0.24, 0.36, 0.68, 1.0], [0.45, 0.45, 0.58, 1.0, 1.0]);

  const { scrollYProgress: scene5Progress } = useScroll({
    target: scene5Ref,
    offset: ["start start", "end end"],
  });
  const invBgScale = useTransform(scene5Progress, [0, 0.85, 1.0], [1.0, 1.03, 1.03]);
  const invCardsY = useTransform(scene5Progress, [0, 0.85, 1.0], [0, -14, -14]);
  const invCardsScale = useTransform(scene5Progress, [0, 0.85, 1.0], [1.0, 1.02, 1.02]);
  const invArchY = useTransform(scene5Progress, [0, 0.85, 1.0], [0, -25, -25]);
  const invArchScale = useTransform(scene5Progress, [0, 0.85, 1.0], [1.0, 1.05, 1.05]);
  const invShadowY = useTransform(scene5Progress, [0, 0.85, 1.0], [0, -8, -8]);

  const { scrollYProgress: scene6Progress } = useScroll({
    target: scene6Ref,
    offset: ["start start", "end end"],
  });
  const rsvpBgScale = useTransform(scene6Progress, [0, 0.85, 1.0], [1.0, 1.04, 1.04]);
  const rsvpBubblesY = useTransform(scene6Progress, [0, 0.7, 1.0], [-35, 0, 0]);
  const rsvpBubblesOpacity = useTransform(scene6Progress, [0, 0.55, 1.0], [0.18, 1.0, 1.0]);
  const rsvpBubblesScale = useTransform(scene6Progress, [0, 0.7, 1.0], [0.44, 1.15, 1.15]);
  const rsvpCardY = useTransform(scene6Progress, [0, 0.7, 1.0], [0, 0, 0]);
  const rsvpCardScale = useTransform(scene6Progress, [0, 0.7, 1.0], [0.98, 1.0, 1.0]);
  const rsvpCoupleY = useTransform(scene6Progress, [0, 0.7, 1.0], [0, 0, 0]);
  const rsvpCoupleScale = useTransform(scene6Progress, [0, 0.7, 1.0], [0.60, 1.12, 1.12]);

  const handleSelect = (id) => {
    setActiveId(id);
    const el = document.getElementById(`scene-${id}`);
    if (el) {
      const navbarOffset = 112;
      const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="pillars"
      ref={containerRef}
      className="relative w-full bg-[#FAF8F5] text-[#231F1C]"
    >
      <div className="relative w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-[45%] xl:w-[42%] shrink-0">
          <div className="sticky top-[112px] h-[calc(100vh-112px)] flex flex-col justify-center bg-[#FAF8F5] pl-6 sm:pl-10 md:pl-16 lg:pl-16 xl:pl-24 pr-6 sm:pr-8 lg:pr-10 z-20 select-none">
            <nav className="flex flex-col space-y-4 lg:space-y-5 xl:space-y-6">
              {FEATURES.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`group cursor-pointer transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-45 hover:opacity-80"
                    }`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`font-display tracking-tight transition-all duration-300 ${
                          isActive
                            ? "text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-medium text-[#231F1C] leading-tight"
                            : "text-2xl sm:text-3xl lg:text-[32px] xl:text-[38px] font-normal text-[#8A8178] leading-tight group-hover:text-[#423C36]"
                        }`}
                      >
                        {item.title}
                      </span>

                      {isActive && (
                        <motion.span
                          layoutId="activeChevron"
                          className="inline-flex items-center ml-3 text-[#231F1C]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        >
                          <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 stroke-[1.6]" />
                        </motion.span>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isActive && item.desc && (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-base sm:text-lg text-[#554E46] max-w-lg font-sans leading-relaxed">
                            {item.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="w-full lg:w-[55%] xl:w-[58%] flex flex-col select-none pointer-events-none">
          <div
            id="scene-website"
            ref={scene1Ref}
            className="relative w-full"
            style={{ height: "240vh" }}
          >
            <div className="sticky top-[112px] h-[calc(100vh-112px)] w-full bg-[#DDDBCF] overflow-hidden">
              <motion.div
                style={{ y: col13Y }}
                className="absolute inset-0 w-full h-[125%] -top-[12.5%] will-change-transform flex items-center justify-center"
              >
                <img
                  src={ww1}
                  alt="Website Cưới Mẫu 1 & 3"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </motion.div>

              <motion.div
                style={{ y: col2Y }}
                className="absolute inset-0 w-full h-[125%] -top-[12.5%] will-change-transform flex items-center justify-center"
              >
                <img
                  src={ww2}
                  alt="Website Cưới Mẫu 2 Giữa"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </motion.div>
            </div>
          </div>

          <div
            id="scene-registry"
            ref={scene2Ref}
            className="relative w-full"
            style={{ height: "240vh" }}
          >
            <div className="sticky top-[112px] h-[calc(100vh-112px)] w-full bg-[#EFECE6] overflow-hidden">
              <img
                src={registryBg}
                alt="Hình nền sổ mừng cưới confetti"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <motion.div
                style={{
                  y: productsY,
                  scale: productsScale,
                }}
                className="absolute inset-0 w-full h-full z-10 will-change-transform flex items-center justify-center"
              >
                <img
                  src={registryProducts}
                  alt="Vật phẩm mừng cưới"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </motion.div>

              <motion.div
                style={{ y: coupleY }}
                className="absolute inset-0 w-full h-full z-20 will-change-transform flex items-center justify-center"
              >
                <img
                  src={registryCouple}
                  alt="Cặp đôi hạnh phúc nhận quà mừng"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </motion.div>
            </div>
          </div>

          <div
            id="scene-guests"
            ref={scene3Ref}
            className="relative w-full"
            style={{ height: "300vh" }}
          >
            <div className="sticky top-[112px] h-[calc(100vh-112px)] w-full bg-[#EAE4DD] overflow-hidden">
              <motion.div
                style={{ scale: glBgScale, y: glBgY }}
                className="absolute inset-0 w-full h-full will-change-transform"
              >
                <img
                  src={glBg}
                  alt="Bãi biển hoàng hôn"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </motion.div>

              <div className="absolute inset-0 z-10 flex items-center justify-center px-1 sm:px-2 pt-2 pb-14">
                <motion.div
                  style={{
                    scale: glTableScale,
                    y: glTableY,
                    transformOrigin: "center 70%",
                  }}
                  className="relative w-full h-full will-change-transform flex items-center justify-center"
                >
                  <img
                    src={glUiBg}
                    alt="Nền kính mờ danh sách khách mời"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  <img
                    src={glUi}
                    alt="Giao diện danh sách khách mời"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                </motion.div>
              </div>

              <motion.div
                style={{ y: glCoupleY }}
                className="absolute bottom-0 inset-x-0 w-full h-[62%] z-20 will-change-transform pointer-events-none flex items-end justify-center"
              >
                <img
                  src={glCouple}
                  alt="Cô dâu chú rể ngồi trên bờ cát"
                  className="w-full h-full object-contain object-bottom scale-105"
                />
              </motion.div>
            </div>
          </div>

          <div
            id="scene-std"
            ref={scene4Ref}
            className="relative w-full"
            style={{ height: "220vh" }}
          >
            <div className="sticky top-[112px] h-[calc(100vh-112px)] w-full bg-[#181109] overflow-hidden">
              <motion.div
                style={{ scale: stdBgScale }}
                className="absolute inset-0 w-full h-full will-change-transform"
              >
                <img
                  src={stdBg}
                  alt="Mặt bàn gỗ và lá khuynh diệp"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </motion.div>

              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 lg:p-7">
                <div className="relative w-full max-w-[94%] aspect-[1516/1200] flex items-center justify-center">

                  <motion.div
                    style={{
                      scale: stdCardsScale,
                      opacity: stdCardsOpacity,
                      zIndex: 5,
                      transformOrigin: "center center",
                    }}
                    className="absolute inset-0 w-full h-full will-change-transform pointer-events-none flex items-center justify-center"
                  >
                    <img
                      src={stdCards}
                      alt="Bộ sưu tập các mẫu thiệp Save the Date và ứng dụng di động"
                      className="w-[115.3%] max-w-none h-full object-contain"
                    />
                  </motion.div>

                  <motion.div
                    style={{
                      opacity: stdEnvelopeOpacity,
                      scale: stdEnvelopeScale,
                      y: stdEnvelopeY,
                      zIndex: 10,
                    }}
                    className="absolute inset-0 w-full h-full will-change-transform pointer-events-none flex items-center justify-center"
                  >
                    <img
                      src={stdShadow}
                      alt="Bóng phong bì"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <img
                      src={stdEnvelopeBack}
                      alt="Mặt sau phong bì"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </motion.div>

                  <motion.div
                    style={{
                      y: stdCardY,
                      scale: stdCardScale,
                      zIndex: 20,
                      transformOrigin: "center center",
                    }}
                    className="absolute inset-0 w-full h-full will-change-transform flex items-center justify-center pointer-events-none"
                  >
                    <img
                      src={stdMainCard}
                      alt="Thiệp Save the Date chính"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  <motion.div
                    style={{
                      opacity: stdEnvelopeOpacity,
                      scale: stdEnvelopeScale,
                      y: stdEnvelopeY,
                      zIndex: 30,
                    }}
                    className="absolute inset-0 w-full h-full will-change-transform pointer-events-none flex items-center justify-center"
                  >
                    <img
                      src={stdEnvelopeFront}
                      alt="Nắp trước phong bì"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </motion.div>

                </div>
              </div>
            </div>
          </div>

          <div
            id="scene-invites"
            ref={scene5Ref}
            className="relative w-full"
            style={{ height: "220vh" }}
          >
            <div className="sticky top-[112px] h-[calc(100vh-112px)] w-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[94%] aspect-[1516/1200] flex items-center justify-center">

                <motion.div
                  style={{ scale: invBgScale }}
                  className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
                >
                  <img
                    src={invitesBg}
                    alt="Bộ sưu tập thiệp cưới số trên bàn đá cẩm thạch"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                <div className="absolute top-[14.58%] left-[81.27%] w-[18.60%] h-[13.58%] overflow-hidden z-10 pointer-events-none">
                  <img
                    src={invitesCouple2}
                    alt="Ảnh cặp đôi thiệp cảm ơn"
                    className="w-full h-full object-cover object-[center_35%]"
                  />
                </div>

                <motion.div
                  style={{ y: invShadowY }}
                  className="absolute inset-0 w-full h-full z-10 will-change-transform pointer-events-none"
                >
                  <img
                    src={invitesShadow}
                    alt="Bóng đổ thiệp mời"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                <motion.div
                  style={{
                    y: invCardsY,
                    scale: invCardsScale,
                  }}
                  className="absolute inset-0 w-full h-full z-20 will-change-transform pointer-events-none"
                >
                  <img
                    src={invitesCards}
                    alt="Các mẫu thiệp mời số và thiết bị di động"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                <motion.div
                  style={{
                    y: invArchY,
                    scale: invArchScale,
                    transformOrigin: "bottom center",
                  }}
                  className="absolute top-[48.17%] left-[30.01%] w-[20.18%] h-[34.58%] z-30 will-change-transform pointer-events-none shadow-2xl rounded-t-full rounded-b-[4px] overflow-hidden"
                >
                  <div className="relative w-full h-full">
                    <img
                      src={invitesCouple}
                      alt="Thiệp mời vòm cặp đôi Ruby và Emmanuel"
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                    <div className="absolute inset-[3px] rounded-t-full rounded-b-[2px] border border-white/50 pointer-events-none" />

                    <div className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
                      <span className="font-serif italic text-[7px] sm:text-[9px] text-white/80 tracking-widest whitespace-nowrap uppercase">
                        Save the Date
                      </span>
                    </div>

                    <div className="absolute bottom-3 sm:bottom-4 inset-x-2 text-center text-white select-none">
                      <p className="font-sans font-semibold text-[8px] sm:text-[10px] md:text-[11px] tracking-wider uppercase leading-tight drop-shadow-sm">
                        Ruby Torres &amp; Emmanuel Brewer
                      </p>
                      <p className="font-sans text-[6px] sm:text-[7.5px] md:text-[8.5px] tracking-widest uppercase text-white/90 mt-1 leading-tight">
                        Saturday, October 10, 2026
                      </p>
                      <p className="font-sans text-[5.5px] sm:text-[7px] md:text-[8px] tracking-widest uppercase text-white/80 mt-0.5 leading-tight">
                        Barcelona, Spain
                      </p>
                      <p className="font-serif italic text-[5.5px] sm:text-[7px] md:text-[8px] text-white/85 mt-1 leading-tight">
                        Invitation to Follow
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>

          <div
            id="scene-rsvp"
            ref={scene6Ref}
            className="relative w-full"
            style={{ height: "220vh" }}
          >
            <div className="sticky top-[112px] h-[calc(100vh-112px)] w-full bg-[#E5ECE5] overflow-hidden flex items-center justify-center">
              <motion.div
                style={{ scale: rsvpBgScale }}
                className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
              >
                <img
                  src={rsvpBg}
                  alt="Đồi cỏ thiên nhiên hoàng hôn"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </motion.div>

              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="relative w-full h-full flex items-end justify-center">

                  <motion.div
                    style={{
                      y: rsvpBubblesY,
                      opacity: rsvpBubblesOpacity,
                      scale: rsvpBubblesScale,
                      transformOrigin: "center 18%",
                    }}
                    className="absolute inset-0 w-full h-full z-10 will-change-transform pointer-events-none flex items-center justify-center"
                  >
                    <img
                      src={rsvpBubbles}
                      alt="Các bong bóng tính năng xác nhận tham dự thông minh"
                      className="w-[118%] sm:w-[114%] lg:w-[110%] max-w-none h-auto object-contain -translate-y-12 sm:-translate-y-18 lg:-translate-y-22"
                    />
                  </motion.div>

                  <motion.div
                    style={{
                      y: rsvpCardY,
                      scale: rsvpCardScale,
                      transformOrigin: "bottom center",
                    }}
                    className="absolute bottom-0 left-[52%] -translate-x-1/2 w-[34%] max-w-[420px] aspect-[747/1200] z-20 will-change-transform pointer-events-none shadow-2xl rounded-md sm:rounded-lg overflow-hidden bg-white"
                  >
                    <img
                      src={rsvpCard}
                      alt="Thẻ thiệp cưới thông minh có đếm ngược ngày cưới"
                      className="w-full h-full object-cover object-top"
                    />
                  </motion.div>

                  <motion.div
                    style={{
                      y: rsvpCoupleY,
                      scale: rsvpCoupleScale,
                      transformOrigin: "bottom center",
                    }}
                    className="absolute bottom-0 left-[52%] -translate-x-1/2 w-full max-w-[1200px] aspect-[1200/800] z-30 will-change-transform pointer-events-none flex items-end justify-center"
                  >
                    <img
                      src={rsvpCouple}
                      alt="Cặp đôi vui tươi bên thẻ xác nhận tham dự"
                      className="w-full h-full object-contain object-bottom"
                    />
                  </motion.div>

                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
