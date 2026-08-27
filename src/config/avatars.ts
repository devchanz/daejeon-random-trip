/**
 * Development placeholder avatar definitions for the Guestbook Composer.
 *
 * NOTE: The official character whitelist is pending final asset integration.
 * The identifiers defined here serve as generic development placeholders only
 * and must not be treated as official character assets or production metadata.
 */

export interface GuestbookAvatarOption {
  id: string;
  name: string;
  badgeEmoji?: string;
  description?: string;
}

/**
 * Configurable development placeholder avatar options presented to the user during guestbook composition.
 */
export const GUESTBOOK_AVATARS: readonly GuestbookAvatarOption[] = [
  {
    id: 'placeholder_avatar_1',
    name: '아바타 1',
    badgeEmoji: '⭐',
    description: '개발용 플레이스홀더 아바타 1',
  },
  {
    id: 'placeholder_avatar_2',
    name: '아바타 2',
    badgeEmoji: '✨',
    description: '개발용 플레이스홀더 아바타 2',
  },
  {
    id: 'placeholder_avatar_3',
    name: '아바타 3',
    badgeEmoji: '🌱',
    description: '개발용 플레이스홀더 아바타 3',
  },
  {
    id: 'placeholder_avatar_4',
    name: '아바타 4',
    badgeEmoji: '🎒',
    description: '개발용 플레이스홀더 아바타 4',
  },
] as const;

/**
 * Default avatar ID pre-selected in the composer.
 */
export const DEFAULT_AVATAR_ID = GUESTBOOK_AVATARS[0].id;
