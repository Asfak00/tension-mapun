"use client";

import { motion } from "motion/react";
import type { Mood } from "@/types";

const INK = "#14111B";
const SKIN = "#FFC59A";
const SKIN_SHADE = "#F2A877";
const BRAIN = "#FF8FC8";

const MOOD_HEAT: Record<Mood, number> = { chill: 0, worried: 0.3, panic: 0.55, meltdown: 0.8, dead: 1 };

interface Props {
  mood?: Mood;
  /** 0..1 — drives brain melt, smoke and fire. Defaults from mood. */
  heat?: number;
  className?: string;
  /** Turn off idle loops (e.g. inside share images). */
  still?: boolean;
}

/** Original cartoon of a man losing a fight with his own thoughts. */
export function TensionGuy({ mood = "worried", heat, className = "", still = false }: Props) {
  const h = heat ?? MOOD_HEAT[mood];
  const drip = Math.max(0, (h - 0.2) / 0.8);
  const shaking = !still && (mood === "panic" || mood === "meltdown");
  const loop = (duration: number, delay = 0) =>
    still ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.svg
      viewBox="0 0 400 470"
      className={className}
      role="img"
      aria-label={`Tension-এ থাকা একজন মানুষ (${mood})`}
      animate={
        shaking
          ? { x: mood === "meltdown" ? [0, -5, 5, -3, 3, 0] : [0, -2, 2, 0] }
          : mood === "dead"
            ? { rotate: still ? -6 : [-6, -4, -6] }
            : { y: still ? 0 : [0, -6, 0] }
      }
      transition={shaking ? { duration: mood === "meltdown" ? 0.3 : 0.5, repeat: Infinity } : loop(3)}
    >
      {/* Smoke */}
      {h > 0.3 &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={`smoke-${i}`}
            cx={170 + i * 30}
            cy={60}
            r={14 + i * 3}
            fill="#8E84A3"
            initial={{ opacity: 0 }}
            animate={still ? { opacity: 0.5, cy: 40 - i * 10 } : { opacity: [0, 0.6, 0], cy: [70, 10], r: [10, 24] }}
            transition={loop(2.2, i * 0.7)}
          />
        ))}

      {/* Body */}
      <path d="M90 470 C 96 405, 140 384, 200 384 C 260 384, 304 405, 310 470 Z" fill="#B78AFF" stroke={INK} strokeWidth="6" />
      <path d="M168 386 L200 420 L232 386" fill="#FFF4E0" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <motion.path
        d="M200 412 L188 430 L196 468 L210 468 L214 430 Z"
        fill="#FF793D"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
        style={{ originX: 0.5, originY: 0 }}
        animate={{ rotate: mood === "chill" ? 0 : still ? 14 : [10, 18, 10] }}
        transition={loop(1.6)}
      />
      <rect x="176" y="350" width="48" height="44" fill={SKIN_SHADE} stroke={INK} strokeWidth="6" />

      {/* Ears */}
      <ellipse cx="90" cy="262" rx="22" ry="30" fill={SKIN} stroke={INK} strokeWidth="6" />
      <ellipse cx="310" cy="262" rx="22" ry="30" fill={SKIN} stroke={INK} strokeWidth="6" />

      {/* Head */}
      <path
        d="M200 138 C 268 138, 314 186, 314 258 C 314 330, 266 374, 200 374 C 134 374, 86 330, 86 258 C 86 186, 132 138, 200 138 Z"
        fill={SKIN}
        stroke={INK}
        strokeWidth="6"
      />

      {/* Hair: deliberately messy */}
      <motion.path
        d="M88 236 L74 176 L114 198 L106 132 L148 176 L162 104 L194 166 L222 98 L238 168 L276 118 L272 184 L318 156 L312 238 C 290 196, 250 182, 200 182 C 150 182, 108 196, 88 236 Z"
        fill="#2A1F3D"
        stroke={INK}
        strokeWidth="6"
        strokeLinejoin="round"
        style={{ originX: 0.5, originY: 0.9 }}
        animate={still ? {} : { rotate: shaking ? [-2, 2, -2] : [-1, 1, -1], scaleY: [1, 1.03, 1] }}
        transition={loop(shaking ? 0.4 : 2.4)}
      />

      {/* Brain, melting with heat */}
      <g>
        {[150, 186, 222, 252].map((x, i) => (
          <motion.rect
            key={`drip-${x}`}
            x={x}
            y={128}
            width={14}
            rx={7}
            fill={BRAIN}
            stroke={INK}
            strokeWidth="4"
            initial={{ height: 10 }}
            animate={{ height: 14 + drip * (40 + (i % 2) * 34) }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
          />
        ))}
        <path
          d="M128 118 C 116 82, 160 58, 184 74 C 194 46, 244 48, 252 76 C 282 62, 308 96, 290 120 C 306 142, 276 160, 252 150 L 150 150 C 124 160, 108 138, 128 118 Z"
          fill={BRAIN}
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M156 104 q 14 -18 28 0 M 196 92 q 10 22 30 6 M 236 108 q 18 -14 30 4 M 168 130 q 20 8 36 -4 M 222 132 q 14 8 30 -2"
          fill="none"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* Fire on the brain at high heat */}
      {h >= 0.75 &&
        [0, 1, 2].map((i) => (
          <motion.path
            key={`fire-${i}`}
            d="M0 0 C -14 -16, -8 -34, 0 -52 C 8 -34, 16 -20, 0 0 Z"
            fill={i === 1 ? "#E8FF65" : "#FF793D"}
            stroke={INK}
            strokeWidth="3"
            style={{ x: 165 + i * 36, y: 72 - (i === 1 ? 10 : 0), originY: "100%" }}
            animate={still ? {} : { scaleY: [1, 1.35, 0.9, 1.2, 1], scaleX: [1, 0.9, 1.1, 1] }}
            transition={loop(0.6, i * 0.15)}
          />
        ))}

      {/* Forehead dread lines */}
      {(mood === "panic" || mood === "meltdown" || mood === "dead") && (
        <g stroke="#7B6BFF" strokeWidth="5" strokeLinecap="round">
          <line x1="170" y1="196" x2="170" y2="218" />
          <line x1="200" y1="192" x2="200" y2="220" />
          <line x1="230" y1="196" x2="230" y2="218" />
        </g>
      )}

      <Brows mood={mood} />
      <Eyes mood={mood} still={still} />

      {/* Cheeks */}
      {mood === "chill" && (
        <g fill="#FF70B8" opacity="0.45">
          <circle cx="132" cy="300" r="14" />
          <circle cx="268" cy="300" r="14" />
        </g>
      )}

      <Mouth mood={mood} />

      {/* Sweat */}
      {mood !== "chill" &&
        [
          { x: 288, y: 206, d: 0 },
          { x: 112, y: 222, d: 0.8 },
        ].map((s) => (
          <motion.path
            key={`sweat-${s.x}`}
            d="M0 0 C -8 12, -8 22, 0 22 C 8 22, 8 12, 0 0 Z"
            fill="#7FD8FF"
            stroke={INK}
            strokeWidth="3"
            style={{ x: s.x, y: s.y }}
            animate={still ? {} : { y: [s.y, s.y + 40], opacity: [1, 1, 0] }}
            transition={loop(1.4, s.d)}
          />
        ))}

      {/* Hands on cheeks: the classic scream */}
      {(mood === "meltdown" || mood === "dead") && (
        <g fill={SKIN} stroke={INK} strokeWidth="6">
          <path d="M70 360 C 60 320, 78 290, 104 290 C 124 292, 128 320, 118 344 L 108 372 Z" />
          <path d="M330 360 C 340 320, 322 290, 296 290 C 276 292, 272 320, 282 344 L 292 372 Z" />
        </g>
      )}
    </motion.svg>
  );
}

