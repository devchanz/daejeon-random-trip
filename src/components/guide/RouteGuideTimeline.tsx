import React from 'react';
import type { RouteGuideStop } from '../../lib/guide';

export interface RouteGuideTimelineProps {
  stops: RouteGuideStop[];
  className?: string;
}

/**
 * Semantic ordered itinerary timeline component for RouteGuide.
 * Renders the ordered STOP 1–3 or STOP 1–4 sequence with stay duration,
 * address, curated tips, and prominent external Naver/Kakao map launch buttons.
 * Strictly excludes transit calculations, live GPS, and A->B travel times.
 */
export function RouteGuideTimeline({
  stops = [],
  className = '',
}: RouteGuideTimelineProps) {
  if (!stops || stops.length === 0) {
    return null;
  }

  return (
    <ol
      aria-label="여행 코스 상세 일정 및 장소 안내"
      className={`flex flex-col ${className}`}
    >
      {stops.map((stop, index) => {
        const isLast = index === stops.length - 1;
        const stopNumber = stop.order ?? index + 1;
        const hasMapLinks =
          stop.mapLinks && Boolean(stop.mapLinks.naver || stop.mapLinks.kakao);

        return (
          <li
            key={`${stop.name}-${stopNumber}`}
            data-testid={`guide-stop-item-${index}`}
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
                  className="w-0.5 grow min-h-[52px] bg-[#d8d0c2] my-1 border-l-2 border-dashed border-[#b8b0a2]"
                />
              )}
            </div>

            {/* Stop Content Details Card */}
            <div className={`flex-1 ${isLast ? 'pb-2' : 'pb-6'} pt-0.5`}>
              <div className="rounded-2xl border-2 border-[#2b2520] bg-[#faf6ee] p-4 shadow-retro-sm">
                {/* Header: Step label & Category Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-[#ff5555]">
                    STOP {stopNumber}
                  </span>
                  {stop.category && (
                    <span className="rounded-md border border-[#2b2520] bg-white px-2 py-0.5 text-[11px] font-bold text-[#2b2520]">
                      {stop.category}
                    </span>
                  )}
                </div>

                {/* Place Name */}
                <h3 className="text-base sm:text-lg font-black text-[#2b2520] break-words leading-snug">
                  {stop.name}
                </h3>

                {/* Stay Duration */}
                {typeof stop.stayDurationMin === 'number' && stop.stayDurationMin > 0 && (
                  <p className="mt-1 text-xs font-bold text-[#7d7364]">
                    ⏱️ 체류 예상 약 {stop.stayDurationMin}분
                  </p>
                )}

                {/* Address */}
                {stop.address && (
                  <p className="mt-1 text-xs font-medium text-[#6b6257] break-words">
                    📍 {stop.address}
                  </p>
                )}

                {/* Tips / Caution Box */}
                {stop.tips && (
                  <div className="mt-2.5 rounded-xl border border-dashed border-[#d8d0c2] bg-white p-2.5 text-xs font-bold text-[#5c5346] leading-relaxed">
                    💡 {stop.tips}
                  </div>
                )}

                {/* Primary Outbound Map Action Buttons */}
                {hasMapLinks && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-[#e4dcce]">
                    {stop.mapLinks?.naver && (
                      <a
                        href={stop.mapLinks.naver}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${stop.name} 네이버 지도에서 길찾기 및 정보 확인 (새 창)`}
                        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#03c75a] bg-[#03c75a] hover:bg-[#02b350] px-3 py-1.5 text-xs font-black text-white shadow-retro-xs transition-all active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        <span>🗺️ 네이버 지도</span>
                      </a>
                    )}
                    {stop.mapLinks?.kakao && (
                      <a
                        href={stop.mapLinks.kakao}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${stop.name} 카카오 맵에서 길찾기 및 정보 확인 (새 창)`}
                        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#2b2520] bg-[#fee500] hover:bg-[#fedd00] px-3 py-1.5 text-xs font-black text-[#2b2520] shadow-retro-xs transition-all active:translate-x-[1px] active:translate-y-[1px]"
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
  );
}
