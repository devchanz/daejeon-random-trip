'use client';

import React from 'react';
import {
  SUPPORTED_DURATIONS,
  SUPPORTED_PREFERENCES,
  type DurationType,
  type PreferenceType,
} from '../../config/product';
import type { ExperienceAction, ExperienceState } from '../../lib/experience';
import { selectDuration, selectPreference } from '../../lib/experience';
import { pushDataLayerEvent } from '../../lib/analytics';
import { OptionButton } from './OptionButton';
import { FittedAsset } from '../common';
import type { VisualAssetKey } from '../../config/visualAssets';
import { DURATION_LABELS, PREFERENCE_LABELS } from '../../content/labels';
import {
  SETUP_AREA_ARIA_LABEL,
  SETUP_HEADER,
  STEP_LABELS,
  Q1_COPY,
  Q2_COPY,
  READY_COPY,
  SPINNING_COPY,
} from '../../content/setup';

interface SetupAreaProps {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}

/**
 * Re-exported from the canonical src/content/labels.ts source of truth
 * (kept under this name so existing importers, e.g. result/ResultSummary.tsx,
 * need no edit).
 */
export const DURATION_DISPLAY_LABELS: Record<DurationType, string> = DURATION_LABELS;

/** Emoji fallbacks, retained behind the production artwork below. */
export const DURATION_ICONS: Record<DurationType, string> = {
  half: '☀️',
  full: '🌙',
};

/**
 * Q1 production icon artwork (Figma 03_SETUP).
 * Canonical mapping -- must never be cross-wired:
 *   half (반나절) = SUN, full (하루종일) = MOON.
 */
export const DURATION_ICON_ASSETS: Record<DurationType, VisualAssetKey> = {
  half: 'setup.duration.halfDay',
  full: 'setup.duration.fullDay',
};

/** Re-exported from the canonical src/content/labels.ts source of truth. */
export const PREFERENCE_DISPLAY_LABELS: Record<PreferenceType, string> = PREFERENCE_LABELS;

/** Emoji fallbacks, retained behind the production artwork below. */
export const PREFERENCE_ICONS: Record<PreferenceType, string> = {
  anything: '🎲',
  food: '🍜',
  walk: '🌿',
  photo: '📸',
};

/** Q2 production icon artwork (Figma 03_SETUP): dice / fork+spoon / leaf / camera. */
export const PREFERENCE_ICON_ASSETS: Record<PreferenceType, VisualAssetKey> = {
  anything: 'setup.preference.any',
  food: 'setup.preference.food',
  walk: 'setup.preference.walk',
  photo: 'setup.preference.photo',
};

