import { getCategory } from "@/data/categories";
import { OgFrame, ogImage } from "@/lib/og";
import { computeResult } from "@/lib/scoring";

/** Per-result preview image, linked from /result?r=... metadata. */
export function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("r") ?? "";
  const result = computeResult(code);
  if (!result) {
    return ogImage(<OgFrame big="404" sub="Ei link-o tension niye palaye geche." tag="BROKEN LINK" />);
  }
  const cats = result.categories
    .slice(0, 3)
    .map((id) => getCategory(id).name.replace(" Tension", ""))
    .join(" + ");
  return ogImage(
    <OgFrame big={`${result.score}/100`} sub={`${result.level.name} — ${cats}`} accent={result.level.color} tag="HOW COOKED ARE YOU?" />,
    { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
