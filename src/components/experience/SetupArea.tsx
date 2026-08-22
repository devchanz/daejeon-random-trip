'use client';

import React from 'react';
import {
  SUPPORTED_DURATIONS,
  SUPPORTED_PREFERENCES,
  type DurationType,
  type PreferenceType,
} from '../../config/product';
import type { ExperienceAction, ExperienceState } from '../../lib/experience';
import { selectDuration, selectPreference } from '../../lib/experience';
import { OptionButton } from './OptionButton';

interface SetupAreaProps {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}

export const DURATION_DISPLAY_LABELS: Record<DurationType, string> = {
  half: '반나절',
  full: '하루',
};

export const PREFERENCE_DISPLAY_LABELS: Record<PreferenceType, string> = {
  anything: '아무거나',
  food: '먹방',
  walk: '산책',
  photo: '사진',
};

export function SetupArea({ state, dispatch }: SetupAreaProps) {
  const currentPhase = state.phase;
  const isQ1Active = currentPhase === 'q1';
  const isQ2Active = currentPhase === 'q2';
  const isReady = currentPhase === 'ready';

  const handleSelectDuration = (duration: DurationType) => {
    dispatch(selectDuration(duration));
  };

  const handleSelectPreference = (preference: PreferenceType) => {
    dispatch(selectPreference(preference));
  };

  return (
    <section
      aria-label="여행 조건 설정 (Setup Area)"
      className="w-full rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90"
    >
      <div className="flex flex-col gap-5">
        {/* Header & Step Status Indicator */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              1
            </span>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              여행 조건 설정
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span
              className={`rounded px-2 py-0.5 transition-colors ${
                isQ1Active
                  ? 'bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              Q1. 시간
            </span>
            <span>&rarr;</span>
            <span
              className={`rounded px-2 py-0.5 transition-colors ${
                isQ2Active
                  ? 'bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              Q2. 취향
            </span>
            <span>&rarr;</span>
            <span
              className={`rounded px-2 py-0.5 transition-colors ${
                isReady
                  ? 'bg-emerald-600 font-medium text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              READY
            </span>
          </div>
        </div>

        {/* Dynamic Content Area: One question at a time with stable min-height */}
        <div className="flex min-h-[140px] flex-col justify-center">
          {/* Q1: Duration Selection */}
          {isQ1Active && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Q1. 대전 체류 시간을 선택해 주세요
              </span>
              <div className="flex w-full gap-2">
                {SUPPORTED_DURATIONS.map((duration) => (
                  <OptionButton
                    key={duration}
                    value={duration}
                    label={DURATION_DISPLAY_LABELS[duration]}
                    isSelected={state.duration === duration}
                    isActive={true}
                    onSelect={handleSelectDuration}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Q2: Preference Selection */}
          {isQ2Active && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Q2. 여행 스타일을 선택해 주세요
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SUPPORTED_PREFERENCES.map((pref) => (
                  <OptionButton
                    key={pref}
                    value={pref}
                    label={PREFERENCE_DISPLAY_LABELS[pref]}
                    isSelected={state.preference === pref}
                    isActive={true}
                    onSelect={handleSelectPreference}
                  />
                ))}
              </div>
            </div>
          )}

          {/* READY: Completed Summary State */}
          {isReady && state.duration && state.preference && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-300">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>
                  조건 선택 완료: {DURATION_DISPLAY_LABELS[state.duration]} &middot;{' '}
                  {PREFERENCE_DISPLAY_LABELS[state.preference]}
                </span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                아래 슬롯머신에서 여행을 뽑아보세요!
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
