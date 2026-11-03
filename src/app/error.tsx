"use client";

import { TensionGuy } from "@/components/characters/TensionGuy";
import { MICROCOPY } from "@/data/jokes";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
      <TensionGuy mood="dead" className="w-48" />
      <h1 className="mt-6 font-display text-[clamp(1.6rem,5vw,2.4rem)] leading-[1.25] font-black">কিছু একটা ভেঙে গেছে!</h1>
      <p className="mt-3 font-bangla text-lg text-text/75">{MICROCOPY.networkError} আমরাও tension-এ আছি।</p>
      <button type="button" className="btn btn-orange mt-8" onClick={reset}>
        আরেকবার চেষ্টা করি
      </button>
    </div>
  );
}
