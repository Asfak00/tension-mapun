"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loading } from "@/components/shared/Loading";
import { useCountUp } from "@/hooks/useCountUp";
import { toBn } from "@/lib/bn";
import { burst } from "@/lib/burst";
import { computeResult } from "@/lib/scoring";
import { challengeUrl, cleanName, copyText, shareOrCopy } from "@/lib/share";
import { sfx } from "@/lib/sound";
import { useHydrated, useTensionStore } from "@/store/useTensionStore";
import type { TensionResult } from "@/types";

export function Battle() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const c = params.get("c");
  const o = params.get("o");
  const challengerName = cleanName(params.get("n")) || "Friend A";
  const opponentName = cleanName(params.get("on")) || "Friend B";

  if (!hydrated) return <Loading />;

  if (c && o) {
    const a = computeResult(c);
    const b = computeResult(o);
    if (!a || !b) return <EmptyState title="Battle link ভাঙা!" text="Link-টা মারামারির আগেই পালিয়ে গেছে।" mood="dead" />;
    return <Versus a={a} b={b} aName={challengerName} bName={opponentName} />;
  }
  if (c) {
    const a = computeResult(c);
    if (!a) return <EmptyState title="Challenge link ভাঙা!" text="বন্ধুকে আবার link পাঠাতে বলেন।" mood="dead" />;
    return <ChallengeInvite code={c} name={cleanName(params.get("n"))} />;
  }
  return <CreateChallenge />;
}

function CreateChallenge() {
  const code = useTensionStore((s) => s.code);
  const name = useTensionStore((s) => s.name);
  const setName = useTensionStore((s) => s.setName);
  const [status, setStatus] = useState<string | null>(null);

  if (!code) return <EmptyState title="আগে নিজের tension মাপেন!" text="নিজের score ছাড়া battle হয় না। আগে test দেন, তারপর বন্ধুকে challenge।" mood="panic" />;
  const result = computeResult(code);
  if (!result) return <EmptyState title="আপনার পুরনো result হারিয়ে গেছে।" text="আরেকবার test দেন।" mood="dead" />;
  const link = challengeUrl(code, cleanName(name) || undefined);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
      <span className="sticker bg-pink">Tension Battle ⚔</span>
      <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.15] font-black">
        কে বেশি <span className="text-pink">cooked?</span>
      </h1>
      <p className="mt-3 font-bangla text-lg text-text/80">
        আপনার score {toBn(result.score)}/১০০। বন্ধুকে link পাঠান, সে test দিলেই dramatic battle reveal। কোনো account লাগবে না।
      </p>

      <div className="mt-8 rounded-[28px] border-[3px] border-ink bg-surface p-5 sm:p-8">
        <label className="block">
          <span className="font-bangla text-sm font-semibold text-muted">Battle-এ আপনার নাম</span>
          <input className="field mt-1" maxLength={24} value={name} placeholder="যেমন: Overthinking King" onChange={(e) => setName(e.target.value.slice(0, 24))} onBlur={(e) => setName(cleanName(e.target.value))} />
        </label>
        <p className="mt-5 font-bangla text-sm text-muted">Challenge link</p>
        <p className="mt-1 rounded-xl bg-ink px-4 py-3 font-mono text-sm break-all text-acid">{link}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="btn btn-pink"
            onClick={async () => {
              const r = await shareOrCopy({ title: "Tension Battle", text: `আমি ${toBn(result.score)}/১০০ পেয়েছি। সাহস থাকলে আমার চেয়ে বেশি cooked হয়ে দেখাও!`, url: link });
              setStatus(r === "copied" ? "Link copy হয়েছে! এখন বন্ধুকে পাঠান।" : r === "shared" ? "Challenge পাঠানো হয়েছে! অপেক্ষা করেন।" : null);
            }}
          >
            Challenge পাঠান ⚔
          </button>
          <button type="button" className="btn btn-cream" onClick={async () => setStatus((await copyText(link)) ? "Link copy হয়েছে!" : "Copy হয়নি, হাতে লিখে নেন।")}>
            শুধু Link Copy
          </button>
        </div>
        <p className="mt-4 min-h-6 font-bangla font-semibold text-acid" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}

function ChallengeInvite({ code, name }: { code: string; name: string }) {
  const router = useRouter();
  const ownCode = useTensionStore((s) => s.code);
  const ownName = useTensionStore((s) => s.name);
  const setChallenge = useTensionStore((s) => s.setChallenge);
  const setSelected = useTensionStore((s) => s.setSelected);
  const who = name || "আপনার এক বন্ধু";

  const fightWithOld = () => {
    const p = new URLSearchParams({ c: code, o: ownCode! });
    if (name) p.set("n", name);
    if (cleanName(ownName)) p.set("on", cleanName(ownName));
    router.push(`/battle?${p}`);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-10 text-center sm:px-6">
      <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: -4 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="sticker bg-pink text-base">
        ⚔ Challenge এসেছে!
      </motion.div>
      <h1 className="mt-6 font-display text-[clamp(1.8rem,5.5vw,3.4rem)] leading-[1.2] font-black">
        {who} আপনাকে Tension Battle-এ challenge দিয়েছে!
      </h1>
      <div className="mt-8 flex items-center gap-6">
        <TensionGuy mood="meltdown" className="w-32 sm:w-40" />
        <div className="text-left">
          <p className="font-bangla text-muted">{who}-এর score</p>
          <motion.p className="font-display text-7xl font-black text-pink" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            ??
          </motion.p>
          <p className="font-bangla text-sm text-muted">Test শেষ করলে দেখা যাবে।</p>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="btn btn-orange text-lg"
          onClick={() => {
            setChallenge({ code, name });
            setSelected([]);
            router.push("/tension");
          }}
        >
          Challenge accept — Test দিবো 😤
        </button>
        {ownCode && ownCode !== code && (
          <button type="button" className="btn btn-ghost" onClick={fightWithOld}>
            আগের result দিয়ে লড়বো
          </button>
        )}
      </div>
    </div>
  );
}

