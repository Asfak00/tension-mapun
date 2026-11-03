import { MICROCOPY } from "@/data/jokes";

export function Loading({ text = MICROCOPY.loading }: { text?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center px-4" role="status">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex gap-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-4 animate-bounce rounded-full bg-orange"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="font-bangla text-lg text-text/80">{text}</p>
      </div>
    </div>
  );
}
