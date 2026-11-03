import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tension Mapun",
    short_name: "Mapun",
    description: "আপনার টেনশন, আমাদের গবেষণা! কাল্পনিক tension score, prescription আর poster — শুধুই বিনোদন।",
    start_url: "/",
    display: "standalone",
    background_color: "#14111B",
    theme_color: "#14111B",
    lang: "bn",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
