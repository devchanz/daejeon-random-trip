'use client';

import React, { useEffect, useRef } from 'react';
import type { ExperienceState, RerollRewardState } from '../../lib/experience';
import { ResultSheet } from './ResultSheet';

export interface ResultAreaProps {
  state?: ExperienceState;
  revealStage?: 'hidden' | 'peek' | 'revealed' | 'minimized';
  rerollReward?: RerollRewardState;
  onOpenGuestbook?: () => void;
  onExecuteReroll?: () => void;
  onOpenRouteGuide?: () => void;
  onMinimize?: () => void;
  isNestedOverlayOpen?: boolean;
  className?: string;
}

/**
 * ResultArea — centered focus Result Card overlay (ADR-008).
 *
 * Renders as an in-flow `fixed` overlay, not a Portal: MainExperience is mounted
 * twice (desktop + mobile, gated by `hidden lg:flex` / `lg:hidden` in page.tsx), and
 * a Portal to document.body would escape that responsive gate — the hidden
 * breakpoint's card could render on top of the other layout. An in-flow `fixed`
 * element stays correctly suppressed by its ancestor's `display:none`.
 *
 * Mounts once phase === 'result' AND revealStage is 'revealed' OR 'minimized' — never
 * during Q1/Q2/READY/SPINNING/peek, so pre-result states stay structurally unaffected
 * (position-lock, ADR-020 scroll-tail).
 *
 * --- Reveal vs. minimize (결과 접기) ---
 * 'revealed': centered overlay, background interaction blocked, body scroll locked.
 * 'minimized': the overlay is hidden (`display:none`, not unmounted) so ResultSheet's
 * local share state survives; background interaction and body scroll are fully
 * restored. MainExperience renders a persistent "내 여행 티켓" affordance while
 * minimized that calls back in to 'revealed' with `state.result` completely
 * unchanged — no route regeneration, no reducer dispatch. See MainExperience.tsx's
 * handleMinimizeResult / handleReopenResult.
 *
 * Minimizing is 결과 접기, not close/delete: Result data is never discarded. The
 * backdrop still has no onClick-to-dismiss handler — the only way out of 'revealed'
 * is the explicit 결과 접기 control (or Escape, which does the same thing) — because
 * accidental backdrop clicks should not discard the user's place in the flow.
 *
 * Focus: moves onto the dialog container itself whenever it becomes revealed (first
 * reveal, reopen from minimized, and re-activation after a nested overlay closes are
 * all covered the same way), so a screen reader announces the Result before the first
 * Tab lands naturally on the first interactive control. Moving focus to the reopen
 * affordance on minimize is MainExperience's responsibility, since it owns that button;
 * see its revealStage-keyed effect.
 *
 * --- Keyboard ownership vs. nested overlays (RouteGuideModal, GuestbookComposer) ---
 * Result's Escape handler and Tab focus-containment are only active when Result is the
 * *topmost* interactive layer: `isRevealed && !isNestedOverlayOpen`. Without this, Result's
 * window-level Escape listener fires no matter what has focus (minimizing Result out from
 * under an open RouteGuide/Guestbook), and its Tab trap cycles focus among Result's own
 * buttons forever if the button that opened the nested overlay (still mounted inside
 * Result's card) still has focus -- keyboard users can never tab into the nested overlay.
 * `isNestedOverlayOpen` is MainExperience's `isGuestbookOpen || isRouteGuideOpen`; when it
 * drops back to false, this effect re-runs, which both re-attaches the Tab trap and moves
 * focus back onto the dialog container -- Result stays revealed throughout; it is never
 * minimized as a side effect of a nested overlay opening or closing.
 */
export function ResultArea({
  state,
  revealStage = 'hidden',
  rerollReward = 'locked',
  onOpenGuestbook,
  onExecuteReroll,
  onOpenRouteGuide,
  onMinimize,
  isNestedOverlayOpen = false,
  className = '',
}: ResultAreaProps) {
  const isMounted =
    state?.phase === 'result' &&
    Boolean(state.result) &&
    (revealStage === 'revealed' || revealStage === 'minimized');
  const isRevealed = isMounted && revealStage === 'revealed';
  // Result owns Escape + Tab containment only while it is the topmost interactive layer.
  const hasKeyboardOwnership = isRevealed && !isNestedOverlayOpen;

  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll while the Result Card is revealed (RouteGuideModal precedent).
  // Restored automatically the instant revealStage leaves 'revealed', minimize included.
  useEffect(() => {
    if (!isRevealed) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isRevealed]);

  // Contain focus within the card: move focus onto the dialog container itself (N3 --
  // not the first control) whenever Result (re-)gains keyboard ownership -- first reveal,
  // every reopen from minimized, and re-activation after a nested overlay closes are all
  // covered by the same [hasKeyboardOwnership] dependency. Wrap Tab at the card's edges.
  // Suspended entirely while a nested overlay (RouteGuideModal / GuestbookComposer) is
  // open, so keyboard users can Tab out of Result and into it.
  useEffect(() => {
    if (!hasKeyboardOwnership) return;

    const container = dialogRef.current;
    if (!container) return;

    container.focus();

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const current = getFocusable();
      if (current.length === 0) {
        event.preventDefault();
        return;
      }

      const first = current[0];
      const last = current[current.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [hasKeyboardOwnership]);

  // Escape minimizes (결과 접기), matching RouteGuideModal's Escape precedent now that an
  // explicit, non-destructive exit exists. Result data is never discarded by this path.
  // Suspended while a nested overlay is open, so Escape there is owned solely by that
  // overlay (e.g. RouteGuideModal's own Escape-to-close) instead of also minimizing Result.
  useEffect(() => {
    if (!hasKeyboardOwnership) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onMinimize?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasKeyboardOwnership, onMinimize]);

  if (!isMounted || !state?.result) {
    return null;
  }

  return (
    <div
      data-testid="result-card-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#2b2520]/60 backdrop-blur-xs animate-reveal-fade-in ${
        isRevealed ? '' : 'hidden'
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="추천 결과 (Result Card)"
        tabIndex={-1}
        data-testid="result-card"
        className={`relative flex w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] flex-col gap-2 overflow-y-auto overscroll-contain outline-none my-auto ${className}`}
      >
        {/* 결과 접기 control -- the only way out of 'revealed' besides Escape. Deliberately
            outside ResultSheet, which stays untouched. */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onMinimize}
            data-testid="result-minimize-button"
            aria-label="결과 접기"
            className="rounded-full border-2 border-[#2b2520] bg-[#fffef9] px-3 py-1.5 text-xs font-black text-[#2b2520] shadow-retro-xs cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            결과 접기 ▾
          </button>
        </div>

        <ResultSheet
          result={state.result}
          rerollReward={rerollReward}
          onOpenGuestbook={onOpenGuestbook}
          onExecuteReroll={onExecuteReroll}
          onOpenRouteGuide={onOpenRouteGuide}
        />
      </div>
    </div>
  );
}
