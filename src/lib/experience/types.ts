import type { DurationType, PreferenceType } from '../../config/product';
import type { RouteResult, RerollRewardState, RerollSessionState } from '../random/types';

export type { RerollRewardState, RerollSessionState };

/**
 * Supported experience phases in the setup and recommendation flow.
 */
export type ExperiencePhase = 'q1' | 'q2' | 'ready' | 'spinning' | 'result';

/**
 * State when user is at Question 1 (Duration selection).
 */
export interface Q1ExperienceState {
  phase: 'q1';
  duration?: undefined;
  preference?: undefined;
  result?: undefined;
}

/**
 * State when user has selected Duration and is at Question 2 (Preference selection).
 */
export interface Q2ExperienceState {
  phase: 'q2';
  duration: DurationType;
  preference?: undefined;
  result?: undefined;
}

/**
 * State when both Duration and Preference are selected and the user is ready to spin.
 */
export interface ReadyExperienceState {
  phase: 'ready';
  duration: DurationType;
  preference: PreferenceType;
  result?: undefined;
}

/**
 * State when the spin action has been triggered and route recommendation / animation lifecycle is in progress.
 */
export interface SpinningExperienceState {
  phase: 'spinning';
  duration: DurationType;
  preference: PreferenceType;
  result?: undefined;
}

/**
 * State when route result is ready and spin animation lifecycle has completed.
 */
export interface ResultExperienceState {
  phase: 'result';
  duration: DurationType;
  preference: PreferenceType;
  result: RouteResult;
}

/**
 * Discriminated union of all valid core experience states.
 */
export type ExperienceState =
  | Q1ExperienceState
  | Q2ExperienceState
  | ReadyExperienceState
  | SpinningExperienceState
  | ResultExperienceState;

/**
 * Actions that drive experience state transitions.
 */
export type ExperienceAction =
  | { type: 'SELECT_DURATION'; duration: DurationType }
  | { type: 'SELECT_PREFERENCE'; preference: PreferenceType }
  | { type: 'START_SPIN' }
  | { type: 'COMPLETE_SPIN'; result: RouteResult };
