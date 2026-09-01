/**
 * Central visual asset registry.
 *
 * Separates four concerns that must be free to change independently:
 *
 *   Figma semantic frame  ->  exported filename  ->  stable code key  ->  feature usage
 *
 * The keys below are transcribed verbatim from the per-asset `handoff` labels published in
 * the Figma Production manifest (file `oyEWRpRpaslcF3Iyuw3Jfa`, node `151:2`), so a
 * key is the design side's own contract, not a local invention. Consequences:
 *
 * - Renaming a *feature* (e.g. "Today's Pick") never requires renaming an asset.
 * - Re-exporting artwork changes exactly one line here, never a component.
 * - Figma node names and filenames never become application identity. In particular
 *   `character.avatar.*` keys are asset identity only; the stable application ids
 *   (`mongmong`, `kkumdongi`, ...) live in `src/config/avatars.ts` and are frozen.
 *
 * 39 entries = 31 assets exported in the first visual-detail pass
 *            +  3 added in the final closeout (playback controls + 2 editorial banners)
 *            +  5 pre-existing production assets adopted for single-source-of-truth.
 * (Two further closeout assets -- Setup/Preference/Food and Editorial/Banner/Tashu --
 * were replacements overwritten in place, so they add no new entry.)
 *
 * (`slot-shell.png` is present in `public/assets/` but referenced by no component and
 * is deliberately not registered.)
 */

export const VISUAL_ASSETS = {
  // --- 01_BRAND ---
  'brand.logo.primary': '/assets/brand-logo-primary.png',

  // --- 02_CHROME ---
  // Both `*Controls` files are single composite sprites containing all three glyphs;
  // they are not per-glyph exports and are rendered as one decorative image each.
  'chrome.navigationControls': '/assets/chrome-navigation-controls.png',
  'chrome.windowControls': '/assets/chrome-window-controls.png',
  'chrome.menu': '/assets/chrome-navigation-menu.png',

  // --- 03_SETUP ---
  // Canonical, must never be cross-wired: HalfDay is the SUN, FullDay is the MOON.
  'setup.duration.halfDay': '/assets/setup-duration-half-day.png',
  'setup.duration.fullDay': '/assets/setup-duration-full-day.png',
  'setup.preference.any': '/assets/setup-preference-any.png',
  'setup.preference.food': '/assets/setup-preference-food.png',
  'setup.preference.walk': '/assets/setup-preference-walk.png',
  'setup.preference.photo': '/assets/setup-preference-photo.png',

  // --- 04_CHARACTER / Activity (settled slot reels) ---
  'character.activity.food': '/assets/character-activity-food.png',
  'character.activity.dessert': '/assets/character-activity-dessert.png',
  'character.activity.tashu': '/assets/character-activity-tashu.png',

  // --- 04_CHARACTER / Avatar (Random Log identities) ---
  'character.avatar.mongmong': '/assets/character-avatar-mongmong.png',
  'character.avatar.kkumdongi': '/assets/character-avatar-kkumdongi.png',
  'character.avatar.nebeu': '/assets/character-avatar-nebeu.png',
  'character.avatar.geumdori': '/assets/character-avatar-geumdori.png',
  'character.avatar.kkumnuri': '/assets/character-avatar-kkumnuri.png',
  'character.avatar.kkumdori': '/assets/character-avatar-kkumdori.png',
  'character.avatar.doreu': '/assets/character-avatar-doreu.png',
  'character.avatar.kkumbichi': '/assets/character-avatar-kkumbichi.png',
  'character.avatar.eunsuni': '/assets/character-avatar-eunsuni.png',
  'character.avatar.kkumsuni': '/assets/character-avatar-kkumsuni.png',

  // --- 05_EDITORIAL ---
  'editorial.mascotPerched': '/assets/editorial-mascot-perched.png',
  'editorial.banner.nightView': '/assets/editorial-banner-night-view.png',
  'editorial.banner.septemberEvents': '/assets/editorial-banner-september-events.png',
  'editorial.banner.tashu': '/assets/editorial-banner-tashu.png',
  'editorial.banner.breadTour': '/assets/editorial-banner-bread-tour.png',
  'editorial.banner.kkumssiFamily': '/assets/editorial-banner-kkumssi-family.png',
  'editorial.banner.expoBridgeNight': '/assets/editorial-banner-expo-bridge-night.png',

  // --- 06_MEDIA ---
  'media.musicNote': '/assets/media-music-note.png',
  // Single composite strip containing all four transport controls
  // (previous / pause / next / stop). Never split or cropped -- it is placed as
  // one visual layer with DOM control regions overlaid on top; see LeftSidebar.
  'media.playbackControls': '/assets/media-playback-controls.png',

  // --- 07_DECORATION ---
  // Feature-agnostic identities. Current standalone consumers:
  //   star   -> Header title-bar, Setup header, Editorial / TODAY'S PICK header
  //   clover -> MY PROFILE header, VISITOR LOG header
  // Each consumer is an explicit approved decision; only the box size differs between
  // them, since compensation is a property of the artwork (see VISUAL_ASSET_OPAQUE_FIT).
  // Do not add a consumer merely because the asset exists.
  'decoration.symbol.clover': '/assets/decoration-symbol-clover.png',
  'decoration.symbol.star': '/assets/decoration-symbol-star.png',

  // --- Pre-existing production assets (already in public/assets) ---
  // `character.main.kkumdori` is the static brand illustration and is a different
  // role from the selectable `character.avatar.kkumdori`; never alias the two.
  'slot.production.idle': '/assets/slot-idle.png',
  'slot.production.pulled': '/assets/slot-pulled.png',
  'character.main.kkumdori': '/assets/kkumdori-main.png',
  'footer.landscape.left': '/assets/footer-landscape-left.png',
  'footer.landscape.right': '/assets/footer-landscape-right.png',
} as const satisfies Record<string, `/assets/${string}`>;

