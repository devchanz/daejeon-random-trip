import React from 'react';
import { opaqueFit, visualAsset, type VisualAssetKey } from '../../config/visualAssets';

export interface FittedAssetProps {
  /** Registry key. Compensation, if any, is looked up from this. */
  assetKey: VisualAssetKey;
  /**
   * Sizing/positioning classes for the LAYOUT BOX (e.g. `h-6 w-6`). The box should be
   * the intended VISIBLE artwork size -- compensation makes the opaque region fill it.
   */
  className?: string;
  /** Accessible name. Empty string (default) marks the image decorative. */
  alt?: string;
  /** Intrinsic dimensions, when a caller wants the browser to reserve the aspect ratio. */
  width?: number;
  height?: number;
}

/**
 * The single place a transparent-padding compensation transform is ever written.
 *
 * Several production assets carry large transparent margins, so their visible artwork
 * is far smaller than their CSS box (see VISUAL_ASSET_OPAQUE_FIT in
 * src/config/visualAssets.ts for the measured bounds and the exact contract). This
 * component looks the compensation up by asset key and applies it, so feature
 * components never contain a `scale()` or `translate()` of their own and the values
 * stay centralized in config.
 *
 * Two properties this relies on:
 *  - `transform` does not participate in layout, so compensation can never move the
 *    surrounding UI. The layout box is exactly the class list the caller passed.
 *  - The overflow it creates is transparent pixels only. `pointer-events-none` is
 *    therefore applied unconditionally: at large scales that invisible overflow would
 *    otherwise sit above neighbouring controls and swallow their clicks (the brand
 *    logo's overflow reaches into the header's address-bar link).
 *
 * Assets with no registry entry render unscaled, so this is safe for any key.
 */
export function FittedAsset({
  assetKey,
  className = '',
  alt = '',
  width,
  height,
}: FittedAssetProps) {
  const fit = opaqueFit(assetKey);

  const transform = fit
    ? [
        fit.dx || fit.dy
          ? `translate(${(fit.dx ?? 0) * 100}%, ${(fit.dy ?? 0) * 100}%)`
          : '',
        fit.scale !== 1 ? `scale(${fit.scale})` : '',
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={visualAsset(assetKey)}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      width={width}
      height={height}
      className={`pointer-events-none select-none object-contain ${className}`}
      style={transform ? { transform } : undefined}
    />
  );
}
