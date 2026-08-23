import type { PlaceCandidate, CandidateRole } from './types';
import type { PreferenceType } from '../../config/product';

/**
 * All conceptual candidate roles recognized by the recommendation engine.
 */
export const CANDIDATE_ROLES: readonly CandidateRole[] = [
  'anchor',
  'meal',
  'discovery',
  'stay-extender',
] as const;

/**
 * Keyword identifiers for role classification based on candidate tags and category.
 */
const ROLE_KEYWORDS: Record<CandidateRole, readonly string[]> = {
  anchor: [
    'anchor',
    'landmark',
    'attraction',
    'market',
    'culture',
    'highlight',
    'hub',
    'main',
    'heritage',
  ],
  meal: [
    'meal',
    'food',
    'cafe',
    'restaurant',
    'dining',
    'bakery',
    'dessert',
    'snack',
    'coffee',
    'bistro',
    'lunch',
    'dinner',
  ],
  discovery: [
    'discovery',
    'walk',
    'photo',
    'experience',
    'shopping',
    'park',
    'culture',
    'hidden',
    'gem',
    'street',
    'promenade',
    'exhibition',
    'nature',
    'craft',
  ],
  'stay-extender': [
    'stay-extender',
    'stay_extender',
    'stayextender',
    'night',
    'evening',
    'sunset',
    'dessert',
    'bar',
    'pub',
    'lounge',
    'leisure',
    'nightview',
    'night-view',
    'nightscape',
  ],
};

/**
 * Keyword identifiers for travel preferences to match candidate tags and category.
 */
const PREFERENCE_KEYWORDS: Record<Exclude<PreferenceType, 'anything'>, readonly string[]> = {
  food: [
    'food',
    'meal',
    'cafe',
    'restaurant',
    'dining',
    'bakery',
    'dessert',
    'snack',
    'coffee',
    'bistro',
    'taste',
    'gourmet',
    'market',
  ],
  walk: [
    'walk',
    'park',
    'promenade',
    'trail',
    'nature',
    'outdoor',
    'stroll',
    'river',
    'forest',
    'green',
    'alley',
  ],
  photo: [
    'photo',
    'view',
    'scenery',
    'viewpoint',
    'aesthetic',
    'spot',
    'architecture',
    'retro',
    'exhibition',
    'gallery',
    'sunset',
    'nightview',
    'landmark',
  ],
};

/**
 * Checks if a candidate matches the given conceptual role.
 * Prioritizes explicitly verified candidate.roles if present;
 * falls back to category/tags keyword inference when roles are absent.
 */
export function matchesRole(candidate: PlaceCandidate, role: CandidateRole): boolean {
  if (candidate.roles && candidate.roles.length > 0) {
    return candidate.roles.includes(role);
  }

  const normalizedCategory = (candidate.category ?? '').toLowerCase().trim();
  const normalizedTags = (candidate.tags ?? []).map((t) => t.toLowerCase().trim());
  const keywords = ROLE_KEYWORDS[role];

  if (keywords.some((kw) => normalizedCategory.includes(kw))) {
    return true;
  }

  return normalizedTags.some((tag) => keywords.some((kw) => tag.includes(kw)));
}

/**
 * Checks if a candidate matches the user's travel preference.
 * 'anything' matches all candidates.
 */
export function matchesPreference(
  candidate: PlaceCandidate,
  preference: PreferenceType
): boolean {
  if (preference === 'anything') {
    return true;
  }

  const normalizedCategory = (candidate.category ?? '').toLowerCase().trim();
  const normalizedTags = (candidate.tags ?? []).map((t) => t.toLowerCase().trim());
  const keywords = PREFERENCE_KEYWORDS[preference];

  if (!keywords) {
    return true;
  }

  if (keywords.some((kw) => normalizedCategory.includes(kw))) {
    return true;
  }

  return normalizedTags.some((tag) => keywords.some((kw) => tag.includes(kw)));
}
