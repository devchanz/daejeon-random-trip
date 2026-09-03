import { NextResponse } from 'next/server';
import { recordVisit } from '../../../lib/database/visits';

/**
 * POST /api/visits
 *
 * Records one visit (one row in `site_visits`). Called once per browser
 * tab-session -- de-duplication happens client-side before this is ever
 * called (see src/lib/visitor/visitSession.ts / VisitBeacon.tsx), so this
 * endpoint itself performs an unconditional insert.
 *
 * No GET route exists here: server-side reads (TOTAL VISIT / TODAY) go
 * directly through src/lib/database/visits.ts from LeftSidebar, matching the
 * RandomLogRightRailPreview precedent -- no internal HTTP round-trip.
 */
export async function POST() {
  const result = await recordVisit();

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
