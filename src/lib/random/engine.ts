import { SUPPORTED_PREFERENCES, type DurationType, type PreferenceType } from '../../config/product';
import { calculateTotalDurationMinutes } from '../../config/durationBudget';
import { BONUS_QUEST_MISSIONS } from '../../config/missions';
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
  isPreferenceSlotCandidate,
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
 * A fixed random source used only to answer "does at least one valid, complete
 * slot assignment exist" -- never to actually build a returned route.
 *
 * fillTemplateSlots' Preference-First Reservation (Strategy 1) exhaustively
 * tries every preference-matching candidate as the reservation, and its
 * general assignment (Strategy 2, 'anything' only) only ever fails when a
 * slot's filtered candidate pool is empty. In both cases, whether the
 * function returns `null` or a real assignment never depends on *which*
 * random source is supplied -- only *which* of several equally-valid
 * assignments comes back when more than one exists. That makes
 * `fillTemplateSlots(...) !== null` a deterministic feasibility oracle
 * regardless of the random function passed in, so reusing it here (instead of
 * a second, hand-rolled feasibility check) can never drift out of sync with
 * the real fill logic.
 */
const FEASIBILITY_CHECK_RANDOM = () => 0;

/**
 * Filters zones that are active, contain sufficient active candidates, and can
 * actually produce a complete, distinct-place itinerary for the requested
 * duration + preference -- not merely "has a matching tag somewhere".
 *
 * The preference check matters because a candidate can satisfy the requested
 * preference (via `tags`) while also being the zone's *only* Meal/Cafe/
 * Discovery-eligible candidate for its category: reserving it for the
 * Preference slot would then starve that mandatory slot even though "a
 * preference match exists in the zone" is technically true. `isTemplateFulfillable`
 * proves a genuine complete combination exists, not just a lone matching tag.
 */
export function getEligibleZones(
  zones: Zone[],
  candidates: PlaceCandidate[],
  duration: DurationType,
  preference: PreferenceType
): Zone[] {
  const minRequired = MIN_STOPS_BY_DURATION[duration] ?? 3;
  const candidateTemplates = DEFAULT_ROUTE_TEMPLATES.filter(
    (t) => t.durationType === duration
  );

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

    if (!hasMeal || !hasCafe) {
      return false;
    }

    // At least one of this duration's ordered templates (the 4-stop primary,
    // or its 3-stop graceful fallback) must be fully fillable for the
    // requested preference -- matching exactly what generateRoute will later
    // attempt, in the same primary-then-fallback order.
    return candidateTemplates.some((template) =>
      isTemplateFulfillable(template, activeCandidatesInZone, preference)
    );
  });
}

/**
 * Deterministically answers "can this template's slots be completely filled,
 * without place duplication, honoring the requested preference, using only
 * this candidate pool" -- see FEASIBILITY_CHECK_RANDOM for why this is safe
 * to answer by calling the real fill function with a throwaway random source.
 */
function isTemplateFulfillable(
  template: RouteTemplate,
  zoneCandidates: PlaceCandidate[],
  preference: PreferenceType
): boolean {
  return fillTemplateSlots(template, zoneCandidates, preference, FEASIBILITY_CHECK_RANDOM) !== null;
}

/**
 * Helper to pick a random element from an array using the provided random source.
 */
