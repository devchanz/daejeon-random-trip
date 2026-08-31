import React from 'react';
import { resolveAvatarAsset } from '../../config/avatars';

export interface RandomLogAvatarBadgeProps {
  avatarId: string;
  className?: string;
}

/**
 * Renders a Random Log entry's selected character as a circular badge.
 * Resolves `imageSrc` when a registry entry has one, otherwise falls back to
 * `badgeEmoji` -- the single place Random Log surfaces render a character, so
 * production Figma assets plug in via `src/config/avatars.ts` alone.
 */
export function RandomLogAvatarBadge({ avatarId, className = '' }: RandomLogAvatarBadgeProps) {
  const avatar = resolveAvatarAsset(avatarId);

  return (
    <span
      role="img"
      aria-label={avatar.name}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#2b2520] bg-white ${className}`}
    >
      {avatar.imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar.imageSrc} alt="" className="h-full w-full object-contain" />
      ) : (
        <span aria-hidden="true">{avatar.badgeEmoji ?? '⭐'}</span>
      )}
    </span>
  );
}
