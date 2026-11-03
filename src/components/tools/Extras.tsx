"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Copy, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { moodFor } from "@/components/shared/moodFor";
import { CHAT_FALLBACK, CHAT_RULES, EXCUSE_CONTEXTS, EXCUSES, FUTURES, HOROSCOPE, NEWS, RASHI } from "@/data/extras";
import { toBn } from "@/lib/bn";
import { clamp, hashString, mulberry32, pick } from "@/lib/random";
import { copyText } from "@/lib/share";
import { burst } from "@/lib/burst";
import { sfx } from "@/lib/sound";
import { useTensionStore } from "@/store/useTensionStore";

const PANELS = [
  { id: "horoscope", title: "Daily Tension Horoscope", emoji: "♈", note: "আজকে কোন tension আপনার জন্য লেখা আছে", C: Horoscope },
  { id: "boss", title: "Boss Mood Predictor", emoji: "😤", note: "আজকে leave চাইবেন কিনা", C: BossMood },
  { id: "future", title: "Future Simulator", emoji: "🔮", note: "১, ৫ বা ১০ বছর পরে আপনি", C: FutureSimulator },
  { id: "ex", title: "Ex Detector", emoji: "💔", note: "এখনো move on হয়েছেন কিনা", C: ExDetector },
  { id: "excuse", title: "Random Excuse Generator", emoji: "🙊", note: "Office, class, family — সব জায়গার জন্য", C: ExcuseGenerator },
  { id: "news", title: "Tension News", emoji: "📰", note: "দেশের সবচেয়ে অদরকারি খবর", C: TensionNews },
  { id: "sounds", title: "ঢালিউড Sound Board", emoji: "🎬", note: "ঢিশুম, ড্রামা জুম, চড় — বাংলা সিনেমার effect", C: SoundBoard },
  { id: "chat", title: "Mapun Chat", emoji: "💬", note: "Dr. Mapun-এর সাথে (scripted) আড্ডা", C: MapunChat },
];

