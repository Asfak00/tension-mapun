const LINES = [
  "আপনার মাথায় এখন ৪৭টা Chrome tab open!",
  "Boss-এর Hi দেখেই heartbeat বেড়ে গেছে?",
  "আপনার tension দেখে calculator-ও resign দিয়েছে।",
  "আপনি tension নিচ্ছেন, tension আপনাকে নিচ্ছে না তো?",
  "ভাই, আপনি তো পুরাই cooked!",
  "আপনার future বর্তমানে আপনাকে avoid করছে।",
];

export function Marquee({ className = "", tone = "acid" }: { className?: string; tone?: "acid" | "pink" }) {
  const bg = tone === "acid" ? "bg-acid" : "bg-pink";
  return (
    <div className={`overflow-hidden border-y-[3px] border-ink ${bg} py-3 text-ink ${className}`} aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {[...LINES, ...LINES].map((line, i) => (
          <span key={i} className="flex items-center gap-8 font-bangla text-lg font-bold">
            {line}
            <span className="font-display text-xl">✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}
