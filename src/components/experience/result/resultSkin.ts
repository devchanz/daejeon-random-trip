import type { VisualAssetKey } from '../../../config/visualAssets';
import type { RerollRewardState } from '../../../lib/experience';

/**
 * Result production-skin geometry -- the SINGLE place skin assets and measured
 * coordinates live.
 *
 * ONE RENDERER, FOUR STATE RASTERS. `normal` and `consumed` are not different
 * rendering paths: both resolve a COMPLETE approved state raster, sliced from a
 * single master per state, and both render through exactly the same mechanism
 * (`.skin-canvas` + an aspect-locked container). Only two things differ per state:
 * which asset is used, and how many action overlays are laid out.
 *
 * Every historical consumed-only visual workaround is gone: no CSS fallback
 * chrome, no gradient cobalt rails, no cream footer panel, no seam-colour bridge,
 * no negative-margin overlap, no consumed-specific padding imitating the raster,
 * and no mixed normal-body / consumed-footer sourcing.
 *
 * SLICING CONTRACT (verified per state by an asset-level acceptance test):
 * each state's header/body/actions are Y-only slices of one master at a shared
 * x-origin and full width, and stacking them reproduces that master
 * pixel-for-pixel (0 byte mismatches). That exact reconstruction is why no seam
 * compensation is required.
 *
 * Masters used:
 *   mobile normal     290:2 raw fill      434x874 -> bands 420 wide
 *   mobile consumed   290:4 raw fill      434x860 -> bands 424 wide
 *   desktop normal    270:42 raw fill     1122x1402 -> bands 1099 wide
 *   desktop consumed  329:2 export         400x500  -> bands 400 wide
 *
 * Phase 3 correction (mobile only): 282:44 (the prior mobile-normal master) is
 * SUPERSEDED by 290:2, which carries the corrected side rails/exterior. Both
 * mobile masters are now sourced from their RAW image fill, not the flattened
 * frame export returned by `download_assets`'s default settings for these two
 * nodes -- that flattened export (and ANY explicit scale override on it, 2x or
 * 3x alike) renders a 100% opaque exterior plate, while the node's own
 * unscaled default export and the raw fill both preserve real alpha. Re-sliced
 * and re-measured from scratch (not carried forward from 282:44/314:55) -- see
 * git history for the prior 855/891-wide measurements this replaced.
 *
 * NOTE on masters: the native SOURCE nodes 314:55 (mobile consumed) and 326:56
 * (desktop consumed) were measured to still carry an OPAQUE WHITE exterior, so
 * slicing them would reintroduce a white box around the card. The manual
 * background cleanup exists only on the production aliases 290:4 / 329:2, so
 * those are used as the consumed masters. Flagged for design.
 */

/** Native pixel size of each band, for aspect-locking and documentation. */
export const RESULT_SKIN_BAND_SIZE = {
  mobileNormal: { header: [420, 58], body: [420, 704], actions: [420, 112] },
  mobileConsumed: { header: [424, 59], body: [424, 706], actions: [424, 95] },
  desktopNormal: { header: [1099, 124], body: [1099, 1024], actions: [1099, 206] },
  desktopConsumed: { header: [400, 53], body: [400, 365], actions: [400, 82] },
} as const;

/**
 * Paper surface behind the body canvas. This is the sheet's own colour for the
 * area a short body raster does not cover -- it is NOT a seam bridge between
 * mismatched sources (that problem is gone). Measured as the mean of the body
 * raster's ornament-free cream field: rgb(252,244,236).
 *
 * Re-verified against the new mobile master (290:2) in the Phase 3
 * correction: fresh sample rgb(252,245,237), 1 unit/channel from the value
 * below -- within measurement noise, so this is UNCHANGED, not carried
 * forward unverified.
 */
export const RESULT_BODY_PAPER = '#fcf4ec';

interface BandKeys {
  mobile: VisualAssetKey;
  desktop: VisualAssetKey;
}

interface StateSkin {
  header: BandKeys;
  headerAspect: string;
  body: BandKeys;
  bodyAspect: string;
  actions: BandKeys;
  actionsAspect: string;
  /** Painted region rects inside the body canvas. */
  regions: { summary: string; cells: string; bonus: string };
  /** Painted action wells the DOM overlays are positioned onto. */
  wells: { primary: string; share: string; reroll: string | null };
}