export type VisualAssetKey = keyof typeof VISUAL_ASSETS;

/** Resolves a stable asset key to its public path. */
export function visualAsset(key: VisualAssetKey): string {
  return VISUAL_ASSETS[key];
}

/**
 * Intrinsic pixel dimensions, recorded only where a component needs an explicit
 * aspect-ratio or width/height pair to avoid layout shift while the image loads.
 * Icons sized by a fixed CSS box (h-4 w-4 etc.) do not need an entry.
 */
export const VISUAL_ASSET_META: Partial<Record<VisualAssetKey, { w: number; h: number }>> = {
  'brand.logo.primary': { w: 680, h: 408 },
  'chrome.navigationControls': { w: 579, h: 193 },
  'chrome.windowControls': { w: 501, h: 167 },
  'editorial.mascotPerched': { w: 137, h: 151 },
  'editorial.banner.nightView': { w: 533, h: 300 },
  'editorial.banner.septemberEvents': { w: 486, h: 274 },
  // Tashu was re-exported in the closeout pass and its aspect changed
  // (1.796 -> 1.872). A stale intrinsic size here would reserve the wrong
  // height and shift the card layout while the banner loads.
  'editorial.banner.tashu': { w: 670, h: 358 },
  'editorial.banner.breadTour': { w: 665, h: 374 },
  'editorial.banner.kkumssiFamily': { w: 533, h: 285 },
  'editorial.banner.expoBridgeNight': { w: 533, h: 285 },
};

