import Link from "next/link";
import { MICROCOPY } from "@/data/jokes";
import { NAV } from "./nav";

const GITHUB_URL = "https://github.com/Asfak00/tension-mapun";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t-[3px] border-ink bg-acid text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-[clamp(2rem,7vw,4.5rem)] leading-[0.95] font-black tracking-tight">
            TENSION কমান,
            <br />
            না হলে MAPUN খান!
          </p>
          <p className="mt-6 max-w-lg font-bangla text-[15px] font-medium">{MICROCOPY.disclaimer}</p>
          <p className="mt-2 max-w-lg font-bangla text-[15px] font-medium">{MICROCOPY.realHelp}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-1 md:items-end">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="font-display text-lg font-bold hover:underline">
              {item.label} ↗
            </Link>
          ))}
          <Link href="/prescription" className="font-display text-lg font-bold hover:underline">
            Mapun Clinic ↗
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="font-display text-lg font-bold hover:underline">
            GitHub ↗
          </a>
        </nav>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 border-t-2 border-ink/20 px-4 py-4 text-center font-bangla text-sm font-semibold sm:flex-row sm:px-6 sm:text-left">
        <p>© Tension Mapun — কোনো ডাক্তার, কোনো গবেষক এই website-এর সাথে জড়িত নন। সত্যি।</p>
        <p>
          Created by{" "}
          <a href="https://asfakahmed.com" target="_blank" rel="noopener noreferrer" className="font-display font-black underline decoration-2 underline-offset-4 hover:text-pink">
            Asfak
          </a>{" "}
          · tension নিয়েই বানানো
        </p>
      </div>
    </footer>
  );
}
