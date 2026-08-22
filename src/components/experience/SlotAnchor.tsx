'use client';

import React from 'react';
import type { ExperienceState } from '../../lib/experience';

interface SlotAnchorProps {
  state: ExperienceState;
}

/**
 * Minimal placeholder presentation for SlotAnchor.
 * Preserves layout stability and displays pre-spin reels (? / ? / ?) and spin CTA.
 * Note: START_SPIN dispatch is deferred to the subsequent slice.
 */
export function SlotAnchor({ state }: SlotAnchorProps) {
  const isReady = state.phase === 'ready';

  return (
    <section
      aria-label="슬롯머신 영역 (Slot Anchor)"
      className="relative w-full overflow-hidden rounded-2xl border-2 border-zinc-900 bg-zinc-900 p-6 text-white shadow-lg dark:border-zinc-700 dark:bg-zinc-950"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Slot Header */}
        <div className="flex w-full items-center justify-between border-b border-zinc-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isReady ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <span className="font-mono font-bold tracking-wider text-zinc-300">
              DAEJEON RANDOM TRIPPER
            </span>
          </div>
          <span className="font-mono text-zinc-400">
            {isReady ? 'STATUS: READY' : 'STATUS: WAITING SETUP'}
          </span>
        </div>

        {/* Pre-spin Reel Placeholders: Identical ? / ? / ? in Q1, Q2, and READY */}
        <div className="grid w-full grid-cols-3 gap-3 rounded-xl bg-zinc-800/80 p-4 border border-zinc-700/60 shadow-inner">
          <div className="flex h-28 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 p-2 text-center">
            <span className="text-3xl font-bold text-zinc-400" aria-hidden="true">
              ?
            </span>
          </div>

          <div className="flex h-28 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 p-2 text-center">
            <span className="text-3xl font-bold text-zinc-400" aria-hidden="true">
              ?
            </span>
          </div>

          <div className="flex h-28 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 p-2 text-center">
            <span className="text-3xl font-bold text-zinc-400" aria-hidden="true">
              ?
            </span>
          </div>
        </div>

        {/* Primary Spin Action (Visual Ready State) */}
        <div className="flex w-full flex-col items-center gap-2">
          <button
            type="button"
            disabled={!isReady}
            className={`w-full max-w-sm rounded-xl py-3.5 px-6 text-base font-bold tracking-wide transition-all shadow-md ${
              isReady
                ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
            }`}
          >
            {isReady ? '여행 뽑기!' : '조건을 먼저 선택해 주세요'}
          </button>
          <span className="text-xs text-zinc-400">
            {isReady
              ? '뽑기 준비가 완료되었습니다'
              : 'Q1, Q2 조건을 완료하면 버튼이 활성화됩니다'}
          </span>
        </div>
      </div>
    </section>
  );
}
