'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { RouteGuideData } from '../../lib/guide';
import { formatDurationSummary } from '../../lib/guide';
import { RouteGuideTimeline } from './RouteGuideTimeline';

export interface RouteGuideModalProps {
  guideData: RouteGuideData | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const emptySubscribe = () => () => {};

const DURATION_LABELS: Record<string, string> = {
  half: '반나절',
  full: '하루',
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !guideData || !isMounted) {
    return null;
  }

  const durationLabel = guideData.durationType
    ? DURATION_LABELS[guideData.durationType] ?? guideData.durationType
    : null;

  const preferenceLabel = guideData.preferenceType
    ? PREFERENCE_LABELS[guideData.preferenceType] ?? guideData.preferenceType
    : null;

  const durationSummary = formatDurationSummary(guideData.estimatedTotalMinutes);

  const modalContent = (
    <div
      data-testid="route-guide-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#2b2520]/60 backdrop-blur-xs animate-fade-in"
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
        className={`relative w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] flex flex-col rounded-3xl border-3 border-[#2b2520] bg-[#fffef9] shadow-retro-xl overflow-hidden animate-modal-entrance my-auto ${className}`}
      >
        {/* Top Ticket Perforation Line */}
        <div
          aria-hidden="true"
          className="h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea] shrink-0"
        />

        {/* Modal Header: Always reachable and non-scrolling */}
        <header className="flex flex-col gap-2 p-4 sm:p-5 md:p-6 border-b-2 border-[#2b2520] bg-[#faf6ee] shrink-0">
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
              <span className="rounded-md border-2 border-[#2b2520] bg-white px-2 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                총 {guideData.stops.length}곳
              </span>
              {durationSummary && (
                <span className="rounded-md border-2 border-[#2b2520] bg-white px-2 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                  체류 {durationSummary}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Body: Strictly scrolls inside the modal */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 overscroll-contain">
          {/* Optional Mission Card */}
          {guideData.mission && guideData.mission.trim().length > 0 && (
            <section
              aria-label="오늘의 여행 미션"
              data-testid="guide-mission-card"
              className="rounded-2xl border-2 border-dashed border-[#ffb800] bg-[#fffdf0] p-3.5 sm:p-4 shadow-retro-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md border border-[#2b2520] bg-[#ffb800] px-2 py-0.5 text-[10px] font-black uppercase text-[#2b2520]">
                  MISSION
                </span>
                <h3 className="text-xs font-black text-[#92400e]">
                  오늘의 여행 미션
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#4a4237] leading-relaxed break-words">
                {guideData.mission.trim()}
              </p>
            </section>
          )}

          {/* Ordered Stop Timeline */}
          <RouteGuideTimeline stops={guideData.stops} />
        </div>

        {/* Modal Footer / Close Action: Always reachable and non-scrolling */}
        <footer className="p-3.5 sm:p-4 md:p-5 border-t-2 border-[#2b2520] bg-[#faf6ee] flex justify-end shrink-0">
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
