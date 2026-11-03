"use client";

import { motion } from "motion/react";
import { Download } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { EmptyState } from "@/components/shared/EmptyState";
import { FitToWidth } from "@/components/shared/FitToWidth";
import { Loading } from "@/components/shared/Loading";
import { getCategory } from "@/data/categories";
import { MICROCOPY } from "@/data/jokes";
import { useResultSource } from "@/hooks/useResultSource";
import { toBn } from "@/lib/bn";
import { buildPrescription } from "@/lib/result-generator";
import { cleanName, downloadNodeAsPng } from "@/lib/share";
import { sfx } from "@/lib/sound";
import { useTensionStore } from "@/store/useTensionStore";

const PAPER_WIDTH = 820;

export function PrescriptionView() {
  const source = useResultSource();
  const setName = useTensionStore((s) => s.setName);
  const paperRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (source.status === "loading") return <Loading text="Dr. Mapun চশমা খুঁজছেন..." />;
  if (source.status !== "ok")
    return (
      <EmptyState
        title={source.status === "invalid" ? "এই prescription-এর হাতের লেখা পড়া যাচ্ছে না।" : "Patient কোথায়?"}
        text="Prescription পেতে আগে Tension Test দিতে হবে। Dr. Mapun ভিজিট ছাড়া কিছু লেখেন না।"
        mood="worried"
      />
    );

  const { result, isMine, name } = source;
  const rx = buildPrescription(result);
  const today = new Date().toLocaleDateString("en-GB");
  const patient = cleanName(name) || "একজন অতিরিক্ত চিন্তিত মানুষ";

  const download = async () => {
    if (!paperRef.current) return;
    setBusy(true);
    setError(null);
    try {
      await downloadNodeAsPng(paperRef.current, `mapun-prescription-${result.score}.png`, {
        width: paperRef.current.offsetWidth,
        height: paperRef.current.offsetHeight,
      });
      sfx.thud();
    } catch {
      setError(MICROCOPY.networkError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="sticker bg-lilac">Mapun Clinic 🏥</span>
          <h1 className="mt-3 font-display text-[clamp(1.8rem,5vw,3.2rem)] leading-tight font-black">আপনার Prescription</h1>
          <p className="mt-1 font-bangla text-text/75">Dr. Mapun নিজের হাতে লিখেছেন। (কাল্পনিক। ঔষধগুলোও।)</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <button type="button" className="btn btn-acid" onClick={download} disabled={busy}>
            <Download className="size-5" /> {busy ? "Print হচ্ছে..." : "Image Download"}
          </button>
          {error && <p className="font-bangla text-sm text-red">{error}</p>}
        </div>
      </div>

      {isMine && (
        <label className="mt-6 block max-w-sm">
          <span className="font-bangla text-sm font-semibold text-muted">Patient-এর নাম (optional)</span>
          <input
            className="field mt-1"
            maxLength={24}
            defaultValue={name}
            placeholder="নাম না দিলে আমরা নিজেরাই বানিয়ে নেব"
            onBlur={(e) => setName(cleanName(e.target.value))}
            onChange={(e) => setName(e.target.value.slice(0, 24))}
          />
        </label>
      )}

      {/* Fixed-width paper keeps the downloaded image identical on every device. */}
      <FitToWidth width={PAPER_WIDTH} className="mt-8">
        <motion.div
          ref={paperRef}
          initial={{ y: 40, opacity: 0, rotate: -2 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="relative bg-paper text-ink"
          style={{ width: PAPER_WIDTH, fontFamily: "var(--font-hind), sans-serif", border: "4px solid #14111B" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-6 border-b-4 border-ink bg-orange px-10 py-7">
            <div>
              <p className="font-display text-[34px] leading-none font-black">MAPUN CLINIC 🏥</p>
              <p className="mt-2 text-[15px] font-semibold">Tension, Overthinking ও অযথা চিন্তা বিশেষজ্ঞ</p>
            </div>
            <div className="text-right">
              <p className="font-display text-[22px] font-black">Dr. Mapun</p>
              <p className="text-[13px] leading-snug font-semibold">
                MBBS — Mapun-Based Bachelor of
                <br />
                Bullshit Studies (Gold Medal, নিজের দেওয়া)
              </p>
            </div>
          </div>

          {/* Patient row */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-6 border-b-2 border-dashed border-ink/40 px-10 py-5 text-[16px]">
            <p>
              <span className="font-bold">Patient:</span> {patient}
            </p>
            <p>
              <span className="font-bold">Score:</span> {toBn(result.score)}/১০০
            </p>
            <p>
              <span className="font-bold">Date:</span> {toBn(today)}
            </p>
          </div>

          <div className="grid grid-cols-[230px_1fr]">
            {/* Left column */}
            <div className="border-r-2 border-ink/20 px-8 py-7 text-[15px]">
              <p className="font-display text-[13px] font-black tracking-wider uppercase opacity-60">Diagnosis</p>
              <p className="mt-2 text-[18px] leading-snug font-bold">{rx.diagnosis}</p>
              <p className="mt-6 font-display text-[13px] font-black tracking-wider uppercase opacity-60">Complaints</p>
              <ul className="mt-2 space-y-1">
                {result.categories.map((id) => (
                  <li key={id}>
                    {getCategory(id).emoji} {getCategory(id).name}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-display text-[13px] font-black tracking-wider uppercase opacity-60">Level</p>
              <p className="mt-1 font-bold">{result.level.name}</p>
            </div>

            {/* Right column */}
            <div className="relative px-10 py-7">
              <p className="font-serif text-[64px] leading-none font-black italic">℞</p>
              <ol className="mt-3 space-y-3 text-[18px] leading-snug">
                {rx.treatments.map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="font-display font-black">{toBn(i + 1)}.</span>
                    {t}
                  </li>
                ))}
              </ol>

              <p className="mt-8 font-display text-[13px] font-black tracking-wider uppercase opacity-60">Medicine</p>
              <ul className="mt-3 space-y-3">
                {rx.medicines.map((m) => (
                  <li key={m.name} className="flex items-start gap-3 rounded-xl border-2 border-ink bg-cream px-4 py-2.5">
                    <span className="mt-1 inline-block h-4 w-8 shrink-0 rounded-full border-2 border-ink bg-gradient-to-r from-pink from-50% to-cream to-50%" aria-hidden />
                    <span>
                      <span className="block font-display text-[16px] font-black">{m.name}</span>
                      <span className="block text-[15px]">{m.dose}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Stamp */}
              <motion.div
                initial={{ scale: 3, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 0.9, rotate: -14 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 500, damping: 16 }}
                onAnimationComplete={() => sfx.result()}
                className="pointer-events-none absolute right-8 bottom-24 rounded-xl border-[6px] border-double border-red px-5 py-2 font-display text-[34px] font-black text-red"
              >
                APPROVED
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between gap-6 border-t-4 border-ink px-10 py-6">
            <p className="max-w-[420px] text-[13px] leading-snug">
              ⚠ এই prescription সম্পূর্ণ কাল্পনিক। কোনো ঔষধ বাস্তবে নেই। ফার্মেসিতে গিয়ে চাইলে মামা হাসবে।
            </p>
            <div className="text-center">
              <svg viewBox="0 0 160 50" className="h-12 w-40" aria-hidden>
                <path d="M6 36 C 20 6, 30 46, 44 22 S 64 10, 70 34 C 76 46, 92 4, 104 28 S 130 40, 154 14" fill="none" stroke="#14111B" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="border-t-2 border-ink pt-1 text-[12px] font-bold">Dr. Mapun-এর সই (নকল করা কঠিন)</p>
            </div>
          </div>
        </motion.div>
      </FitToWidth>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/result?r=${result.code}${name ? `&n=${encodeURIComponent(name)}` : ""}`} className="btn btn-cream">
          ← Result-এ ফেরত
        </Link>
        <Link href="/tension" className="btn btn-ghost">
          নতুন রোগ নিয়ে আসবো
        </Link>
      </div>
      <Disclaimer className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