/**
 * Measured painted regions and wells, per state.
 *
 * Mobile re-measured from scratch against 290:2/290:4 (Phase 3 correction) --
 * these do NOT carry forward the prior 282:44-derived percentages. Desktop is
 * OUT OF SCOPE for that correction and is unchanged below.
 *
 *   mobile normal body   420x704  summary 2.3-79.4%(bottom)  ribbon ~30.3-34.2%  cells 26.8-89.9%(bottom 10.1%)  bonus 94.0-99.0%(bottom 1.1%)
 *   mobile consumed body 424x706  summary 2.1-79.5%(bottom)  ribbon ~29.5-33.4%  cells 27.2-89.5%(bottom 10.5%)  bonus 95.2-99.0%(bottom 1.0%)
 *   desktop normal body 1099x1024  summary 1.95-26.66%  ribbon 28.03-33.98%  cells 35.40-82.60%  bonus 84.86-90.53%
 *   desktop consumed body 400x365  summary 1.92-26.58%  ribbon 27.95-33.97%  cells 33.97-84.38%  bonus 84.38-90.14%
 *
 *   wells                        primary                    share                       reroll
 *   mobile normal   420x112  top 0% h 38.4% (l4.3/r5.0%)  top 43.75% h 33.9% (l4.5/r50.0%)   top 43.75% h 33.9% (l50.5/r5.5%)
 *   mobile consumed 424x95   top 0% h 44.2% (l4.7/r6.1%)  top 48.4% h 34.7% (l4.7/r5.4%)     -
 *   desktop normal 1099x206  top 1.46% h 32.04%       row2 42.23% h 31.07% (split 48.95/50.50%)
 *   desktop consumed 400x82  top 2.44% h 26.83%       top 32.93% h 32.93%        -
 *
 * Class literals throughout: Tailwind scans source text statically, and inline
 * styles cannot be made responsive. Breakpoint is `lg` (1024px) to match
 * page.tsx's `hidden lg:flex` / `lg:hidden` dual mount of MainExperience.
 */
export const RESULT_STATE_SKIN: Record<'normal' | 'consumed', StateSkin> = {
  normal: {
    header: { mobile: 'result.skin.mobile.header', desktop: 'result.skin.desktop.header' },
    // Mobile re-measured against 290:2 (420x58 cropped raw fill); lg: (desktop) unchanged.
    headerAspect: 'aspect-[420/58] lg:aspect-[1099/124]',
    body: { mobile: 'result.skin.mobile.body', desktop: 'result.skin.desktop.body' },
    bodyAspect: 'aspect-[420/704] lg:aspect-[1099/1024]',
    actions: { mobile: 'result.skin.mobile.actions3', desktop: 'result.skin.desktop.actions3' },
    actionsAspect: 'aspect-[420/112] lg:aspect-[1099/206]',
    regions: {
      // summary left/right unchanged: content-clearance driven by the baked-in
      // DAEJEON stamp/mascot position (see ResultSummary.tsx), not the raster's
      // own edge -- re-verified structurally unchanged between masters.
      // top/bottom re-measured (border-to-border 74-203 of 420x704 body).
      summary:
        'absolute left-[26%] right-[5%] top-[2.3%] bottom-[79.4%] ' +
        'lg:left-[23%] lg:right-[5%] lg:top-[1.95%] lg:bottom-[73.34%]',
      // re-measured: cell 1 border-to-border 247-691 of 420x704 body.
      cells:
        'absolute left-[4.3%] right-[4.5%] top-[26.8%] bottom-[10.1%] ' +
        'lg:left-[4%] lg:right-[4%] lg:top-[35.4%] lg:bottom-[17.4%]',
      // re-measured: content box 720-754 of 420x704 body.
      bonus:
        'absolute left-[4.5%] right-[4.8%] top-[94.0%] bottom-[1.1%] ' +
        'lg:left-[7%] lg:right-[7%] lg:top-[90.53%] lg:bottom-[1.5%]',
    },
    // Mobile wells re-measured against 290:2's 420x112 actions band (border-to-
    // border pixel scan); lg: (desktop) unchanged.
    wells: {
      primary:
        'left-[4.3%] right-[5.0%] top-[0%] h-[38.4%] ' +
        'lg:left-[4.2%] lg:right-[4.5%] lg:top-[1.46%] lg:h-[32.04%]',
      share:
        'left-[4.5%] right-[50.0%] top-[43.75%] h-[33.9%] ' +
        'lg:left-[1.8%] lg:right-[51.1%] lg:top-[42.23%] lg:h-[31.07%]',
      reroll:
        'left-[50.5%] right-[5.5%] top-[43.75%] h-[33.9%] ' +
        'lg:left-[50.5%] lg:right-[1.9%] lg:top-[42.23%] lg:h-[31.07%]',
    },
  },
  consumed: {
    header: {
      mobile: 'result.skin.mobile.consumedHeader',
      desktop: 'result.skin.desktop.consumedHeader',
    },
    // Mobile re-measured against 290:4 (424x59 cropped raw fill); lg: unchanged.
    headerAspect: 'aspect-[424/59] lg:aspect-[400/53]',
    body: {
      mobile: 'result.skin.mobile.consumedBody',
      desktop: 'result.skin.desktop.consumedBody',
    },
    bodyAspect: 'aspect-[424/706] lg:aspect-[400/365]',
    actions: { mobile: 'result.skin.mobile.actions2', desktop: 'result.skin.desktop.actions2' },
    actionsAspect: 'aspect-[424/95] lg:aspect-[400/82]',
    regions: {
      // summary left/right unchanged -- same reasoning as normal (shared
      // header/postcard treatment across both reward states).
      // top/bottom re-measured (border-to-border 74-204 of 424x706 body).
      summary:
        'absolute left-[26%] right-[5%] top-[2.1%] bottom-[79.5%] ' +
        'lg:left-[23%] lg:right-[5%] lg:top-[1.92%] lg:bottom-[73.42%]',
      // re-measured: cell 1 border-to-border 251-691 of 424x706 body.
      cells:
        'absolute left-[4.7%] right-[5.2%] top-[27.2%] bottom-[10.5%] ' +
        'lg:left-[4%] lg:right-[4%] lg:top-[33.97%] lg:bottom-[15.62%]',
      // content box 731-758 of 424x706 body; left/right extrapolated from the
      // cells measurement above (same card margin), not independently
      // pixel-scanned this pass -- flagged in the Phase 3 report.
      bonus:
        'absolute left-[4.5%] right-[4.8%] top-[95.2%] bottom-[1.0%] ' +
        'lg:left-[7%] lg:right-[7%] lg:top-[90.41%] lg:bottom-[1%]',
    },
    // Mobile wells re-measured against 290:4's 424x95 actions band (border-to-
    // border pixel scan); lg: unchanged. Only 2 wells in this state.
    wells: {
      primary:
        'left-[4.7%] right-[6.1%] top-[0%] h-[44.2%] ' +
        'lg:left-[5.3%] lg:right-[5.3%] lg:top-[2.44%] lg:h-[26.83%]',
      share:
        'left-[4.7%] right-[5.4%] top-[48.4%] h-[34.7%] ' +
        'lg:left-[2.8%] lg:right-[3%] lg:top-[32.93%] lg:h-[32.93%]',
      reroll: null,
    },
  },
};

