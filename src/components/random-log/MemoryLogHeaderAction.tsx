'use client';

import React from 'react';
import { MemoryLogActionButton } from './MemoryLogActionButton';
import { MEMORY_LOG_WRITE_COPY } from '../../content/sidebar';
import { useExperienceEngine } from '../experience/ExperienceProvider';

/**
 * The right rail's Memory Log write affordance (ADR-042's behaviour, ADR-045's
 * shape): ONE compact action, rendered inline in the MEMORY LOG card header
 * opposite the heading, so it costs the rail a few pixels of header row rather
 * than a block of its own.
 *
 * WHY IT IS NOT A STRIP ANY MORE. The first implementation was a full-width
 * two-line strip between the heading and the entries. It worked, but it added
 * roughly 100px to the rail, which pushed the desktop lower forest/landscape art
 * out of frame and broke the approved mobile bottom composition (TODAY'S DAEJEON
 * + perched mascot + MEMORY LOG sharing one viewport). The affordance survives;
 * the block does not.
 *
 * Behaviour is unchanged and still derived entirely from existing engine state --
 * exactly one action is offered at a time:
 *
 *   A. no Result yet          -> `코스 뽑기`   -> scroll to the hero (Q1/Q2/Spin)
 *   B. Result, not yet logged -> `기록하기`    -> open the existing composer
 *   C. Result, logged         -> `다시 뽑기`   -> the existing rewarded reroll
 *
 * Untouched by this component: the reroll reward machine (state C calls the
 * unchanged `handleExecuteReroll`, so `locked -> available -> consumed` and the
 * one-per-tab cap still hold, and it renders only while that reroll can actually
 * run), Result's own CTAs, and analytics -- nothing here dispatches an event.
 *
 * Only rendered on `/`, inside ExperienceProvider (RightSidebar's sole consumer).
 */
export function MemoryLogHeaderAction() {
  const engine = useExperienceEngine();
  const { state, rerollState, hasLoggedCurrentResult } = engine;
  const { rail } = MEMORY_LOG_WRITE_COPY;

  const hasResult = state.phase === 'result' && Boolean(state.result);

  // C: logged. Offered only while the session's reroll is available -- once it is
  // consumed the header simply carries no action, the same "consumed -> hidden,
  // not disabled" rule Result already follows.
  if (hasResult && hasLoggedCurrentResult) {
    if (rerollState.rerollReward !== 'available') {
      return null;
    }

    return (
      <MemoryLogActionButton
        label={rail.logged.cta}
        ariaLabel={rail.logged.aria}
        glyph={rail.logged.glyph}
        onClick={() => {
          engine.handleExecuteReroll();
          // Bring the Slot back on screen so the spin this just started is
          // watched rather than happening above the fold.
          engine.handleScrollToHero();
        }}
      />
    );
  }

  // B: a Result exists and has not been logged yet. ExperienceOverlays renders
  // the composer off this flag (gated on phase === 'result' && state.result) and
  // passes the live route, so the current course is attached through the existing
  // model with no change to the composer, the API, or the schema.
  if (hasResult) {
    return (
      <MemoryLogActionButton
        label={rail.unlogged.cta}
        ariaLabel={rail.unlogged.aria}
        glyph={rail.unlogged.glyph}
        onClick={() => engine.setIsGuestbookOpen(true)}
      />
    );
  }

  // A: no Result. START_SPIN clears state.result, so a reroll passes back through
  // here -- disabled while spinning so it can never bounce the reader to a hero
  // that is mid-spin.
  return (
    <MemoryLogActionButton
      label={rail.noRoute.cta}
      ariaLabel={rail.noRoute.aria}
      glyph={rail.noRoute.glyph}
      onClick={engine.handleScrollToHero}
      disabled={state.phase === 'spinning'}
    />
  );
}
