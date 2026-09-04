'use client';

import { useEffect } from 'react';
import { captureUtmAttribution } from '../../lib/attribution/utmSession';
import { pushDataLayerEvent } from '../../lib/analytics';

const LANDING_VIEW_SESSION_KEY = 'daejeon_random_trip_landing_view_dispatched';

/**
 * Claims this browser tab-session's one `landing_view` dispatch, if it
 * hasn't been claimed yet. Mirrors `visitSession.ts`'s `claimVisitOnce()`
 * exactly: the flag is set BEFORE the caller fires the event (not after),
 * so React StrictMode's dev double-invoke of this effect can't race its way
 * into dispatching twice, and a same-session page refresh never re-fires it
 * (sessionStorage survives a refresh).
 */
function claimLandingViewOnce(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    if (window.sessionStorage.getItem(LANDING_VIEW_SESSION_KEY)) {
      return false;
    }
    window.sessionStorage.setItem(LANDING_VIEW_SESSION_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

/**
 * Single page-level analytics entry point -- mounted exactly once in
 * page.tsx (never inside a responsively dual-mounted tree), alongside
 * `VisitBeacon`. Renders nothing.
 *
 * Ordering is the whole point of this component existing as one unit rather
 * than two independent sibling effects: UTM attribution MUST be captured
 * into sessionStorage before `landing_view` dispatches, so that first event
 * (and every one after it, via the dispatcher's own auto-attach) can carry
 * the session's attribution. Two separate effects racing across two
 * components would depend on React's effect-ordering guarantees remaining
 * stable; one effect in one component makes the order structurally
 * guaranteed instead.
 */
export function AnalyticsBootstrap() {
  useEffect(() => {
    captureUtmAttribution();

    if (!claimLandingViewOnce()) return;
    pushDataLayerEvent('landing_view');
  }, []);

  return null;
}
