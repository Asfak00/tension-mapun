import { CategoryWall } from "@/components/home/CategoryWall";
import { RandomTensionCard } from "@/components/home/RandomTensionCard";
import { ToolIndex } from "@/components/home/ToolIndex";
import { Hero } from "@/components/hero/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryWall />
      <RandomTensionCard />
      <ToolIndex />
    </>
  );
}
