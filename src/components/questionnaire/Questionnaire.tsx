"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { moodFor } from "@/components/shared/moodFor";
import { getCategory } from "@/data/categories";
import { PROGRESS_LABELS } from "@/data/jokes";
import { SKIP_REACTIONS } from "@/data/questions";
import { toBn } from "@/lib/bn";
import { burstFromEvent } from "@/lib/burst";
import { pick } from "@/lib/random";
import { buildQuiz, SKIP_POINTS } from "@/lib/scoring";
import { sfx } from "@/lib/sound";
import type { Answer, CategoryId } from "@/types";

const LETTERS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"];
const REACTION_MS = 1500;

interface Props {
  categories: CategoryId[];
  onFinish: (answers: Answer[]) => void;
  onBack: () => void;
}

export function Questionnaire({ categories, onFinish, onBack }: Props) {
  const quiz = useMemo(() => buildQuiz(categories), [categories]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(() => quiz.map(() => null));
  const [reaction, setReaction] = useState<{ text: string; points: number; chosen: number | null } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = quiz[index];
  const isLast = index === quiz.length - 1;
  const progress = index / quiz.length;
  const label = isLast ? "শেষ প্রশ্ন। Brain, hold on!" : PROGRESS_LABELS[Math.min(3, Math.floor(progress * 4))];

  const runningAvg = useMemo(() => {
    const pts = answers.slice(0, index).map((a, i) => (a === null ? SKIP_POINTS : quiz[i].options[a].points));
    return pts.length ? pts.reduce((s, p) => s + p, 0) / pts.length : 30;
  }, [answers, index, quiz]);
  const mood = moodFor(reaction ? reaction.points : runningAvg);

  const advance = useCallback(
    (next: Answer[]) => {
      if (timer.current) clearTimeout(timer.current);
      setReaction(null);
      if (index >= quiz.length - 1) onFinish(next);
      else setIndex((i) => i + 1);
    },
    [index, quiz.length, onFinish],
  );

  const answer = useCallback(
    (choice: number | null) => {
      if (reaction) return;
      const next = [...answers];
      next[index] = choice;
      setAnswers(next);
      const points = choice === null ? SKIP_POINTS : question.options[choice].points;
      const text = choice === null ? pick(SKIP_REACTIONS) : question.options[choice].reaction;
      setReaction({ text, points, chosen: choice });
      if (question.category === "relationship" && points >= 85) sfx.crack();
      else if (points >= 80) sfx.dhishum();
      else sfx.pop();
      timer.current = setTimeout(() => advance(next), REACTION_MS + text.length * 12);
    },
    [answers, index, question, reaction, advance],
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Number keys pick options, S skips, Enter moves on during a reaction.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      if (reaction && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        advance(answers);
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= question.options.length) answer(n - 1);
      else if (e.key.toLowerCase() === "s") answer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, advance, answers, question, reaction]);

  const cat = getCategory(question.category);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-6">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (index === 0 ? onBack() : (setReaction(null), setIndex((i) => i - 1)))}
          className="flex min-h-11 items-center gap-1 rounded-full px-3 font-bangla text-sm font-semibold text-muted hover:text-text"
        >
          <ArrowLeft className="size-4" /> {index === 0 ? "সমস্যা বদলাবো" : "আগের প্রশ্ন"}
        </button>
        <p className="font-display text-xs font-bold text-muted">
          {toBn(index + 1)} / {toBn(quiz.length)}
        </p>
      </div>
      <div className="mt-3">
        <div className="flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={quiz.length} aria-valuenow={index} aria-label={label}>
          {quiz.map((q, i) => (
            <motion.span
              key={q.id}
              className="h-3 flex-1 rounded-full border-2 border-ink"
              animate={{
                backgroundColor: i < index ? getCategory(q.category).color : i === index ? "#F9F5FF" : "#2C2539",
                scaleY: i === index ? 1.35 : 1,
              }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mt-2 font-display text-sm font-bold text-acid"
          >
            {label}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        <AnimatePresence mode="wait">
          <motion.section
            key={question.id}
            initial={{ x: 120, rotate: 6, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            exit={{ x: -120, rotate: -6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            aria-labelledby="q-text"
          >
            <span className="sticker" style={{ background: cat.color }}>
              {cat.emoji} {cat.name}
            </span>
            <h2 id="q-text" className="mt-4 font-display text-[clamp(1.6rem,4.6vw,2.8rem)] leading-[1.25] font-black">
              {question.text}
            </h2>

            <div className="mt-8 grid gap-3">
              {question.options.map((opt, i) => {
                const chosen = reaction?.chosen === i;
                const faded = reaction && !chosen;
                return (
                  <motion.button
                    key={opt.label}
                    type="button"
                    disabled={!!reaction}
                    onClick={(e) => {
                      burstFromEvent(e, opt.points >= 80 ? ["💀", "🔥", "😵"] : opt.points <= 20 ? ["😎", "🧊", "🌿"] : ["😬", "💦", "🤔"]);
                      answer(i);
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: faded ? 0.3 : 1, y: 0, scale: chosen ? 1.03 : 1, rotate: chosen ? -1 : 0 }}
                    transition={{ delay: reaction ? 0 : 0.08 + i * 0.05 }}
                    whileHover={reaction ? undefined : { x: 6 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group flex min-h-16 items-center gap-4 rounded-2xl border-[3px] px-4 py-3 text-left transition-colors ${
                      chosen ? "border-ink bg-acid text-ink shadow-[5px_5px_0_#000]" : "border-line bg-surface hover:border-orange"
                    }`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl border-2 font-bangla text-lg font-bold ${
                        chosen ? "border-ink bg-ink text-acid" : "border-line text-muted group-hover:border-orange group-hover:text-orange"
                      }`}
                      aria-hidden
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="flex-1">
                      <span className="block font-bangla text-[17px] leading-snug font-semibold">{opt.label}</span>
                      {opt.hint && (
                        <span className={`block font-bangla text-sm ${chosen ? "text-ink/70" : "text-muted"}`}>{opt.hint}</span>
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => answer(null)}
                disabled={!!reaction}
                className="flex min-h-11 items-center gap-2 rounded-full px-3 font-bangla text-[15px] font-semibold text-muted hover:text-pink disabled:opacity-40"
              >
                <SkipForward className="size-4" /> Skip করেন (উত্তর দিতে ভয়?)
              </button>
              <p className="hidden font-bangla text-xs text-muted sm:block">Keyboard: সংখ্যা চাপুন, S = skip</p>
            </div>
          </motion.section>
        </AnimatePresence>

        {/* Reacting character */}
        <aside className="relative order-first mx-auto w-40 sm:w-52 lg:order-none lg:sticky lg:top-24 lg:w-full">
          <TensionGuy mood={mood} className="h-auto w-full" />
          <AnimatePresence>
            {reaction && (
              <motion.button
                type="button"
                onClick={() => advance(answers)}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute top-[30%] left-1/2 z-10 w-[min(88vw,320px)] -translate-x-1/2 rounded-3xl border-[3px] border-ink bg-cream p-4 text-left text-ink shadow-[5px_5px_0_#000] lg:top-[-8%]"
                role="status"
              >
                <span className="block font-bangla text-[17px] leading-snug font-bold">{reaction.text}</span>
                <span className="mt-2 block font-display text-[11px] font-bold tracking-wider text-ink/60 uppercase">
                  {isLast ? "Result দেখতে tap করেন →" : "পরের প্রশ্ন → (tap)"}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
