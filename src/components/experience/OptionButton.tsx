'use client';

import React from 'react';
import { FittedAsset } from '../common';
import type { VisualAssetKey } from '../../config/visualAssets';

export interface OptionButtonProps<T extends string> {
  value: T;
  label: string;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (value: T) => void;
  ariaLabel?: string;
  className?: string;
  /** Emoji fallback, used only when `iconAssetKey` is absent. */
  icon?: string;
  /**
   * Production icon artwork, addressed by registry key so that transparent-padding
   * compensation resolves centrally (see FittedAsset). Takes precedence over `icon`.
   */
  iconAssetKey?: VisualAssetKey;
  /**
   * Sizing classes for the icon's LAYOUT BOX, i.e. the intended visible artwork size.
   * Defaults to the roomy 2-across (Q1) size; the 4-across Q2 row passes a smaller one.
   */
  iconClassName?: string;
}

/**
 * Visual V4 OptionButton component for Q1 & Q2 option selections.
 * Features tactile retro paper button styling matching Figma 00_FINAL_REFERENCE.
 */
export function OptionButton<T extends string>({
  value,
  label,
  isSelected,
  isActive,
  onSelect,
  ariaLabel,
  className = '',
  icon,
  iconAssetKey,
  iconClassName = 'h-6 w-6 sm:h-7 sm:w-7',
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
      className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-3 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#2b2520] focus-visible:ring-offset-2 select-none ${
        isSelected
          ? 'border-2 border-[#ff5555] bg-[#fef2f2] text-[#2b2520] ring-2 ring-[#ff8585]/50 translate-x-[1px] translate-y-[1px]'
          : isActive
          ? 'border-2 border-[#2b2520] bg-[#fffef9] text-[#2b2520] hover:bg-[#fff9e6] hover:-translate-y-0.5 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]'
          : 'border-2 border-[#d8d0c2] bg-[#f5efe3] text-[#a89f91] cursor-not-allowed'
      } ${className}`}
    >
      {/* The icon box is the intended VISIBLE artwork size: FittedAsset compensates for
          each asset's transparent padding, which previously made these icons render
          between 8.5px and 20px from an identical 20px box. `transform` does not
          participate in layout, so this cannot grow SetupArea's height-locked question
          area or option grid -- only the box classes below affect layout. */}
      {iconAssetKey ? (
        <FittedAsset assetKey={iconAssetKey} className={`shrink-0 ${iconClassName}`} />
      ) : (
        icon && <span className="text-base sm:text-lg select-none">{icon}</span>
      )}
      <span>{label}</span>
    </button>
  );
}
