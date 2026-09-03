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