export function Extras() {
  const [open, setOpen] = useState<string | null>("horoscope");
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
      <span className="sticker bg-[#5CE1E6]">Bonus পাগলামি</span>
      <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] leading-[1.15] font-black">
        আরো কিছু <span className="text-lilac">অদরকারি</span> যন্ত্র
      </h1>
      <p className="mt-3 font-bangla text-lg text-text/80">
        সবগুলোই কাজ করে, কোনোটাই সত্যি না। আর{" "}
        <Link href="/tools/roulette" className="font-semibold text-acid underline underline-offset-4">
          Tension Roulette
        </Link>{" "}
        তো আছেই।
      </p>

      <div className="mt-10 border-t-[3px] border-text">
        {PANELS.map(({ id, title, emoji, note, C }) => {
          const expanded = open === id;
          return (
            <section key={id} className="border-b border-line">
              <h2>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`panel-${id}`}
                  onClick={() => setOpen(expanded ? null : id)}
                  className="group flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="text-3xl transition-transform group-hover:scale-125 group-hover:-rotate-12" aria-hidden>
                    {emoji}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[clamp(1.1rem,3vw,1.6rem)] font-black">{title}</span>
                    <span className="block font-bangla text-sm text-muted">{note}</span>
                  </span>
                  <ChevronDown className={`size-6 shrink-0 transition-transform ${expanded ? "rotate-180 text-acid" : ""}`} />
                </button>
              </h2>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    id={`panel-${id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8">
                      <C />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Card({ children, color = "#FFF4E0" }: { children: React.ReactNode; color?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, rotate: -1 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      className="mt-5 rounded-3xl border-[3px] border-ink p-5 text-ink shadow-[5px_5px_0_#000] sm:p-6"
      style={{ background: color }}
    >
      {children}
    </motion.div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 rounded-full border-2 px-4 py-2 font-bangla font-semibold transition-colors ${
        active ? "border-acid bg-acid text-ink" : "border-line hover:border-text"
      }`}
    >
      {children}
    </button>
  );
}

function Horoscope() {
  const [sign, setSign] = useState<string | null>(null);
  const reading = (() => {
    if (!sign) return null;
    const date = new Date().toISOString().slice(0, 10);
    const rand = mulberry32(hashString(`${date}:${sign}`));
    return {
      tension: pick(HOROSCOPE.tension, rand),
      lucky: pick(HOROSCOPE.lucky, rand),
      avoid: pick(HOROSCOPE.avoid, rand),
      time: pick(HOROSCOPE.time, rand),
      level: 30 + Math.round(rand() * 70),
    };
  })();
  return (
    <div>
      <p className="font-bangla text-text/80">আপনার রাশি বাছাই করেন। প্রতিদিন নতুন ভবিষ্যৎ, সবগুলোই বানানো।</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {RASHI.map((r) => (
          <Chip key={r} active={sign === r} onClick={() => (setSign(r), sfx.pop())}>
            {r}
          </Chip>
        ))}
      </div>
      {reading && (
        <Card key={sign} color="#B78AFF">
          <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">আজকের {sign} রাশি · Tension {toBn(reading.level)}%</p>
          <p className="mt-2 font-bangla text-xl leading-snug font-bold">{reading.tension}</p>
          <dl className="mt-4 grid gap-2 font-bangla sm:grid-cols-3">
            <div>
              <dt className="text-sm opacity-70">Lucky জিনিস</dt>
              <dd className="font-bold">{reading.lucky}</dd>
            </div>
            <div>
              <dt className="text-sm opacity-70">আজকে এড়িয়ে চলুন</dt>
              <dd className="font-bold">{reading.avoid}</dd>
            </div>
            <div>
              <dt className="text-sm opacity-70">বিপদের সময়</dt>
              <dd className="font-bold">{reading.time}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}

const DAYS = [
  { label: "রবি", weight: 80 },
  { label: "সোম", weight: 60 },
  { label: "মঙ্গল", weight: 50 },
  { label: "বুধ", weight: 45 },
  { label: "বৃহস্পতি", weight: 20 },
  { label: "শুক্র", weight: 5 },
  { label: "শনি", weight: 30 },
];
const TEA = [
  { label: "হ্যাঁ, খেয়েছে", delta: -20 },
  { label: "না, খায়নি", delta: 20 },
  { label: "জানি না", delta: 5 },
];

function BossMood() {
  const [day, setDay] = useState<number | null>(null);
  const [tea, setTea] = useState<number | null>(null);
  const [meetings, setMeetings] = useState(2);
  const [deadline, setDeadline] = useState(false);
  const ready = day !== null && tea !== null;
  const score = ready ? clamp(DAYS[day].weight + TEA[tea].delta + meetings * 6 + (deadline ? 20 : 0), 0, 100) : 0;
  const verdict =
    score < 25
      ? "Boss আজকে ফেরেশতা। Leave চাওয়ার best দিন।"
      : score < 50
        ? "Neutral mood। চুপচাপ কাজ করেন, কোনো প্রশ্ন করবেন না।"
        : score < 75
          ? "সাবধান! চোখে চোখ রাখবেন না। \"জি স্যার\" ছাড়া কিছু বলবেন না।"
          : "🚨 BOSS STORM WARNING। Washroom-এ লুকান, Teams status: \"In a meeting\"।";
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-5">
        <fieldset>
          <legend className="font-bangla font-semibold">আজকে কী বার?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAYS.map((d, i) => (
              <Chip key={d.label} active={day === i} onClick={() => setDay(i)}>
                {d.label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-bangla font-semibold">Boss সকালে চা খেয়েছে?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TEA.map((t, i) => (
              <Chip key={t.label} active={tea === i} onClick={() => setTea(i)}>
                {t.label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="font-bangla font-semibold">আজকে meeting কয়টা? {toBn(meetings)}টা</span>
          <input type="range" min={0} max={8} value={meetings} onChange={(e) => setMeetings(Number(e.target.value))} className="mt-2 w-full accent-orange" />
        </label>
        <label className="flex min-h-11 items-center gap-3 font-bangla font-semibold">
          <input type="checkbox" checked={deadline} onChange={(e) => setDeadline(e.target.checked)} className="size-5 accent-orange" />
          Client deadline আজকে
        </label>
      </div>
      <div className="lg:w-72">
        {ready ? (
          <Card key={score} color={score >= 75 ? "#FF3B3B" : score >= 50 ? "#FF793D" : "#E8FF65"}>
            <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">Boss Anger Meter</p>
            <p className="font-display text-6xl font-black">{toBn(score)}%</p>
            <p className="mt-2 font-bangla text-lg leading-snug font-bold">{verdict}</p>
          </Card>
        ) : (
          <p className="mt-5 font-bangla text-muted">বার আর চায়ের খবর দেন, তাহলেই prediction।</p>
        )}
      </div>
    </div>
  );
}

function FutureSimulator() {
  const [years, setYears] = useState<string | null>(null);
  const [roll, setRoll] = useState(0);
  const future = (() => {
    if (!years) return null;
    const f = FUTURES[years];
    return { job: pick(f.job), home: pick(f.home), twist: pick(f.twist) };
  })();
  return (
    <div>
      <p className="font-bangla text-text/80">কত বছর পরের নিজেকে দেখতে চান? (দুর্বল হৃদয়ের মানুষদের জন্য নিষেধ।)</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.keys(FUTURES).map((y) => (
          <Chip key={y} active={years === y} onClick={() => (setYears(y), setRoll((r) => r + 1), sfx.pop())}>
            {toBn(y)} বছর পরে
          </Chip>
        ))}
      </div>
      {future && (
        <Card key={`${years}-${roll}`} color="#C9A7FF">
          <p className="font-display text-xs font-bold tracking-widest uppercase opacity-70">Simulation #{toBn(roll)}</p>
          <ul className="mt-2 space-y-2 font-bangla text-lg font-semibold">
            <li>💼 {future.job}।</li>
            <li>🏠 {future.home}।</li>
            <li>✨ {future.twist}</li>
          </ul>
          <button type="button" className="btn btn-cream mt-5" onClick={() => setRoll((r) => r + 1)}>
            আরেকটা future দেখি
          </button>
        </Card>
      )}
    </div>
  );
}

const EX_SIGNS = [
  "এখনো ওর last seen check করি",
  "ওর পছন্দের গান আসলে skip করি না",
  "Mutual friend-এর কাছে গোপনে খবর নিই",
  "পুরনো chat-এর screenshot এখনো gallery-তে",
  "নতুন কাউকে দেখলে ওর সাথে compare করি",
];

function ExDetector() {
  const [checked, setChecked] = useState<boolean[]>(EX_SIGNS.map(() => false));
  const count = checked.filter(Boolean).length;
  const percent = count * 20;
  const verdict = [
    "Ex-feelings: শূন্য। আপনি officially free bird। 🕊",
    "হালকা সিগন্যাল। মাঝে মাঝে মনে পড়ে, স্বাভাবিক।",
    "Ex এখনো আপনার মাথায় rent-free থাকে।",
    "ভাই, আপনি move on করেননি, আপনি শুধু move করেছেন।",
    "Ex Detector-এর alarm বাজছে। Phone রাখেন।",
    "🚨 100% Ex-feeling detected। NoReplycin দিনে ৩ বার।",
  ][count];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <ul className="space-y-2">
        {EX_SIGNS.map((s, i) => (
          <li key={s}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 border-line px-4 py-2 font-bangla hover:border-pink">
              <input
                type="checkbox"
                className="size-5 accent-pink"
                checked={checked[i]}
                onChange={(e) => setChecked((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
              />
              {s}
            </label>
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center text-center">
        <TensionGuy mood={moodFor(percent)} className="w-32" />
        <p className="font-display text-5xl font-black text-pink">{toBn(percent)}%</p>
        <p className="mt-2 font-bangla font-bold">{verdict}</p>
        <p className="mt-2 font-bangla text-xs text-muted">কোনো নাম লাগবে না। Mapun কারো খবর রাখে না।</p>
      </div>
    </div>
  );
}

function ExcuseGenerator() {
  const [context, setContext] = useState("office");
  const [excuse, setExcuse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const generate = (ctx = context) => {
    const pool = EXCUSES[ctx].filter((e) => e !== excuse);
    setExcuse(pick(pool));
    setCopied(false);
    sfx.pop();
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {EXCUSE_CONTEXTS.map((c) => (
          <Chip
            key={c.key}
            active={context === c.key}
            onClick={() => {
              setContext(c.key);
              generate(c.key);
            }}
          >
            {c.label}
          </Chip>
        ))}
      </div>
      <button type="button" className="btn btn-orange mt-4" onClick={() => generate()}>
        একটা Excuse দেন 🙊
      </button>
      {excuse && (
        <Card key={excuse} color="#FFB547">
          <p className="font-bangla text-xl leading-snug font-bold">“{excuse}”</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 font-bangla text-sm font-bold underline underline-offset-4"
            onClick={async () => setCopied(await copyText(excuse))}
          >
            <Copy className="size-4" /> {copied ? "Copy হয়েছে। দায়িত্ব আপনার।" : "Copy করেন"}
          </button>
          <p className="mt-2 font-bangla text-xs opacity-70">ব্যবহারের ফলাফলের জন্য Mapun দায়ী নয়।</p>
        </Card>
      )}
    </div>
  );
}

function TensionNews() {
  const [items, setItems] = useState(() => NEWS.slice(0, 3));
  const refresh = () => {
    const shuffled = [...NEWS].sort(() => Math.random() - 0.5);
    setItems(shuffled.slice(0, 3));
    sfx.tick();
  };
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-cream text-ink">
        <div className="flex items-center gap-3 bg-red px-4 py-2 text-text">
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="size-3 rounded-full bg-text" />
          <span className="font-display text-sm font-black tracking-widest">MAPUN NEWS · BREAKING</span>
        </div>
        <ul className="divide-y-2 divide-ink/10">
          <AnimatePresence mode="popLayout">
            {items.map((n, i) => (
              <motion.li key={n} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ delay: i * 0.08 }} className="px-4 py-3 font-bangla text-lg font-semibold">
                {n}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <button type="button" className="btn btn-cream mt-4" onClick={refresh}>
        আরো খবর দেন 📰
      </button>
      <p className="mt-2 font-bangla text-xs text-muted">সব খবর কাল্পনিক। কোনো সাংবাদিক আহত হননি।</p>
    </div>
  );
}

const SOUNDS = [
  { label: "ঢান ঢান ঢাআআন (Drama Zoom)", play: sfx.drama, color: "#FF3B3B" },
  { label: "ঢিশুম! (Fight)", play: sfx.dhishum, color: "#FF793D" },
  { label: "ঠাস! (চড়)", play: sfx.slap, color: "#FF70B8" },
  { label: "সাঁই (Whoosh)", play: sfx.whoosh, color: "#B78AFF" },
  { label: "ঠং! (লোহার পাইপ)", play: sfx.clang, color: "#C9A7FF" },
  { label: "মট্! (হৃদয় ভাঙা)", play: sfx.crack, color: "#FFB547" },
  { label: "জয়! (Hero Entry)", play: sfx.win, color: "#E8FF65" },
  { label: "হায় হায় (Fail)", play: sfx.fail, color: "#5CE1E6" },
];

function SoundBoard() {
  const soundOn = useTensionStore((s) => s.soundOn);
  const toggleSound = useTensionStore((s) => s.toggleSound);
  return (
    <div>
      {!soundOn && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed border-line p-4">
          <p className="font-bangla text-text/80">Sound এখন বন্ধ (default)। শুনতে হলে আগে চালু করেন।</p>
          <button type="button" className="btn btn-acid" onClick={toggleSound}>
            Sound চালু করেন 🔊
          </button>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {SOUNDS.map((s) => (
          <motion.button
            key={s.label}
            type="button"
            whileTap={{ scale: 0.9, rotate: -3 }}
            onClick={(e) => {
              s.play();
              burst(e.clientX, e.clientY, ["💥", "🎬", "😂"], 6);
            }}
            className="min-h-20 rounded-2xl border-[3px] border-ink px-4 py-3 font-bangla text-lg font-bold text-ink shadow-[4px_4px_0_#000]"
            style={{ background: s.color }}
          >
            {s.label}
          </motion.button>
        ))}
      </div>
      <p className="mt-3 font-bangla text-xs text-muted">
        Sound clip থাকলে সেটা বাজে, না থাকলে browser-এ বানানো (synth) শব্দ। Clip বদলাতে public/sounds ফোল্ডারে একই নামে নতুন ফাইল রাখুন।
      </p>
    </div>
  );
}

interface ChatMessage {
  from: "me" | "mapun";
  text: string;
}

function MapunChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: "mapun", text: "আসসালামু আলাইকুম! আমি Dr. Mapun। বলেন, কোন tension নিয়ে আসছেন?" }]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return setError("খালি message? আপনার মাথার মতো?");
    if (text.length > 200) return setError("এত বড় message পড়ার ধৈর্য Mapun-এর নেই। ২০০ অক্ষরের মধ্যে লিখেন।");
    setError(null);
    setDraft("");
    setMessages((m) => [...m, { from: "me", text }]);
    setTyping(true);
    const lower = text.toLowerCase();
    const rule = CHAT_RULES.find((r) => r.keywords.some((k) => lower.includes(k)));
    const reply = pick(rule ? rule.replies : CHAT_FALLBACK);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "mapun", text: reply }]);
      sfx.pop();
    }, 700 + Math.random() * 600);
  };

  return (
    <div className="rounded-3xl border-2 border-line bg-surface p-4 sm:p-5">
      <ul ref={listRef} className="flex h-72 flex-col gap-2 overflow-y-auto pr-1" aria-live="polite">
        {messages.map((m, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`max-w-[85%] rounded-2xl px-4 py-2 font-bangla ${m.from === "me" ? "self-end bg-orange text-ink" : "self-start bg-cream text-ink"}`}
          >
            {m.text}
          </motion.li>
        ))}
        {typing && <li className="self-start rounded-2xl bg-cream px-4 py-2 font-bangla text-ink/60">Dr. Mapun লিখছেন...</li>}
      </ul>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <label htmlFor="mapun-chat" className="sr-only">
          Message
        </label>
        <input id="mapun-chat" className="field" value={draft} maxLength={220} placeholder="যেমন: Boss reply দেয় না" onChange={(e) => setDraft(e.target.value)} />
        <button type="submit" className="btn btn-acid shrink-0 px-4" aria-label="পাঠান" disabled={typing}>
          <Send className="size-5" />
        </button>
      </form>
      {error && <p className="mt-2 font-bangla text-sm text-red">{error}</p>}
      <p className="mt-2 font-bangla text-xs text-muted">এটা AI না। Mapun-এর হাতে লেখা script, তাই উত্তরগুলো আগে থেকে ঠিক করা।</p>
    </div>
  );
}
