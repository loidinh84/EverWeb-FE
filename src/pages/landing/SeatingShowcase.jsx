import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  Heart,
  Utensils,
  Plus,
} from "lucide-react";

const TEMPLATES = [
  {
    id: "garden",
    title: "Tiệc Sân Vườn",
    subtitle: "5 bàn tiệc",
    type: "grid",
  },
  {
    id: "classic",
    title: "Tiệc Cưới Cổ Điển",
    subtitle: "4 bàn tiệc",
    type: "circles",
  },
  {
    id: "family",
    title: "Tiệc Kiểu Gia Đình",
    subtitle: "4 bàn tiệc",
    type: "long",
  },
];

const SEAT_POSITIONS = [
  { x: 72, y: 0 },
  { x: 51, y: 51 },
  { x: 0, y: 72 },
  { x: -51, y: 51 },
  { x: -72, y: 0 },
  { x: -51, y: -51 },
  { x: 0, y: -72 },
  { x: 51, y: -51 },
];

const HEAD_SEATS = [
  { id: "h1", name: "TE", color: "bg-purple-100 text-purple-800" },
  { id: "h2", name: "AE", color: "bg-purple-100 text-purple-800" },
  { id: "h3", name: "RE", color: "bg-indigo-100 text-indigo-800" },
  { id: "h4", name: "MB", heart: true, color: "bg-rose-100 text-rose-800" },
  { id: "h5", name: "SB", heart: true, color: "bg-amber-100 text-amber-800" },
  { id: "h6", name: "JD", color: "bg-stone-200 text-stone-800" },
  { id: "h7", name: "KD", color: "bg-amber-100 text-amber-800" },
  { id: "h8", name: "LD", color: "bg-stone-200 text-stone-800" },
];

const FAMILY_SEATS = [
  { id: "f1", name: "CK", color: "bg-amber-100 text-amber-800" },
  { id: "f2", name: "DK", color: "bg-amber-100 text-amber-800" },
  { id: "f3", name: "EK", color: "bg-amber-100 text-amber-800" },
  { id: "f4", name: "OP", color: "bg-purple-100 text-purple-800" },
  { id: "f5", name: "IP", color: "bg-purple-100 text-purple-800" },
  { id: "f6", name: "SM", color: "bg-stone-200 text-stone-800" },
  { id: "f7", name: "LM", color: "bg-stone-200 text-stone-800" },
  { id: "f8", name: "HM", color: "bg-stone-200 text-stone-800" },
];

const BEST_FRIENDS_SEATS = [
  { id: "b1", name: "VC", color: "bg-blue-100 text-blue-800" },
  { id: "b2", name: "BC", color: "bg-blue-100 text-blue-800" },
  { id: "b3", name: "FC", color: "bg-purple-100 text-purple-800" },
  { id: "b4", name: "XW", color: "bg-indigo-100 text-indigo-800" },
  { id: "b5", name: "ZT", color: "bg-amber-100 text-amber-800" },
  { id: "b6", name: "YT", color: "bg-amber-100 text-amber-800" },
  { id: "b7", name: "HR", color: "bg-amber-100 text-amber-800" },
  { id: "b8", name: "GR", color: "bg-stone-200 text-stone-800" },
];

const COUSINS_SEATS = [
  { id: "c1", name: "AL", color: "bg-rose-100 text-rose-800" },
  { id: "c2", name: "ML", color: "bg-rose-100 text-rose-800" },
  { id: "c3", name: "PL", color: "bg-rose-100 text-rose-800" },
  { id: "c4", name: "QW", color: "bg-purple-100 text-purple-800" },
  { id: "c5", name: "UW", color: "bg-purple-100 text-purple-800" },
  { id: "c6", name: "NW", color: "bg-indigo-100 text-indigo-800" },
  { id: "c7", name: "KL", color: "bg-amber-100 text-amber-800" },
  { id: "c8", name: "TL", color: "bg-stone-200 text-stone-800" },
];

