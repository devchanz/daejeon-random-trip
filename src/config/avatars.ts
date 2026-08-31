/**
 * Guestbook / Random Log character avatar registry.
 *
 * NOTE on production assets: the 10 identities below are real Kkumssi-family
 * characters from the Figma handoff (Character/Avatar/*), but the illustration
 * files themselves are not yet present in this repo. `imageSrc` is left unset
 * for every entry until the production assets are extracted into `public/` —
 * `resolveAvatarAsset` falls back to `badgeEmoji` until then, so no component
 * change is required when the real assets land, only this file.
 *
 * `kkumdori` here is the selectable guestbook-Avatar variant of the character
 * (Character/Avatar/Kkumdori). It is a different role from the static brand
 * illustration rendered in LeftSidebar ("Character/Main/Kkumdori",
 * `/assets/kkumdori-main.png`) and must not be aliased to it or share its file.
 */

export interface GuestbookAvatarOption {
  id: string;
  name: string;
  badgeEmoji?: string;
  imageSrc?: string;
  description?: string;
}

/**
 * The 10 selectable Kkumssi-family avatar options presented in the guestbook
 * character selector. Ordered to match the Figma handoff listing.
 */
export const GUESTBOOK_AVATARS: readonly GuestbookAvatarOption[] = [
  { id: 'mongmong', name: 'Mongmong', badgeEmoji: '⭐' },
  { id: 'kkumdongi', name: 'Kkumdongi', badgeEmoji: '✨' },
  { id: 'nebeu', name: 'Nebeu', badgeEmoji: '🌱' },
  { id: 'geumdori', name: 'Geumdori', badgeEmoji: '🎒' },
  { id: 'kkumnuri', name: 'Kkumnuri', badgeEmoji: '🍀' },
  // Character/Avatar/Kkumdori -- selectable guestbook variant only, distinct
  // from the static Character/Main/Kkumdori brand illustration in LeftSidebar.
  { id: 'kkumdori', name: 'Kkumdori', badgeEmoji: '🚀' },
  { id: 'doreu', name: 'Doreu', badgeEmoji: '🌙' },
  { id: 'kkumbichi', name: 'Kkumbichi', badgeEmoji: '🍬' },
  { id: 'eunsuni', name: 'Eunsuni', badgeEmoji: '🎈' },
  { id: 'kkumsuni', name: 'Kkumsuni', badgeEmoji: '🎨' },
] as const;

/**
 * Default avatar ID pre-selected in the composer.
 */
export const DEFAULT_AVATAR_ID = GUESTBOOK_AVATARS[0].id;

/**
 * Resolves a stored/selected avatar_id to its registry entry.
 * Falls back to the default avatar if the id is unknown (e.g. a registry
 * entry was later pruned), so a stored entry never fails to render.
 */
export function resolveAvatarAsset(avatarId: string): GuestbookAvatarOption {
  return (
    GUESTBOOK_AVATARS.find((avatar) => avatar.id === avatarId) ??
    GUESTBOOK_AVATARS.find((avatar) => avatar.id === DEFAULT_AVATAR_ID)!
  );
}
