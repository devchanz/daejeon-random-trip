'use client';

import React from 'react';
import { normalizeRouteResult } from '../../lib/guide';
import { GuestbookComposer } from '../guestbook';
import { RouteGuideModal } from '../guide';
import { ResultArea } from './ResultArea';
import { useExperienceEngine } from './ExperienceProvider';
import { ResultSkinPreload } from './result';

/**
 * ExperienceOverlays -- the SINGLE render site for every viewport-global or
 * Portal-based piece of the experience (docs/DECISIONS.md ADR-036).
 *
 * WHY THIS EXISTS: `ResultArea` (in-flow `fixed`, ADR-008), `GuestbookComposer`
 * (same), `RouteGuideModal` (a Portal to `document.body`), and the reveal-
 * emphasis backdrop have no dependency on which breakpoint's column geometry
 * is active -- `ResultArea`'s backdrop is a full-viewport fixed box regardless,
 * and `RouteGuideModal` already escapes to `document.body`. Rendering them
 * from inside each duplicated `MainExperience` (Hero) presentation would let
 * BOTH Hero instances simultaneously satisfy the same shared-engine condition
 * (`isRouteGuideOpen && state.phase==='result' && state.result`), producing
 * two live `RouteGuideModal` Portals mounted to `document.body` at once and
 * two stacked reveal-emphasis/backdrop paints (visibly doubling dim/blur
 * opacity). Mounting this component exactly once (see page.tsx, outside both
 * dual-mount trees) makes duplication structurally impossible rather than
 * merely unlikely -- there is only one JSX expression that could ever
 * produce any of these elements.
 *
 * `ResultSkinPreload` is mounted here too (also single-instance) rather than
 * per-Hero, so the Result skin bands are fetched once, not per breakpoint.
 */
export function ExperienceOverlays() {
  const engine = useExperienceEngine();
  const { state, revealStage, rerollState, isGuestbookOpen, isRouteGuideOpen } = engine;

  return (
    <>
      {/* Temporary Reveal Emphasis Backdrop (subtle dim + backdrop-blur, pointer-events-none) */}
      {engine.isRevealEmphasis && (
        <div
          aria-hidden="true"
          data-testid="reveal-emphasis-overlay"
          className="pointer-events-none fixed inset-0 z-20 bg-[#2b2520]/15 backdrop-blur-[1.5px] transition-opacity duration-700 animate-reveal-fade-in motion-reduce:hidden"
        />
      )}

      {/* Prepare the Result skin raster bands during READY/SPINNING so an
          uncached first run doesn't decode them inside the reveal frame.
          Gated to those two phases (rather than mounted unconditionally) so a
          visitor who never reaches READY never pays for the fetch. */}
      <ResultSkinPreload
        active={state.phase === 'ready' || state.phase === 'spinning'}
        rerollReward={rerollState.rerollReward}
      />

      {/* Result Area: Centered focus overlay (Result Card), revealed after Slot Peek.
          isNestedOverlayOpen suspends Result's own Escape/Tab keyboard ownership while
          RouteGuideModal or GuestbookComposer is open above it -- see ResultArea.tsx. */}
      <ResultArea
        state={state}
        revealStage={revealStage}
        rerollReward={rerollState.rerollReward}
        hasLoggedCurrentResult={engine.hasLoggedCurrentResult}
        onOpenGuestbook={() => engine.setIsGuestbookOpen(true)}
        onExecuteReroll={engine.handleExecuteReroll}
        onOpenRouteGuide={() => engine.setIsRouteGuideOpen(true)}
        onMinimize={engine.handleMinimizeResult}
        onExploreMore={engine.handleExploreMore}
        isNestedOverlayOpen={isGuestbookOpen || isRouteGuideOpen}
      />

      {/* Guestbook Composer Modal (In-flow modal triggered from Result Card) */}
      {isGuestbookOpen && state.phase === 'result' && state.result && (
        <GuestbookComposer
          routeResult={state.result}
          isOpen={isGuestbookOpen}
          // 'locked' is the only reward state in which THIS submission can still
          // unlock the reroll -- mirrors renderRandomLogCTA's own copy branch in
          // ResultActions.tsx (rendered via ResultQuest), derived from the same rerollState, never duplicated.
          rewardEligible={rerollState.rerollReward === 'locked'}
          onClose={() => engine.setIsGuestbookOpen(false)}
          onSuccess={engine.handleGuestbookSuccess}
        />
      )}

      {/* Route Guide Modal (In-flow structured itinerary guidance, Portal to document.body) */}
      {isRouteGuideOpen && state.phase === 'result' && state.result && (
        <RouteGuideModal
          guideData={normalizeRouteResult(state.result)}
          isOpen={isRouteGuideOpen}
          onClose={() => engine.setIsRouteGuideOpen(false)}
        />
      )}
    </>
  );
}