function Versus({ a, b, aName, bName }: { a: TensionResult; b: TensionResult; aName: string; bName: string }) {
  const [phase, setPhase] = useState<"intro" | "count" | "done">("intro");
  const [status, setStatus] = useState<string | null>(null);
  const va = useCountUp(a.score, phase !== "intro", 2200);
  const vb = useCountUp(b.score, phase !== "intro", 2200);
  const winner = a.score === b.score ? null : a.score > b.score ? "a" : "b";

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("count");
      sfx.dhishum();
      sfx.siren(2);
    }, 1300);
    const t2 = setTimeout(() => {
      setPhase("done");
      sfx.drama();
      burst(window.innerWidth / 2, window.innerHeight / 3, ["👑", "🔥", "💀", "😂"], 16);
    }, 3700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const winnerName = winner === "a" ? aName : bName;
  const side = (r: TensionResult, value: number, label: string, from: number, isWinner: boolean) => (
    <motion.div
      initial={{ x: from, opacity: 0 }}
      animate={{ x: 0, opacity: 1, scale: phase === "done" && isWinner ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="relative flex flex-col items-center rounded-[28px] border-[3px] border-ink p-5 text-ink shadow-[6px_6px_0_#000] sm:p-8"
      style={{ background: r.level.color }}
    >
      <AnimatePresence>
        {phase === "done" && isWinner && (
          <motion.span initial={{ y: -40, opacity: 0, rotate: -30 }} animate={{ y: 0, opacity: 1, rotate: -12 }} className="absolute -top-8 left-4 text-5xl" aria-hidden>
            👑
          </motion.span>
        )}
      </AnimatePresence>
      <p className="font-display text-sm font-black uppercase sm:text-base">{label}</p>
      <TensionGuy mood={phase === "done" ? r.level.mood : "panic"} heat={value / 100} className="mt-2 w-24 sm:w-36" />
      <p className="font-display text-[clamp(3rem,12vw,6rem)] leading-none font-black tabular-nums">{toBn(value)}</p>
      <p className="font-display text-xs font-bold sm:text-sm">{phase === "done" ? r.level.name : "হিসাব চলছে..."}</p>
    </motion.div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
      <h1 className="text-center font-display text-[clamp(1.6rem,5vw,3rem)] font-black">Tension Battle ⚔</h1>
      <div className="relative mt-10 grid grid-cols-2 gap-4 sm:gap-10">
        {side(a, va, aName, -200, winner === "a")}
        {side(b, vb, bName, 200, winner === "b")}
        <motion.div
          initial={{ scale: 4, opacity: 0, rotate: -40 }}
          animate={{ scale: 1, opacity: 1, rotate: -8 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 400, damping: 12 }}
          className="absolute top-1/2 left-1/2 z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[4px] border-ink bg-acid font-display text-2xl font-black text-ink shadow-[4px_4px_0_#000] sm:size-24 sm:text-4xl"
        >
          VS
        </motion.div>
      </div>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
            <p className="font-display text-[clamp(1.4rem,4.4vw,2.6rem)] leading-snug font-black">
              {winner ? (
                <>
                  <span className="text-acid">{winnerName}</span> — Officially declared as the most cooked person! 🏆
                </>
              ) : (
                "দুজনেই সমান cooked। বন্ধুত্ব টিকে থাকুক, tension-ও।"
              )}
            </p>
            {winner && (
              <p className="mt-3 font-bangla text-lg text-text/75">
                ব্যবধান {toBn(Math.abs(a.score - b.score))} point। {Math.abs(a.score - b.score) > 25 ? "এটা battle না, এটা massacre।" : "Close fight! Rematch লাগবে।"}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="btn btn-acid"
                onClick={async () => {
                  const r = await shareOrCopy({ title: "Tension Battle Result", text: `${aName} ${toBn(a.score)} vs ${bName} ${toBn(b.score)} — ${winner ? `${winnerName} বেশি cooked!` : "Draw!"}`, url: window.location.href });
                  if (r === "copied") setStatus("Battle link copy হয়েছে!");
                }}
              >
                Battle Result Share
              </button>
              <Link href="/battle" className="btn btn-cream">
                নতুন Challenge দেন
              </Link>
              <Link href="/tension" className="btn btn-ghost">
                Rematch (আবার test)
              </Link>
            </div>
            <p className="mt-4 min-h-6 font-bangla font-semibold text-acid" aria-live="polite">
              {status}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
