'use client';

import React from 'react';
import type { GuestbookAvatarOption } from '../../config/avatars';

export interface CharacterSelectorProps {
  avatars: readonly GuestbookAvatarOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Guestbook character selector: a large selected-character hero preview above a
 * fixed 5x2 grid showing all 10 candidates simultaneously. No carousel, no
 * horizontal scrolling, nothing clipped -- for a fixed roster of exactly 10
 * characters, showing all of them at once removes discovery/navigation cost
 * entirely. Renders `imageSrc` when a registry entry has one (production
 * Figma assets), otherwise falls back to `badgeEmoji` -- no redesign is
 * required when real assets land.
 */
export function CharacterSelector({ avatars, selectedId, onSelect }: CharacterSelectorProps) {
  const selected = avatars.find((avatar) => avatar.id === selectedId) ?? avatars[0];

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-xs font-black text-[#2b2520]">
        캐릭터 아바타 선택 <span className="text-[#ff5555]">*</span>
      </legend>

      {/* Selected character hero preview -- hierarchy comes from the large avatar
          and name, not a colored background block; a light divider is enough
          to read this as its own section above the picker grid. */}
      <div className="flex items-center gap-3.5 border-b border-line-soft pb-3.5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-line-soft bg-white text-5xl sm:h-28 sm:w-28 sm:text-6xl">
          {selected.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.imageSrc} alt="" className="h-full w-full object-contain" />
          ) : (
            <span role="img" aria-hidden="true">
              {selected.badgeEmoji ?? '⭐'}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[10px] font-black uppercase tracking-wide text-[#8c8273]">
            선택한 캐릭터
          </span>
          <span className="text-base font-black text-[#2b2520] sm:text-lg">{selected.name}</span>
        </div>
      </div>

      {/* All 10 candidates at once: fixed 5x2 grid, no scrolling, nothing clipped */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {avatars.map((avatar) => {
          const isSelected = avatar.id === selectedId;
          return (
            <button
              key={avatar.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={avatar.name}
              onClick={() => onSelect(avatar.id)}
              className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 p-1.5 transition-all hover:scale-105 sm:p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2b2520] ${
                isSelected
                  ? 'border-[#ed8b99] bg-[#fff4f6]'
                  : 'border-line-control bg-[#fffef9] hover:bg-[#faf6ee]'
              }`}
            >
              <span className="relative flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12">
                <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-line-soft bg-white text-xl sm:text-2xl">
                  {avatar.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar.imageSrc} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span aria-hidden="true">{avatar.badgeEmoji ?? '⭐'}</span>
                  )}
                </span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#10b981] text-[9px] font-black text-white"
                  >
                    ✓
                  </span>
                )}
              </span>
              <span className="w-full truncate text-center text-[9px] font-black text-[#2b2520] sm:text-[10px]">
                {avatar.name}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
