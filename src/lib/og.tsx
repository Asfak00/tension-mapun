import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BrandFace } from "@/components/characters/BrandFace";

export const OG_SIZE = { width: 1200, height: 630 };

const SITE_HOST = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").host;

const fontsDir = join(process.cwd(), "src/assets/fonts");
const fonts = Promise.all([
  readFile(join(fontsDir, "Unbounded-Bold.ttf")),
  readFile(join(fontsDir, "Unbounded-Black.ttf")),
]).then(([bold, black]) => [
  { name: "Unbounded", data: bold, weight: 700 as const, style: "normal" as const },
  { name: "Unbounded", data: black, weight: 900 as const, style: "normal" as const },
]);

/** Renders a share image with the site's display font loaded. */
export async function ogImage(element: React.ReactElement, init?: { headers?: Record<string, string> }) {
  return new ImageResponse(element, { ...OG_SIZE, ...init, fonts: await fonts });
}

/**
 * Share-image layout used by the site and result previews. Text stays Latin:
 * next/og's renderer cannot shape Bangla script correctly.
 */
export function OgFrame({ big, sub, accent = "#E8FF65", tag }: { big: string; sub: string; accent?: string; tag: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#14111B", color: "#F9F5FF", fontFamily: "Unbounded", position: "relative" }}>
      <div style={{ position: "absolute", right: -140, top: -60, width: 760, height: 760, borderRadius: 9999, background: "#2C2539", display: "flex" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "#E8FF65", color: "#14111B", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", fontSize: 24, fontWeight: 900 }}>
        <span>100% fictional · 0% science</span>
        <span>{SITE_HOST}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "50px 60px", width: 760 }}>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>
          TENSION&nbsp;<span style={{ color: "#E8FF65" }}>MAPUN</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: big.length > 8 ? 92 : 150, fontWeight: 900, lineHeight: 1, letterSpacing: -2, marginTop: 34, color: accent }}>{big}</div>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, marginTop: 24, lineHeight: 1.3, width: 640 }}>{sub}</div>
        <div style={{ display: "flex", marginTop: 26 }}>
          <div style={{ display: "flex", background: "#FF70B8", color: "#14111B", border: "5px solid #000", borderRadius: 14, padding: "6px 18px", fontSize: 24, fontWeight: 900, transform: "rotate(-3deg)" }}>
            {tag}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 100, display: "flex", transform: "rotate(8deg)" }}>
        <BrandFace size={380} />
      </div>
    </div>
  );
}
