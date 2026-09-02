/**
 * Shared overlay viewport shell -- the SINGLE place the Result Card, Route Guide
 * Modal and Guestbook Composer source their backdrop/dialog box geometry from.
 *
 * Class literals throughout: Tailwind scans source text statically, matching the
 * pattern already used for `ACTION_BASE` / `RESULT_CELLS_GRID` in the Result skin
 * geometry (see result/resultSkin.ts, result/ResultActions.tsx).
 *
 * WHY THIS EXISTS (mobile-only defect, invisible on desktop):
 * Each overlay previously sized its backdrop with `fixed inset-0` (the *layout*
 * viewport, ~100lvh on mobile -- it does not shrink when the URL bar is showing)
 * while capping its dialog in `100dvh` (the *dynamic*, currently-visible
 * viewport). With the browser toolbar visible, `dvh < lvh`, so `items-center`
 * centred the dialog against a taller box than the user could actually see: the
 * dialog sat low, its action row drifted toward/under browser chrome, and
 * scrollability could flip entirely as the toolbar retracted mid-gesture.
 * Desktop has no dynamic toolbar (`lvh === dvh === svh`), so none of this ever
 * showed up there.
 */

/**
 * Backdrop: sized to the VISIBLE viewport (`h-[100dvh]`, not `inset-0`'s lvh),
 * so `items-center`/`items-end` etc. centre against what the user can actually
 * see. `overscroll-none` stops the backdrop itself from rubber-banding if a
 * gesture ever starts on it before the document scroll lock engages.
 *
 * `z-50` is unchanged from every overlay's prior value.
 */
export const OVERLAY_BACKDROP =
  'fixed inset-x-0 top-0 h-[100dvh] z-50 flex items-center justify-center overscroll-none p-3 sm:p-4 md:p-6';

/**
 * Dialog: `max-h-full` (NOT `max-h-[calc(100dvh-Xrem)]`) resolves against the
 * backdrop's own padded content box, so the padding and the height cap can never
 * disagree again -- whatever gutter the backdrop's `p-*` leaves is exactly the
 * dialog's available height, at every breakpoint, with no hand-maintained calc.
 *
 * `overflow-hidden` on the dialog itself: any internal scrolling is delegated to
 * a nested scroll zone (the three-zone header/body/footer shell each overlay
 * already uses), never the dialog box.
 */
export const OVERLAY_DIALOG = 'relative flex max-h-full flex-col overflow-hidden';

/**
 * Non-scrolling zones within a dialog (header bands, action/footer rows, the
 * 결과 접기 row). `shrink-0` only -- these sit as flex siblings of the scroll
 * zone, never wrapping it, so nothing here can affect the scroll zone's own
 * touch/scroll behaviour. Kept as a named export (rather than inlined per call
 * site) so all three overlays visibly share one non-scrolling-zone contract.
 */
export const OVERLAY_STATIC_ZONE = 'shrink-0';
