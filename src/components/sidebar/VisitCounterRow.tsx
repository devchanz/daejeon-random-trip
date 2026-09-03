import React, { cache } from 'react';
import { getVisitCounts } from '../../lib/database/visits';
import { TODAY_IS_COPY } from '../../content/sidebar';

// Request-scoped de-duplication only (React cache()) -- shares one pair of
// count queries across LeftSidebar's desktop + mobile duplicate render,
// mirroring RandomLogRightRailPreview.tsx. No Next.js caching directive: the
// page is already `force-dynamic`, so this re-reads on every request.
const getCachedVisitCounts = cache(() => getVisitCounts());

function formatCount(value: number, digits: number): string {
  return String(value).padStart(digits, '0');
}

/**
 * Real, server-read TOTAL VISIT / TODAY (KST) counts for the "TODAY IS..."
 * sidebar row. Server Component -- fetches directly from the DB layer (no
 * internal API round-trip). On any DB/config/read failure, renders an em
 * dash placeholder -- never a fabricated number.
 */
export async function VisitCounterRow() {
  const result = await getCachedVisitCounts();

  const totalDisplay = result.success ? formatCount(result.data.total, 5) : '—';
  const todayDisplay = result.success ? formatCount(result.data.today, 4) : '—';

  return (
    <div className="flex items-center justify-between rounded-xl bg-[#faf6ee] px-3 py-2 font-mono text-xs font-bold text-[#6b6257] border border-line-soft">
      <span>
        {TODAY_IS_COPY.totalVisitPrefix} : {totalDisplay}
      </span>
      <span>
        {TODAY_IS_COPY.todayPrefix} : {todayDisplay}
      </span>
    </div>
  );
}
