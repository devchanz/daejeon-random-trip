'use client';

import React from 'react';
import { skinBandStyle } from '../../common';
import { resolveResultSkin } from './resultSkin';
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
 * `relative` because the regions register against the artwork by percentage.
 * Deliberately no `overflow-hidden`: long Korean copy must overflow visibly rather
 * than be clipped. On a short viewport the surrounding scroll container is shorter
 * than this canvas, so the canvas scrolls inside it; the Result is never scaled.
 */
export function ResultBodySkinCanvas({
  rerollReward = 'locked',
  children,
  className = '',
}: ResultBodySkinCanvasProps) {
  const skin = resolveResultSkin(rerollReward);

  return (
    <div
      data-testid="result-body-skin-canvas"
      style={skinBandStyle(skin.body.mobile, skin.body.desktop)}
      className={`skin-canvas relative w-full shrink-0 ${skin.bodyAspect} ${className}`}
    >
      {children}
    </div>
  );
}
