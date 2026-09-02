'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { RouteGuideData } from '../../lib/guide';
import { RouteGuideTimeline } from './RouteGuideTimeline';
import {
  OVERLAY_BACKDROP,
  OVERLAY_DIALOG,
  OVERLAY_STATIC_ZONE,
  skinBandStyle,
  useScrollLock,
} from '../common';
import {
  GUIDE_BODY_STRIP,
  GUIDE_FOOTER_BAND,
  GUIDE_HEADER_BAND,
  GUIDE_MISSION_SHELL_ASPECT,
  GUIDE_MISSION_SHELL_KEY,
  GUIDE_PAPER,
} from './guideSkin';

export interface RouteGuideModalProps {
  guideData: RouteGuideData | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const emptySubscribe = () => () => {};

const DURATION_LABELS: Record<string, string> = {
  half: '반나절',
  full: '하루종일',
};

const PREFERENCE_LABELS: Record<string, string> = {
  anything: '아무거나',
  food: '먹방',
  walk: '산책',
  photo: '사진',
};

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
    ? DURATION_LABELS[guideData.durationType] ?? guideData.durationType
    : null;

  const preferenceLabel = guideData.preferenceType
    ? PREFERENCE_LABELS[guideData.preferenceType] ?? guideData.preferenceType
    : null;

  const modalContent = (
    <div
      data-testid="route-guide-overlay"
      className={`${OVERLAY_BACKDROP} bg-[#2b2520]/60 backdrop-blur-xs animate-fade-in`}
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
        className={`${OVERLAY_DIALOG} w-full max-w-2xl animate-modal-entrance ${className}`}
      >
        {/* The approved skin bands carry the cobalt frame, its outline and the
            rounded corners, so the DOM frame (rounded-3xl border-3 shadow-retro-xl)
            and the dashed perforation strip were removed rather than drawn on top
            of the artwork. */}

        {/* Modal Header: Always reachable and non-scrolling */}
        <header
          style={skinBandStyle(GUIDE_HEADER_BAND.mobile, GUIDE_HEADER_BAND.desktop)}
          className={`skin-band flex flex-col gap-2 px-[6%] pt-[5%] pb-4 sm:px-[4%] ${OVERLAY_STATIC_ZONE}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-black tracking-widest text-[#ff5555] uppercase flex items-center gap-1">
              <span>🗺️</span>
              <span>DAEJEON ROUTE GUIDE</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="가이드 닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2b2520] bg-white text-sm font-black text-[#2b2520] shadow-retro-xs hover:bg-[#faf6ee] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6b6257] pt-0.5">
              {durationLabel && (
                <span className="rounded-md border-2 border-[#2b2520] bg-white px-2 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                  {durationLabel}
                </span>
              )}
              {preferenceLabel && (
                <span className="rounded-md border-2 border-[#2b2520] bg-white px-2 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                  {preferenceLabel}
                </span>
              )}
              {/* Visit order, not a clock schedule: no total or per-stop duration is
                  rendered here. Duration is intentionally absent per the 09_ROUTE_GUIDE
                  handoff; estimatedTotalMinutes stays in the data model for the share
                  snapshot path only. */}
              <span className="rounded-md border-2 border-[#2b2520] bg-white px-2 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                총 {guideData.stops.length}곳
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Body: Strictly scrolls inside the modal. The skin's
            ornament-free cream+rails strip tiles vertically behind it, so the
            timeline can be any length without repeating a decorative motif. */}
        {/*
         * Two nested boxes on purpose. The OUTER one carries the tiling cream+rails
         * strip and the horizontal inset that clears the painted cobalt rails; the
         * INNER one is the actual scroller. That way the thin scrollbar renders in
         * the cream gutter instead of painting over the cobalt frame, which is what
         * made the default OS scrollbar look intrusive here.
         */}
        <div
          style={{
            ...skinBandStyle(GUIDE_BODY_STRIP.mobile, GUIDE_BODY_STRIP.desktop),
            backgroundColor: GUIDE_PAPER,
          }}
          className="skin-strip flex min-h-0 flex-1 px-[5%] sm:px-[3.5%]"
        >
        <div
          className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-none py-4 pr-1.5 sm:gap-5"
        >
          {/* Optional Mission Card -- the skin's one fixed interior decorative
              region supplies the amber dashed shell and its sparkles, so no DOM
              border/background is drawn here.
              ASPECT-LOCKED and `.skin-canvas` (100% auto, no-repeat): the dashed
              border must never be vertically stretched, so the shell keeps its
              designed 834x163 ratio and the text is clamped to 2 lines with
              responsive type to fit inside it. */}
          {guideData.mission && guideData.mission.trim().length > 0 && (
            <section
              aria-label="오늘의 여행 미션"
              data-testid="guide-mission-card"
              style={skinBandStyle(GUIDE_MISSION_SHELL_KEY, GUIDE_MISSION_SHELL_KEY)}
              className={`skin-canvas ${GUIDE_MISSION_SHELL_ASPECT} flex w-full shrink-0 flex-col justify-center gap-0.5 px-[6%] py-[2%]`}
            >
              <h3 className="shrink-0 text-[10px] font-black uppercase leading-none tracking-wide text-[#92400e] sm:text-xs">
                오늘의 여행 미션
              </h3>
              <p className="line-clamp-2 break-words text-[11px] font-bold leading-snug text-[#4a4237] sm:text-sm">
                {guideData.mission.trim()}
              </p>
            </section>
          )}

          {/* Ordered Stop Timeline */}
          <RouteGuideTimeline stops={guideData.stops} />
        </div>
        </div>

        {/* Modal Footer / Close Action: Always reachable and non-scrolling */}
        <footer
          style={skinBandStyle(GUIDE_FOOTER_BAND.mobile, GUIDE_FOOTER_BAND.desktop)}
          className={`skin-band px-[6%] pt-3.5 pb-[5%] sm:px-[4%] flex justify-end ${OVERLAY_STATIC_ZONE}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="가이드 닫기 및 결과로 돌아가기"
            className="w-full sm:w-auto rounded-xl border-2 border-[#2b2520] bg-white hover:bg-[#f0eae0] py-2.5 px-6 text-xs sm:text-sm font-black text-[#2b2520] shadow-retro-xs transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
