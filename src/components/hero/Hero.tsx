"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { burstFromEvent } from "@/lib/burst";
import { sfx } from "@/lib/sound";
import { HeroCharacter } from "./HeroCharacter";
import { Marquee } from "./Marquee";
import { RotatingProblems } from "./RotatingProblems";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-16">
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, rotate: -12, scale: 0.6 }}
            animate={{ opacity: 1, rotate: -4, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 14 }}
            className="sticker bg-pink font-bangla text-sm normal-case"
          >
            আপনার টেনশন, আমাদের গবেষণা!
          </motion.span>

          <motion.h1
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-5 font-display text-[clamp(2.9rem,10vw,7.2rem)] leading-[1.02] font-black tracking-tight"
          >
            জীবনে
            <br />
            <span className="relative inline-block">
              Tension
              <svg viewBox="0 0 120 40" className="absolute -right-10 -top-6 w-16 sm:-right-14 sm:w-24" aria-hidden>
                <path d="M10 30 L 30 8 M44 34 L 52 4 M70 30 L 92 10" stroke="#FF793D" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </span>{" "}
            <span className="text-lilac">কম?</span>
          </motion.h1>

          <div className="mt-4 text-[clamp(1.25rem,3.6vw,2.1rem)]">
            <RotatingProblems />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 max-w-xl font-bangla text-lg text-text/85 sm:text-xl"
          >
            আপনার জীবনের যাবতীয় tension-এর আমরা করব{" "}
            <span className="scribble-underline font-semibold text-text">বৈজ্ঞানিক</span>{" "}
            <span className="text-muted">(একদমই না)</span> বিশ্লেষণ।
          </motion.p>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 14 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/tension"
              className="btn btn-orange text-lg"
              onClick={(e) => {
                burstFromEvent(e);
                sfx.pop();
              }}
            >
              আমার Tension Check করেন 😂
            </Link>
            <Link href="#random" className="btn btn-ghost text-lg">
              Random Tension দেন 🌚
            </Link>
          </motion.div>

          <p className="mt-6 font-bangla text-sm text-muted">
            ২ মিনিট লাগে। কোনো login নেই। কোনো ডাক্তার নেই। শুধু Mapun।
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 16 }}
        >
          <HeroCharacter />
        </motion.div>
      </div>
      <Marquee className="-rotate-[1.5deg] scale-105" />
    </section>
  );
}
