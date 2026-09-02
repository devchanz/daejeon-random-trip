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
 *   mobile normal     282:44 raw fill      886x1775 -> bands 855 wide
 *   mobile consumed   290:4 raw fill (m4)  891x1766 -> bands 891 wide
 *   desktop normal    270:42 raw fill     1122x1402 -> bands 1099 wide
 *   desktop consumed  329:2 export         400x500  -> bands 400 wide
 *
 * NOTE on masters: the native SOURCE nodes 314:55 (mobile consumed) and 326:56
 * (desktop consumed) were measured to still carry an OPAQUE WHITE exterior, so
 * slicing them would reintroduce a white box around the card. The manual
 * background cleanup exists only on the production aliases 290:4 / 329:2, so
 * those are used as the consumed masters. Flagged for design.
 */

/** Native pixel size of each band, for aspect-locking and documentation. */
export const RESULT_SKIN_BAND_SIZE = {
  mobileNormal: { header: [855, 121], body: [855, 1431], actions: [855, 218] },
  mobileConsumed: { header: [891, 122], body: [891, 1449], actions: [891, 195] },
  desktopNormal: { header: [1099, 124], body: [1099, 1024], actions: [1099, 206] },
  desktopConsumed: { header: [400, 53], body: [400, 365], actions: [400, 82] },
} as const;

/**
 * Paper surface behind the body canvas. This is the sheet's own colour for the
 * area a short body raster does not cover -- it is NOT a seam bridge between
 * mismatched sources (that problem is gone). Measured as the mean of the body
 * raster's ornament-free cream field: rgb(252,244,236).
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
 *   mobile normal body   855x1431  summary 2.10-20.55%  ribbon 21.45-25.65%  cells 25.70-88.70%  bonus 90.01-93.85%
 *   mobile consumed body 891x1449  summary 1.93-20.91%  ribbon 21.74-26.02%  cells 26.00-90.80%  bonus 91.30-95.17%
 *   desktop normal body 1099x1024  summary 1.95-26.66%  ribbon 28.03-33.98%  cells 35.40-82.60%  bonus 84.86-90.53%
 *   desktop consumed body 400x365  summary 1.92-26.58%  ribbon 27.95-33.97%  cells 33.97-84.38%  bonus 84.38-90.14%
 *
 *   wells                          primary                   share                      reroll
 *   mobile normal   855x218  top 3.21% h 34.40%       row2 47.25% h 32.11% (split 48.65/50.88%)
 *   mobile consumed 891x195  top 3.08% h 37.95%       top 50.26% h 30.25%        -
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
    headerAspect: 'aspect-[855/121] lg:aspect-[1099/124]',
    body: { mobile: 'result.skin.mobile.body', desktop: 'result.skin.desktop.body' },
    bodyAspect: 'aspect-[855/1431] lg:aspect-[1099/1024]',
    actions: { mobile: 'result.skin.mobile.actions3', desktop: 'result.skin.desktop.actions3' },
    actionsAspect: 'aspect-[855/218] lg:aspect-[1099/206]',
    regions: {
      summary:
        'absolute left-[26%] right-[5%] top-[2.10%] bottom-[79.45%] ' +
        'lg:left-[23%] lg:right-[5%] lg:top-[1.95%] lg:bottom-[73.34%]',
      cells:
        'absolute left-[4%] right-[4%] top-[25.7%] bottom-[11.3%] ' +
        'lg:left-[4%] lg:right-[4%] lg:top-[35.4%] lg:bottom-[17.4%]',
      bonus:
        'absolute left-[7%] right-[7%] top-[93.85%] bottom-[1%] ' +
        'lg:left-[7%] lg:right-[7%] lg:top-[90.53%] lg:bottom-[1.5%]',
    },
    wells: {
      primary:
        'left-[5%] right-[5.7%] top-[3.21%] h-[34.4%] ' +
        'lg:left-[4.2%] lg:right-[4.5%] lg:top-[1.46%] lg:h-[32.04%]',
      share:
        'left-[1.9%] right-[51.4%] top-[47.25%] h-[32.11%] ' +
        'lg:left-[1.8%] lg:right-[51.1%] lg:top-[42.23%] lg:h-[31.07%]',
      reroll:
        'left-[50.9%] right-[2.1%] top-[47.25%] h-[32.11%] ' +
        'lg:left-[50.5%] lg:right-[1.9%] lg:top-[42.23%] lg:h-[31.07%]',
    },
  },
  consumed: {
    header: {
      mobile: 'result.skin.mobile.consumedHeader',
      desktop: 'result.skin.desktop.consumedHeader',
    },
    headerAspect: 'aspect-[891/122] lg:aspect-[400/53]',
    body: {
      mobile: 'result.skin.mobile.consumedBody',
      desktop: 'result.skin.desktop.consumedBody',
    },
    bodyAspect: 'aspect-[891/1449] lg:aspect-[400/365]',
    actions: { mobile: 'result.skin.mobile.actions2', desktop: 'result.skin.desktop.actions2' },
    actionsAspect: 'aspect-[891/195] lg:aspect-[400/82]',
    regions: {
      summary:
        'absolute left-[26%] right-[5%] top-[1.93%] bottom-[79.09%] ' +
        'lg:left-[23%] lg:right-[5%] lg:top-[1.92%] lg:bottom-[73.42%]',
      cells:
        'absolute left-[4%] right-[4%] top-[26%] bottom-[9.2%] ' +
        'lg:left-[4%] lg:right-[4%] lg:top-[33.97%] lg:bottom-[15.62%]',
      bonus:
        'absolute left-[7%] right-[7%] top-[95.17%] bottom-[1%] ' +
        'lg:left-[7%] lg:right-[7%] lg:top-[90.41%] lg:bottom-[1%]',
    },
    wells: {
      primary:
        'left-[2.7%] right-[7.2%] top-[3.08%] h-[37.95%] ' +
        'lg:left-[5.3%] lg:right-[5.3%] lg:top-[2.44%] lg:h-[26.83%]',
      share:
        'left-[2.9%] right-[3.7%] top-[50.26%] h-[30.25%] ' +
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
 * positional, not category-based). Measured from the painted cell borders:
 *
 *   cell 1  #de6577  pink-red      cell 3  #bbbc82  green
 *   cell 2  #618bd2  blue          cell 4  #b795cd  purple
 *
 * Each entry drives BOTH the category pill and the artwork/text divider so they
 * visibly belong to their painted card.
 */
export const RESULT_CELL_ACCENTS = [
  { pill: 'border-[#de6577] text-[#b34255]', divider: 'bg-[#de6577]/55' },
  { pill: 'border-[#618bd2] text-[#3f63a8]', divider: 'bg-[#618bd2]/55' },
  { pill: 'border-[#bbbc82] text-[#78793f]', divider: 'bg-[#bbbc82]/70' },
  { pill: 'border-[#b795cd] text-[#7f5b96]', divider: 'bg-[#b795cd]/60' },
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
