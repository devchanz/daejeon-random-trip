'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { RouteGuideData } from '../../lib/guide';
import { RouteGuideTimeline } from './RouteGuideTimeline';
import {
  OVERLAY_BACKDROP,
  OVERLAY_DIALOG,
  OVERLAY_STATIC_ZONE,
  ScrollContinuationCue,
  useScrollLock,
} from '../common';
import { GUIDE_PAPER } from './guideSkin';
import { RESULT_ACCENT_COLORS } from '../../config/resultAccents';
import { getDurationLabel, getPreferenceLabel } from '../../content/labels';

export interface RouteGuideModalProps {
  guideData: RouteGuideData | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const emptySubscribe = () => () => {};

/**
 * Accessible, responsive RouteGuide dialog modal.
 * Uses a React Portal to document.body to prevent containing-block trapping by ancestor transforms/animations.
 * Presents structured itinerary guidance with stop details, visit tips, and external map links.
 * Works uniformly for both direct generated routes and shared referral snapshots.
 */
export function RouteGuideModal({
  guideData,
  isOpen,
  onClose,
  className = '',
}: RouteGuideModalProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock document scroll when modal is open (shared refcounted lock -- see
  // useScrollLock.ts). Refcounted so this stacks correctly whether the modal is
  // opened from the Result Card (which is already holding its own lock) or, on
  // /r/[shareCode] (SharedRouteView), standalone with no Result overlay present.
  useScrollLock(isOpen);

  if (!isOpen || !guideData || !isMounted) {
    return null;
  }

  const durationLabel = guideData.durationType
    ? getDurationLabel(guideData.durationType)
    : null;

  const preferenceLabel = guideData.preferenceType
    ? getPreferenceLabel(guideData.preferenceType)
    : null;

  // Plain muted meta text (see header below) -- not 3 separately bordered
  // pills competing with the title. Duration is intentionally absent from
  // the stop count per the 09_ROUTE_GUIDE handoff (visit order, not a clock
  // schedule); estimatedTotalMinutes stays in the data model for the share
  // snapshot path only.
  const metaParts = [durationLabel, preferenceLabel, `총 ${guideData.stops.length}곳`].filter(
    (part): part is string => Boolean(part)
  );

  const modalContent = (
    <div
      data-testid="route-guide-overlay"
      className={`${OVERLAY_BACKDROP} bg-[#2b2520]/60 backdrop-blur-xs`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
        data-testid="route-guide-modal"
        className={`${OVERLAY_DIALOG} w-full max-w-2xl rounded-3xl border-3 border-line-soft bg-guide-paper ${className}`}
      >
        {/* Route-continuity correction: the SAME restrained card/sheet
            treatment as GuestbookComposer and RandomLogDetail -- a
            single-level `line-soft`-bordered cream sheet, one product family
            with Random Log rather than an imitation of Result's painted
            frame. Header/body/footer are direct children sharing this one
            cream surface; Result's measured accent colours
            (src/config/resultAccents.ts) are the chromatic identity, applied
            on the per-stop timeline and the mission dots below -- never as a
            generic outer-frame colour. See guideSkin.ts. */}

        {/* Modal Header: Always reachable and non-scrolling. Hierarchy is
            eyebrow (small) -> title (the strongest element) -> meta (plain
            muted text, not 3 separately bordered pills competing with the
            title and the close button).
            The header/body seam itself is now the dashed perforation --
            `#d8d0c2`, the exact value the Random Log family already uses
            for its ticket-tear motif (RandomLogDetail/GuestbookComposer/
            SharedRouteView's top strip) -- rather than a second, separate
            divider stacked under the existing one. One line, reusing an
            existing value, not a new decorative element. */}
        <header
          className={`flex flex-col gap-1.5 border-b-2 border-dashed border-[#d8d0c2] px-[6%] pt-[5%] pb-4 sm:px-[4%] ${OVERLAY_STATIC_ZONE}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-black tracking-widest text-[#ff5555] uppercase flex items-center gap-1">
              <span>🗺️</span>
              <span>DAEJEON ROUTE GUIDE</span>
            </span>
            {/* Available but visually secondary: no fill/border weight beyond
                the ordinary control tier every other icon-button in the app
                uses. */}
            <button
              type="button"
              onClick={onClose}
              aria-label="가이드 닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line-soft text-sm font-bold text-[#6b6257] hover:bg-[#faf6ee] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <h2
              id="guide-modal-title"
              className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#2b2520] break-words leading-snug"
            >
              {guideData.title}
            </h2>
            <p className="flex flex-wrap items-center gap-x-1.5 text-xs font-bold text-[#8c8273] pt-0.5">
              {metaParts.map((part, i) => (
                <React.Fragment key={`${i}-${part}`}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </p>
          </div>
        </header>

        {/* Scrollable Content Body: Strictly scrolls inside the modal. No
            background of its own -- the cream surface comes from the dialog
            itself, so the timeline can be any length without repeating a
            decorative motif (the reason this was never baked into a
            fixed-height raster in the first place). */}
        {/*
         * SCROLLBAR ARCHITECTURE CORRECTION: this used to be two nested
         * boxes where the OUTER one carried the horizontal inset AND the
         * INNER (scrolling) one inherited that same inset -- so the
         * scrollbar rendered right at the StopCards' own right edge, only
         * `pr-1.5` away from their border. Human Browser E2E read that as
         * "too close".
         *
         * Fixed by moving the inset DOWN a level instead of tuning the
         * scrollbar itself (no transform/offset hack): the OUTER box (this
         * one) is now just the `relative` cue anchor with NO horizontal
         * padding, so it spans the sheet's full usable inner width; the
         * SCROLLING box is the one that spans that full width (its
         * scrollbar therefore renders near the sheet's own right edge, well
         * clear of any card); and a NEW, non-scrolling CONTENT wrapper
         * inside it carries the actual left/right inset for the mission
         * card and the timeline. Net result: cards sit exactly where they
         * did (same `px-[6%] sm:px-[4%]` the header/footer already use), the
         * scrollbar now sits in the paper gutter beyond them, not against
         * their border.
         */}
        <div className="relative flex min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="scrollbar-subtle flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-none py-4 pr-1"
        >
          <div className="flex flex-col gap-4 px-[6%] sm:gap-5 sm:px-[4%]">
            {/* Optional Mission Card -- fully DOM/CSS now (no raster; the
                former mission-shell PNG and its `.skin-canvas` aspect lock are
                retired). Same flat paper-card language as the rest of the
                shell, on a slightly warmer fill so it still reads as its own
                moment -- restrained, and with only ONE surface (no image
                behind a DOM plate, no plate behind an image), unlike the
                raster's own baked canvas-within-a-border look it replaces.
                The small accent-dot row borrows the Result palette as the
                "whole route" identity, since a mission isn't any one stop. */}
            {guideData.mission && guideData.mission.trim().length > 0 && (
              <section
                aria-label="오늘의 여행 미션"
                data-testid="guide-mission-card"
                className="shrink-0 rounded-2xl border-2 border-line-soft bg-[#faf6ee] px-4 py-3 sm:px-5 sm:py-3.5"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-mono text-[10px] font-black uppercase leading-none tracking-wide text-[#ff5555] sm:text-xs">
                    오늘의 여행 미션
                  </h3>
                  <span aria-hidden="true" className="flex items-center gap-[3px]">
                    {RESULT_ACCENT_COLORS.map((color) => (
                      <span
                        key={color}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                </div>
                <p className="line-clamp-2 break-words text-[13px] font-bold leading-snug text-[#4a4237] sm:text-sm">
                  {guideData.mission.trim()}
                </p>
              </section>
            )}

            {/* Ordered Stop Timeline */}
            <RouteGuideTimeline
              stops={guideData.stops}
              routeId={guideData.routeId}
              zoneId={guideData.zoneId}
            />
          </div>
        </div>

        {/* Mobile-only: signals that the itinerary continues past the first
            viewport (a 3/4-stop route routinely shows only STOP 1 and part of
            STOP 2 on a phone). Delegates entirely to actual scroll/layout
            state -- see ScrollContinuationCue.tsx -- so it never assumes a
            stop count and disappears on its own once scrolled or at the end.
            Keeps the chevron here (unlike Result's fade-only cue): this is a
            genuinely opaque capped scroll area with no partial-peek of its
            own the way Result's raster canvas has. */}
        <ScrollContinuationCue containerRef={scrollRef} edgeColor={GUIDE_PAPER} className="lg:hidden" />
        </div>

        {/* Modal Footer / Close Action: Always reachable and non-scrolling.
            A plain `line-soft` divider here on purpose -- the dashed
            perforation is deliberately a ONE-TIME bridge motif near the top
            (see the header/body seam above), not a repeated theme at every
            seam in the shell. Toned down from a bordered, filled control
            (which read as an input field sitting across the end of the
            route) to a lightweight one -- full width on mobile is kept for
            the hit target, only the visual weight (fill, border thickness,
            font weight) is reduced. */}
        <footer
          className={`border-t-2 border-line-soft px-[6%] pt-3.5 pb-[5%] sm:px-[4%] flex justify-end ${OVERLAY_STATIC_ZONE}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="가이드 닫기 및 결과로 돌아가기"
            className="w-full sm:w-auto rounded-xl border border-line-soft hover:bg-[#faf6ee] py-2.5 px-6 text-xs sm:text-sm font-bold text-[#6b6257] transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
