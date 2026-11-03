"use client";

import { motion } from "motion/react";
import { toBn } from "@/lib/bn";

/** Vertical tube that heats up as more problems get selected. */
export function Thermometer({ value, max }: { value: number; max: number }) {
  const ratio = max ? value / max : 0;
  const temp = Math.round(37 + ratio * 72);
  const color = ratio > 0.75 ? "#FF3B3B" : ratio > 0.45 ? "#FF793D" : ratio > 0 ? "#E8FF65" : "#7FD8FF";
  return (
    <div className="flex flex-col items-center gap-3" aria-label={`Tension temperature ${temp} ডিগ্রি`}>
      <motion.p
        key={temp}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        className="font-display text-3xl font-black"
        style={{ color }}
      >
        {toBn(temp)}°
      </motion.p>
      <svg viewBox="0 0 60 260" className="h-72 w-auto" aria-hidden>
        <rect x="18" y="8" width="24" height="200" rx="12" fill="#211C2B" stroke="#F9F5FF" strokeWidth="4" />
        <motion.rect
          x="24"
          width="12"
          rx="6"
          fill={color}
          initial={false}
          animate={{ y: 200 - ratio * 186, height: 12 + ratio * 186 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
        <circle cx="30" cy="228" r="24" fill={color} stroke="#F9F5FF" strokeWidth="4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="44" x2="54" y1={40 + i * 40} y2={40 + i * 40} stroke="#A79DB8" strokeWidth="3" />
        ))}
      </svg>
      <p className="max-w-[8rem] text-center font-bangla text-xs text-muted">
        {ratio === 0 ? "এখনো ঠান্ডা" : ratio < 0.5 ? "গরম হচ্ছে" : ratio < 1 ? "ফুটতেছে!" : "বিস্ফোরণ আসন্ন"}
      </p>
    </div>
  );
}
