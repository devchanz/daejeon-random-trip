'use client';

import React, { useRef } from 'react';
import type { RouteResult } from '../../../lib/random';
import type { RerollRewardState } from '../../../lib/experience';
import { QuestHeader } from './QuestHeader';
import { ResultBodySkinCanvas } from './ResultBodySkinCanvas';
import { RESULT_BODY_PAPER, resolveResultSkin } from './resultSkin';
import { ResultSummary } from './ResultSummary';
import { MainQuest } from './MainQuest';
import { BonusQuest } from './BonusQuest';
import { ResultActions } from './ResultActions';
import { ScrollContinuationCue } from '../../common';

export interface ResultQuestProps {
  result: RouteResult;
  rerollReward?: RerollRewardState;
  onOpenGuestbook?: () => void;
  onExecuteReroll?: () => void;
  onOpenRouteGuide?: () => void;
  /** Explore-More destination seam -- not decided in this branch; see MainQuest/ExploreMoreBanner. */
  onExploreMore?: () => void;
  className?: string;
}

/**
 * Result Quest: three-zone shell -- QuestHeader (shrink-0) + scroll body
 * (flex-1 min-h-0) + ResultActions (shrink-0) -- so all Result actions stay
 * reachable regardless of stop count, font metrics, or copy length. Mirrors
 * RouteGuideModal's proven three-zone pattern (header/body/footer split).
 */
export function ResultQuest({
  result,
  rerollReward = 'locked',
  onOpenGuestbook,
  onExecuteReroll,
  onOpenRouteGuide,
  onExploreMore,
  className = '',
}: ResultQuestProps) {
  // Both states go through the same shell and renderer; only the asset and the
  // action layout differ.
  const skin = resolveResultSkin(rerollReward);
  const scrollRef = useRef<HTMLDivElement>(null);
  // No DOM frame on the <article>: the approved skin bands carry the cobalt outer
  // frame, its dark pixel-art outline and the rounded corners, so the previous
  // `rounded-3xl border-3 ... shadow-retro-xl` shell and the dashed perforation
  // strip were removed rather than layered on top of the artwork.
  return (
    <article
      data-testid="result-quest"
      className={`relative flex min-h-0 w-full flex-1 flex-col overflow-hidden ${className}`}
    >
      <QuestHeader rerollReward={rerollReward} />

      {/* Scroll container stays the flex-1 min-h-0 zone (P0); the compositional
          raster lives INSIDE it so a short viewport scrolls the canvas rather than
          shrinking the Result. The measured paper colour is painted by
          ResultBodySkinCanvas's own inner fill layer (inset to match the
          raster's own geometry per state/breakpoint), not here -- this wrapper
          is left transparent so it never bleeds paper colour past whichever
          card silhouette the active raster actually draws. BONUS QUEST flows
          directly into the action wells, with no standalone Random Log row and
          no spacer left where it used to be.

          `scrollbar-hidden` removes only the scrollbar's rendering -- `overflow-y-auto`
          is untouched, so wheel, trackpad, touch and keyboard scrolling all still
          work. The sheet reads as clean paper with no native scrollbar over it.

          `overscroll-none` (not `overscroll-contain`): `contain` only stops this
          scroller's overscroll from CHAINING to the document -- it does not
          suppress the scroller's OWN rubber-band/stretch, which visibly detached
          this cream canvas from the fixed header/action rasters above and below
          it on a touch drag past either end. `none` suppresses that directly; the
          document-level chaining concern it also used to cover is now handled by
          the shared `useScrollLock` in ResultArea instead. */}
      {/* Non-scrolling wrapper the cue is pinned against: only its child below
          scrolls, so the cue's `absolute bottom-0` always tracks the visible
          bottom edge of the viewport, never the bottom of the full (taller)
          scrolled content. */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-none"
        >
          {/* Each child registers against the painted composition by measured
              percentage (skin.regions); inside a region, layout is ordinary
              flex/grid. The painted MAIN QUEST / BONUS QUEST ribbons carry their own
              labels, so no DOM heading is drawn for them. */}
          <ResultBodySkinCanvas rerollReward={rerollReward}>
            <div className={skin.regions.summary}>
              <ResultSummary result={result} />
            </div>

            <div className={skin.regions.cells}>
              <MainQuest stops={result.stops || []} onExploreMore={onExploreMore} />
            </div>

            <div className={skin.regions.bonus}>
              <BonusQuest mission={result.mission} />
            </div>
          </ResultBodySkinCanvas>
        </div>

        {/* Mobile-only: the first mobile viewport can show a full row of
            painted cells and read as a complete Result when more (BONUS QUEST,
            or additional cells) sits below. Result's raster/geometry are
            untouched -- this is a DOM overlay pinned to the scroll viewport's
            own edge, not a change to the canvas underneath it.

            Fade-only, no chevron: Human Browser E2E read the floating
            chevron as a separately bolted-on control here. Result's primary
            continuation signal is content itself -- the raster's own cells
            naturally run past the fold on a short viewport, so a partial
            slice of the next section is already visible without any DOM
            change. This mask only softens that visible edge (an extremely
            light version of the exact paper colour, not a fog/toolbar), and
            still fully respects the same overflow/scroll-position gating as
            Route Guide's cue -- it is not a permanent fixture. */}
        <ScrollContinuationCue
          containerRef={scrollRef}
          edgeColor={RESULT_BODY_PAPER}
          showChevron={false}
          heightClassName="h-8"
          className="lg:hidden"
        />
      </div>

      <ResultActions
        result={result}
        rerollReward={rerollReward}
        onOpenGuestbook={onOpenGuestbook}
        onExecuteReroll={onExecuteReroll}
        onOpenRouteGuide={onOpenRouteGuide}
      />
    </article>
  );
}
