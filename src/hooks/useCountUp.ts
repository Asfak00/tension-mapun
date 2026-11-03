"use client";

import { useEffect, useState } from "react";

/** Animates 0 → target with an ease-out once `run` is true. */
export function useCountUp(target: number, run: boolean, duration = 1800): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const t = ms ? Math.min(1, (now - start) / ms) : 1;
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}
