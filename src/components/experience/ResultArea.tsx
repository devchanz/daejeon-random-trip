'use client';

import type { ExperienceState } from '../../lib/experience';

interface ResultAreaProps {
  state?: ExperienceState;
  className?: string;
}

/**
 * ResultArea layout boundary.
 * Provides a minimal mount boundary for the upcoming Overlapping Inline Result Sheet
 * without rendering premature result UI, mock stops, or actions.
 */
export function ResultArea({ state, className = '' }: ResultAreaProps) {
  const isResult = state?.phase === 'result';

  return (
    <section
      aria-label="추천 결과 영역 (Result Area)"
      data-testid="result-area-boundary"
      className={`w-full ${isResult ? 'block' : 'hidden'} ${className}`}
    >
      {/* Layout boundary reserved for the overlapping inline result sheet in PR #8 */}
    </section>
  );
}
