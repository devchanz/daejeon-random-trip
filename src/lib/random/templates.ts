import type { DurationType, PreferenceType } from '../../config/product';
import type { RouteTemplate } from './types';

/**
 * Curated ordered route templates defining slot sequences.
 *
 * Ordered Route Specifications:
 * - Half-day: Exactly 3 stops: Meal -> Cafe -> Preference
 * - Full-day (Primary): 4 stops: Meal -> Cafe -> Discovery -> Preference
 * - Full-day (Fallback): 3 stops: Meal -> Cafe -> Preference (preserves user's Preference)
 */
export const DEFAULT_ROUTE_TEMPLATES: readonly RouteTemplate[] = [
  // Half-day template (fixed exactly 3 stops: Meal -> Cafe -> Preference)
  {
    id: 'half_ordered_3',
    durationType: 'half',
    slots: ['meal', 'cafe', 'preference'],
  },

  // Full-day primary template (4 stops: Meal -> Cafe -> Discovery -> Preference)
  {
    id: 'full_ordered_4',
    durationType: 'full',
    slots: ['meal', 'cafe', 'discovery', 'preference'],
  },

  // Full-day 3-stop graceful fallback template (Meal -> Cafe -> Preference)
  {
    id: 'full_fallback_3',
    durationType: 'full',
    slots: ['meal', 'cafe', 'preference'],
  },
];

export interface SelectTemplateOptions {
  durationType: DurationType;
  preference?: PreferenceType;
  availableCandidateCount: number;
  isFallback?: boolean;
  templates?: readonly RouteTemplate[];
  random?: () => number;
}

/**
 * Selects an appropriate route template matching duration, candidate count feasibility,
 * and fallback mode.
 */
export function selectRouteTemplate({
  durationType,
  preference,
  availableCandidateCount,
  isFallback = false,
  templates = DEFAULT_ROUTE_TEMPLATES,
}: SelectTemplateOptions): RouteTemplate | null {
  // 1. Filter templates by requested duration and candidate count feasibility
  const durationMatching = templates.filter((t) => {
    if (t.durationType !== durationType) {
      return false;
    }
    if (t.slots.length > availableCandidateCount) {
      return false;
    }
    if (preference && t.preference && t.preference !== preference) {
      return false;
    }
    if (isFallback && t.slots.length >= 4) {
      return false;
    }
    if (!isFallback && durationType === 'full' && availableCandidateCount >= 4 && t.slots.length < 4) {
      return false;
    }
    return true;
  });

  if (durationMatching.length > 0) {
    return durationMatching[0];
  }

  // 2. Fallback: find any template matching duration that fits availableCandidateCount
  const anyMatching = templates.filter(
    (t) => t.durationType === durationType && t.slots.length <= availableCandidateCount
  );

  return anyMatching[0] ?? null;
}
