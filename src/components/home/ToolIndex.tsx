"use client";

import { motion } from "motion/react";
import Link from "next/link";

const FEATURED = {
  href: "/tension",
  name: "Tension Test",
  line: "৯ ধরনের সমস্যা, কাস্টম প্রশ্ন, আর একটা নাটকীয় result। Score, prescription, share card — সব একসাথে।",
  color: "#FF793D",
  tag: "মূল ঘটনা",
  emoji: "🌡️",
};

const TOOLS = [
  { href: "/tools/roulette", name: "Tension Roulette", line: "চাকা ঘুরান, নতুন একটা অযথা tension নিয়ে বাড়ি যান।", color: "#E8FF65", tag: "Free tension", emoji: "🎡" },
  { href: "/tools/salary-calculator", name: "Salary Survival", line: "Salary দিয়ে মাসের কয় তারিখ পর্যন্ত টিকবেন, হিসাব করেন।", color: "#7CF2B0", tag: "৳ ভরসা", emoji: "💸" },
  { href: "/poster", name: "Poster Studio", line: "WANTED, সিনেমা, নিখোঁজ সংবাদ — নিজের নাম-ছবি দিয়ে পাগলাটে poster।", color: "#FFB547", tag: "নতুন!", emoji: "🖼️" },
  { href: "/battle", name: "Tension Battle", line: "বন্ধুকে challenge দেন। দেখা যাক কে বেশি cooked।", color: "#FF70B8", tag: "1 vs 1", emoji: "🥊" },
  { href: "/prescription", name: "Mapun Clinic", line: "Dr. Mapun-এর হাতে লেখা (কাল্পনিক) prescription।", color: "#B78AFF", tag: "MBBS*", emoji: "💊" },
  { href: "/tools/more", name: "আরো পাগলামি", line: "Horoscope, Boss Mood, Excuse Generator, Ex Detector আর আরো ৪টা।", color: "#5CE1E6", tag: "Bonus ×৮", emoji: "🤪" },
];

const TILTS = [-1.5, 1, -1, 1.5, -1, 1];

/** Bento grid: the main test gets the big tile, every other tool a sticker card. */
export function ToolIndex() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-[3px] border-text pb-4">
        <h2 className="font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-[1.1] font-black">Mapun-এর যন্ত্রপাতি</h2>
        <p className="font-bangla text-sm text-muted">সব tool কাজ করে। আপনার জীবনের মতো না।</p>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.li
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="sm:col-span-2 lg:row-span-2"
        >
          <Link
            href={FEATURED.href}
            className="group relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-[28px] border-[3px] border-ink p-6 text-ink shadow-[8px_8px_0_#000] transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] sm:p-8"
            style={{ background: FEATURED.color }}
          >
            <span className="pointer-events-none absolute -right-6 -bottom-10 text-[11rem] leading-none opacity-90 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 sm:text-[14rem]" aria-hidden>
              {FEATURED.emoji}
            </span>
            <span className="relative flex items-center justify-between gap-3">
              <span className="font-display text-sm font-bold">01</span>
              <span className="sticker bg-cream">{FEATURED.tag}</span>
            </span>
            <span className="relative mt-16 block max-w-md">
              <span className="block font-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.95] font-black">{FEATURED.name}</span>
              <span className="mt-4 block font-bangla text-lg leading-snug font-semibold">{FEATURED.line}</span>
              <span className="btn btn-cream mt-6 group-hover:bg-acid">শুরু করেন →</span>
            </span>
          </Link>
        </motion.li>

        {TOOLS.map((tool, i) => (
          <motion.li
            key={tool.href}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: TILTS[i] }}
            whileHover={{ rotate: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.05 + i * 0.05, type: "spring", stiffness: 200, damping: 18 }}
            className={i >= 4 ? "lg:col-span-2" : ""}
          >
            <Link
              href={tool.href}
              className={`group relative flex h-full min-h-52 flex-col rounded-3xl ${i >= 4 ? "lg:min-h-40" : ""} border-[3px] border-ink p-5 text-ink shadow-[5px_5px_0_#000] transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#000]`}
              style={{ background: tool.color }}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="grid size-14 place-items-center rounded-2xl border-[3px] border-ink bg-cream text-3xl transition-transform group-hover:-rotate-12 group-hover:scale-110" aria-hidden>
                  {tool.emoji}
                </span>
                <span className="sticker bg-cream">{tool.tag}</span>
              </span>
              <span className="mt-auto block pt-6">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-xl leading-tight font-black sm:text-2xl">{tool.name}</span>
                  <span className="font-display text-2xl transition-transform group-hover:translate-x-1 group-hover:-rotate-45" aria-hidden>
                    →
                  </span>
                </span>
                <span className="mt-1 block font-bangla text-[15px] leading-snug font-medium opacity-85">{tool.line}</span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
