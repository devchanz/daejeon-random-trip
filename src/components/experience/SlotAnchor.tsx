'use client';

import React from 'react';
import Image from 'next/image';
import type { ExperienceState } from '../../lib/experience';
import {
  getPreSpinReelDisplay,
  mapRouteToReelDisplay,
  type ReelDisplayModel,
  type RouteResult,
} from '../../lib/random';
import { NEUTRAL_ROLLING_SYMBOLS } from './motionConfig';

export interface SlotAnchorProps {
  state: ExperienceState;
  onSpin?: () => void;
  errorMessage?: string | null;
  className?: string;
  stoppedReelCount?: number;
  pendingResult?: RouteResult | null;
  isLeverActive?: boolean;
}

/**
 * Geometric overlay specifications based on slot-machine-shell.png (1122 x 1402 px).
 * All coordinates are defined as percentages of the asset width/height to guarantee
 * proportional scaling across all viewports.
 */
const REEL_GEOMETRY = [
  { left: '18.18%', width: '18.89%' }, // Reel 1 (x: 204..415)
  { left: '40.11%', width: '19.43%' }, // Reel 2 (x: 450..667)
  { left: '62.66%', width: '18.89%' }, // Reel 3 (x: 703..914)
] as const;

const REEL_WINDOW_VERTICAL = {
  top: '27.18%',   // y: 381
  height: '34.09%', // y: 381..859 (height: 478)
} as const;

const BUTTON_GEOMETRY = {
  left: '19.52%',  // x: 219
  top: '70.90%',   // y: 994
  width: '60.25%', // x: 219..894 (width: 676)
  height: '10.34%',// y: 994..1138 (height: 145)
} as const;

/**
 * SlotAnchor component integrated with the AI-generated Slot Machine shell PNG asset.
 *
 * Architecture:
 * - SlotAssetWrapper: relative coordinate reference container sized by the PNG asset aspect ratio.
 * - Shell PNG: single high-fidelity visual chassis with transparent background.
 * - Reel Overlay: 3 interactive React reels absolutely positioned over the cylindrical reel windows.
 *   Uses transparent backgrounds so the illustrated cylinder depth remains visible underneath.
 * - Spin Button Overlay: transparent interactive HTML button placed directly over the pink button surface.
 * - Spin Lifecycle: fully preserves READY -> SPINNING -> sequential reel stop -> RESULT flow.
 */
