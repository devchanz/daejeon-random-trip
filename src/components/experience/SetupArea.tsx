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

export const DURATION_EMOJIS: Record<DurationType, string> = {
  half: '☀️',
  full: '🌙',
};

export const PREFERENCE_DISPLAY_LABELS: Record<PreferenceType, string> = {
  anything: '아무거나',
  food: '먹방',
  walk: '산책',
  photo: '사진',
};

export const PREFERENCE_EMOJIS: Record<PreferenceType, string> = {
  anything: '🎲',
  food: '🍔',
  walk: '🌳',
  photo: '📸',
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
      className="relative w-full rounded-3xl border-2 border-[#2b2520] bg-[#fffef9] p-5 sm:p-6 shadow-retro-lg overflow-hidden select-none"
    >
      {/* Decorative top paperclip */}
      <div
        aria-hidden="true"
        className="absolute top-2 left-6 h-6 w-3 rounded-full border-2 border-[#8c8273] -rotate-12 pointer-events-none opacity-80"
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Header & Step Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b-2 border-[#2b2520] pb-3">
          {/* Section Title with Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#2b2520] bg-[#ff5577] text-xs font-black text-white shadow-retro-xs">
              ★
            </span>
            <h2 className="text-base font-black tracking-tight text-[#2b2520] whitespace-nowrap">
              여행 조건 설정
            </h2>
          </div>

          {/* Progress Pills */}
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
                  ? 'border-2 border-[#2b2520] bg-[#ff5577] text-white shadow-retro-xs scale-105'
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
                    label={`${DURATION_EMOJIS[duration]} ${DURATION_DISPLAY_LABELS[duration]}`}
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
                    label={`${PREFERENCE_EMOJIS[pref]} ${PREFERENCE_DISPLAY_LABELS[pref]}`}
                    isSelected={state.preference === pref}
                    isActive={true}
                    onSelect={handleSelectPreference}
                  />
                ))}
              </div>
            </div>
          )}

          {/* READY: Visual Master Ticket Card Confirmation */}
          {isReady && state.duration && state.preference && (
            <div className="relative flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-[#2b2520] bg-[#faf6ee] p-4 text-center shadow-retro-sm overflow-hidden">
              {/* Ready Stamp Badge */}
              <div className="flex items-center justify-between w-full">
                <span className="rounded-md border border-[#2b2520] bg-[#ff6b8b] px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-retro-xs">
                  READY! 💖
                </span>
                <span className="text-[10px] font-mono font-bold text-[#ff5577] border border-dashed border-[#ff5577] px-2 py-0.5 rounded-full">
                  ★ DAEJEON RANDOM TRIP ★
                </span>
              </div>

              {/* Centered Large Title */}
              <div className="text-lg sm:text-xl font-black text-[#2b2520] flex items-center gap-1.5">
                <span>✨</span>
                <span>준비 완료!</span>
                <span>✨</span>
              </div>

              {/* Selected Conditions Tag Display */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#4a4237]">
                <span className="text-[11px] text-[#756a5c]">선택한 여행 조건:</span>
                <span className="rounded-lg border-2 border-[#2b2520] bg-[#fffef9] px-3 py-1 font-black text-[#2b2520] shadow-retro-xs flex items-center gap-1">
                  <span>{DURATION_EMOJIS[state.duration]}</span>
                  <span>{DURATION_DISPLAY_LABELS[state.duration]}</span>
                </span>
                <span className="text-[#a89f91] font-bold">&middot;</span>
                <span className="rounded-lg border-2 border-[#2b2520] bg-[#fffef9] px-3 py-1 font-black text-[#2b2520] shadow-retro-xs flex items-center gap-1">
                  <span>{PREFERENCE_EMOJIS[state.preference]}</span>
                  <span>{PREFERENCE_DISPLAY_LABELS[state.preference]}</span>
                </span>
              </div>

              {/* Bottom Instruction */}
              <p className="text-xs font-bold text-[#ff5577] flex items-center gap-1 mt-0.5">
                <span>이제 아래 슬롯머신에서 여행을 뽑아봐!</span>
                <span>🎵</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
