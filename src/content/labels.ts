import type { DurationType, PreferenceType } from '../config/product';

/**
 * Canonical duration/preference display labels.
 *
 * Single source of truth: this exact pair of maps previously existed,
 * byte-for-byte identical, in five separate files (SetupArea.tsx,
 * random-log/randomLogLabels.ts, guide/RouteGuideModal.tsx,
 * share/SharedRouteView.tsx, and an inline ternary in
 * app/r/[shareCode]/page.tsx). A copy edit had to be applied 5x or the app
 * would disagree with itself -- exactly the `하루` vs `하루종일` unification
 * hazard already recorded in docs/PROJECT_STATE.md. All five now delegate here.
 *
 * Full-day duration label is unified to `하루종일` app-wide (see
 * docs/PROJECT_STATE.md section B) -- never `하루`.
 */
export const DURATION_LABELS: Record<DurationType, string> = {
  half: '반나절',
  full: '하루종일',
};

export const PREFERENCE_LABELS: Record<PreferenceType, string> = {
  anything: '아무거나',
  food: '먹방',
  walk: '산책',
  photo: '사진',
};

/**
 * Loose lookup for a duration value coming from persisted/external data
 * (DB rows, route snapshots) that is typed as a plain `string` rather than
 * the strict `DurationType` union. Falls back to the raw value when
 * unrecognized, matching the exact fallback behavior every pre-existing
 * call site already had (`map[x] ?? x`).
 */
export function getDurationLabel(durationType: string): string {
  return (DURATION_LABELS as Record<string, string>)[durationType] ?? durationType;
}

/** Loose lookup counterpart of {@link getDurationLabel} for preference values. */
export function getPreferenceLabel(preferenceType: string): string {
  return (PREFERENCE_LABELS as Record<string, string>)[preferenceType] ?? preferenceType;
}

/**
 * Duration wording as it appears inside a generated route TITLE (`선화동 반나절 코스`),
 * as opposed to the bare chip label above. Derived from the same canonical
 * DURATION_LABELS pair so the two can never drift.
 */
export const DURATION_COURSE_LABELS: Record<DurationType, string> = {
  half: `${DURATION_LABELS.half} 코스`,
  full: `${DURATION_LABELS.full} 코스`,
};

/**
 * Canonical generated-route title. The engine composes titles through this
 * (src/lib/random/engine.ts) rather than inlining a duration word, so the title
 * and the duration chip rendered beside it always agree.
 */
export function formatRouteTitle(zoneName: string, durationType: DurationType): string {
  return `${zoneName} ${DURATION_COURSE_LABELS[durationType]}`;
}

/**
 * Display-time repair for titles generated BEFORE this pass, which used the
 * legacy `반일`/`당일` wording. Those strings are persisted verbatim in
 * `shared_routes.title` (immutable snapshots -- ADR-014), so already-shared links
 * would otherwise keep contradicting the `반나절`/`하루종일` chip rendered right
 * next to them.
 *
 * Deliberately SUFFIX-ANCHORED to the exact legacy suffix the engine produced
 * (`${zoneName} 반일 코스`): a zone or place name that happens to contain those
 * characters anywhere else is never touched. New titles never match, so this is
 * a no-op for everything generated from now on.
 */
export function normalizeRouteTitle(title: string): string {
  return title
    .replace(/\s반일 코스$/, ` ${DURATION_COURSE_LABELS.half}`)
    .replace(/\s당일 코스$/, ` ${DURATION_COURSE_LABELS.full}`);
}
