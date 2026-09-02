'use client';

import { useEffect } from 'react';

/**
 * Refcounted, iOS-Safari-safe document scroll lock shared by every overlay
 * (Result Card, Route Guide Modal, Guestbook Composer).
 *
 * WHY NOT `document.body.style.overflow = 'hidden'` (the prior per-overlay
 * approach): that alone does not reliably stop the document from scrolling
 * under a fixed overlay on iOS Safari, and the app's mobile document always has
 * slack to move into (`body { min-height: 100vh }` in globals.css resolves to
 * the *layout* viewport, taller than what's visible whenever the URL bar is
 * showing). A touch-drag begun anywhere non-scrollable inside the overlay
 * (header band, action row, backdrop) could fall through to that half-locked
 * document -- the reported "content pulled past its intended boundary".
 *
 * WHY REFCOUNTED: Result stays mounted and locked underneath a nested
 * RouteGuideModal or GuestbookComposer (see ResultArea's isNestedOverlayOpen
 * contract). Two independent callers can both be "locking" at once; the
 * document must only unlock when the LAST one releases, or closing the nested
 * overlay would jump the page out from under the still-open Result Card.
 *
 * WHY MODULE-LEVEL STATE, NOT A REF: the lock is a property of the document,
 * shared across every consumer/instance, not of any one component -- a ref
 * scoped to one component's lifetime cannot coordinate with a sibling's.
 *
 * STRICT MODE: React intentionally mounts -> cleans up -> re-mounts effects
 * once in dev. That plays out here as acquire -> release -> acquire, which is
 * exactly the refcount going 0->1->0->1 -- self-balancing by construction, so
 * no special-casing is needed.
 *
 * RESTORATION: the exact prior inline `body` styles are snapshotted (not
 * assumed to be empty) and restored verbatim on the final release, together
 * with the scroll offset present at the moment the FIRST lock in this stack
 * was acquired.
 *
 * LAYOUT SHIFT: locking replaces `body`'s native scroll with `position: fixed`,
 * which on desktop removes the scrollbar and can shift/reflow content by the
 * scrollbar's width. That width is measured and added to `body`'s existing
 * `padding-right` for the duration of the lock, then removed on release, so the
 * page does not visibly shift when an overlay opens/closes on a desktop
 * viewport with a visible scrollbar.
 */

interface LockedBodyStyle {
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overflow: string;
  overscrollBehavior: string;
  paddingRight: string;
}

let lockCount = 0;
let savedScrollY = 0;
let savedStyle: LockedBodyStyle | null = null;

function getScrollbarWidth(): number {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

function acquire(): void {
  if (lockCount === 0) {
    const body = document.body;
    savedScrollY = window.scrollY;
    savedStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      paddingRight: body.style.paddingRight,
    };

    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      const currentPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }

    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
  }
  lockCount += 1;
}

function release(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && savedStyle) {
    const body = document.body;
    const restore = savedStyle;
    savedStyle = null;

    body.style.position = restore.position;
    body.style.top = restore.top;
    body.style.left = restore.left;
    body.style.right = restore.right;
    body.style.width = restore.width;
    body.style.overflow = restore.overflow;
    body.style.overscrollBehavior = restore.overscrollBehavior;
    body.style.paddingRight = restore.paddingRight;

    window.scrollTo(0, savedScrollY);
  }
}

/**
 * Locks the document scroll while `active` is true. Safe to call from multiple
 * overlays simultaneously (nested Result + RouteGuide/Guestbook) -- the
 * document only unlocks once every active caller has released.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    acquire();
    return () => {
      release();
    };
  }, [active]);
}
