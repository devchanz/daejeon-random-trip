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
  /** Total spin duration when prefers-reduced-motion is active */
  REDUCED_MOTION_TOTAL_MS: 60,
} as const;

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
