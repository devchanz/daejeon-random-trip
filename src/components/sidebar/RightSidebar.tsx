import React from 'react';
import { MemoryLogHeaderAction, RandomLogRightRailPreview } from '../random-log';
import { EditorialSpotlightCard } from '../editorial';
import { getActiveEditorialItems } from '../../data/editorial';
import { FittedAsset } from '../common';
import {
  RIGHT_SIDEBAR_ARIA_LABEL,
  TODAYS_DAEJEON_HEADING,
  VISITOR_LOG_COPY,
} from '../../content/sidebar';

/**
 * Right rail.
 * 1. Editorial spotlight: manual 5-item carousel over the currently valid pool. The
 *    feature name lives only in the `heading` prop below -- see
 *    src/components/editorial/EditorialSpotlightCard.tsx and src/data/editorial.ts.
 * 2. MEMORY LOG (user-facing name; component/route/DB layer is still RandomLog*):
 *    live preview (recent 3 entries) linking to /random-log.
 */
export function RightSidebar({ className = '' }: { className?: string }) {
  const editorialItems = getActiveEditorialItems();

  return (
    <aside
      aria-label={RIGHT_SIDEBAR_ARIA_LABEL}
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* 1. Editorial Spotlight. "TODAY'S DAEJEON" is passed in as copy, not baked into
             the component, the data model, or any asset key -- renaming the feature
             later is a one-string change here. */}
      <EditorialSpotlightCard items={editorialItems} heading={TODAYS_DAEJEON_HEADING} />

      {/* 2. MEMORY LOG (Live Random Log Preview) */}
      <section
        aria-label={VISITOR_LOG_COPY.heading}
        className="relative overflow-hidden rounded-2xl border-2 border-line-soft bg-[#fffef9] p-4 sm:p-5"
      >
        {/* Header with Clover Icon */}
        <div className="flex items-center justify-between border-b-2 border-line-soft pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            {/* FittedAsset applies the clover's opaque-fit compensation: uncompensated at 16px it
                rendered only ~9.3px of artwork -- the worse of the two. At a 20px box the visible
                clover is a true 20px, still inside the heading's 20px line box, so the header row
                height is unchanged. */}
            <FittedAsset
              assetKey="decoration.symbol.clover"
              className="h-5 w-5 shrink-0"
            />
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              {VISITOR_LOG_COPY.heading}
            </h2>
          </div>

          {/* Write affordance (ADR-042's behaviour, ADR-045's shape): ONE compact
              state-aware action, inline in this header row opposite the heading,
              where the row's existing `justify-between` already reserved the
              space (the editorial card's badge sits in the same slot). It
              replaces a full-width strip that cost the rail ~100px and pushed the
              landing's lower artwork out of frame.

              A Client Component inside this Server Component -- it reads the
              shared experience engine, which is why it can only live on `/`,
              this rail's only mount, inside ExperienceProvider. */}
          <MemoryLogHeaderAction />
        </div>

        <RandomLogRightRailPreview />
      </section>
    </aside>
  );
}
