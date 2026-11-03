"use client";

import { AnimatePresence, motion } from "motion/react";
import { Copy, Download, Link2, Swords } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MICROCOPY } from "@/data/jokes";
import { toBn } from "@/lib/bn";
import { challengeUrl, cleanName, copyText, downloadNodeAsPng, resultUrl, shareOrCopy } from "@/lib/share";
import { sfx } from "@/lib/sound";
import { useTensionStore } from "@/store/useTensionStore";
import type { ResultReport, TensionResult } from "@/types";
import { CARD_SIZE, ShareCard, type CardFormat } from "./ShareCard";

const PREVIEW_WIDTH = 300;

export function ShareStudio({ result, report, isMine }: { result: TensionResult; report: ResultReport; isMine: boolean }) {
  const storedName = useTensionStore((s) => s.name);
  const setName = useTensionStore((s) => s.setName);
  const [format, setFormat] = useState<CardFormat>("feed");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const name = isMine ? cleanName(storedName) : "";
  // Only rendered client-side (results resolve after hydration).
  const host = window.location.host;

  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setStatus(null), 2600);
    return () => clearTimeout(id);
  }, [status]);

  const { width, height } = CARD_SIZE[format];
  const scale = PREVIEW_WIDTH / width;
  const link = resultUrl(result.code, name || undefined);
  const shareText = `Tension Mapun-এ আমার score ${toBn(result.score)}/১০০ — ${result.level.name}! ${report.shareJoke} তোমার কত?`;

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      await downloadNodeAsPng(cardRef.current, `tension-mapun-${result.score}-${format}.png`, { width, height });
      setStatus("Image download হয়ে গেছে! এখন সবাইকে দেখান।");
      sfx.win();
    } catch {
      setStatus(MICROCOPY.networkError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="share-title" className="grid gap-8 rounded-[28px] border-[3px] border-ink bg-surface p-5 sm:p-8 lg:grid-cols-[auto_1fr]">
      <div className="mx-auto">
        <div className="mb-3 flex justify-center gap-2" role="radiogroup" aria-label="Card format">
          {(["feed", "story"] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={format === f}
              onClick={() => setFormat(f)}
              className={`rounded-full border-2 px-4 py-2 font-display text-xs font-bold ${
                format === f ? "border-acid bg-acid text-ink" : "border-line text-muted hover:text-text"
              }`}
            >
              {f === "feed" ? "Feed 4:5" : "Story 9:16"}
            </button>
          ))}
        </div>
        <motion.div
          layout
          className="overflow-hidden rounded-xl border-[3px] border-ink shadow-[6px_6px_0_#000]"
          style={{ width: PREVIEW_WIDTH, height: height * scale }}
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width, height }}>
            <ShareCard ref={cardRef} result={result} report={report} format={format} name={name} host={host} />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col">
        <h2 id="share-title" className="font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-tight font-black">
          সবাইকে দেখান, <span className="text-pink">লজ্জা নাই</span>
        </h2>
        <p className="mt-2 font-bangla text-text/75">Facebook, Instagram Story, WhatsApp, Messenger — সব জায়গায় চলবে।</p>

        {isMine && (
          <label className="mt-6 block">
            <span className="font-bangla text-sm font-semibold text-muted">Card-এ আপনার নাম (optional)</span>
            <input
              className="field mt-1"
              value={storedName}
              maxLength={24}
              placeholder="যেমন: Tension-এর রাজা"
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              onBlur={(e) => setName(cleanName(e.target.value))}
            />
          </label>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" className="btn btn-acid" onClick={download} disabled={busy}>
            <Download className="size-5" /> {busy ? "ছবি বানানো হচ্ছে..." : "Download Image"}
          </button>
          <button
            type="button"
            className="btn btn-cream"
            onClick={async () => setStatus((await copyText(`${shareText} ${link}`)) ? "Result copy হয়েছে! Paste করে দেন।" : "Copy হয়নি। Clipboard-ও tension-এ।")}
          >
            <Copy className="size-5" /> Copy Result
          </button>
          <button
            type="button"
            className="btn btn-cream"
            onClick={async () => {
              const r = await shareOrCopy({ title: "Tension Mapun", text: shareText, url: link });
              if (r === "copied") setStatus("Link copy হয়েছে!");
              else if (r === "shared") setStatus("Share হয়ে গেছে! এখন সবাই জানে।");
            }}
          >
            <Link2 className="size-5" /> Share Link
          </button>
          {isMine && (
            <button
              type="button"
              className="btn btn-pink"
              onClick={async () => {
                const url = challengeUrl(result.code, name || undefined);
                const r = await shareOrCopy({
                  title: "Tension Battle",
                  text: `আমি ${toBn(result.score)}/১০০ পেয়েছি। সাহস থাকলে আমার চেয়ে বেশি cooked হয়ে দেখাও!`,
                  url,
                });
                if (r === "copied") setStatus("Challenge link copy হয়েছে! বন্ধুকে পাঠান।");
              }}
            >
              <Swords className="size-5" /> Challenge a Friend
            </button>
          )}
        </div>

        <div className="mt-4 min-h-7" aria-live="polite">
          <AnimatePresence>
            {status && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-bangla font-semibold text-acid">
                {status}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
