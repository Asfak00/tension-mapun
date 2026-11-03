import type { Metadata } from "next";
import { Suspense } from "react";
import { PrescriptionView } from "@/components/prescription/PrescriptionView";
import { Loading } from "@/components/shared/Loading";

export const metadata: Metadata = { title: "Mapun Clinic Prescription", description: "Dr. Mapun (MBBS — Mapun-Based Bachelor of Bullshit Studies)-এর কাল্পনিক prescription।" };

export default function PrescriptionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PrescriptionView />
    </Suspense>
  );
}
