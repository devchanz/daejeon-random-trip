import type React from 'react';
import { visualAsset, type VisualAssetKey } from '../../config/visualAssets';

/**
 * Builds the `--skin-m` / `--skin-d` custom properties consumed by the
 * `.skin-canvas` utility in globals.css (Result's header/body/action bands,
 * and the Route Guide mission shell -- the one Route Guide asset still
 * shipped as a raster after its Phase 4 DOM/CSS rebuild).
 *
 * Two things this preserves at once:
 *  - Asset paths still resolve through `visualAsset()`, so the registry stays the
 *    single source of truth (ADR-027) rather than URLs being hardcoded in class
 *    strings or CSS.
 *  - The breakpoint switch stays in CSS, so no JS breakpoint detection is
 *    introduced (no hydration hazard) and the browser fetches only the variant it
 *    actually uses.
 *
 * Passing `desktop: null` omits `--skin-d` entirely, leaving the desktop media
 * block with no image to resolve. No Result state needs that any more -- all four
 * approved state rasters exist -- but the parameter is kept optional for callers
 * that genuinely have only a mobile asset.
 */
export function skinBandStyle(
  mobile: VisualAssetKey,
  desktop: VisualAssetKey | null = null
): React.CSSProperties {
  const style: Record<string, string> = {
    '--skin-m': `url(${visualAsset(mobile)})`,
  };
  if (desktop) {
    style['--skin-d'] = `url(${visualAsset(desktop)})`;
  }
  return style as React.CSSProperties;
}
