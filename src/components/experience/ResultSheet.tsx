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
 * ResultSheet component.
 * Renders the full variable-length RouteResult as a vertical timeline sheet.
 * Completely independent from the SlotAnchor's fixed 3-reel display preview.
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
      className={`w-full rounded-2xl border-2 border-zinc-300 bg-white p-5 sm:p-7 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
    >
      <div className="flex flex-col gap-6">
        {/* 1. Result Header */}
        <header className="flex flex-col gap-2.5 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
              DAEJEON RANDOM TRIP RESULT
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
              추천 완료
            </span>
          </div>

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-lg font-black tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100">
              추천 대전 여행 코스
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              {durationLabel && (
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-medium dark:bg-zinc-800">
                  {durationLabel}
                </span>
              )}
              {preferenceLabel && (
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-medium dark:bg-zinc-800">
                  {preferenceLabel}
                </span>
              )}
              <span className="rounded bg-zinc-100 px-2 py-0.5 font-medium dark:bg-zinc-800">
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
                {/* Timeline Axis: Step Number Circle + Connector Line */}
                <div className="flex flex-col items-center self-stretch">
                  <div className="z-10 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs sm:text-sm font-black text-white shadow-sm ring-4 ring-white dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-900">
                    {stopNumber}
                  </div>
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="w-0.5 grow min-h-[44px] bg-zinc-200 dark:bg-zinc-700 my-1"
                    />
                  )}
                </div>

                {/* Stop Content Details */}
                <div className={`flex-1 ${isLast ? 'pb-1' : 'pb-5'} pt-0.5`}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      STOP {stopNumber}
                    </span>
                    {stop.category && (
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {stop.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 break-words leading-snug">
                    {stop.name}
                  </h3>

                  {typeof stop.durationMin === 'number' && stop.durationMin > 0 && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      체류 예상 약 {stop.durationMin}분
                    </p>
                  )}

                  {/* Travel duration to next stop (only rendered if explicitly provided) */}
                  {!isLast && hasTravelTime && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                      <span aria-hidden="true">&darr;</span>
                      <span>다음 장소까지 이동 약 {stop.travelMin}분</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* 3. Optional Mission Section */}
        {result.mission && result.mission.trim().length > 0 && (
          <section
            aria-label="여행 미션"
            data-testid="result-mission-section"
            className="rounded-xl border border-amber-300/80 bg-amber-50/70 p-4 dark:border-amber-800/60 dark:bg-amber-950/20"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-zinc-950">
                MISSION
              </span>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                여행 미션
              </h4>
            </div>
            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
              {result.mission.trim()}
            </p>
          </section>
        )}

        {/* 4. CTA Action Layout Boundary (Non-interactive placeholders for future PRs) */}
        <div
          data-testid="result-cta-boundary"
          className="flex flex-col gap-2.5 border-t border-zinc-200 pt-5 dark:border-zinc-800"
        >
          {/* Primary CTA Placeholder */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full rounded-xl bg-zinc-200 py-3.5 px-4 text-center text-sm font-bold text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed transition-none"
          >
            이 코스로 가보기 (준비 중)
          </button>

          {/* Secondary & Tertiary CTA Placeholders */}
          <div className="flex gap-2 w-full">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-center text-xs font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 cursor-not-allowed transition-none"
            >
              내 루트 공유하기 (준비 중)
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-center text-xs font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 cursor-not-allowed transition-none"
            >
              다시 뽑기 (준비 중)
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
