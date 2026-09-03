import { getSeoulDateString } from './picks';
import type { VisualAssetKey } from '../config/visualAssets';

/**
 * Editorial rail data model.
 *
 * Deliberately NOT named or shaped after the feature that currently renders it. The
 * landing page calls this surface "TODAY'S DAEJEON", but that name is expected to
 * change again, so it appears exactly once in the codebase -- as a `heading` prop
 * passed from RightSidebar -- and never in a type, file, id, or asset key.
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
  /**
   * CSS `object-position` for this item's banner inside the shared, fixed
   * `aspect-[15/8]` carousel viewport (EditorialSpotlightCard). Defaults to
   * `'center'`. The carousel viewport's aspect is fixed for every item
   * regardless of the source raster's own aspect -- assets narrower than 15:8
   * (the ~16:9 pair) get a small top/bottom crop via `object-cover`; this
   * escape hatch exists only to nudge which part of THAT crop is kept, for an
   * item whose baked-in copy would otherwise sit too close to the cropped edge.
   * Never used to compensate for stretching -- the raster is never stretched.
   */
  bannerObjectPosition?: string;
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
 * Production TODAY'S DAEJEON carousel set -- 5 approved banners, each with a real
 * outbound destination (product-confirmed; see PROJECT_STATE/AGENTS for the "no
 * invented URLs" rule this satisfies). The previous `night-view` banner
 * (Editorial/Banner/NightView, Figma node 160:60) is the obsolete uncaptioned
 * artwork and is deliberately EXCLUDED -- `expo-bridge-night` (node 193:6) is its
 * approved replacement and already bakes the "밤에도 만나!" caption into the raster,
 * so no caption is ever reconstructed in DOM/CSS here.
 *
 * All 5 assets are already registered in src/config/visualAssets.ts (Visual Detail
 * Pass) -- no new export or artwork was introduced for this carousel.
 */
export const EDITORIAL_ITEMS: readonly EditorialItem[] = [
  {
    id: 'kkumssi-family',
    kind: 'campaign',
    title: '우리가 누구냐면...',
    bannerAssetKey: 'editorial.banner.kkumssiFamily',
    href: 'https://www.daejeon.go.kr/drh/DrhContentsHtmlView.do?menuSeq=7425',
    external: true,
  },
  {
    id: 'bread-tour',
    kind: 'theme',
    title: '대전 빵지순례',
    bannerAssetKey: 'editorial.banner.breadTour',
    href: 'https://www.daejeoncitytour.co.kr/kor/tourCourse/07_02.php',
    external: true,
  },
  {
    id: 'tashu',
    kind: 'experience',
    title: '그냥 타슈~',
    bannerAssetKey: 'editorial.banner.tashu',
    href: 'https://www.tashu.or.kr/main.do#guide',
    external: true,
  },
  {
    id: 'expo-bridge-night',
    kind: 'spot',
    title: '밤에도 만나!',
    bannerAssetKey: 'editorial.banner.expoBridgeNight',
    href: 'https://www.djto.kr/kor/page.do?menuIdx=789',
    external: true,
  },
  {
    id: 'september-events',
    kind: 'event',
    title: '9월 행사 안내',
    bannerAssetKey: 'editorial.banner.septemberEvents',
    href: 'https://daejeontour.co.kr/festival_djt',
    external: true,
    activeFrom: '2026-09-01',
    activeUntil: '2026-10-01',
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

/**
 * Items eligible for the carousel on the given Asia/Seoul date: every item passes
 * `isEditorialItemActive`, in seed order. Deterministic and identical between server
 * and client render (both derive from the same date string), so there is no hydration
 * mismatch -- unlike the retired single-item daily rotation, nothing here depends on
 * which item was "picked" for today.
 */
export function getActiveEditorialItems(
  dateStr: string = getSeoulDateString(),
  items: readonly EditorialItem[] = EDITORIAL_ITEMS
): EditorialItem[] {
  return items.filter((item) => isEditorialItemActive(item, dateStr));
}
