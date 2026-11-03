import { BrandFace } from "@/components/characters/BrandFace";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Share-image layout used by the site and result previews. Text stays Latin:
 * next/og's renderer cannot shape Bangla script correctly.
 */
export function OgFrame({ big, sub, accent = "#E8FF65", tag }: { big: string; sub: string; accent?: string; tag: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#14111B", color: "#F9F5FF", fontFamily: "sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", right: -140, top: -60, width: 760, height: 760, borderRadius: 9999, background: "#2C2539", display: "flex" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "#E8FF65", color: "#14111B", display: "flex", alignItems: "center", paddingLeft: 60, fontSize: 30, fontWeight: 800 }}>
        Tension beshi? Mapun khan!  ·  100% fictional · 0% science
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "56px 60px", width: 720 }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 900, letterSpacing: 2 }}>
          TENSION&nbsp;<span style={{ color: "#E8FF65" }}>MAPUN</span>
        </div>
        <div style={{ display: "flex", fontSize: big.length > 8 ? 110 : 190, fontWeight: 900, lineHeight: 1, marginTop: 40, color: accent }}>{big}</div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, marginTop: 24, lineHeight: 1.2 }}>{sub}</div>
        <div style={{ display: "flex", marginTop: 30 }}>
          <div style={{ display: "flex", background: "#FF70B8", color: "#14111B", border: "5px solid #000", borderRadius: 14, padding: "8px 20px", fontSize: 28, fontWeight: 900, transform: "rotate(-3deg)" }}>
            {tag}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 110, display: "flex", transform: "rotate(8deg)" }}>
        <BrandFace size={400} />
      </div>
    </div>
  );
}
