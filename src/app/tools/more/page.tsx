import type { Metadata } from "next";
import { Extras } from "@/components/tools/Extras";

export const metadata: Metadata = { title: "আরো পাগলামি", description: "Daily Tension Horoscope, Boss Mood Predictor, Excuse Generator, Ex Detector আর Tension News।" };

export default function MorePage() {
  return <Extras />;
}
