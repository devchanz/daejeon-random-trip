import type { VisualAssetKey } from '../../config/visualAssets';

/**
 * Settled-reel activity artwork, indexed by reel position.
 *
 * The mapping is fixed by ROUTE SLOT, not by the drawn place, which is why the Figma
 * Production manifest ships exactly three Character/Activity assets. Both ordered route
 * templates put the same role in the same reel:
 *
 *   half_ordered_4 / half_ordered_3 : Meal -> Cafe -> Preference
 *   full_ordered_4                  : Meal -> Cafe -> Discovery -> Preference
 *
 *   Reel 0 = Meal                     -> character.activity.food
 *   Reel 1 = Cafe                     -> character.activity.dessert
 *   Reel 2 = Discovery / Preference   -> character.activity.tashu
 *
 * Consequence, accepted by product: the settled reels look the same on every spin. The
 * per-spin variation lives in the Result Card, which is where detailed route and place
 * information belongs -- the reel window is too small to carry it legibly.
 *
 * This lives in the presentation layer on purpose. `src/lib/random` must stay free of UI
 * and asset concerns, and `ReelDisplayModel` needs no extra field to support this.
 */
export const REEL_ACTIVITY_ASSET_KEYS = [
  'character.activity.food',
  'character.activity.dessert',
  'character.activity.tashu',
] as const satisfies readonly VisualAssetKey[];
