'use client';

import React from 'react';
import type { RouteResult } from '../../../lib/random';
import { FittedAsset } from '../../common';
import { DURATION_DISPLAY_LABELS } from '../SetupArea';

export interface ResultSummaryProps {
  result: RouteResult;
  className?: string;
}

/**
 * The approved summary sentence, placed inside the painted summary shell:
 * `{zone}에서 / {tripMode} 놀고 오기`.
 *
 * Layout constraints, all from measurement of the painted shell:
 *  - The DAEJEON stamp is baked into the shell's LEFT edge (mobile 4.7-20.3%,
 *    desktop 7.5-18.9% of the canvas), so the enclosing region is already inset
 *    past it (the state skin's `regions.summary`). Nothing here may be given a negative
 *    inset that would run text back under the stamp.
 *  - The mascot occupies the right, in its own `shrink-0` column, so the sentence
 *    can never be squeezed into it and never wraps into clipping.
 *  - `min-w-0` on the text column lets long zone names wrap rather than overflow.
 *
 * Colour hierarchy follows the master: district and `놀고 오기` in dark ink, the
 * trip mode in coral. Type scale is deliberately larger than the surrounding body
 * copy -- this sentence is the Result's headline.
 *
 * Deliberately excludes any duration/stay-time rendering: Q1 반나절/하루종일 is
 * trip mode copy, never a computed duration. Preference and stop count are not
 * shown here either; both appear in the Route Guide header.
 */
export function ResultSummary({ result, className = '' }: ResultSummaryProps) {
  const tripModeLabel =
    DURATION_DISPLAY_LABELS[result.durationType] ?? result.durationType;

  return (
    <section
      aria-label="추천 코스 요약"
      data-testid="result-summary"
      className={`flex h-full w-full items-center gap-1.5 ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="break-keep text-[clamp(19px,5.6vw,26px)] font-black leading-[1.18] tracking-tight text-[#1f2a44]">
          {result.zoneName}에서
        </p>
        <p className="break-keep text-[clamp(21px,6.2vw,29px)] font-black leading-[1.18] tracking-tight text-[#1f2a44]">
          <span className="text-[#ff5555]">{tripModeLabel}</span> 놀고 오기
        </p>
      </div>

      {/*
       * 꿈돌이 — the FACE-ONLY avatar (`character.avatar.kkumdori`, the registry key
       * for Figma `Character/Avatar/Kkumdori`, 123x104 and 42% transparent).
       * NOT `character.main.kkumdori`: that is the full-body brand illustration and
       * is measurably 0% transparent, so it rendered as an opaque rectangle behind
       * the mascot. The registry comment is explicit that the two are different
       * roles and must never be aliased.
       *
       * No wrapper, no background, no rounding -- the asset's own transparency is
       * the silhouette. Bottom-aligned and height-capped so it clears the painted
       * airmail decoration in the shell's upper-right (mobile 82.6-95.2%).
       */}
      <FittedAsset
        assetKey="character.avatar.kkumdori"
        alt=""
        width={123}
        height={104}
        className="aspect-[123/104] h-[72%] max-w-[26%] w-auto shrink-0 self-end object-contain"
      />
    </section>
  );
}
