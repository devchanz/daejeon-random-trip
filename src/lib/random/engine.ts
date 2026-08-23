import type { DurationType, PreferenceType } from '../../config/product';
import type {
  Zone,
  PlaceCandidate,
  RouteStop,
  RouteResult,
  RouteTemplate,
  GenerateRouteOptions,
  CandidateRole,
} from './types';
import { matchesRole, matchesPreference } from './roles';
import { selectRouteTemplate, DEFAULT_ROUTE_TEMPLATES } from './templates';

/**
 * Minimum active candidate count required in a zone to construct a valid itinerary.
 */
export const MIN_STOPS_BY_DURATION: Record<DurationType, number> = {
  half: 2,
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
 * a route of the requested duration.
 */
export function getEligibleZones(
  zones: Zone[],
  candidates: PlaceCandidate[],
  duration: DurationType
): Zone[] {
  const minRequired = MIN_STOPS_BY_DURATION[duration] ?? 2;

  return zones.filter((zone) => {
    if (!zone.active) {
      return false;
    }

    const activeCandidatesInZone = candidates.filter(
      (c) => c.active && c.zoneId === zone.id
    );

    return activeCandidatesInZone.length >= minRequired;
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
 * Selects a single candidate place for a specific role slot from the available pool.
 *
 * Selection Priority:
 * 1. Matching candidate role AND matching user preference
 * 2. Matching candidate role (preference fallback)
 * 3. Unclassified/legacy candidates without explicit roles (for non-stay-extender roles only)
 *
 * Note:
 * - stay-extender slots strictly require candidate role match and never fall back.
 * - Candidates with explicit roles (roles.length > 0) are restricted to their verified roles
 *   and are never used as generic fallback for other roles.
 */
function selectCandidateForSlot(
  availableCandidates: PlaceCandidate[],
  role: CandidateRole,
  preference: PreferenceType,
  random: () => number
): PlaceCandidate | null {
  if (availableCandidates.length === 0) {
    return null;
  }

  // Priority 1: Role match + Preference match
  const roleAndPrefMatches = availableCandidates.filter(
    (c) => matchesRole(c, role) && matchesPreference(c, preference)
  );
  if (roleAndPrefMatches.length > 0) {
    return pickRandomItem(roleAndPrefMatches, random);
  }

  // Priority 2: Role match (fallback when preference-specific candidate is unavailable)
  const roleMatches = availableCandidates.filter((c) => matchesRole(c, role));
  if (roleMatches.length > 0) {
    return pickRandomItem(roleMatches, random);
  }

  // stay-extender must strictly match matchesRole and NEVER use generic candidate fallback
  if (role === 'stay-extender') {
    return null;
  }

  // Priority 3: Fallback ONLY for legacy/unclassified candidates without explicit roles.
  // Explicitly verified roles are a source of truth and must not leak into other role slots.
  const unclassifiedCandidates = availableCandidates.filter(
    (c) => !c.roles || c.roles.length === 0
  );
  if (unclassifiedCandidates.length > 0) {
    return pickRandomItem(unclassifiedCandidates, random);
  }

  return null;
}

/**
 * Attempts to fill all slots of a route template without place duplication.
 * Returns the selected candidate list on success, or null if any required slot cannot be filled.
 */
function fillTemplateSlots(
  template: RouteTemplate,
  zoneCandidates: PlaceCandidate[],
  preference: PreferenceType,
  random: () => number
): PlaceCandidate[] | null {
  const usedPlaceIds = new Set<string>();
  const selectedCandidates: PlaceCandidate[] = [];

  for (const role of template.slots) {
    const availablePool = zoneCandidates.filter((c) => !usedPlaceIds.has(c.id));
    const chosen = selectCandidateForSlot(availablePool, role, preference, random);

    if (!chosen) {
      return null;
    }

    usedPlaceIds.add(chosen.id);
    selectedCandidates.push(chosen);
  }

  return selectedCandidates;
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
 * Core Flow:
 * 1. Validate inputs (durationType, preference, zone/candidate pools)
 * 2. Select an eligible Zone
 * 3. Select a Route Template matching duration, preference, and stay-extender availability
 * 4. Fill role slots without duplicates; graceful fallback to 3-stop template if stay-extender fails
 * 5. Return validated RouteResult (travelMin omitted as no curated transit data exists)
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

  const hasStayExtender = zoneCandidates.some((c) => matchesRole(c, 'stay-extender'));

  // 4. Select a matching route template
  let template = selectRouteTemplate({
    duration: durationType,
    preference,
    availableCandidateCount: zoneCandidates.length,
    hasStayExtender,
    templates: DEFAULT_ROUTE_TEMPLATES,
    random,
  });

  if (!template) {
    throw new RecommendationEngineError(
      `Failed to find a viable route template for zone ${selectedZone.id} with ${zoneCandidates.length} candidate(s)`
    );
  }

  // 5. Fill role slots without duplicates
  let selectedCandidates = fillTemplateSlots(template, zoneCandidates, preference, random);

  // If slot filling failed on a stay-extender template, gracefully fall back to 3-stop template
  if (!selectedCandidates && template.slots.includes('stay-extender')) {
    const fallbackTemplate = selectRouteTemplate({
      duration: durationType,
      preference,
      availableCandidateCount: zoneCandidates.length,
      hasStayExtender: false,
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

  // 6. Map candidates to RouteStop contract (travelMin omitted as real routing data is not present)
  const stops: RouteStop[] = selectedCandidates.map((candidate, index) => ({
    order: index + 1,
    placeId: candidate.id,
    name: candidate.name,
    category: candidate.category,
    durationMin: candidate.durationMin,
  }));

  // 7. Construct final RouteResult
  return {
    id: generateRouteId(random),
    zoneId: selectedZone.id,
    durationType,
    preference,
    stops,
    mission: undefined,
    createdAt: new Date().toISOString(),
  };
}
