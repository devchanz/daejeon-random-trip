import React from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';
import { MainExperience } from '../components/experience';
import { PixelCloud, PixelSparkle } from '../components/layout/AmbientDecorations';
import { ZONES, PLACE_CANDIDATES } from '../data';

// RightSidebar now embeds a live Random Log DB read (RandomLogRightRailPreview).
// Without this, `pnpm build` prerenders "/" as a static route and the preview's
// data gets baked in at build time instead of refetched per request -- verified
// empirically: Next 16.3.2 does not infer dynamic rendering from an uncached
// fetch() alone on a route with no dynamic segment or request-time API access.
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#fdfbf7] text-[#2b2520] overflow-x-clip">
      {/* 1. Retro OS & Browser Chrome Header */}
      <Header />

      {/* 2. DESKTOP / TABLET VISUAL STAGE (lg:block hidden)
          One unified visual stage with left sidebar, center experience, right sidebar,
          and a decorative ground layer anchored beneath the lower cards. */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-x-clip min-h-[calc(100svh-48px)]">
        {/* Main Content Stage with Fluid Max-Width up to 1760px */}
        <div className="relative z-10 mx-auto w-full max-w-[1760px] px-4 pt-1 pb-4 sm:px-6 lg:px-8 xl:px-12">
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
              {/* Ambient Cloud behind top-left title */}
              <PixelCloud className="absolute -left-6 -top-4 w-32 h-14 opacity-75 z-0" />

              {/* Top-Left Brand Title Footprint (Reserved dedicated zone for future title artwork) */}
              <div className="relative z-10 min-h-[50px] xl:min-h-[56px] flex items-center gap-2 px-1 select-none">
                <span className="text-2xl xl:text-3xl font-black tracking-tight text-[#ff3333] drop-shadow-[2px_2px_0px_#ffb800]">
                  대전 갈래..?
                </span>
                <span className="text-xl" role="img" aria-label="Clover">
                  🍀
                </span>
                <PixelSparkle color="#ffb800" size={14} className="ml-0.5 inline-block" />
              </div>

              <LeftSidebar />
            </div>

            {/* Center Column: Dominant Hero Experience (Setup -> Slot -> Result) */}
            <main className="flex-1 max-w-[clamp(620px,46vw,840px)] mx-auto flex flex-col items-center gap-2 min-w-0">
              <div className="w-full">
                <MainExperience zones={[...ZONES]} candidates={[...PLACE_CANDIDATES]} />
              </div>
            </main>

            {/* Right Column: TODAY'S PICK + VISITOR LOG */}
            <div className="relative w-[clamp(260px,21vw,360px)] shrink-0 flex flex-col gap-3.5">
              {/* Ambient Cloud behind top-right sidebar */}
              <PixelCloud className="absolute -right-6 -top-4 w-32 h-14 opacity-75 z-0" />
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
            src="/assets/footer-landscape-left.png"
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
            src="/assets/footer-landscape-right.png"
            alt=""
            className="h-[clamp(135px,10.5vw,185px)] w-auto object-contain object-right-bottom select-none"
          />
        </div>
      </div>

      {/* 3. MOBILE DEDICATED HERO & SECONDARY SECTION (lg:hidden) */}
      <div className="lg:hidden flex flex-col w-full">
        {/* Mobile First-View Core Hero: Fills initial viewport with core travel interaction */}
        <section className="flex flex-col justify-between min-h-[calc(100svh-48px)] py-1.5 px-3">
          {/* Mobile Top Title Display */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5 pb-0.5 select-none">
            <span className="text-2xl font-black tracking-tight text-[#ff3333] drop-shadow-[2px_2px_0px_#ffb800]">
              대전 갈래..?
            </span>
            <span className="text-xl" role="img" aria-label="Clover">
              🍀
            </span>
          </div>

          {/* Core Interactive Center (Setup + Large Slot + Helper) */}
          <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[480px] mx-auto">
            <MainExperience zones={[...ZONES]} candidates={[...PLACE_CANDIDATES]} />
          </main>

          {/* Bottom spacing anchor */}
          <div className="h-0.5" />
        </section>

        {/* Mobile Secondary Content: Discoverable below the initial fold */}
        <section className="flex flex-col gap-4 py-6 px-3 bg-[#faf7f0]/60 border-t-2 border-[#2b2520]/10">
          <LeftSidebar />
          <RightSidebar />
        </section>
      </div>
    </div>
  );
}
