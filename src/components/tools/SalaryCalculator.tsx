"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { formatTaka, toBn } from "@/lib/bn";
import { sfx } from "@/lib/sound";
import type { Mood } from "@/types";

const FIELDS = [
  { key: "salary", label: "Monthly salary", hint: "মাসে হাতে যা আসে", example: 25000, required: true },
  { key: "rent", label: "বাসা ভাড়া", hint: "বাড়িওয়ালা আংকেলের ভাগ", example: 10000 },
  { key: "food", label: "খাবার", hint: "ডিম-ভাত থেকে কাচ্চি", example: 7000 },
  { key: "transport", label: "যাতায়াত", hint: "Rickshaw, bus, Pathao", example: 3000 },
  { key: "shopping", label: "Shopping", hint: "Daraz cart-এর বিল", example: 1500 },
  { key: "family", label: "Family খরচ", hint: "বাড়িতে পাঠানো", example: 2000 },
  { key: "other", label: "অন্যান্য", hint: "চা-সিগারেট-বিকাশ charge", example: 500 },
] as const;

type Key = (typeof FIELDS)[number]["key"];
type Values = Record<Key, string>;
const MAX = 10_000_000;
const DAYS = 30;

const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.key, ""])) as Values;

interface Outcome {
  salary: number;
  expenses: number;
  remaining: number;
  /** Days the salary covers if spending is spread evenly over 30 days; null when expenses are 0. */
  daysCovered: number | null;
  title: string;
  line: string;
  mood: Mood;
  color: string;
}

function validate(values: Values): Partial<Record<Key, string>> {
  const errors: Partial<Record<Key, string>> = {};
  for (const f of FIELDS) {
    const raw = values[f.key].trim();
    if (!raw) {
      if ("required" in f && f.required) errors[f.key] = "Salary ছাড়া হিসাব হয় না, ভাই।";
      continue;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) errors[f.key] = "শুধু সংখ্যা দেন।";
    else if (n < 0) errors[f.key] = "Negative টাকা? এটা তো loan।";
    else if (n > MAX) errors[f.key] = "এত টাকা থাকলে এই calculator লাগবে না।";
    else if ("required" in f && f.required && n === 0) errors[f.key] = "Salary শূন্য? আগে চাকরি, পরে হিসাব।";
  }
  return errors;
}

function compute(values: Values): Outcome {
  const num = (k: Key) => Number(values[k].trim() || 0);
  const salary = num("salary");
  const expenses = FIELDS.filter((f) => f.key !== "salary").reduce((s, f) => s + num(f.key), 0);
  const remaining = salary - expenses;
  const daysCovered = expenses > 0 ? (salary / expenses) * DAYS : null;

  if (remaining < 0)
    return { salary, expenses, remaining, daysCovered, title: "ভাই, মাস শেষ হওয়ার আগেই আপনি শেষ!", line: `প্রতি মাসে ${formatTaka(-remaining)} ঘাটতি। Calculator-ও কান্না শুরু করেছে।`, mood: "dead", color: "#FF3B3B" };
  if (remaining < 2000)
    return { salary, expenses, remaining, daysCovered, title: "ভাই, আপনার মাসের বাকি দিনগুলো এখন থেকে শুধু আল্লাহ ভরসা!", line: "শেষ সপ্তাহে বন্ধুর বাসায় দাওয়াত খোঁজা শুরু করেন।", mood: "meltdown", color: "#FF70B8" };
  if (remaining < 8000)
    return { salary, expenses, remaining, daysCovered, title: "টিকে যাবেন, তবে শেষ সপ্তাহ ডিম-ভাত।", line: "ডিমের দাম বাড়লে আবার হিসাব করতে আসবেন।", mood: "panic", color: "#FF793D" };
  if (remaining < 20000)
    return { salary, expenses, remaining, daysCovered, title: "বাহ! মাস শেষে এক কাপ cappuccino affordable।", line: "তবে বন্ধুরা জানলে treat চাইবে। সাবধান।", mood: "worried", color: "#B78AFF" };
  return { salary, expenses, remaining, daysCovered, title: "ভাই, আপনি তো বড়লোক! Treat কবে?", line: "এই result screenshot নিয়ে বন্ধুদের group-এ দিবেন না। ধার চাইবে।", mood: "chill", color: "#E8FF65" };
}

