'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SharedRouteRecord } from '../../lib/database/types';
import { normalizeSharedRouteRecord } from '../../lib/guide';
import { RouteGuideModal } from '../guide';
import { getDurationLabel, getPreferenceLabel, normalizeRouteTitle } from '../../content/labels';
import { FittedAsset, resolveStopAssetKeyByCategory } from '../common';
import { resolveResultAccent } from '../../config/resultAccents';

export interface SharedRouteViewProps {
  record: SharedRouteRecord | null;
  className?: string;
}

/**
 * Functional, semantic presentation component for the dedicated Shared Route landing view (/r/[shareCode]).
 * Renders the immutable route snapshot as an authentic retro travel itinerary ticket.
 * Displays the recipient hook banner, route stops (without transit times), mission memo,
 * and the 2 approved CTAs: Primary ("나도 여행 뽑아보기") and Secondary ("이 코스 그대로 가보기").
 */
export function SharedRouteView({ record, className = '' }: SharedRouteViewProps) {
  const [isRouteGuideOpen, setIsRouteGuideOpen] = useState<boolean>(false);

  // 1. Not Found / Invalid Fallback View
  if (!record) {
    return (
      <article
        data-testid="shared-route-not-found"
        className={`relative w-full max-w-xl mx-auto rounded-3xl border-3 border-line-soft bg-[#fffef9] p-6 sm:p-8 overflow-hidden animate-ticket-entrance text-center ${className}`}
      >
        {/* Top Perforation Deco */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
        />

        <div className="flex flex-col items-center gap-4 pt-4 pb-2">
          <span className="text-5xl" role="img" aria-label="Not Found">
            🗺️
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs font-black tracking-widest text-[#ff5555] uppercase">
              ROUTE NOT FOUND
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#2b2520]">
              존재하지 않거나 만료된 여행 코스예요
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#6b6257] leading-relaxed max-w-sm">
            공유 링크가 올바르지 않거나 변경되었을 수 있어요.
            <br />
            대전의 새로운 랜덤 여행을 직접 뽑아보세요!
          </p>

          <div className="w-full pt-4 border-t-2 border-line-soft mt-2">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-[#ff3b3b] bg-[#ff5555] hover:bg-[#ff3b3b] py-3.5 px-6 text-sm font-black text-white transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              🎰 대전 여행 직접 뽑아보기
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // 2. Valid Shared Route Ticket View
  const durationLabel = record.duration_type
    ? getDurationLabel(record.duration_type)
    : null;

  const preferenceLabel = record.preference_type
    ? getPreferenceLabel(record.preference_type)
    : null;

  const stops = record.stops || [];

  return (
    <>
      <article
        data-testid="shared-route-ticket"
        className={`relative w-full max-w-2xl mx-auto rounded-3xl border-3 border-line-soft bg-[#fffef9] p-5 sm:p-8 overflow-hidden animate-ticket-entrance ${className}`}
      >
        {/* Top Printed Ticket Perforation */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
        />

        <div className="flex flex-col gap-6 pt-1">
          {/* 1. Recipient Hook Banner & Ticket Header */}
          <header className="flex flex-col gap-3 border-b-2 border-line-soft pb-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-black tracking-widest text-[#ff5555] uppercase flex items-center gap-1">
                <span>💌</span>
                <span>SHARED TRIP TICKET</span>
              </span>
              <span className="rounded-full border-2 border-line-soft bg-[#10b981] px-3 py-0.5 text-[11px] font-black text-white">
                공유 코스
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-black text-[#ff5555] uppercase tracking-wide">
                누군가 대전 여행을 보냈어요! 💌
              </p>
              {/* Snapshots persisted before the canonical-title pass carry the
                  legacy `반일`/`당일` wording, which would contradict the duration
                  chip rendered directly below -- repaired for display only, the
                  stored snapshot is never rewritten. */}
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2b2520] break-words">
                {normalizeRouteTitle(record.title)}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6b6257] pt-1">
              {durationLabel && (
                <span className="rounded-md border-2 border-line-soft bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520]">
                  {durationLabel}
                </span>
              )}
              {preferenceLabel && (
                <span className="rounded-md border-2 border-line-soft bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520]">
                  {preferenceLabel}
                </span>
              )}
              <span className="rounded-md border-2 border-line-soft bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520]">
                총 {stops.length}곳
              </span>
            </div>
          </header>

          {/* 2. Vertical Route Timeline (No transit times per contract) */}
          <ol aria-label="공유된 여행 코스 상세 일정" className="flex flex-col">
            {stops.map((stop, index) => {
              const isLast = index === stops.length - 1;
              const stopNumber = stop.order ?? index + 1;
              // Same canonical Result-derived accent (src/config/resultAccents.ts)
              // Route Guide's timeline uses -- keeps the two surfaces reading as
              // one colour-coded system rather than each inventing its own.
              const accentColor = resolveResultAccent(index);
              // Category-only resolution, same as RouteGuideTimeline: shared-route
              // stops always carry `category` (SharedRouteStopSnapshot), so this
              // reuses the existing registry without introducing new data coupling.
              const stopAssetKey = stop.category
                ? resolveStopAssetKeyByCategory(stop.category)
                : null;

              return (
                <li
                  key={`${stop.placeId || stop.name}-${stopNumber}`}
                  data-testid={`shared-route-stop-${index}`}
                  className="relative flex items-start gap-3.5 sm:gap-4"
                >
                  {/* Timeline Axis: Step Number Stamp + Connector Line */}
                  <div className="flex flex-col items-center self-stretch">
                    {/* Final node contract (matches RouteGuideTimeline): accent
                        fill + accent border, neutral ink number -- no black or
                        cream fill. Cream ring halo is unchanged, it separates
                        the node from the connector line, not a colour choice. */}
                    <div
                      style={{ borderColor: accentColor, backgroundColor: accentColor }}
                      className="z-10 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-black text-[#2b2520] ring-4 ring-[#fffef9]"
                    >
                      {stopNumber}
                    </div>
                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="w-0.5 grow min-h-[44px] bg-[#d8d0c2] my-1 border-l-2 border-dashed border-[#b8b0a2]"
                      />
                    )}
                  </div>

                  {/* Stop Content Details -- now an accent-outlined paper card
                      (same role/weight as RouteGuideTimeline's StopCard: flat
                      neutral surface, accent border only, no black outline, no
                      shadow), so the node and its card read as one colour-coded
                      step. */}
                  <div className={`flex-1 ${isLast ? 'pb-1' : 'pb-5'} pt-0.5`}>
                    <div
                      style={{ borderColor: accentColor }}
                      className="rounded-2xl border-2 bg-[#fffdf7]/90 p-3.5 sm:p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#ff5555]">
                          STOP {stopNumber}
                        </span>
                        {stop.category && (
                          <span className="rounded-md border border-line-soft bg-[#faf6ee] px-2 py-0.5 text-[11px] font-bold text-[#6b6257]">
                            {stop.category}
                          </span>
                        )}
                      </div>

                      {/* Place name + optional pixel artwork, same alignment
                          pattern as RouteGuideTimeline: artwork and the
                          [title + address] block share one items-center row. */}
                      <div className="flex items-center gap-2.5">
                        {stopAssetKey && (
                          <FittedAsset
                            assetKey={stopAssetKey}
                            className="h-10 w-10 shrink-0 rounded-md sm:h-11 sm:w-11"
                          />
                        )}
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <h2 className="text-base sm:text-lg font-black text-[#2b2520] break-words leading-snug">
                            {stop.name}
                          </h2>
                          {stop.address && (
                            <p className="text-xs font-medium text-[#8c8273]">
                              📍 {stop.address}
                            </p>
                          )}
                        </div>
                      </div>

                      {stop.tips && (
                        <p className="mt-1.5 rounded-lg border border-line-soft bg-[#faf6ee] p-2 text-xs font-bold text-[#6b6257] leading-relaxed">
                          💡 {stop.tips}
                        </p>
                      )}

                      {/* Outbound External Map Links */}
                      {stop.mapLinks && (stop.mapLinks.naver || stop.mapLinks.kakao) && (
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {stop.mapLinks.naver && (
                            <a
                              href={stop.mapLinks.naver}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-line-control bg-white px-2.5 py-1 text-xs font-bold text-[#2b2520] hover:bg-[#faf6ee] transition-all"
                            >
                              <span>🗺️ 네이버 지도</span>
                            </a>
                          )}
                          {stop.mapLinks.kakao && (
                            <a
                              href={stop.mapLinks.kakao}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-line-control bg-white px-2.5 py-1 text-xs font-bold text-[#2b2520] hover:bg-[#faf6ee] transition-all"
                            >
                              <span>🗺️ 카카오 맵</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* 3. Optional Mission Section */}
          {record.mission && record.mission.trim().length > 0 && (
            <section
              aria-label="여행 미션"
              data-testid="shared-route-mission"
              className="relative rounded-2xl border-2 border-dashed border-[#ffb800] bg-[#fffdf0] p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-md border border-line-soft bg-[#ffb800] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#2b2520]">
                  MISSION
                </span>
                <h3 className="text-xs font-black text-[#92400e]">
                  오늘의 여행 미션
                </h3>
              </div>
              <p className="text-sm font-bold text-[#4a4237] leading-relaxed break-words">
                {record.mission.trim()}
              </p>
            </section>
          )}

          {/* 4. Action CTAs (Primary Referral + Secondary RouteGuide Transition) */}
          <div
            data-testid="shared-route-cta-boundary"
            className="flex flex-col gap-2.5 border-t-2 border-line-soft pt-5"
          >
            {/* Primary CTA: Referral Acquisition -> Main Landing */}
            <Link
              href="/"
              className="w-full rounded-2xl border-2 border-[#ff3b3b] bg-[#ff5555] hover:bg-[#ff3b3b] py-3.5 px-4 text-center text-sm font-black text-white transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              🎰 나도 대전 여행 뽑아보기
            </Link>

            {/* Secondary CTA: RouteGuide Transition */}
            <button
              type="button"
              onClick={() => setIsRouteGuideOpen(true)}
              aria-label="이 코스 그대로 가보기 (상세 여행 가이드 열기)"
              className="w-full rounded-xl border-2 border-line-control bg-[#faf6ee] hover:bg-[#f0eae0] py-2.5 px-3 text-center text-xs font-bold text-[#2b2520] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              이 코스 그대로 가보기
            </button>
          </div>
        </div>
      </article>

      {/* Route Guide Modal (Portal to body) */}
      {isRouteGuideOpen && (
        <RouteGuideModal
          guideData={normalizeSharedRouteRecord(record)}
          isOpen={isRouteGuideOpen}
          onClose={() => setIsRouteGuideOpen(false)}
        />
      )}
    </>
  );
}
