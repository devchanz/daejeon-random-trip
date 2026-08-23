'use client';

import React from 'react';

export interface OptionButtonProps<T extends string> {
  value: T;
  label: string;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * Visual V4 OptionButton component for Q1 & Q2 option selections.
 * Features tactile 3D retro paper button styling, distinct selected/active/disabled states,
 * and maintains full keyboard accessibility.
 */
export function OptionButton<T extends string>({
  value,
  label,
  isSelected,
  isActive,
  onSelect,
  ariaLabel,
  className = '',
}: OptionButtonProps<T>) {
  const handleClick = () => {
    if (isActive) {
      onSelect(value);
    }
  };

  return (
    <button
      type="button"
      disabled={!isActive && !isSelected}
      onClick={handleClick}
      aria-pressed={isSelected}
      aria-label={ariaLabel || label}
      className={`relative flex flex-1 items-center justify-center rounded-xl py-3 px-4 text-sm font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#2b2520] focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-2 border-[#2b2520] bg-[#2b2520] text-[#fffdf8] shadow-none translate-x-[2px] translate-y-[2px] ring-2 ring-[#ff5555]'
          : isActive
          ? 'border-2 border-[#2b2520] bg-[#fffef9] text-[#2b2520] shadow-retro hover:bg-[#fff9e6] hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_#2b2520] cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
          : 'border-2 border-[#d8d0c2] bg-[#f5efe3] text-[#a89f91] cursor-not-allowed shadow-none'
      } ${className}`}
    >
      {label}
    </button>
  );
}
