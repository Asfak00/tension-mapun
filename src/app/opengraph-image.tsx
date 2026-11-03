import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "Tension Mapun — your tension, our (very unscientific) research";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<OgFrame big="Tension kom?" sub="Check how cooked you are. Then challenge your friends." tag="NOT A REAL DIAGNOSIS" />, size);
}
