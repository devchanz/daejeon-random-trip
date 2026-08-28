import type { DurationType, PreferenceType } from '../../config/product';
import { calculateTotalDurationMinutes } from '../../config/durationBudget';
import type {
  Zone,
  PlaceCandidate,
  RouteStop,
  RouteResult,
  RouteTemplate,
  RouteSlot,
  GenerateRouteOptions,
} from './types';
import {
  isMealCandidate,
  isCafeCandidate,
  isDiscoveryCandidate,
  matchesPreference,
} from './roles';
import { selectRouteTemplate, DEFAULT_ROUTE_TEMPLATES } from './templates';

/**
 * Minimum active candidate count required in a zone to construct a valid itinerary.
 */
export const MIN_STOPS_BY_DURATION: Record<DurationType, number> = {
  half: 3,
  full: 3,
};

/**
 * Error class thrown when route recommendation cannot be fulfilled.
 */
export class RecommendationEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecommendationEngineError';
  }
}

/**
 * Filters zones that are active and contain sufficient active candidates to fulfill
 * an ordered route (at least MIN_STOPS_BY_DURATION candidates, including at least 1 meal and 1 cafe).
 */
export function getEligibleZones(
  zones: Zone[],
  candidates: PlaceCandidate[],
  duration: DurationType
): Zone[] {
  const minRequired = MIN_STOPS_BY_DURATION[duration] ?? 3;

  return zones.filter((zone) => {
    if (!zone.active) {
      return false;
    }

    const activeCandidatesInZone = candidates.filter(
      (c) => c.active && c.zoneId === zone.id
    );

    if (activeCandidatesInZone.length < minRequired) {
      return false;
    }

    const hasMeal = activeCandidatesInZone.some(isMealCandidate);
    const hasCafe = activeCandidatesInZone.some(isCafeCandidate);

    return hasMeal && hasCafe;
  });
}

/**
 * Helper to pick a random element from an array using the provided random source.
 */
function pickRandomItem<T>(items: T[], random: () => number): T {
  const idx = Math.min(
    items.length - 1,
    Math.max(0, Math.floor(random() * items.length))
  );
  return items[idx];
}

/**
 * Helper to shuffle an array using the provided random source.
 */
function shuffleArray<T>(items: T[], random: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(random() * (i + 1)));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Selects a candidate for a standard requirement slot (meal, cafe, discovery).
 */
function selectCandidateForStandardSlot(
  availableCandidates: PlaceCandidate[],
  slot: RouteSlot,
  random: () => number
): PlaceCandidate | null {
  if (availableCandidates.length === 0) {
    return null;
  }

  switch (slot) {
    case 'meal': {
      const meals = availableCandidates.filter(isMealCandidate);
      return meals.length > 0 ? pickRandomItem(meals, random) : null;
    }
    case 'cafe': {
      const cafes = availableCandidates.filter(isCafeCandidate);
      return cafes.length > 0 ? pickRandomItem(cafes, random) : null;
    }
    case 'discovery': {
      const discoveries = availableCandidates.filter(isDiscoveryCandidate);
      return discoveries.length > 0 ? pickRandomItem(discoveries, random) : null;
    }
    case 'preference': {
      return pickRandomItem(availableCandidates, random);
    }
  }
}

/**
 * Attempts to fill all slots of an ordered route template without place duplication.
 *
 * Assignment Strategy:
 * 1. Preference-First Reservation: When a specific preference (not 'anything') is requested,
 *    we first identify candidates matching that preference. For each candidate (randomly shuffled),
 *    we reserve it for the 'preference' slot and attempt to fill the remaining non-preference slots
 *    (meal, cafe, discovery) from the remaining pool.
 *    This ensures that earlier slots (like discovery) never preemptively consume the only
 *    preference-matching candidate in the zone.
 * 2. Graceful Fallback: If preference is 'anything', or no candidate matches the specific preference,
 *    or no preference-first combination can satisfy all other required slots, we fall back to filling
 *    all standard slots first and assigning any remaining unassigned candidate to the preference slot.
 *
 * Output Guarantee:
 * The returned array ALWAYS preserves the exact display order defined by template.slots
 * (Half: Meal -> Cafe -> Preference, Full: Meal -> Cafe -> Discovery -> Preference).
 */
function fillTemplateSlots(
  template: RouteTemplate,
  zoneCandidates: PlaceCandidate[],
  preference: PreferenceType,
  random: () => number
): PlaceCandidate[] | null {
  const hasPreferenceSlot = template.slots.includes('preference');
  const isSpecificPreference = preference !== 'anything';

  // Strategy 1: Preference-First Assignment
  if (hasPreferenceSlot && isSpecificPreference) {
    const prefCandidates = shuffleArray(
      zoneCandidates.filter((c) => matchesPreference(c, preference)),
      random
    );

    for (const prefPlace of prefCandidates) {
      const usedPlaceIds = new Set<string>([prefPlace.id]);
      const assignment: Partial<Record<RouteSlot, PlaceCandidate>> = {
        preference: prefPlace,
      };

      let feasible = true;

      // Assign non-preference slots (meal, cafe, discovery) from pool excluding prefPlace
      for (const slot of template.slots) {
        if (slot === 'preference') {
          continue;
        }

        const availablePool = zoneCandidates.filter((c) => !usedPlaceIds.has(c.id));
        const chosen = selectCandidateForStandardSlot(availablePool, slot, random);

        if (!chosen) {
          feasible = false;
          break;
        }

        usedPlaceIds.add(chosen.id);
        assignment[slot] = chosen;
      }

      if (feasible) {
        // Return candidates mapped to the exact display sequence in template.slots
        return template.slots.map((slot) => assignment[slot]!);
      }
    }
  }

  // Strategy 2: General / Fallback Assignment (for 'anything' or when specific pref candidates are unavailable)
  const usedPlaceIds = new Set<string>();
  const assignment: Partial<Record<RouteSlot, PlaceCandidate>> = {};

  // Fill non-preference slots first
  for (const slot of template.slots) {
    if (slot === 'preference') {
      continue;
    }

    const availablePool = zoneCandidates.filter((c) => !usedPlaceIds.has(c.id));
    const chosen = selectCandidateForStandardSlot(availablePool, slot, random);

    if (!chosen) {
      return null;
    }

    usedPlaceIds.add(chosen.id);
    assignment[slot] = chosen;
  }

  // Fill preference slot from remaining available pool
  if (hasPreferenceSlot) {
    const availablePool = zoneCandidates.filter((c) => !usedPlaceIds.has(c.id));
    if (availablePool.length === 0) {
      return null;
    }

    const prefMatches = availablePool.filter((c) => matchesPreference(c, preference));
    const chosen =
      prefMatches.length > 0
        ? pickRandomItem(prefMatches, random)
        : pickRandomItem(availablePool, random);

    usedPlaceIds.add(chosen.id);
    assignment.preference = chosen;
  }

  return template.slots.map((slot) => assignment[slot]!);
}

