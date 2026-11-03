"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { MEGA_TENSIONS, RANDOM_TENSIONS } from "@/data/jokes";
import { burstFromEvent } from "@/lib/burst";
import { pick } from "@/lib/random";
import { sfx } from "@/lib/sound";

/** Slot-machine style text shuffle that lands on one tension. */
export function RandomTensionCard() {
  const [text, setText] = useState(RANDOM_TENSIONS[5].text);
  const [mega, setMega] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const roll = (bigger: boolean) => {
    if (rolling) return;
    setRolling(true);
    setMega(bigger);
    const pool = bigger ? MEGA_TENSIONS : RANDOM_TENSIONS.map((t) => t.text);
    let ticks = 0;
    timer.current = setInterval(() => {
      ticks++;
      setText(pick(pool));
      sfx.tick();
      if (ticks > 10) {
        clearInterval(timer.current!);
        let final = pick(pool);
        while (final === text && pool.length > 1) final = pick(pool);
        setText(final);
        setRolling(false);
        setCount((c) => c + 1);
        if (bigger) sfx.siren(1);
        else sfx.pop();
      }
    }, 70);
  };

  return (
    <section id="random" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-28 sm:px-6">
      <div className="relative">
        <motion.div
          className={`relative overflow-hidden rounded-[28px] border-[3px] border-ink p-6 text-ink shadow-[8px_8px_0_#000] sm:p-10 ${
            mega ? "bg-red" : "bg-cream"
          }`}
          animate={mega && !rolling ? { rotate: [0, -1, 1, -1, 0] } : { rotate: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Ticket perforation */}
          <div className="absolute inset-y-0 left-[66%] hidden border-l-[3px] border-dashed border-ink/30 lg:block" aria-hidden />
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="font-display text-[clamp(1.6rem,4.4vw,3rem)] leading-[1.2] font-black">
                আপনার tension কম? একটু বাড়িয়ে দিই? 🌚
              </h2>
              <div className="mt-8 min-h-[7.5rem] sm:min-h-[6rem]" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={text}
                    initial={{ y: rolling ? -20 : 30, opacity: 0, filter: rolling ? "blur(4px)" : "blur(0px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: rolling ? 0.06 : 0.35 }}
                    className={`font-bangla text-[clamp(1.4rem,3.6vw,2.4rem)] leading-snug font-bold ${rolling ? "opacity-60" : ""}`}
                  >
                    “{text}”
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">
                Tension no. {String(count).padStart(3, "0")}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="btn btn-orange"
                  disabled={rolling}
                  onClick={(e) => {
                    burstFromEvent(e, ["🌚", "😬", "💀"]);
                    roll(false);
                  }}
                >
                  নতুন Tension দেন!
                </button>
                <button
                  type="button"
                  className="btn bg-ink text-text"
                  disabled={rolling}
                  onClick={(e) => {
                    burstFromEvent(e, ["🚨", "🔥", "💀"]);
                    roll(true);
                  }}
                >
                  আরো বড় Tension দেন!
                </button>
                <Link href="/tools/roulette" className="text-center font-bangla text-sm font-bold underline underline-offset-4">
                  Full Roulette wheel ঘুরাবেন? →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
