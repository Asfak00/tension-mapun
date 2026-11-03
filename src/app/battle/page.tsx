import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/shared/Loading";
import { Battle } from "@/components/tools/Battle";
import { cleanName } from "@/lib/share";

type Props = { searchParams: Promise<{ c?: string; n?: string; o?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { c, n, o } = await searchParams;
  const who = cleanName(n) || "আপনার বন্ধু";
  if (c && !o) {
    const title = `${who} আপনাকে Tension Battle-এ challenge দিয়েছে! ⚔`;
    const description = "Test দেন, তারপর দেখা যাক কে বেশি cooked। কোনো account লাগবে না।";
    return { title, description, openGraph: { title, description }, twitter: { title, description } };
  }
  return { title: "Tension Battle — কে বেশি cooked?", description: "বন্ধুকে challenge দেন, dramatic VS reveal-এ দেখেন কে বেশি tension-এ আছে।" };
}

export default function BattlePage() {
  return (
    <Suspense fallback={<Loading />}>
      <Battle />
    </Suspense>
  );
}
