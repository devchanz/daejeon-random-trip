'use client';

import React, { useRef, useState } from 'react';
import type { EditorialItem } from '../../data/editorial';
import { visualAsset } from '../../config/visualAssets';
import { FittedAsset } from '../common';
import { EDITORIAL_EMPTY_STATE } from '../../content/sidebar';

export interface EditorialSpotlightCardProps {
  /** The 5-item production set to browse. An empty array renders an explicit empty state. */
  items: readonly EditorialItem[];
  /**
   * Module label. The ONLY place the current feature name ("TODAY'S DAEJEON") appears --
   * renaming the feature is a one-string change at the call site, not a refactor here.
   */
  heading: string;
  /** Perched mascot at the card's top-right. Opt out when reusing the shell elsewhere. */
  showMascot?: boolean;
  className?: string;
}

/** Minimum horizontal drag distance (px) to count as a swipe rather than a tap/scroll. */
const SWIPE_THRESHOLD_PX = 40;

/**
 * Editorial banner carousel shell -- manual prev/next over a small, fixed, curated set
 * (currently 5 production banners; see src/data/editorial.ts). One banner visible at a
 * time, no autoplay, no library.
 *
 * Composition is intentionally minimal -- compact header, banner, optional tags -- because
 * the rail's problem was vertical space, not missing content:
 *
 * - No dedicated visible title row. Every banner artwork already carries its own title
 *   copy, so `item.title` is surfaced as the banner's `alt` (always the accessible name)
 *   instead of being duplicated as a text row.
 * - The banner sits inside a FIXED `aspect-[15/8]` viewport (Human Browser correction):
 *   the 5 approved rasters are not all the same intrinsic ratio (Tashu/KkumssiFamily/
 *   ExpoBridgeNight ~15:8; BreadTour/SeptemberEvents ~16:9), so sizing the viewport by
 *   the active image's own dimensions (the previous `h-auto w-full` approach) made the
 *   card visibly grow/shrink as the carousel advanced -- everything below it (MEMORY LOG,
 *   and on mobile the whole rest of the stacked page) shifted with it. The viewport's
 *   geometry is now independent of which image is loaded: fixed aspect-ratio box,
 *   `overflow-hidden`, `object-cover` fills it (cropping only the ~16:9 pair's excess
 *   top/bottom, never stretching any asset). Zero layout shift 1→2→3→4→5, and the
 *   prev/next/indicator overlay coordinates -- all children of this same fixed box --
 *   never move either.
 * - Prev/next controls and the position indicator overlay the banner itself (corners),
 *   rather than adding a new header/footer row -- this is what keeps the card's footprint
 *   identical to the prior single-banner presentation.
 * - Prev/next are minimal chevrons only (Human Browser correction): no circular
 *   background, no border -- those read as a separate bolted-on UI control rather
 *   than a lightweight image-browsing affordance. The clickable `<button>` box is
 *   still a full accessible hit target (enlarged invisibly via padding, not
 *   visible size), sitting right at the banner's outer edge; only the chevron
 *   glyph itself is visible, in white with a very subtle drop-shadow for
 *   legibility over arbitrary imagery.
 * - `badge` rides inline in the header row, which was previously empty on the right, so
 *   it costs no additional height.
 * - No tabs. Multiple content kinds share this one shell; `kind` describes an item, it
 *   does not fork the layout.
 */
