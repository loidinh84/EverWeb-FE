import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Star } from "lucide-react";
import {
  AI_SCENARIOS,
  BUDGET_ALLOCATION,
  BUDGET_PRESETS,
  GUEST_TABLES,
  VENDOR_SHOWCASE,
} from "../data/landingData";

const EASE = [0.22, 1, 0.36, 1];

export function GuestSeatingPreview() {
  const [selectedId, setSelectedId] = useState(GUEST_TABLES[0].id);
  const activeTable = GUEST_TABLES.find((t) => t.id === selectedId) ?? GUEST_TABLES[0];

  const totalConfirmed = GUEST_TABLES.reduce((sum, t) => sum + t.confirmed, 0);
  const totalCapacity = GUEST_TABLES.reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div className="rounded-2xl border border-rose-200/80 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-4">
        <span className="text-xs font-semibold text-[#23111B]">Sơ đồ cụm bàn tiệc</span>
        <span className="font-mono-num text-xs font-medium text-[#BE185D]">
          {totalConfirmed} / {totalCapacity} ghế đã xác nhận
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GUEST_TABLES.map((table) => {
          const isSelected = table.id === activeTable.id;
          return (
            <button
              key={table.id}
              type="button"
              onClick={() => setSelectedId(table.id)}
              className={`flex cursor-pointer flex-col items-center rounded-xl border p-3.5 text-center transition-colors duration-150 ${
                isSelected
                  ? "border-[#BE185D] bg-[#FFF0F6]"
                  : "border-rose-100 bg-[#FFF9FB] hover:border-rose-300"
              }`}
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-rose-300/70 bg-white">
                <span className="font-mono-num text-xs font-medium text-[#23111B]">
                  {table.confirmed}/{table.capacity}
                </span>
              </div>
              <span className="mt-2.5 text-xs font-semibold text-[#23111B]">{table.id}</span>
              <span className="mt-0.5 line-clamp-1 text-[11px] text-[#6E4758]">{table.group}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#FDF2F6] px-4 py-3 text-xs">
        <div>
          <span className="font-semibold text-[#23111B]">
            {activeTable.id} · {activeTable.group}
          </span>
          <p className="mt-0.5 text-[#6E4758]">{activeTable.note}</p>
        </div>
        <span className="font-mono-num rounded-md bg-white px-2.5 py-1 font-medium text-[#BE185D]">
          {activeTable.capacity - activeTable.confirmed === 0
            ? "Đã đủ chỗ"
            : `Còn ${activeTable.capacity - activeTable.confirmed} ghế`}
        </span>
      </div>
    </div>
  );
}

export function BudgetRingPreview() {
  const [totalBudget, setTotalBudget] = useState(BUDGET_PRESETS[1]);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const segments = BUDGET_ALLOCATION.reduce((acc, item) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].endOffset : 0;
    const length = (item.pct / 100) * circumference;
    acc.push({
      ...item,
      length,
      offset: prevOffset,
      endOffset: prevOffset + length,
    });
    return acc;
  }, []);

  return (
    <div className="rounded-2xl border border-rose-200/80 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <span className="text-xs font-semibold text-[#23111B]">Dự toán theo ngân sách</span>
        <div className="flex gap-1.5">
          {BUDGET_PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setTotalBudget(amount)}
              className={`font-mono-num cursor-pointer rounded-md px-2.5 py-1 text-xs transition-colors duration-150 ${
                totalBudget === amount
                  ? "bg-[#23111B] font-semibold text-[#FCE7F3]"
                  : "bg-[#FDF2F6] text-[#6E4758] hover:bg-rose-100"
              }`}
            >
              {amount}tr
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid items-center gap-6 sm:grid-cols-12">
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center sm:col-span-5">
          <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke="#FCE7F0"
              strokeWidth="14"
            />
            {segments.map((seg, idx) => (
              <motion.circle
                key={seg.label}
                cx="66"
                cy="66"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDashoffset={-seg.offset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                whileInView={{ strokeDasharray: `${seg.length} ${circumference - seg.length}` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, delay: idx * 0.08, ease: EASE }}
              />
            ))}
          </svg>
          <div className="absolute text-center">
            <p className="font-mono-num text-xl font-medium text-[#23111B]">{totalBudget}tr</p>
            <p className="text-[11px] text-[#8F6577]">Tổng dự chi</p>
          </div>
        </div>

        <div className="space-y-3 sm:col-span-7">
          {BUDGET_ALLOCATION.map((item) => {
            const value = Math.round((totalBudget * item.pct) / 100);
            return (
              <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#23111B]">{item.label}</span>
                </div>
                <div className="font-mono-num flex items-center gap-2.5">
                  <span className="text-[#8F6577]">{item.pct}%</span>
                  <span className="w-16 text-right font-medium text-[#23111B]">{value} triệu</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function VendorLookbookPreview() {
  const [savedIds, setSavedIds] = useState(["ivory-florals"]);

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {VENDOR_SHOWCASE.map((vendor) => {
        const isSaved = savedIds.includes(vendor.id);
        return (
          <div
            key={vendor.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-pink-400/20 bg-[#0F0C0E] text-[#FCE7F3]"
          >
            <div className="relative h-36 overflow-hidden">
              <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label={`Lưu ${vendor.name}`}
                onClick={() => toggleSave(vendor.id)}
                className={`absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-colors duration-150 ${
                  isSaved ? "bg-[#EC4899] text-[#0D0A0C]" : "bg-black/60 text-white hover:bg-black/80"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#F472B6]">
                <span>{vendor.category}</span>
                <span className="font-mono-num flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#F472B6] text-[#F472B6]" />
                  {vendor.rating}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-white">{vendor.name}</p>
              <p className="mt-1 flex-1 text-xs text-[#C4A7B7]">{vendor.style}</p>
              <p className="font-mono-num mt-3 border-t border-pink-400/15 pt-2.5 text-xs font-medium text-[#FCE7F3]">
                {vendor.price}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AiConciergePreview() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = AI_SCENARIOS[activeIdx];

  return (
    <div className="rounded-2xl border border-pink-400/25 bg-[#0F0C0E] p-5 text-[#FCE7F3] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-400/15 pb-4">
        <span className="text-xs font-semibold text-[#F472B6]">EverWeb AI Concierge</span>
        <span className="font-mono-num text-[11px] text-[#C4A7B7]">Hồ sơ 180 khách · 250tr</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {AI_SCENARIOS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors duration-150 ${
              activeIdx === idx
                ? "border-[#EC4899] bg-[#EC4899] font-semibold text-[#0D0A0C]"
                : "border-pink-400/20 bg-[#1B1318] text-[#FCE7F3] hover:bg-[#281B23]"
            }`}
          >
            {item.prompt}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="mt-5 space-y-3"
        >
          <div className="ml-auto max-w-md rounded-2xl rounded-br-sm bg-[#24161F] px-4 py-3 text-sm text-[#FCE7F3]">
            <p className="mb-1 text-[11px] text-[#C4A7B7]">Cô dâu & Chú rể</p>
            <p>{current.question}</p>
          </div>
          <div className="mr-auto max-w-xl rounded-2xl rounded-bl-sm border border-pink-400/25 bg-[#171115] px-4 py-3.5 text-sm leading-relaxed text-[#FCE7F3]">
            <p className="mb-1 text-[11px] font-semibold text-[#F472B6]">Trợ lý EverWeb AI</p>
            <p>{current.answer}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
