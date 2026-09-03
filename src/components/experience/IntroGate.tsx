'use client';

import React, { useState } from 'react';
import { FittedAsset } from '../common';
import { SETUP_INTRO_COPY } from '../../content/setup';
import { usePrefersReducedMotion } from './motionConfig';

export interface IntroGateProps {
  onStart: () => void;
}

/**
 * Exit transition duration -- inside the ~150-220ms target from the approved
 * Phase 5 visual-correction brief. A plain JS timer (mirroring the
 * presentation-lifecycle pattern MainExperience already uses for the spin
 * sequence) rather than pulling in an animation library for one fade+scale.
 */
const EXIT_TRANSITION_MS = 200;

/**
 * Soft entry gate for the INTRO phase: a translucent warm veil + a small
 * ticket-style card, layered OVER the existing Setup/Slot hero (see the
 * `state.phase === 'intro'` render in MainExperience.tsx) rather than living
 * inside SetupArea's own fixed footprint the way the first Phase 5 pass did.
 * `absolute inset-0` against MainExperience's `relative` root means this
 * contributes 0px to document layout -- it paints over the existing Setup +
 * Slot box without ever changing its height, and unmounts without ever
 * having occupied flow space. Scoped to that box only (not the brand logo
 * above it in page.tsx), so the logo stays fully legible at all times.
 *
 * COPY STATUS: every string below comes from SETUP_INTRO_COPY
 * (src/content/setup.ts), which is explicitly marked TEMPORARY PLACEHOLDER
 * copy added only to evaluate this layout -- Phase 7 is the real copy pass.
 */
export function IntroGate({ onStart }: IntroGateProps) {
  const [isExiting, setIsExiting] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleStart = () => {
    if (isExiting) return;
    setIsExiting(true);
    // Let the fade/scale-out actually play before the phase flips (which
    // unmounts this overlay via MainExperience's state.phase check) --
    // reduced motion collapses the wait to effectively instant rather than
    // skipping the dispatch-delay path entirely, so there is one code path.
    window.setTimeout(onStart, prefersReducedMotion ? 0 : EXIT_TRANSITION_MS);
  };

  return (
    <div
      data-testid="intro-gate"
      className={`absolute inset-0 z-40 transition-opacity ease-out ${
        prefersReducedMotion ? 'duration-0' : 'duration-200'
      } ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Warm translucent veil -- spans the FULL Setup+Slot hero box (this
          component's `inset-0` parent), so the Slot machine stays visible
          (per the brief's "faintly visible... Slot hinted underneath")
          beneath the veil even though the gate card itself (below) only
          occupies the Setup band. Never a dark/grey modal backdrop; blur
          kept minimal (1.5px) -- a soft haze, not glassmorphism. Plain
          full-bleed rectangle (no corner rounding), since it spans both the
          rounded Setup card and the Slot chassis, two different shapes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#fdfbf7]/75 backdrop-blur-[1.5px]"
      />

      {/* Gate positioning band: pinned to the top of the overlay, height
          EXACTLY `--hero-setup-h` at EVERY breakpoint -- the same token
          SetupArea itself uses, with no `sm:` override. Combined with the
          ticket card below (`w-full h-full`, also no `sm:` override), this
          means the card's rect is byte-identical to SetupArea's own rect at
          every viewport width, mobile through desktop: same left/right
          edges (zero horizontal padding here, so both derive their width
          from the same MainExperience ancestor SetupArea itself fills),
          same top edge, same height. INTRO and Q1 are two states of the
          SAME card region -- not "the same on mobile, a different wider
          panel on desktop". A prior pass gave desktop its own independent
          width (`sm:w-[85%]`) and a taller positioning band (`sm:h-[calc(...)]`)
          to visually "bridge" toward the Slot -- Human Browser rejected
          that relationship outright, so both are removed rather than
          tuned further. */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-center h-[var(--hero-setup-h)]">
        {/* Compact ticket-style entry gate card -- same paper/perforation
            language as GuestbookComposer/SharedRouteView (Random Log
            family), not a generic SaaS modal and not an imitation of
            Result's painted raster frame. `w-full h-full` at every
            breakpoint (no `sm:` override) -- fills the positioning band
            above exactly, matching the Q1 section's own footprint (frozen
            `--hero-setup-h`) on desktop exactly as it already did on
            mobile, never a separate wide overlay panel. */}
        <div
          className={`relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-line-soft bg-[#fffef9] text-center transition-transform ease-out ${
            prefersReducedMotion ? 'duration-0' : 'duration-200'
          } ${isExiting ? 'scale-[0.98]' : 'scale-100'}`}
        >
          {/* Top ticket perforation -- same motif/value (#d8d0c2) as every
              other ticket-style surface in the app (GuestbookComposer,
              SharedRouteView, RouteGuideModal's header seam). */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
          />

          {/* `justify-center` inside the fixed-height mobile card (rather
              than fixed paddings) self-centers this content block within
              whatever room `--hero-setup-h` leaves after the perforation --
              robust against the placeholder copy's length changing later
              without needing hand-tuned padding math. */}
          <div className="flex h-full flex-col items-center justify-center gap-1.5 px-5 py-3 sm:h-auto sm:gap-2 sm:px-7 sm:py-6">
            {/* Eyebrow: existing star, plain "ENTRY TICKET" (no emoji),
                SAME star reused on the right for a symmetrical
                ★ ENTRY TICKET ★ -- literally the same FittedAsset call
                twice, not a re-approximated duplicate. */}
            <span className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#ff5555]">
              <FittedAsset assetKey="decoration.symbol.star" className="h-3 w-3 shrink-0" />
              <span>{SETUP_INTRO_COPY.eyebrow}</span>
              <FittedAsset assetKey="decoration.symbol.star" className="h-3 w-3 shrink-0" />
            </span>

            <h1 className="text-base sm:text-lg font-black leading-snug text-[#2b2520]">
              {SETUP_INTRO_COPY.headline}
            </h1>

            <p className="text-[11px] sm:text-xs font-bold text-[#6b6257]">
              {SETUP_INTRO_COPY.supporting}
            </p>

            <button
              type="button"
              onClick={handleStart}
              disabled={isExiting}
              className="mt-1 sm:mt-1.5 inline-flex w-full items-center justify-center rounded-xl border-2 border-[#ff3b3b] bg-[#ff5555] hover:bg-[#ff3b3b] px-6 py-2.5 text-sm sm:text-base font-black text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#2b2520] focus-visible:ring-offset-2 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
            >
              {SETUP_INTRO_COPY.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
