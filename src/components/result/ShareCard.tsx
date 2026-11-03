import { forwardRef } from "react";
import { TensionGuy } from "@/components/characters/TensionGuy";
import { getCategory } from "@/data/categories";
import { toBn } from "@/lib/bn";
import type { ResultReport, TensionResult } from "@/types";

export type CardFormat = "feed" | "story";
export const CARD_SIZE: Record<CardFormat, { width: number; height: number }> = {
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};

interface Props {
  result: TensionResult;
  report: ResultReport;
  format: CardFormat;
  name: string;
  host: string;
}

/** Full-size social card (1080 wide). Rendered at real pixels, previewed scaled. */
export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard({ result, report, format, name, host }, ref) {
  const { width, height } = CARD_SIZE[format];
  const story = format === "story";
  const { level, score } = result;
  return (
    <div
      ref={ref}
      style={{ width, height, background: "#14111B", fontFamily: "var(--font-hind), sans-serif" }}
      className="relative flex flex-col overflow-hidden text-text"
    >
      {/* Level-colored slab */}
      <div
        className="absolute"
        style={{
          background: level.color,
          width: 1500,
          height: story ? 1100 : 820,
          left: -210,
          top: story ? 420 : 300,
          transform: "rotate(-7deg)",
          borderTop: "8px solid #000",
          borderBottom: "8px solid #000",
        }}
      />

      <div className="relative flex items-center justify-between" style={{ padding: "64px 72px 0" }}>
        <div className="font-display font-black" style={{ fontSize: 46, lineHeight: 1 }}>
          TENSION <span style={{ color: "#E8FF65" }}>MAPUN</span>
        </div>
        <div
          className="font-display font-black text-ink"
          style={{ fontSize: 26, background: "#FF70B8", border: "5px solid #000", borderRadius: 14, padding: "10px 20px", transform: "rotate(4deg)" }}
        >
          OFFICIAL REPORT
        </div>
      </div>

      <div className="relative font-bold" style={{ padding: "28px 72px 0", fontSize: 38, color: "#A79DB8" }}>
        {name ? `${name}-এর Tension Report` : "একজন অতিরিক্ত চিন্তিত মানুষের Report"}
      </div>

      <div className="relative flex items-end justify-between" style={{ padding: story ? "120px 60px 0 72px" : "40px 60px 0 72px" }}>
        <div className="text-ink">
          <div className="font-display font-black" style={{ fontSize: story ? 330 : 290, lineHeight: 0.9, letterSpacing: -8 }}>
            {toBn(score)}
          </div>
          <div className="font-display font-black" style={{ fontSize: 64, marginTop: 8 }}>
            / ১০০
          </div>
          <div
            className="font-display font-black"
            style={{ display: "inline-block", marginTop: 24, fontSize: 40, background: "#14111B", color: level.color, padding: "10px 22px", borderRadius: 12, transform: "rotate(-3deg)" }}
          >
            {level.name}
          </div>
        </div>
        <div style={{ width: story ? 460 : 400, marginBottom: -20 }}>
          <TensionGuy mood={level.mood} heat={score / 100} still className="h-auto w-full" />
        </div>
      </div>

      <div className="relative text-ink" style={{ padding: story ? "70px 72px 0" : "36px 72px 0" }}>
        <p className="font-black" style={{ fontSize: story ? 60 : 52, lineHeight: 1.3 }}>
          {report.headline}
        </p>
        {story && (
          <p className="font-semibold" style={{ fontSize: 38, lineHeight: 1.45, marginTop: 28 }}>
            {report.diagnosis}
          </p>
        )}
      </div>

      <div className="relative mt-auto" style={{ padding: "0 72px" }}>
        <div className="flex flex-wrap" style={{ gap: 14, marginBottom: 32 }}>
          {result.categories.map((id) => {
            const cat = getCategory(id);
            return (
              <span
                key={id}
                className="font-display font-bold text-ink"
                style={{ fontSize: 26, background: cat.color, border: "4px solid #000", borderRadius: 999, padding: "8px 20px" }}
              >
                {cat.emoji} {cat.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="relative text-ink" style={{ background: "#E8FF65", borderTop: "6px solid #000", padding: "34px 72px" }}>
        <p className="font-bold" style={{ fontSize: 40, lineHeight: 1.35 }}>
          “{report.shareJoke}”
        </p>
        <p className="font-display font-bold" style={{ fontSize: 28, marginTop: 14, opacity: 0.75 }}>
          তোমার score কত? → {host}
        </p>
      </div>
    </div>
  );
});