export default function SeatingShowcase() {
  const [cycle, setCycle] = useState(0);
  const [stage, setStage] = useState("templates");
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [templatePressed, setTemplatePressed] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const timeouts = [];

    const safeTimeout = (fn, delay) => {
      const id = setTimeout(() => {
        if (!isCancelled) fn();
      }, delay);
      timeouts.push(id);
      return id;
    };

    safeTimeout(() => {
      setStage("templates");
      setActiveTemplate(null);
      setTemplatePressed(false);
      setButtonPressed(false);

      safeTimeout(() => {
        setActiveTemplate("classic");

        safeTimeout(() => {
          setTemplatePressed(true);

          safeTimeout(() => {
            setStage("zooming");

            safeTimeout(() => {
              setStage("empty_chart");

              safeTimeout(() => {
                setButtonPressed(true);

                safeTimeout(() => {
                  setButtonPressed(false);
                  setStage("seating");

                  safeTimeout(() => {
                    setStage("summary");

                    safeTimeout(() => {
                      setStage("fading");

                      safeTimeout(() => {
                        setCycle((prev) => prev + 1);
                      }, 400);
                    }, 5200);
                  }, 2200);
                }, 250);
              }, 1400);
            }, 450);
          }, 280);
        }, 1500);
      }, 1100);
    }, 40);

    return () => {
      isCancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [cycle]);

  return (
    <section className="relative w-full bg-white text-[#231F1C] py-20 lg:py-28 px-4 sm:px-8 lg:px-16 border-t border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        <div className="lg:col-span-5 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-md bg-[#3B52DE] text-white text-[11px] font-bold tracking-wider uppercase">
              Mới
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#3B52DE]">
              Sơ Đồ Chỗ Ngồi · Seating Chart
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl lg:text-[2.35rem] font-semibold leading-[1.22] tracking-[-0.015em] text-[#231F1C]">
            Khách mời của bạn đã sẵn sàng vào bàn tiệc.
          </h2>

          <p className="mt-5 text-sm sm:text-base text-[#403B35] leading-relaxed max-w-md font-normal">
            Tự động xếp chỗ thông minh, EverWeb lấp đầy các bàn tiệc, giữ các nhóm bạn bè và gia đình ngồi cạnh nhau, đồng thời tổng hợp số lượng món ăn chuẩn xác cho nhà hàng.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="#seating"
              className="inline-flex h-11 px-7 items-center justify-center rounded-full border border-[#231F1C] bg-transparent text-[#231F1C] font-semibold text-xs sm:text-sm transition-all duration-200 hover:bg-[#F3ECE2] hover:border-[#231F1C] hover:text-[#231F1C] shadow-sm"
            >
              Trải nghiệm ngay
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 relative flex justify-center items-center w-full min-h-[500px]">
          <div className="absolute w-[780px] h-[780px] rounded-full border border-stone-200/50 pointer-events-none" />
          <div className="absolute w-[560px] h-[560px] rounded-full border border-stone-200/60 pointer-events-none" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-stone-200/70 pointer-events-none" />

          <div className="relative w-full max-w-[740px] min-h-[480px] flex flex-col justify-center items-center pointer-events-none select-none">
            
            <div
              className={`relative w-full flex-1 flex flex-col justify-center items-center min-h-[450px] transition-opacity duration-300 ${
                stage === "fading" ? "opacity-0" : "opacity-100"
              }`}
            >
              
              <AnimatePresence mode="wait">
                {(stage === "templates" || stage === "zooming") && (
                  <motion.div
                    key="templates-view"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: stage === "zooming" ? 0 : 1,
                      scale: stage === "zooming" ? 1.08 : 1,
                      x: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex items-center justify-center gap-4 sm:gap-6 py-4"
                  >
                    {TEMPLATES.map((tmpl) => {
                      const isSelected = activeTemplate === tmpl.id;
                      return (
                        <div
                          key={tmpl.id}
                          className={`relative flex-1 max-w-[225px] aspect-[4/5] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 bg-white ${
                            isSelected
                              ? `border-2 border-[#4F46E5] shadow-[0_20px_45px_-8px_rgba(79,70,229,0.32)] z-10 ${
                                  templatePressed ? "scale-95" : "scale-[1.03]"
                                }`
                              : activeTemplate
                              ? "border border-stone-200/70 opacity-30 scale-[0.98]"
                              : "border border-stone-200/80 shadow-sm opacity-90"
                          }`}
                        >
                          <div className="w-full flex-1 flex flex-col items-center justify-center p-2">
                            {tmpl.type === "grid" && (
                              <div className="w-full space-y-3 flex flex-col items-center">
                                <div className="px-3 py-1 bg-stone-700 text-[9px] font-medium text-white rounded">
                                  Bàn Danh Dự
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="grid grid-cols-2 gap-2 w-16">
                                    <div className="aspect-square bg-stone-100 border border-stone-300/80 rounded" />
                                    <div className="aspect-square bg-stone-100 border border-stone-300/80 rounded" />
                                    <div className="aspect-square bg-stone-100 border border-stone-300/80 rounded" />
                                    <div className="aspect-square bg-stone-100 border border-stone-300/80 rounded" />
                                  </div>
                                  <div className="w-6 h-16 rounded border border-dashed border-stone-300 flex items-center justify-center">
                                    <span className="text-[8px] text-stone-400 font-medium rotate-90 whitespace-nowrap">
                                      Sàn nhảy
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {tmpl.type === "circles" && (
                              <div className="w-full space-y-3.5 flex flex-col items-center">
                                <div className="px-3 py-1 bg-stone-700 text-[9px] font-medium text-white rounded">
                                  Bàn Danh Dự · 0/8
                                </div>
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <div className="w-10 h-10 rounded-full border border-dashed border-stone-400 bg-stone-50 flex items-center justify-center text-[9px] text-stone-400 font-medium">
                                    0/8
                                  </div>
                                  <div className="w-10 h-10 rounded-full border border-dashed border-stone-400 bg-stone-50 flex items-center justify-center text-[9px] text-stone-400 font-medium">
                                    0/8
                                  </div>
                                  <div className="w-10 h-10 rounded-full border border-dashed border-stone-400 bg-stone-50 flex items-center justify-center text-[9px] text-stone-400 font-medium">
                                    0/8
                                  </div>
                                </div>
                              </div>
                            )}

                            {tmpl.type === "long" && (
                              <div className="w-full space-y-3 flex flex-col items-center">
                                <div className="px-3 py-1 bg-stone-700 text-[9px] font-medium text-white rounded">
                                  Bàn Danh Dự
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <div className="w-4 h-16 bg-stone-100 border border-stone-300/80 rounded" />
                                  <div className="w-4 h-16 bg-stone-100 border border-stone-300/80 rounded" />
                                  <div className="w-4 h-16 bg-stone-100 border border-stone-300/80 rounded" />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-xs sm:text-sm text-[#231F1C] truncate">
                                {tmpl.title}
                              </p>
                              <p className="text-[11px] text-stone-400 mt-0.5">
                                {tmpl.subtitle}
                              </p>
                            </div>

                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-2.5 py-1.5 px-3 rounded-full bg-[#4F46E5] text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs"
                              >
                                <Plus className="w-3 h-3" />
                                Chọn sơ đồ này
                              </motion.div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(stage === "empty_chart" || stage === "seating" || stage === "summary") && (
                  <motion.div
                    key="chart-workspace"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-[450px] flex flex-col justify-between items-center"
                  >
                    <div
                      className={`relative w-full flex flex-col justify-between items-center flex-1 transition-all duration-300 ${
                        stage === "summary" ? "opacity-25 blur-[0.4px]" : "opacity-100"
                      }`}
                    >
                      <div className="relative flex flex-col items-center pt-2">
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                          {HEAD_SEATS.map((seat, idx) => {
                            const isSeated = stage === "seating" || stage === "summary";
                            return (
                              <div
                                key={seat.id}
                                className="relative w-8 h-8 rounded-full flex items-center justify-center"
                              >
                                {!isSeated ? (
                                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-stone-300 bg-white/80" />
                                ) : (
                                  <motion.div
                                    initial={{ scale: 0, y: -24, rotate: -200, opacity: 0 }}
                                    animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 260,
                                      damping: 18,
                                      delay: 0.05 + idx * 0.035,
                                    }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-sm relative ${seat.color}`}
                                  >
                                    {seat.name}
                                    {seat.heart && (
                                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500 absolute -top-1.5 -right-1" />
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="w-[360px] sm:w-[400px] h-10 rounded-xl bg-stone-50 border border-stone-200/90 flex items-center justify-between px-5 text-sm font-semibold text-stone-700 shadow-2xs">
                          <span>Bàn Danh Dự</span>
                          <span className="text-stone-400 font-normal">
                            {stage === "empty_chart" ? "0/8" : "8/8"}
                          </span>
                        </div>
                      </div>

                      <div className="w-full flex items-center justify-between px-2 sm:px-6 py-4">
                        
                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-stone-50/90 border border-stone-200/90 flex flex-col items-center justify-center text-center shadow-2xs z-10">
                            <p className="text-xs sm:text-sm font-semibold text-[#231F1C]">Gia đình</p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              {stage === "empty_chart" ? "0/8" : "8/8"}
                            </p>
                          </div>

                          {SEAT_POSITIONS.map((pos, idx) => {
                            const seat = FAMILY_SEATS[idx];
                            const isSeated = stage === "seating" || stage === "summary";
                            return (
                              <div
                                key={seat.id}
                                className="absolute"
                                style={{
                                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                                }}
                              >
                                {!isSeated ? (
                                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-stone-300 bg-white/80" />
                                ) : (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -240, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 260,
                                      damping: 18,
                                      delay: 0.25 + idx * 0.035,
                                    }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-sm ${seat.color}`}
                                  >
                                    {seat.name}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-stone-50/90 border border-stone-200/90 flex flex-col items-center justify-center text-center shadow-2xs z-10">
                            <p className="text-xs sm:text-sm font-semibold text-[#231F1C]">Bạn thân</p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              {stage === "empty_chart" ? "0/8" : "8/8"}
                            </p>
                          </div>

                          {SEAT_POSITIONS.map((pos, idx) => {
                            const seat = BEST_FRIENDS_SEATS[idx];
                            const isSeated = stage === "seating" || stage === "summary";
                            return (
                              <div
                                key={seat.id}
                                className="absolute"
                                style={{
                                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                                }}
                              >
                                {!isSeated ? (
                                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-stone-300 bg-white/80" />
                                ) : (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -240, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 260,
                                      damping: 18,
                                      delay: 0.45 + idx * 0.035,
                                    }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-sm ${seat.color}`}
                                  >
                                    {seat.name}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-stone-50/90 border border-stone-200/90 flex flex-col items-center justify-center text-center shadow-2xs z-10">
                            <p className="text-xs sm:text-sm font-semibold text-[#231F1C]">Họ hàng</p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              {stage === "empty_chart" ? "0/8" : "8/8"}
                            </p>
                          </div>

                          {SEAT_POSITIONS.map((pos, idx) => {
                            const seat = COUSINS_SEATS[idx];
                            const isSeated = stage === "seating" || stage === "summary";
                            return (
                              <div
                                key={seat.id}
                                className="absolute"
                                style={{
                                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                                }}
                              >
                                {!isSeated ? (
                                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-stone-300 bg-white/80" />
                                ) : (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -240, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 260,
                                      damping: 18,
                                      delay: 0.65 + idx * 0.035,
                                    }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-sm ${seat.color}`}
                                  >
                                    {seat.name}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    </div>

                    <AnimatePresence>
                      {stage === "summary" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.88, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] bg-white rounded-2xl border border-stone-200/90 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.22)] p-5 space-y-3.5 z-30"
                        >
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Utensils className="w-4 h-4 text-stone-500" />
                              <span className="text-sm font-semibold text-[#231F1C]">
                                Khẩu Phần Bàn Tiệc
                              </span>
                            </div>
                            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              Đã chốt
                            </span>
                          </div>
                          <div className="space-y-2.5 text-xs sm:text-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                <span className="text-stone-600">Bò Úc sốt vang</span>
                              </div>
                              <span className="font-semibold text-[#231F1C]">14</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <span className="text-stone-600">Cá hồi Na Uy</span>
                              </div>
                              <span className="font-semibold text-[#231F1C]">10</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                <span className="text-stone-600">Món chay cao cấp</span>
                              </div>
                              <span className="font-semibold text-[#231F1C]">8</span>
                            </div>
                          </div>
                          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                            <span>Tổng cộng</span>
                            <span className="font-bold text-[#231F1C] text-sm">32 suất</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-4 z-20">
                      {stage === "summary" ? (
                        <motion.button
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="button"
                          className="h-11 px-7 rounded-full bg-[#231F1C] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Xuất sơ đồ cho nhà hàng
                        </motion.button>
                      ) : (
                        <motion.button
                          animate={{ scale: buttonPressed ? 0.93 : 1 }}
                          transition={{ duration: 0.15 }}
                          type="button"
                          className="h-11 px-7 rounded-full bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          Xếp chỗ tự động
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
