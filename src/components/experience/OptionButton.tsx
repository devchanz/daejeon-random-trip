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
 * Reusable OptionButton component for Q1 & Q2 option selections.
 * Uses semantic <button> and preserves standard keyboard interactions.
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
      className={`relative flex flex-1 items-center justify-center rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-2 border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
          : isActive
          ? 'border-2 border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100 cursor-pointer active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500'
          : 'border-2 border-zinc-100 bg-zinc-50/60 text-zinc-400 cursor-not-allowed dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-zinc-600'
      } ${className}`}
    >
      {label}
    </button>
  );
}
