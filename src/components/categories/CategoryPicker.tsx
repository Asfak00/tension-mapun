"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { MiniFace } from "@/components/characters/Stickers";
import { CATEGORIES, countJoke } from "@/data/categories";
import { toBn } from "@/lib/bn";
import { burstFromEvent } from "@/lib/burst";
import { sfx } from "@/lib/sound";
import type { Category, CategoryId } from "@/types";
import { Thermometer } from "./Thermometer";

interface Props {
  selected: CategoryId[];
  onToggle: (id: CategoryId) => void;
  onContinue: () => void;
}

export function CategoryPicker({ selected, onToggle, onContinue }: Props) {
  const [joke, setJoke] = useState<{ key: number; text: string } | null>(null);
  const count = selected.length;

  const toggle = (cat: Category, event: React.MouseEvent) => {
    const adding = !selected.includes(cat.id);
    onToggle(cat.id);
    const next = count + (adding ? 1 : -1);
    if (adding) {
      burstFromEvent(event, [cat.emoji, "😵", "💦"]);
      sfx.pop();
    }
    let text: string;
    if (!adding) text = next === 0 ? countJoke(0) : `${cat.name} বাদ? একটা tension কমলো। মাত্র একটা।`;
    else if (next === CATEGORIES.length || next === 5 || next === 7) text = countJoke(next);
    else text = cat.selectJokes[next % cat.selectJokes.length];
    setJoke((j) => ({ key: (j?.key ?? 0) + 1, text }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-40 sm:px-6">
      <header className="max-w-3xl">
        <span className="sticker bg-acid">Step ১ / ২</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.15] font-black">
          আচ্ছা, আপনার সমস্যা <span className="text-orange">কোনদিকে?</span>
        </h1>
        <p className="mt-3 font-bangla text-lg text-text/80">
          একাধিক সমস্যা থাকলে সবগুলোই select করতে পারেন। আমরা বিচার করি না। শুধু হিসাব করি।
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto]">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} active={selected.includes(cat.id)} onClick={(e) => toggle(cat, e)} />
          ))}
        </ul>
        <aside className="sticky top-24 hidden h-fit lg:block">
          <Thermometer value={count} max={CATEGORIES.length} />
        </aside>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-ink bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <motion.span
              key={count}
              initial={{ scale: 1.6, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="grid size-12 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-orange font-display text-xl font-black text-ink"
              aria-label={`${count}টা সমস্যা selected`}
            >
              {toBn(count)}
            </motion.span>
            <div className="min-w-0" aria-live="polite">
              <p className="font-display text-[11px] font-bold tracking-widest text-muted uppercase">সমস্যা selected</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={joke?.key ?? "idle"}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  className="truncate font-bangla text-[15px] font-semibold sm:whitespace-normal"
                >
                  {joke?.text ?? countJoke(count)}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <button type="button" className="btn btn-acid w-full sm:w-auto" disabled={count === 0} onClick={onContinue}>
            {count === 0 ? "আগে কিছু select করেন" : "প্রশ্ন শুরু করেন →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  cat,
  index,
  active,
  onClick,
}: {
  cat: Category;
  index: number;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);
  const mood = active ? (cat.id === "relationship" ? "meltdown" : "panic") : hover ? "worried" : "chill";
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, rotate: active ? (index % 2 ? 1.5 : -1.5) : 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 18 }}
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={`group relative flex h-full w-full flex-col gap-3 rounded-[22px] border-[3px] p-5 text-left transition-[background,border,box-shadow,transform] duration-200 ${
          active
            ? "border-ink text-ink shadow-[6px_6px_0_#000]"
            : "border-line bg-surface hover:-translate-y-1 hover:border-text/60"
        }`}
        style={active ? { background: cat.color } : undefined}
      >
        <div className="flex items-start justify-between gap-3">
          <motion.div animate={hover && !active ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }} transition={{ duration: 0.5 }}>
            <MiniFace mood={mood} color={active ? "#FFF4E0" : cat.color} className="size-14" />
          </motion.div>
          <span className="text-3xl transition-transform group-hover:scale-125" aria-hidden>
            {cat.emoji}
          </span>
        </div>
        <div>
          <p className="font-display text-lg leading-tight font-black">{cat.name}</p>
          <ul className={`mt-2 space-y-0.5 font-bangla text-[14px] ${active ? "text-ink/80" : "text-text/65"}`}>
            {cat.problems.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </div>
        <AnimatePresence>
          {active && (
            <motion.span
              initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 8 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -top-3 -right-3 flex items-center gap-1 rounded-full border-[3px] border-ink bg-ink px-3 py-1 font-display text-[11px] font-black text-acid"
            >
              <Check className="size-3.5" strokeWidth={4} /> আছে!
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
}
