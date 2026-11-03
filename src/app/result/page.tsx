import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultView } from "@/components/result/ResultView";
import { Loading } from "@/components/shared/Loading";
import { computeResult } from "@/lib/scoring";
import { cleanName } from "@/lib/share";

type Props = { searchParams: Promise<{ r?: string; n?: string }> };

/** Shared result links preview with the actual score. */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { r, n } = await searchParams;
  const result = r ? computeResult(r) : null;
  if (!result) return { title: "আপনার Tension Report" };
  const who = cleanName(n);
  const title = `${who ? `${who}: ` : ""}${result.score}/100 — ${result.level.name}`;
  const description = `${who || "একজন"} Tension Mapun-এ ${result.score}/100 পেয়েছে। আপনি কতটা cooked? Check করেন।`;
  const image = `/og?r=${encodeURIComponent(r!)}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultView />
    </Suspense>
  );
}
