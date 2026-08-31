'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { RouteResult } from '../../lib/random';
import type { RerollRewardState } from '../../lib/experience';
import {
  formatShareTitle,
  formatShareText,
  getShareUrl,
  triggerShare,
} from '../../lib/share';
import {
  DURATION_DISPLAY_LABELS,
  PREFERENCE_DISPLAY_LABELS,
} from './SetupArea';

export interface ResultSheetProps {
  result: RouteResult;
  rerollReward?: RerollRewardState;
  hasLoggedCurrentResult?: boolean;
  onOpenGuestbook?: () => void;
  onExecuteReroll?: () => void;
  onOpenRouteGuide?: () => void;
  className?: string;
}

interface ShareState {
  routeId: string;
  shareCode?: string | null;
  status: 'idle' | 'loading' | 'copied' | 'error';
  error?: string | null;
}

/**
 * Visual V4 ResultSheet component.
 * Renders the variable-length RouteResult as an authentic printed paper travel itinerary sheet / receipt ticket.
 * Features tear-line ticket perforation, stamp badges, route timeline with step nodes,
 * pinned mission card with washi tape, and action CTAs including the Referral Share, Route Guide, and Guestbook -> Reroll loop.
 */
export function ResultSheet({
  result,
  rerollReward = 'locked',
  hasLoggedCurrentResult = false,
  onOpenGuestbook,
  onExecuteReroll,
  onOpenRouteGuide,
  className = '',
}: ResultSheetProps) {
  // Client-side share state strictly keyed by routeId
  const [shareState, setShareState] = useState<ShareState | null>(null);

  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  // Derived state: automatically resets to idle/null if result.id does not match the cached routeId
  const isCurrentRoute = shareState?.routeId === result.id;
  const shareStatus = isCurrentRoute ? (shareState?.status ?? 'idle') : 'idle';
  const shareError = isCurrentRoute ? (shareState?.error ?? null) : null;
  const cachedShareCode = isCurrentRoute ? (shareState?.shareCode ?? null) : null;

  const durationLabel = result.durationType
    ? DURATION_DISPLAY_LABELS[result.durationType] ?? result.durationType
    : null;

  const preferenceLabel = result.preference
    ? PREFERENCE_DISPLAY_LABELS[result.preference] ?? result.preference
    : null;

  const stops = result.stops || [];

  const handleShare = async () => {
    if (shareStatus === 'loading') return;

    setShareState({
      routeId: result.id,
      shareCode: cachedShareCode,
      status: 'loading',
      error: null,
    });

    let activeShareCode = cachedShareCode;

    // 1. If shareCode is not yet cached for this routeResult.id, request snapshot creation
    if (!activeShareCode) {
      try {
        const response = await fetch('/api/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceRouteId: result.id,
            zoneId: result.zoneId,
            durationType: result.durationType,
            preferenceType: result.preference,
            title: result.title,
            stops: stops.map((s) => ({
              order: s.order,
              placeId: s.placeId,
              name: s.name,
              category: s.category,
              stayDurationMin: s.stayDurationMin,
              address: s.address,
              mapLinks: s.mapLinks,
              tips: s.tips,
            })),
            mission: result.mission,
            estimatedTotalMinutes: result.estimatedTotalMinutes,
            schemaVersion: 1,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success || !data?.shareCode) {
          const errText = data?.error || '공유 링크 생성에 실패했습니다.';
          setShareState({
            routeId: result.id,
            shareCode: null,
            status: 'error',
            error: errText,
          });
          return;
        }

        activeShareCode = data.shareCode as string;
      } catch {
        setShareState({
          routeId: result.id,
          shareCode: null,
          status: 'error',
          error: '네트워크 오류가 발생했습니다.',
        });
        return;
      }
    }

    // 2. Invoke Web Share API with clipboard copy fallback
    const shareTitle = formatShareTitle(result.title);
    const shareText = formatShareText(result.title, stops.length);
    const shareUrl = getShareUrl(activeShareCode);

    const shareResult = await triggerShare({
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    });

    if (shareResult.status === 'copied') {
      setShareState({
        routeId: result.id,
        shareCode: activeShareCode,
        status: 'copied',
        error: null,
      });
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = setTimeout(() => {
        setShareState((prev) =>
          prev && prev.routeId === result.id ? { ...prev, status: 'idle' } : prev
        );
      }, 2000);
    } else if (shareResult.status === 'error') {
      setShareState({
        routeId: result.id,
        shareCode: activeShareCode,
        status: 'error',
        error: shareResult.error,
      });
    } else {
      // 'shared' or 'canceled' -> return to idle
      setShareState({
        routeId: result.id,
        shareCode: activeShareCode,
        status: 'idle',
        error: null,
      });
    }
  };

  const renderShareCTA = () => {
    if (shareStatus === 'loading') {
      return (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] py-2.5 px-3 text-center text-xs font-bold text-[#7d7364] cursor-wait"
        >
          생성 중...
        </button>
      );
    }

    if (shareStatus === 'copied') {
      return (
        <button
          type="button"
          aria-label="링크 복사 완료"
          className="w-full rounded-xl border-2 border-[#2b2520] bg-[#10b981] py-2.5 px-3 text-center text-xs font-black text-white shadow-retro-xs transition-all"
        >
          ✨ 링크 복사 완료!
        </button>
      );
    }

    if (shareStatus === 'error') {
      return (
        <button
          type="button"
          onClick={handleShare}
          aria-label="공유 다시 시도"
          className="w-full rounded-xl border-2 border-[#ff5555] bg-[#fff5f5] py-2.5 px-3 text-center text-xs font-bold text-[#ff5555] shadow-retro-xs hover:bg-[#ffebeb] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
        >
          ⚠️ 다시 시도
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label="내 루트 공유하기"
        className="w-full rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] hover:bg-[#f0eae0] py-2.5 px-3 text-center text-xs font-bold text-[#2b2520] shadow-retro-xs cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
      >
        내 루트 공유하기
      </button>
    );
  };

  // Random Log CTA and reroll CTA are independent concerns: Log CTA reflects
  // whether *this* Result has been logged yet; reroll CTA reflects *session*
  // reward state alone. Previously these were one switch on rerollReward,
  // which made the composer unreachable forever once the reward was consumed.
  const renderRandomLogCTA = () => {
    if (hasLoggedCurrentResult) {
      return (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full rounded-xl border-2 border-[#d8d0c2] bg-[#faf6ee] py-2.5 px-3 text-center text-xs font-bold text-[#8e8477] cursor-not-allowed transition-none"
        >
          랜덤 로그 작성 완료
        </button>
      );
    }

    // Only the first-ever log (reward still 'locked') carries the reroll incentive
    // copy -- once the reward has been claimed or spent, later Results can still
    // be logged, just without promising another reroll.
    if (rerollReward === 'locked') {
      return (
        <button
          type="button"
          onClick={onOpenGuestbook}
          aria-label="랜덤 로그 남기고 1회 더 뽑기"
          className="w-full rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] hover:bg-[#f0eae0] py-2.5 px-3 text-center text-xs font-bold text-[#2b2520] shadow-retro-xs cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
        >
          랜덤 로그 남기고 1회 더 뽑기
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onOpenGuestbook}
        aria-label="랜덤 로그 남기기"
        className="w-full rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] hover:bg-[#f0eae0] py-2.5 px-3 text-center text-xs font-bold text-[#2b2520] shadow-retro-xs cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
      >
        랜덤 로그 남기기
      </button>
    );
  };

  // Hidden entirely once 'locked' (no incentive to show yet -- the Log CTA above
  // carries that copy) or 'consumed' (the reward is gone; a disabled "완료" button
  // would just be dead UI weight on every later Result for the rest of the session).
  const renderRerollCTA = () => {
    if (rerollReward !== 'available') {
      return null;
    }

    return (
      <button
        type="button"
        onClick={onExecuteReroll}
        aria-label="리워드 1회 더 뽑기 실행"
        className="col-span-2 w-full rounded-xl border-2 border-[#2b2520] bg-[#ff5555] hover:bg-[#ff3b3b] py-2.5 px-3 text-center text-xs font-black text-white shadow-retro-xs cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] motion-safe:animate-pulse"
      >
        🎰 1회 더 뽑기
      </button>
    );
  };

  return (
    <article
      data-testid="result-sheet"
      className={`relative w-full rounded-3xl border-3 border-[#2b2520] bg-[#fffef9] p-5 sm:p-7 shadow-retro-xl overflow-hidden animate-ticket-entrance ${className}`}
    >
      {/* Top Printed Ticket Perforation / Notches */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
      />

      <div className="flex flex-col gap-6 pt-1">
        {/* 1. Result Ticket Header */}
        <header className="flex flex-col gap-2.5 border-b-2 border-[#2b2520] pb-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-black tracking-widest text-[#ff5555] uppercase flex items-center gap-1">
              <span>🎫</span>
              <span>DAEJEON RANDOM TRIP TICKET</span>
            </span>
            <span className="rounded-full border-2 border-[#2b2520] bg-[#10b981] px-3 py-0.5 text-[11px] font-black text-white shadow-retro-xs">
              추천 완료
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-xl font-black tracking-tight text-[#2b2520] sm:text-2xl">
              추천 대전 여행 코스
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6b6257]">
              {durationLabel && (
                <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                  {durationLabel}
                </span>
              )}
              {preferenceLabel && (
                <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                  {preferenceLabel}
                </span>
              )}
              <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5 font-black text-[#2b2520] shadow-retro-xs">
                총 {stops.length}곳
              </span>
            </div>
          </div>
        </header>

        {/* 2. Vertical Route Timeline (Variable stops) */}
        <ol
          aria-label="여행 코스 상세 일정"
          className="flex flex-col"
        >
          {stops.map((stop, index) => {
            const isLast = index === stops.length - 1;
            const stopNumber = stop.order ?? index + 1;
            const hasTravelTime =
              typeof stop.travelToNextMin === 'number' && stop.travelToNextMin > 0;

            return (
              <li
                key={`${stop.placeId || stop.name}-${stopNumber}`}
                data-testid={`route-stop-row-${index}`}
                className="relative flex items-start gap-3.5 sm:gap-4"
              >
                {/* Timeline Axis: Step Number Stamp + Connector Line */}
                <div className="flex flex-col items-center self-stretch">
                  <div className="z-10 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#2b2520] bg-[#2b2520] text-xs sm:text-sm font-black text-white shadow-retro-xs ring-4 ring-[#fffef9]">
                    {stopNumber}
                  </div>
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="w-0.5 grow min-h-[48px] bg-[#d8d0c2] my-1 border-l-2 border-dashed border-[#b8b0a2]"
                    />
                  )}
                </div>

                {/* Stop Content Details */}
                <div className={`flex-1 ${isLast ? 'pb-1' : 'pb-5'} pt-0.5`}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#ff5555]">
                      STOP {stopNumber}
                    </span>
                    {stop.category && (
                      <span className="rounded-md border border-[#e4dcce] bg-[#faf6ee] px-2 py-0.5 text-[11px] font-bold text-[#6b6257]">
                        {stop.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#2b2520] break-words leading-snug">
                    {stop.name}
                  </h3>

                  {typeof stop.stayDurationMin === 'number' && stop.stayDurationMin > 0 && (
                    <p className="mt-1 text-xs font-bold text-[#7d7364]">
                      체류 예상 약 {stop.stayDurationMin}분
                    </p>
                  )}

                  {/* Travel duration to next stop (only rendered if explicitly provided) */}
                  {!isLast && hasTravelTime && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#e4dcce] bg-[#faf6ee] px-2.5 py-1 text-xs font-bold text-[#6b6257]">
                      <span aria-hidden="true">&darr;</span>
                      <span>다음 장소까지 이동 약 {stop.travelToNextMin}분</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* 3. Optional Mission Section (Pinned Memo Card with Washi Tape) */}
        {result.mission && result.mission.trim().length > 0 && (
          <section
            aria-label="여행 미션"
            data-testid="result-mission-section"
            className="relative rounded-2xl border-2 border-dashed border-[#ffb800] bg-[#fffdf0] p-4 shadow-retro-sm -rotate-0.5"
          >
            {/* Washi tape on mission card */}
            <div
              aria-hidden="true"
              className="washi-tape absolute -top-2.5 left-6 h-5 w-18 rotate-1"
            />

            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-md border border-[#2b2520] bg-[#ffb800] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#2b2520]">
                MISSION
              </span>
              <h4 className="text-xs font-black text-[#92400e]">
                오늘의 여행 미션
              </h4>
            </div>
            <p className="text-sm font-bold text-[#4a4237] leading-relaxed break-words">
              {result.mission.trim()}
            </p>
          </section>
        )}

        {/* Share Error Alert (if any) */}
        {shareError && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-xl border-2 border-[#ff5555] bg-[#fef2f2] p-2.5 text-xs font-black text-[#991b1b]"
          >
            ⚠️ {shareError}
          </div>
        )}

        {/* 4. CTA Action Layout Boundary */}
        <div
          data-testid="result-cta-boundary"
          className="flex flex-col gap-2.5 border-t-2 border-[#2b2520] pt-5"
        >
          {/* Primary CTA: RouteGuide Transition */}
          <button
            type="button"
            onClick={onOpenRouteGuide}
            aria-label="이 코스로 가보기 (상세 여행 가이드 열기)"
            className="w-full rounded-2xl border-2 border-[#2b2520] bg-[#ff5555] hover:bg-[#ff3b3b] py-3.5 px-4 text-center text-sm font-black text-white shadow-retro-xs cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            이 코스로 가보기
          </button>

          {/* Secondary CTA row: Share + Random Log side by side; the reroll CTA
              (only present while rerollReward === 'available') spans both
              columns below them, rather than squeezing three buttons into one
              row on narrow widths. */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {renderShareCTA()}
            {renderRandomLogCTA()}
            {renderRerollCTA()}
          </div>
        </div>
      </div>
    </article>
  );
}
