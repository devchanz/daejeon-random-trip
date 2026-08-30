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

export const DURATION_ICONS: Record<DurationType, string> = {
  half: '☀️',
  full: '🌙',
};

export const PREFERENCE_DISPLAY_LABELS: Record<PreferenceType, string> = {
  anything: '아무거나',
  food: '먹방',
  walk: '산책',
  photo: '사진',
};

export const PREFERENCE_ICONS: Record<PreferenceType, string> = {
  anything: '🎲',
  food: '🍜',
  walk: '🌿',
  photo: '📸',
};

export function SetupArea({ state, dispatch }: SetupAreaProps) {
  const currentPhase = state.phase;
  const isQ1Active = currentPhase === 'q1';
  const isQ2Active = currentPhase === 'q2';
  const isReady = currentPhase === 'ready';
  const isSpinningOrResult = currentPhase === 'spinning' || currentPhase === 'result';

  const handleSelectDuration = (duration: DurationType) => {
    dispatch(selectDuration(duration));
  };

  const handleSelectPreference = (preference: PreferenceType) => {
    dispatch(selectPreference(preference));
  };

  const stepLabel = isQ1Active
    ? 'STEP 1/2'
    : isQ2Active
    ? 'STEP 2/2'
    : isReady
    ? 'READY'
    : isSpinningOrResult
    ? 'SPINNING'
    : 'READY';

  return (
    <section
      aria-label="여행 조건 설정 (Setup Area)"
      className="relative w-full rounded-2xl sm:rounded-3xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-6 shadow-retro overflow-hidden h-[218px] sm:h-[186px] flex flex-col justify-between"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3.5">
        {/* Header Bar: Step Status Indicator */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2 sm:pb-2.5">
          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black text-[#2b2520]">
            <span className="text-[#ffb800]">⭐</span>
            <span>오늘의 여행 준비 ({stepLabel})</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#8c8273]">
            <span>조건 선택</span>
            <span>✨</span>
          </div>
        </div>

        {/* Dynamic Question Area: Strict Height Lock (128px on mobile, 92px on desktop) */}
        <div className="flex flex-col justify-center h-[128px] sm:h-[92px]">
          {/* Q1: Duration Selection */}
          {isQ1Active && (
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm sm:text-base xl:text-lg font-black text-[#2b2520]">
                  <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-[#ff5555] text-xs font-black text-white shadow-2xs">
                    Q1
                  </span>
                  <span>대전에서 얼마나 놀까? ✨</span>
                </span>
                <span className="text-sm text-[#a89f91]" title="당일치기 또는 반일 여행">
                  ❔
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 h-[88px] sm:h-[64px]">
                {SUPPORTED_DURATIONS.map((duration) => (
                  <OptionButton
                    key={duration}
                    value={duration}
                    label={DURATION_DISPLAY_LABELS[duration]}
                    icon={DURATION_ICONS[duration]}
                    isSelected={state.duration === duration}
                    isActive={true}
                    onSelect={handleSelectDuration}
                    className="h-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Q2: Preference Selection */}
          {isQ2Active && (
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm sm:text-base xl:text-lg font-black text-[#2b2520]">
                  <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-[#ff5555] text-xs font-black text-white shadow-2xs">
                    Q2
                  </span>
                  <span>여행 스타일을 선택해 주세요 ✨</span>
                </span>
                <span className="text-sm text-[#a89f91]" title="선호하는 여행 테마">
                  ❔
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 h-[88px] sm:h-[64px]">
                {SUPPORTED_PREFERENCES.map((pref) => (
                  <OptionButton
                    key={pref}
                    value={pref}
                    label={PREFERENCE_DISPLAY_LABELS[pref]}
                    icon={PREFERENCE_ICONS[pref]}
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
            <div className="flex h-[88px] sm:h-[64px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#10b981] bg-[#ecfdf5] p-2 text-center shadow-retro-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#065f46]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#10b981] motion-safe:animate-pulse" />
                <span>
                  조건 선택 완료: {DURATION_DISPLAY_LABELS[state.duration]} &middot;{' '}
                  {PREFERENCE_DISPLAY_LABELS[state.preference]}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#047857]">
                아래 슬롯머신의 &ldquo;✨ 여행 뽑기! ✨&rdquo; 버튼을 눌러보세요!
              </span>
            </div>
          )}

          {/* SPINNING / RESULT Status Frame */}
          {isSpinningOrResult && state.duration && state.preference && (
            <div className="flex h-[88px] sm:h-[64px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#38bdf8] bg-[#f0f9ff] p-2 text-center shadow-retro-xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#0369a1]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#38bdf8] motion-safe:animate-spin" />
                <span>
                  선택 조건: {DURATION_DISPLAY_LABELS[state.duration]} &middot;{' '}
                  {PREFERENCE_DISPLAY_LABELS[state.preference]}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#0284c7]">
                🎰 대전 추천 코스를 뽑고 있어요!
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
