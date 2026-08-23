import type { RouteResult } from './types';

/**
 * Presentation model for a single slot reel window.
 * Decoupled from DOM/CSS styling and animation mechanics.
 */
export interface ReelItemDisplay {
  label: string;
  value: string;
  category?: string;
  isPlaceholder: boolean;
}

/**
 * Visual display model representing the fixed 3-reel presentation window.
 * Completely decoupled from variable-stop RouteResult domain models.
 */
export interface ReelDisplayModel {
  reels: [ReelItemDisplay, ReelItemDisplay, ReelItemDisplay];
}

/**
 * Returns the default idle / pre-spin reel display model (? / ? / ?).
 * Used across Q1, Q2, and READY phases to ensure zero premature result leaks.
 */
export function getPreSpinReelDisplay(): ReelDisplayModel {
  return {
    reels: [
      { label: '1', value: '?', isPlaceholder: true },
      { label: '2', value: '?', isPlaceholder: true },
      { label: '3', value: '?', isPlaceholder: true },
    ],
  };
}

/**
 * Returns the spinning motion reel display model.
 * Used during the SPINNING phase to indicate active random generation
 * without exposing place names or final result labels early.
 */
export function getSpinningReelDisplay(): ReelDisplayModel {
  return {
    reels: [
      { label: '1', value: '...', isPlaceholder: true },
      { label: '2', value: '...', isPlaceholder: true },
      { label: '3', value: '...', isPlaceholder: true },
    ],
  };
}

/**
 * Maps a logical RouteResult to the 3-reel display model.
 *
 * Presentation Rules:
 * - If RouteResult has >= 3 stops: First 3 stops are mapped to the 3 reels.
 * - If RouteResult has 2 stops: 3rd reel receives a neutral placeholder.
 * - If RouteResult has 4+ stops: The actual RouteResult is never truncated,
 *   only the first 3 stops are shown in the slot reel preview.
 */
export function mapRouteToReelDisplay(route: RouteResult): ReelDisplayModel {
  const stops = route.stops || [];

  const reels: ReelItemDisplay[] = [0, 1, 2].map((index) => {
    const stop = stops[index];
    if (stop) {
      return {
        label: String(index + 1),
        value: stop.name,
        category: stop.category,
        isPlaceholder: false,
      };
    }
    return {
      label: String(index + 1),
      value: '-',
      isPlaceholder: true,
    };
  });

  return {
    reels: [reels[0], reels[1], reels[2]],
  };
}
