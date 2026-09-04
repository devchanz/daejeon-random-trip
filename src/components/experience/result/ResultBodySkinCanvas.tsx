'use client';

import React from 'react';
import { skinBandStyle } from '../../common';
import { RESULT_BODY_PAPER, resolveResultSkin, resolveResultSkinState } from './resultSkin';
import type { RerollRewardState } from '../../../lib/experience';

export interface ResultBodySkinCanvasProps {
  rerollReward?: RerollRewardState;
  children: React.ReactNode;
  className?: string;
}

/**
 * The Result body's single non-repeating compositional raster, chosen by reward
 * state. Carries the approved Summary shell, MAIN QUEST ribbon, four painted cells
 * and BONUS QUEST shell for that state.
 *
 * Same renderer as the header and action bands: `.skin-canvas` in an aspect-locked
 * container, so the composition is never distorted, never tiles, and renders at
 * exactly 1.0x. Aspect-locking also makes the body height purely width-driven,
 * which is what lets the measured percentage region rects resolve identically at
 * every viewport.
 *
 * Two-layer stack, not one: a paper-fill layer sits BEHIND the raster layer,
 * both absolutely filling the same aspect-locked outer box (`inset-0`), so the
 * raster's own transparent pixels reveal paper colour rather than the dialog
 * backdrop, without the paper ever painting outside the raster's own geometry.
 *
 * The paper-fill is inset horizontally on desktop for the CONSUMED state only
 * (`resolveResultSkinState`, not the raw `rerollReward` prop, since 'locked'/
 * 'available' both resolve to the same 'normal' raster -- see resultSkin.ts).
 * The desktop-consumed body master (`result.skin.desktop.consumedBody`, Figma
 * node 329:2, the cleaned production alias -- see resultSkin.ts's docblock;
 * never 326:56, which still carries an opaque white exterior) has a small but
 * real ~1% (of its native 400px width) fully-transparent gutter around the
 * card on its left/right edges -- present at every row, since the body slice
 * has no rounded corners to explain it. Every other band/state export is tight
 * to its own canvas edge (~0%), so filling this box edge-to-edge (the previous
 * approach, on the scroll wrapper in ResultQuest.tsx) was invisible everywhere
 * except desktop-consumed, where it painted paper colour past the raster's own
 * frame into that gutter -- the reported "white side bars". Insetting the fill
 * to stop exactly at the measured gutter keeps it genuinely transparent there,
 * matching QuestHeader/ResultActions (never touched by this fix), rather than
 * hiding it behind a same-shaped rectangle of a different colour.
 *
 * `relative` on the outer box because the regions register against the artwork
 * by percentage, and both inner layers need it as their containing block.
 * Deliberately no `overflow-hidden`: long Korean copy must overflow visibly
 * rather than be clipped. On a short viewport the surrounding scroll container
 * is shorter than this canvas, so the canvas scrolls inside it; the Result is
 * never scaled.
 */
export function ResultBodySkinCanvas({
  rerollReward = 'locked',
  children,
  className = '',
}: ResultBodySkinCanvasProps) {
  const skin = resolveResultSkin(rerollReward);
  const isConsumed = resolveResultSkinState(rerollReward) === 'consumed';

  return (
    <div className={`relative w-full shrink-0 ${skin.bodyAspect} ${className}`}>
      <div
        aria-hidden="true"
        data-testid="result-body-paper-fill"
        style={{ backgroundColor: RESULT_BODY_PAPER }}
        className={`absolute inset-0 ${isConsumed ? 'lg:inset-x-[1%]' : ''}`}
      />
      <div
        data-testid="result-body-skin-canvas"
        style={skinBandStyle(skin.body.mobile, skin.body.desktop)}
        className="skin-canvas absolute inset-0"
      >
        {children}
      </div>
    </div>
  );
}
