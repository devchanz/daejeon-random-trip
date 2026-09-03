'use client';

import React from 'react';
import type { RouteStop } from '../../../lib/random';
import { FittedAsset, resolveStopAssetKey, resolveStopCategoryLabel } from '../../common';
import { RESULT_CELL_ACCENTS, RESULT_CELL_DIVIDER, RESULT_CELL_PILL } from './resultSkin';

export interface StopCardProps {
  stop: RouteStop;
  /** Position in the painted cell grid (0-3). Drives the accent colour. */
  accentIndex?: number;
  className?: string;
}

/**
 * StopCard content contract: category pill · replaceable pixel artwork · vertical
 * divider · place name · short attraction copy.
 *
 * TRANSPARENT CONTENT OVERLAY ONLY. The painted cell in the body raster IS the
 * card shell, so this draws no background, border, shadow or rounding of its own.
 * The current mobile cells are intentionally EMPTY tinted shells -- no baked
 * artwork rectangle, divider or placeholder -- so DOM owns the whole interior and
 * builds it with ordinary flex, never absolute coordinates.
 *
 * The category pill and the artwork/text divider are BOTH tinted from
 * RESULT_CELL_ACCENTS by the cell's POSITION, so they belong to the painted shell
 * they sit in rather than reading as one generic grey badge everywhere.
 *
 * The artwork is deliberately bare: no background, fill, border, rounding or
 * shadow. The StopVisual assets are transparent production art (measured 41-74%
 * transparent), so the pixel art floats directly on the tinted cell.
 *
 * Sizes are container-relative (`clamp()`, percentage heights) so content scales
 * with the painted cell at every width with no viewport-specific rules.
 */
export function StopCard({ stop, accentIndex = 0, className = '' }: StopCardProps) {
  const assetKey = resolveStopAssetKey(stop);
  const categoryLabel = stop.category ? resolveStopCategoryLabel(stop.category) : null;
  const accent = RESULT_CELL_ACCENTS[accentIndex % RESULT_CELL_ACCENTS.length];

  return (
    <article
      data-testid="stop-card"
      className={`flex h-full min-h-0 min-w-0 w-full flex-col justify-center gap-[3%] overflow-hidden px-[5%] py-[4%] ${className}`}
    >
      {categoryLabel && (
        <span className={`${RESULT_CELL_PILL} ${accent.pill}`}>{categoryLabel}</span>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 items-center gap-[3%]">
        {assetKey ? (
          <FittedAsset
            assetKey={assetKey}
            width={300}
            height={300}
            className="aspect-square h-full max-h-full w-auto shrink-0 self-center object-contain"
          />
        ) : (
          <span aria-hidden="true" className="shrink-0 text-2xl opacity-40">
            🖼️
          </span>
        )}

        {/* DOM divider (never baked into the PNG), inset top and bottom so it
            structures the content without running edge to edge. */}
        <div aria-hidden="true" className={`${RESULT_CELL_DIVIDER} ${accent.divider}`} />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[2%]">
          <h3 className="line-clamp-2 break-words text-[clamp(14px,4.2vw,19px)] font-black leading-[1.3] text-[#2b2520]">
            {stop.name}
          </h3>
          {stop.hook && (
            <p className="line-clamp-2 break-words text-[clamp(10px,3vw,13px)] font-bold leading-[1.3] text-[#7d7364]">
              {stop.hook}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
