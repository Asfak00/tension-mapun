import { forwardRef } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { getCategory } from "@/data/categories";
import { POSTER_SIZE, type TemplateId } from "@/data/poster";
import { formatTaka, toBn } from "@/lib/bn";
import type { TensionResult } from "@/types";

export interface PosterInfo {
  name: string;
  nickname: string;
  area: string;
  job: string;
  crime: string;
  /** Downscaled data URL of the uploaded photo, or null for the cartoon. */
  photo: string | null;
}

interface Props {
  template: TemplateId;
  info: PosterInfo;
  result: TensionResult;
  host: string;
}

const INK = "#14111B";
const BROWN = "#3A2410";
const DISPLAY = "var(--font-unbounded), var(--font-hind), sans-serif";
const BANGLA = "var(--font-hind), sans-serif";

/** All posters render at 1080×1350 real pixels; the studio previews them scaled. */
export const Poster = forwardRef<HTMLDivElement, Props>(function Poster({ template, ...rest }, ref) {
  return (
    <div ref={ref} style={{ ...POSTER_SIZE, position: "relative", overflow: "hidden", fontFamily: BANGLA }}>
      {template === "wanted" && <Wanted {...rest} />}
      {template === "cinema" && <Cinema {...rest} />}
      {template === "missing" && <Missing {...rest} />}
    </div>
  );
});

function Face({ info, result, filter }: { info: PosterInfo; result: TensionResult; filter?: string }) {
  return info.photo ? (
    // eslint-disable-next-line @next/next/no-img-element -- local data URL inside an exported image
    <img src={info.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter }} />
  ) : (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", filter }}>
      <TensionGuy mood={result.level.mood} heat={result.score / 100} still className="h-[92%] w-auto" />
    </div>
  );
}

function Wanted({ info, result, host }: Omit<Props, "template">) {
  const name = info.name || "নাম প্রকাশে অনিচ্ছুক";
  return (
    <div style={{ position: "absolute", inset: 0, background: "#2A1A0E", padding: 34 }}>
      <div
        style={{
          position: "relative",
          height: "100%",
          background: "radial-gradient(ellipse at 50% 45%, #F7E8C4 50%, #E2C48A 85%, #B98A4C 100%)",
          border: `6px solid ${BROWN}`,
          transform: "rotate(-1deg)",
          color: BROWN,
          textAlign: "center",
          padding: "34px 56px 0",
        }}
      >
        {/* Nails, tape, coffee ring */}
        <div style={{ position: "absolute", top: 16, left: "50%", width: 26, height: 26, marginLeft: -13, borderRadius: 99, background: "#6B6B6B", border: "4px solid #222" }} />
        <div style={{ position: "absolute", top: -14, left: -30, width: 180, height: 50, background: "rgba(255,244,224,.75)", transform: "rotate(-30deg)" }} />
        <div style={{ position: "absolute", bottom: -10, right: -36, width: 200, height: 50, background: "rgba(255,244,224,.75)", transform: "rotate(-28deg)" }} />
        <div style={{ position: "absolute", top: 230, left: 40, width: 170, height: 170, borderRadius: 999, border: "12px solid rgba(110,60,20,.18)" }} />

        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 158, lineHeight: 1, letterSpacing: 0, marginTop: 24 }}>WANTED</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, marginTop: 6 }}>
          <span style={{ height: 6, width: 120, background: BROWN }} />
          DEAD OR TENSED
          <span style={{ height: 6, width: 120, background: BROWN }} />
        </div>

        <div style={{ position: "relative", width: 560, height: 430, margin: "26px auto 0", border: `10px solid ${BROWN}`, background: "#E9D3A3", transform: "rotate(1.2deg)", overflow: "hidden" }}>
          <Face info={info} result={result} filter="grayscale(1) sepia(.65) contrast(1.25)" />
          <div style={{ position: "absolute", right: -60, top: 34, transform: "rotate(32deg)", background: "#C1272D", color: "#F7E8C4", fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, padding: "8px 80px" }}>
            MOST COOKED
          </div>
        </div>

        <div style={{ fontWeight: 700, fontSize: 82, lineHeight: 1.15, marginTop: 22 }}>{name}</div>
        {info.nickname && <div style={{ fontWeight: 600, fontSize: 38, fontStyle: "italic" }}>ওরফে “{info.nickname}”</div>}

        <div style={{ textAlign: "left", fontSize: 32, lineHeight: 1.45, marginTop: 18, paddingRight: 250 }}>
          <div>
            <b>অপরাধ:</b> {info.crime}
          </div>
          <div>
            <b>শেষ দেখা গেছে:</b> {info.area || "Facebook-এ, রাত ৩টায়"}
          </div>
          <div>
            <b>পেশা:</b> {info.job || "Professional Overthinker"}
          </div>
        </div>

        {/* Score stamp */}
        <div
          style={{
            position: "absolute",
            right: 50,
            bottom: 170,
            width: 240,
            height: 240,
            borderRadius: 999,
            border: "10px double #C1272D",
            color: "#C1272D",
            transform: "rotate(-16deg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.9,
          }}
        >
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 76, lineHeight: 1 }}>{toBn(result.score)}</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20 }}>/১০০ TENSION</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 16, marginTop: 4 }}>{result.level.name}</div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, background: BROWN, color: "#F7E8C4", fontWeight: 700, fontSize: 44, padding: "14px 0" }}>
          পুরস্কার: {formatTaka(result.score * 1000)} + এক কাপ রং চা
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, fontSize: 24, fontWeight: 600 }}>খবর দিলে জানান: Mapun Clinic · {host}</div>
      </div>
    </div>
  );
}

