'use client';

import React from 'react';
import type { RouteGuideStop } from '../../lib/guide';
import { FittedAsset, resolveStopAssetKeyByCategory } from '../common';
import { resolveResultAccent } from '../../config/resultAccents';
import { pushDataLayerEvent } from '../../lib/analytics';

export interface RouteGuideTimelineProps {
  stops: RouteGuideStop[];
  /** Analytics reference only (place_map_click) -- absent for shared-route snapshots. */
  routeId?: string;
  zoneId?: string;
  className?: string;
}

/**
 * Semantic ordered itinerary timeline component for RouteGuide.
 * Renders the ordered STOP 1–3 or STOP 1–4 sequence as VISIT ORDER (not a clock
 * schedule) with stop artwork, category, address, curated tips, and prominent
 * external Naver/Kakao map launch buttons.
 * Strictly excludes stay/total duration, transit calculations, live GPS, and
 * A->B travel times.
 *
 * VISUAL CORRECTION (route-continuity pass): the prior version gave each stop
 * its own short connector segment with a wide paper-coloured ring around the
 * stamp -- Human Browser E2E read that gap as the numbered dots and the cards
 * floating apart rather than one itinerary. Fixed by treating the rail as ONE
 * continuous element: every segment is now solid (never dashed), zero-margin
 * against the stamps above and below it, and one restrained warm-neutral tone
 * throughout -- so N per-stop segments render as a single unbroken line with
 * the stops' accent colours living only on the nodes/cards sitting ON it, per
 * "one continuous vertical route rail" in the approved correction brief.
 * The stamp's ring-halo is thinned (not removed) for the same reason: it must
 * still read as "a paper gap where the node sits", not "a wall separating the
 * node from the rail".
 *
 * POLISH CORRECTION: the stamp's ink-dark fill (introduced above to remove a
 * competing brand-blue) still read as "isolated black dots down the left
 * side" once seen against the accents on a real device -- solid dark discs
 * fight the warm paper/pastel system just as much as solid blue ones did.
 * Fill was then made the SAME cream as the surrounding paper (only the
 * accent border read as colour), with the number in neutral ink text rather
 * than white, since none of the four pastel accents has the contrast for
 * white-on-accent at this size.
 *
 * FINAL NODE CORRECTION: cream fill under-committed to the per-stop colour
 * coding -- the node and its StopCard read as two separately-decided
 * elements rather than one step. Fill is now the stop's own accent colour
 * (same value as the border), so the node reads as a solid colour-coded dot
 * that visually continues into its card's accent-bordered outline. The
 * cream halo (`ring-guide-paper`) is untouched -- it is what still creates
 * the "paper gap where the node sits on the rail" separation from the rail
 * behind it, independent of the node's own fill. Number colour stays neutral
 * ink (`#2b2520`): verified >=6.3:1 contrast against all four accents
 * (weakest on the pink/red stop), so white was not needed.
 */