export function SlotAnchor({
  state,
  onSpin,
  errorMessage,
  className = '',
  stoppedReelCount = 0,
  pendingResult = null,
}: SlotAnchorProps) {
  const isReady = state.phase === 'ready';
  const isSpinning = state.phase === 'spinning';
  const isResult = state.phase === 'result';

  // Target reel model for stopped reels or final result
  const targetReelDisplay: ReelDisplayModel =
    isResult && state.result
      ? mapRouteToReelDisplay(state.result)
      : pendingResult
      ? mapRouteToReelDisplay(pendingResult)
      : getPreSpinReelDisplay();

  const preSpinDisplay = getPreSpinReelDisplay();

  // Primary CTA label and hint text
  const getButtonContent = () => {
    if (isResult) {
      return {
        text: '추천 완료 ✨',
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
        text: '✨ 여행 뽑기! ✨',
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
      className={`relative z-30 flex w-full flex-col items-center select-none ${className}`}
    >
      {/* 1. SlotAssetWrapper: Proportional Visual Coordinate System */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] mx-auto select-none">
        {/* Slot Shell PNG Asset */}
        <Image
          src="/spike/slot-machine-shell.png"
          alt="Daejeon Random Trip Slot Machine"
          width={1122}
          height={1402}
          priority
          className="w-full h-auto block select-none pointer-events-none drop-shadow-xl"
        />

        {/* 2. 3 Reel Windows Overlay */}
        {REEL_GEOMETRY.map((geo, index) => {
          const isReelStopped =
            isResult || (isSpinning && stoppedReelCount > index);
          const targetReel = targetReelDisplay.reels[index];
          const preSpinReel = preSpinDisplay.reels[index];

          return (
            <div
              key={`reel-window-${index}`}
              role="region"
              aria-label={`슬롯 릴 ${index + 1}: ${
                isResult
                  ? targetReel.value
                  : isSpinning
                  ? isReelStopped
                    ? targetReel.value
                    : '회전 중'
                  : '대기 중'
              }`}
              style={{
                top: REEL_WINDOW_VERTICAL.top,
                height: REEL_WINDOW_VERTICAL.height,
                left: geo.left,
                width: geo.width,
              }}
              className="absolute flex flex-col items-center justify-center overflow-hidden bg-transparent transition-all duration-200"
            >
              {isSpinning && !isReelStopped ? (
                // Active Rolling Presentation
                <>
                  {/* Subtle top & bottom shadow gradient to match cylindrical 3D depth */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-6 sm:h-8 bg-gradient-to-b from-[#1a1412]/70 via-[#1a1412]/30 to-transparent z-10"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-6 sm:h-8 bg-gradient-to-t from-[#1a1412]/70 via-[#1a1412]/30 to-transparent z-10"
                  />

                  {/* Rolling symbols track */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-x-0 flex flex-col items-center justify-around py-2 animate-reel-roll-${index}`}
                  >
                    {NEUTRAL_ROLLING_SYMBOLS.concat(NEUTRAL_ROLLING_SYMBOLS).map(
                      (symbol, sIdx) => (
                        <span
                          key={`roll-sym-${index}-${sIdx}`}
                          className="text-2xl sm:text-3xl select-none py-1.5 opacity-95 drop-shadow-sm"
                        >
                          {symbol}
                        </span>
                      )
                    )}
                  </div>
                </>
              ) : isReelStopped ? (
                // Stopped Reel Presentation: settled place card with clear contrast on cream cylinder
                <div
                  key={`stopped-reel-${index}-${targetReel.value}`}
                  className="relative z-10 flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-1.5 text-center animate-reel-settle max-w-full"
                >
                  {targetReel.isPlaceholder ? (
                    <span
                      className="text-2xl font-black text-[#554a3e]"
                      aria-hidden="true"
                    >
                      -
                    </span>
                  ) : (
                    <>
                      <span className="rounded bg-[#ff5577]/15 border border-[#ff5577]/30 px-1 sm:px-1.5 py-0.2 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-[#be123c]">
                        {targetReel.label}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#2b2520] line-clamp-2 leading-tight break-keep drop-shadow-xs">
                        {targetReel.value}
                      </span>
                      {targetReel.category && (
                        <span className="text-[8px] sm:text-[9px] text-[#786b59] font-bold truncate max-w-full">
                          {targetReel.category}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ) : (
                // Pre-spin Presentation: Question mark placeholder
                <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  <span
                    className="text-3xl sm:text-4xl font-black text-[#ff5577] drop-shadow-sm"
                    aria-hidden="true"
                  >
                    {preSpinReel.value}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-[#786b59] tracking-wider">
                    REEL {index + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* 3. Spin Button Interactive Overlay */}
        <button
          type="button"
          disabled={!isReady}
          onClick={onSpin}
          aria-busy={isSpinning}
          aria-label={buttonContent.text}
          style={{
            left: BUTTON_GEOMETRY.left,
            top: BUTTON_GEOMETRY.top,
            width: BUTTON_GEOMETRY.width,
            height: BUTTON_GEOMETRY.height,
          }}
          className={`absolute flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-150 select-none ${
            isReady
              ? 'cursor-pointer hover:bg-white/20 active:scale-[0.98] active:bg-black/10'
              : isSpinning
              ? 'cursor-wait bg-black/5'
              : 'cursor-not-allowed bg-black/15'
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
        >
          <span
            className={`font-black text-xs sm:text-sm md:text-base tracking-wide text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.6)] ${
              isReady
                ? 'motion-safe:animate-pulse'
                : isSpinning
                ? 'opacity-90'
                : 'opacity-70'
            }`}
          >
            {buttonContent.text}
          </span>
        </button>
      </div>

      {/* 4. Feedback & Hint Message below Slot Machine */}
      <div className="flex flex-col items-center gap-1 text-center pt-3">
        {errorMessage ? (
          <span
            role="alert"
            className="text-xs sm:text-sm font-bold text-[#e11d48] bg-[#fff0f3] border border-[#e11d48]/30 px-3 py-1 rounded-full shadow-xs"
          >
            {errorMessage}
          </span>
        ) : (
          <span className="text-xs sm:text-sm font-bold text-[#756a5c]">
            {buttonContent.hint}
          </span>
        )}
      </div>
    </section>
  );
}
