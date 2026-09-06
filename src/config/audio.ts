/**
 * BGM production audio source. See src/lib/audio/bgmContext.tsx for the
 * playback state/provider that consumes this, and src/components/sidebar/
 * BgmPlayerWidget.tsx for the LeftSidebar control surface.
 */
export const BGM_TRACK_SRC = '/audio/daejeon-afternoon.mp3';

/**
 * INITIAL playback volume only (0-1). The track previously started at the media
 * element's own default of 1.0, which is louder than this ambient background
 * loop is meant to be.
 *
 * Applied exactly once, on mount, and never re-applied -- see BgmProvider. Any
 * later change to `audio.volume` (a user-facing control, if one is ever added)
 * therefore wins permanently; this value is a starting point, not a policy the
 * player re-asserts.
 */
export const BGM_DEFAULT_VOLUME = 0.25;
