/**
 * Product configuration for Daejeon Random Trip.
 *
 * Exposes supported input options for the setup flow (Q1 duration, Q2 preference).
 * Business policies live here rather than hard-coded into UI components.
 */

/**
 * Supported local travel duration options spent within Daejeon.
 * Note: Represents local itinerary time in Daejeon, not origin-to-Daejeon travel time.
 */
export const SUPPORTED_DURATIONS = ['half', 'full'] as const;

export type DurationType = (typeof SUPPORTED_DURATIONS)[number];

/**
 * Supported travel preference options.
 */
export const SUPPORTED_PREFERENCES = [
  'anything',
  'food',
  'walk',
  'photo',
] as const;

export type PreferenceType = (typeof SUPPORTED_PREFERENCES)[number];

export {
  DURATION_BUDGET_POLICIES,
  calculateTotalDurationMinutes,
  formatEstimatedDuration,
  type DurationBudgetPolicy,
} from './durationBudget';
