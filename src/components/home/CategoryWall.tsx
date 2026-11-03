"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

const TILTS = [-6, 4, -2, 7, -5, 3, -8, 5, -3];

/** Scattered sticker wall; each sticker starts the test with that category picked. */
export function CategoryWall() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
        <div>
          <h2 className="font-display text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.15] font-black">
            আচ্ছা, আপনার সমস্যা <span className="text-orange">কোনদিকে?</span>
          </h2>
          <p className="mt-4 max-w-md font-bangla text-lg text-text/80">
            একটা sticker-এ চাপ দেন, test শুরু হয়ে যাবে। বাকি সমস্যাগুলো পরে যোগ করা যাবে। আমরা বিচার করি না, শুধু হিসাব করি।
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
          {CATEGORIES.map((cat, i) => (
            <motion.li
              key={cat.id}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: TILTS[i] }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ rotate: 0, scale: 1.08, zIndex: 2 }}
            >
              <Link
                href={`/tension?cat=${cat.id}`}
                className="group flex items-center gap-2 rounded-2xl border-[3px] border-ink px-4 py-3 text-ink shadow-[4px_4px_0_#000]"
                style={{ background: cat.color }}
              >
                <span className="text-2xl transition-transform group-hover:scale-125 group-hover:-rotate-12">{cat.emoji}</span>
                <span>
                  <span className="block font-display text-sm font-black uppercase">{cat.name}</span>
                  <span className="block font-bangla text-[13px] leading-tight font-semibold opacity-80">{cat.tagline}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
