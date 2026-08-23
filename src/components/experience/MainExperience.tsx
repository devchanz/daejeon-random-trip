'use client';

import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  INITIAL_EXPERIENCE_STATE,
  experienceReducer,
  startSpin,
  completeSpin,
  type ExperienceState,
} from '../../lib/experience';
import {
  generateRoute,
  RecommendationEngineError,
  type Zone,
  type PlaceCandidate,
  type RouteResult,
} from '../../lib/random';
import { SetupArea } from './SetupArea';
import { SlotAnchor } from './SlotAnchor';
import { ResultArea } from './ResultArea';

const DEFAULT_SPIN_DURATION_MS = 1200;

export interface MainExperienceProps {
  initialState?: ExperienceState;
  zones?: Zone[];
  candidates?: PlaceCandidate[];
  spinDurationMs?: number;
  random?: () => number;
  onSpinStart?: () => void;
  onSpinComplete?: (result: RouteResult) => void;
  className?: string;
}

/**
 * MainExperience orchestration layer.
 * Coordinates Q1 -> Q2 -> READY -> SPINNING -> RESULT lifecycle.
 * Manages pending RouteResult during spin animation without polluting domain state models.
 */
export function MainExperience({
  initialState = INITIAL_EXPERIENCE_STATE,
  zones = [],
  candidates = [],
  spinDurationMs = DEFAULT_SPIN_DURATION_MS,
  random,
  onSpinStart,
  onSpinComplete,
  className = '',
}: MainExperienceProps) {
  const [state, dispatch] = useReducer(experienceReducer, initialState);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  // UI orchestration refs: hold pending result and timer safely outside domain models
  const pendingResultRef = useRef<RouteResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle spin presentation lifecycle completion
  useEffect(() => {
    if (state.phase === 'spinning' && pendingResultRef.current) {
      timerRef.current = setTimeout(() => {
        if (pendingResultRef.current) {
          const result = pendingResultRef.current;
          pendingResultRef.current = null;
          dispatch(completeSpin(result));
          onSpinComplete?.(result);
        }
      }, spinDurationMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase, spinDurationMs, onSpinComplete]);

  // Spin action triggered from SlotAnchor
  const handleSpin = () => {
    if (state.phase !== 'ready' || !state.duration || !state.preference) {
      return;
    }

    setRecommendationError(null);

    // Validate recommendation data availability
    if (!zones || zones.length === 0 || !candidates || candidates.length === 0) {
      setRecommendationError('추천 데이터를 준비 중이에요.');
      return;
    }

    try {
      // 1. Attempt route generation via Controlled Random Travel engine
      const generated = generateRoute({
        durationType: state.duration,
        preference: state.preference,
        zones,
        candidates,
        random,
      });

      // 2. Hold pending RouteResult in UI orchestration layer
      pendingResultRef.current = generated;

      // 3. Dispatch START_SPIN to initiate spinning presentation
      dispatch(startSpin());
      onSpinStart?.();
    } catch (err) {
      // Recommendation failure: do not transition to SPINNING; remain in READY with user feedback
      const message =
        err instanceof RecommendationEngineError
          ? '현재 조건으로 추천할 수 있는 코스가 없어요.'
          : '추천 코스를 생성하지 못했습니다.';
      setRecommendationError(message);
    }
  };

  return (
    <div
      data-testid="main-experience"
      className={`flex w-full max-w-2xl flex-col items-center gap-6 ${className}`}
    >
      {/* 1. Setup Area: Q1 -> Q2 -> READY */}
      <SetupArea state={state} dispatch={dispatch} />

      {/* 2. Slot Anchor: Stable visual anchor across READY -> SPINNING -> RESULT */}
      <SlotAnchor
        state={state}
        onSpin={handleSpin}
        errorMessage={state.phase === 'ready' ? recommendationError : null}
      />

      {/* 3. Result Area: Inline presentation boundary below slot */}
      <ResultArea state={state} />
    </div>
  );
}
