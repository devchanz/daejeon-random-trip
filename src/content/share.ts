/**
 * Referral share copy templates.
 * See src/lib/share/shareHelper.ts (formatShareTitle / formatShareText), the
 * single seam both the Web Share payload and the clipboard-fallback URL flow
 * through.
 *
 * Phase 7 FINAL copy: both strings are now fixed (no longer interpolating
 * the route title or stop count), per the approved decision -- the params
 * are kept only so shareHelper.ts's call sites need no changes.
 */

/** Web Share `title` -- final Phase 7 copy, route-independent. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature kept so shareHelper.ts's call site needs no change
export function buildShareTitle(cleanTitle: string): string {
  return '우리 대전여행 갈래?';
}

/**
 * Web Share `text` -- final copy, route-independent. Repeats the title line
 * as the text body's own first line on purpose: some share targets ignore
 * `navigator.share`'s `title` field entirely and render only `text`, so the
 * hook line must not depend on `title` surviving. Exact spacing is part of
 * the approved payload -- lines 1-3 are CONSECUTIVE (no blank line between
 * them), then exactly ONE blank line before the final CTA line.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature kept so shareHelper.ts's call site needs no change
export function buildShareText(cleanTitle: string, countLabel: string): string {
  return '우리 대전여행 갈래?\n코스는 이미 뽑아놨어 🎲\n네 취향 코스도 궁금해\n\n👉 바로 뽑고 공유하기';
}
