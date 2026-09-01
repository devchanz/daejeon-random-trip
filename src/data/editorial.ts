import { getSeoulDateString } from './picks';
import type { VisualAssetKey } from '../config/visualAssets';

/**
 * Editorial rail data model.
 *
 * Deliberately NOT named or shaped after the feature that currently renders it. The
 * landing page calls this surface "TODAY'S PICK", but that name is expected to change,
 * so it appears exactly once in the codebase -- as a `heading` prop passed from
 * RightSidebar -- and never in a type, file, id, or asset key.
 *
 * This is also deliberately NOT `TodaysPickItem` (src/lib/random/types.ts). That model
 * has 17 fields built for a `/pick/[slug]` detail page that does not exist, and it lives
 * behind the recommendation-engine boundary. The editorial rail needs a banner, a name,
 * and optional trimmings; borrowing the heavier model would drag a UI surface across an
 * engine boundary and re-bake the old feature name into it.
 */

/**
 * Semantic role of an editorial item. Items with different roles intentionally share a
 * single presentation shell -- `kind` exists to describe and, later, to filter or label
 * them, never to fork the rendering into per-kind layouts or tabs.
 */
export type EditorialKind = 'spot' | 'theme' | 'event' | 'experience' | 'campaign';

export interface EditorialItem {
  /** Stable, feature-name-agnostic identifier. */
  id: string;
  /** Semantic role. Required: an unclassified item should not compile. */
  kind: EditorialKind;
  /**
   * Accessible name for the item. Always present, but it does NOT get a dedicated
   * visible row -- the banner artwork already carries visible title copy, so this is
   * surfaced as the banner's `alt` text instead.
   */
  title: string;
  bannerAssetKey: VisualAssetKey;
  /** Rendered only when non-empty. */
  tags?: readonly string[];
  /** Short flag shown inline in the header row, so it costs no extra height. */
  badge?: string;
  /** Optional destination. When absent the card renders as non-interactive content. */
  href?: string;
  /** Marks `href` as an outbound link (adds target/rel). */
  external?: boolean;
  /** YYYY-MM-DD, Asia/Seoul. INCLUSIVE lower bound. */
  activeFrom?: string;
  /** YYYY-MM-DD, Asia/Seoul. EXCLUSIVE upper bound -- activeUntil '2026-10-01' stays eligible all of 2026-09-30. */
  activeUntil?: string;
}

/**
 * Seed set. Titles are the artwork's own wording; no tags or tourism claims are
 * invented for items whose banners do not already state them, and no `href` is set
 * because no destination exists yet.
 */
export const EDITORIAL_ITEMS: readonly EditorialItem[] = [
  {
    id: 'night-view',
    kind: 'spot',
    title: '대전 야경이 숨은 스팟',
    bannerAssetKey: 'editorial.banner.nightView',
    tags: ['#야경맛집', '#뷰맛집', '#감성여행'],
    badge: 'BEST',
  },
  {
    id: 'september-events',
    kind: 'event',
    title: '9월 행사 안내',
    bannerAssetKey: 'editorial.banner.septemberEvents',
    activeFrom: '2026-09-01',
    activeUntil: '2026-10-01',
  },
  {
    id: 'tashu',
    kind: 'experience',
    title: '그냥 타슈~',
    bannerAssetKey: 'editorial.banner.tashu',
  },
  {
    id: 'bread-tour',
    kind: 'theme',
    title: '대전 빵지순례',
    bannerAssetKey: 'editorial.banner.breadTour',
  },
  {
    // Mascot family introduction -- brand/promotional content rather than a
    // place, travel theme or dated event, which is what `campaign` is for.
    id: 'kkumssi-family',
    kind: 'campaign',
    title: '우리가 누구냐면...',
    bannerAssetKey: 'editorial.banner.kkumssiFamily',
  },
  {
    id: 'expo-bridge-night',
    kind: 'spot',
    title: '밤에도 만나!',
    bannerAssetKey: 'editorial.banner.expoBridgeNight',
  },
];

/**
 * Whether an item may be shown on the given Asia/Seoul date.
 * `activeFrom` is inclusive, `activeUntil` is exclusive -- a date-bound item such as the
 * September event banner therefore retires on its `activeUntil` date rather than a day late.
 */
export function isEditorialItemActive(item: EditorialItem, dateStr: string): boolean {
  if (item.activeFrom && dateStr < item.activeFrom) {
    return false;
  }
  if (item.activeUntil && dateStr >= item.activeUntil) {
    return false;
  }
  return true;
}

/** Whole days since the Unix epoch for a YYYY-MM-DD string. */
function toDayIndex(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * Selects the item to feature: filter by validity window first, then rotate
 * deterministically over the surviving pool by Asia/Seoul calendar date.
 *
 * Deterministic per date on purpose -- server and client derive the same item from the
 * same date string, so there is no hydration mismatch, and no autoplay or carousel is
 * involved. Returns null only if every item has expired, which the card renders as an
 * explicit empty state rather than a blank hole.
 */
export function selectEditorialItem(
  dateStr: string = getSeoulDateString(),
  items: readonly EditorialItem[] = EDITORIAL_ITEMS
): EditorialItem | null {
  const eligible = items.filter((item) => isEditorialItemActive(item, dateStr));
  if (eligible.length === 0) {
    return null;
  }
  const dayIndex = toDayIndex(dateStr);
  const offset = ((dayIndex % eligible.length) + eligible.length) % eligible.length;
  return eligible[offset];
}
