import React from 'react';
import Link from 'next/link';

export interface MemoryLogActionButtonProps {
  label: string;
  /** Fuller phrasing for assistive tech, since the visible label is abbreviated for the rail. */
  ariaLabel?: string;
  /** Optional single decorative glyph rendered before the label (aria-hidden). */
  glyph?: string;
  /** Internal navigation target. Mutually exclusive with `onClick`. */
  href?: string;
  /** In-page action. Mutually exclusive with `href`. */
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * The one Memory Log action control, shared by the right rail's MEMORY LOG
 * header and the `/random-log` board's write row so the two can never drift.
 *
 * WHY IT LOOKS LIKE THIS. It replaces a full-width button that was first solid
 * coral and then white-with-a-coral-outline: the first competed head-on with the
 * journey's primary CTA (`여행 시작하기`), and the second read as a generic web
 * button dropped into a retro paper page. This is a small ticket/stamp control
 * instead -- warm peach paper, a muted coral edge, ink label, a tiny glyph, the
 * same 1px press the rest of the landing uses. Auto width, ~28px tall, so it can
 * sit inline in a card header without adding a row of its own.
 *
 * Deliberately NOT: full width, solid red, or shadowed (the project's
 * no-decorative-shadow rule holds). Subordinate to `여행 시작하기` by weight and
 * size, still an obvious control by border, glyph and hover.
 */
export function MemoryLogActionButton({
  label,
  ariaLabel,
  glyph,
  href,
  onClick,
  disabled = false,
  className = '',
}: MemoryLogActionButtonProps) {
  const base =
    'inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-md border px-2.5 text-[11px] font-black leading-none whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#ff5555] focus-visible:ring-offset-1';
  const enabled =
    'cursor-pointer border-[#e8a08c] bg-[#fff2e9] text-[#2b2520] hover:border-[#d97f66] hover:bg-[#ffe6d6] focus-visible:bg-[#ffe6d6] active:translate-x-[1px] active:translate-y-[1px]';
  const off = 'cursor-not-allowed border-line-control bg-[#efe9dd] text-[#a89f91]';

  const content = (
    <>
      {glyph && (
        <span aria-hidden="true" className="text-[11px] leading-none">
          {glyph}
        </span>
      )}
      <span>{label}</span>
    </>
  );

  // A disabled link is not a thing (an <a> cannot be disabled and stay inert),
  // so a disabled action always renders as a real disabled <button>.
  if (href && !disabled) {
    return (
      <Link href={href} aria-label={ariaLabel} className={`${base} ${enabled} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${disabled ? off : enabled} ${className}`}
    >
      {content}
    </button>
  );
}
