import React from 'react';
import { visualAsset } from '../../config/visualAssets';
import { FittedAsset } from '../common';
import { BgmPlayerWidget } from './BgmPlayerWidget';
import { VisitCounterRow } from './VisitCounterRow';
import {
  LEFT_SIDEBAR_ARIA_LABEL,
  MY_PROFILE_COPY,
  TODAY_IS_COPY,
  BGM_PLAYING_COPY,
} from '../../content/sidebar';

/**
 * Visual V4 Left Sidebar based on Figma 00_FINAL_REFERENCE (Landing/Desktop).
 * 1. MY PROFILE: Kkumdori character illustration with friendly intro note.
 * 2. TODAY IS...: Daily travel mood memo with mini-homepage visit counters.
 * 3. BGM PLAYING: Retro music player widget with track info and control buttons.
 */
export function LeftSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label={LEFT_SIDEBAR_ARIA_LABEL}
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* 1. MY PROFILE (Character & Welcome Memo) */}
      <section
        aria-label={MY_PROFILE_COPY.heading}
        className="relative overflow-hidden rounded-2xl border-2 border-line-soft bg-[#fffef9] p-4 sm:p-5"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-line-soft pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            {/* Production Manifest clover replaces the standalone cat glyph. 16px matches the
                glyph it replaces and the MY PROFILE heading hierarchy -- deliberately NOT the
                right rail's 20px box, so MY PROFILE (16px) stays distinct from MEMORY LOG (20px).
                Reuses the existing decoration.symbol.clover opaque-fit entry. The cat's
                role="img"/aria-label is intentionally dropped: FittedAsset marks it aria-hidden and
                the adjacent <h2>MY PROFILE</h2> already names the section. */}
            <FittedAsset assetKey="decoration.symbol.clover" className="h-4 w-4 shrink-0" />
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              {MY_PROFILE_COPY.heading}
            </h2>
          </div>
        </div>

        {/* Profile Card Body: Avatar + Welcome Text */}
        <div className="flex items-center gap-3.5">
          {/* Standing Kkumdori Illustration */}
          {/* Sizing-only wrapper: no background/border of its own -- the new
              transparent production artwork (node 354:4) is the only visual
              layer here. A decorative plate here previously showed through
              around the character regardless of the PNG's own transparency. */}
          <div className="relative flex h-20 w-16 sm:h-24 sm:w-20 shrink-0 items-center justify-center p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visualAsset('character.main.kkumdori')}
              alt={MY_PROFILE_COPY.kkumdoriAlt}
              className="h-full w-auto object-contain select-none"
            />
          </div>

          {/* Welcome Message */}
          <div className="flex flex-col gap-1 text-[#2b2520]">
            <p className="text-sm sm:text-base font-black text-[#2b2520]">
              {MY_PROFILE_COPY.greeting}
            </p>
            <p className="text-xs sm:text-sm font-medium leading-tight text-[#5c5244]">
              {MY_PROFILE_COPY.welcome}
            </p>
            <p className="text-xs font-bold text-[#8c8273]">
              {MY_PROFILE_COPY.prompt}
            </p>
          </div>
        </div>
      </section>

      {/* 2. TODAY IS... (Daily Mood Memo & Visitor Counter) */}
      <section
        aria-label={TODAY_IS_COPY.heading}
        className="relative overflow-hidden rounded-2xl border-2 border-line-soft bg-[#fffdf0] p-4 sm:p-5"
      >
        <div className="flex items-center justify-between border-b-2 border-line-soft pb-2.5 mb-3">
          <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
            {TODAY_IS_COPY.heading}
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm sm:text-base font-black text-[#2b2520] leading-snug">
            {TODAY_IS_COPY.mood}
          </p>

          <VisitCounterRow />
        </div>
      </section>

      {/* 3. BGM PLAYING (Retro Web Music Player) */}
      <section
        aria-label={BGM_PLAYING_COPY.heading}
        className="relative overflow-hidden rounded-2xl border-2 border-line-soft bg-[#fffef9] p-4 sm:p-5"
      >
        <div className="flex items-center justify-between border-b-2 border-line-soft pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            {/* Production music-note artwork (Figma 06_MEDIA). The asset is only
                52.7% x 59.1% opaque, so at the previous 16px box it rendered ~10px of
                actual note; FittedAsset compensates so the 22px box is 22px of artwork.
                Visual only -- the track metadata, equalizer and transport controls below
                are untouched, as is playback behavior. */}
            <FittedAsset assetKey="media.musicNote" className="h-[22px] w-[22px] shrink-0" />
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              {BGM_PLAYING_COPY.heading}
            </h2>
          </div>
        </div>

        {/*
          Real playback (feat/sidebar-actualization-bgm): track info,
          equalizer, and controls are all interactive now, so they live in a
          Client Component -- see BgmPlayerWidget.tsx for the <audio>-backed
          state, the Play/Pause asset swap, and the decorative-vs-interactive
          control split. This file (the section header above) stays a Server
          Component.
        */}
        <BgmPlayerWidget />
      </section>
    </aside>
  );
}
