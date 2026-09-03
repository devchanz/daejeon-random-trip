import React from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';
import { MainExperience } from '../components/experience';
import { PixelCloud, PixelSparkle } from '../components/layout/AmbientDecorations';
import { visualAsset } from '../config/visualAssets';
import { FittedAsset } from '../components/common';
import { ZONES, PLACE_CANDIDATES } from '../data';
import { MOBILE_SLOT_FRAME_HEIGHT } from '../components/experience/slotGeometry';
import { BgmProvider } from '../lib/audio/bgmContext';
import { VisitBeacon } from '../components/analytics/VisitBeacon';

// Mobile hero short-height viewport budget: the height left for the brand logo
// once the chrome, Setup card, Setup<->Slot gap and the Slot chassis have each
// taken their token-driven share of `100svh` (see globals.css's hero token
// block for what each term means and why `svh`, never `dvh`). Deliberately
// stops at the chassis, not the helper band below it -- the approved contract
// is "full Slot chassis above the fold on supported short-height viewports;
// the helper band may sit below it and be reached by a natural scroll" (see
// docs/PROJECT_STATE.md). Consumed as a CSS custom property (not a literal)
// so it stays a single source of truth the browser recomputes on resize/rotate,
// rather than a value computed once in JS.
const MOBILE_LOGO_BUDGET = `calc(100svh - var(--chrome-h) - var(--hero-pad-t) - var(--hero-logo-pt) - var(--hero-setup-h) - var(--hero-stage-gap) - (${MOBILE_SLOT_FRAME_HEIGHT}))`;

