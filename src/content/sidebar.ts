/**
 * Left / Right sidebar static copy.
 * See src/components/sidebar/LeftSidebar.tsx and RightSidebar.tsx.
 *
 * Every string below is transcribed VERBATIM from the markup it replaces --
 * this pass only relocates copy, it does not rewrite it. Deliberately
 * excluded (per AGENTS.md's data/config boundary): editorial banner titles/
 * tags/badges (src/data/editorial.ts -- data, rotated per item) and Random
 * Log entry content (nickname/message/timestamp -- user-submitted DB rows).
 * Those stay where they are.
 */

export const LEFT_SIDEBAR_ARIA_LABEL = '미니홈피 프로필 및 메모 (Left Sidebar)';

export const MY_PROFILE_COPY = {
  heading: 'MY PROFILE',
  kkumdoriAlt: '꿈돌이',
  /** Lead line. */
  greeting: '반가워요! 👋',
  /** Body line 1. */
  welcome: '저와 함께 오늘 대전갈래요?',
  /** Body line 2. */
  prompt: '오늘은 대전의 어떤 매력을 발견하게 될까요? ✨',
} as const;

export const TODAY_IS_COPY = {
  heading: 'TODAY IS...',
  mood: '설레는 대전 여행 가는 날! 💕',
  /**
   * Label prefixes only -- the numbers are real, server-read visit counts
   * (see src/components/sidebar/VisitCounterRow.tsx), never baked in here.
   */
  totalVisitPrefix: 'TOTAL VISIT',
  todayPrefix: 'TODAY',
} as const;

export const BGM_PLAYING_COPY = {
  heading: 'BGM PLAYING',
  trackTitle: '대전의 오후 (Daejeon Afternoon)',
  trackArtist: 'by DAEJEON BEAT',
  /**
   * The one real playback control (see BgmPlayerWidget.tsx): a focusable
   * `<button>` toggling play/pause, with its aria-label computed from live
   * playback state (`Pause track` / `Play track`) rather than hardcoded here.
   * Geometry measured from the painted export -- see media.playbackControls
   * in src/config/visualAssets.ts.
   */
  playPauseControl: { left: '31.09%', width: '16.81%' },
  /**
   * Previous/Next/Stop are decoration only (BGM contract, feat/sidebar-
   * actualization-bgm): no click behavior, not tabbable, no button
   * semantics -- rendered as plain aria-hidden regions, not <button>s.
   */
  decorativeControls: [
    { label: 'Previous track', left: '9.24%', width: '16.39%' },
    { label: 'Next track', left: '52.52%', width: '15.97%' },
    { label: 'Stop track', left: '73.95%', width: '15.97%' },
  ],
} as const;

export const RIGHT_SIDEBAR_ARIA_LABEL = '추천 스팟 및 방명록 (Right Sidebar)';

/**
 * Passed as EditorialSpotlightCard's `heading` prop (ADR-028): the ONLY place
 * this feature name appears, so renaming it later is a one-string change here.
 */
export const TODAYS_PICK_HEADING = "TODAY'S PICK";

/**
 * Identifier kept as VISITOR_LOG_COPY (technical/internal, unchanged) --
 * only the visible string VALUES were renamed to the Phase 7 "메모리 로그 /
 * MEMORY LOG" product terminology. The underlying feature/route/component
 * are still RandomLog* throughout the codebase; this is a copy-only rename.
 */
export const VISITOR_LOG_COPY = {
  heading: 'MEMORY LOG',
  emptyState: '아직 남겨진 메모리 로그가 없어요',
  viewAllCta: '메모리 로그 전체보기 >',
} as const;

/** EditorialSpotlightCard's own empty-state copy (item === null). */
export const EDITORIAL_EMPTY_STATE = '지금은 소개할 콘텐츠가 없어요';