function pickRandomItem<T>(items: readonly T[], random: () => number): T {
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
 * Preference tokens double as PlaceCandidate.tags entries for filter matching, so
 * they're excluded from the genre-tag fallback below (Result StopCard copy).
 */
const PREFERENCE_TAG_TOKENS: ReadonlySet<string> = new Set(SUPPORTED_PREFERENCES);

/**
 * Resolves the short attraction "hook" copy for a Result StopCard: the candidate's
 * curated `hook` when present, otherwise the first non-preference genre tag (e.g.
 * ["food", "멕시칸"] -> "멕시칸"). Never reads `description` -- that field is
 * operational text (hours/break/last order/parking/waiting), Route Guide only.
 */
function resolveStopHook(candidate: PlaceCandidate): string | undefined {
  if (candidate.hook) {
    return candidate.hook;
  }
  return candidate.tags.find((tag) => !PREFERENCE_TAG_TOKENS.has(tag));
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
 * 1. Preference-First Reservation: When a specific preference (not 'anything') is
 *    requested, every candidate *eligible for the Preference slot* is tried, in
 *    turn, as the reservation for it, while the remaining slots (meal, cafe,
 *    discovery) are filled from the rest of the pool. Slot eligibility is
 *    isPreferenceSlotCandidate, not the bare tag match -- for 'food' that
 *    additionally requires the 식사 category, so the Preference stop is a second
 *    real meal rather than a second cafe (see roles.ts). Because Meal/Cafe/
 *    Discovery are mutually-exclusive by category (isMealCandidate/
 *    isCafeCandidate/isDiscoveryCandidate never overlap -- see roles.ts), fixing
 *    one reservation candidate never has a downstream ordering effect on the
 *    other slots: once a reservation is picked, either every other slot's pool is
 *    non-empty or it isn't, regardless of *which* item within each pool
 *    eventually gets chosen. That stays true when the reservation is itself
 *    slot-role-eligible (a 'food' reservation competes with the Meal slot for the
 *    식사 pool) -- it removes exactly one place from exactly one category pool,
 *    so feasibility still turns only on whether each remaining pool is non-empty.
 *    That makes exhaustively trying every reservation candidate (not just the
 *    first shuffled one) a complete search of this template's small solution
 *    space -- if any valid combination exists, this loop finds one, rather than
 *    failing on a single unlucky greedy pick.
 * 2. General Assignment: used only for 'anything' (or a template with no
 *    preference slot), where every candidate satisfies the request by definition.
 *    Standard slots are filled first, then any distinct leftover candidate fills
 *    Preference -- a legitimate fulfillment, not a fallback hiding an unmet request.
 *
 * If a specific preference cannot be honored by any reservation, this returns
 * `null` rather than silently substituting an unrelated candidate into the
 * Preference slot. Callers (generateRoute) either retry a smaller fallback
 * template or surface RecommendationEngineError -- the Preference slot is never
 * filled with a non-matching place while still being reported as fulfilled.
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

  if (hasPreferenceSlot && isSpecificPreference) {
    const prefCandidates = shuffleArray(
      zoneCandidates.filter((c) => isPreferenceSlotCandidate(c, preference)),
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

    // Exhausted every preference-matching candidate without a feasible
    // combination -- this template cannot honor the requested preference in
    // this zone. Never fall back to an unrelated candidate; let the caller
    // decide (smaller fallback template, or RecommendationEngineError).
    return null;
  }

  // General Assignment -- reached only when preference === 'anything' (or a
  // template defines no preference slot at all).
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

  // Fill preference slot from remaining available pool. 'anything' imposes no
  // constraint, so any distinct leftover candidate is a genuine fulfillment.
  if (hasPreferenceSlot) {
    const availablePool = zoneCandidates.filter((c) => !usedPlaceIds.has(c.id));
    if (availablePool.length === 0) {
      return null;
    }

    const chosen = pickRandomItem(availablePool, random);
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
 * 2. Select an eligible Zone (active, >= 3 candidates, has meal and cafe, and can
 *    actually fulfill the requested preference end-to-end -- see getEligibleZones)
 * 3. Select an Ordered Route Template matching duration
 * 4. Fill ordered slots without duplicate places
 * 5. Full-day fallback: If 4-stop primary fails, gracefully fall back to 3-stop template
 *    preserving Preference
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
  const eligibleZones = getEligibleZones(zones, candidates, durationType, preference);
  if (eligibleZones.length === 0) {
    throw new RecommendationEngineError(
      `No eligible active zones found for duration "${durationType}" and preference "${preference}"`
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
      `Insufficient matching candidates to fulfill route template "${template.id}" in zone ${selectedZone.id} for preference "${preference}"`
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
    hook: resolveStopHook(candidate),
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
    mission: pickRandomItem(BONUS_QUEST_MISSIONS, random),
    estimatedTotalMinutes,
    createdAt: new Date().toISOString(),
  };
}
