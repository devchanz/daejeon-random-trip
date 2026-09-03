import React from 'react';
import type { EditorialItem } from '../../data/editorial';
import { visualAsset, VISUAL_ASSET_META } from '../../config/visualAssets';
import { FittedAsset } from '../common';
import { EDITORIAL_EMPTY_STATE } from '../../content/sidebar';

export interface EditorialSpotlightCardProps {
  /** The item to feature. `null` renders an explicit empty state. */
  item: EditorialItem | null;
  /**
   * Module label. The ONLY place the current feature name ("TODAY'S PICK") appears --
   * renaming the feature is a one-string change at the call site, not a refactor here.
   */
  heading: string;
  /** Perched mascot at the card's top-right. Opt out when reusing the shell elsewhere. */
  showMascot?: boolean;
  className?: string;
}

/**
 * Single editorial banner presentation shell.
 *
 * Composition is intentionally minimal -- compact header, banner, optional tags -- because
 * the rail's problem was vertical space, not missing content:
 *
 * - No dedicated visible title row. Every banner artwork already carries its own title
 *   copy, so `item.title` is surfaced as the banner's `alt` (always the accessible name)
 *   instead of being duplicated as a text row.
 * - No separate "자세히 보기" button. When an item has an `href`, the banner region itself
 *   is the link; when it does not, the card is simply non-interactive.
 * - `badge` rides inline in the header row, which was previously empty on the right, so
 *   it costs no additional height.
 * - No tabs and no carousel. Multiple content kinds share this one shell; `kind` describes
 *   an item, it does not fork the layout.
 *
 * Net effect at 1440 (302px column): ~340px -> ~259px with tags, ~229px without.
 */
export function EditorialSpotlightCard({
  item,
  heading,
  showMascot = true,
  className = '',
}: EditorialSpotlightCardProps) {
  const bannerMeta = item ? VISUAL_ASSET_META[item.bannerAssetKey] : undefined;

  const banner = item ? (
    <>
      {/* Intrinsic width/height come from VISUAL_ASSET_META, so the browser reserves each
          banner's OWN aspect ratio before load (no CLS) and the artwork is never cropped.
          The 6 banners are not a single aspect: three sit near 16:9 (nightView 1.777,
          septemberEvents 1.774, breadTour 1.778) and three near 1.87 (tashu, kkumssiFamily,
          expoBridgeNight), so rendered card height varies by roughly 5% between items.
          That is accepted, not a constraint to enforce -- `h-auto w-full` lets each banner
          keep its own proportions rather than forcing a shared ratio and cropping. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={visualAsset(item.bannerAssetKey)}
        alt={item.title}
        width={bannerMeta?.w}
        height={bannerMeta?.h}
        className="h-auto w-full rounded-xl border border-line-soft select-none"
      />

      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold text-[#6b6257]">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-line-soft bg-[#faf6ee] px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  ) : null;

  return (
    <section
      aria-label={heading}
      className={`relative overflow-visible rounded-2xl border-2 border-line-soft bg-[#fffef9] p-4 sm:p-5 ${className}`}
    >
      {/* Perched mascot, straddling the card's top-right corner. Anchored to the OUTER
          edge so it stays as far as possible from the centre column's character artwork.
          The parent column reserves matching clearance (see page.tsx perch band), and the
          card is overflow-visible so the overhang is never clipped.

          VERTICAL ALIGNMENT (closeout correction, position-only). The artwork was drawn
          so the mascot's hands rest on / grip the card's top border. Its two paws are the
          lowest opaque elements, but the 137x151 canvas carries 23px (15.23%) of
          TRANSPARENT padding below them -- so offsetting the box alone sank the hands
          12-20px inside the card. The offsets below place the hand line at ~+2px, i.e. on
          the 2px border, derived as `top = 0.84768 x renderedHeight - 2`.

          Widths are deliberately UNCHANGED (w-12 / sm:w-14 / lg / xl / 2xl), as is the
          horizontal anchor: this is a position correction, not a responsive-size redesign.
          Measured horizontal padding is 8px left / 5px right of a 137px canvas, i.e.
          within ~3.6% of centred, so no horizontal change is warranted. */}
      {showMascot && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={visualAsset('editorial.mascotPerched')}
          alt=""
          aria-hidden="true"
          width={137}
          height={151}
          className="pointer-events-none absolute right-2 z-10 w-12 -top-[43px] select-none sm:w-14 sm:-top-[50px] lg:right-3 lg:w-[56px] lg:-top-[50px] xl:w-[68px] xl:-top-[62px] 2xl:w-[76px] 2xl:-top-[69px]"
        />
      )}

      {/* Compact header. Tightened from pb-2.5/mb-3 and absorbs the item badge on the
          right, replacing what used to be a separate full-height title row. */}
      <div className="mb-2.5 flex items-center justify-between border-b-2 border-line-soft pb-2">
        <div className="flex items-center gap-1.5">
          {/* FittedAsset applies the star's opaque-fit compensation: uncompensated at 16px it
              rendered only ~12.4px of artwork. At a 20px box the visible star is a true 20px,
              and it still sits inside the heading's 20px line box, so the header row height is
              unchanged. */}
          <FittedAsset
            assetKey="decoration.symbol.star"
            className="h-5 w-5 shrink-0"
          />
          <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
            {heading}
          </h2>
        </div>

        {item?.badge && (
          <span className="rounded-md border border-line-soft bg-[#ff5555] px-2 py-0.5 text-[10px] font-black text-white">
            {item.badge}
          </span>
        )}
      </div>

      {item === null ? (
        <p className="py-3 text-center text-xs font-bold text-[#8c8273]">
          {EDITORIAL_EMPTY_STATE}
        </p>
      ) : item.href ? (
        <a
          href={item.href}
          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="block rounded-xl outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#ff5555] focus-visible:ring-offset-2"
        >
          {banner}
        </a>
      ) : (
        <div>{banner}</div>
      )}
    </section>
  );
}
