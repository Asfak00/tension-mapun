import { OG_SIZE, OgFrame, ogImage } from "@/lib/og";

export const alt = "Tension Mapun — your tension, our (very unscientific) research";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage(<OgFrame big="Tension beshi?" sub="Mapun khan! Check how cooked you are, then challenge your friends." tag="NOT A REAL DIAGNOSIS" />);
}
