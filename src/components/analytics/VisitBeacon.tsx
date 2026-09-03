'use client';

import { useEffect } from 'react';
import { claimVisitOnce } from '../../lib/visitor/visitSession';

/**
 * Records exactly one visit per browser tab-session. Mounted ONCE in
 * page.tsx (not inside LeftSidebar, which renders twice for the
 * desktop/mobile responsive stages) so a real visit is never double-counted
 * by the duplicate mount. Renders nothing.
 */
export function VisitBeacon() {
  useEffect(() => {
    if (!claimVisitOnce()) return;

    fetch('/api/visits', { method: 'POST' }).catch(() => {
      // Fire-and-forget: a missed count is not user-visible or blocking.
    });
  }, []);

  return null;
}
