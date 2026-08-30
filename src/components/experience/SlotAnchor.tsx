'use client';

import React from 'react';
import type { ExperienceState } from '../../lib/experience';
import {
  getPreSpinReelDisplay,
  mapRouteToReelDisplay,
  type ReelDisplayModel,
  type RouteResult,
} from '../../lib/random';
import { NEUTRAL_ROLLING_SYMBOLS } from './motionConfig';
import {
  LOGICAL_CANVAS_HEIGHT,
  LOGICAL_CANVAS_TRANSLATE_X_PCT,
  LOGICAL_CANVAS_TRANSLATE_Y_PCT,
  LOGICAL_CANVAS_WIDTH,
  LOGICAL_CANVAS_WIDTH_PCT,
  REEL_GROUP,
  CTA_BUTTON,
  SLOT_FRAME_ASPECT_RATIO,
  SLOT_FRAME_RESPONSIVE_WIDTH,
} from './slotGeometry';

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
 * SlotAnchor — production asset integration based on Figma 05_EXPORT_READY & 03_NEW_ASSETS,
 * with SlotVisualFrame geometry cross-checked against 00_FINAL_REFERENCE / Landing/Desktop.
 *
 * Architecture:
 *   SlotStage (document flow)
 *     └── SlotVisualFrame — sized to the machine's measured PHYSICAL bounds
 *           (see slotGeometry.ts), so it participates in normal layout flow
 *           with no transparent-canvas padding compensation.
 *         └── LogicalCanvas — absolutely positioned inside the frame, keeps
 *               the original 600x500 asset coordinate system, scaled and
 *               translated so its physical bounds land exactly on the
 *               frame's edges.
 *             1. DOM Reel Content (z-0, underneath transparent openings)
 *             2. State Asset Skin (z-10, slot-idle.png or slot-pulled.png)
 *             3. DOM CTA Button   (z-20, interactive hit area mapped onto red button)
 *
 * SlotStage reserves room, as a sibling of SlotVisualFrame, for the future
 * output-reveal layer (ADR-008 output slit peek cue) — the Figma reference
 * shows that reveal extending below the physical chassis, so it must not be
 * constrained by the frame's bounds. Not implemented yet.
 */
