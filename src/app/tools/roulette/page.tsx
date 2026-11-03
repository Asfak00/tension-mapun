import type { Metadata } from "next";
import { Roulette } from "@/components/tools/Roulette";

export const metadata: Metadata = { title: "Tension Roulette", description: "চাকা ঘুরান, নতুন একটা অযথা tension নিয়ে বাড়ি যান।" };

export default function RoulettePage() {
  return <Roulette />;
}
