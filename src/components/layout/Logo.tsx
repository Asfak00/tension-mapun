import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="Tension Mapun হোম">
      <span className="relative grid size-10 place-items-center rounded-full border-[3px] border-ink bg-orange text-xl shadow-[3px_3px_0_#000] transition-transform group-hover:rotate-[-12deg]">
        <svg viewBox="0 0 40 40" className="size-7" aria-hidden>
          <circle cx="14" cy="17" r="4" fill="#14111B" />
          <circle cx="26" cy="17" r="4" fill="#14111B" />
          <circle cx="15" cy="16" r="1.4" fill="#fff" />
          <circle cx="27" cy="16" r="1.4" fill="#fff" />
          <path d="M12 29 q4 -5 8 0 t8 0" stroke="#14111B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M31 6 q3 4 0 7" stroke="#14111B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-[15px] leading-none font-black tracking-tight">
        TENSION
        <span className="block text-acid">MAPUN</span>
      </span>
    </Link>
  );
}
