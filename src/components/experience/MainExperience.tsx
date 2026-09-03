'use client';

import React, { useEffect, useRef } from 'react';
import { SetupArea } from './SetupArea';
import { SlotAnchor } from './SlotAnchor';
import { IntroGate } from './IntroGate';
import { useExperienceEngine } from './ExperienceProvider';

export interface MainExperienceProps {
  className?: string;
}

/**
 * MainExperience -- the responsive HERO presentation (Setup + Slot + INTRO
 * gate), rendered once per breakpoint by page.tsx (`hidden lg:flex` desktop /
 * `lg:hidden` mobile). Purely presentational: all experience state, timers,
 * and handlers live in the single shared `ExperienceProvider` (see
 * ExperienceProvider.tsx and docs/DECISIONS.md ADR-036) -- this component
 * only renders the per-breakpoint-geometry-dependent pieces (SetupArea +
 * SlotAnchor, whose pixel geometry genuinely differs per column/stage) and
 * reads the shared engine via `useExperienceEngine()`.
 *
 * Everything viewport-global or Portal-based (Result Card, Guestbook
 * Composer, Route Guide Modal, the reveal-emphasis backdrop) is rendered
 * from `ExperienceOverlays` instead, mounted exactly once outside both
 * dual-mount trees -- see page.tsx and ExperienceOverlays.tsx.
 *
 * The ONE thing that deliberately stays local to this component (rather than
 * moving into the shared engine): the reopen-button ref + its one-line focus
 * effect below. It reads the shared `revealStage` but writes only to this
 * Hero's own DOM node, never calls a setter/dispatch, and is a no-op on
 * whichever Hero instance is currently `display:none` (focusing an element
 * inside a non-rendered subtree is a spec-defined no-op) -- see ADR-036's
 * dual-mount audit.
 */
export function MainExperience({ className = '' }: MainExperienceProps) {
  const engine = useExperienceEngine();
  const { state, dispatch } = engine;

  const reopenButtonRef = useRef<HTMLButtonElement | null>(null);

  // Register/unregister this Hero's own reopen button into the shared engine's
  // registry so ExperienceProvider's minimize effect can focus it. Keyed on
  // revealStage (not an empty dependency array): the button only exists in the
  // DOM while revealStage === 'minimized' (see SlotAnchor's helper band), so
  // this must re-evaluate every time revealStage changes rather than running
  // once at mount, when the button does not exist yet.
  useEffect(() => {
    const button = reopenButtonRef.current;
    if (!button) return;
    engine.reopenButtonRefs.current.add(button);
    return () => {
      engine.reopenButtonRefs.current.delete(button);
    };
  }, [state.phase, engine.revealStage, engine.reopenButtonRefs]);

  return (
    <div
      data-testid="main-experience"
      className={`relative z-30 flex w-full flex-col items-center gap-[var(--hero-stage-gap)] ${className}`}
    >
      {/* 1+2. Setup Area (Q1 -> Q2 -> READY) + Slot Anchor, wrapped in a
          `display:contents` group so `inert` can suspend BOTH while the
          INTRO gate overlay (below) is active -- `contents` keeps them direct
          flex items of this gap-driven column (unchanged geometry), `inert`
          removes them from focus/tab order and pointer/touch interaction as
          an explicit guard, not just relying on the Slot CTA's own existing
          `disabled` state during 'intro'. */}
      <div className="contents" inert={state.phase === 'intro' ? true : undefined}>
        <SetupArea state={state} dispatch={dispatch} />

        {/* Slot Anchor: Stable visual anchor across READY -> SPINNING -> RESULT.
            Also hosts the "내 여행 티켓" reopen affordance in its helper band while
            Result is minimized -- see SlotAnchor.tsx for why that placement was chosen
            over a viewport-corner floating button. */}
        <SlotAnchor
          state={state}
          onSpin={engine.handleSpin}
          errorMessage={state.phase === 'ready' ? engine.recommendationError : null}
          stoppedReelCount={engine.stoppedReelCount}
          pendingResult={engine.pendingResult}
          isLeverActive={engine.isLeverActive}
          revealStage={engine.revealStage}
          onReopenResult={engine.handleReopenResult}
          reopenButtonRef={reopenButtonRef}
        />
      </div>

      {/* INTRO soft entry gate: `absolute inset-0` against this component's
          `relative` root, layered over the Setup+Slot box above -- it
          contributes 0px to document layout (removed from flow) and never
          changes --hero-setup-h, Slot position, or the logo above this
          component in page.tsx. See IntroGate.tsx. */}
      {state.phase === 'intro' && <IntroGate onStart={engine.handleStartIntro} />}
    </div>
  );
}
