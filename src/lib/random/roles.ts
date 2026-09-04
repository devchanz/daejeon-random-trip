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
 * Canonical meal candidate check.
 * Strictly adheres to PlaceCandidate.category === "식사".
 *
 * Deliberately does NOT also accept a 카페·디저트 place, even though every cafe
 * carries a "food" preference tag. Route-slot/category identity and Q2-preference
 * suitability are two separate concepts (see matchesPreference below): a cafe can
 * be a valid `food`-preference match without ever being eligible for the Meal
 * slot, which isCafeCandidate already reserves exclusively.
 */
export function isMealCandidate(candidate: PlaceCandidate): boolean {
  return candidate.category === '식사';
}

/**
 * Canonical cafe candidate check.
 * Strictly adheres to PlaceCandidate.category === "카페·디저트".
 */
export function isCafeCandidate(candidate: PlaceCandidate): boolean {
  return candidate.category === '카페·디저트';
}

/**
 * Canonical discovery/activity candidate check.
 * Strictly adheres to PlaceCandidate.category being one of the two activity
 * categories -- "볼거리·문화·체험" (sights/culture/experience) or "산책·야간"
 * (walk/night view).
 *
 * Deliberately never inferred from `tags`: tags encode Q2-preference
 * suitability (food/walk/photo), not route-slot role, and reusing them here
 * would let an unrelated food/photo-tagged 카페·디저트 place quietly satisfy
 * the Discovery slot.
 */
export function isDiscoveryCandidate(candidate: PlaceCandidate): boolean {
  return (
    candidate.category === '볼거리·문화·체험' || candidate.category === '산책·야간'
  );
}

/**
 * Checks if a candidate satisfies the user's explicit Q2 travel preference.
 *
 * 'anything' matches every candidate (no constraint). Otherwise this is a
 * plain membership check against PlaceCandidate.tags for the exact preference
 * token -- Q2-preference suitability is explicit data on the candidate
 * (`tags`), never derived from `category` or route-slot role. This is
 * deliberately separate from isMealCandidate/isCafeCandidate/isDiscoveryCandidate
 * above: a single place (e.g. a 카페·디저트 with a scenic hook) can be a valid
 * `photo` preference match while never being eligible for the Meal/Discovery
 * route slot, and vice versa.
 */
export function matchesPreference(
  candidate: PlaceCandidate,
  preference: PreferenceType
): boolean {
  if (preference === 'anything') {
    return true;
  }

  return candidate.tags.includes(preference);
}
