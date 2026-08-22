'use client';

import React, { useReducer } from 'react';
import {
  INITIAL_EXPERIENCE_STATE,
  experienceReducer,
  type ExperienceState,
} from '../../lib/experience';
import { SetupArea } from './SetupArea';
import { SlotAnchor } from './SlotAnchor';
import { ResultArea } from './ResultArea';

interface MainExperienceProps {
  initialState?: ExperienceState;
  className?: string;
}

export function MainExperience({
  initialState = INITIAL_EXPERIENCE_STATE,
  className = '',
}: MainExperienceProps) {
  const [state, dispatch] = useReducer(experienceReducer, initialState);

  return (
    <div
      data-testid="main-experience"
      className={`flex w-full max-w-2xl flex-col items-center gap-6 ${className}`}
    >
      {/* 1. Setup Area: Q1 -> Q2 -> READY */}
      <SetupArea state={state} dispatch={dispatch} />

      {/* 2. Slot Anchor: Stable visual anchor & pre-spin placeholder */}
      <SlotAnchor state={state} />

      {/* 3. Result Area: Inline presentation boundary below slot */}
      <ResultArea />
    </div>
  );
}
