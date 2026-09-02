'use client';

import React from 'react';
import { RESULT_CELL_ACCENTS, RESULT_CELL_PILL } from './resultSkin';

export interface ExploreMoreBannerProps {
  /** Position in the painted cell grid. 3-stop routes always fill the 4th cell. */
  accentIndex?: number;
  /**
   * The downstream "explore more" destination is not decided in this branch
   * (Figma/product-dependent). Left unwired by default -- no URL, route, modal,
   * or analytics event is invented here.
   */
  onExploreMore?: () => void;
  className?: string;
}

/**
 * Discovery cell shown in the 4th painted cell only when a route has 3 stops, so
 * the same fixed grid serves 3- and 4-stop Results.
 *
 * TRANSPARENT CONTENT OVERLAY ONLY, exactly like StopCard: the raster owns the
 * fourth painted cell, so nothing here draws a border, background, shadow or
 * rounding. It carries **no new artwork** per the 08_RESULT handoff, and no stop
 * number, category badge, place name or stop artwork, so it can never read as
 * STOP 4 -- its pill says 더보기, not a place category.
 *
 * Copy is sized with `clamp()` and clamped to two lines so all of it stays
 * readable inside the cell at every width, including 3-stop mobile where this
 * previously overflowed.
 *
 * Interaction seam: when `onExploreMore` is absent this renders as a
 * non-interactive semantic container -- no button, no anchor, no href="#", no
 * disabled CTA -- because a disabled control would imply a finished destination
 * that does not exist yet.
 */
export function ExploreMoreBanner({
  accentIndex = 3,
  onExploreMore,
  className = '',
}: ExploreMoreBannerProps) {
  const accent = RESULT_CELL_ACCENTS[accentIndex % RESULT_CELL_ACCENTS.length];
  const sharedClassName = `flex h-full min-h-0 w-full flex-col justify-center gap-[3%] overflow-hidden px-[5%] py-[4%] text-left ${className}`;

  const content = (
    <>
      <span className={`${RESULT_CELL_PILL} ${accent.pill}`}>더보기</span>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[2%]">
        <p className="line-clamp-2 break-keep text-[clamp(14px,4.2vw,19px)] font-black leading-[1.2] text-[#2b2520]">
          조금 더 놀다 갈래?
        </p>
        <p className="line-clamp-2 break-keep text-[clamp(10px,3vw,13px)] font-bold leading-[1.3] text-[#7d7364]">
          대전에서 더 즐길 거리 찾아보기
        </p>
      </div>
    </>
  );

  if (!onExploreMore) {
    return (
      <div data-testid="explore-more-banner" role="note" className={sharedClassName}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onExploreMore}
      data-testid="explore-more-banner"
      aria-label="조금 더 놀다 갈래? 대전 더 둘러보기"
      className={`${sharedClassName} cursor-pointer transition-transform active:translate-y-[1px]`}
    >
      {content}
    </button>
  );
}
