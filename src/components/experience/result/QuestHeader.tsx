'use client';

import React from 'react';
import { skinBandStyle } from '../../common';
import { resolveResultSkin } from './resultSkin';
import type { RerollRewardState } from '../../../lib/experience';

export interface QuestHeaderProps {
  rerollReward?: RerollRewardState;
  className?: string;
}

/**
 * Non-scrolling header zone, painted entirely by the approved state raster: the
 * cobalt frame top, the paperclip, the "NEW QUEST!" banner and the star/heart
 * decorations all live in the artwork. This element renders NO text and NO
 * decoration of its own -- redrawing any of it would double the motif.
 *
 * Uses the SAME renderer as the body and action bands: `.skin-canvas`
 * (`background-size: 100% auto`) in a container aspect-locked to the band, so the
 * band renders at exactly 1.0x. The header asset is chosen by reward state, which
 * is the only difference between normal and consumed here.
 *
 * `결과 접기` and the `추천 완료` badge are deliberately absent: the master paints
 * no slot for them, so minimize lives just outside the raster in ResultArea.
 */
export function QuestHeader({ rerollReward = 'locked', className = '' }: QuestHeaderProps) {
  const skin = resolveResultSkin(rerollReward);

  return (
    <header
      aria-hidden="true"
      data-testid="quest-header"
      style={skinBandStyle(skin.header.mobile, skin.header.desktop)}
      className={`skin-canvas w-full shrink-0 ${skin.headerAspect} ${className}`}
    />
  );
}
