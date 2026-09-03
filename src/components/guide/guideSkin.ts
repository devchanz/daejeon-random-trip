/**
 * Route Guide visual config -- the single home for the shell's shared colour
 * tokens and the per-stop accent resolver. Route Guide is fully DOM/CSS now:
 * it ships zero raster assets of its own.
 *
 * Phase 4 (DOM/CSS rebuild) first replaced the full-frame raster skin with a
 * thick painted-looking cobalt frame reproduced in CSS. Human Browser E2E
 * rejected that direction: imitating Result's raster frame in CSS made the
 * two surfaces read as MORE different, not more coherent, since one is a
 * painted PNG and the other can never quite match it. The approved
 * correction instead models the shell on the existing Random Log / paper-card
 * family (RandomLogCard, RandomLogDetail, GuestbookComposer) -- a restrained
 * cream sheet with a light `line-soft` border -- and uses the Result-measured
 * accent colours (see resolveResultAccent below) as identity accents on the
 * per-stop timeline, never as a generic outer frame colour. There is
 * therefore no cobalt/blue shell token any more: `GUIDE_COBALT` and
 * `--color-guide-cobalt` only ever existed to support the rejected direction
 * and have been removed, not just retired.
 *
 * A second correction then retired the one raster this shell had kept -- the
 * mission shell (a small dashed-border decorative crop). It is not an
 * exception any more: the mission section is now the same DOM/CSS
 * paper-card language as everything else in Route Guide (see
 * RouteGuideModal.tsx). `routeGuide.missionShell` is removed from the asset
 * registry and its file deleted from public/assets, not just unregistered.
 */

export { resolveResultAccent } from '../../config/resultAccents';

/**
 * Warm cream surface colour -- the SAME cream the Random Log / paper-card
 * family already uses everywhere else in the app (RandomLogCard,
 * RandomLogDetail, GuestbookComposer all use this exact value), not a
 * Route-Guide-specific tone. Kept as one named token (rather than switching
 * every consumer to the raw literal) purely for the ring/surface-match
 * contract below.
 *
 * CRITICAL CONTRACT: RouteGuideTimeline's stop-number stamp ring MUST use the
 * `ring-guide-paper` Tailwind class (never a hardcoded hex) so the ring can
 * never mismatch the surface it sits on -- the exact failure mode a
 * hardcoded `ring-[#f7efe3]` (and, briefly, `#fcf2e4`) was silently exposed
 * to the moment the paper colour changed underneath it.
 */
export const GUIDE_PAPER = '#fffef9';
