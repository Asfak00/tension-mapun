import type { Metadata } from "next";
import { Suspense } from "react";
import { TensionFlow } from "@/components/questionnaire/TensionFlow";
import { Loading } from "@/components/shared/Loading";

export const metadata: Metadata = { title: "Tension Check", description: "৯ ধরনের tension থেকে বাছেন, মজার প্রশ্নের উত্তর দেন, আর দেখেন আপনি কতটা cooked।" };

export default function TensionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TensionFlow />
    </Suspense>
  );
}
