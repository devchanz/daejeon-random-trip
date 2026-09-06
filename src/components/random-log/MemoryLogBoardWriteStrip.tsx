'use client';

import React, { useEffect, useState } from 'react';
import { MemoryLogWriteStripView } from './MemoryLogWriteStripView';
import { MEMORY_LOG_WRITE_COPY } from '../../content/sidebar';
import {
  COMPOSE_HANDOFF_HREF,
  getRerollSessionState,
  readTripSession,
  type RerollRewardState,
  type TripSessionState,
} from '../../lib/experience';

/**
 * `/random-log`'s write affordance (ADR-042, made trip-aware in ADR-044).
 *
 * The board renders OUTSIDE ExperienceProvider and deliberately stays that way:
 * no engine, no reducer, no composer of its own -- wrapping this page in the
 * provider, or giving it a second composer, would mean two submit paths for one
 * record. What it does have since ADR-043 is the tab's persisted trip, which is
 * a plain sessionStorage read. That is enough to stop telling a reader who
 * already drew a course to go and draw one:
 *
 *   A. no persisted trip     -> `코스 뽑으러 가기`   -> `/`
 *   B. trip, not yet logged  -> `기록 남기기`        -> `/?compose=memory-log`,
 *      which asks ExperienceProvider to open the ONE existing composer once the
 *      route is restored (see consumeComposeHandoff)
 *   C. trip, already logged  -> success copy; `여행 화면으로 가기` -> `/` while the
 *      session's reroll is still available, otherwise no CTA
 *
 * State C is deliberately a plain link, not a reroll button: executing a reroll
 * needs the recommendation engine, the reward lifecycle, and the spin
 * presentation, all of which live in the provider on `/`. Reproducing any of it
 * here would fork the reward contract, so the board sends the reader to where
 * that action already exists and says so honestly. Nothing here dispatches
 * analytics -- no generation happens on this page.
 *
 * Reads storage in an effect (never during render), so the server and the first
 * client render agree on state A and hydration is clean.
 */
export function MemoryLogBoardWriteStrip({ className = '' }: { className?: string }) {
  const [trip, setTrip] = useState<TripSessionState | null>(null);
  const [rerollReward, setRerollReward] = useState<RerollRewardState>('locked');

  useEffect(() => {
    // Post-mount sessionStorage sync -- the same hydration-safe pattern (and the
    // same lint exemption) ExperienceProvider already uses for its own reroll
    // state: reading storage during render would make the server and client
    // markup disagree.
    /* eslint-disable react-hooks/set-state-in-effect */
    setTrip(readTripSession());
    setRerollReward(getRerollSessionState()?.rerollReward ?? 'locked');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const isLogged = Boolean(trip && trip.loggedRouteIds.includes(trip.result.id));

  // C -- this tab's current route already has a Memory Log entry.
  if (trip && isLogged) {
    const copy =
      rerollReward === 'available'
        ? MEMORY_LOG_WRITE_COPY.boardLoggedReroll
        : MEMORY_LOG_WRITE_COPY.boardLoggedDone;

    return (
      <MemoryLogWriteStripView
        title={copy.title}
        body={copy.body}
        ctaLabel={'cta' in copy ? copy.cta : undefined}
        href={'cta' in copy ? '/' : undefined}
        className={className}
      />
    );
  }

  // B -- a route is waiting to be written about.
  if (trip) {
    return (
      <MemoryLogWriteStripView
        title={MEMORY_LOG_WRITE_COPY.unlogged.title}
        body={MEMORY_LOG_WRITE_COPY.unlogged.body}
        ctaLabel={MEMORY_LOG_WRITE_COPY.unlogged.cta}
        href={COMPOSE_HANDOFF_HREF}
        className={className}
      />
    );
  }

  // A -- nothing drawn in this tab (also the server/first-render state).
  return (
    <MemoryLogWriteStripView
      title={MEMORY_LOG_WRITE_COPY.board.title}
      body={MEMORY_LOG_WRITE_COPY.board.body}
      ctaLabel={MEMORY_LOG_WRITE_COPY.board.cta}
      href="/"
      className={className}
    />
  );
}
