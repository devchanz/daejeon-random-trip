/**
 * Setup Area static copy (Q1/Q2/READY/SPINNING).
 * See src/components/experience/SetupArea.tsx for the single consumer.
 *
 * Q1/Q2 question wording and SETUP_HEADER.spinningTitle reflect the Phase 7
 * final copy pass (decorative-sparkle emoji dropped from both questions;
 * READY/SPINNING no longer show a parenthetical step label in the header --
 * see SetupArea.tsx). Everything else here is still the original relocation.
 */

export const SETUP_AREA_ARIA_LABEL = '여행 조건 설정 (Setup Area)';

export const SETUP_HEADER = {
  /** Prefix before the parenthesized step label, e.g. "오늘의 여행 준비 (STEP 1/2)". Used as-is (no parenthetical) during READY. */
  titlePrefix: '오늘의 여행 준비',
  /** Right-aligned header caption. */
  caption: '조건 선택',
  /**
   * FULL header replacement shown only during SPINNING/RESULT -- not a
   * suffix/parenthetical like the other phases, the whole header line swaps
   * to this string instead (see SetupArea.tsx). Phase 7 final copy decision.
   */
  spinningTitle: '오늘의 여행 준비 완료!',
} as const;

export const STEP_LABELS = {
  intro: 'INTRO',
  q1: 'STEP 1/2',
  q2: 'STEP 2/2',
  ready: 'READY',
  spinning: 'SPINNING',
} as const;

export const Q1_COPY = {
  badge: 'Q1',
  question: '대전에서 얼마나 놀까요?',
} as const;

export const Q2_COPY = {
  badge: 'Q2',
  question: '나의 여행 스타일을 골라보세요!',
} as const;

export const READY_COPY = {
  summaryPrefix: '조건 선택 완료',
  /** Curly quotes are literal Unicode characters here (matching the “/”
   *  JSX entities they replace), not HTML entities -- JS strings render them
   *  as-is with no decoding step. */
  hint: '아래 슬롯머신의 “여행 뽑기!” 버튼을 눌러보세요!',
} as const;

export const SPINNING_COPY = {
  summaryPrefix: '선택 조건',
  hint: '🎰 대전 추천 코스를 뽑고 있어요!',
} as const;

/**
 * FINAL COPY -- approved in Phase 7 (the copy pass this block used to defer
 * to). Originally added in Phase 5 as temporary placeholder text to evaluate
 * the soft-entry-gate layout (IntroGate.tsx, rendered while phase ===
 * 'intro'); Phase 7 explicitly reviewed and kept these four strings
 * unchanged, so they are no longer a stand-in -- this is the shipped copy.
 */
export const SETUP_INTRO_COPY = {
  /** Flanked by the SAME star asset on both sides in IntroGate.tsx (no emoji here). */
  eyebrow: 'ENTRY TICKET',
  /**
   * NOTE: the space between "시작해볼까요?" and "✨" below is a real
   * non-breaking space (U+00A0), not a regular space -- it displays
   * identically in editors/terminals but stops the browser from ever
   * wrapping the sparkle onto its own line, using pure text flow (no
   * absolute positioning, no JSX span-splitting). Only the regular space
   * after "여행," can break if this headline wraps at narrow widths.
   */
  headline: '대전 랜덤 여행, 시작해볼까요? ✨',
  supporting: '버튼 하나로 오늘의 코스를 뽑아드려요!',
  cta: '여행 시작하기',
} as const;
