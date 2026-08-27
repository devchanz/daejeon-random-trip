import type { RerollRewardState, RerollSessionState } from '../random/types';

export type { RerollRewardState, RerollSessionState };

export const REROLL_SESSION_STORAGE_KEY = 'daejeon_random_trip_reroll_session';

/**
 * Creates a new initial RerollSessionState with 'locked' reward status.
 */
export function createInitialRerollState(routeSessionId: string): RerollSessionState {
  return {
    routeSessionId,
    rerollReward: 'locked',
  };
}

/**
 * Safely reads the RerollSessionState from sessionStorage.
 * Returns null in SSR environments or if no state is stored / parse fails.
 */
export function getRerollSessionState(): RerollSessionState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(REROLL_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<RerollSessionState>;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.routeSessionId === 'string' &&
      (parsed.rerollReward === 'locked' ||
        parsed.rerollReward === 'available' ||
        parsed.rerollReward === 'consumed')
    ) {
      return parsed as RerollSessionState;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Safely saves the RerollSessionState to sessionStorage.
 * Safe to call in SSR environments (no-op).
 */
export function saveRerollSessionState(state: RerollSessionState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(
      REROLL_SESSION_STORAGE_KEY,
      JSON.stringify(state)
    );
  } catch {
    // Storage quota exceeded or disabled; fail gracefully
  }
}

/**
 * Unlocks the single 1-time reroll reward for the active travel session.
 * Transitions state from 'locked' to 'available'.
 * Safe guard: If reward was already consumed, does NOT re-unlock (max 1 reward reroll per session).
 */
export function unlockRerollReward(
  routeSessionId: string,
  awardedRouteId: string
): RerollSessionState {
  const current = getRerollSessionState();

  // If already consumed, retain consumed state to enforce maximum 1 reward reroll
  if (current && current.routeSessionId === routeSessionId && current.rerollReward === 'consumed') {
    return current;
  }

  const nextState: RerollSessionState = {
    routeSessionId,
    rerollReward: 'available',
    unlockedAt: new Date().toISOString(),
    awardedRouteId,
  };

  saveRerollSessionState(nextState);
  return nextState;
}

/**
 * Consumes the available reroll reward for the second spin.
 * Transitions state from 'available' to 'consumed'.
 * Returns null if no available reward exists for this session.
 */
export function consumeRerollReward(
  routeSessionId: string
): RerollSessionState | null {
  const current = getRerollSessionState();

  if (!current || current.routeSessionId !== routeSessionId || current.rerollReward !== 'available') {
    return null;
  }

  const nextState: RerollSessionState = {
    ...current,
    rerollReward: 'consumed',
    consumedAt: new Date().toISOString(),
  };

  saveRerollSessionState(nextState);
  return nextState;
}

/**
 * Safely clears the reroll session from sessionStorage.
 */
export function clearRerollSessionState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.removeItem(REROLL_SESSION_STORAGE_KEY);
  } catch {
    // Fail gracefully
  }
}
