'use client';

import React from 'react';
import type { RouteResult } from '../../../lib/random';
import type { RerollRewardState } from '../../../lib/experience';
import { QuestHeader } from './QuestHeader';
import { ResultBodySkinCanvas } from './ResultBodySkinCanvas';
import { RESULT_BODY_PAPER, resolveResultSkin } from './resultSkin';
import { ResultSummary } from './ResultSummary';
import { MainQuest } from './MainQuest';
import { BonusQuest } from './BonusQuest';
import { ResultActions } from './ResultActions';

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
          shrinking the Result. It carries the measured paper colour so the surface
          is continuous from the canvas straight into the painted action band --
          BONUS QUEST now flows directly into the action wells, with no standalone
          Random Log row and no spacer left where it used to be.

          `scrollbar-hidden` removes only the scrollbar's rendering -- `overflow-y-auto`
          is untouched, so wheel, trackpad, touch and keyboard scrolling all still
          work. The sheet reads as clean paper with no native scrollbar over it. */}
      <div
        style={{ backgroundColor: RESULT_BODY_PAPER }}
        className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
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
