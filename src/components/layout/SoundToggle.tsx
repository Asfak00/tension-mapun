"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useHydrated, useTensionStore } from "@/store/useTensionStore";
import { sfx } from "@/lib/sound";

export function SoundToggle() {
  const hydrated = useHydrated();
  const soundOn = useTensionStore((s) => s.soundOn) && hydrated;
  const toggle = useTensionStore((s) => s.toggleSound);
  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        sfx.drama();
      }}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Sound বন্ধ করেন" : "Sound চালু করেন"}
      title={soundOn ? "শব্দ চালু। প্রতিবেশী জেগে যাবে।" : "শব্দ বন্ধ (default)। চালু করলে বাংলা সিনেমার drama শুরু!"}
      className={`grid size-11 place-items-center rounded-full border-2 transition-colors ${
        soundOn ? "border-acid bg-acid text-ink" : "border-line text-muted hover:border-text hover:text-text"
      }`}
    >
      {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
    </button>
  );
}
