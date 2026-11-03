"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NAV } from "./nav";
import { SoundToggle } from "./SoundToggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="প্রধান" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 font-bangla text-[15px] font-semibold transition-colors ${
                  active ? "bg-text text-ink" : "text-text/80 hover:bg-surface hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border-2 border-line lg:hidden"
            aria-label={open ? "Menu বন্ধ" : "Menu খুলুন"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="মোবাইল"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-2 overflow-y-auto bg-orange px-4 py-6 text-ink lg:hidden"
          >
            {NAV.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.12 + i * 0.05 }}
              >
                <Link href={item.href} className="flex items-baseline justify-between border-b-2 border-ink/20 py-4">
                  <span className="font-display text-2xl font-black">{item.label}</span>
                  <span className="font-bangla text-sm font-semibold">{item.note}</span>
                </Link>
              </motion.div>
            ))}
            <p className="mt-auto font-bangla text-sm font-semibold">Tension কমান, না হলে Mapun খান!</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
