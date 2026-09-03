import type { DatabaseResult } from './types';
import { getDatabaseClient, type DatabaseClientContract } from './client';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000; // UTC+9, no DST

/**
 * ISO timestamp (UTC) of the most recent KST midnight, as of `now`.
 * Plain fixed-offset arithmetic -- KST has no DST, so no timezone library is
 * needed. Used to filter "visits since today (KST)".
 */
export function kstMidnightUtcIso(now: Date = new Date()): string {
  const kstNow = new Date(now.getTime() + KST_OFFSET_MS);
  const kstMidnightAsUtc = Date.UTC(
    kstNow.getUTCFullYear(),
    kstNow.getUTCMonth(),
    kstNow.getUTCDate(),
    0,
    0,
    0,
    0
  );
  return new Date(kstMidnightAsUtc - KST_OFFSET_MS).toISOString();
}

export interface VisitCounts {
  total: number;
  today: number;
}

/**
 * Records one visit (a single append-only row in `site_visits`). Callers are
 * responsible for de-duplicating per browser tab-session before calling this
 * -- see src/lib/visitor/visitSession.ts and POST /api/visits.
 */
export async function recordVisit(
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<null>> {
  try {
    await client.insertSiteVisit();
    return { success: true, data: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '방문 기록 저장 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Reads real TOTAL VISIT / TODAY (KST) counts. TOTAL is an all-time row
 * count; TODAY is a row count filtered to `created_at >= <KST midnight>`,
 * recomputed at read time -- no daily reset job needed.
 */
export async function getVisitCounts(
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<VisitCounts>> {
  try {
    const [total, today] = await Promise.all([
      client.countSiteVisits(),
      client.countSiteVisits(kstMidnightUtcIso()),
    ]);
    return { success: true, data: { total, today } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '방문자 수 조회 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}
