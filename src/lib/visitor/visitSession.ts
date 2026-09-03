export const VISIT_SESSION_STORAGE_KEY = 'daejeon_random_trip_visit_logged';

/**
 * Claims this browser tab-session's one visit, if it hasn't been claimed yet.
 * Returns true the first time it's called for this sessionStorage-scoped
 * session (the caller should then POST /api/visits); returns false on every
 * subsequent call in the same tab, including a page refresh -- sessionStorage
 * survives a refresh, so a refresh never re-counts.
 *
 * The flag is set BEFORE returning true (not after the POST resolves), so a
 * duplicate effect invocation (e.g. React StrictMode's double-invoke in dev)
 * can't race its way into claiming twice.
 *
 * SSR-safe (no-op false on the server) and fails gracefully if storage is
 * unavailable/quota-exceeded -- mirrors src/lib/experience/rerollSession.ts.
 */
export function claimVisitOnce(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    if (window.sessionStorage.getItem(VISIT_SESSION_STORAGE_KEY)) {
      return false;
    }
    window.sessionStorage.setItem(VISIT_SESSION_STORAGE_KEY, '1');
    return true;
  } catch {
    // Storage disabled/unavailable -- don't block or double-count, just skip.
    return false;
  }
}
