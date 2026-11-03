"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { BillSticker, BrokenHeartSticker, ClockSticker, LaptopSticker, TabsSticker, WarningSticker } from "@/components/characters/Stickers";
import { burst } from "@/lib/burst";
import { sfx } from "@/lib/sound";
import type { Mood } from "@/types";

const MOODS: Mood[] = ["panic", "meltdown", "dead", "worried", "chill"];
const POKES = [
  "আমাকে খোঁচাবেন না, আমি already tense!",
  "আরেকবার click করলে brain পুরা গলে যাবে!",
  "RIP. আমার শেষ ইচ্ছা: Salary।",
  "আচ্ছা, একটু শান্ত হলাম। একটু।",
  "এখন chill. ১০ সেকেন্ডের জন্য।",
];

const FLOATERS = [
  { C: BillSticker, cls: "left-[2%] top-[18%] w-20 sm:w-24", d: 0 },
  { C: BrokenHeartSticker, cls: "right-[4%] top-[8%] w-16 sm:w-20", d: 0.6 },
  { C: LaptopSticker, cls: "left-[0%] bottom-[18%] w-20 sm:w-28", d: 1.1 },
  { C: WarningSticker, cls: "right-[0%] bottom-[30%] w-16 sm:w-20", d: 0.3 },
  { C: ClockSticker, cls: "left-[22%] top-[2%] w-12 sm:w-16", d: 0.9 },
  { C: TabsSticker, cls: "right-[12%] bottom-[6%] w-28 sm:w-36", d: 1.4 },
];

const THOUGHTS = [
  { text: "Boss: একটু আসেন", cls: "left-[-2%] top-[40%] -rotate-6" },
  { text: "Seen 2:14 AM", cls: "right-[-2%] top-[30%] rotate-6" },
  { text: "বিকাশ: ৳৩৭", cls: "left-[30%] top-[-2%] rotate-3" },
];

export function HeroCharacter() {
  const [poke, setPoke] = useState(-1);
  const mood: Mood = poke < 0 ? "panic" : MOODS[poke % MOODS.length];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Backing blob */}
      <svg viewBox="0 0 200 200" className="absolute inset-[6%] -z-0" aria-hidden>
        <path
          d="M45 30 C 80 0, 150 10, 175 50 C 200 95, 185 160, 135 182 C 85 200, 25 175, 12 125 C 0 80, 15 50, 45 30 Z"
          fill="#2C2539"
          stroke="#3A3149"
          strokeWidth="2"
        />
      </svg>

      {FLOATERS.map(({ C, cls, d }, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute z-20 ${cls}`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
          transition={{
            opacity: { delay: 0.4 + d * 0.3 },
            scale: { delay: 0.4 + d * 0.3, type: "spring" },
            y: { duration: 3 + d, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4 + d, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <C className="h-auto w-full drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]" />
        </motion.div>
      ))}

      {THOUGHTS.map((t, i) => (
        <motion.span
          key={t.text}
          className={`absolute z-20 hidden rounded-2xl border-[3px] border-ink bg-cream px-3 py-1.5 font-bangla text-sm font-bold text-ink shadow-[3px_3px_0_#000] sm:block ${t.cls}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{ opacity: { delay: 1 + i * 0.4 }, y: { duration: 2.6, repeat: Infinity, delay: i * 0.5 } }}
        >
          {t.text}
        </motion.span>
      ))}

      <button
        type="button"
        className="absolute inset-[10%] z-10 cursor-pointer"
        aria-label="Character-কে খোঁচা দিন"
        onClick={(e) => {
          setPoke((p) => p + 1);
          burst(e.clientX, e.clientY, ["💢", "😵", "🔥", "💦"], 6);
          sfx.dhishum();
        }}
      >
        <TensionGuy mood={mood} className="h-full w-full" />
      </button>

      <AnimatePresence mode="wait">
        {poke >= 0 && (
          <motion.p
            key={poke}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-[-2%] left-1/2 z-30 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-text px-4 py-2 text-center font-bangla text-sm font-bold text-ink"
            role="status"
          >
            {POKES[poke % POKES.length]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
