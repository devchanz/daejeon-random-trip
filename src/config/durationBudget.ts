import type { DurationType } from './product';
import type { RouteStop } from '../lib/random/types';

/**
 * Duration budget policy definition for a specific travel duration type.
 * Bounds are configurable policies rather than hard-coded magic numbers in the recommendation engine.
 * Minute bounds are unconfigured (TBD) pending calibration against place candidate data.
 */
export interface DurationBudgetPolicy {
  minMinutes?: number;
  maxMinutes?: number;
  displayLabel: string;
}

/**
 * Duration budget policies for local travel time spent within Daejeon.
 * Specific minute bounds are unconfigured (TBD) pending calibration against collected candidate place seed data.
 */
export const DURATION_BUDGET_POLICIES: Record<DurationType, DurationBudgetPolicy> = {
  half: {
    displayLabel: '반일 코스',
  },
  full: {
    displayLabel: '당일 코스',
  },
};

/**
 * Calculates total estimated route travel time in minutes.
 * Fixed Contract: estimatedTotalMinutes = ∑(Place Stay Durations) + ∑(Inter-stop Travel Times)
 */
export function calculateTotalDurationMinutes(stops: RouteStop[]): number {
  return stops.reduce((total, stop) => {
    const stayMinutes = stop.stayDurationMin;
    const travelMinutes = stop.travelToNextMin ?? 0;
    return total + stayMinutes + travelMinutes;
  }, 0);
}

/**
 * Formats a duration in casual, human-readable Korean text.
 * Examples: "약 4시간", "약 3시간 30분", "약 45분"
 */
export function formatEstimatedDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) {
    return '시간 미정';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `약 ${minutes}분`;
  }

  if (minutes === 0) {
    return `약 ${hours}시간`;
  }

  return `약 ${hours}시간 ${minutes}분`;
}
