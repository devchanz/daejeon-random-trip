import React from 'react';
import { visualAsset } from '../../../config/visualAssets';
import { resolveResultSkin } from './resultSkin';
import type { RerollRewardState } from '../../../lib/experience';

export interface ResultSkinPreloadProps {
  /** Only emits preload hints while true (READY/SPINNING) -- a visitor who
   * never reaches READY never pays for the fetch. */
  active: boolean;
  rerollReward: RerollRewardState;
}

/**
 * Fetch hints for the three Result skin raster bands (header/body/actions)
 * BEFORE the Result Card ever mounts, so an uncached first run doesn't decode
 * them inside the Slot Peek -> Result reveal frame.
 *
 * `media` mirrors globals.css's `.skin-canvas` 1024px breakpoint switch
 * exactly, so only the variant that will actually render is fetched -- no
 * double download, and no JS breakpoint detection (the switch stays in CSS,
 * matching skinBand.ts's existing reasoning). Resolves through `visualAsset()`
 * so the asset registry (ADR-027) stays the single source of truth for paths.
 *
 * The reward state (not duration/preference) is the only thing that selects
 * WHICH raster set is needed (see resultSkin.ts) -- it is already final by
 * the time a spin starts (handleExecuteReroll consumes the reward BEFORE
 * dispatching startSpin), so the resolved state cannot change between this
 * preload and the eventual reveal.
 *
 * Pure fetch hints -- no DOM footprint, no layout, no decode work here (see
 * ADR-036 for why decode-on-preload was deliberately left as a separate,
 * measurement-gated refinement rather than bundled with this fetch step).
 */
export function ResultSkinPreload({ active, rerollReward }: ResultSkinPreloadProps) {
  if (!active) {
    return null;
  }

  const skin = resolveResultSkin(rerollReward);
  const bands = [skin.header, skin.body, skin.actions];

  return (
    <>
      {bands.map((band, index) => (
        <React.Fragment key={index}>
          <link
            rel="preload"
            as="image"
            href={visualAsset(band.mobile)}
            media="(max-width: 1023.98px)"
          />
          <link
            rel="preload"
            as="image"
            href={visualAsset(band.desktop)}
            media="(min-width: 1024px)"
          />
        </React.Fragment>
      ))}
    </>
  );
}
