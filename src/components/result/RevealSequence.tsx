"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { SCAN_LINES } from "@/data/jokes";
import { toBn } from "@/lib/bn";
import { sfx } from "@/lib/sound";
import type { ResultReport, TensionResult } from "@/types";

type Stage = "scan" | "count" | "slam" | "title";

const SCAN_MS = 2600;
const COUNT_MS = 2300;

/** Orchestrated reveal: scan → panic + counter → slam → verdict. */
export function RevealSequence({
  result,
  report,
  onDone,
}: {
  result: TensionResult;
  report: ResultReport;
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>(reduce ? "title" : "scan");
  const [lines, setLines] = useState(0);
  const [count, setCount] = useState(reduce ? result.score : 0);
  const { score, level } = result;
  const emergency = level.id === "emergency";
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  // Scan log lines, then hand off to the counter.
  useEffect(() => {
    if (stage !== "scan") return;
    sfx.whoosh();
    const step = setInterval(() => setLines((l) => Math.min(SCAN_LINES.length, l + 1)), SCAN_MS / (SCAN_LINES.length + 1));
    const next = setTimeout(() => setStage("count"), SCAN_MS);
    return () => {
      clearInterval(step);
      clearTimeout(next);
    };
  }, [stage]);

  // Counter: fast start, dramatic slow finish.
  useEffect(() => {
    if (stage !== "count") return;
    if (score >= 61) sfx.siren(score >= 81 ? 4 : 2);
    let raf = 0;
    let last = -1;
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 4);
      const value = Math.round(eased * score);
      if (value !== last && value % 3 === 0) sfx.tick();
      last = value;
      setCount(value);
      if (t < 1) raf = requestAnimationFrame(frame);
      else {
        if (score === 100) sfx.clang();
        if (score >= 61) sfx.drama();
        else sfx.thud();
        setStage("slam");
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [stage, score]);

  useEffect(() => {
    if (stage !== "slam") return;
    const id = setTimeout(() => setStage("title"), 700);
    return () => clearTimeout(id);
  }, [stage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && done.current();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  const revealed = stage === "slam" || stage === "title";
  const panicMood = count < score * 0.5 ? "panic" : count < score * 0.85 ? "meltdown" : level.mood;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Tension result reveal"
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden px-4 text-center"
      initial={{ backgroundColor: "rgba(10,8,14,0)" }}
      animate={{ backgroundColor: revealed ? level.color : "rgba(10,8,14,0.98)" }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: revealed ? 0.25 : 0.5 }}
    >
      {/* Warning lights */}
      {emergency && stage !== "scan" && (
        <>
          <motion.div
            className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-red blur-3xl"
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.div
            className="pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-red blur-3xl"
            animate={{ opacity: [0.7, 0.1, 0.7] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => done.current()}
        className="absolute top-4 right-4 z-10 rounded-full border-2 border-current px-4 py-2 font-bangla text-sm font-bold"
        style={{ color: revealed ? "#14111B" : "#F9F5FF" }}
      >
        Skip করেন ⏭
      </button>

      <motion.div
        className={`relative flex w-full max-w-2xl flex-col items-center ${revealed ? "text-ink" : "text-text"}`}
        animate={revealed && emergency ? { x: [0, -14, 14, -10, 10, -4, 0], y: [0, 6, -6, 4, 0] } : {}}
        transition={{ duration: 0.55 }}
      >
        {stage === "scan" && (
          <>
            <div className="relative w-48 sm:w-60">
              <TensionGuy mood="worried" className="w-full opacity-30 grayscale" still />
              <motion.div
                className="absolute inset-x-[-10%] h-1.5 rounded-full bg-acid shadow-[0_0_24px_6px_rgba(232,255,101,0.6)]"
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-6 font-display text-[clamp(1.2rem,4vw,1.9rem)] leading-snug font-black">আপনার জীবনের হিসাব করা হচ্ছে...</p>
            <ul className="mt-4 h-32 space-y-1 font-mono text-left text-[13px] text-acid sm:text-sm">
              {SCAN_LINES.slice(0, lines).map((line) => (
                <motion.li key={line} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  &gt; {line} <span className="text-text/60">OK</span>
                </motion.li>
              ))}
            </ul>
          </>
        )}

        {stage !== "scan" && (
          <>
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 12 }}
              className="w-36 sm:w-48"
            >
              <TensionGuy mood={revealed ? level.mood : panicMood} heat={count / 100} className="w-full" />
            </motion.div>
            <motion.p
              key={revealed ? "final" : "counting"}
              initial={revealed ? { scale: 3, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="font-display text-[clamp(6rem,30vw,13rem)] leading-none font-black tabular-nums"
              aria-live="polite"
            >
              {toBn(count)}
              <span className="text-[0.3em]">/১০০</span>
            </motion.p>
            {!revealed && <p className="font-bangla text-lg font-semibold text-pink">Calculator ঘামতেছে...</p>}
          </>
        )}

        <AnimatePresence>
          {stage === "title" && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-2 flex flex-col items-center">
              <motion.span
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="rounded-lg border-[3px] border-ink bg-ink px-4 py-1 font-display text-lg font-black text-text"
              >
                {level.name}
              </motion.span>
              <p className="mt-4 max-w-xl font-display text-[clamp(1.3rem,4.4vw,2.2rem)] leading-snug font-black">
                {toBn(score)}/১০০ — {report.headline}
              </p>
              <button type="button" onClick={() => done.current()} className="btn btn-cream mt-8 text-lg">
                পুরো Report দেখেন →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