export function SalaryCalculator() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setOutcome(null);
      sfx.fail();
      return;
    }
    const result = compute(values);
    setOutcome(result);
    sfx.result();
  };

  const fillExample = () => {
    setValues(Object.fromEntries(FIELDS.map((f) => [f.key, String(f.example)])) as Values);
    setErrors({});
  };

  const gauge = outcome ? Math.max(0, Math.min(1, outcome.remaining / Math.max(outcome.salary, 1))) : 0.5;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <header className="max-w-3xl">
        <span className="sticker bg-[#7CF2B0]">Mapun Salary Survival Calculator</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.15] font-black">
          Salary দিয়ে মাস <span className="text-acid">টিকবে তো?</span>
        </h1>
        <p className="mt-3 font-bangla text-lg text-text/80">খরচ লিখেন, আমরা বলবো মাসের কয় তারিখ থেকে আল্লাহ ভরসা।</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={submit} noValidate className="rounded-[28px] border-2 border-line bg-surface p-5 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.key} className={`block ${f.key === "salary" ? "sm:col-span-2" : ""}`}>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-bangla font-semibold">
                    {f.label}
                    {"required" in f && f.required && <span className="text-orange"> *</span>}
                  </span>
                  <span className="font-bangla text-xs text-muted">{f.hint}</span>
                </span>
                <span className="relative mt-1 block">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-muted">৳</span>
                  <input
                    className={`field pl-9 ${errors[f.key] ? "border-red" : ""}`}
                    inputMode="numeric"
                    type="number"
                    min={0}
                    max={MAX}
                    placeholder={String(f.example)}
                    value={values[f.key]}
                    aria-invalid={!!errors[f.key]}
                    aria-describedby={errors[f.key] ? `${f.key}-error` : undefined}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                </span>
                {errors[f.key] && (
                  <span id={`${f.key}-error`} className="mt-1 block font-bangla text-sm text-red">
                    {errors[f.key]}
                  </span>
                )}
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="btn btn-acid flex-1">
              হিসাব করেন 🧮
            </button>
            <button type="button" className="btn btn-ghost" onClick={fillExample}>
              Example দিয়ে দেখি
            </button>
          </div>
          <p className="mt-5 font-bangla text-xs leading-relaxed text-muted">
            হিসাবের নিয়ম (খুবই সরল): সব খরচ ৩০ দিনে সমানভাবে হয় ধরে নেওয়া হয়েছে। টিকে থাকার দিন = Salary ÷ (মোট খরচ ÷ ৩০)। এটা মজার জন্য বানানো আনুমানিক হিসাব, কোনো financial advice না।
          </p>
        </form>

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {outcome ? (
              <motion.div
                key={`${outcome.remaining}-${outcome.expenses}`}
                initial={{ opacity: 0, y: 30, rotate: 2 }}
                animate={outcome.remaining < 0 ? { opacity: 1, y: 0, rotate: 0, x: [0, -10, 10, -6, 6, 0] } : { opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-[28px] border-[3px] border-ink p-6 text-ink shadow-[8px_8px_0_#000] sm:p-8"
                style={{ background: outcome.color }}
              >
                <div className="flex items-start gap-4">
                  <TensionGuy mood={outcome.mood} className="w-24 shrink-0 sm:w-32" />
                  <div>
                    <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">মাস শেষে থাকবে</p>
                    <p className="font-display text-[clamp(2.2rem,7vw,3.6rem)] leading-none font-black">{formatTaka(outcome.remaining)}</p>
                  </div>
                </div>

                {/* Fuel gauge */}
                <svg viewBox="0 0 200 110" className="mx-auto mt-6 w-full max-w-xs" aria-hidden>
                  <path d="M20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#14111B" strokeWidth="18" strokeLinecap="round" />
                  <path d="M20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#FFF4E0" strokeWidth="10" strokeLinecap="round" />
                  <text x="14" y="108" fontSize="14" fontWeight="900" fill="#14111B">E</text>
                  <text x="178" y="108" fontSize="14" fontWeight="900" fill="#14111B">F</text>
                  <motion.line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="34"
                    stroke="#14111B"
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{ originX: 0.5, originY: 1 }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -90 + gauge * 180 }}
                    transition={{ type: "spring", stiffness: 60, damping: 8 }}
                  />
                  <circle cx="100" cy="100" r="9" fill="#14111B" />
                </svg>

                <p className="mt-4 font-bangla text-[clamp(1.2rem,3vw,1.6rem)] leading-snug font-bold">{outcome.title}</p>
                <p className="mt-2 font-bangla text-[16px] font-medium">{outcome.line}</p>

                <dl className="mt-6 grid grid-cols-2 gap-3 border-t-2 border-dashed border-ink/30 pt-4 font-bangla text-[15px]">
                  <div>
                    <dt className="opacity-70">Salary</dt>
                    <dd className="font-display font-black">{formatTaka(outcome.salary)}</dd>
                  </div>
                  <div>
                    <dt className="opacity-70">মোট খরচ</dt>
                    <dd className="font-display font-black">{formatTaka(outcome.expenses)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="opacity-70">আনুমানিক টিকে থাকা</dt>
                    <dd className="font-bold">
                      {outcome.daysCovered === null
                        ? "খরচ শূন্য? আপনি কি বাতাস খেয়ে বাঁচেন? অসীম দিন।"
                        : outcome.daysCovered < DAYS
                          ? `মাসের ${toBn(Math.floor(outcome.daysCovered))} তারিখ পর্যন্ত। তারপর... আল্লাহ ভরসা।`
                          : `পুরো মাস + আরো ${toBn(Math.floor(outcome.daysCovered - DAYS))} দিন বাড়তি।`}
                    </dd>
                  </div>
                </dl>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-72 flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-line p-8 text-center"
              >
                <TensionGuy mood="worried" className="w-32" />
                <p className="mt-4 font-bangla text-lg text-text/70">হিসাব করার আগেই ভয় লাগছে? স্বাভাবিক।</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
