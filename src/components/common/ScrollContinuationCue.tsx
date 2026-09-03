'use client';

import React, { type RefObject } from 'react';
import { useScrollContinuationCue } from './scrollContinuation';

export interface ScrollContinuationCueProps {
  /** The scrollable element to watch (the overlay's own internal scroll zone). */
  containerRef: RefObject<HTMLElement | null>;
  /** The surface colour behind the cue, so the fade blends into it exactly. */
  edgeColor: string;
  className?: string;
  /**
   * Whether to render the small stepped-bar chevron on top of the fade.
   * Default true. Result's mobile correction turns this off: a fade-only
   * mask reads as natural content continuation (a modern, native pattern),
   * while an explicit floating chevron read as a separately bolted-on UI
   * element on a surface that already leans on partial-peek as its primary
   * affordance. Route Guide (a genuinely opaque capped scroll area with no
   * partial-peek of its own) keeps the chevron.
   */
  showChevron?: boolean;
  /** Height of the cue's own hit-free zone. Defaults to enough room for the
   * fade + chevron; a fade-only cue can use a shorter, lighter one. */
  heightClassName?: string;
}

/**
 * ONE shared "more below" affordance for capped-height overlay scroll zones
 * (Result Quest's body canvas, Route Guide's timeline) -- not a separate
 * ad-hoc arrow per surface. Distinct in both look and meaning from the
 * landing hero's `#mobile-right-rail` quick-jump anchor in page.tsx: that is
 * SECTION NAVIGATION (a real link, a real tap target, a bordered button
 * shell); this is passive CONTENT CONTINUATION signalling (aria-hidden,
 * pointer-events-none, no tap target at all). They intentionally share the
 * same stepped-bar chevron geometry so the product reads as one visual
 * language, while staying behaviourally unrelated.
 *
 * Purely decorative and non-blocking: absolutely positioned over the LAST
 * few pixels of the scroll viewport (never the static header/footer/action
 * zones, which are always flex siblings outside the scrolling wrapper this
 * is nested in), zero layout height, `pointer-events-none` so it can never
 * swallow a tap even on the rare frame where content sits directly under it.
 *
 * Visibility is entirely delegated to `useScrollContinuationCue` -- no
 * "assume N stops" logic here.
 */
export function ScrollContinuationCue({
  containerRef,
  edgeColor,
  className = '',
  showChevron = true,
  heightClassName = 'h-11',
}: ScrollContinuationCueProps) {
  const showCue = useScrollContinuationCue(containerRef);

  if (!showCue) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex ${heightClassName} flex-col items-center justify-end overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `linear-gradient(to top, ${edgeColor} 0%, ${edgeColor}00 100%)` }}
      />
      {showChevron && (
        <div className="relative flex flex-col items-center gap-[2px] pb-1.5 motion-safe:animate-scroll-cue-bob">
          <span className="h-[2.5px] w-[12px] rounded-[1px] bg-[#2b2520]/40" />
          <span className="h-[2.5px] w-[7px] rounded-[1px] bg-[#2b2520]/40" />
          <span className="h-[2.5px] w-[3px] rounded-[1px] bg-[#2b2520]/40" />
        </div>
      )}
    </div>
  );
}
