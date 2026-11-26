export default function CornerArtwork({ artId, color, opacity, flip = false }) {
  if (artId === "none") return null;
  return (
    <svg
      viewBox="0 0 140 140"
      className={`pointer-events-none sticky top-0 h-28 w-28 ${
        flip ? "float-right -mr-6 scale-x-[-1]" : "float-left -ml-6"
      }`}
      style={{ opacity: opacity / 100 }}
      fill="none"
    >
      {artId === "lace" && (
        <>
          <path
            d="M0 0 C50 10, 90 50, 120 0 M0 0 C10 50, 50 90, 0 120 M15 15 C45 35, 65 55, 95 25"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle cx="32" cy="32" r="14" stroke={color} strokeWidth="1.2" />
        </>
      )}
      {artId === "botanical" && (
        <>
          <path d="M5 5 Q55 15 95 65" stroke={color} strokeWidth="1.4" />
          <path
            d="M25 14 C35 2, 48 6, 42 20 M50 30 C65 18, 76 26, 66 40 M72 48 C88 40, 96 52, 82 62"
            stroke={color}
            strokeWidth="1.2"
          />
        </>
      )}
      {artId === "deco" && (
        <>
          <path d="M8 8 H115 M8 8 V115" stroke={color} strokeWidth="1.6" />
          <path d="M20 20 H80 V36 H36 V80 H20 Z" stroke={color} strokeWidth="1.1" />
        </>
      )}
      {artId === "minimal" && (
        <path d="M12 12 H90 M12 12 V90" stroke={color} strokeWidth="1.2" />
      )}
    </svg>
  );
}
