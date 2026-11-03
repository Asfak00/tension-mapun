"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loading } from "@/components/shared/Loading";
import { getCategory } from "@/data/categories";
import { MICROCOPY } from "@/data/jokes";
import { useResultSource } from "@/hooks/useResultSource";
import { toBn } from "@/lib/bn";
import { rankCategories } from "@/lib/result-generator";
import { cleanName } from "@/lib/share";
import { sfx } from "@/lib/sound";
import { useTensionStore } from "@/store/useTensionStore";
import { RevealSequence } from "./RevealSequence";
import { ShareStudio } from "./ShareStudio";

export function ResultView() {
  const source = useResultSource();
  const router = useRouter();
  const pendingReveal = useTensionStore((s) => s.pendingReveal);
  const clearReveal = useTensionStore((s) => s.clearReveal);
  const challenge = useTensionStore((s) => s.challenge);
  const setChallenge = useTensionStore((s) => s.setChallenge);
  const setSelected = useTensionStore((s) => s.setSelected);
  const [confirmRetake, setConfirmRetake] = useState(false);

  // Play the result sound each time a result is opened. Right after a test, RevealSequence plays it instead.
  const resultCode = source.status === "ok" ? source.result.code : null;
  const revealing = source.status === "ok" && source.isMine && pendingReveal;
  const announced = useRef<string | null>(null);
  useEffect(() => {
    if (!resultCode || announced.current === resultCode) return;
    announced.current = resultCode;
    if (!revealing) sfx.result();
  }, [resultCode, revealing]);

  if (source.status === "loading") return <Loading />;
  if (source.status === "empty") return <EmptyState title={MICROCOPY.empty} text="আগে test দেন, তারপর result। নিয়ম।" />;
  if (source.status === "invalid")
    return <EmptyState title="এই link-টা ভাঙা, ভাই।" text="Link-ও tension নিয়ে আধা রাস্তায় হারিয়ে গেছে। নতুন করে test দেন।" mood="dead" />;

  const { result, report, isMine, name } = source;
  const { level, score } = result;
  const ranked = rankCategories(result);
  const showReveal = isMine && pendingReveal;

  const battleWithChallenge = () => {
    if (!challenge) return;
    const params = new URLSearchParams({ c: challenge.code, o: result.code });
    if (challenge.name) params.set("n", challenge.name);
    const myName = cleanName(useTensionStore.getState().name);
    if (myName) params.set("on", myName);
    setChallenge(null);
    router.push(`/battle?${params}`);
  };

  return (
    <>
      <AnimatePresence>{showReveal && <RevealSequence result={result} report={report} onDone={clearReveal} />}</AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        {!isMine && (
          <div className="mb-8 flex flex-col gap-3 rounded-2xl border-[3px] border-ink bg-lilac p-4 text-ink sm:flex-row sm:items-center sm:justify-between">
            <p className="font-bangla text-lg font-bold">
              এটা {name ? `${name}-এর` : "অন্য কারো"} result। আপনার অবস্থা কি এর চেয়েও খারাপ?
            </p>
            <Link href="/tension" className="btn btn-cream shrink-0">
              আমিও Test দিবো
            </Link>
          </div>
        )}

        {isMine && challenge && challenge.code !== result.code && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 flex flex-col gap-3 rounded-2xl border-[3px] border-ink bg-pink p-4 text-ink sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="font-bangla text-lg font-bold">
              {challenge.name || "আপনার বন্ধু"} আপনাকে challenge দিয়েছিল। এখন দেখা যাক কে বেশি cooked!
            </p>
            <button type="button" className="btn btn-acid shrink-0" onClick={battleWithChallenge}>
              ⚔ Battle Reveal
            </button>
          </motion.div>
        )}

        {/* Score hero */}
        <section className="relative grid items-center gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="font-display text-xs font-bold tracking-[0.2em] text-muted uppercase">
              {name ? `${name}-এর ` : ""}Official Tension Score
            </p>
            <div className="mt-2 flex items-end gap-3">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: showReveal ? 0 : 0.1 }}
                className="font-display text-[clamp(7rem,26vw,15rem)] leading-[0.85] font-black tabular-nums"
                style={{ color: level.color }}
              >
                {toBn(score)}
              </motion.span>
              <span className="mb-4 font-display text-3xl font-black text-muted">/১০০</span>
            </div>
            <span
              className="mt-4 inline-block -rotate-2 rounded-lg border-[3px] border-ink px-4 py-1.5 font-display text-xl font-black text-ink shadow-[4px_4px_0_#000]"
              style={{ background: level.color }}
            >
              {level.name}
            </span>
            <h1 className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-[1.25] font-black">{report.headline}</h1>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-[8%] rounded-full opacity-25 blur-3xl" style={{ background: level.color }} aria-hidden />
            <TensionGuy mood={level.mood} heat={score / 100} className="relative w-full" />
          </div>
        </section>

        {/* Diagnosis + lab report */}
        <section className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative rounded-[28px] border-[3px] border-ink bg-cream p-6 text-ink shadow-[6px_6px_0_#000] sm:p-8">
            <span className="sticker bg-orange">Dr. Mapun-এর Diagnosis</span>
            <p className="mt-5 font-bangla text-[clamp(1.2rem,2.6vw,1.6rem)] leading-relaxed font-semibold">{report.diagnosis}</p>
            <div className="mt-6 border-t-2 border-dashed border-ink/25 pt-5">
              <p className="font-display text-xs font-bold tracking-widest uppercase opacity-60">Mapun Forecast 🔮</p>
              <p className="mt-2 font-bangla text-lg font-semibold">{report.prediction}</p>
            </div>
          </div>

          <div className="rounded-[28px] border-2 border-line bg-surface p-6 sm:p-8">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-black">Lab Report</h2>
              <span className="font-bangla text-xs text-muted">সব মাপ কাল্পনিক</span>
            </div>
            <ul className="mt-5 space-y-4">
              {report.stats.map((stat, i) => (
                <li key={stat.label}>
                  <div className="flex justify-between gap-3 font-bangla text-[15px]">
                    <span className="text-text/80">{stat.label}</span>
                    <span className="font-display font-bold" style={{ color: level.color }}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-ink">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: level.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Category breakdown */}
        <section className="mt-16">
          <h2 className="font-display text-[clamp(1.4rem,3.4vw,2.2rem)] font-black">কোন tension কতটা খাচ্ছে</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {ranked.map((id, i) => {
              const cat = getCategory(id);
              const value = result.categoryScores[id] ?? 0;
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, type: "spring" }}
                  className="flex items-center gap-3 rounded-2xl border-[3px] border-ink px-4 py-3 text-ink shadow-[4px_4px_0_#000]"
                  style={{ background: cat.color }}
                >
                  <span className="text-2xl" aria-hidden>
                    {cat.emoji}
                  </span>
                  <span className="font-display text-sm font-black">{cat.name}</span>
                  <span className="rounded-full bg-ink px-2.5 py-0.5 font-display text-sm font-black text-text">{toBn(value)}</span>
                </motion.li>
              );
            })}
          </ul>
        </section>

        {/* Treatment preview */}
        <section className="mt-16 grid gap-6 rounded-[28px] border-2 border-line p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-[clamp(1.4rem,3.4vw,2.2rem)] font-black">Recommended Treatment 💊</h2>
            <ol className="mt-4 space-y-2 font-bangla text-lg">
              {report.treatments.slice(0, 3).map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="font-display font-black text-orange">{toBn(i + 1)}.</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
          <Link href={`/prescription?r=${result.code}${name ? `&n=${encodeURIComponent(name)}` : ""}`} className="btn btn-orange">
            Full Prescription দেখেন 🏥
          </Link>
        </section>

        {/* Poster teaser */}
        <section className="mt-16 flex flex-col items-start gap-5 overflow-hidden rounded-[28px] border-[3px] border-ink bg-[#F7E8C4] p-6 text-[#3A2410] shadow-[6px_6px_0_#000] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-display text-[clamp(2.2rem,7vw,4rem)] leading-none font-black tracking-wide">WANTED</p>
            <p className="mt-2 max-w-xl font-bangla text-lg font-semibold">
              নিজের নাম, এলাকা, পেশা আর ছবি দিয়ে WANTED, বাংলা সিনেমা বা নিখোঁজ সংবাদের poster বানান। Download করে সবাইকে লজ্জা দেন।
            </p>
          </div>
          <Link href={`/poster?r=${result.code}${name ? `&n=${encodeURIComponent(name)}` : ""}`} className="btn btn-orange shrink-0">
            Crazy Poster বানান 🎬
          </Link>
        </section>

        <div className="mt-16">
          <ShareStudio result={result} report={report} isMine={isMine} />
        </div>

        {/* Retake */}
        <section className="mt-16 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {!confirmRetake ? (
              <motion.button
                key="ask"
                type="button"
                className="btn btn-ghost text-lg"
                onClick={() => setConfirmRetake(true)}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {MICROCOPY.retake} 🔁
              </motion.button>
            ) : (
              <motion.div key="confirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                <p className="font-bangla text-xl font-bold">{MICROCOPY.confirm}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    className="btn btn-orange"
                    onClick={() => {
                      setSelected([]);
                      router.push("/tension");
                    }}
                  >
                    হ্যাঁ, আবার দিবো
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setConfirmRetake(false)}>
                    না, থাক
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <Disclaimer className="mx-auto mt-12 max-w-3xl" />
      </div>
    </>
  );
}
