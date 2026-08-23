'use client';

import React from 'react';
import type { ExperienceState } from '../../lib/experience';
import {
  getPreSpinReelDisplay,
  getSpinningReelDisplay,
  mapRouteToReelDisplay,
  type ReelDisplayModel,
} from '../../lib/random';

interface SlotAnchorProps {
  state: ExperienceState;
  onSpin?: () => void;
  errorMessage?: string | null;
  className?: string;
}

/**
 * Visual V4 SlotAnchor component.
 * Physical arcade random travel machine chassis with layered cream frame,
 * corner mechanical rivets, decorative marquee lights, dark navy inset reel chamber,
 * decorative lever, coin slot detail, and prominent tactile primary Spin CTA.
 */
export function SlotAnchor({
  state,
  onSpin,
  errorMessage,
  className = '',
}: SlotAnchorProps) {
  const isReady = state.phase === 'ready';
  const isSpinning = state.phase === 'spinning';
  const isResult = state.phase === 'result';

  // Resolve visual reel display model based on current experience phase
  let reelDisplay: ReelDisplayModel;
  if (isResult) {
    reelDisplay = mapRouteToReelDisplay(state.result);
  } else if (isSpinning) {
    reelDisplay = getSpinningReelDisplay();
  } else {
    reelDisplay = getPreSpinReelDisplay();
  }

  // Header status copy and visual indicator
  const getStatusDisplay = () => {
    if (isResult) {
      return {
        label: 'RESULT READY',
        dotClass: 'bg-[#10b981]',
        pillClass: 'bg-[#ecfdf5] text-[#065f46] border-[#10b981]',
      };
    }
    if (isSpinning) {
      return {
        label: 'SPINNING...',
        dotClass: 'bg-[#ffb800] motion-safe:animate-ping',
        pillClass: 'bg-[#fffbeb] text-[#92400e] border-[#ffb800]',
      };
    }
    if (isReady) {
      return {
        label: 'READY TO SPIN',
        dotClass: 'bg-[#ff5555] motion-safe:animate-pulse',
        pillClass: 'bg-[#fef2f2] text-[#991b1b] border-[#ff5555]',
      };
    }
    return {
      label: 'WAITING SETUP',
      dotClass: 'bg-[#a89f91]',
      pillClass: 'bg-[#f5efe3] text-[#7d7364] border-[#d8d0c2]',
    };
  };

  const status = getStatusDisplay();

  // Primary CTA label and hint text
  const getButtonContent = () => {
    if (isResult) {
      return {
        text: '추천 완료',
        hint: '✨ 아래에 추천 코스 티켓이 출력되었습니다!',
      };
    }
    if (isSpinning) {
      return {
        text: '여행 코스 뽑는 중...',
        hint: '🎲 행운의 대전 여행 코스를 조합하고 있어요!',
      };
    }
    if (isReady) {
      return {
        text: '🎰 여행 뽑기!',
        hint: '👇 버튼을 누르면 대전 랜덤 코스가 즉시 완성됩니다',
      };
    }
    if (state.phase === 'q2') {
      return {
        text: '조건을 먼저 선택해 주세요',
        hint: 'Q2 취향을 선택하면 뽑기 버튼이 활성화됩니다',
      };
    }
    return {
      text: '조건을 먼저 선택해 주세요',
      hint: '위에서 체류 시간과 취향을 선택해 주세요',
    };
  };

  const buttonContent = getButtonContent();

  return (
    <section
      aria-label="슬롯머신 영역 (Slot Anchor)"
      className={`relative w-full rounded-3xl border-3 border-[#2b2520] bg-[#efe8db] p-5 sm:p-7 text-[#2b2520] shadow-retro-xl select-none ${className}`}
    >
      {/* 4 Mechanical Corner Rivets / Screws */}
      <span
        aria-hidden="true"
        className="absolute top-3 left-3 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-[#2b2520] bg-[#d8d0c2] text-[8px] font-mono text-[#554a3e] leading-none"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-[#2b2520] bg-[#d8d0c2] text-[8px] font-mono text-[#554a3e] leading-none"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-3 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-[#2b2520] bg-[#d8d0c2] text-[8px] font-mono text-[#554a3e] leading-none"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-3 right-3 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-[#2b2520] bg-[#d8d0c2] text-[8px] font-mono text-[#554a3e] leading-none"
      >
        +
      </span>

      {/* Decorative Slot Machine Lever (Desktop Only, purely visual affordance) */}
      <div
        aria-hidden="true"
        className="hidden md:flex flex-col items-center absolute -right-7 top-16 select-none pointer-events-none"
      >
        {/* Lever Ball Knob */}
        <div className="h-8 w-8 rounded-full border-2 border-[#2b2520] bg-[#ff5555] shadow-retro-xs" />
        {/* Lever Metallic Shaft */}
        <div className="h-16 w-3 rounded-b border-x-2 border-b-2 border-[#2b2520] bg-gradient-to-b from-[#e5decb] to-[#b8b0a2] shadow-inner" />
        {/* Lever Base Bracket */}
        <div className="h-6 w-8 rounded-r-lg border-2 border-[#2b2520] bg-[#a89f91] shadow-xs flex items-center justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2b2520]" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        {/* Machine Top Marquee / Status Header */}
        <div className="flex w-full items-center justify-between border-b-2 border-[#2b2520] pb-3 text-xs">
          {/* Glowing LED Bulbs & Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[#2b2520] bg-[#2b2520] px-2 py-0.5 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-[#ff5555] motion-safe:animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-[#ffb800]" />
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            </div>
            <span className="font-mono font-black tracking-wider text-[#2b2520]">
              DAEJEON RANDOM TRIP
            </span>
          </div>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${status.pillClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
            <span>{status.label}</span>
          </div>
        </div>

        {/* 3 Reel Windows (Recessed Arcade Display Bay) */}
        <div className="relative grid w-full grid-cols-3 gap-2.5 sm:gap-4 rounded-2xl border-2 border-[#2b2520] bg-[#121720] p-3.5 sm:p-4 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)]">
          {reelDisplay.reels.map((reel, index) => (
            <div
              key={`reel-window-${index}`}
              className="relative flex h-28 sm:h-32 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-[#2c3545] bg-[#1e2533] p-2 text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-200"
            >
              {/* Glossy glass reflection overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none"
              />

              {isSpinning ? (
                // Spinning Presentation: Animated motion placeholder
                <div className="flex flex-col items-center justify-center gap-1 motion-safe:animate-pulse">
                  <span className="text-xl sm:text-2xl font-black tracking-widest text-[#ffb800]">
                    &bull; &bull; &bull;
                  </span>
                  <span className="text-[10px] font-mono font-black text-[#9ca3af] tracking-wider">
                    SPINNING
                  </span>
                </div>
              ) : isResult ? (
                // Result Presentation: Visual stop preview via ReelDisplayModel
                reel.isPlaceholder ? (
                  <span className="text-2xl font-black text-[#6b7280]" aria-hidden="true">
                    -
                  </span>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 px-1">
                    <span className="rounded bg-[#ffb800]/20 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#ffb800]">
                      Stop {reel.label}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#fffdf8] line-clamp-2 leading-tight">
                      {reel.value}
                    </span>
                    {reel.category && (
                      <span className="text-[9px] text-[#9ca3af] truncate max-w-full font-medium">
                        {reel.category}
                      </span>
                    )}
                  </div>
                )
              ) : (
                // Pre-spin Presentation: Question mark placeholder
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#ffb800] drop-shadow-md" aria-hidden="true">
                    ?
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#6b7280]">
                    REEL {index + 1}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Control Apron: Primary Spin CTA Button & Feedback */}
        <div className="flex w-full flex-col items-center gap-2 pt-1">
          <button
            type="button"
            disabled={!isReady}
            onClick={onSpin}
            aria-busy={isSpinning}
            className={`w-full max-w-sm rounded-2xl py-3.5 sm:py-4 px-6 text-base sm:text-lg font-black tracking-wide transition-all ${
              isReady
                ? 'border-2 border-[#2b2520] bg-[#ff5555] text-white shadow-retro hover:bg-[#ff3b3b] cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-retro-xs'
                : isSpinning
                ? 'border-2 border-[#2b2520] bg-[#ffa8a8] text-[#782424] cursor-wait motion-safe:animate-pulse shadow-none'
                : 'border-2 border-[#b8b0a2] bg-[#dcd5c7] text-[#8e8477] cursor-not-allowed shadow-none'
            }`}
          >
            {buttonContent.text}
          </button>

          {/* Feedback/Hint Message */}
          {errorMessage ? (
            <span role="alert" className="text-xs font-bold text-[#e11d48]">
              {errorMessage}
            </span>
          ) : (
            <span className="text-xs font-bold text-[#756a5c]">
              {buttonContent.hint}
            </span>
          )}
        </div>

        {/* Bottom Dispenser Slit (Visual connection to ResultSheet) */}
        <div
          aria-hidden="true"
          className="w-32 h-1.5 rounded-full bg-[#2b2520]/20 -mb-2"
        />
      </div>
    </section>
  );
}
