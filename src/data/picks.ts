import type { TodaysPickItem } from '../lib/random/types';

export type { TodaysPickItem };

/**
 * 7-Day Today's Pick seed dataset.
 * Managed entirely via static TypeScript data without database or CMS overhead.
 *
 * Real production spot photography and pixel artwork will be populated
 * once assets are officially compiled.
 */
export const TODAYS_PICKS: readonly TodaysPickItem[] = [];

/**
 * Formats the current date in Asia/Seoul timezone as YYYY-MM-DD.
 */
export function getSeoulDateString(date: Date = new Date()): string {
  // Use Intl to ensure consistent Asia/Seoul timezone calculation regardless of host machine environment
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // Formats as YYYY-MM-DD
}

/**
 * Retrieves the Today's Pick item matching the given date string (YYYY-MM-DD).
 * Defaults to current Asia/Seoul calendar date.
 * Fallback behavior:
 * - Pre-campaign date: returns first pick (if available)
 * - Post-campaign date: returns last pick (if available)
 */
export function getTodayPickByDate(
  dateStr: string = getSeoulDateString(),
  picks: readonly TodaysPickItem[] = TODAYS_PICKS
): TodaysPickItem | null {
  if (picks.length === 0) {
    return null;
  }

  const directMatch = picks.find((p) => p.campaignDate === dateStr);
  if (directMatch) {
    return directMatch;
  }

  // Pre-campaign fallback: if target date is before the first campaign date
  const sortedPicks = [...picks].sort((a, b) =>
    a.campaignDate.localeCompare(b.campaignDate)
  );

  if (dateStr < sortedPicks[0].campaignDate) {
    return sortedPicks[0];
  }

  // Post-campaign fallback: if target date is after the last campaign date
  return sortedPicks[sortedPicks.length - 1];
}

/**
 * Retrieves a Today's Pick item by its unique URL slug.
 */
export function getTodayPickBySlug(
  slug: string,
  picks: readonly TodaysPickItem[] = TODAYS_PICKS
): TodaysPickItem | null {
  return picks.find((p) => p.slug === slug) ?? null;
}
