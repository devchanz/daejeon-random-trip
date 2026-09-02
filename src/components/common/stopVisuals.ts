import type { VisualAssetKey } from '../../config/visualAssets';
import type { RouteStop } from '../../lib/random/types';

/**
 * Category -> stop artwork mapping, mirroring the rule documented in
 * reelVisuals.ts: this lives in the presentation layer, never in src/lib/random
 * -- which stays free of UI/asset concerns.
 *
 * The four keys correspond to the four exportable category defaults published as
 * `Result/StopVisual/{Meal,Cafe,Walk,Culture}` in the 08_RESULT handoff, and to
 * the only four categories present in the dataset. `카페·디저트` is a load-bearing
 * literal (see roles.ts `isCafeCandidate`) -- reuse the exact spelling.
 *
 * Consumed by both the Result StopCard and the Route Guide timeline, which is why
 * this module lives in `common/` rather than under `experience/`.
 */
export const STOP_CATEGORY_ASSET_KEYS: Partial<Record<string, VisualAssetKey>> = {
  '식사': 'stop.category.meal',
  '카페·디저트': 'stop.category.cafe',
  '볼거리·문화·체험': 'stop.category.culture',
  '산책·야간': 'stop.category.walk',
};

/**
 * Optional per-place override, checked before the category map. Empty until a
 * specific place needs bespoke art.
 */
export const STOP_PLACE_ASSET_KEYS: Partial<Record<string, VisualAssetKey>> = {};

/**
 * Shortened PLACE CATEGORY badge labels for the Result StopCard.
 *
 * These are place-category vocabulary and must never be mixed with the Q2
 * PREFERENCE vocabulary (아무거나 / 먹방 / 산책 / 사진). In particular:
 *   볼거리·문화·체험 -> '볼거리'  (never '사진' -- 사진 is a Q2 preference)
 *   산책·야간        -> '산책'    (never '야간' -- not a user-facing option at all)
 * The full dataset strings are kept as the map keys so the domain values are
 * untouched; this is display copy only.
 */
export const STOP_CATEGORY_BADGE_LABELS: Partial<Record<string, string>> = {
  '식사': '식사',
  '카페·디저트': '카페',
  '볼거리·문화·체험': '볼거리',
  '산책·야간': '산책',
};

/**
 * Resolves a stop's badge label, falling back to the raw category so an
 * unmapped future category still renders something truthful.
 */
export function resolveStopCategoryLabel(category: string): string {
  return STOP_CATEGORY_BADGE_LABELS[category] ?? category;
}

/**
 * Category-only resolution. Route Guide needs this because `RouteGuideStop`
 * deliberately drops `placeId`, so it cannot participate in the per-place
 * override path.
 */
export function resolveStopAssetKeyByCategory(category: string): VisualAssetKey | null {
  return STOP_CATEGORY_ASSET_KEYS[category] ?? null;
}

/**
 * Full resolution for Result stops: per-place override first, then category.
 * Returns null when no artwork is registered yet.
 */
export function resolveStopAssetKey(
  stop: Pick<RouteStop, 'placeId' | 'category'>
): VisualAssetKey | null {
  return STOP_PLACE_ASSET_KEYS[stop.placeId] ?? resolveStopAssetKeyByCategory(stop.category);
}
