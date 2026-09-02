import type { VisualAssetKey } from '../../config/visualAssets';

/**
 * Route Guide production-skin geometry -- the single place its crop coordinates
 * live. Measured by decoding the approved sources (`RouteGuide/Skin/{Desktop,
 * Mobile}`, 09_ROUTE_GUIDE), not eyeballed.
 *
 * These skins are deliberately MINIMAL: a cobalt outer frame, cream paper, and one
 * Mission decorative shell. Design's own note is explicit -- "treat both skins as
 * background/surface assets, not complete screens", "do not bake stop count into
 * the image", and "Mission box geometry is the only fixed interior decorative
 * region". So the body is an ornament-free strip that tiles on Y while the long,
 * variable-length timeline stays entirely DOM-driven.
 *
 * Measured frame bounds within each source:
 *   mobile   x 0-886   y 0-1773  (887x1774)  mission shell rows 287-435
 *   desktop  x 11-1524 y 8-1012  (1514x1005) mission shell rows 218-305
 * The desktop source carries ~11px of cream padding outside its dark frame
 * outline; the crops start at the outline so no pale edge shows around the frame.
 * The mobile source's black outer ring is part of the artwork and is kept.
 *
 * Band crops: header = top 10% of the frame, footer = bottom 8%, body = a uniform
 * slice from 58-62% (verified ornament-free), mission = the amber dashed box inset
 * horizontally to the inner cream edge so it never double-draws the cobalt rails.
 */

export interface GuideSkinBandKeys {
  mobile: VisualAssetKey;
  desktop: VisualAssetKey;
}

export const GUIDE_HEADER_BAND: GuideSkinBandKeys = {
  mobile: 'routeGuide.skin.mobile.header',
  desktop: 'routeGuide.skin.desktop.header',
};

/** Ornament-free cream+rails strip; tiles vertically behind the timeline. */
export const GUIDE_BODY_STRIP: GuideSkinBandKeys = {
  mobile: 'routeGuide.skin.mobile.body',
  desktop: 'routeGuide.skin.desktop.body',
};

export const GUIDE_FOOTER_BAND: GuideSkinBandKeys = {
  mobile: 'routeGuide.skin.mobile.footer',
  desktop: 'routeGuide.skin.desktop.footer',
};

/**
 * The one fixed interior decorative region, applied as the mission section's
 * background so it tracks the DOM mission block rather than a page offset.
 *
 * ONE asset serves both breakpoints, and it is **aspect-locked and never
 * stretched**: the dashed border and its sparkles would visibly distort under a
 * vertical stretch. The desktop RouteGuide skin's own mission crop is ~15:1
 * (proportioned for a 760x505 landscape modal) which cannot hold a label plus two
 * lines at our portrait modal width, so the 5.1:1 mobile shell is used throughout.
 * Mission text is clamped to 2 lines and its type scales responsively to fit
 * inside the locked height.
 */
export const GUIDE_MISSION_SHELL_KEY = 'routeGuide.missionShell' as const;

/** Native size of the mission shell crop, for aspect-locking. */
export const GUIDE_MISSION_SHELL_SIZE = { w: 834, h: 163 } as const;
/** Literal aspect class (Tailwind scans source text statically). */
export const GUIDE_MISSION_SHELL_ASPECT = 'aspect-[834/163]';

/** Sampled cream paper colour, painted behind the tiling strip as a seam guard. */
export const GUIDE_PAPER = '#f7efe3';
