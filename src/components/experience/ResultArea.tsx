'use client';

import React from 'react';
import type { ExperienceState } from '../../lib/experience';
import { ResultSheet } from './ResultSheet';

/**
 * Overlap offset class applied to the ResultSheet wrapper.
 *
 * Spacing / offset configurations for quick comparison:
 * - No overlap:       'mt-0' (Result sits 24px below SlotAnchor due to parent gap-6)
 * - Flush:            '-mt-6' (Result touches the bottom edge of SlotAnchor)
 * - Slight overlap:   '-mt-8 sm:-mt-10' (Default: pulls sheet ~8px-16px over SlotAnchor's lower chassis)
 * - Stronger overlap: '-mt-14 sm:-mt-16' (Pulls sheet ~32px-40px over SlotAnchor's lower chassis)
 *
 * Note: MainExperience has `gap-6` (24px) between child elements.
 * A negative top margin of `-mt-8` on mobile offsets the 24px gap by 8px,
 * creating a safe, subtle 8px overlap. On desktop (`sm:-mt-10`), it offsets by 16px.
 * This ensures the top of ResultSheet visually overlaps only the bottom chassis edge
 * while keeping all reel windows and slot buttons fully accessible and visible.
 */
export const RESULT_OVERLAP_CLASS = '-mt-8 sm:-mt-10';

export interface ResultAreaProps {
  state?: ExperienceState;
  className?: string;
  overlapClass?: string;
  ref?: React.Ref<HTMLElement>;
}

/**
 * ResultArea layout boundary.
 * Renders the Overlapping Inline Result Sheet once the state transitions to RESULT.
 * Sits directly following SlotAnchor in DOM flow while visually overlapping its lower chassis.
 * Provides a dedicated responsive scroll-margin-top for viewport choreography after user-triggered spin.
 */
export const ResultArea = React.forwardRef<HTMLElement, ResultAreaProps>(
  function ResultArea(
    { state, className = '', overlapClass = RESULT_OVERLAP_CLASS },
    ref
  ) {
    const isResult = state?.phase === 'result' && Boolean(state.result);

    if (!isResult || !state.result) {
      return (
        <section
          ref={ref}
          aria-label="추천 결과 영역 (Result Area)"
          data-testid="result-area-boundary"
          className={`hidden ${className}`}
          aria-hidden="true"
        />
      );
    }

    return (
      <section
        ref={ref}
        aria-label="추천 결과 영역 (Result Area)"
        data-testid="result-area-boundary"
        className={`relative z-40 w-full scroll-mt-20 sm:scroll-mt-24 ${overlapClass} ${className}`}
      >
        <ResultSheet result={state.result} />
      </section>
    );
  }
);
