import type { DurationType, PreferenceType } from '../../config/product';
import type { RouteResult } from '../random/types';
import type {
  ExperienceAction,
  ExperienceState,
  Q1ExperienceState,
} from './types';

/**
 * Initial experience state starting at Q1 with no choices selected.
 */
export const INITIAL_EXPERIENCE_STATE: Q1ExperienceState = {
  phase: 'q1',
};

/**
 * Action creators for experience state transitions.
 */
export function selectDuration(duration: DurationType): ExperienceAction {
  return { type: 'SELECT_DURATION', duration };
}

export function selectPreference(preference: PreferenceType): ExperienceAction {
  return { type: 'SELECT_PREFERENCE', preference };
}

export function startSpin(): ExperienceAction {
  return { type: 'START_SPIN' };
}

export function completeSpin(result: RouteResult): ExperienceAction {
  return { type: 'COMPLETE_SPIN', result };
}

/**
 * Pure reducer function for experience state transitions.
 * Guarantees strictly defined forward transitions and rejects invalid state jumps safely.
 *
 * Valid forward transition pathways:
 * - q1 + SELECT_DURATION -> q2
 * - q2 + SELECT_PREFERENCE -> ready
 * - ready + START_SPIN -> spinning
 * - spinning + COMPLETE_SPIN -> result
 */
export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction
): ExperienceState {
  switch (action.type) {
    case 'SELECT_DURATION': {
      if (state.phase === 'q1') {
        return {
          phase: 'q2',
          duration: action.duration,
        };
      }
      return state;
    }

    case 'SELECT_PREFERENCE': {
      if (state.phase === 'q2') {
        return {
          phase: 'ready',
          duration: state.duration,
          preference: action.preference,
        };
      }
      return state;
    }

    case 'START_SPIN': {
      if (state.phase === 'ready') {
        return {
          phase: 'spinning',
          duration: state.duration,
          preference: state.preference,
        };
      }
      return state;
    }

    case 'COMPLETE_SPIN': {
      if (state.phase === 'spinning') {
        return {
          phase: 'result',
          duration: state.duration,
          preference: state.preference,
          result: action.result,
        };
      }
      return state;
    }

    default: {
      return state;
    }
  }
}
