'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Shared "is there more below?" detector for capped-height overlay scroll
 * zones (Result Quest's body canvas, Route Guide's timeline). Pure
 * scroll/layout state -- no assumption about stop count, route length, or any
 * other content shape.
 *
 * Behaviour, in order:
 *  - No overflow (content already fits) -> never shows. Covers "there is no
 *    further content" for free, on every render, not just at mount.
 *  - Overflow exists and the container is not yet scrolled near its bottom ->
 *    shows.
 *  - The instant the user scrolls past a small threshold from the top, the
 *    cue is PERMANENTLY dismissed for this mount (does not reappear if they
 *    scroll back up) -- it is a first-glance affordance, not a persistent
 *    scrollbar substitute.
 *  - Reaching the bottom also hides it (naturally covered by the "not near
 *    bottom" check, and reinforced by the dismiss latch once scrolling
 *    starts).
 *
 * Event-driven only: a scroll listener (passive), a ResizeObserver on the
 * container itself (viewport rotation / breakpoint reflow), and a
 * MutationObserver on its contents (stop count changing, reward-state swaps
 * between normal/consumed). No polling loop, no UA/device branching.
 */
export function useScrollContinuationCue<T extends HTMLElement>(
  containerRef: RefObject<T | null>
): boolean {
  const [showCue, setShowCue] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const OVERFLOW_TOLERANCE = 8;
    const DISMISS_AFTER_PX = 24;
    let dismissed = false;

    const evaluate = () => {
      if (dismissed) {
        setShowCue(false);
        return;
      }
      const hasOverflow = el.scrollHeight - el.clientHeight > OVERFLOW_TOLERANCE;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - OVERFLOW_TOLERANCE;
      setShowCue(hasOverflow && !nearBottom);
    };

    const handleScroll = () => {
      if (!dismissed && el.scrollTop > DISMISS_AFTER_PX) {
        dismissed = true;
        setShowCue(false);
        return;
      }
      evaluate();
    };

    evaluate();

    el.addEventListener('scroll', handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(evaluate);
    resizeObserver.observe(el);
    const mutationObserver = new MutationObserver(evaluate);
    mutationObserver.observe(el, { childList: true, subtree: true, attributes: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [containerRef]);

  return showCue;
}
