const DEFAULT_ITEMS = ["😂", "💸", "💔", "🔥", "😵", "🌚", "📉"];

/** Throws a handful of emojis from a point. Pure DOM, no React re-render. */
export function burst(x: number, y: number, items: string[] = DEFAULT_ITEMS, count = 9) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.textContent = items[i % items.length];
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${20 + Math.random() * 18}px;pointer-events:none;z-index:9999;will-change:transform,opacity`;
    document.body.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 110;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 60;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.4) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${Math.random() * 120 - 60}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 80}px)) scale(0.8)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.3,1)" },
    ).onfinish = () => el.remove();
  }
}

export function burstFromEvent(event: { clientX: number; clientY: number }, items?: string[]) {
  burst(event.clientX, event.clientY, items);
}
