import Link from "next/link";
import { TensionGuy } from "@/components/characters/TensionGuy";
import type { Mood } from "@/types";

export function EmptyState({
  title,
  text,
  mood = "worried",
  cta = { href: "/tension", label: "আমার Tension Check করেন 😂" },
}: {
  title: string;
  text?: string;
  mood?: Mood;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
      <TensionGuy mood={mood} className="w-48" />
      <h1 className="mt-6 font-display text-[clamp(1.6rem,5vw,2.4rem)] leading-[1.25] font-black">{title}</h1>
      {text && <p className="mt-3 font-bangla text-lg text-text/75">{text}</p>}
      <Link href={cta.href} className="btn btn-orange mt-8">
        {cta.label}
      </Link>
    </div>
  );
}
