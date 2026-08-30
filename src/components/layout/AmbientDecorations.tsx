import React from 'react';

/**
 * PixelCloud — Retro Cyworld / Y2K style bubbly cloud SVG.
 */
export function PixelCloud({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={style}
    >
      <path
        d="M28 44C20 44 14 38 14 30C14 23.5 18.5 18 24.5 16.5C26 8 33.5 2 43 2C51 2 57.5 6.5 60.5 13C64 9 69.5 6.5 75.5 6.5C85 6.5 93 13.5 94.5 23C99.5 24 103.5 28.5 103.5 34C103.5 40.5 98 46 91.5 46C90 46 88.5 45.5 87 45L28 44Z"
        fill="#f0f7fc"
        stroke="#c8e1f0"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 40C26 40 22 35.5 22 30C22 25 25.5 21 30 20C31.5 13.5 37 9 44 9C50 9 55 12.5 57 17.5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * PixelSparkle — 4-pointed retro diamond sparkle star.
 */
export function PixelSparkle({
  color = '#ffb800',
  size = 16,
  className = '',
  style,
}: {
  color?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={style}
    >
      <path
        d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
        fill={color}
      />
    </svg>
  );
}