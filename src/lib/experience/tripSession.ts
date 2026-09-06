import { SUPPORTED_DURATIONS, SUPPORTED_PREFERENCES } from '../../config/product';
import type { DurationType, PreferenceType, RouteResult, RouteStop } from '../random/types';

export const TRIP_SESSION_STORAGE_KEY = 'daejeon_random_trip_trip_session';

/**
 * Bumped whenever the persisted shape changes incompatibly. A payload written by
 * an older deploy and read by a newer one is discarded rather than migrated --
 * this is per-tab, throwaway trip context, never a record of anything.
 */
export const TRIP_SESSION_SCHEMA_VERSION = 1;

/**
 * How many logged route ids are retained. Only the CURRENT result's id is ever
 * actually consulted (`hasLoggedCurrentResult`), but keeping the recent few
 * costs nothing and keeps the answer correct if a future surface asks about an
 * earlier route in the same tab. Bounded so a long session cannot grow the
 * payload without limit.
 */
const MAX_LOGGED_ROUTE_IDS = 20;

/**
 * The minimum trip context that must survive a navigation away from `/` and
 * back, for the lifetime of ONE browser tab.
 *
 * WHY THIS EXISTS: `ExperienceState` lives in `ExperienceProvider`'s reducer,
 * which is mounted only on `/`. Walking to `/random-log` and back unmounted it,
 * so the app forgot the route the user had just generated -- and with it, whether
 * that route had already been logged, which is what the Memory Log write
 * affordance (ADR-042) reads to choose between `기록 남기기` and its post-log state.
 *
 * SCOPE, deliberately narrow:
 * - `sessionStorage` only, matching rerollSession.ts / visitSession.ts. Never
 *   localStorage (would outlive the trip), never a cookie, never the database.
 *   One tab, one trip: a second tab is a second trip, as it always was.
 * - The CURRENT result only -- no history, no route archive.
 * - `loggedRouteIds` mirrors the provider's existing per-Result write-eligibility
 *   set (ADR-025). It records only opaque route ids; no Memory Log content,
 *   nickname, or any other user text is ever stored here.
 * - Presentation state (revealStage, share state, peek timers) is NOT persisted.
 *   A restored trip comes back minimized, reachable via the existing
 *   "내 여행 티켓" affordance -- restoring a full-screen overlay onto a returning
 *   reader would be a surprise, not a restoration.
 */
export interface TripSessionState {
  version: number;
  result: RouteResult;
  loggedRouteIds: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Validates one persisted stop against the fields the Result Card, Route Guide,
 * and share snapshot all read unconditionally. Optional fields are accepted only
 * when present AND well-typed, so a half-written payload can never reach a
 * component as `undefined.length` or similar.
 */
function parseStop(value: unknown): RouteStop | null {
  if (!isRecord(value)) return null;
  if (typeof value.order !== 'number' || !Number.isFinite(value.order)) return null;
  if (!isNonEmptyString(value.placeId)) return null;
  if (!isNonEmptyString(value.name)) return null;
  if (typeof value.category !== 'string') return null;
  if (typeof value.stayDurationMin !== 'number' || !Number.isFinite(value.stayDurationMin)) {
    return null;
  }

  const stop: RouteStop = {
    order: value.order,
    placeId: value.placeId,
    name: value.name,
    category: value.category,
    stayDurationMin: value.stayDurationMin,
  };

  if (typeof value.address === 'string') stop.address = value.address;
  if (typeof value.tips === 'string') stop.tips = value.tips;
  if (typeof value.hook === 'string') stop.hook = value.hook;
  if (isRecord(value.mapLinks)) {
    const { naver, kakao } = value.mapLinks;
    stop.mapLinks = {
      ...(typeof naver === 'string' ? { naver } : {}),
      ...(typeof kakao === 'string' ? { kakao } : {}),
    };
  }

  return stop;
}

function parseRouteResult(value: unknown): RouteResult | null {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.id)) return null;
  if (!isNonEmptyString(value.zoneId)) return null;
  if (typeof value.zoneName !== 'string') return null;
  if (typeof value.title !== 'string') return null;
  if (typeof value.createdAt !== 'string') return null;
  if (
    typeof value.estimatedTotalMinutes !== 'number' ||
    !Number.isFinite(value.estimatedTotalMinutes)
  ) {
    return null;
  }
  if (!SUPPORTED_DURATIONS.includes(value.durationType as DurationType)) return null;
  if (!SUPPORTED_PREFERENCES.includes(value.preference as PreferenceType)) return null;
  if (!Array.isArray(value.stops) || value.stops.length === 0) return null;

  const stops: RouteStop[] = [];
  for (const rawStop of value.stops) {
    const stop = parseStop(rawStop);
    // All-or-nothing: a partially-valid itinerary is not a route, and silently
    // dropping a stop would misreport the trip the user actually drew.
    if (!stop) return null;
    stops.push(stop);
  }

  return {
    id: value.id,
    zoneId: value.zoneId,
    zoneName: value.zoneName,
    durationType: value.durationType as DurationType,
    preference: value.preference as PreferenceType,
    title: value.title,
    stops,
    ...(typeof value.mission === 'string' ? { mission: value.mission } : {}),
    estimatedTotalMinutes: value.estimatedTotalMinutes,
    createdAt: value.createdAt,
  };
}

