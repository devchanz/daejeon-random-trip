'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { EditorialItem } from '../../data/editorial';
import { visualAsset } from '../../config/visualAssets';
import { FittedAsset } from '../common';
import { EDITORIAL_EMPTY_STATE } from '../../content/sidebar';
import { pushDataLayerEvent } from '../../lib/analytics';
import { usePrefersReducedMotion } from '../experience/motionConfig';

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
 * Dwell time before the carousel advances on its own. Deliberately brisk -- the
 * rail is a discovery surface, so a passive visitor cycles the whole set rather
 * than settling on one; hover/focus pauses whichever banner is being read.
 */
const AUTO_ADVANCE_INTERVAL_MS = 2_000;

/**
 * Fraction of the card that must be inside the viewport before it counts as
 * exposed -- the gate for BOTH auto-advance and the impression event. Half the
 * card is a deliberate middle ground: a 1px sliver at the edge of the fold is
 * not an impression, and requiring the whole card would never fire on a short
 * viewport.
 */
const EXPOSURE_RATIO = 0.5;

/**
 * Editorial banner carousel shell -- prev/next over a small, fixed, curated set
 * (currently 5 production banners; see src/data/editorial.ts). One banner visible at a
 * time, no library.
 *
 * Advance is both manual (buttons/swipe) and automatic on a ~2s timer (ADR-042,
 * revising ADR-028/ADR-038's original manual-only contract). The automatic path is
 * deliberately NOT the same seam as the manual one -- see goPrev/goNext below and
 * the auto-advance effect for why that separation is what keeps the
 * todays_daejeon_next/prev interaction events honest.
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
  // Auto-advance suspension. `isInteracting` covers hover + focus-within (the
  // reader is looking at / operating this card); `isTabHidden` covers the tab
  // being backgrounded, so a page left open in another tab does not silently
  // cycle through banners (and fire their impressions) unseen.
  const [isInteracting, setIsInteracting] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  // Whether THIS mount's card is genuinely on screen. Both the desktop and the
  // mobile rail are permanently mounted (page.tsx gates them with CSS only), and
  // even the displayed one spends most of a session scrolled far out of view --
  // so "mounted" is not "seen". Drives both the auto-advance scheduler and the
  // impression event; see the observer effect below.
  const [isExposed, setIsExposed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const suppressNextClickRef = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const lastViewedItemIdRef = useRef<string | null>(null);

  const count = items.length;
  const safeIndex = count > 0 ? ((activeIndex % count) + count) % count : 0;
  const item = count > 0 ? items[safeIndex] : null;

  const goTo = (nextIndex: number) => {
    if (count === 0) return;
    setActiveIndex(((nextIndex % count) + count) % count);
  };
  // goPrev/goNext compute the target index up front (rather than deferring to
  // goTo's own modulo) so the analytics dispatch below can reference exactly
  // the item that becomes active -- this is the single shared seam both the
  // prev/next buttons AND swipe (handleTouchEnd, below) call through.
  const goPrev = () => {
    if (count === 0) return;
    const prevIndex = ((safeIndex - 1) % count + count) % count;
    pushDataLayerEvent('todays_daejeon_prev', {
      editorial_id: items[prevIndex]?.id,
      editorial_position: prevIndex + 1,
    });
    goTo(prevIndex);
  };
  const goNext = () => {
    if (count === 0) return;
    const nextIndex = ((safeIndex + 1) % count + count) % count;
    pushDataLayerEvent('todays_daejeon_next', {
      editorial_id: items[nextIndex]?.id,
      editorial_position: nextIndex + 1,
    });
    goTo(nextIndex);
  };

  // todays_daejeon_view: fires as an item impression -- the initial visible
  // banner on mount, and again for each different banner that becomes active
  // via next/prev/swipe (all of which change `item`/`safeIndex`).
  //
  // DUAL-MOUNT GUARD: page.tsx renders RightSidebar (and therefore this
  // component) twice -- once for the desktop column, once for the mobile
  // `#mobile-right-rail` wrapper -- gated only by CSS (`hidden lg:flex` /
  // `lg:hidden`); both instances are always mounted simultaneously. A plain
  // mount/update effect would double-count every impression. Checking
  // `offsetParent !== null` (the same visibility test
  // ExperienceProvider.handleExploreMore already uses for this identical
  // dual-mount shape) ensures only the DISPLAYED instance dispatches -- and
  // since ADR-047 the `isExposed` gate below additionally requires that
  // displayed instance to actually be in the viewport, because "displayed" and
  // "seen" are not the same thing on a rail that sits below the fold.
  //
  // STRICTMODE GUARD: a `lastViewedItemIdRef` comparison makes this idempotent
  // against React StrictMode's dev-only double-invoke of this effect (mount ->
  // cleanup -> mount again, same dependency value) -- verified by local dataLayer
  // inspection to double-dispatch without this guard. A real re-impression of
  // the SAME item after navigating away and back still dispatches correctly,
  // since an intervening item change updates the ref first.
  useEffect(() => {
    if (!item) return;
    // Positive check on purpose: an unattached ref (sectionRef.current === null)
    // must also skip the dispatch, not fall through to it -- `=== null` alone
    // would misclassify "not yet attached" as "visible".
    if (!sectionRef.current || sectionRef.current.offsetParent === null) return;
    // VIEWPORT GATE (ADR-047): an impression means the banner was actually on
    // screen, not merely mounted. `isExposed` is a dependency as well as a
    // guard, so a card that mounts below the fold dispatches its impression the
    // moment it is scrolled to -- not at mount, and not never.
    if (!isExposed) return;
    if (lastViewedItemIdRef.current === item.id) return;

    lastViewedItemIdRef.current = item.id;
    pushDataLayerEvent('todays_daejeon_view', {
      editorial_id: item.id,
      editorial_position: safeIndex + 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, isExposed]);

  // VIEWPORT EXPOSURE (ADR-047). One IntersectionObserver on this card, at a 50%
  // threshold -- "at least half the card is on screen" is the bar for both
  // advancing it and counting an impression.
  //
  // This is what makes the dual mount safe. The hidden responsive mount lives in
  // a `display:none` subtree, generates no box, and therefore never intersects,
  // so it can never schedule a timer or dispatch a view -- and the *displayed*
  // mount stops doing both while it is scrolled off screen, which on mobile (the
  // rail sits below the whole hero) is most of a session. `offsetParent` alone
  // could only answer the first half of that.
  //
  // Fails OPEN if IntersectionObserver is unavailable: the carousel keeps its
  // pre-ADR-047 behaviour rather than silently freezing.
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsExposed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsExposed(entry.isIntersecting && entry.intersectionRatio >= EXPOSURE_RATIO),
      { threshold: [0, EXPOSURE_RATIO] }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Tab visibility, tracked as state (not read ad hoc inside the timer) so the
  // auto-advance effect below re-evaluates -- and therefore tears its timer down
  // and rebuilds it with a full fresh interval -- the moment visibility flips.
  // Same `visibilitychange` pattern ExperienceProvider's peek reconciliation uses.
  useEffect(() => {
    const syncVisibility = () => setIsTabHidden(document.visibilityState === 'hidden');
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => document.removeEventListener('visibilitychange', syncVisibility);
  }, []);

  // AUTO-ADVANCE (ADR-042).
  //
  // ANALYTICS BOUNDARY: this advances via the plain setter, never goNext() --
  // todays_daejeon_next/prev are *interaction* events and must stay strictly
  // manual (buttons + swipe), so an unattended page can never manufacture them.
  // todays_daejeon_view still fires from the impression effect above, because an
  // auto-shown banner genuinely was shown -- and, since ADR-047, only while the
  // card is actually on screen. No taxonomy or parameter change.
  //
  // ONE TIMER, NO STALE CLOSURES: a single setTimeout keyed on `safeIndex` -- any
  // manual prev/next/swipe changes that index, which tears this effect down and
  // schedules a fresh full interval, so "manual interaction resets the timer" is
  // structural rather than a second explicit reset path. The functional updater
  // never reads a captured index.
  //
  // NOTHING ADVANCES UNSEEN (ADR-047): the timer is scheduled only while this
  // mount is the displayed responsive one AND at least half of it is in the
  // viewport AND the tab is visible AND it is not hovered/focused AND reduced
  // motion is off. Every one of those is a dependency, so losing any of them
  // clears the timer and regaining it starts a fresh full interval rather than
  // resuming a partial one.
  useEffect(() => {
    if (count <= 1) return;
    if (!isExposed || isInteracting || isTabHidden || prefersReducedMotion) return;

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, AUTO_ADVANCE_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [safeIndex, count, isExposed, isInteracting, isTabHidden, prefersReducedMotion]);

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
      return;
    }

    // Only reached on a genuine click-through -- never for a swipe-suppressed
    // click (handled by the branch above, which returns before this point).
    if (item) {
      pushDataLayerEvent('todays_daejeon_click', {
        editorial_id: item.id,
        editorial_position: safeIndex + 1,
        editorial_url: item.href,
      });
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
      ref={sectionRef}
      aria-label={heading}
      // Auto-advance pause surface. Hover covers pointer users mid-read; the
      // capture-phase focus handlers give focus-within semantics without a CSS
      // pseudo-class, covering keyboard users on the prev/next buttons and the
      // banner link (every focusable descendant this card has). Presentation is
      // untouched -- these are behaviour-only handlers on the existing element.
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={() => setIsInteracting(false)}
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