/**
 * Generates a unique route identifier.
 */
function generateRouteId(random: () => number): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.floor(random() * 1_000_000).toString(36);
  return `route_${timestamp}_${randomSuffix}`;
}

/**
 * Generates a curated, controlled-random travel route based on duration and preference.
 *
 * Ordered Route Specifications:
 * - Half-day: Exactly 3 stops: Meal -> Cafe -> Preference
 * - Full-day (Primary): 4 stops: Meal -> Cafe -> Discovery -> Preference
 * - Full-day (Fallback): 3 stops: Meal -> Cafe -> Preference (preserves user's Preference)
 *
 * Core Flow:
 * 1. Validate inputs (durationType, preference, zone/candidate pools)
 * 2. Select an eligible Zone (active, >= 3 candidates, has meal and cafe)
 * 3. Select an Ordered Route Template matching duration
 * 4. Fill ordered slots without duplicate places
 * 5. Full-day fallback: If 4-stop primary fails, gracefully fall back to 3-stop template preserving Preference
 * 6. Return validated RouteResult
 */
export function generateRoute(options: GenerateRouteOptions): RouteResult {
  const { durationType, preference, zones, candidates, random = Math.random } = options;

  if (!durationType) {
    throw new RecommendationEngineError('Missing required parameter: durationType');
  }

  if (!preference) {
    throw new RecommendationEngineError('Missing required parameter: preference');
  }

  if (!zones || zones.length === 0) {
    throw new RecommendationEngineError(
      'No zone data provided to recommendation engine'
    );
  }

  if (!candidates || candidates.length === 0) {
    throw new RecommendationEngineError(
      'No candidate place data provided to recommendation engine'
    );
  }

  // 1. Find eligible zones
  const eligibleZones = getEligibleZones(zones, candidates, durationType);
  if (eligibleZones.length === 0) {
    throw new RecommendationEngineError(
      `No eligible active zones found with sufficient candidates for duration: ${durationType}`
    );
  }

  // 2. Select one zone
  const selectedZone = pickRandomItem(eligibleZones, random);

  // 3. Filter active candidates in the selected zone
  const zoneCandidates = candidates.filter(
    (c) => c.active && c.zoneId === selectedZone.id
  );

  // 4. Select primary route template
  let template = selectRouteTemplate({
    durationType,
    preference,
    availableCandidateCount: zoneCandidates.length,
    isFallback: false,
    templates: DEFAULT_ROUTE_TEMPLATES,
    random,
  });

  if (!template) {
    throw new RecommendationEngineError(
      `Failed to find a viable route template for zone ${selectedZone.id} with ${zoneCandidates.length} candidate(s)`
    );
  }

  // 5. Fill ordered slots without duplicates
  let selectedCandidates = fillTemplateSlots(template, zoneCandidates, preference, random);

  // 6. Graceful fallback for Full-day: If 4-stop primary fails, fall back to 3-stop (Meal -> Cafe -> Preference)
  if (!selectedCandidates && durationType === 'full' && template.slots.length === 4) {
    const fallbackTemplate = selectRouteTemplate({
      durationType: 'full',
      preference,
      availableCandidateCount: zoneCandidates.length,
      isFallback: true,
      templates: DEFAULT_ROUTE_TEMPLATES,
      random,
    });

    if (fallbackTemplate) {
      template = fallbackTemplate;
      selectedCandidates = fillTemplateSlots(fallbackTemplate, zoneCandidates, preference, random);
    }
  }

  if (!selectedCandidates) {
    throw new RecommendationEngineError(
      `Insufficient matching candidates to fulfill route template "${template.id}" in zone ${selectedZone.id}`
    );
  }

  // 7. Map candidates to RouteStop contract
  const stops: RouteStop[] = selectedCandidates.map((candidate, index) => ({
    order: index + 1,
    placeId: candidate.id,
    name: candidate.name,
    category: candidate.category,
    stayDurationMin: candidate.durationMin,
    address: candidate.address,
    mapLinks: candidate.mapLinks,
    tips: candidate.description,
  }));

  // 8. Construct final RouteResult with estimated duration calculation
  const estimatedTotalMinutes = calculateTotalDurationMinutes(stops);
  const title = `${selectedZone.name} ${durationType === 'half' ? '반일' : '당일'} 코스`;

  return {
    id: generateRouteId(random),
    zoneId: selectedZone.id,
    zoneName: selectedZone.name,
    durationType,
    preference,
    title,
    stops,
    mission: undefined,
    estimatedTotalMinutes,
    createdAt: new Date().toISOString(),
  };
}
