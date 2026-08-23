import type { DurationType, PreferenceType } from '../../config/product';
import type { RouteTemplate } from './types';

/**
 * Curated route templates defining role sequences for different durations and preferences.
 * Variable stop counts:
 * - half: 2 to 3 stops
 * - full: 3 to 4 stops (ending with stay-extender where possible)
 */
export const DEFAULT_ROUTE_TEMPLATES: readonly RouteTemplate[] = [
  // Half-day templates (2~3 stops)
  {
    id: 'half_general_3',
    duration: 'half',
    slots: ['anchor', 'meal', 'discovery'],
  },
  {
    id: 'half_general_2',
    duration: 'half',
    slots: ['anchor', 'meal'],
  },
  {
    id: 'half_food_3',
    duration: 'half',
    targetPreference: 'food',
    slots: ['meal', 'anchor', 'discovery'],
  },
  {
    id: 'half_food_2',
    duration: 'half',
    targetPreference: 'food',
    slots: ['meal', 'anchor'],
  },
  {
    id: 'half_walk_3',
    duration: 'half',
    targetPreference: 'walk',
    slots: ['anchor', 'discovery', 'meal'],
  },
  {
    id: 'half_walk_2',
    duration: 'half',
    targetPreference: 'walk',
    slots: ['discovery', 'anchor'],
  },
  {
    id: 'half_photo_3',
    duration: 'half',
    targetPreference: 'photo',
    slots: ['anchor', 'discovery', 'meal'],
  },
  {
    id: 'half_photo_2',
    duration: 'half',
    targetPreference: 'photo',
    slots: ['anchor', 'discovery'],
  },

  // Full-day templates (3~4 stops)
  {
    id: 'full_general_4',
    duration: 'full',
    slots: ['anchor', 'meal', 'discovery', 'stay-extender'],
  },
  {
    id: 'full_general_3',
    duration: 'full',
    slots: ['anchor', 'meal', 'discovery'],
  },
  {
    id: 'full_food_4',
    duration: 'full',
    targetPreference: 'food',
    slots: ['meal', 'anchor', 'discovery', 'stay-extender'],
  },
  {
    id: 'full_food_3',
    duration: 'full',
    targetPreference: 'food',
    slots: ['meal', 'anchor', 'discovery'],
  },
  {
    id: 'full_walk_4',
    duration: 'full',
    targetPreference: 'walk',
    slots: ['anchor', 'discovery', 'meal', 'stay-extender'],
  },
  {
    id: 'full_walk_3',
    duration: 'full',
    targetPreference: 'walk',
    slots: ['anchor', 'discovery', 'meal'],
  },
  {
    id: 'full_photo_4',
    duration: 'full',
    targetPreference: 'photo',
    slots: ['anchor', 'discovery', 'meal', 'stay-extender'],
  },
  {
    id: 'full_photo_3',
    duration: 'full',
    targetPreference: 'photo',
    slots: ['anchor', 'discovery', 'meal'],
  },
];

export interface SelectTemplateOptions {
  duration: DurationType;
  preference: PreferenceType;
  availableCandidateCount: number;
  hasStayExtender?: boolean;
  templates?: readonly RouteTemplate[];
  random?: () => number;
}

/**
 * Selects an appropriate route template matching duration and preference,
 * ensuring the candidate pool in the chosen zone has enough candidates
 * and respecting stay-extender candidate availability.
 */
export function selectRouteTemplate({
  duration,
  preference,
  availableCandidateCount,
  hasStayExtender = true,
  templates = DEFAULT_ROUTE_TEMPLATES,
  random = Math.random,
}: SelectTemplateOptions): RouteTemplate | null {
  // 1. Filter templates by requested duration, candidate count feasibility, and stay-extender availability
  const durationMatching = templates.filter((t) => {
    if (t.duration !== duration) {
      return false;
    }
    if (t.slots.length > availableCandidateCount) {
      return false;
    }
    if (!hasStayExtender && t.slots.includes('stay-extender')) {
      return false;
    }
    return true;
  });

  if (durationMatching.length === 0) {
    return null;
  }

  // 2. If preference is specified (not 'anything'), prioritize preference-targeted templates
  if (preference !== 'anything') {
    const preferenceMatching = durationMatching.filter(
      (t) => t.targetPreference === preference
    );
    if (preferenceMatching.length > 0) {
      if (hasStayExtender && availableCandidateCount >= 4) {
        const fourStop = preferenceMatching.filter((t) =>
          t.slots.includes('stay-extender')
        );
        if (fourStop.length > 0) {
          const idx = Math.min(
            fourStop.length - 1,
            Math.max(0, Math.floor(random() * fourStop.length))
          );
          return fourStop[idx];
        }
      }
      const idx = Math.min(
        preferenceMatching.length - 1,
        Math.max(0, Math.floor(random() * preferenceMatching.length))
      );
      return preferenceMatching[idx];
    }
  }

  // 3. Fallback to general or all feasible templates matching duration
  const generalTemplates = durationMatching.filter((t) => !t.targetPreference);
  const pool = generalTemplates.length > 0 ? generalTemplates : durationMatching;

  if (hasStayExtender && availableCandidateCount >= 4) {
    const fourStop = pool.filter((t) => t.slots.includes('stay-extender'));
    if (fourStop.length > 0) {
      const idx = Math.min(
        fourStop.length - 1,
        Math.max(0, Math.floor(random() * fourStop.length))
      );
      return fourStop[idx];
    }
  }

  const idx = Math.min(
    pool.length - 1,
    Math.max(0, Math.floor(random() * pool.length))
  );
  return pool[idx];
}
