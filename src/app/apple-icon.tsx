import { ImageResponse } from "next/og";
import { BrandFace } from "@/components/characters/BrandFace";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#E8FF65" }}>
        <BrandFace size={150} />
      </div>
    ),
    size,
  );
}
