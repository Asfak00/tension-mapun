import { MICROCOPY } from "@/data/jokes";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <aside className={`rounded-2xl border-2 border-dashed border-line p-4 font-bangla text-sm text-muted ${className}`}>
      <p>
        <strong className="text-text">⚠ Disclaimer:</strong> {MICROCOPY.disclaimer}
      </p>
      <p className="mt-1">{MICROCOPY.realHelp}</p>
    </aside>
  );
}
