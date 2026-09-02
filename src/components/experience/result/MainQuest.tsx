'use client';

import React from 'react';
import type { RouteStop } from '../../../lib/random';
import { StopCard } from './StopCard';
import { ExploreMoreBanner } from './ExploreMoreBanner';
import { RESULT_CELLS_GRID } from './resultSkin';

export interface MainQuestProps {
  stops: RouteStop[];
  onExploreMore?: () => void;
  className?: string;
}

/**
 * Fills the four PAINTED cells of the body raster: 1 col x 4 rows on mobile, 2 x 2
 * from `sm`, with the measured gutters (RESULT_CELLS_GRID). The grid takes the full
 * height of its region so each child lands on exactly one painted cell -- fixed
 * row counts are what keep registration exact for both stop counts.
 *
 * A 3-stop route fills the 4th cell with ExploreMoreBanner instead of stretching or
 * centering STOP 3 -- there is no fake STOP 4 and no orphan-card sizing logic. Both
 * counts consume four cells, so body height never varies with stop count.
 *
 * ExploreMoreBanner is derived purely from `stops.length` here, outside the map,
 * and never enters `src/lib/random` or any RouteResult/RouteStop type.
 */
export function MainQuest({ stops, onExploreMore, className = '' }: MainQuestProps) {
  const showExploreMore = stops.length === 3;

  return (
    <section
      aria-label="추천 코스 상세"
      data-testid="main-quest"
      className={`${RESULT_CELLS_GRID} ${className}`}
    >
      {/* accentIndex is the cell's POSITION in the painted grid -- the cell tints
          are positional, not category-based -- so the pill and divider colours
          always match the shell the content sits in. */}
      {stops.map((stop, index) => (
        <StopCard
          key={`${stop.placeId || stop.name}-${stop.order}`}
          stop={stop}
          accentIndex={index}
        />
      ))}
      {showExploreMore && (
        <ExploreMoreBanner accentIndex={3} onExploreMore={onExploreMore} />
      )}
    </section>
  );
}
