import type { Metadata } from "next";
import { Suspense } from "react";
import { PosterStudio } from "@/components/poster/PosterStudio";
import { Loading } from "@/components/shared/Loading";

export const metadata: Metadata = {
  title: "Tension Poster Studio",
  description: "WANTED, বাংলা সিনেমা, নিখোঁজ সংবাদ — আপনার tension score দিয়ে পাগলাটে poster বানান, নাম আর ছবি দিয়ে download বা share করেন।",
};

export default function PosterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PosterStudio />
    </Suspense>
  );
}
