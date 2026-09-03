'use client';

import React from 'react';
import { RESULT_CELL_ACCENTS, RESULT_CELL_PILL } from './resultSkin';

export interface ExploreMoreBannerProps {
  /** Position in the painted cell grid. 3-stop routes always fill the 4th cell. */
  accentIndex?: number;
  /**
   * Scrolls to the currently visible TODAY'S DAEJEON rail after minimizing
   * Result (see ExperienceProvider.tsx's handleExploreMore). Optional so this
   * component still renders a sensible non-interactive prompt when unwired
   * (e.g. isolated rendering/tests).
   */
  onExploreMore?: () => void;
  className?: string;
}

/**
 * Discovery cell shown in the 4th painted cell only when a route has 3 stops, so
 * the same fixed grid serves 3- and 4-stop Results.
 *
 * TRANSPARENT CONTENT OVERLAY ONLY -- exactly like StopCard, and now including the
 * CTA: the raster owns the fourth painted cell, so nothing here draws a border,
 * background, shadow or rounding. It carries **no new artwork** per the 08_RESULT
 * handoff, and no stop number, category badge, place name or stop artwork, so it
 * can never read as STOP 4 -- its pill says 더보기, not a place category.
 *
 * CTA styling (Human Browser correction): a filled coral button here was found to
 * compete with the Result's real primary action ("이 코스로 가보기") and to crowd
 * this cell's limited mobile height. The CTA is now a plain inline text link --
 * underline + muted ink colour, same visual weight as prose, no fill, no border,
 * no added height -- while remaining a real `<button>` with its own aria-label,
 * focus-visible treatment and click handler.
 *
 * Copy is sized with `clamp()` and the headline is clamped to two lines so it
 * stays readable inside the cell at every width, including 3-stop mobile.
 */
export function ExploreMoreBanner({
  accentIndex = 3,
  onExploreMore,
  className = '',
}: ExploreMoreBannerProps) {
  const accent = RESULT_CELL_ACCENTS[accentIndex % RESULT_CELL_ACCENTS.length];

  return (
    <div
      data-testid="explore-more-banner"
      className={`flex h-full min-h-0 w-full flex-col justify-center gap-[3%] overflow-hidden px-[5%] py-[4%] text-left ${className}`}
    >
      <span className={`${RESULT_CELL_PILL} ${accent.pill}`}>더보기</span>

      <p className="line-clamp-2 break-keep text-[clamp(14px,4.2vw,19px)] font-black leading-[1.2] text-[#2b2520]">
        조금 더 놀다 갈래?
      </p>

      {onExploreMore ? (
        <button
          type="button"
          onClick={onExploreMore}
          data-testid="explore-more-cta"
          aria-label="대전 더 둘러보기 (TODAY'S DAEJEON으로 이동)"
          className="inline-flex w-fit shrink-0 cursor-pointer items-center bg-transparent p-0 text-[clamp(11px,3vw,13px)] font-bold text-[#7d7364] underline decoration-[#7d7364]/50 underline-offset-2 outline-none transition-colors hover:text-[#5c5244] hover:decoration-[#5c5244] focus-visible:text-[#5c5244] focus-visible:decoration-[#5c5244] focus-visible:ring-1 focus-visible:ring-[#7d7364]/60 focus-visible:ring-offset-1 rounded-sm"
        >
          대전 더 둘러보기 →
        </button>
      ) : (
        <p className="line-clamp-2 break-keep text-[clamp(10px,3vw,13px)] font-bold leading-[1.3] text-[#7d7364]">
          대전에서 더 즐길 거리 찾아보기
        </p>
      )}
    </div>
  );
}
