import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowUp,
  Loader2,
  Users,
  Calendar,
  Clock,
  MapPin,
  Leaf,
  Check,
} from "lucide-react";

import everwebLogo from "../../assets/image/everweb-logo.jpg";
import weddingCouple from "../../assets/image/wedding-couple.jpg";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";

const SCENARIOS = [
  {
    id: "design",
    userPrompt: "Thiết kế website và thiệp cưới cho tôi với phong cách tối giản và lãng mạn.",
    botReply: "Dưới đây là 2 phong cách thiết kế tối giản và lãng mạn phù hợp nhất với bạn:",
    type: "design",
  },
  {
    id: "guests",
    userPrompt: "Thêm gia đình anh Minh: Minh, Lan và bé Bi. Cả ba người đều ăn chay.",
    botReply: "Đã thêm gia đình anh Minh vào danh sách, tất cả đều ăn chay:",
    type: "guests",
  },
  {
    id: "rsvp",
    userPrompt: "Hiện có bao nhiêu khách đã phản hồi tham dự?",
    botReply: "88 trong tổng số 123 khách đã gửi phản hồi:",
    type: "rsvp",
  },
  {
    id: "schedule",
    userPrompt: "Thêm lễ rước dâu lúc 09:00 tại Nhà gái và tiệc cưới lúc 18:00 tại Riverside Palace.",
    botReply: "Đã cập nhật lịch trình sự kiện ngày cưới chính thức:",
    type: "schedule",
  },
];

function CountUpNumber({ target = 88, duration = 1200 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animId = null;

    const stepFn = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(Math.round(ease * target));
      if (progress < 1) {
        animId = requestAnimationFrame(stepFn);
      }
    };

    animId = requestAnimationFrame(stepFn);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [target, duration]);

  return <span>{val}</span>;
}

