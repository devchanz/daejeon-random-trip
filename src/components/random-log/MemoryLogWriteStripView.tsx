import React from 'react';
import { MemoryLogActionButton } from './MemoryLogActionButton';

export interface MemoryLogWriteStripViewProps {
  title: string;
  body: string;
  /** Omit BOTH `href` and `onClick` to render the row as copy only (no action). */
  ctaLabel?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * The `/random-log` board's write row (ADR-042, restyled by ADR-045).
 *
 * The board has width the right rail does not, so it keeps a real row -- copy on
 * the left, one compact action on the right (stacked on mobile) -- rather than
 * the rail's header-inline treatment. What it does NOT keep is the full-width
 * button: the action is the same `MemoryLogActionButton` ticket control the rail
 * header uses, so the two surfaces read as one family and neither competes with
 * the journey's primary CTA.
 *
 * Presentational only: it holds no state and knows nothing about routes, the
 * composer, or the reroll reward -- callers pass finished copy and one action.
 * Weight stays below the log cards it sits above (1px border on cream, where the
 * cards use `border-2`), so it reads as a utility row, not a second hero card.
 */
export function MemoryLogWriteStripView({
  title,
  body,
  ctaLabel,
  href,
  onClick,
  className = '',
}: MemoryLogWriteStripViewProps) {
  return (
    <div
      className={`flex w-full flex-col gap-2.5 rounded-xl border border-line-soft bg-[#faf6ee] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${className}`}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-xs font-black text-[#2b2520] sm:text-sm">{title}</p>
        <p className="text-[11px] font-bold leading-snug text-[#6b6257] sm:text-xs">{body}</p>
      </div>

      {ctaLabel && (
        <MemoryLogActionButton
          label={ctaLabel}
          href={href}
          onClick={onClick}
          className="self-start sm:self-auto"
        />
      )}
    </div>
  );
}
