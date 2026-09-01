import { visualAsset } from './visualAssets';

/**
 * Guestbook / Random Log character avatar registry.
 *
 * The 10 identities below are the real Kkumssi-family characters from the Figma
 * handoff (Character/Avatar/*). Their production artwork is now present, wired through
 * the central asset registry rather than as literal paths -- see src/config/visualAssets.ts.
 *
 * IDENTITY vs ASSET. The `id` values (`mongmong`, `kkumdongi`, ...) are stable
 * APPLICATION identity: they are persisted as `avatar_id` on guestbook rows and must
 * never change. The `character.avatar.*` keys are ASSET identity, owned by Figma. The
 * two are joined here and nowhere else, so re-exporting or renaming artwork can never
 * reach the database, and renaming a Figma layer can never orphan a stored entry.
 *
 * `badgeEmoji` is retained as the structural fallback: `resolveAvatarAsset` consumers
 * still render it whenever an entry has no `imageSrc`, so a future added-but-not-yet-
 * exported character degrades gracefully instead of rendering a broken image.
 *
 * `kkumdori` here is the selectable guestbook-Avatar variant of the character
 * (Character/Avatar/Kkumdori). It is a different role from the static brand
 * illustration rendered in LeftSidebar ("Character/Main/Kkumdori",
 * `character.main.kkumdori`) and must not be aliased to it or share its file.
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
  { id: 'mongmong', name: '몽몽', badgeEmoji: '⭐', imageSrc: visualAsset('character.avatar.mongmong') },
  { id: 'kkumdongi', name: '꿈동이', badgeEmoji: '✨', imageSrc: visualAsset('character.avatar.kkumdongi') },
  { id: 'nebeu', name: '네브', badgeEmoji: '🌱', imageSrc: visualAsset('character.avatar.nebeu') },
  { id: 'geumdori', name: '금돌이', badgeEmoji: '🎒', imageSrc: visualAsset('character.avatar.geumdori') },
  { id: 'kkumnuri', name: '꿈누리', badgeEmoji: '🍀', imageSrc: visualAsset('character.avatar.kkumnuri') },
  // Character/Avatar/Kkumdori -- selectable guestbook variant only, distinct
  // from the static Character/Main/Kkumdori brand illustration in LeftSidebar.
  { id: 'kkumdori', name: '꿈돌이', badgeEmoji: '🚀', imageSrc: visualAsset('character.avatar.kkumdori') },
  { id: 'doreu', name: '도르', badgeEmoji: '🌙', imageSrc: visualAsset('character.avatar.doreu') },
  { id: 'kkumbichi', name: '꿈빛이', badgeEmoji: '🍬', imageSrc: visualAsset('character.avatar.kkumbichi') },
  { id: 'eunsuni', name: '은순이', badgeEmoji: '🎈', imageSrc: visualAsset('character.avatar.eunsuni') },
  { id: 'kkumsuni', name: '꿈순이', badgeEmoji: '🎨', imageSrc: visualAsset('character.avatar.kkumsuni') },
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
