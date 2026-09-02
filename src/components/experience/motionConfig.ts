'use client';

import { useSyncExternalStore } from 'react';

const REEL_1_STOP_MS = 1100;
const REEL_2_STOP_MS = 1600;
const REEL_3_STOP_MS = 2100;
const FINAL_BEAT_MS = 400;

/**
 * Centralized motion timing constants (in milliseconds).
 * All UI presentation animation durations are defined here for easy tweaking.
 */
export const MOTION_TIMINGS = {
  /** Duration of lever pull & return animation */
  LEVER_PULL_MS: 500,
  /** Initial rolling duration before Reel 1 comes to a stop */
  REEL_1_STOP_MS,
  /** Duration from spin start until Reel 2 comes to a stop */
  REEL_2_STOP_MS,
  /** Duration from spin start until Reel 3 comes to a stop */
  REEL_3_STOP_MS,
  /** Short beat after Reel 3 stops before COMPLETE_SPIN */
  FINAL_BEAT_MS,
  /** Total spin duration before COMPLETE_SPIN is dispatched (derived from REEL_3_STOP_MS + FINAL_BEAT_MS) */
  TOTAL_SPIN_MS: REEL_3_STOP_MS + FINAL_BEAT_MS,
  /** Temporary dim & subtle blur reveal emphasis duration */
  REVEAL_EMPHASIS_MS: 1400,
  /**
   * Delay from the output slit peek cue being triggered until the centered
   * Result Card is revealed.
   *
   * The 300-500ms window is a Fixed product contract (docs/PRODUCT.md 5.1 and
   * docs/ARCHITECTURE.md 5.1: "300-500ms after the peek cue is triggered").
   * DEV lands inside that range; VISUAL may retune within it, but must not
   * leave it without a documented product decision.
   */
  OUTPUT_PEEK_TO_CARD_MS: 400,
  /**
   * Sub-beat offsets within 'peek' (measured from the start of 'peek'), driving
   * `peekPhase` in MainExperience for the dormant Slot Peek cavity-emergence
   * architecture (see SlotOutputLayer.tsx). Both stay inside OUTPUT_PEEK_TO_CARD_MS
   * -- they subdivide the existing Fixed 300-500ms product window, they don't
   * extend it.
   */
  PEEK_EDGE_AT_MS: 150,
  PEEK_HOLD_AT_MS: 300,
} as const;

const REDUCED_REEL_1_STOP_MS = 650;
const REDUCED_REEL_2_STOP_MS = 1100;
const REDUCED_REEL_3_STOP_MS = 1550;
const REDUCED_FINAL_BEAT_MS = 250;

/**
 * Reduced-motion timing table.
 *
 * `prefers-reduced-motion: reduce` (see globals.css) suppresses VISUAL motion --
 * it does not mean the product lifecycle should complete instantly. The user
 * still gets the full READY -> SPINNING -> RESULT sequence with perceptible
 * reel-by-reel progression; only the animated travel between states is gone.
 * Shape mirrors MOTION_TIMINGS exactly so the spin effect stays a single code
 * path (see MainExperience.tsx).
 */
export const REDUCED_MOTION_TIMINGS = {
  LEVER_PULL_MS: 400,
  REEL_1_STOP_MS: REDUCED_REEL_1_STOP_MS,
  REEL_2_STOP_MS: REDUCED_REEL_2_STOP_MS,
  REEL_3_STOP_MS: REDUCED_REEL_3_STOP_MS,
  FINAL_BEAT_MS: REDUCED_FINAL_BEAT_MS,
  TOTAL_SPIN_MS: REDUCED_REEL_3_STOP_MS + REDUCED_FINAL_BEAT_MS,
  REVEAL_EMPHASIS_MS: MOTION_TIMINGS.REVEAL_EMPHASIS_MS,
  // Unchanged on purpose: the 300-500ms peek->card window is a Fixed product
  // contract (docs/PRODUCT.md 5.1, docs/ARCHITECTURE.md 5.1) and is a timing
  // beat, not a motion effect.
  OUTPUT_PEEK_TO_CARD_MS: MOTION_TIMINGS.OUTPUT_PEEK_TO_CARD_MS,
  // Same reasoning: these subdivide the beat above, not a motion effect.
  PEEK_EDGE_AT_MS: MOTION_TIMINGS.PEEK_EDGE_AT_MS,
  PEEK_HOLD_AT_MS: MOTION_TIMINGS.PEEK_HOLD_AT_MS,
} as const;

/** Selects the active timing table based on the user's motion preference. */
export function getMotionTimings(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? REDUCED_MOTION_TIMINGS : MOTION_TIMINGS;
}

/**
 * Neutral travel and arcade symbols displayed on reels while rolling.
 * Purely presentation-only; no actual place names are exposed while spinning.
 */
export const NEUTRAL_ROLLING_SYMBOLS = [
  '🍞',
  '☕',
  '🍜',
  '🌲',
  '📸',
  '🏛️',
  '🗺️',
  '🚌',
  '✨',
  '🥪',
  '🚲',
  '🎯',
] as const;

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/**
 * React hook to detect `prefers-reduced-motion: reduce` safely via useSyncExternalStore.
 * Gracefully defaults to false during SSR with zero hydration mismatches or effect cascading renders.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}
