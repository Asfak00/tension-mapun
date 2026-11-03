"use client";

import { motion } from "motion/react";
import Link from "next/link";

const TOOLS = [
  { href: "/tension", name: "Tension Test", line: "৯ ধরনের সমস্যা, কাস্টম প্রশ্ন, আর একটা নাটকীয় result।", color: "#FF793D", tag: "মূল ঘটনা" },
  { href: "/tools/roulette", name: "Tension Roulette", line: "চাকা ঘুরান, নতুন একটা অযথা tension নিয়ে বাড়ি যান।", color: "#E8FF65", tag: "Free tension" },
  { href: "/tools/salary-calculator", name: "Salary Survival", line: "Salary দিয়ে মাসের কয় তারিখ পর্যন্ত টিকবেন, হিসাব করেন।", color: "#7CF2B0", tag: "৳ ভরসা" },
  { href: "/poster", name: "Poster Studio", line: "WANTED, সিনেমা, নিখোঁজ সংবাদ — নিজের নাম-ছবি দিয়ে পাগলাটে poster।", color: "#FFB547", tag: "নতুন!" },
  { href: "/battle", name: "Tension Battle", line: "বন্ধুকে challenge দেন। দেখা যাক কে বেশি cooked।", color: "#FF70B8", tag: "1 vs 1" },
  { href: "/prescription", name: "Mapun Clinic", line: "Dr. Mapun-এর হাতে লেখা (কাল্পনিক) prescription।", color: "#B78AFF", tag: "MBBS*" },
  { href: "/tools/more", name: "আরো পাগলামি", line: "Horoscope, Boss Mood, Excuse Generator, Ex Detector...", color: "#5CE1E6", tag: "Bonus" },
];

/** Editorial index of tools instead of a card grid. */
export function ToolIndex() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
      <div className="flex items-end justify-between gap-6 border-b-[3px] border-text pb-4">
        <h2 className="font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-[1.1] font-black">Mapun-এর যন্ত্রপাতি</h2>
        <p className="hidden max-w-xs text-right font-bangla text-sm text-muted sm:block">সব tool কাজ করে। আপনার জীবনের মতো না।</p>
      </div>
      <ol>
        {TOOLS.map((tool, i) => (
          <motion.li
            key={tool.href}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
            className="border-b border-line"
          >
            <Link
              href={tool.href}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden py-6 sm:gap-8"
              style={{ "--tool": tool.color } as React.CSSProperties}
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-[var(--tool)] transition-transform duration-300 ease-out group-hover:scale-x-100" aria-hidden />
              <span className="relative font-display text-sm font-bold text-muted group-hover:text-ink">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative">
                <span className="block font-display text-[clamp(1.4rem,4.6vw,3rem)] leading-tight font-black transition-colors group-hover:text-ink">
                  {tool.name}
                </span>
                <span className="block font-bangla text-[15px] text-text/70 transition-colors group-hover:text-ink">{tool.line}</span>
              </span>
              <span className="relative flex items-center gap-3">
                <span className="sticker hidden bg-[var(--tool)] sm:inline-block group-hover:bg-cream">{tool.tag}</span>
                <span className="font-display text-3xl transition-transform group-hover:translate-x-1 group-hover:-rotate-45 group-hover:text-ink">→</span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
