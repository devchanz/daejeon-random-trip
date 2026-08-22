'use client';

interface ResultAreaProps {
  className?: string;
}

/**
 * ResultArea layout boundary.
 * Provides a minimal mount boundary for the upcoming Overlapping Inline Result Sheet
 * without rendering premature result UI, mock stops, or actions.
 */
export function ResultArea({ className = '' }: ResultAreaProps) {
  return (
    <section
      aria-label="추천 결과 영역 (Result Area)"
      className={`w-full ${className}`}
    >
      {/* Layout boundary reserved for the overlapping inline result sheet */}
    </section>
  );
}