export function SlotAnchor({
  state,
  onSpin,
  errorMessage,
  className = '',
  stoppedReelCount = 0,
  pendingResult = null,
  isLeverActive = false,
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
        text: '✨ 추천 완료 ✨',
        hint: '아래에 추천 코스 티켓이 출력되었습니다!',
      };
    }
    if (isSpinning) {
      return {
        text: '🎰 뽑는 중...',
        hint: '행운의 대전 여행 코스를 조합하고 있어요!',
      };
    }
    if (isReady) {
      return {
        text: '✨ 여행 뽑기! ✨',
        hint: '두 가지만 고르면 여행을 뽑을 수 있어요!',
      };
    }
    if (state.phase === 'q2') {
      return {
        text: '✨ 여행 뽑기! ✨',
        hint: 'Q2 여행 스타일을 선택해 주세요',
      };
    }
    return {
      text: '✨ 여행 뽑기! ✨',
      hint: '체류 시간과 여행 스타일을 선택해 주세요',
    };
  };

  const buttonContent = getButtonContent();

  return (
    <section
      aria-label="슬롯머신 영역 (Slot Anchor)"
      className={`relative z-30 flex w-full flex-col items-center select-none ${className}`}
    >
      {/*
       * SlotStage: document-flow host for the physical machine + (future) output layer.
       * Its own height is driven entirely by SlotVisualFrame below.
       */}
      <div className="relative flex w-full justify-center">
        {/*
         * SlotVisualFrame: the actual visible physical machine footprint.
         * Sized to SLOT_FRAME_ASPECT_RATIO (measured chassis w/h), so this box
         * IS the machine — no transparent padding, no negative-margin compensation.
         * overflow-hidden clips LogicalCanvas's transparent margin (by construction
         * 100% empty — the canvas is scaled/translated so every non-transparent
         * pixel already lands inside this box) so it can't inflate document
         * scrollHeight. Safe for the future output reveal: SlotOutputLayer mounts
         * as a sibling of this frame (see below), not inside it, so it is never
         * subject to this clip.
         */}
        <div
          className="relative shrink-0 select-none pointer-events-none overflow-hidden"
          style={{
            width: SLOT_FRAME_RESPONSIVE_WIDTH,
            aspectRatio: `${SLOT_FRAME_ASPECT_RATIO}`,
          }}
        >
          {/*
           * LogicalCanvas: original 600x500 asset coordinate system, absolutely
           * positioned and scaled/translated so its measured physical bounds
           * land exactly on this frame's edges (see slotGeometry.ts).
           */}
          <div
            className="absolute top-0 left-0 select-none pointer-events-none"
            style={{
              width: `${LOGICAL_CANVAS_WIDTH_PCT}%`,
              aspectRatio: `${LOGICAL_CANVAS_WIDTH} / ${LOGICAL_CANVAS_HEIGHT}`,
              transform: `translate(${LOGICAL_CANVAS_TRANSLATE_X_PCT}%, ${LOGICAL_CANVAS_TRANSLATE_Y_PCT}%)`,
            }}
          >
            {/* LAYER 1 (z-0): DOM Reel Content, positioned behind the transparent reel openings. */}
            <div
              className="absolute z-0 grid grid-cols-3"
              style={{
                top: REEL_GROUP.top,
                left: REEL_GROUP.left,
                width: REEL_GROUP.width,
                height: REEL_GROUP.height,
                gap: REEL_GROUP.gap,
              }}
            >
              {[0, 1, 2].map((index) => {
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
                    className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[4px] bg-[#fffef9] text-center shadow-inner"
                  >
                    {isSpinning && !isReelStopped ? (
                      // Active Rolling Track
                      <>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 top-0 h-2 sm:h-3 bg-gradient-to-b from-black/20 to-transparent z-10"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-2 sm:h-3 bg-gradient-to-t from-black/20 to-transparent z-10"
                        />
                        <div
                          aria-hidden="true"
                          className={`absolute inset-x-0 flex flex-col items-center justify-around py-0.5 animate-reel-roll-${index}`}
                        >
                          {NEUTRAL_ROLLING_SYMBOLS.concat(NEUTRAL_ROLLING_SYMBOLS).map(
                            (symbol, sIdx) => (
                              <span
                                key={`roll-sym-${index}-${sIdx}`}
                                className="text-sm sm:text-base lg:text-xl select-none py-0.5 drop-shadow-2xs leading-none"
                              >
                                {symbol}
                              </span>
                            )
                          )}
                        </div>
                      </>
                    ) : isReelStopped ? (
                      // Settled Preview
                      <div
                        key={`stopped-reel-${index}-${targetReel.value}`}
                        className="relative z-10 flex flex-col items-center justify-center gap-0.5 px-0.5 animate-reel-settle w-full"
                      >
                        {targetReel.isPlaceholder ? (
                          <span className="text-lg sm:text-xl lg:text-2xl font-black text-[#a89f91]">
                            -
                          </span>
                        ) : (
                          <>
                            <span className="rounded bg-[#ffb800] px-1 py-0.2 text-[6px] sm:text-[7px] lg:text-[9px] font-mono font-bold uppercase text-[#2b2520] leading-none">
                              {targetReel.label}
                            </span>
                            <span className="text-[9px] sm:text-[10px] lg:text-xs font-black text-[#2b2520] line-clamp-2 leading-tight px-0.5">
                              {targetReel.value}
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      // Pre-spin Question Mark
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <span
                          className="text-xl sm:text-2xl lg:text-3xl font-black text-[#2b2520] select-none leading-none"
                          aria-hidden="true"
                        >
                          {preSpinReel.value}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* LAYER 2 (z-10): Primary Production State Asset (full 600x500 pixel-art chassis skin). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isLeverActive ? '/assets/slot-pulled.png' : '/assets/slot-idle.png'}
              alt="대전 여행 슬롯머신"
              className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none z-10"
            />

            {/* LAYER 3 (z-20): Primary CTA Button Overlay. Background transparent so the physical red button shows through. */}
            <button
              type="button"
              disabled={!isReady}
              onClick={onSpin}
              aria-busy={isSpinning}
              aria-label={buttonContent.text}
              className={`absolute z-20 flex items-center justify-center pointer-events-auto rounded-[4px] font-black text-white select-none transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#ffb800] ${
                isReady
                  ? 'cursor-pointer active:scale-95 text-[9px] sm:text-[10px] lg:text-xs tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] motion-safe:animate-pulse'
                  : isSpinning
                  ? 'cursor-wait text-[8px] sm:text-[9px] lg:text-[11px] text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]'
                  : 'cursor-not-allowed text-[8px] sm:text-[9px] lg:text-[11px] text-white/70 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]'
              }`}
              style={{
                top: CTA_BUTTON.top,
                left: CTA_BUTTON.left,
                width: CTA_BUTTON.width,
                height: CTA_BUTTON.height,
                background: 'transparent',
              }}
            >
              <span className="truncate px-0.5 font-black leading-none">
                {buttonContent.text}
              </span>
            </button>
          </div>
        </div>

        {/*
         * Reserved: future SlotOutputLayer (Ticket reveal, ADR-008 output slit peek cue) mounts here,
         * as a sibling of SlotVisualFrame, so it can extend past the chassis bounds without being
         * constrained by the frame. Not implemented yet.
         */}
      </div>

      {/*
       * Helper region: fixed height so Q1/Q2/READY/SPINNING/error copy (which vary in length)
       * can never shift SlotStage or anything below it via text wrapping.
       */}
      <div className="relative z-30 mt-1 flex h-11 sm:h-12 w-full items-center justify-center text-center select-none">
        {errorMessage ? (
          <span role="alert" className="line-clamp-2 text-sm sm:text-base font-black text-[#e11d48]">
            {errorMessage}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5 text-sm sm:text-base font-black text-[#4a4237]">
            <span>👆</span>
            <span className="line-clamp-2">{buttonContent.hint}</span>
          </span>
        )}
      </div>
    </section>
  );
}
