import type { Metadata, Viewport } from "next";
import { Geist, Hind_Siliguri, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/layout/Providers";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], weight: ["500", "700", "900"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const hind = Hind_Siliguri({ variable: "--font-hind", subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "Tension বেশি? Mapun খান! আপনার জীবনের যাবতীয় tension-এর বৈজ্ঞানিক (একদমই না) বিশ্লেষণ: কাল্পনিক score, Dr. Mapun-এর prescription, crazy poster আর বন্ধুর সাথে Tension Battle।";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Tension Mapun — আপনার টেনশন, আমাদের গবেষণা!", template: "%s · Tension Mapun" },
  description: DESCRIPTION,
  applicationName: "Tension Mapun",
  keywords: ["Tension Mapun", "tension test", "funny quiz", "Bangla meme", "বাংলা মজা", "টেনশন", "Tension Battle", "Bangladesh"],
  category: "entertainment",
  openGraph: {
    type: "website",
    siteName: "Tension Mapun",
    locale: "bn_BD",
    title: "Tension Mapun 😂 — আপনার tension score কত?",
    description: "২ মিনিটে tension মাপেন, তারপর বন্ধুকে challenge দেন। শুধুই বিনোদন।",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tension Mapun 😂",
    description: "আপনার টেনশন, আমাদের গবেষণা! (একদমই বৈজ্ঞানিক না)",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#14111B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={`${unbounded.variable} ${geist.variable} ${hind.variable}`}>
      <body className="antialiased">
        <Providers>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
