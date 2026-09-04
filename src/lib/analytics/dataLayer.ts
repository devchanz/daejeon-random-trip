import { getStoredUtmAttribution } from '../attribution/utmSession';
import {
  ANALYTICS_CALLER_PARAM_KEYS,
  ANALYTICS_UTM_PARAM_KEYS,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from './events';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Defensive cap -- every param value is a short categorical string/number, never free text. */
const MAX_STRING_PARAM_LENGTH = 100;

/**
 * Sanitizes a single param value: strings are trimmed and length-capped,
 * finite numbers pass through, everything else (booleans, objects, arrays,
 * functions, NaN/Infinity, empty/whitespace-only strings) is dropped.
 * This is the enforcement point for "no arbitrary objects, no free text".
 */
function sanitizeParamValue(value: unknown): string | number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    return trimmed.slice(0, MAX_STRING_PARAM_LENGTH);
  }
  return undefined;
}

/**
 * Central, SSR-safe GA4/GTM custom-event dispatcher -- the ONLY place in the
 * app that touches `window.dataLayer`. Every product component imports this
 * instead (per AGENTS.md's `src/lib/analytics` module boundary).
 *
 * Contract:
 * - No-op on the server and if `window` is unavailable.
 * - Only the approved shared-parameter whitelist (`events.ts`) is ever
 *   forwarded; any other key on `params` is silently ignored, never sent.
 * - `undefined`/`null`/empty-string/non-primitive values are dropped, never
 *   sent as literal "undefined"/"null" strings.
 * - The session's first-touch UTM attribution (if any) is attached
 *   automatically to EVERY event -- call sites must never pass utm_* values
 *   themselves (the type of `params` does not even allow it).
 * - Each push explicitly resets every approved event-specific key to
 *   `undefined` before setting only the current event's own values, so a
 *   Data Layer Variable in GTM can never keep resolving to a PRIOR event's
 *   value (GTM's dataLayer resolves against a running merged model, not a
 *   per-push snapshot -- a key simply omitted from a push does not clear it
 *   there; only an explicit `undefined` does). UTM keys are exempt from this
 *   reset -- they are session-scoped attribution, not event-specific, and
 *   are meant to persist unchanged across every event in the session.
 * - Never throws: a failure here must never break the product experience.
 */
export function pushDataLayerEvent(
  eventName: AnalyticsEventName,
  params: AnalyticsEventParams = {}
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload: Record<string, string | number | undefined> = {};

    // 1. Reset every approved event-specific key to `undefined` FIRST, in
    //    this same push -- see the docstring above for why omission alone
    //    is not enough to clear a GTM Data Layer Variable.
    for (const key of ANALYTICS_CALLER_PARAM_KEYS) {
      payload[key] = undefined;
    }

    // 2. Then set only THIS event's own sanitized values over the resets.
    for (const key of ANALYTICS_CALLER_PARAM_KEYS) {
      const sanitized = sanitizeParamValue((params as Record<string, unknown>)[key]);
      if (sanitized !== undefined) {
        payload[key] = sanitized;
      }
    }

    // 3. UTM attribution is session-scoped, not event-specific -- deliberately
    //    NOT reset above, so it keeps resolving the same way on every event.
    const utm = getStoredUtmAttribution();
    if (utm) {
      for (const key of ANALYTICS_UTM_PARAM_KEYS) {
        const value = utm[key];
        if (value) {
          payload[key] = value;
        }
      }
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });
  } catch {
    // Analytics must never break the product experience.
  }
}
