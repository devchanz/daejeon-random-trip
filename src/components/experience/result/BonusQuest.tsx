'use client';

import React from 'react';

export interface BonusQuestProps {
  mission?: string;
  className?: string;
}

/**
 * Renders RouteResult.mission when present, nothing otherwise.
 *
 * TRANSPARENT CONTENT OVERLAY ONLY. The painted BONUS QUEST ribbon and its content
 * box are part of the body raster, so this draws no border, background, shadow or
 * washi-tape decoration of its own -- all of which previously stacked a second
 * card on top of the painted shell. The ribbon also carries its own "BONUS QUEST"
 * label, so no DOM heading is rendered either.
 *
 * Mission content comes from a small predefined pool (src/config/missions.ts)
 * selected by the engine -- no DB/API persistence, not a recommendation axis, no
 * operational or place-detail data.
 */
export function BonusQuest({ mission, className = '' }: BonusQuestProps) {
  const trimmed = mission?.trim();
  if (!trimmed) {
    return null;
  }

  return (
    <section
      aria-label="보너스 퀘스트"
      data-testid="bonus-quest"
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      <p className="line-clamp-2 text-center text-[clamp(12px,3.4vw,15px)] font-bold leading-snug text-[#5c4a2e]">
        {trimmed}
      </p>
    </section>
  );
}