export function SetupArea({ state, dispatch }: SetupAreaProps) {
  const currentPhase = state.phase;
  const isIntro = currentPhase === 'intro';
  const isQ1Active = currentPhase === 'q1';
  const isQ2Active = currentPhase === 'q2';
  const isReady = currentPhase === 'ready';
  const isSpinningOrResult = currentPhase === 'spinning' || currentPhase === 'result';

  const handleSelectDuration = (duration: DurationType) => {
    pushDataLayerEvent('q1_select', { duration_type: duration });
    dispatch(selectDuration(duration));
  };

  const handleSelectPreference = (preference: PreferenceType) => {
    pushDataLayerEvent('q2_select', { preference_type: preference });
    dispatch(selectPreference(preference));
  };

  // Phase 7 final copy: READY and SPINNING/RESULT no longer show a
  // parenthetical step label at all (previously "(READY)"/"(SPINNING)") --
  // only INTRO/Q1/Q2 still show one. SPINNING/RESULT additionally swaps the
  // header's BASE text to SETUP_HEADER.spinningTitle rather than just
  // dropping a suffix. See the header render below.
  const showStepParenthetical = isIntro || isQ1Active || isQ2Active;
  // Only the genuine "STEP n/2" metadata (Q1/Q2) gets the de-bolded
  // treatment -- INTRO's parenthetical is unaffected, per the approved brief.
  const isStepMetadata = isQ1Active || isQ2Active;
  const stepLabel = isIntro ? STEP_LABELS.intro : isQ1Active ? STEP_LABELS.q1 : STEP_LABELS.q2;
  const headerTitleText = isSpinningOrResult ? SETUP_HEADER.spinningTitle : SETUP_HEADER.titlePrefix;

  return (
    <section
      aria-label={SETUP_AREA_ARIA_LABEL}
      className="relative w-full rounded-2xl sm:rounded-3xl border-2 border-line-soft bg-[#fffef9] p-4 sm:p-6 overflow-hidden h-[var(--hero-setup-h)] flex flex-col justify-between"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3.5">
        {/* Header Bar: Step Status Indicator */}
        <div className="flex items-center justify-between border-b-2 border-line-soft pb-2 sm:pb-2.5">
          {/* Split deliberately: this line mixes two typography categories. The Korean
              belongs to the user-facing set (DOS Gothic, inherited), while `STEP n/2`
              is a retro English pixel label and stays on font-mono with its siblings
              (MY PROFILE, MEMORY LOG, TOTAL VISIT). Previously the whole string was
              font-mono, so the Korean was silently falling back to a system font --
              Geist Mono has no Hangul. */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#2b2520]">
            {/* Production Manifest star replaces the standalone ⭐ glyph. Deliberately NOT
                given the right rail's 20px treatment: the emoji inherited this row's
                `text-xs sm:text-sm` and so read at ~12/14px, and matching that preserves the
                Setup header's existing hierarchy against the larger section icons. The star
                now carries opaque-fit compensation, so the box size IS the visible size, and
                12/14px sits inside the row's unchanged 16/20px line box. */}
            <FittedAsset
              assetKey="decoration.symbol.star"
              className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0"
            />
            <span>
              {headerTitleText}
              {showStepParenthetical && (
                <>
                  {' '}
                  (
                  <span className={`font-mono ${isStepMetadata ? 'font-normal' : ''}`}>
                    {stepLabel}
                  </span>
                  )
                </>
              )}
            </span>
          </div>

          {/* Decorative header ornament (✨) removed; the label itself is retained. */}
          <div className="flex items-center gap-1 text-xs font-bold text-[#8c8273]">
            <span>{SETUP_HEADER.caption}</span>
          </div>
        </div>

        {/* Dynamic Question Area: Strict Height Lock (128px on mobile, 92px on desktop) */}
        <div className="flex flex-col justify-center h-[128px] sm:h-[92px]">
          {/* INTRO: renders nothing here on purpose. The Phase 5 visual
              correction moved the entry gate OUT of this fixed footprint and
              into IntroGate.tsx, a translucent overlay MainExperience layers
              on top of this whole card (see MainExperience.tsx) -- this box
              stays empty (but still full height, so geometry is untouched)
              and is faintly visible underneath that overlay's warm veil,
              which is exactly the "hero still recognizable underneath"
              effect the brief asked for. The persistent header row above
              (STEP_LABELS.intro, SETUP_HEADER) still renders normally. */}

          {/* Q1: Duration Selection */}
          {isQ1Active && (
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm sm:text-base xl:text-lg font-black text-[#2b2520]">
                  <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-[#ff5555] text-xs font-black text-white">
                    {Q1_COPY.badge}
                  </span>
                  <span>{Q1_COPY.question}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 h-[88px] sm:h-[64px]">
                {SUPPORTED_DURATIONS.map((duration) => (
                  <OptionButton
                    key={duration}
                    value={duration}
                    label={DURATION_DISPLAY_LABELS[duration]}
                    icon={DURATION_ICONS[duration]}
                    iconAssetKey={DURATION_ICON_ASSETS[duration]}
                    isSelected={state.duration === duration}
                    isActive={true}
                    onSelect={handleSelectDuration}
                    className="h-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Q2: Preference Selection */}
          {isQ2Active && (
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm sm:text-base xl:text-lg font-black text-[#2b2520]">
                  <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-[#ff5555] text-xs font-black text-white">
                    {Q2_COPY.badge}
                  </span>
                  <span>{Q2_COPY.question}</span>
                </span>
              </div>

              {/*
               * Mobile-only h-[96px]/gap-2 (was h-[88px]/gap-2.5): honest box for what
               * this grid actually contains. 4 buttons in a 2-across grid make 2 rows,
               * and at OptionButton's mobile min-content (36px, see its py-1 comment)
               * `2 * 36 + gap-2 (8) = 80` fits inside 96 with headroom; the grid then
               * stretches each row to 44px (96 - 8) / 2, which is what actually renders.
               * The card's total height token (--hero-setup-h) is unchanged -- this
               * fits inside the SAME 128px question-area lock (label 24 + gap-2 8 +
               * grid 96 = 128), it was never a card-height problem. `sm:` untouched: the
               * 4-across desktop row is a single 64px track that never overflowed.
               */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 h-[96px] sm:h-[64px]">
                {SUPPORTED_PREFERENCES.map((pref) => (
                  <OptionButton
                    key={pref}
                    value={pref}
                    label={PREFERENCE_DISPLAY_LABELS[pref]}
                    icon={PREFERENCE_ICONS[pref]}
                    iconAssetKey={PREFERENCE_ICON_ASSETS[pref]}
                    // Q2 goes 4-across from `sm` up, where each button is only ~78-90px
                    // wide and the longest label (아무거나) already wraps. 22px is
                    // deliberately smaller than Q1's 28px so the enlargement cannot make
                    // that wrapping worse; mobile stays 24px, where the 2-across grid has
                    // room. Even at 22px the padded icons roughly double in visible size.
                    iconClassName="h-6 w-6 sm:h-[22px] sm:w-[22px]"
                    isSelected={state.preference === pref}
                    isActive={true}
                    onSelect={handleSelectPreference}
                  />
                ))}
              </div>
            </div>
          )}

          {/* READY: Completed Summary State */}
          {isReady && state.duration && state.preference && (
            <div className="flex h-[88px] sm:h-[64px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#10b981] bg-[#ecfdf5] p-2 text-center">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#065f46]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#10b981] motion-safe:animate-pulse" />
                <span>
                  {READY_COPY.summaryPrefix}: {DURATION_DISPLAY_LABELS[state.duration]} &middot;{' '}
                  {PREFERENCE_DISPLAY_LABELS[state.preference]}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#047857]">
                {READY_COPY.hint}
              </span>
            </div>
          )}

          {/* SPINNING / RESULT Status Frame.
              Type scale and weights raised for readability and a clearer primary/
              supporting split: the condition line is 700 against a 400 supporting line,
              which reads far more distinctly than the previous 900/700 pairing at nearly
              identical sizes.
              Container geometry is untouched -- the stack measures 22 + 2 + 18 = 42px
              against 44px of desktop content box (64px minus p-2 and border-2), and
              40px against 68px on mobile.
              The READY block above is deliberately NOT retuned: only SPINNING was a
              confirmed Human Browser finding. */}
          {isSpinningOrResult && state.duration && state.preference && (
            <div className="flex h-[88px] sm:h-[64px] flex-col items-center justify-center gap-1 sm:gap-0.5 rounded-xl border-2 border-dashed border-[#38bdf8] bg-[#f0f9ff] p-2 text-center">
              <div className="flex items-center gap-2 text-sm sm:text-[15px] font-bold text-[#0369a1]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#38bdf8] motion-safe:animate-spin" />
                <span>
                  {SPINNING_COPY.summaryPrefix}: {DURATION_DISPLAY_LABELS[state.duration]} &middot;{' '}
                  {PREFERENCE_DISPLAY_LABELS[state.preference]}
                </span>
              </div>
              <span className="text-xs sm:text-[13px] font-normal text-[#0284c7]">
                {SPINNING_COPY.hint}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