function Brows({ mood }: { mood: Mood }) {
  const d: Record<Mood, string> = {
    chill: "M132 214 q 26 -10 50 0 M218 214 q 26 -10 50 0",
    worried: "M132 214 L 182 202 M218 202 L 268 214",
    panic: "M130 212 L 184 190 M216 190 L 270 212",
    meltdown: "M128 206 L 186 184 M214 184 L 272 206",
    dead: "M134 206 L 182 206 M218 206 L 266 206",
  };
  return <path d={d[mood]} stroke="#2A1F3D" strokeWidth="8" strokeLinecap="round" fill="none" />;
}

function Eyes({ mood, still }: { mood: Mood; still: boolean }) {
  if (mood === "dead") {
    return (
      <g stroke={INK} strokeWidth="8" strokeLinecap="round">
        <path d="M138 236 L 178 272 M178 236 L 138 272" />
        <path d="M222 236 L 262 272 M262 236 L 222 272" />
      </g>
    );
  }
  const big = mood === "panic" || mood === "meltdown";
  const rx = big ? 34 : 29;
  const ry = big ? 40 : 33;
  const pupil = mood === "chill" ? 11 : mood === "worried" ? 9 : mood === "panic" ? 5 : 4;
  const look = mood === "worried" ? { x: 0, y: -8 } : mood === "chill" ? { x: 6, y: 4 } : { x: 0, y: 0 };
  return (
    <g>
      {[158, 242].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={254} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth="6" />
          <motion.circle
            cx={cx + look.x}
            cy={254 + look.y}
            r={pupil}
            fill={INK}
            animate={
              still || mood === "chill"
                ? {}
                : { cx: [cx + look.x - 4, cx + look.x + 4, cx + look.x - 4] }
            }
            transition={still ? {} : { duration: big ? 0.25 : 1.8, repeat: Infinity }}
          />
          {mood === "chill" && (
            <path d={`M${cx - 31} 254 C ${cx - 31} 220, ${cx + 31} 220, ${cx + 31} 254 Z`} fill={SKIN} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          )}
        </g>
      ))}
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case "chill":
      return <path d="M164 318 Q 200 350 236 318" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />;
    case "worried":
      return <path d="M162 330 q 12 -12 24 0 t 24 0 t 24 0" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />;
    case "panic":
      return (
        <g>
          <ellipse cx="200" cy="330" rx="26" ry="30" fill="#3A0F24" stroke={INK} strokeWidth="6" />
          <ellipse cx="200" cy="346" rx="14" ry="8" fill="#FF5C8A" />
        </g>
      );
    case "meltdown":
      return (
        <g>
          <path d="M160 310 C 160 290, 240 290, 240 310 L 232 360 C 226 378, 174 378, 168 360 Z" fill="#3A0F24" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M168 306 L 232 306 L 230 318 L 170 318 Z" fill="#fff" />
          <ellipse cx="200" cy="358" rx="18" ry="9" fill="#FF5C8A" />
        </g>
      );
    case "dead":
      return (
        <g>
          <path d="M164 326 l 12 -8 l 12 8 l 12 -8 l 12 8 l 12 -8 l 12 8" stroke={INK} strokeWidth="6" strokeLinejoin="round" fill="none" />
          <path d="M206 328 C 206 352, 230 352, 230 330" fill="#FF5C8A" stroke={INK} strokeWidth="5" />
        </g>
      );
  }
}
