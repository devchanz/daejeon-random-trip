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
 * the approved payload -- there is EXACTLY ONE blank line, between the third
 * line and the CTA line (a prior revision removed this blank line; that
 * removal is superseded -- the blank line is the current, approved copy).
 * Expressed as an array + join rather than one template string so the blank
 * line is an explicit `''` entry, not an easy-to-miss `\n\n` inside a longer
 * literal.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature kept so shareHelper.ts's call site needs no change
export function buildShareText(cleanTitle: string, countLabel: string): string {
  return [
    '우리 대전여행 갈래?',
    '코스는 이미 뽑아놨어 🎲',
    '네 취향 코스도 궁금해',
    '',
    '👉 바로 뽑고 공유하기',
  ].join('\n');
}