/** The single state selector every skin consumer uses. */
export function resolveResultSkinState(rerollReward: RerollRewardState): 'normal' | 'consumed' {
  return rerollReward === 'consumed' ? 'consumed' : 'normal';
}

/** The complete skin for the current reward state. */
export function resolveResultSkin(rerollReward: RerollRewardState): StateSkin {
  return RESULT_STATE_SKIN[resolveResultSkinState(rerollReward)];
}

/**
 * Grid shape for the painted cell matrix. Mobile is a 4-row single column,
 * desktop 2x2; identical for both reward states.
 */
export const RESULT_CELLS_GRID =
  'grid h-full w-full grid-cols-1 grid-rows-4 gap-[0.6%] lg:grid-cols-2 lg:grid-rows-2 lg:gap-[1.2%]';

/**
 * Per-cell accent, keyed by the cell's POSITION in the painted grid (the tints are
 * positional, not category-based). Border/divider colours re-measured against
 * the mobile master (290:2) in the Phase 3 correction -- the desktop master
 * (270:42, out of scope) was not re-measured, but both mobile and desktop use
 * the SAME shared table, and the new mobile-measured tones read as the same
 * hue family, just a lighter/more pastel pass than the superseded 282:44
 * measurement:
 *
 *   cell 1  #ed8b99  pink-red (was #de6577)   cell 3  #d0d39d  green (was #bbbc82)
 *   cell 2  #8dade2  blue     (was #618bd2)   cell 4  #d3bcdf  purple (was #b795cd)
 *
 * Pill/divider TEXT colours are UNCHANGED: they are hand-authored dark
 * variants for legibility, not values read off the raster, and the Phase 3
 * scope is re-measuring the artwork's own geometry/colour, not restyling
 * DOM-authored text tones.
 *
 * Each entry drives BOTH the category pill and the artwork/text divider so they
 * visibly belong to their painted card.
 */
export const RESULT_CELL_ACCENTS = [
  { pill: 'border-[#ed8b99] text-[#b34255]', divider: 'bg-[#ed8b99]/55' },
  { pill: 'border-[#8dade2] text-[#3f63a8]', divider: 'bg-[#8dade2]/55' },
  { pill: 'border-[#d0d39d] text-[#78793f]', divider: 'bg-[#d0d39d]/70' },
  { pill: 'border-[#d3bcdf] text-[#7f5b96]', divider: 'bg-[#d3bcdf]/60' },
] as const;

/** Shared pill shape; colour comes from RESULT_CELL_ACCENTS. */
export const RESULT_CELL_PILL =
  'inline-flex w-fit shrink-0 items-center justify-center rounded-full border bg-white/45 px-2 py-[1px] text-[clamp(10px,2.9vw,13px)] font-black leading-[1.35]';

/**
 * Shared divider shape; colour comes from RESULT_CELL_ACCENTS.
 *
 * Height is an explicit PERCENTAGE OF THE CONTENT ROW, centred -- not
 * `self-stretch` with percentage margins, which resolve against WIDTH and
 * collapsed the divider into a tiny mark.
 */
export const RESULT_CELL_DIVIDER = 'w-px shrink-0 self-center h-[70%] rounded-full';