// RightSidebar now embeds a live Random Log DB read (RandomLogRightRailPreview).
// Without this, `pnpm build` prerenders "/" as a static route and the preview's
// data gets baked in at build time instead of refetched per request -- verified
// empirically: Next 16.3.2 does not infer dynamic rendering from an uncached
// fetch() alone on a route with no dynamic segment or request-time API access.
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <BgmProvider>
      <div className="relative flex min-h-screen flex-col bg-[#fdfbf7] text-[#2b2520] overflow-x-clip">
      {/* Records exactly one visit per browser tab-session; mounted once here
          (not inside LeftSidebar, which mounts twice for the desktop/mobile
          responsive stages) so a real visit is never double-counted. */}
      <VisitBeacon />

      {/* 1. Retro OS & Browser Chrome Header */}
      <Header />

      {/* 2. DESKTOP / TABLET VISUAL STAGE (lg:block hidden)
          One unified visual stage with left sidebar, center experience, right sidebar,
          and a decorative ground layer anchored beneath the lower cards. */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-x-clip min-h-[calc(100svh-var(--chrome-h))]">
        {/* Main Content Stage with Fluid Max-Width up to 1760px */}
        <div className="relative z-10 mx-auto w-full max-w-[1760px] px-4 pt-5 pb-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Floating Ambient Sparkles */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
            <PixelSparkle color="#ffb800" size={16} className="absolute left-6 xl:left-8 top-16 opacity-80" />
            <PixelSparkle color="#ff5555" size={12} className="absolute left-1/4 top-12 opacity-70" />
            <PixelSparkle color="#38bdf8" size={14} className="absolute left-3 xl:left-6 top-2/3 opacity-75" />
            <PixelSparkle color="#ffb800" size={18} className="absolute right-8 xl:right-12 top-14 opacity-80" />
            <PixelSparkle color="#ff5555" size={14} className="absolute right-1/4 top-20 opacity-70" />
            <PixelSparkle color="#ffb800" size={14} className="absolute right-4 xl:right-8 top-1/2 opacity-75" />
          </div>

          <div className="relative flex flex-row items-start justify-center gap-4 xl:gap-7 2xl:gap-8">
            {/* Left Column: Title Footprint + MY PROFILE + TODAY IS... + BGM PLAYING */}
            <div className="relative w-[clamp(260px,21vw,360px)] shrink-0 flex flex-col gap-3.5">
              {/* Ambient Cloud behind top-left title.
                  Header measures 75px (titlebar 32 + 1px divider + nav row 40 + border-b-2)
                  and the column starts 4px below it, so the previous `-top-4` put the cloud
                  at y=63 -- 12px above the chrome divider, which read as accidental overlap.
                  `top-1` lands it at y=83, clearly below. Also pushed further outboard so it
                  sits beside rather than behind the enlarged logo. */}
              <PixelCloud className="absolute -left-8 top-1 w-32 h-14 opacity-75 z-0" />

              {/* Top-Left Brand Logo (Figma 01_BRAND / Brand/Logo/Primary).
                  The artwork is only 91.5% x 64.7% opaque, so ~35% of every height unit
                  was empty space -- which is why the previous height-driven rule read as
                  undersized while still costing the column real height. The box is now
                  given the OPAQUE aspect (622x264) and sized by WIDTH, with FittedAsset
                  applying the centralized compensation so the artwork fills it. Net
                  effect: visible width grows 64-86% for -5 to +5px of column height.
                  The clover, clouds and sparkles are baked into the artwork, so rendering
                  them again here would double the motif. */}
              <div className="relative z-10 flex items-center px-1 select-none">
                <FittedAsset
                  assetKey="brand.logo.primary"
                  alt="오늘 대전 갈래!"
                  width={680}
                  height={408}
                  className="h-auto w-[clamp(220px,17vw,270px)] aspect-[311/132]"
                />
              </div>

              <LeftSidebar />
            </div>

            {/* Center Column: Dominant Hero Experience (Setup -> Slot -> Result) */}
            <main className="flex-1 max-w-[clamp(620px,46vw,840px)] mx-auto flex flex-col items-center gap-2 min-w-0">
              <div className="w-full">
                <MainExperience zones={[...ZONES]} candidates={[...PLACE_CANDIDATES]} />
              </div>
            </main>

            {/* Right Column: TODAY'S PICK + MEMORY LOG */}
            <div className="relative w-[clamp(260px,21vw,360px)] shrink-0 flex flex-col gap-3.5">
              {/* Ambient Cloud behind top-right sidebar. Kept off the right edge: that
                  corner is occupied by the editorial card's perched mascot.
                  Vertically this cloud has to clear BOTH the chrome divider (y=75) and the
                  editorial card top (y~133), a 58px window. At `h-14` it did not fit, so
                  the height is trimmed to `h-12` and it now spans y=79-127 with real
                  clearance at both ends. Offsets and size only -- no z-index changes. */}
              <PixelCloud className="absolute -left-4 top-0 w-28 h-12 opacity-75 z-0" />

              {/* Perch band: reserves clearance for the mascot that overhangs the editorial
                  card's top-right corner, so the overhang never reaches the Header. Mirrors
                  the left column's brand band structurally, but is deliberately far shorter
                  -- that difference is exactly what gives the right rail more usable
                  vertical space than the left, which is the point. */}
              <div aria-hidden="true" className="min-h-[40px] xl:min-h-[46px] 2xl:min-h-[50px]" />

              <RightSidebar />
            </div>
          </div>
        </div>

        {/* 3. Decorative Ground Layer (Visual Stage Grounding)
            Anchored to the Visual Stage container, positioned inward to frame the side modules.
            z-0 sits behind the content wrapper (z-10 at the container above); the column
            elements are deliberately z-auto so they don't form their own stacking contexts,
            keeping in-flow fixed overlays (e.g. the Result Card) free to cover the whole page.
            pointer-events-none prevents click interception. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[clamp(24px,5vw,100px)] z-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visualAsset('footer.landscape.left')}
            alt=""
            className="h-[clamp(180px,14vw,250px)] w-auto object-contain object-left-bottom select-none"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-[clamp(24px,5vw,100px)] z-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visualAsset('footer.landscape.right')}
            alt=""
            className="h-[clamp(135px,10.5vw,185px)] w-auto object-contain object-right-bottom select-none"
          />
        </div>
      </div>

      {/* 3. MOBILE DEDICATED HERO & SECONDARY SECTION (lg:hidden) */}
      <div className="lg:hidden flex flex-col w-full">
        {/* Mobile First-View Core Hero: Fills initial viewport with core travel interaction.
            Short-height viewport hotfix (docs/PROJECT_STATE.md): `min-h` now reads the
            measured `--chrome-h` token (was a stale hard-coded 48px, ~24px short of the
            real Header height) and the section carries a real bottom gutter
            (`--hero-pad-b`) instead of a 2px anchor, so the fold never slices flush at
            the Slot artwork with nothing below it in view. */}
        <section className="flex flex-col justify-between min-h-[calc(100svh-var(--chrome-h))] pt-[var(--hero-pad-t)] px-3 pb-[var(--hero-pad-b)]">
          {/* Mobile Brand Logo. Same opaque-aspect box as desktop, but sized by HEIGHT
              (width follows from `aspect-[311/132]`, which keeps FittedAsset's
              aspect-preserving opaque-fit compensation valid) via a clamp whose middle
              term is `MOBILE_LOGO_BUDGET` -- the exact height left over, on THIS
              viewport, once the chrome/Setup card/Setup-Slot gap/Slot chassis have each
              taken their share of `100svh` (see globals.css's hero token block). This is
              what lets the logo give exactly enough to keep the Slot chassis above the
              fold instead of a hand-picked `vw`/`svh` guess: 78px/127px are the approved
              184px/300px width floor and ceiling re-expressed as heights (184 * 132/311,
              300 * 132/311). Below the supported short-height floor the clamp bottoms out
              at 78px and the page degrades to a natural document scroll, per the approved
              contract -- the Slot itself is never shrunk to force a fit. */}
          <div
            className="relative flex items-center justify-center pt-[var(--hero-logo-pt)] pb-0 select-none"
            style={{ ['--logo-budget' as string]: MOBILE_LOGO_BUDGET } as React.CSSProperties}
          >
            <FittedAsset
              assetKey="brand.logo.primary"
              alt="오늘 대전 갈래!"
              width={680}
              height={408}
              className="h-[clamp(78px,min(30svh,var(--logo-budget)),127px)] w-auto max-w-[min(72vw,300px)] aspect-[311/132]"
            />
              {/* Mobile-only quick-jump to the stacked right rail. On mobile the rails stack
                  below the hero, so Today’s Pick sits behind the whole hero plus three
                  LeftSidebar cards. A plain in-page anchor is enough -- no state, no scroll
                  listener, and this file stays a Server Component. Absolutely positioned so the
                  logo stays optically centred and the arrow can never overlap the artwork, so it
                  adds 0px of layout height. Hidden from the lg breakpoint up, where the right
                  rail is already on screen. */}
              <a
                href="#mobile-right-rail"
                aria-label="Today’s Pick과 Random Log로 이동"
                className="group lg:hidden absolute right-0 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center outline-none"
              >
                {/* The 44x44 anchor is the touch target; the 36px circle below is the
                    visible control. FINAL Phase 6 redesign: the pixel-arrow direction
                    (crispEdges 8x8 rects, coral fill) was rejected outright by Human Browser
                    + team review -- this control intentionally stops imitating the rest of
                    the retro/pixel/Y2K landing system. Its role is plain navigation utility
                    (jump to the mobile right rail), not expressive brand identity, so it now
                    reads as a familiar, neutral circular utility button (ChatGPT-style down-
                    arrow reference) instead: white circle, a light neutral border (not the
                    app's warm `line-control` token -- deliberately closer to true neutral
                    gray here, since this control is the one deliberate exception to the warm
                    palette), and a simple stroke-based arrow icon. No shadow -- the project's
                    global no-decorative-shadow contract holds; the light border alone gives
                    enough separation from the page. */}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] bg-white transition-all group-hover:bg-[#f7f7f7] group-active:translate-x-[1px] group-active:translate-y-[1px] group-focus-visible:ring-2 group-focus-visible:ring-[#2b2520] group-focus-visible:ring-offset-2"
                >
                  <svg
                    viewBox="0 0 20 20"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                    className="text-[#2b2520]"
                  >
                    {/* Simple vertical stem + two-stroke V arrowhead -- a plain modern
                        down-arrow glyph, not filled/blocky geometry. */}
                    <line x1="10" y1="4" x2="10" y2="14" />
                    <polyline points="5,9 10,14 15,9" />
                  </svg>
                </span>
              </a>
            </div>

          {/* Core Interactive Center (Setup + Large Slot + Helper) */}
          <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[480px] mx-auto">
            <MainExperience zones={[...ZONES]} candidates={[...PLACE_CANDIDATES]} />
          </main>
        </section>

        {/* Mobile Secondary Content: Discoverable below the initial fold */}
        <section className="flex flex-col gap-4 py-6 px-3 bg-[#faf7f0]/60 border-t-2 border-line-soft">
          <LeftSidebar />
          {/* Quick-jump target. The id lives on this MOBILE-ONLY wrapper, never inside
                RightSidebar: that component renders twice (desktop + mobile) and both
                mounts are always in the DOM, so an id on the component itself would
                duplicate. */}
            <div id="mobile-right-rail" className="scroll-mt-4">
              <RightSidebar className="mt-5" />
            </div>
        </section>
      </div>
      </div>
    </BgmProvider>
  );
}