export function RouteGuideTimeline({
  stops = [],
  routeId,
  zoneId,
  className = '',
}: RouteGuideTimelineProps) {
  const handleMapLinkClick = () => {
    pushDataLayerEvent('place_map_click', { route_id: routeId, zone_id: zoneId });
  };

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
        // Category-only resolution: RouteGuideStop deliberately drops placeId, so the
        // per-place override path does not apply here. Null until the StopVisual
        // exports are registered -- the artwork block is then simply skipped.
        const stopAssetKey = stop.category
          ? resolveStopAssetKeyByCategory(stop.category)
          : null;
        // Result-measured per-stop accent (src/config/resultAccents.ts) -- the
        // approved bridge to Result, now the Route Guide's MAIN chromatic
        // identity (not a generic outer frame, and not competing with a
        // separate brand-blue stamp fill -- see the stamp fill note below).
        const accentColor = resolveResultAccent(index);

        return (
          <li
            key={`${stop.name}-${stopNumber}`}
            data-testid={`guide-stop-item-${index}`}
            className="relative flex items-start gap-3.5 sm:gap-4"
          >
            {/* Timeline Axis: Step Number Stamp + continuous rail segment */}
            <div className="flex flex-col items-center self-stretch">
              {/* ring-guide-paper (not a hardcoded hex): the stamp's halo must
                  always match the surrounding cream surface exactly -- see
                  guideSkin.ts's contract note on GUIDE_PAPER. Thinned from
                  ring-4 to a 3px halo so the rail below reads as continuing
                  behind the node rather than stopping short of it.
                  Fill is the stop's own accent colour (same as the border),
                  not cream: the node is now a solid colour-coded dot that
                  reads as "connected to its StopCard border" rather than a
                  separately-decided neutral stamp. Number text stays neutral
                  ink -- verified sufficient contrast against all four pastel
                  accents (weakest ~6.3:1 on the pink/red stop), so white was
                  not needed. */}
              <div
                style={{ borderColor: accentColor, backgroundColor: accentColor }}
                className="z-10 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-[3px] text-xs sm:text-sm font-black text-[#2b2520] ring-[3px] ring-guide-paper"
              >
                {stopNumber}
              </div>
              {!isLast && (
                <div aria-hidden="true" className="w-[3px] grow min-h-[52px] rounded-full bg-[#ded1c0]" />
              )}
            </div>

            {/* Stop Content Details Card */}
            <div className={`flex-1 ${isLast ? 'pb-2' : 'pb-6'} pt-0.5`}>
              {/* Neutral cream card, CLEAR per-stop accent border (thickened
                  from a 1px hairline to 2px -- Human Browser E2E read the
                  hairline as "barely registers"). Still an outline only: the
                  fill stays neutral cream, never a saturated tint. */}
              <div
                style={{ borderColor: accentColor }}
                className="rounded-2xl border-2 bg-[#fffdf7]/90 p-3.5 sm:p-4"
              >
                {/* Header: a single small accent-bordered STOP tab (the
                    "accent-tinted label area") + plain muted category text --
                    ONE pill, not two, so it doesn't compete with the place
                    name below it. Copy is unchanged (still "STOP {n}" and the
                    raw category string); only the visual weight moved. */}
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <span
                    style={{ borderColor: accentColor }}
                    className="inline-flex shrink-0 items-center rounded-full border bg-white/70 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#6b6257]"
                  >
                    STOP {stopNumber}
                  </span>
                  {stop.category && (
                    <span className="text-[11px] font-bold text-[#8c8273]">{stop.category}</span>
                  )}
                </div>

                {/* Place Name -- the strongest textual element in the card --
                    + optional stop artwork (DOM/CSS per the 09_ROUTE_GUIDE
                    boundary -- the skin ships no per-stop artwork).
                    ALIGNMENT CORRECTION: artwork+title used to be
                    `items-start`, which put the (smaller) artwork above the
                    title's visual centre and left the title looking
                    "too high, detached" once it wrapped. Fixed through the
                    flex structure itself (`items-center`, one shared box
                    size for every category asset via FittedAsset's own
                    per-key registry lookup -- no per-place one-off sizing),
                    not a translateY hack. Address now lives in the SAME
                    column as the title (a `flex-col` beside the artwork,
                    not a full-width line below it), so the artwork reads as
                    anchored to the whole [title + address] block rather
                    than to the title alone. Tips stays its own full-width
                    callout box below -- it is a supplementary note, not
                    part of this aligned unit. */}
                <div className="flex items-center gap-2.5">
                  {stopAssetKey && (
                    <FittedAsset
                      assetKey={stopAssetKey}
                      className="h-10 w-10 shrink-0 rounded-md sm:h-11 sm:w-11"
                    />
                  )}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="text-lg sm:text-xl font-black text-[#2b2520] break-words leading-snug">
                      {stop.name}
                    </h3>
                    {stop.address && (
                      <p className="text-xs font-medium text-[#6b6257] break-words">
                        📍 {stop.address}
                      </p>
                    )}
                  </div>
                </div>

                {stop.tips && (
                  <div className="mt-2.5 rounded-xl border border-dashed border-line-soft bg-white/70 p-2.5 text-xs font-bold text-[#5c5346] leading-relaxed">
                    💡 {stop.tips}
                  </div>
                )}

                {/* Map actions -- compact tertiary chips. The prior treatment
                    (a large solid-green Naver rectangle) read as the single
                    strongest element in every card; brand colour now lives
                    only as a small accent dot inside an otherwise neutral
                    control, per the approved de-emphasis direction. URLs and
                    click behaviour are unchanged. */}
                {hasMapLinks && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2.5 border-t border-line-soft">
                    {stop.mapLinks?.naver && (
                      <a
                        href={stop.mapLinks.naver}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleMapLinkClick}
                        aria-label={`${stop.name} 네이버 지도에서 길찾기 및 정보 확인 (새 창)`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line-soft bg-[#faf6ee] hover:bg-[#f0eae0] px-2.5 py-1.5 text-[11px] font-bold text-[#2b2520] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#03c75a]" />
                        <span>네이버 지도</span>
                      </a>
                    )}
                    {stop.mapLinks?.kakao && (
                      <a
                        href={stop.mapLinks.kakao}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleMapLinkClick}
                        aria-label={`${stop.name} 카카오 맵에서 길찾기 및 정보 확인 (새 창)`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line-soft bg-[#faf6ee] hover:bg-[#f0eae0] px-2.5 py-1.5 text-[11px] font-bold text-[#2b2520] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#fee500]" />
                        <span>카카오 맵</span>
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
