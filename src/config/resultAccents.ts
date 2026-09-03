/**
 * Canonical per-stop accent colours, measured from the Result card's painted
 * cell borders (Phase 3 mobile master re-measurement against Figma node
 * `290:2`). This is the SINGLE canonical source for these four colours.
 *
 * Two independent consumers derive their stop-accent systems from here:
 *  - Result (`src/components/experience/result/resultSkin.ts`,
 *    `RESULT_CELL_ACCENTS`) -- literal Tailwind arbitrary-value classes,
 *    because Tailwind scans source text statically and cannot resolve a
 *    class name built from a runtime string. That file's own values are the
 *    ones transcribed here, unchanged.
 *  - Route Guide (`src/components/guide/RouteGuideTimeline.tsx`) -- applied
 *    via inline `style` (not Tailwind classes), since it needs a genuinely
 *    dynamic per-index colour with no static-scanning constraint.
 *
 * Keeping ONE array here (rather than duplicating the four hex literals a
 * third time) is what lets Route Guide's stop accents stay synchronized with
 * Result's, per the Phase 4 visual correction. Order matches
 * `RESULT_CELL_ACCENTS` exactly: stop 1 pink-red, stop 2 blue, stop 3
 * olive/green, stop 4 purple/lavender.
 */
export const RESULT_ACCENT_COLORS = [
  '#ed8b99',
  '#8dade2',
  '#d0d39d',
  '#d3bcdf',
] as const;

/** Resolves the accent for a stop by its position, cycling if ever >4 stops. */
export function resolveResultAccent(index: number): string {
  return RESULT_ACCENT_COLORS[index % RESULT_ACCENT_COLORS.length];
}
