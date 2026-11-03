/** Logo face as plain SVG so next/og (Satori) can render it in icons and share images. */
export function BrandFace({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="33" r="27" fill="#FF793D" stroke="#14111B" strokeWidth="5" />
      <path d="M14 22 L24 18 M40 18 L50 22" stroke="#14111B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="22" cy="30" r="7" fill="#fff" stroke="#14111B" strokeWidth="3" />
      <circle cx="42" cy="30" r="7" fill="#fff" stroke="#14111B" strokeWidth="3" />
      <circle cx="22" cy="30" r="2.6" fill="#14111B" />
      <circle cx="42" cy="30" r="2.6" fill="#14111B" />
      <path d="M19 47 q4.3 -5 8.6 0 t8.6 0 t8.6 0" stroke="#14111B" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M54 6 c-5 8 -5 12 0 13 c5 -1 5 -5 0 -13z" fill="#7FD8FF" stroke="#14111B" strokeWidth="2.5" />
    </svg>
  );
}
