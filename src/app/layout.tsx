import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getSiteOrigin } from "../lib/share";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * DOS Gothic -- the selected production Korean/UI typeface.
 *
 * Selected by Human Browser review at the close of the font audition; the
 * temporary Stardust/Mona audition candidates and the ACTIVE_UI_FONT switch have
 * been removed. The CSS variable stays role-named (`--font-ui`) rather than
 * font-named, so `globals.css` does not have to change if the typeface ever does.
 *
 * Registered as a SINGLE 400 entry on purpose. Requests for 700/800/900 then find
 * no matching face and the browser applies synthetic bold. Declaring a '400 900'
 * range instead would tell the browser this one face covers the whole range,
 * suppressing synthesis and rendering every weight identically -- the opposite of
 * the intended result.
 *
 * KNOWN PRODUCTION TYPOGRAPHY LIMITATIONS (accepted; not solved on this branch):
 *
 *  1. No real Bold/ExtraBold companion file exists, and the source face is
 *     internally Medium/500, so synthesis starts from a heavier baseline than a
 *     true 400 would. Synthetic bold is a renderer approximation, is
 *     platform-dependent, and degrades pixel/bitmap-style faces. It is
 *     deliberately NOT paired with DOSIyagiBoldface or any other DOS face --
 *     those are separate designs, not weight variants of this family.
 *
 *  2. Glyphs the UI renders that this face lacks, verified via `cmap`:
 *       `·` U+00B7  -> SPINNING "선택 조건: 하루 · 산책"
 *       `“` `”`     -> READY "여행 뽑기!" quotes
 *       `…` U+2026  -> truncate / line-clamp ellipsis
 *       `▾` U+25BE  -> RESULT "결과 접기 ▾"
 *       plus `’`, `–`, `—`, `×`, `−`
 *     These fall back to Geist Sans, which is why it is retained in the
 *     --font-sans stack in globals.css rather than removed.
 *
 * `preload: false` is deliberate: this is a ~8.25MB TTF. Converting delivery to
 * WOFF2 and revisiting preload is a recorded non-blocking production follow-up.
 *
 * Licence: MIT, Damheo Lee -- see licenses/DOSGothic-LICENSE.txt.
 */
const dosGothic = localFont({
  src: [{ path: "./font/DOSGothic.ttf", weight: "400", style: "normal" }],
  variable: "--font-ui",
  display: "swap",
  preload: false,
});

const SITE_TITLE = "대전 랜덤 여행 | DAEJEON RANDOM TRIP";
const SITE_DESCRIPTION = "시간과 취향만 고르면 시작되는 대전 랜덤 여행";

/**
 * Single static brand OG asset (public/og-daejeon-random-trip.png, verified
 * 1200x630 opaque PNG). Not a src/config/visualAssets.ts entry -- that
 * registry is scoped to in-app game-art assets, this is a crawler/metadata
 * asset served directly from public/. Reused as-is (never route-specific,
 * never dynamically generated) by both this root default and
 * /r/[shareCode]'s per-route metadata.
 */
const OG_IMAGE = {
  url: "/og-daejeon-random-trip.png",
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${dosGothic.variable} ${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#2b2520]">{children}</body>
      {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
    </html>
  );
}