function Cinema({ info, result, host }: Omit<Props, "template">) {
  const name = info.name || "নাম প্রকাশে অনিচ্ছুক";
  const cats = result.categories.slice(0, 3).map((id) => getCategory(id).name.replace(" Tension", ""));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "repeating-conic-gradient(from 0deg at 50% 36%, #FF793D 0deg 9deg, #FF4F8B 9deg 18deg)",
        color: INK,
        textAlign: "center",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 36%, rgba(255,240,120,.55) 0, rgba(0,0,0,0) 45%, rgba(20,17,27,.55) 100%)" }} />

      {/* Ribbon */}
      <div style={{ position: "absolute", top: 70, left: -70, transform: "rotate(-14deg)", background: "#E8FF65", border: `6px solid ${INK}`, fontWeight: 700, fontSize: 58, padding: "4px 110px", boxShadow: `8px 8px 0 ${INK}` }}>
        আসিতেছে!
      </div>
      <div style={{ position: "absolute", top: 46, right: 48, color: "#FFF4E0", fontWeight: 700, fontSize: 28, textAlign: "right", lineHeight: 1.3, textShadow: `3px 3px 0 ${INK}` }}>
        সারা দেশে একযোগে
        <br />
        মুক্তি পাচ্ছে ★
      </div>

      {/* Hero */}
      <div style={{ position: "absolute", top: 170, left: "50%", marginLeft: -270, width: 540, height: 540 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <svg key={i} viewBox="-30 -60 60 64" style={{ position: "absolute", left: 270 - 50, top: 270 - 330, width: 100, height: 110, transformOrigin: "50px 330px", transform: `rotate(${i * 30}deg)` }}>
            <path d="M0 0 C -24 -24, -12 -48, 0 -60 C 12 -48, 24 -24, 0 0 Z" fill={i % 2 ? "#E8FF65" : "#FF3B3B"} stroke={INK} strokeWidth="4" />
          </svg>
        ))}
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `14px solid ${INK}`, overflow: "hidden", background: "#FFF4E0" }}>
          <Face info={info} result={result} filter={info.photo ? "saturate(1.6) contrast(1.15)" : undefined} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          fontWeight: 700,
          fontSize: 220,
          lineHeight: 1.1,
          color: "#E8FF65",
          WebkitTextStroke: `10px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: `12px 12px 0 ${INK}`,
          transform: "rotate(-3deg)",
        }}
      >
        টেনশন
      </div>
      <div style={{ position: "absolute", top: 950, left: 0, right: 0 }}>
        <span style={{ background: INK, color: "#E8FF65", fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, padding: "8px 26px", display: "inline-block", transform: "rotate(2deg)" }}>
          MAPUN RATING {toBn(result.score)}/১০০ · {result.level.name}
        </span>
      </div>
      <div style={{ position: "absolute", top: 1030, left: 70, right: 70, fontWeight: 700, fontSize: 34, lineHeight: 1.35, color: "#FFF4E0", textShadow: `3px 3px 0 ${INK}` }}>
        যার জীবনে একটাই অপরাধ: “{info.crime}”
      </div>
      <div style={{ position: "absolute", top: 1130, left: 70, right: 70, background: "rgba(20,17,27,.82)", color: "#FFF4E0", fontSize: 25, lineHeight: 1.5, padding: "14px 20px", borderRadius: 14 }}>
        <b style={{ color: "#E8FF65" }}>নাম ভূমিকায়:</b> {name}
        {info.nickname ? ` (${info.nickname})` : ""} · <b style={{ color: "#E8FF65" }}>অভিনয়ে:</b> Boss, Ex, বাড়িওয়ালা ও বিকাশ balance
        <br />
        <b style={{ color: "#E8FF65" }}>সংগীত:</b> Teams notification · <b style={{ color: "#E8FF65" }}>লোকেশন:</b> {info.area || "মিরপুর ১০"} ·{" "}
        <b style={{ color: "#E8FF65" }}>পরিচালনা:</b> Dr. Mapun
        {cats.length > 0 && (
          <>
            <br />
            <b style={{ color: "#E8FF65" }}>Genre:</b> {cats.join(" + ")} Thriller
          </>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: INK, color: "#FFF4E0", fontWeight: 700, fontSize: 26, padding: "14px 0" }}>
        পরিবারের সবাইকে নিয়ে দেখুন (দেখবেন না) · {host}
      </div>
    </div>
  );
}

function Missing({ info, result, host }: Omit<Props, "template">) {
  const name = info.name || "জনৈক ব্যক্তি";
  const days = Math.max(3, result.score);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#EDE6D6", color: "#111", padding: "46px 60px" }}>
      {/* Newspaper masthead */}
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid #111", paddingBottom: 8, fontSize: 22, fontWeight: 600 }}>
        <span>দৈনিক টেনশন বার্তা</span>
        <span>মূল্য: এক কাপ চা</span>
        <span>পৃষ্ঠা ৪৭</span>
      </div>
      <div style={{ borderBottom: "8px double #111", textAlign: "center", padding: "10px 0 6px" }}>
        <div style={{ fontWeight: 700, fontSize: 150, lineHeight: 1.05, letterSpacing: 2 }}>নিখোঁজ!</div>
        <div style={{ fontWeight: 600, fontSize: 34, marginTop: -4 }}>{name}-এর মনের শান্তি</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "430px 1fr", gap: 36, marginTop: 30 }}>
        <div>
          <div style={{ width: 430, height: 500, border: "6px solid #111", overflow: "hidden", background: "#d8d0bd" }}>
            <Face info={info} result={result} filter="grayscale(1) contrast(1.4) brightness(1.05)" />
          </div>
          <div style={{ fontSize: 22, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>ছবি: শান্তি হারানোর আগে (সম্ভবত)</div>
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.5, textAlign: "justify" }}>
          <p style={{ margin: 0 }}>
            এতদ্বারা সকলের অবগতির জন্য জানানো যাচ্ছে যে, <b>{name}</b>
            {info.nickname ? ` (ওরফে ${info.nickname})` : ""}-এর মনের শান্তি গত <b>{toBn(days)} দিন</b> ধরে নিখোঁজ।
          </p>
          <p style={{ margin: "18px 0 0" }}>
            <b>সর্বশেষ দেখা গেছে:</b> {info.area || "salary-র দিন, ATM বুথের সামনে"}।
          </p>
          <p style={{ margin: "10px 0 0" }}>
            <b>পেশা:</b> {info.job || "Professional Overthinker"}।
          </p>
          <p style={{ margin: "10px 0 0" }}>
            <b>নিখোঁজের কারণ:</b> {info.crime}।
          </p>
          <p style={{ margin: "10px 0 0" }}>
            <b>পরনে ছিল:</b> tension-এর গেঞ্জি আর হতাশার লুঙ্গি।
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 34, border: "4px solid #111", padding: "18px 26px" }}>
        <div style={{ textAlign: "center", minWidth: 210 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 84, lineHeight: 1 }}>{toBn(result.score)}</div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>/১০০ Tension Level</div>
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.4, borderLeft: "3px solid #111", paddingLeft: 26 }}>
          সন্ধানদাতাকে পুরস্কৃত করা হবে: <b>এক প্লেট কাচ্চি</b> (বোরহানি ছাড়া)। শান্তি খুঁজে পেলে দয়া করে ফেরত দিন, প্রশ্ন করা হবে না।
        </div>
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", justifyContent: "space-between", borderTop: "3px solid #111", paddingTop: 10, fontSize: 22, fontWeight: 600 }}>
        <span>যোগাযোগ: Mapun Clinic</span>
        <span>{host}</span>
      </div>
      <div style={{ position: "absolute", left: 230, top: 690, transform: "rotate(-12deg)", background: "rgba(237,230,214,.85)", border: "6px solid #C1272D", color: "#C1272D", fontFamily: DISPLAY, fontWeight: 900, fontSize: 36, padding: "4px 18px", opacity: 0.85 }}>
        {result.level.name}
      </div>
    </div>
  );
}
