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
 * Consistent Slot Machine presentation component.
 * Maintains DOM chassis and visual layout stability across READY, SPINNING, and RESULT states.
 * Consumes ReelDisplayModel from the visual adapter to decouple presentation from RouteResult.
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
        label: 'STATUS: RESULT',
        dotClass: 'bg-emerald-400',
      };
    }
    if (isSpinning) {
      return {
        label: 'STATUS: SPINNING...',
        dotClass: 'bg-amber-400 animate-spin',
      };
    }
    if (isReady) {
      return {
        label: 'STATUS: READY',
        dotClass: 'bg-emerald-400 animate-pulse',
      };
    }
    return {
      label: 'STATUS: WAITING SETUP',
      dotClass: 'bg-zinc-600',
    };
  };

  const status = getStatusDisplay();

  // Primary CTA label and hint text
  const getButtonContent = () => {
    if (isResult) {
      return {
        text: '추천 완료',
        hint: '추천 코스가 도착했습니다!',
      };
    }
    if (isSpinning) {
      return {
        text: '여행 코스 뽑는 중...',
        hint: '행운의 대전 여행 코스를 조합하고 있어요!',
      };
    }
    if (isReady) {
      return {
        text: '여행 뽑기!',
        hint: '뽑기 준비가 완료되었습니다',
      };
    }
    if (state.phase === 'q2') {
      return {
        text: '조건을 먼저 선택해 주세요',
        hint: 'Q2 취향 조건을 완료하면 버튼이 활성화됩니다',
      };
    }
    return {
      text: '조건을 먼저 선택해 주세요',
      hint: 'Q1, Q2 조건을 완료하면 버튼이 활성화됩니다',
    };
  };

  const buttonContent = getButtonContent();

  return (
    <section
      aria-label="슬롯머신 영역 (Slot Anchor)"
      className={`relative w-full overflow-hidden rounded-2xl border-2 border-zinc-900 bg-zinc-900 p-6 text-white shadow-lg dark:border-zinc-700 dark:bg-zinc-950 ${className}`}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Slot Header */}
        <div className="flex w-full items-center justify-between border-b border-zinc-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${status.dotClass}`} />
            <span className="font-mono font-bold tracking-wider text-zinc-300">
              DAEJEON RANDOM TRIPPER
            </span>
          </div>
          <span className="font-mono text-zinc-400">{status.label}</span>
        </div>

        {/* 3 Reel Windows (Stable DOM Grid Chassis) */}
        <div className="grid w-full grid-cols-3 gap-3 rounded-xl bg-zinc-800/80 p-4 border border-zinc-700/60 shadow-inner">
          {reelDisplay.reels.map((reel, index) => (
            <div
              key={`reel-window-${index}`}
              className="flex h-28 flex-col items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 p-2 text-center overflow-hidden transition-all duration-200"
            >
              {isSpinning ? (
                // Spinning Presentation: Animated motion placeholder without exposing places
                <div className="flex flex-col items-center justify-center gap-1 animate-pulse">
                  <span className="text-xl font-bold tracking-widest text-amber-400">
                    &bull; &bull; &bull;
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">SPINNING</span>
                </div>
              ) : isResult ? (
                // Result Presentation: Visual stop preview via ReelDisplayModel
                reel.isPlaceholder ? (
                  <span className="text-2xl font-bold text-zinc-600" aria-hidden="true">
                    -
                  </span>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-0.5 px-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold">
                      Stop {reel.label}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-2 leading-tight">
                      {reel.value}
                    </span>
                    {reel.category && (
                      <span className="text-[9px] text-zinc-400 truncate max-w-full">
                        {reel.category}
                      </span>
                    )}
                  </div>
                )
              ) : (
                // Pre-spin Presentation: Question mark placeholder
                <span className="text-3xl font-bold text-zinc-400" aria-hidden="true">
                  ?
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Primary Spin Action Button & State Hints */}
        <div className="flex w-full flex-col items-center gap-2">
          <button
            type="button"
            disabled={!isReady}
            onClick={onSpin}
            aria-busy={isSpinning}
            className={`w-full max-w-sm rounded-xl py-3.5 px-6 text-base font-bold tracking-wide transition-all shadow-md ${
              isReady
                ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300 cursor-pointer active:scale-95'
                : isSpinning
                ? 'bg-amber-500/50 text-zinc-950/70 cursor-wait animate-pulse border border-amber-400/30'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
            }`}
          >
            {buttonContent.text}
          </button>

          {/* Feedback/Hint Message */}
          {errorMessage ? (
            <span role="alert" className="text-xs font-semibold text-rose-400">
              {errorMessage}
            </span>
          ) : (
            <span className="text-xs text-zinc-400">{buttonContent.hint}</span>
          )}
        </div>
      </div>
    </section>
  );
}
