export const UTM_SESSION_STORAGE_KEY = 'daejeon_random_trip_utm_attribution';

/** utm_term is intentionally never captured or stored, per product decision. */
export const UTM_PARAM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

export type UtmParamKey = (typeof UTM_PARAM_KEYS)[number];

export type UtmAttribution = Partial<Record<UtmParamKey, string>>;

/** Defensive cap -- these are short campaign-tag tokens, never free text. */
const MAX_UTM_VALUE_LENGTH = 100;

function sanitizeUtmValue(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_UTM_VALUE_LENGTH);
}

/**
 * Safely reads the stored first-touch UTM attribution for this browser
 * session. Returns null in SSR environments, if nothing is stored, or if the
 * stored value fails to parse -- mirrors rerollSession.ts/visitSession.ts's
 * SSR-safe, fail-silently contract.
 */
export function getStoredUtmAttribution(): UtmAttribution | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(UTM_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const result: UtmAttribution = {};
    for (const key of UTM_PARAM_KEYS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === 'string' && value) {
        result[key] = value;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

function saveUtmAttribution(attribution: UtmAttribution): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(UTM_SESSION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Storage quota exceeded or disabled; fail gracefully.
  }
}

/**
 * Captures the FIRST valid UTM attribution for this browser tab-session and
 * persists it to sessionStorage (never cookies). Safe to call on every
 * client-side landing/navigation:
 *
 * - No-op (returns the existing value) once an attribution is already
 *   stored for this session -- first-touch wins, a later internal
 *   navigation or a second campaign click mid-session never overwrites it.
 * - No-op (returns null, writes nothing) if the current URL carries no
 *   `utm_*` query params at all -- this is what guarantees an internal
 *   navigation with an empty query string can never clobber a real
 *   first-touch value with nothing.
 * - Captures exactly `utm_source`/`utm_medium`/`utm_campaign`/`utm_content`;
 *   `utm_term` is never read. No closed enum on `utm_source` -- any new
 *   channel value works without a code change.
 * - SSR-safe and fails silently if storage is unavailable, matching
 *   rerollSession.ts/visitSession.ts.
 */
export function captureUtmAttribution(
  search: string = typeof window !== 'undefined' ? window.location.search : ''
): UtmAttribution | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = getStoredUtmAttribution();
  if (existing) {
    return existing;
  }

  try {
    const params = new URLSearchParams(search);
    const candidate: UtmAttribution = {};

    for (const key of UTM_PARAM_KEYS) {
      const raw = params.get(key);
      if (raw) {
        const sanitized = sanitizeUtmValue(raw);
        if (sanitized) {
          candidate[key] = sanitized;
        }
      }
    }

    if (Object.keys(candidate).length === 0) {
      return null;
    }

    saveUtmAttribution(candidate);
    return candidate;
  } catch {
    return null;
  }
}
