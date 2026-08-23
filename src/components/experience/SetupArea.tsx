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
      className="relative w-full rounded-3xl border-2 border-[#2b2520] bg-[#fffef9] p-5 sm:p-6 shadow-retro-lg overflow-hidden"
    >
      {/* Top decorative ticket notch impression */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Header & Step Status Indicator (Mobile-safe responsive layout) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b-2 border-[#2b2520] pb-3">
          {/* Section Title with Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#2b2520] bg-[#ff5555] text-xs font-black text-white shadow-retro-xs">
              1
            </span>
            <h2 className="text-base font-black tracking-tight text-[#2b2520] whitespace-nowrap">
              여행 조건 설정
            </h2>
          </div>

          {/* Progress Pills (Safe wrapping & styling) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span
              className={`rounded-lg px-2.5 py-1 font-black transition-all whitespace-nowrap ${
                isQ1Active
                  ? 'border-2 border-[#2b2520] bg-[#2b2520] text-white shadow-retro-xs scale-105'
                  : 'border border-[#d8d0c2] bg-[#f5efe3] text-[#8c8273]'
              }`}
            >
              Q1. 시간
            </span>
            <span className="text-[#a89f91] font-bold" aria-hidden="true">
              &rarr;
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 font-black transition-all whitespace-nowrap ${
                isQ2Active
                  ? 'border-2 border-[#2b2520] bg-[#2b2520] text-white shadow-retro-xs scale-105'
                  : 'border border-[#d8d0c2] bg-[#f5efe3] text-[#8c8273]'
              }`}
            >
              Q2. 취향
            </span>
            <span className="text-[#a89f91] font-bold" aria-hidden="true">
              &rarr;
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 font-black transition-all whitespace-nowrap ${
                isReady
                  ? 'border-2 border-[#2b2520] bg-[#10b981] text-white shadow-retro-xs scale-105'
                  : 'border border-[#d8d0c2] bg-[#f5efe3] text-[#8c8273]'
              }`}
            >
              READY
            </span>
          </div>
        </div>

        {/* Dynamic Question Area: One question at a time with stable min-height */}
        <div className="flex min-h-[130px] flex-col justify-center">
          {/* Q1: Duration Selection */}
          {isQ1Active && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-black text-[#4a4237] flex items-center gap-1.5">
                <span>⏱️</span>
                <span>Q1. 대전 체류 시간을 선택해 주세요</span>
              </span>
              <div className="flex w-full gap-2.5">
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
              <span className="text-sm font-black text-[#4a4237] flex items-center gap-1.5">
                <span>🎯</span>
                <span>Q2. 여행 스타일을 선택해 주세요</span>
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
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#10b981] bg-[#ecfdf5] p-4 text-center shadow-retro-xs">
              <div className="flex items-center gap-2 text-sm font-black text-[#065f46]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#10b981] motion-safe:animate-pulse" />
                <span>
                  조건 선택 완료: {DURATION_DISPLAY_LABELS[state.duration]} &middot;{' '}
                  {PREFERENCE_DISPLAY_LABELS[state.preference]}
                </span>
              </div>
              <span className="text-xs font-bold text-[#047857]">
                아래 슬롯머신의 &ldquo;여행 뽑기!&rdquo; 버튼을 눌러보세요!
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
