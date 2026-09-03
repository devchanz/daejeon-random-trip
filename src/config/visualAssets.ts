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
 * 55 entries = 31 assets exported in the first visual-detail pass
 *            +  3 added in the final closeout (playback controls + 2 editorial banners)
 *            +  5 pre-existing production assets adopted for single-source-of-truth
 *            +  4 Result StopVisual category defaults (08_RESULT handoff)
 *            + 12 Result skin bands (08_RESULT: 4 complete states x header/body/actions)
 * (Several closeout/correction assets -- Setup/Preference/Food, Editorial/Banner/Tashu,
 * Character/Profile/Kkumdori, Media/Playback/Controls -- were replacements overwritten
 * in place, so they add no new entry.)
 *
 * Phase 4 retired the 6 Route Guide header/body/footer skin bands (both
 * breakpoints); a later correction retired the mission shell too (see the
 * 09_ROUTE_GUIDE section below) -- Route Guide is fully DOM/CSS now, with
 * zero registered rasters of its own.
 *
 * `setup.intro.start` (Setup/Intro/StartButton, node 354:2) was registered
 * ahead of the INTRO phase implementation but was never consumed -- the
 * shipped INTRO (Phase 5, `IntroGate.tsx`) renders a DOM/CSS ticket card and
 * button instead. Retired in the Phase 8 closeout audit (zero runtime
 * consumers verified): the registry entries below and
 * `public/assets/setup-intro-start.png` were both removed, not left dormant.
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

  // --- 08_RESULT / StopVisual ---
  // The four exportable category defaults published as `Result/StopVisual/{Meal,
  // Cafe,Walk,Culture}`. Exported at 3x (300x300) from a 100x100 design node --
  // the artwork is anti-aliased raster styled as pixel art (verified: no integer
  // pixel grid), so downscaling to the ~64-72px render box is safe and sharp.
  // All four are FULL-BLEED (measured 100% opaque, edge to edge): each tile
  // carries its own background fill, so none takes a VISUAL_ASSET_OPAQUE_FIT
  // entry and none should be rendered inside a decorative frame.
  'stop.category.meal': '/assets/stop-category-meal.png',
  'stop.category.cafe': '/assets/stop-category-cafe.png',
  'stop.category.walk': '/assets/stop-category-walk.png',
  'stop.category.culture': '/assets/stop-category-culture.png',

  // --- 08_RESULT / Skin bands ---
  // Deterministic crops of the approved whole-card production blanks
  // (`Result/Skin/{DesktopBlank-Normal3Action,MobileBlank-Normal3Action,
  // MobileBlank-RerollConsumed2Action}`), split at measured seams into the three
  // zones of the Result shell. Crop geometry lives in result/resultSkin.ts.
  // The header band and body canvas are shared by the normal and consumed states
  // -- only the action band differs, per the 08_RESULT handoff. Both reward states
  // now have an approved action raster at both breakpoints, so no state falls back
  // to a CSS reconstruction any more.
  'result.skin.desktop.header': '/assets/result-skin-desktop-header.png',
  'result.skin.desktop.body': '/assets/result-skin-desktop-body.png',
  'result.skin.desktop.actions3': '/assets/result-skin-desktop-actions-3.png',
  // Approved desktop CONSUMED band (Result/Skin/DesktopBlank-RerollConsumed2Action,
  // node 329:2). Its arrival removed the DOM/CSS visual fallback this state used
  // to need. Exported at the node's own configured scale so the manually cleaned
  // transparent exterior survives -- overriding the export scale flattens it.
  'result.skin.desktop.actions2': '/assets/result-skin-desktop-actions-2.png',
  'result.skin.mobile.header': '/assets/result-skin-mobile-header.png',
  'result.skin.mobile.body': '/assets/result-skin-mobile-body.png',
  'result.skin.mobile.actions3': '/assets/result-skin-mobile-actions-3.png',
  'result.skin.mobile.actions2': '/assets/result-skin-mobile-actions-2.png',
  // CONSUMED is a complete state: its header/body/actions are all Y-only slices of
  // ONE master per breakpoint, so no state mixes normal-body with a consumed
  // footer any more. Verified by an asset-level test -- stacking each state's
  // three bands reproduces its master pixel-for-pixel (0 byte mismatches).
  'result.skin.mobile.consumedHeader': '/assets/result-skin-mobile-consumed-header.png',
  'result.skin.mobile.consumedBody': '/assets/result-skin-mobile-consumed-body.png',
  'result.skin.desktop.consumedHeader': '/assets/result-skin-desktop-consumed-header.png',
  'result.skin.desktop.consumedBody': '/assets/result-skin-desktop-consumed-body.png',

  // --- 09_ROUTE_GUIDE ---
  // Route Guide is fully DOM/CSS now -- no entries in this section. Phase 4
  // retired the 6 header/body/footer skin bands; a later correction retired
  // the one remaining raster (the mission shell) too, moving that section to
  // the same Random Log / paper-card DOM language as the rest of the shell
  // (see RouteGuideModal.tsx). `route-guide-mission-shell.png` is deleted
  // from public/assets, not just unregistered.

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
  // Replaced in place from node 352:166's raw source fill (1662x946, alpha
  // verified), vertically cropped to the frame's own 238x53 (4.4906:1)
  // composition -- the flattened frame export was a 100% opaque #FBFBFB
  // plate, so the crop was reproduced from the raw source instead of the
  // frame export. See crop math in the asset-hygiene notes in PROJECT_STATE.
  'media.playbackControls': '/assets/media-playback-controls.png',
  // BGM actualization (feat/sidebar-actualization-bgm): the paused-state
  // sibling of the composite above, swapped in at runtime when playback is
  // paused. Sourced from Figma node 377:170 ("play 2", native 218x53),
  // Figma-exported at 4x then composited -- never CSS-stretched -- onto the
  // SAME 1662x370 transparent canvas as media.playbackControls (the pixel
  // dimensions behind that asset's 238x53/4.4906:1 CSS box), centered
  // horizontally with 70px transparent padding each side (the 1662px-canvas
  // equivalent of ~10px at the 238px CSS display size). Previous/Next/Stop
  // are pixel-identical to media.playbackControls in this export -- only the
  // center button's icon/highlight differs -- so the existing hit-region
  // percentages in BGM_PLAYING_COPY apply unchanged to both states.
  'media.playbackControlsPlay': '/assets/media-playback-controls-play.png',

  // --- 07_DECORATION ---
  // Feature-agnostic identities. Current standalone consumers:
  //   star   -> Header title-bar, Setup header, Editorial / TODAY'S DAEJEON header
  //   clover -> MY PROFILE header, MEMORY LOG header (user-facing name; the
  //             component/route/DB naming underneath is still RandomLog*)
  // Each consumer is an explicit approved decision; only the box size differs between
  // them, since compensation is a property of the artwork (see VISUAL_ASSET_OPAQUE_FIT).
  // Do not add a consumer merely because the asset exists.
  'decoration.symbol.clover': '/assets/decoration-symbol-clover.png',
  'decoration.symbol.star': '/assets/decoration-symbol-star.png',

  // --- Pre-existing production assets (already in public/assets) ---
  'slot.production.idle': '/assets/slot-idle.png',
  'slot.production.pulled': '/assets/slot-pulled.png',
  // `character.main.kkumdori` is the static brand illustration and is a different
  // role from the selectable `character.avatar.kkumdori`; never alias the two.
  // Replaced in place from node 354:4's raw source fill (3495x4096, alpha
  // verified) -- the previously committed file was itself a 100% opaque
  // 149x206 flattened plate, the same defect class as the frame export.
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
  // Square StopVisual tiles -- reserve the 1:1 box so the StopCard cell cannot
  // reflow while the artwork loads (cell height must stay deterministic).
  'stop.category.meal': { w: 300, h: 300 },
  'stop.category.cafe': { w: 300, h: 300 },
  'stop.category.walk': { w: 300, h: 300 },
  'stop.category.culture': { w: 300, h: 300 },
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
  // Both playback-control composites share identical outer geometry
  // (1662x370, i.e. the 238x53/4.4906:1 CSS box) so the playing/paused
  // asset swap in BgmPlayerWidget can never cause layout shift.
  'media.playbackControls': { w: 1662, h: 370 },
  'media.playbackControlsPlay': { w: 1662, h: 370 },
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
