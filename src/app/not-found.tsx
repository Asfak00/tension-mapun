import { EmptyState } from "@/components/shared/EmptyState";
import { MICROCOPY } from "@/data/jokes";

export default function NotFound() {
  return (
    <div>
      <p className="pt-10 text-center font-display text-[clamp(5rem,20vw,10rem)] leading-none font-black text-orange">৪০৪</p>
      <EmptyState title={MICROCOPY.notFound} text="হয়তো এটাও Canada চলে গেছে। আপনি home-এ ফেরত যান।" mood="dead" cta={{ href: "/", label: "Home-এ ফেরত যাই" }} />
    </div>
  );
}
