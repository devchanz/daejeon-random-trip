'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { RouteResult } from '../../../lib/random';
import type { RerollRewardState } from '../../../lib/experience';
import {
  formatShareTitle,
  formatShareText,
  getShareUrl,
  triggerShare,
} from '../../../lib/share';
import { skinBandStyle } from '../../common';
import { resolveResultSkin } from './resultSkin';

export interface ResultActionsProps {
  result: RouteResult;
  rerollReward?: RerollRewardState;
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
 * DOM buttons are TRANSPARENT HITBOXES ONLY.
 *
 * The band is sized by the RASTER, not by the buttons: an aspect-locked container
 * plus `.skin-canvas` (`background-size: 100% auto`) renders it at exactly 1.0x.
 * The buttons are then positioned onto the measured wells, so their height is
 * whatever the painted well is -- which at small card widths is below a 44px
 * touch target. That is the accepted consequence of requiring zero stretch and is
 * flagged rather than worked around.
 *
 * Precedent: SlotAnchor's primary CTA is composed the same way -- a transparent
 * DOM control over the painted red button of the slot chassis. The raster draws the button
 * background, border, pixel depth and colours, so nothing here may redraw them --
 * no background, no border, no shadow, no rounding. The DOM owns semantics,
 * focus, the click handler, the accessible name and the hitbox; each button is
 * absolutely positioned onto its painted well.
 */
const ACTION_BASE =
  'absolute flex items-center justify-center bg-transparent border-0 shadow-none px-2 text-center font-black outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[#ffb800] active:translate-y-[1px]';
/** Label sizes track the band, which is itself width-driven. */
const ACTION_LABEL = 'text-[clamp(11px,3.1vw,15px)]';
/** White label on the red/blue wells, with a guard so it can never vanish. */
const ON_WELL_LIGHT = 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]';

/**
 * Non-scrolling Result action footer. At most three actions, identical height:
 * primary (이 코스로 가보기, full width) + a secondary row (내 루트 공유하기 /
 * 다시 뽑기). Share logic (state, handler, 4 render branches) is lifted verbatim
 * from the deleted ResultSheet -- same routeId-keyed state, same 2s copied-timer.
 *
 * 다시 뽑기 is one CTA over the existing, unmodified reward machine:
 *   locked    -> opens the Random Log composer (which explains the incentive)
 *   available -> executes the rewarded reroll
 *   consumed  -> not rendered (share then spans the full row)
 * rerollSession.ts and its one-rewarded-reroll-per-tab-session guard are untouched.
 */
export function ResultActions({
  result,
  rerollReward = 'locked',
  onOpenGuestbook,
  onExecuteReroll,
  onOpenRouteGuide,
  className = '',
}: ResultActionsProps) {
  const [shareState, setShareState] = useState<ShareState | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const isCurrentRoute = shareState?.routeId === result.id;
  const shareStatus = isCurrentRoute ? (shareState?.status ?? 'idle') : 'idle';
  const shareError = isCurrentRoute ? (shareState?.error ?? null) : null;
  const cachedShareCode = isCurrentRoute ? (shareState?.shareCode ?? null) : null;

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
      setShareState({
        routeId: result.id,
        shareCode: activeShareCode,
        status: 'idle',
        error: null,
      });
    }
  };

  const showReroll = rerollReward !== 'consumed';
  // One renderer for both states: the state selects the complete approved raster
  // and the well layout. Nothing else about the rendering differs.
  const skin = resolveResultSkin(rerollReward);

  // Label colour is chosen to read against the PAINTED well beneath it:
  // red well -> white, cream well -> dark, blue well -> white.
  const renderShareCTA = () => {
    const cls = `${ACTION_BASE} ${ACTION_LABEL} ${skin.wells.share}`;

    if (shareStatus === 'loading') {
      return (
        <button type="button" disabled aria-disabled="true" className={`${cls} cursor-wait text-[#7d7364]`}>
          생성 중...
        </button>
      );
    }
    if (shareStatus === 'copied') {
      // Text-only feedback: a fill here would cover the painted well.
      return (
        <button type="button" aria-label="링크 복사 완료" className={`${cls} text-[#047857]`}>
          ✨ 복사 완료!
        </button>
      );
    }
    if (shareStatus === 'error') {
      return (
        <button type="button" onClick={handleShare} aria-label="공유 다시 시도" className={`${cls} cursor-pointer text-[#b91c1c]`}>
          ⚠️ 다시 시도
        </button>
      );
    }
    return (
      <button type="button" onClick={handleShare} aria-label="내 루트 공유하기" className={`${cls} cursor-pointer text-[#2b2520]`}>
        내 루트 공유하기
      </button>
    );
  };

  const renderRerollCTA = () => {
    if (!showReroll || !skin.wells.reroll) {
      return null;
    }
    const handleClick = rerollReward === 'locked' ? onOpenGuestbook : onExecuteReroll;
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="다시 뽑기"
        className={`${ACTION_BASE} ${ACTION_LABEL} ${skin.wells.reroll} cursor-pointer ${ON_WELL_LIGHT}`}
      >
        다시 뽑기
      </button>
    );
  };

  return (
    <div
      data-testid="result-actions"
      style={skinBandStyle(skin.actions.mobile, skin.actions.desktop)}
      className={`skin-canvas relative w-full shrink-0 ${skin.actionsAspect} ${className}`}
    >
      {/* The approved raster is the ONLY visual layer here: it draws both/all
          wells, the surrounding cream paper and the cobalt bottom frame. No
          background, container, border, shadow, rails or rounding are
          reconstructed in CSS, and the band is aspect-locked so it renders at
          1.0x with zero stretch.

          No seam compensation is needed: each state's header, body and action
          bands are Y-only slices of ONE master at a shared x-origin, verified to
          stack back into that master pixel-for-pixel, so the joins are exact.

          Width basis is shared by construction: the dialog sets
          `w-[min(672px,calc(100vw-32px))]`, and the header band, the scroll
          container and this band are all `w-full` of that same box with no
          padding or independent max-width, so the body and action rasters
          resolve against an identical content width. */}
      <button
        type="button"
        onClick={onOpenRouteGuide}
        aria-label="이 코스로 가보기 (상세 여행 가이드 열기)"
        className={`${ACTION_BASE} ${ACTION_LABEL} ${skin.wells.primary} cursor-pointer ${ON_WELL_LIGHT}`}
      >
        이 코스로 가보기
      </button>

      {renderShareCTA()}
      {renderRerollCTA()}

      {/* Error text is announced but must not cover the painted wells, so it sits
          under the band rather than inside it. */}
      {shareError && (
        <p role="alert" aria-live="polite" className="absolute inset-x-0 -bottom-5 text-center text-[11px] font-black text-[#b91c1c]">
          ⚠️ {shareError}
        </p>
      )}
    </div>
  );
}
