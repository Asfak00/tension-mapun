import type { Mood } from "@/types";

const INK = "#14111B";
type P = { className?: string };

export function BillSticker({ className }: P) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden>
      <rect x="6" y="8" width="108" height="74" rx="6" fill="#7CF2B0" stroke={INK} strokeWidth="5" transform="rotate(-6 60 45)" />
      <circle cx="60" cy="45" r="18" fill="none" stroke={INK} strokeWidth="4" transform="rotate(-6 60 45)" />
      <text x="60" y="54" textAnchor="middle" fontSize="26" fontWeight="900" fill={INK} transform="rotate(-6 60 45)">৳</text>
    </svg>
  );
}

export function BrokenHeartSticker({ className }: P) {
  return (
    <svg viewBox="0 0 110 100" className={className} aria-hidden>
      <path d="M52 92 L 12 50 C -4 30, 14 2, 38 10 C 46 13, 50 18, 52 24 L 44 44 L 58 54 Z" fill="#FF70B8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M60 92 L 100 50 C 116 30, 98 2, 74 10 C 66 13, 62 18, 60 24 L 52 42 L 66 54 Z" fill="#FF70B8" stroke={INK} strokeWidth="5" strokeLinejoin="round" transform="translate(6 4) rotate(8 60 60)" />
    </svg>
  );
}

export function LaptopSticker({ className }: P) {
  return (
    <svg viewBox="0 0 130 100" className={className} aria-hidden>
      <rect x="18" y="8" width="94" height="62" rx="6" fill="#211C2B" stroke={INK} strokeWidth="5" />
      <rect x="26" y="16" width="78" height="46" fill="#FF3B3B" />
      <text x="65" y="50" textAnchor="middle" fontSize="30" fontWeight="900" fill="#fff">!</text>
      <path d="M4 78 L 126 78 L 116 92 L 14 92 Z" fill="#B78AFF" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

export function WarningSticker({ className }: P) {
  return (
    <svg viewBox="0 0 110 100" className={className} aria-hidden>
      <path d="M55 6 L 104 92 L 6 92 Z" fill="#E8FF65" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <rect x="50" y="34" width="10" height="32" rx="4" fill={INK} />
      <circle cx="55" cy="78" r="6" fill={INK} />
    </svg>
  );
}

export function ClockSticker({ className }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="54" r="40" fill="#FFF4E0" stroke={INK} strokeWidth="6" />
      <path d="M50 54 L 50 28 M50 54 L 70 64" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M18 18 L 30 8 M82 18 L 70 8" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function TabsSticker({ className }: P) {
  return (
    <svg viewBox="0 0 150 70" className={className} aria-hidden>
      <rect x="4" y="16" width="142" height="48" rx="10" fill="#FFF4E0" stroke={INK} strokeWidth="5" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${12 + i * 30} 18 L ${16 + i * 30} 4 L ${38 + i * 30} 4 L ${42 + i * 30} 18`} fill={i === 3 ? "#FF793D" : "#B78AFF"} stroke={INK} strokeWidth="4" />
      ))}
      <text x="75" y="50" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily="var(--font-unbounded)">47 TABS</text>
    </svg>
  );
}

/** Tiny reactive face used on category cards. */
export function MiniFace({ mood, color, className }: { mood: Mood; color: string; className?: string }) {
  const mouth: Record<Mood, React.ReactNode> = {
    chill: <path d="M18 34 Q 26 40 34 34" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />,
    worried: <path d="M17 37 q 4 -4 9 0 t 9 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />,
    panic: <ellipse cx="26" cy="37" rx="5" ry="6" fill={INK} />,
    meltdown: <rect x="18" y="32" width="16" height="10" rx="4" fill={INK} />,
    dead: <path d="M18 37 L 34 37" stroke={INK} strokeWidth="3" strokeLinecap="round" />,
  };
  const eyes =
    mood === "dead" ? (
      <path d="M14 20 l6 6 m0 -6 l-6 6 M32 20 l6 6 m0 -6 l-6 6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    ) : (
      <g>
        <circle cx="18" cy="23" r={mood === "panic" || mood === "meltdown" ? 6 : 4.5} fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx="34" cy="23" r={mood === "panic" || mood === "meltdown" ? 6 : 4.5} fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx="18" cy="23" r={mood === "chill" ? 2.4 : 1.5} fill={INK} />
        <circle cx="34" cy="23" r={mood === "chill" ? 2.4 : 1.5} fill={INK} />
      </g>
    );
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden>
      <circle cx="26" cy="27" r="22" fill={color} stroke={INK} strokeWidth="3.5" />
      {eyes}
      {mouth[mood]}
      {(mood === "panic" || mood === "meltdown") && <path d="M44 10 c -3 5 -3 8 0 9 c 3 -1 3 -4 0 -9 z" fill="#7FD8FF" stroke={INK} strokeWidth="2" />}
    </svg>
  );
}
