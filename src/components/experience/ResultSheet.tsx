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
 * Returns a playful category emoji icon for stop cards.
 */
function getCategoryIcon(category?: string): string {
  if (!category) return '📍';
  if (category.includes('빵') || category.includes('베이커리') || category.includes('디저트')) return '🥐';
  if (category.includes('식당') || category.includes('맛집') || category.includes('음식') || category.includes('두루치기')) return '🍲';
  if (category.includes('카페') || category.includes('커피')) return '☕';
  if (category.includes('산책') || category.includes('공원') || category.includes('수목원') || category.includes('천')) return '🌳';
  if (category.includes('사진') || category.includes('골목') || category.includes('야경')) return '📸';
  if (category.includes('문화') || category.includes('서점') || category.includes('전시') || category.includes('박물관')) return '📚';
  return '✨';
}

/**
 * Visual Master ResultSheet component.
 * Renders the variable-length RouteResult as a physical printed travel ticket / receipt sheet referenced from Result Detail Master.
 * Highlights:
 * - Aged printed paper card with top ticket perforation
 * - Red circular "DAEJEON RANDOM TRIP" official stamp
 * - Distinct vertical route timeline with bold pink STOP markers and category badges
 * - Pinned yellow MISSION strip with washi tape
 * - Clear CTA hierarchy (Dominant Primary CTA + Subordinate Secondary/Tertiary CTAs)
 * - Ticket serial & barcode strip at the bottom
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
      className={`relative w-full rounded-3xl border-3 border-[#2b2520] bg-[#fffef9] p-5 sm:p-7 shadow-retro-xl overflow-hidden animate-ticket-entrance select-none ${className}`}
    >
      {/* Top Printed Ticket Perforation / Notches */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
      />

      <div className="flex flex-col gap-5 pt-1">
        {/* 1. Result Ticket Header */}
        <header className="flex flex-col gap-2.5 border-b-2 border-[#2b2520] pb-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-black tracking-widest text-[#ff5577] uppercase flex items-center gap-1">
              <span>🎫</span>
              <span>DAEJEON RANDOM TRIP TICKET</span>
            </span>

            {/* Circular Ticket Stamp */}
            <div className="flex items-center gap-1 rounded-full border border-dashed border-[#ff5577] bg-[#fff0f3] px-2.5 py-0.5 text-[10px] font-mono font-black text-[#ff5577] rotate-2">
              <span>★ OFFICIAL STAMP ★</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#2b2520] flex items-center gap-1.5">
                <span>✨</span>
                <span>추천 대전 여행 코스</span>
                <span>✨</span>
              </h2>
              <p className="text-xs font-bold text-[#756a5c] mt-0.5">
                체류 시간과 취향에 맞춰 완성된 오늘의 대전 여행 일정표입니다.
              </p>
            </div>

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
              <span className="rounded-md border-2 border-[#2b2520] bg-[#ffb800] px-2.5 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
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
            const categoryIcon = getCategoryIcon(stop.category);

            return (
              <li
                key={`${stop.placeId || stop.name}-${stopNumber}`}
                data-testid={`route-stop-row-${index}`}
                className="relative flex items-start gap-3.5 sm:gap-4"
              >
                {/* Timeline Axis: Step Number Stamp + Connector Line */}
                <div className="flex flex-col items-center self-stretch">
                  <div className="z-10 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2b2520] bg-[#ff5577] text-xs sm:text-sm font-black text-white shadow-retro-xs ring-4 ring-[#fffef9]">
                    {stopNumber}
                  </div>
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="w-0.5 grow min-h-[52px] bg-[#d8d0c2] my-1 border-l-2 border-dashed border-[#b8b0a2]"
                    />
                  )}
                </div>

                {/* Stop Content Card */}
                <div className={`flex-1 ${isLast ? 'pb-1' : 'pb-5'} pt-0.5`}>
                  <div className="rounded-2xl border-2 border-[#2b2520] bg-[#faf6ee] p-3 sm:p-3.5 shadow-retro-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="rounded-md border border-[#2b2520] bg-[#ff5577] px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider text-white shadow-retro-xs">
                            STOP {stopNumber}
                          </span>
                          {stop.category && (
                            <span className="rounded-md border border-[#e4dcce] bg-[#fffef9] px-2 py-0.2 text-[10px] sm:text-[11px] font-bold text-[#6b6257]">
                              {stop.category}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-[#2b2520] break-words leading-snug">
                          {stop.name}
                        </h3>

                        {typeof stop.durationMin === 'number' && stop.durationMin > 0 && (
                          <p className="mt-1 text-xs font-bold text-[#7d7364]">
                            ⏱️ 체류 예상 약 {stop.durationMin}분
                          </p>
                        )}
                      </div>

                      {/* Right Category Icon Badge */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2b2520] bg-[#fffef9] text-lg shadow-xs">
                        <span role="img" aria-hidden="true">
                          {categoryIcon}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Travel duration to next stop (only rendered if explicitly provided) */}
                  {!isLast && hasTravelTime && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#e4dcce] bg-[#fffef9] px-2.5 py-1 text-xs font-bold text-[#6b6257] shadow-2xs">
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
            className="relative rounded-2xl border-2 border-[#2b2520] bg-[#fffdf0] p-4 shadow-retro-sm"
          >
            {/* Washi tape on mission card */}
            <div
              aria-hidden="true"
              className="washi-tape absolute -top-2.5 left-6 h-5 w-20 rotate-1"
            />

            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="rounded-md border border-[#2b2520] bg-[#ffb800] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#2b2520]">
                  MISSION ✨
                </span>
                <h4 className="text-xs font-black text-[#92400e]">
                  오늘의 여행 미션
                </h4>
              </div>
              <span className="text-sm" aria-hidden="true">
                📷
              </span>
            </div>
            <p className="text-sm font-bold text-[#4a4237] leading-relaxed break-words">
              {result.mission.trim()}
            </p>
          </section>
        )}

        {/* 4. CTA Action Layout Boundary (Non-interactive placeholders for future PRs) */}
        <div
          data-testid="result-cta-boundary"
          className="flex flex-col gap-2.5 border-t-2 border-[#2b2520] pt-4"
        >
          {/* Primary CTA (Visually Dominant) */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full rounded-2xl border-2 border-[#2b2520] bg-[#ff5577]/40 py-3.5 px-4 text-center text-sm sm:text-base font-black text-[#7a2034] cursor-not-allowed transition-none shadow-retro-xs opacity-90"
          >
            이 코스로 가보기 ✈️✨ (준비 중)
          </button>

          {/* Secondary & Tertiary CTA Subordinate Row */}
          <div className="flex gap-2 w-full">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex-1 rounded-xl border-2 border-[#d8d0c2] bg-[#faf6ee] py-2.5 px-3 text-center text-xs font-bold text-[#8e8477] cursor-not-allowed transition-none"
            >
              내 루트 공유하기 🔗 (준비 중)
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex-1 rounded-xl border-2 border-[#d8d0c2] bg-[#faf6ee] py-2.5 px-3 text-center text-xs font-bold text-[#8e8477] cursor-not-allowed transition-none"
            >
              다시 뽑기 🔄 (준비 중)
            </button>
          </div>
        </div>

        {/* 5. Bottom Ticket Barcode / Stamp Strip */}
        <div className="flex items-center justify-between border-t border-dashed border-[#d8d0c2] pt-3 text-[10px] font-mono text-[#8c8273]">
          <div className="flex items-center gap-1.5 font-bold">
            <span>DAEJEON TICKET</span>
            <span>&middot;</span>
            <span className="text-[#2b2520] font-black">DJT-250421</span>
          </div>
          {/* Stylized Barcode */}
          <div className="flex items-center gap-0.5 tracking-tighter text-xs font-mono text-[#2b2520] select-none" aria-hidden="true">
            <span>||||</span>
            <span>|</span>
            <span>||</span>
            <span>|||</span>
            <span>|</span>
            <span>||||</span>
            <span>||</span>
          </div>
        </div>
      </div>
    </article>
  );
}
