"use client";

import { AnimatePresence, motion } from "motion/react";
import { Download, ImagePlus, Share2, Shuffle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { FitToWidth } from "@/components/shared/FitToWidth";
import { Loading } from "@/components/shared/Loading";
import { MICROCOPY } from "@/data/jokes";
import { POSTER_CRIME, POSTER_POOLS, POSTER_SIZE, TEMPLATES, type TemplateId } from "@/data/poster";
import { useResultSource } from "@/hooks/useResultSource";
import { toBn } from "@/lib/bn";
import { burst } from "@/lib/burst";
import { pick } from "@/lib/random";
import { cleanName, downloadNodeAsPng, shareNodeAsPng } from "@/lib/share";
import { sfx } from "@/lib/sound";
import { useTensionStore } from "@/store/useTensionStore";
import { Poster, type PosterInfo } from "./Posters";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHOTO_MAX_SIDE = 900;

const TEXT_FIELDS = [
  { key: "nickname", label: "উপাধি / ডাকনাম", max: 24, placeholder: "যেমন: Overthinking King" },
  { key: "area", label: "শেষ দেখা গেছে (এলাকা)", max: 28, placeholder: "যেমন: মিরপুর ১০-এর জ্যাম" },
  { key: "job", label: "পেশা", max: 28, placeholder: "যেমন: Professional Overthinker" },
  { key: "crime", label: "সবচেয়ে বড় tension / অপরাধ", max: 70, placeholder: "যেমন: দিনে ৮৭ বার last seen check" },
] as const;

/** Downscales an uploaded photo so the exported poster stays light. Never leaves the device. */
function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

export function PosterStudio() {
  const source = useResultSource();
  const storedName = useTensionStore((s) => s.name);
  const setName = useTensionStore((s) => s.setName);
  const [template, setTemplate] = useState<TemplateId>("wanted");
  const [fields, setFields] = useState<Omit<PosterInfo, "name" | "photo" | "crime"> & { crime: string | null }>({
    nickname: "",
    area: "",
    job: "",
    crime: null,
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (source.status === "loading") return <Loading text="Poster-এর রং গোলানো হচ্ছে..." />;
  if (source.status !== "ok")
    return (
      <EmptyState
        title="Poster বানাতে আগে tension মাপতে হবে!"
        text="Score ছাড়া poster মানে নায়ক ছাড়া সিনেমা। ২ মিনিটের test দেন।"
        mood="panic"
      />
    );

  const { result, isMine, name: sharedName } = source;
  const info: PosterInfo = {
    name: cleanName(isMine ? storedName : sharedName),
    nickname: cleanName(fields.nickname),
    area: cleanName(fields.area),
    job: cleanName(fields.job),
    crime: (fields.crime ?? POSTER_CRIME[result.topCategory]).trim() || POSTER_CRIME[result.topCategory],
    photo,
  };
  // Only rendered client-side (results resolve after hydration).
  const host = window.location.host;
  const filename = `tension-mapun-${template}-${result.score}.png`;

  const onPhoto = async (file: File | undefined) => {
    setPhotoError(null);
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) return setPhotoError("শুধু JPG, PNG বা WEBP ছবি চলবে। আপনার tension-এর মতো অদ্ভুত format না।");
    if (file.size > MAX_PHOTO_BYTES) return setPhotoError("ছবি ৫MB-এর বেশি! এত বড় মুখ poster-এ আঁটবে না।");
    try {
      setPhoto(await readPhoto(file));
      sfx.pop();
    } catch {
      setPhotoError("ছবিটা খুলছে না। ছবিও মনে হয় tension-এ আছে।");
    }
  };

  const randomize = (e: React.MouseEvent) => {
    setFields({
      nickname: pick(POSTER_POOLS.nickname),
      area: pick(POSTER_POOLS.area),
      job: pick(POSTER_POOLS.job),
      crime: pick([POSTER_CRIME[result.topCategory], ...POSTER_POOLS.crime]),
    });
    burst(e.clientX, e.clientY, ["🎲", "😂", "🤠"], 8);
    sfx.pop();
  };

  const run = async (action: "download" | "share") => {
    if (!posterRef.current) return;
    setBusy(true);
    setStatus(null);
    try {
      if (action === "download") {
        await downloadNodeAsPng(posterRef.current, filename, POSTER_SIZE);
        setStatus("Poster download হয়ে গেছে! এখন দেয়ালে (Facebook-এ) টাঙান।");
      } else {
        const r = await shareNodeAsPng(posterRef.current, filename, POSTER_SIZE, `আমার Tension score ${toBn(result.score)}/১০০! তোমারটা বানাও: ${window.location.origin}/tension`);
        if (r === "shared") setStatus("Share হয়ে গেছে! বন্ধুরা এখন হাসছে (আপনাকে নিয়ে)।");
        else if (r === "downloaded") setStatus("এই browser সরাসরি share পারে না, তাই download করে দিলাম।");
      }
      sfx.win();
    } catch {
      setStatus(MICROCOPY.networkError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <header className="max-w-3xl">
        <span className="sticker bg-orange">Tension Poster Studio 🎨</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.15] font-black">
          আপনার tension, <span className="text-acid">দেয়ালে টাঙানোর মতো</span>
        </h1>
        <p className="mt-3 font-bangla text-lg text-text/80">
          Template বাছেন, নাম-তথ্য দেন, চাইলে নিজের ছবিও। তারপর download বা share। ছবি আপনার phone-এর বাইরে কোথাও যায় না।
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Poster template">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={template === t.id}
            aria-label={`${t.label} — ${t.note}`}
            onClick={() => {
              setTemplate(t.id);
              sfx.tick();
            }}
            className={`rounded-2xl border-[3px] px-4 py-2 text-left transition-transform ${
              template === t.id ? "-rotate-2 border-ink bg-acid text-ink shadow-[4px_4px_0_#000]" : "border-line hover:border-text"
            }`}
          >
            <span className="block font-display text-sm font-black">{t.label}</span>
            <span className={`block font-bangla text-xs ${template === t.id ? "text-ink/70" : "text-muted"}`}>{t.note}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form className="order-2 rounded-[28px] border-2 border-line bg-surface p-5 sm:p-7 lg:order-1" onSubmit={(e) => e.preventDefault()} noValidate>
          {isMine ? (
            <label className="block">
              <span className="font-bangla font-semibold">আপনার নাম</span>
              <input
                className="field mt-1"
                maxLength={24}
                value={storedName}
                placeholder="না দিলে লেখা হবে: নাম প্রকাশে অনিচ্ছুক"
                onChange={(e) => setName(e.target.value.slice(0, 24))}
                onBlur={(e) => setName(cleanName(e.target.value))}
              />
            </label>
          ) : (
            <p className="font-bangla text-sm text-muted">এটা অন্য কারো result। নিজের নামে poster চাইলে আগে নিজের test দেন।</p>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {TEXT_FIELDS.map((f) => (
              <label key={f.key} className={`block ${f.key === "crime" ? "sm:col-span-2" : ""}`}>
                <span className="flex justify-between gap-2 font-bangla font-semibold">
                  {f.label}
                  {f.key === "crime" && <span className="text-xs font-normal text-muted">{toBn(info.crime.length)}/{toBn(f.max)}</span>}
                </span>
                <input
                  className="field mt-1"
                  maxLength={f.max}
                  placeholder={f.placeholder}
                  value={f.key === "crime" ? (fields.crime ?? POSTER_CRIME[result.topCategory]) : fields[f.key]}
                  onChange={(e) => setFields((v) => ({ ...v, [f.key]: e.target.value.replace(/[<>{}]/g, "").slice(0, f.max) }))}
                />
              </label>
            ))}
          </div>

          <div className="mt-5">
            <span className="font-bangla font-semibold">ছবি (optional)</span>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input ref={fileRef} type="file" accept={PHOTO_TYPES.join(",")} className="sr-only" id="poster-photo" onChange={(e) => onPhoto(e.target.files?.[0])} />
              <label htmlFor="poster-photo" className="btn btn-cream cursor-pointer">
                <ImagePlus className="size-5" /> {photo ? "ছবি বদলান" : "ছবি দিন"}
              </label>
              {photo && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setPhoto(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  <Trash2 className="size-5" /> ছবি বাদ
                </button>
              )}
            </div>
            <p className="mt-2 font-bangla text-xs text-muted">ছবি না দিলে আমাদের cartoon ভাই আপনার হয়ে pose দেবে। JPG/PNG/WEBP, সর্বোচ্চ ৫MB।</p>
            {photoError && <p className="mt-1 font-bangla text-sm text-red">{photoError}</p>}
          </div>

          <button type="button" className="btn btn-ghost mt-6 w-full" onClick={randomize}>
            <Shuffle className="size-5" /> মজার তথ্য বানিয়ে দেন
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" className="btn btn-acid" disabled={busy} onClick={() => run("download")}>
              <Download className="size-5" /> {busy ? "ছাপা হচ্ছে..." : "Poster Download"}
            </button>
            <button type="button" className="btn btn-pink" disabled={busy} onClick={() => run("share")}>
              <Share2 className="size-5" /> Poster Share
            </button>
          </div>
          <div className="mt-3 min-h-7" aria-live="polite">
            <AnimatePresence>
              {status && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-bangla font-semibold text-acid">
                  {status}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>

        <motion.div
          key={template}
          initial={{ rotate: 3, scale: 0.96, opacity: 0 }}
          animate={{ rotate: -1, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="order-1 overflow-hidden rounded-xl border-[3px] border-ink shadow-[8px_8px_0_#000] lg:sticky lg:top-24 lg:order-2"
        >
          <FitToWidth width={POSTER_SIZE.width}>
            <Poster ref={posterRef} template={template} info={info} result={result} host={host} />
          </FitToWidth>
        </motion.div>
      </div>
    </div>
  );
}
