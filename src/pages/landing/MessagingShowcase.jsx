import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  MessageCircle,
  Clock,
  Check,
} from "lucide-react";

function FlipStatusBadge({ status, color, pulse = false }) {
  return (
    <div className="w-[104px] h-[30px] flex items-center justify-end [perspective:600px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={status}
          initial={{ rotateX: -75, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 75, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-2xs whitespace-nowrap"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              color === "emerald"
                ? "bg-emerald-500"
                : color === "blue"
                ? "bg-blue-600"
                : "bg-amber-500"
            } ${pulse ? "animate-pulse" : ""}`}
          />
          <span className="text-[11px] font-medium text-stone-700 whitespace-nowrap">
            {status}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function MessagingShowcase() {
  const [activeTab, setActiveTab] = useState("text");
  const [sendMode, setSendMode] = useState("now");
  const [waStatus, setWaStatus] = useState("scheduled");
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    if (isManual) {
      const resetManualTimer = setTimeout(() => {
        setIsManual(false);
      }, 12000);
      return () => clearTimeout(resetManualTimer);
    }

    let isCancelled = false;
    const timeouts = [];

    const safeTimeout = (fn, delay) => {
      const id = setTimeout(() => {
        if (!isCancelled) fn();
      }, delay);
      timeouts.push(id);
      return id;
    };

    if (activeTab === "text") {
      safeTimeout(() => {
        setActiveTab("email");
      }, 4800);
    } else if (activeTab === "email") {
      safeTimeout(() => {
        setActiveTab("both");
      }, 4800);
    } else if (activeTab === "both") {
      safeTimeout(() => {
        setSendMode("scheduled");

        safeTimeout(() => {
          setWaStatus("delivered");

          safeTimeout(() => {
            setActiveTab("text");
            safeTimeout(() => {
              setSendMode("now");
              setWaStatus("scheduled");
            }, 600);
          }, 3400);
        }, 2600);
      }, 2200);
    }

    return () => {
      isCancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [activeTab, isManual]);

  return (
    <section className="relative w-full bg-white text-[#231F1C] py-20 lg:py-28 px-4 sm:px-8 lg:px-16 border-t border-stone-200/70 overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-stone-200/70 pointer-events-none" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-stone-200/40 pointer-events-none hidden sm:block" />

          <div className="relative w-full max-w-[430px] bg-white rounded-[28px] border border-stone-200/80 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] p-6 sm:p-7 min-h-[490px] flex flex-col justify-between z-10">
            <div>
              <div className="relative w-full bg-[#F3F4F6] rounded-full p-1.5 flex items-center justify-between">
                {[
                  { id: "text", label: "Tin nhắn" },
                  { id: "email", label: "Email" },
                  { id: "both", label: "Cả hai" },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsManual(true);
                        if (tab.id === "both") {
                          setSendMode("scheduled");
                          setWaStatus("scheduled");
                        }
                      }}
                      className="relative flex-1 py-2 text-xs sm:text-sm font-medium select-none z-10 transition-colors duration-200 text-center"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.8 }}
                          className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                        />
                      )}
                      <span
                        className={`relative z-10 transition-colors duration-200 ${
                          isActive
                            ? "text-[#231F1C] font-semibold"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-5 h-[310px] w-full">
                
                <div
                  className={`absolute inset-0 transition-all duration-400 ease-out space-y-4 ${
                    activeTab === "text"
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-stone-400">Đến</span>
                    <span className="font-semibold text-[#231F1C] bg-stone-100 px-2.5 py-0.5 rounded-md">
                      Phù dâu & Bạn thân
                    </span>
                    <span className="text-stone-400">+12 Khách</span>
                  </div>

                  <div className="bg-[#F3F4F6] text-[#231F1C] rounded-2xl rounded-tl-sm p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm leading-relaxed shadow-sm">
                    <p className="font-medium text-stone-500 text-[11px] sm:text-xs">
                      Tin nhắn từ Tuấn & Linh:
                    </p>
                    <p className="font-semibold text-[#231F1C]">
                      Đám cưới của tụi mình sắp diễn ra rồi 🎉
                    </p>
                    <p className="text-stone-600 text-xs leading-normal">
                      Vui lòng gửi xác nhận tham dự (RSVP) trước ngày 15/10 để tụi mình chuẩn bị chu đáo nhất cho bạn nhé!
                    </p>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-400 ease-out space-y-3.5 ${
                    activeTab === "email"
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm pb-1.5 border-b border-stone-100">
                    <span className="text-stone-400">Đến</span>
                    <span className="font-semibold text-[#231F1C]">Phù dâu & Bạn thân</span>
                    <span className="text-stone-400">+12 Khách</span>
                  </div>

                  <div className="text-xs sm:text-sm pb-2 border-b border-stone-100">
                    <p className="text-stone-400 text-[11px]">Tiêu đề</p>
                    <p className="font-semibold text-[#231F1C] mt-0.5">
                      Nhắc nhở đặt phòng khách sạn & xe đưa đón
                    </p>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed pt-0.5">
                    <p className="font-medium text-[#231F1C]">Chào Maya,</p>
                    <p className="text-xs leading-normal">
                      Tụi mình đã chuẩn bị danh sách khách sạn gần địa điểm tiệc cưới với mức giá ưu đãi nhất 🥂
                    </p>
                    <p className="text-xs text-stone-500">
                      Hãy đặt phòng sớm trước khi hết chỗ nhé!
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full h-11 rounded-full bg-[#5B63D3] text-white font-semibold text-xs sm:text-sm shadow-sm transition-opacity hover:opacity-95 flex items-center justify-center gap-1.5"
                    >
                      Xem gợi ý khách sạn
                    </button>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-400 ease-out space-y-3 ${
                    activeTab === "both"
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-stone-400">
                      Thời gian gửi
                    </p>
                    <div className="relative w-full h-12 bg-[#F3F4F6] rounded-full p-1 flex items-center">
                      {[
                        { id: "now", label: "Gửi ngay" },
                        { id: "scheduled", label: "Hẹn giờ" },
                      ].map((item) => {
                        const isSelected = sendMode === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSendMode(item.id);
                              setIsManual(true);
                            }}
                            className="relative flex-1 h-full flex items-center justify-center text-xs sm:text-sm font-medium select-none z-10"
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="sendModeIndicator"
                                transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.8 }}
                                className="absolute inset-0 bg-white rounded-full shadow-sm"
                              />
                            )}
                            <span
                              className={`relative z-10 transition-colors duration-200 ${
                                isSelected
                                  ? "text-[#231F1C] font-semibold"
                                  : "text-stone-500 hover:text-stone-800"
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-medium text-[#231F1C] shadow-inner h-11">
                    <span>
                      {sendMode === "scheduled"
                        ? "Thứ Hai, 20 Th4 · 09:00"
                        : "Gửi ngay lập tức"}
                    </span>
                    <Clock className="w-4 h-4 text-stone-400" />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/70 border border-stone-200/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#4C1D95] text-white flex items-center justify-center">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-[#231F1C]">Email</span>
                      </div>
                      <FlipStatusBadge
                        status={sendMode === "now" ? "Đã gửi đến" : "Đã xem"}
                        color={sendMode === "now" ? "emerald" : "blue"}
                        pulse={sendMode === "scheduled"}
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/70 border border-stone-200/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#3B52DE] text-white flex items-center justify-center">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-[#231F1C]">Tin nhắn SMS</span>
                      </div>
                      <FlipStatusBadge
                        status="Đã gửi đến"
                        color="emerald"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/70 border border-stone-200/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-[#231F1C]">Zalo & WhatsApp</span>
                      </div>
                      <FlipStatusBadge
                        status={
                          sendMode === "now"
                            ? "Đã gửi đến"
                            : waStatus === "scheduled"
                            ? "Đã lên lịch"
                            : "Đã gửi đến"
                        }
                        color={
                          sendMode === "now"
                            ? "emerald"
                            : waStatus === "scheduled"
                            ? "amber"
                            : "emerald"
                        }
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Đồng bộ 3 nền tảng</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <Check className="w-3 h-3" /> Tự động hóa
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-start">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#4C1D95] text-white flex items-center justify-center shadow-sm">
              <Mail className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#3B52DE] text-white flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-sm">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl lg:text-[2.35rem] font-semibold leading-[1.22] tracking-[-0.015em] text-[#231F1C]">
            Lên lịch gửi tin nhắn tới từng khách mời, mọi lúc mọi nơi.
          </h2>

          <p className="mt-5 text-sm sm:text-base text-[#403B35] leading-relaxed max-w-md font-normal">
            Gửi thông báo cập nhật qua SMS, Email và Zalo cùng một lúc, hẹn giờ gửi tự động trước ngày cưới và theo dõi chính xác ai đã xem, ai đã nhận.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="#messaging"
              className="inline-flex h-11 px-7 items-center justify-center rounded-full border border-[#231F1C] bg-transparent text-[#231F1C] font-semibold text-xs sm:text-sm transition-all duration-200 hover:bg-[#F3ECE2] hover:border-[#231F1C] hover:text-[#231F1C] shadow-sm"
            >
              Trải nghiệm ngay
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