export function EditorialSpotlightCard({
  items,
  heading,
  showMascot = true,
  className = '',
}: EditorialSpotlightCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const suppressNextClickRef = useRef(false);

  const count = items.length;
  const safeIndex = count > 0 ? ((activeIndex % count) + count) % count : 0;
  const item = count > 0 ? items[safeIndex] : null;

  const goTo = (nextIndex: number) => {
    if (count === 0) return;
    setActiveIndex(((nextIndex % count) + count) % count);
  };
  const goPrev = () => goTo(safeIndex - 1);
  const goNext = () => goTo(safeIndex + 1);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    if (startX === null || startY === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Only treat this as a carousel swipe when horizontal movement clearly
    // dominates -- otherwise a vertical page scroll that happens to start on
    // the banner would get hijacked into changing slides.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }

    // The banner itself is a link (opens the destination) -- a swipe that
    // changes slides must not also fire that link's click.
    suppressNextClickRef.current = true;
  };

  const handleBannerClick = (event: React.MouseEvent) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      event.preventDefault();
    }
  };

  const bannerImg = item && (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={visualAsset(item.bannerAssetKey)}
      alt={item.title}
      className="h-full w-full select-none object-cover"
      style={{ objectPosition: item.bannerObjectPosition ?? 'center' }}
      draggable={false}
    />
  );

  const banner = item ? (
    <div>
      {/* Fixed viewport, independent of the active image's intrinsic size (see
          docstring above) -- `aspect-[15/8]` + `overflow-hidden` is the ONLY
          thing that determines this box's height, for every item, always.
          Prev/next/indicator are positioned relative to THIS box (not the
          outer card), so their coordinates are identical regardless of which
          image is loaded or whether `tags` renders below. */}
      <div
        className="relative aspect-[15/8] w-full overflow-hidden rounded-xl border border-line-soft"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* object-cover fills the fixed box without stretching; only the ~16:9
            pair (breadTour/septemberEvents) crop slightly top/bottom against
            this ~15:8 box -- the ~15:8-native trio (tashu/kkumssiFamily/
            expoBridgeNight) render effectively uncropped. object-position is
            per-item (defaults to center) so a specific item's baked copy can
            be nudged into frame without touching the shared viewport. */}
        {item.href ? (
          <a
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={handleBannerClick}
            className="absolute inset-0 block outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#ff5555] focus-visible:ring-offset-2"
          >
            {bannerImg}
          </a>
        ) : (
          // No destination: non-interactive, exactly like the pre-carousel
          // single-item shell's `item.href ? <a> : <div>` branch -- an `<a>`
          // without `href` is not a real link (not keyboard-focusable, no
          // navigation), so a plain div is the correct element here, not an
          // inert anchor.
          <div className="absolute inset-0 block">{bannerImg}</div>
        )}

        {count > 1 && (
          <>
            {/* Chevron-only controls: the button's own box is the full-size
                accessible hit target (h-10 w-7, right at the banner's edge), but
                nothing about that box is painted -- no fill, no border, no
                rounding -- only the chevron glyph is visible, so this never
                reads as a separate circular UI control sitting on the image. */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="이전 배너"
              className="group absolute left-0 top-1/2 z-10 flex h-10 w-7 -translate-y-1/2 items-center justify-start pl-0.5 bg-transparent outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-1"
            >
              <svg
                viewBox="0 0 20 20"
                width="20"
                height="20"
                fill="none"
                stroke="#fffef9"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                className="drop-shadow-[0_1px_2px_rgba(43,37,32,0.55)] opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <polyline points="12,4 6,10 12,16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="다음 배너"
              className="group absolute right-0 top-1/2 z-10 flex h-10 w-7 -translate-y-1/2 items-center justify-end pr-0.5 bg-transparent outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-1"
            >
              <svg
                viewBox="0 0 20 20"
                width="20"
                height="20"
                fill="none"
                stroke="#fffef9"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                className="drop-shadow-[0_1px_2px_rgba(43,37,32,0.55)] opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <polyline points="8,4 14,10 8,16" />
              </svg>
            </button>

            {/* Position indicator. Visible pill overlay + a polite live region so
                screen reader users hear the new position after prev/next, without
                a second visible announcement. */}
            <span
              aria-hidden="true"
              className="absolute bottom-1.5 right-1.5 z-10 rounded-full border border-line-soft bg-[#2b2520]/70 px-2 py-0.5 font-mono text-[10px] font-black text-white"
            >
              {safeIndex + 1} / {count}
            </span>
            <span className="sr-only" aria-live="polite">
              {`${safeIndex + 1}번째 배너, 전체 ${count}개 중`}
            </span>
          </>
        )}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold text-[#6b6257]">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-line-soft bg-[#faf6ee] px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
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
      ) : (
        banner
      )}
    </section>
  );
}
