"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Scales a fixed-width child down to fit its container, keeping layout height right. */
export function FitToWidth({ width, children, className = "" }: { width: number; children: React.ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 1, height: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return;
      const scale = Math.min(1, outer.current.clientWidth / width);
      setBox({ scale, height: inner.current.offsetHeight * scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (outer.current) observer.observe(outer.current);
    if (inner.current) observer.observe(inner.current);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={outer} className={className} style={{ height: box.height || undefined }}>
      <div ref={inner} style={{ width, transform: `scale(${box.scale})`, transformOrigin: "top left", marginInline: box.scale === 1 ? "auto" : undefined }}>
        {children}
      </div>
    </div>
  );
}
