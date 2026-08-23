'use client';

import React from 'react';
import type { RouteResult } from '../../lib/random';
import {
  DURATION_DISPLAY_LABELS,
  PREFERENCE_DISPLAY_LABELS,
} from './SetupArea';

export interface ResultSheetProps {
  result: RouteResult;
  className?: string;
}

/**
 * Visual V4 ResultSheet component.
 * Renders the variable-length RouteResult as an authentic printed paper travel itinerary sheet / receipt ticket.
 * Features tear-line ticket perforation, stamp badges, route timeline with step nodes,
 * pinned mission card with washi tape, and disabled coming-soon action CTAs.
 */
export function ResultSheet({ result, className = '' }: ResultSheetProps) {
  const durationLabel = result.durationType
    ? DURATION_DISPLAY_LABELS[result.durationType] ?? result.durationType
    : null;

  const preferenceLabel = result.preference
    ? PREFERENCE_DISPLAY_LABELS[result.preference] ?? result.preference
    : null;

  const stops = result.stops || [];

  return (
    <article
      data-testid="result-sheet"
      className={`relative w-full rounded-3xl border-3 border-[#2b2520] bg-[#fffef9] p-5 sm:p-7 shadow-retro-xl overflow-hidden ${className}`}
    >
      {/* Top Printed Ticket Perforation / Notches */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
      />

      <div className="flex flex-col gap-6 pt-1">
        {/* 1. Result Ticket Header */}
        <header className="flex flex-col gap-2.5 border-b-2 border-[#2b2520] pb-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-black tracking-widest text-[#ff5555] uppercase flex items-center gap-1">
              <span>🎫</span>
              <span>DAEJEON RANDOM TRIP TICKET</span>
            </span>
            <span className="rounded-full border-2 border-[#2b2520] bg-[#10b981] px-3 py-0.5 text-[11px] font-black text-white shadow-retro-xs">
              추천 완료
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-xl font-black tracking-tight text-[#2b2520] sm:text-2xl">
              추천 대전 여행 코스
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6b6257]">
              {durationLabel && (
                <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                  {durationLabel}
                </span>
              )}
              {preferenceLabel && (
                <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                  {preferenceLabel}
                </span>
              )}
              <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                총 {stops.length}곳
              </span>
            </div>
          </div>
        </header>

        {/* 2. Vertical Route Timeline (Variable stops) */}
        <ol
          aria-label="여행 코스 상세 일정"
          className="flex flex-col"
        >
          {stops.map((stop, index) => {
            const isLast = index === stops.length - 1;
            const stopNumber = stop.order ?? index + 1;
            const hasTravelTime =
              typeof stop.travelMin === 'number' && stop.travelMin > 0;

            return (
              <li
                key={`${stop.placeId || stop.name}-${stopNumber}`}
                data-testid={`route-stop-row-${index}`}
                className="relative flex items-start gap-3.5 sm:gap-4"
              >
                {/* Timeline Axis: Step Number Stamp + Connector Line */}
                <div className="flex flex-col items-center self-stretch">
                  <div className="z-10 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#2b2520] bg-[#2b2520] text-xs sm:text-sm font-black text-white shadow-retro-xs ring-4 ring-[#fffef9]">
                    {stopNumber}
                  </div>
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="w-0.5 grow min-h-[48px] bg-[#d8d0c2] my-1 border-l-2 border-dashed border-[#b8b0a2]"
                    />
                  )}
                </div>

                {/* Stop Content Details */}
                <div className={`flex-1 ${isLast ? 'pb-1' : 'pb-5'} pt-0.5`}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#ff5555]">
                      STOP {stopNumber}
                    </span>
                    {stop.category && (
                      <span className="rounded-md border border-[#e4dcce] bg-[#faf6ee] px-2 py-0.5 text-[11px] font-bold text-[#6b6257]">
                        {stop.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#2b2520] break-words leading-snug">
                    {stop.name}
                  </h3>

                  {typeof stop.durationMin === 'number' && stop.durationMin > 0 && (
                    <p className="mt-1 text-xs font-bold text-[#7d7364]">
                      체류 예상 약 {stop.durationMin}분
                    </p>
                  )}

                  {/* Travel duration to next stop (only rendered if explicitly provided) */}
                  {!isLast && hasTravelTime && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#e4dcce] bg-[#faf6ee] px-2.5 py-1 text-xs font-bold text-[#6b6257]">
                      <span aria-hidden="true">&darr;</span>
                      <span>다음 장소까지 이동 약 {stop.travelMin}분</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* 3. Optional Mission Section (Pinned Memo Card with Washi Tape) */}
        {result.mission && result.mission.trim().length > 0 && (
          <section
            aria-label="여행 미션"
            data-testid="result-mission-section"
            className="relative rounded-2xl border-2 border-dashed border-[#ffb800] bg-[#fffdf0] p-4 shadow-retro-sm -rotate-0.5"
          >
            {/* Washi tape on mission card */}
            <div
              aria-hidden="true"
              className="washi-tape absolute -top-2.5 left-6 h-5 w-18 rotate-1"
            />

            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-md border border-[#2b2520] bg-[#ffb800] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#2b2520]">
                MISSION
              </span>
              <h4 className="text-xs font-black text-[#92400e]">
                오늘의 여행 미션
              </h4>
            </div>
            <p className="text-sm font-bold text-[#4a4237] leading-relaxed break-words">
              {result.mission.trim()}
            </p>
          </section>
        )}

        {/* 4. CTA Action Layout Boundary (Non-interactive placeholders for future PRs) */}
        <div
          data-testid="result-cta-boundary"
          className="flex flex-col gap-2.5 border-t-2 border-[#2b2520] pt-5"
        >
          {/* Primary CTA Placeholder */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full rounded-2xl border-2 border-[#d8d0c2] bg-[#f0eae0] py-3.5 px-4 text-center text-sm font-black text-[#8e8477] cursor-not-allowed transition-none"
          >
            이 코스로 가보기 (준비 중)
          </button>

          {/* Secondary & Tertiary CTA Placeholders */}
          <div className="flex gap-2 w-full">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex-1 rounded-xl border-2 border-[#d8d0c2] bg-[#faf6ee] py-2.5 px-3 text-center text-xs font-bold text-[#8e8477] cursor-not-allowed transition-none"
            >
              내 루트 공유하기 (준비 중)
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex-1 rounded-xl border-2 border-[#d8d0c2] bg-[#faf6ee] py-2.5 px-3 text-center text-xs font-bold text-[#8e8477] cursor-not-allowed transition-none"
            >
              다시 뽑기 (준비 중)
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