export default function AiChatShowcase() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState("typing_input");
  const [typedInput, setTypedInput] = useState("");
  const [typedBotReply, setTypedBotReply] = useState("");
  const [activeCard, setActiveCard] = useState(0);
  const [activeScheduleItem, setActiveScheduleItem] = useState(0);
  const [activeGuestItem, setActiveGuestItem] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const timeouts = [];
    const intervals = [];

    const safeTimeout = (fn, delay) => {
      const id = setTimeout(() => {
        if (!isCancelled) fn();
      }, delay);
      timeouts.push(id);
      return id;
    };

    const safeInterval = (fn, delay) => {
      const id = setInterval(() => {
        if (!isCancelled) fn();
      }, delay);
      intervals.push(id);
      return id;
    };

    const currentScenario = SCENARIOS[scenarioIndex];
    const promptText = currentScenario.userPrompt;
    const replyText = currentScenario.botReply;

    safeTimeout(() => {
      setStep("typing_input");
      setTypedInput("");
      setTypedBotReply("");
      setActiveCard(0);
      setActiveScheduleItem(0);
      setActiveGuestItem(0);

      let charIdx = 0;
      const inputTimer = safeInterval(() => {
        charIdx++;
        setTypedInput(promptText.slice(0, charIdx));

        if (charIdx >= promptText.length) {
          clearInterval(inputTimer);
          setStep("input_ready");

          safeTimeout(() => {
            setStep("message_sent");
            setTypedInput("");

            safeTimeout(() => {
              setStep("ai_thinking");

              safeTimeout(() => {
                setStep("ai_streaming");

                let replyIdx = 0;
                const replyTimer = safeInterval(() => {
                  replyIdx += 2;
                  setTypedBotReply(replyText.slice(0, Math.min(replyIdx, replyText.length)));

                  if (replyIdx >= replyText.length) {
                    clearInterval(replyTimer);

                    safeTimeout(() => {
                      setStep("content_revealed");

                      if (currentScenario.id === "design") {
                        setActiveCard(0);

                        safeTimeout(() => {
                          setActiveCard(1);

                          safeTimeout(() => {
                            setActiveCard(2);

                            safeTimeout(() => {
                              setStep("transitioning");
                              safeTimeout(() => {
                                setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
                              }, 400);
                            }, 2400);
                          }, 2400);
                        }, 1000);
                      } else if (currentScenario.id === "schedule") {
                        setActiveScheduleItem(0);

                        safeTimeout(() => {
                          setActiveScheduleItem(2);

                          safeTimeout(() => {
                            setActiveScheduleItem(-1);

                            safeTimeout(() => {
                              setStep("transitioning");
                              safeTimeout(() => {
                                setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
                              }, 400);
                            }, 1400);
                          }, 2200);
                        }, 2200);
                      } else if (currentScenario.id === "guests") {
                        setActiveGuestItem(0);

                        safeTimeout(() => {
                          setActiveGuestItem(1);

                          safeTimeout(() => {
                            setActiveGuestItem(2);

                            safeTimeout(() => {
                              setActiveGuestItem(-1);

                              safeTimeout(() => {
                                setStep("transitioning");
                                safeTimeout(() => {
                                  setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
                                }, 400);
                              }, 1200);
                            }, 1600);
                          }, 1600);
                        }, 1600);
                      } else {
                        safeTimeout(() => {
                          setStep("transitioning");
                          safeTimeout(() => {
                            setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
                          }, 400);
                        }, 5200);
                      }
                    }, 250);
                  }
                }, 22);
              }, 1000);
            }, 350);
          }, 500);
        }
      }, 28);
    }, 40);

    return () => {
      isCancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [scenarioIndex]);

  const current = SCENARIOS[scenarioIndex];
  const showUserMessage = step !== "typing_input" && step !== "input_ready";
  const showThinking = step === "ai_thinking";
  const showBotMessage = step === "ai_streaming" || step === "content_revealed" || step === "transitioning";
  const showContent = step === "content_revealed" || step === "transitioning";

  return (
    <section className="relative w-full bg-white text-[#231F1C] py-20 lg:py-28 px-4 sm:px-8 lg:px-16 border-t border-stone-200/70">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        <div className="lg:col-span-5 flex flex-col items-start">
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#231F1C]">
            EverWeb + AI Chatbox.
          </h2>

          <p className="mt-5 text-sm sm:text-base text-[#403B35] leading-relaxed max-w-md font-normal">
            Giới thiệu Trợ lý EverWeb AI. Thiết kế website cưới, tạo thiệp & chỉnh sửa ảnh, quản lý lịch trình, sắp xếp danh sách khách mời và giải đáp mọi thắc mắc. Chỉ cần đưa ra yêu cầu — đơn giản như một cuộc trò chuyện.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="#chat"
              className="inline-flex h-11 px-7 items-center justify-center rounded-full border border-[#231F1C] bg-transparent text-[#231F1C] font-semibold text-xs sm:text-sm transition-all duration-200 hover:bg-[#F3ECE2] hover:border-[#231F1C] hover:text-[#231F1C] shadow-sm"
            >
              Trải nghiệm ngay
            </a>
            <a
              href="#learn-more"
              className="inline-flex h-11 px-4 items-center justify-center text-[#231F1C] font-semibold text-xs sm:text-sm hover:opacity-70 transition-opacity"
            >
              Tìm hiểu thêm
              <ChevronRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center w-full">
          <div className="relative w-full max-w-[490px] bg-white rounded-[28px] border border-stone-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-6 sm:p-7 flex flex-col justify-between min-h-[500px] pointer-events-none select-none">
            
            <div
              className={`flex-1 flex flex-col justify-start space-y-4 transition-opacity duration-300 ${
                step === "transitioning" ? "opacity-0" : "opacity-100"
              }`}
            >
              <AnimatePresence>
                {showUserMessage && (
                  <motion.div
                    key={`user-${current.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] bg-[#F3F4F6] text-[#1E1E24] text-xs sm:text-sm rounded-2xl rounded-tr-sm px-4 py-3 leading-relaxed shadow-sm">
                      {current.userPrompt}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showThinking && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg overflow-hidden border border-stone-200/60 bg-white flex items-center justify-center shrink-0">
                      <img
                        src={everwebLogo}
                        alt="EverWeb"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 bg-stone-50 border border-stone-200/60 rounded-xl px-3 py-1.5 shadow-sm">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
                      <span className="text-xs">Đang xử lý...</span>
                    </div>
                  </motion.div>
                )}

                {showBotMessage && (
                  <motion.div
                    key={`bot-${current.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg overflow-hidden border border-stone-200/60 bg-white flex items-center justify-center shrink-0 mt-0.5">
                      <img
                        src={everwebLogo}
                        alt="EverWeb"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <p className="text-xs sm:text-sm text-[#1E1E24] leading-relaxed">
                        {step === "ai_streaming" ? (
                          <span>
                            {typedBotReply}
                            <span className="inline-block w-0.5 h-3 bg-stone-600 ml-0.5 animate-pulse align-middle" />
                          </span>
                        ) : (
                          current.botReply
                        )}
                      </p>

                      {showContent && current.type === "design" && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div
                            className={`rounded-2xl transition-all duration-500 p-1 bg-white ${
                              activeCard === 1
                                ? "border-2 border-[#3B52DE] shadow-[0_16px_36px_-6px_rgba(59,82,222,0.35)] scale-[1.02] opacity-100"
                                : activeCard === 2
                                ? "border-2 border-transparent opacity-60 scale-100"
                                : "border-2 border-stone-200/70 opacity-100 shadow-sm"
                            }`}
                          >
                            <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#9C6E5A] p-2.5 flex flex-col justify-between text-center relative shadow-inner">
                              <div>
                                <p className="font-serif text-[11px] font-medium text-white tracking-wide">
                                  Maya & Leo
                                </p>
                                <p className="text-white/40 text-[7px] tracking-widest mt-0.5">
                                  —————
                                </p>
                              </div>
                              <div className="w-[68%] mx-auto aspect-[3/4] rounded-t-full rounded-b-sm overflow-hidden border border-white/30 shadow-md">
                                <img
                                  src={weddingCouple}
                                  alt="Maya & Leo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-white/95 text-[8px] font-medium">
                                  Saturday, June 12, 2027
                                </p>
                                <p className="text-white/60 text-[7px]">
                                  Napa, California
                                </p>
                              </div>
                            </div>
                            <p
                              className={`text-xs mt-1.5 px-1 pb-0.5 transition-colors ${
                                activeCard === 1
                                  ? "font-semibold text-[#1E1E24]"
                                  : activeCard === 2
                                  ? "font-medium text-stone-400"
                                  : "font-medium text-[#1E1E24]"
                              }`}
                            >
                              Minimalist Arch
                            </p>
                          </div>

                          <div
                            className={`rounded-2xl transition-all duration-500 p-1 bg-white ${
                              activeCard === 2
                                ? "border-2 border-[#3B52DE] shadow-[0_16px_36px_-6px_rgba(59,82,222,0.35)] scale-[1.02] opacity-100"
                                : activeCard === 1
                                ? "border-2 border-transparent opacity-60 scale-100"
                                : "border-2 border-stone-200/70 opacity-100 shadow-sm"
                            }`}
                          >
                            <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] border border-stone-200/70 p-2.5 flex flex-col justify-between text-center relative shadow-inner">
                              <div>
                                <p className="font-serif text-[11px] font-medium text-stone-800 tracking-wide">
                                  Maya & Leo
                                </p>
                                <p className="text-stone-300 text-[7px] tracking-widest mt-0.5">
                                  —————
                                </p>
                              </div>
                              <div className="w-[72%] mx-auto aspect-[4/3] rounded-md overflow-hidden border border-stone-200 shadow-sm">
                                <img
                                  src={galleryBouquet}
                                  alt="Ivory Garden"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-stone-600 text-[8px] font-medium">
                                  Saturday, June 12, 2027
                                </p>
                                <p className="text-stone-400 text-[7px]">
                                  Napa, California
                                </p>
                              </div>
                            </div>
                            <p
                              className={`text-xs mt-1.5 px-1 pb-0.5 transition-colors ${
                                activeCard === 2
                                  ? "font-semibold text-[#1E1E24]"
                                  : activeCard === 1
                                  ? "font-medium text-stone-400"
                                  : "font-medium text-[#1E1E24]"
                              }`}
                            >
                              Ivory Garden
                            </p>
                          </div>
                        </div>
                      )}

                      {showContent && current.type === "guests" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-2.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-stone-500" />
                              <span className="text-xs font-semibold text-[#231F1C]">
                                Gia đình anh Minh · 3 khách
                              </span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Mới
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            {[
                              { initial: "M", name: "Minh Hoàng", role: "Khách mời" },
                              { initial: "L", name: "Thu Lan", role: "Khách mời" },
                              { initial: "B", name: "Bé Bi", role: "Trẻ em" },
                            ].map((g, idx) => {
                              const isGuestActive = activeGuestItem === idx;
                              return (
                                <motion.div
                                  key={g.name}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: idx * 0.12 }}
                                  className={`flex items-center justify-between py-1.5 px-2 rounded-xl transition-all duration-300 ${
                                    isGuestActive
                                      ? "bg-white shadow-[0_4px_14px_-2px_rgba(0,0,0,0.06)] ring-1 ring-emerald-500/30 scale-[1.01]"
                                      : "hover:bg-white/40"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-700">
                                      {g.initial}
                                    </span>
                                    <span className="font-medium text-[#231F1C]">{g.name}</span>
                                    <span className="text-stone-400 text-[11px]">{g.role}</span>
                                  </div>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                    <Leaf className="w-3 h-3" /> Ăn chay
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>

                          <p className="text-[11px] text-stone-400 pt-1 text-right">
                            123 khách trong danh sách của bạn
                          </p>
                        </motion.div>
                      )}

                      {showContent && current.type === "rsvp" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-3 shadow-sm"
                        >
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-3xl font-display font-medium text-[#231F1C]">
                                <CountUpNumber target={88} duration={1400} />
                              </span>
                              <span className="text-sm text-stone-400 ml-1">/ 123 khách</span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              71.5% phản hồi
                            </span>
                          </div>

                          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden flex gap-0.5">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "60%" }}
                              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full bg-emerald-500 rounded-l-full"
                            />
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "11%" }}
                              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full bg-amber-400"
                            />
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "29%" }}
                              transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full bg-stone-300 rounded-r-full"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              <span className="text-stone-600">74 Tham dự</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                              <span className="text-stone-600">14 Bận</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-stone-400 shrink-0" />
                              <span className="text-stone-600">35 Đang chờ</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {showContent && current.type === "schedule" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-stone-200/60 pb-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
                              <span className="text-xs font-semibold text-[#231F1C] truncate">
                                Lịch Trình Ngày Cưới
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                <Check className="w-3 h-3 text-emerald-600" /> 3 Sự kiện
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs pt-0.5">
                            {[
                              {
                                time: "09:00",
                                title: "Lễ Gia Tiên & Rước Dâu",
                                location: "Nhà Gái · Trang phục áo dài",
                                tag: "Mới thêm",
                                tagColor: "bg-rose-50 text-rose-700 border-rose-200/70",
                                timeColor: "text-rose-800 bg-rose-50 border-rose-200/60",
                                dotColor: "bg-rose-500 ring-rose-200",
                              },
                              {
                                time: "11:30",
                                title: "Tiệc Mừng Thân Mật",
                                location: "Nhà Trai · Gia đình & Bạn thân",
                                tag: null,
                                timeColor: "text-stone-700 bg-stone-100 border-stone-200",
                                dotColor: "bg-stone-400 ring-stone-200",
                              },
                              {
                                time: "18:00",
                                title: "Đón Khách & Khai Tiệc Cưới",
                                location: "Riverside Palace · Ballroom A",
                                tag: "Mới thêm",
                                tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
                                timeColor: "text-emerald-800 bg-emerald-50 border-emerald-200/60",
                                dotColor: "bg-emerald-500 ring-emerald-200",
                              },
                            ].map((item, idx, arr) => {
                              const isHighlighted = activeScheduleItem === idx;
                              return (
                                <motion.div
                                  key={item.time}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.32,
                                    delay: 0.1 + idx * 0.15,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  className="flex items-stretch gap-2.5"
                                >
                                  <div className="flex flex-col items-center shrink-0 w-3.5 pt-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ring-4 transition-all duration-300 ${
                                        item.dotColor
                                      } ${isHighlighted ? "scale-125 ring-offset-1" : "scale-100"}`}
                                    />
                                    {idx < arr.length - 1 && (
                                      <div className="w-0.5 flex-1 bg-stone-200/80 my-1 rounded-full" />
                                    )}
                                  </div>

                                  <div
                                    className={`flex-1 flex items-start gap-2.5 p-2 rounded-xl transition-all duration-300 ${
                                      isHighlighted
                                        ? "bg-white shadow-[0_6px_20px_-3px_rgba(0,0,0,0.08)] ring-1 ring-stone-900/10 scale-[1.01]"
                                        : "bg-transparent opacity-80 hover:bg-white/40"
                                    }`}
                                  >
                                    <div
                                      className={`flex items-center gap-1 font-mono-num font-semibold px-2 py-0.5 rounded border shrink-0 ${item.timeColor}`}
                                    >
                                      <Clock className="w-3 h-3" /> {item.time}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="font-semibold text-[#231F1C] truncate">{item.title}</p>
                                        {item.tag && (
                                          <span
                                            className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border whitespace-nowrap ${item.tagColor}`}
                                          >
                                            {item.tag}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                                        <MapPin className="w-3 h-3 shrink-0" /> {item.location}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-5 pt-3">
              <div className="relative flex items-center bg-[#F8F8FA] border border-stone-200/80 rounded-full px-4 py-2.5 shadow-inner">
                {step === "typing_input" || step === "input_ready" ? (
                  <span className="text-xs sm:text-sm text-[#1E1E24] select-none flex-1 truncate pr-2 font-normal">
                    {typedInput}
                    {step === "typing_input" && (
                      <span className="inline-block w-0.5 h-3.5 bg-stone-700 ml-0.5 animate-pulse align-middle" />
                    )}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-stone-400 select-none flex-1 truncate pr-2 font-normal">
                    Hỏi bất kỳ điều gì...
                  </span>
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-default select-none transition-colors duration-200 ${
                    step === "input_ready"
                      ? "bg-[#231F1C] text-white shadow-sm"
                      : "bg-stone-200 text-stone-400"
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