function parseTripSession(raw: string): TripSessionState | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;
  if (parsed.version !== TRIP_SESSION_SCHEMA_VERSION) return null;

  const result = parseRouteResult(parsed.result);
  if (!result) return null;

  const loggedRouteIds = Array.isArray(parsed.loggedRouteIds)
    ? parsed.loggedRouteIds.filter(isNonEmptyString).slice(-MAX_LOGGED_ROUTE_IDS)
    : [];

  return { version: TRIP_SESSION_SCHEMA_VERSION, result, loggedRouteIds };
}

/**
 * Reads this tab's trip context. Returns null on the server, when nothing is
 * stored, or when the payload is malformed / of a different schema
 * version -- and in that last case the bad entry is REMOVED, so a corrupt value
 * cannot make every subsequent load pay to re-parse it. Callers fall back to the
 * normal initial experience state; nothing here ever throws.
 */
export function readTripSession(): TripSessionState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(TRIP_SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = parseTripSession(raw);
    if (!parsed) {
      clearTripSession();
      return null;
    }

    return parsed;
  } catch {
    // Storage disabled/unavailable -- behave exactly like "nothing stored".
    return null;
  }
}

/** Persists this tab's current trip context. SSR-safe and quota-safe (no-op on failure). */
export function saveTripSession(result: RouteResult, loggedRouteIds: readonly string[]): void {
  if (typeof window === 'undefined') return;

  const payload: TripSessionState = {
    version: TRIP_SESSION_SCHEMA_VERSION,
    result,
    loggedRouteIds: loggedRouteIds.slice(-MAX_LOGGED_ROUTE_IDS),
  };

  try {
    window.sessionStorage.setItem(TRIP_SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage quota exceeded or disabled; the in-memory trip is unaffected.
  }
}

/**
 * One-time handoff marker: `/random-log`'s `기록 남기기` links to
 * `/?compose=memory-log`, and `ExperienceProvider` opens the EXISTING composer
 * once the persisted trip has been restored.
 *
 * A URL param rather than another stored flag, because it is a single
 * navigation's intent, not session state -- nothing to clean up if the user
 * never arrives, and a shared/bookmarked link degrades to a plain visit to `/`
 * (the composer only ever opens when a restored route is actually there to
 * attach). It is consumed and stripped on arrival so a refresh or a Back does
 * not reopen the composer.
 */
export const COMPOSE_HANDOFF_PARAM = 'compose';
export const COMPOSE_HANDOFF_VALUE = 'memory-log';

/** The `/` URL that asks for the composer once the persisted trip is restored. */
export const COMPOSE_HANDOFF_HREF = `/?${COMPOSE_HANDOFF_PARAM}=${COMPOSE_HANDOFF_VALUE}`;

/**
 * Reads the handoff marker exactly once: returns whether it was present and, if
 * so, removes it from the address bar via `history.replaceState` (preserving the
 * router's own history state, and performing no navigation or re-render).
 */
export function consumeComposeHandoff(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get(COMPOSE_HANDOFF_PARAM) !== COMPOSE_HANDOFF_VALUE) {
      return false;
    }

    url.searchParams.delete(COMPOSE_HANDOFF_PARAM);
    const query = url.searchParams.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${query ? `?${query}` : ''}${url.hash}`
    );
    return true;
  } catch {
    // Malformed URL / history unavailable -- treat as "no handoff requested".
    return false;
  }
}

/** Removes this tab's trip context. Safe to call anywhere, including SSR. */
export function clearTripSession(): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(TRIP_SESSION_STORAGE_KEY);
  } catch {
    // Fail gracefully -- same contract as rerollSession.ts.
  }
}
