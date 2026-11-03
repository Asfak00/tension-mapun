"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const PROBLEMS = [
  "Job চলে যাওয়ার ভয়?",
  "Business ডুবতেছে?",
  "GF seen দিয়ে চলে গেছে?",
  "মাস শেষ, টাকা শেষ?",
  "Future নিয়ে overthinking?",
];
const FINAL = "চিন্তা নাই। Tension Mapun আছে!";
const STEP_MS = 1700;
const FINAL_MS = 3400;

/** Cycles through problems, lands on the punchline, then starts over. */
export function RotatingProblems() {
  const [index, setIndex] = useState(0);
  const isFinal = index === PROBLEMS.length;

  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % (PROBLEMS.length + 1)), isFinal ? FINAL_MS : STEP_MS);
    return () => clearTimeout(id);
  }, [index, isFinal]);

  return (
    <div className="relative h-[2.8em] overflow-hidden" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={index}
          initial={{ y: "100%", opacity: 0, rotate: 3 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: "-100%", opacity: 0, rotate: -3 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={`absolute inset-x-0 top-0 font-display leading-[1.3] font-bold ${
            isFinal ? "text-acid" : "text-orange"
          }`}
        >
          {isFinal ? (
            <span className="bg-ink">{FINAL}</span>
          ) : (
            <>
              <span className="mr-2 inline-block text-pink">→</span>
              {PROBLEMS[index]}
            </>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
