import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[#C5A059]"
    />
  );
}

export function Reveal({ children, className = "", delay = 0, y = 20 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function EditorialMarquee({ items }) {
  return (
    <div className="overflow-hidden border-y border-[#EAE3DB] bg-[#F7F3EE] py-3">
      <div className="animate-everweb-marquee items-center">
        {[0, 1].map((dup) => (
          <div
            key={dup}
            aria-hidden={dup === 1 ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((text) => (
              <span
                key={`${dup}-${text}`}
                className="flex items-center gap-8 px-6 text-xs font-medium tracking-[0.16em] text-[#786B60] uppercase"
              >
                <span>{text}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StackingFolioCard({ index, total, children, className = "" }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"],
  });

  const targetScale = 1 - (total - 1 - index) * 0.025;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={cardRef} className="pb-6 lg:pb-10">
      <motion.div
        style={{
          scale,
          top: `${72 + index * 14}px`,
        }}
        className={`lg:sticky origin-top will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