/**
 * Transparent-padding compensation ("opaque fit").
 *
 * Several Figma exports carry large transparent margins, so the CSS box size and the
 * VISIBLE artwork size diverge badly. Measured opaque bounding boxes (alpha > 8):
 *
 *   setup.preference.food      48.4% x  68.5%   <- re-exported in the closeout pass;
 *                                                 the previous artwork was full-bleed (100%)
 *   setup.duration.halfDay     65.7% x  63.9%
 *   setup.preference.photo     56.5% x  41.0%
 *   media.musicNote            52.7% x  59.1%
 *   setup.preference.any       50.3% x  53.4%
 *   setup.duration.fullDay     45.4% x  54.6%
 *   setup.preference.walk      42.7% x  46.7%
 *   brand.logo.primary         91.5% x  64.7%
 *
 * From an identical 20px box the fork+spoon therefore rendered 20px of artwork while
 * the leaf rendered 8.5px -- a 2.3x inconsistency that no uniform size bump can fix.
 *
 * CONTRACT. `scale` fits the opaque bounding box's LARGEST dimension into the intended
 * visible box while PRESERVING the artwork's aspect ratio. It does NOT make both opaque
 * width and opaque height equal the box: the shorter axis stays proportionally smaller,
 * which is correct (a camera reads wider than tall). What becomes uniform across icons
 * is optical mass along the dominant axis, not the bounding box.
 *
 * For the square setup/BGM assets, `scale` is `1 / max(opaqueW%, opaqueH%)`.
 * `brand.logo.primary` is the one non-square case: its layout box is given the OPAQUE
 * aspect (622x264) rather than the canvas aspect, and its scale is derived for that box.
 *
 * The exported PNGs are never modified -- compensation lives here and is applied in
 * exactly one place, `FittedAsset`. Feature components never write a transform.
 */
export interface OpaqueFit {
  /** Scale factor applied by FittedAsset. See CONTRACT above. */
  scale: number;
  /**
   * Optional centring nudge, expressed as a fraction of the layout box (so it scales
   * with the box). Ships UNSET for every asset: measured offsets of the opaque centre
   * from the canvas centre are at most -1.7px on a 22px icon (media.musicNote) and
   * -3.9px on the 104px-tall logo, i.e. within tolerance, and every asset sits high in
   * its canvas consistently. These exist so a Human Browser finding can be corrected
   * centrally rather than with a component-specific translate hack.
   */
  dx?: number;
  dy?: number;
}

export const VISUAL_ASSET_OPAQUE_FIT: Partial<Record<VisualAssetKey, OpaqueFit>> = {
  'brand.logo.primary': { scale: 1.544 },
  'setup.duration.halfDay': { scale: 1.522 },
  'setup.duration.fullDay': { scale: 1.832 },
  'setup.preference.any': { scale: 1.873 },
  // Closeout re-export: the new yellow-handle fork/spoon is NOT full-bleed like
  // the artwork it replaced (measured 48.4% x 68.5% opaque, from 215x304 at
  // (120,64) in a 444x444 canvas). Left at the old 1.0 it would render at ~68%
  // of its box while every other Q2 icon fills its own -- exactly the
  // inconsistency this table exists to remove. Measured centring offset is
  // dx +1.24% / dy -1.35%, inside the tolerance accepted for the other icons,
  // so no dx/dy is needed.
  'setup.preference.food': { scale: 1.461 },
  'setup.preference.walk': { scale: 2.141 },
  'setup.preference.photo': { scale: 1.77 },
  'media.musicNote': { scale: 1.692 },
  // Decoration symbols were previously uncompensated, so their transparent padding made
  // them render well under their box: at 16px the star showed ~12.4px and the clover only
  // ~9.3px. Measured opaque: star 77.6% x 79.7%, clover 57.9% x 66.2%.
  // One entry per asset serves every consumer -- compensation is a property of the artwork,
  // so only the box size differs between the Setup header (12/14px) and the right rail (20px).
  'decoration.symbol.star': { scale: 1.255 },
  'decoration.symbol.clover': { scale: 1.511 },
};

/** Resolves an asset's opaque-fit entry, or undefined when no compensation applies. */
export function opaqueFit(key: VisualAssetKey): OpaqueFit | undefined {
  return VISUAL_ASSET_OPAQUE_FIT[key];
}
