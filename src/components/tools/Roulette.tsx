"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Copy } from "lucide-react";
import { useRef, useState } from "react";
import { MEGA_TENSIONS, RANDOM_TENSIONS, WHEEL_TAGS } from "@/data/jokes";
import { burst } from "@/lib/burst";
import { pick } from "@/lib/random";
import { copyText } from "@/lib/share";
import { sfx } from "@/lib/sound";

const SEGMENT = 360 / WHEEL_TAGS.length;
const COLORS = ["#FF793D", "#B78AFF", "#E8FF65", "#FF70B8", "#7CF2B0", "#5CE1E6", "#FFB547", "#F9F5FF"];
const SPIN_MS = 4200;

function segmentPath(i: number, r = 190, c = 200) {
  const a0 = ((i * SEGMENT - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * SEGMENT - 90) * Math.PI) / 180;
  return `M${c} ${c} L${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} Z`;
}

interface Spin {
  text: string;
  tag: string;
  mega: boolean;
}

export function Roulette() {
  const reduce = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [mega, setMega] = useState(false);
  const [current, setCurrent] = useState<Spin | null>(null);
  const [history, setHistory] = useState<Spin[]>([]);
  const [copied, setCopied] = useState(false);
  const pending = useRef<Spin | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = (bigger: boolean) => {
    if (spinning) return;
    const pickNormal = () => pick(RANDOM_TENSIONS.filter((t) => t.text !== current?.text));
    const choice: Spin = bigger
      ? { text: pick(MEGA_TENSIONS.filter((t) => t !== current?.text)), tag: pick(WHEEL_TAGS), mega: true }
      : { ...pickNormal(), mega: false };
    const index = WHEEL_TAGS.indexOf(choice.tag as (typeof WHEEL_TAGS)[number]);
    const center = index * SEGMENT + SEGMENT / 2;
    const jitter = (Math.random() - 0.5) * (SEGMENT * 0.6);
    const base = rotation - (rotation % 360);
    const target = base + 360 * (bigger ? 9 : 6) + (360 - center) + jitter;

    pending.current = choice;
    setMega(bigger);
    setCurrent(null);
    setSpinning(true);
    setRotation(target);
    if (bigger) sfx.siren(3);
    // Ticks spread out as the wheel slows.
    if (!reduce) for (let k = 1; k <= 26; k++) setTimeout(() => sfx.tick(), SPIN_MS * Math.pow(k / 26, 2.2));
  };

  const land = () => {
    const result = pending.current;
    if (!result) return;
    pending.current = null;
    setSpinning(false);
    setCurrent(result);
    setHistory((h) => [result, ...h].slice(0, 6));
    if (result.mega) sfx.drama();
    else sfx.thud();
    const box = wheelRef.current?.getBoundingClientRect();
    if (box) burst(box.left + box.width / 2, box.top + 30, result.mega ? ["🚨", "💀", "🔥"] : ["🌚", "😬", "😂"], 12);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <header className="max-w-3xl">
        <span className="sticker bg-acid">Random Tension Generator</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.15] font-black">
          আপনার tension কম? <span className="text-orange">একটু বাড়িয়ে দিই?</span> 🌚
        </h1>
        <p className="mt-3 font-bangla text-lg text-text/80">চাকা ঘুরান। যেখানে থামবে, সেই tension আজকে আপনার। Return policy নেই।</p>
      </header>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div ref={wheelRef} className="relative mx-auto w-full max-w-[460px]">
          {/* Pointer */}
          <svg viewBox="0 0 60 70" className="absolute top-[-14px] left-1/2 z-10 w-12 -translate-x-1/2 drop-shadow-[3px_3px_0_#000]" aria-hidden>
            <path d="M30 66 L 6 14 C 4 4, 56 4, 54 14 Z" fill={mega ? "#FF3B3B" : "#E8FF65"} stroke="#14111B" strokeWidth="5" strokeLinejoin="round" />
          </svg>
          <motion.svg
            viewBox="0 0 400 400"
            className="w-full"
            animate={{ rotate: rotation }}
            transition={{ duration: reduce ? 0 : SPIN_MS / 1000, ease: [0.15, 0.7, 0.2, 1] }}
            onAnimationComplete={land}
            role="img"
            aria-label="Tension roulette wheel"
          >
            <circle cx="200" cy="200" r="198" fill="#14111B" />
            {WHEEL_TAGS.map((tag, i) => {
              const mid = i * SEGMENT + SEGMENT / 2;
              return (
                <g key={tag}>
                  <path d={segmentPath(i)} fill={mega ? (i % 2 ? "#FF3B3B" : "#2C2539") : COLORS[i]} stroke="#14111B" strokeWidth="5" />
                  <text
                    x="200"
                    y="64"
                    transform={`rotate(${mid} 200 200)`}
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="800"
                    fill={mega && i % 2 === 0 ? "#F9F5FF" : "#14111B"}
                    style={{ fontFamily: "var(--font-unbounded), var(--font-hind)" }}
                  >
                    {tag}
                  </text>
                </g>
              );
            })}
            <circle cx="200" cy="200" r="42" fill="#FFF4E0" stroke="#14111B" strokeWidth="6" />
            <text x="200" y="210" textAnchor="middle" fontSize="28" aria-hidden>
              {mega ? "💀" : "🌚"}
            </text>
          </motion.svg>
        </div>

        <div>
          <div className="min-h-56 rounded-[28px] border-[3px] border-ink bg-cream p-6 text-ink shadow-[8px_8px_0_#000] sm:p-8" aria-live="polite">
            <AnimatePresence mode="wait">
              {spinning ? (
                <motion.p key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bangla text-2xl font-bold">
                  ঘুরতেছে... আপনার ভাগ্যও।
                </motion.p>
              ) : current ? (
                <motion.div key={current.text} initial={{ scale: 0.8, opacity: 0, rotate: -3 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}>
                  <span className={`sticker ${current.mega ? "bg-red text-text" : "bg-orange"}`}>{current.mega ? "MEGA TENSION" : current.tag}</span>
                  <p className="mt-4 font-bangla text-[clamp(1.4rem,3.4vw,2.2rem)] leading-snug font-bold">“{current.text}”</p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-2 font-bangla text-sm font-bold underline underline-offset-4"
                    onClick={async () => {
                      setCopied(await copyText(`Tension Mapun আমাকে নতুন tension দিয়েছে: "${current.text}" 🌚 ${window.location.origin}/tools/roulette`));
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    <Copy className="size-4" /> {copied ? "Copy হয়েছে! বন্ধুকে tension দেন।" : "এই tension বন্ধুকে পাঠান"}
                  </button>
                </motion.div>
              ) : (
                <motion.p key="idle" className="font-bangla text-2xl font-bold">
                  এখনো কোনো নতুন tension নেই। এটা আমাদের জন্য tension-এর।
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" className="btn btn-orange" onClick={() => spin(false)} disabled={spinning}>
              নতুন Tension দেন!
            </button>
            <button type="button" className="btn bg-red text-text" onClick={() => spin(true)} disabled={spinning}>
              আরো বড় Tension দেন! 🚨
            </button>
          </div>

          {history.length > 1 && (
            <div className="mt-8">
              <p className="font-display text-xs font-bold tracking-widest text-muted uppercase">আজকে জমা হওয়া tension</p>
              <ul className="mt-3 space-y-2 font-bangla text-[15px] text-text/75">
                {history.slice(1).map((h) => (
                  <li key={h.text} className="border-l-4 border-line pl-3">
                    {h.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
