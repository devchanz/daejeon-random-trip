import React from 'react';
import { visualAsset } from '../../config/visualAssets';
import { FittedAsset } from '../common';

/**
 * Visual V4 Left Sidebar based on Figma 00_FINAL_REFERENCE (Landing/Desktop).
 * 1. MY PROFILE: Kkumdori character illustration with friendly intro note.
 * 2. TODAY IS...: Daily travel mood memo with mini-homepage visit counters.
 * 3. BGM PLAYING: Retro music player widget with track info and control buttons.
 */
export function LeftSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="미니홈피 프로필 및 메모 (Left Sidebar)"
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* 1. MY PROFILE (Character & Welcome Memo) */}
      <section
        aria-label="MY PROFILE"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            {/* Production Manifest clover replaces the standalone cat glyph. 16px matches the
                glyph it replaces and the MY PROFILE heading hierarchy -- deliberately NOT the
                right rail's 20px box, so MY PROFILE (16px) stays distinct from VISITOR LOG (20px).
                Reuses the existing decoration.symbol.clover opaque-fit entry. The cat's
                role="img"/aria-label is intentionally dropped: FittedAsset marks it aria-hidden and
                the adjacent <h2>MY PROFILE</h2> already names the section. */}
            <FittedAsset assetKey="decoration.symbol.clover" className="h-4 w-4 shrink-0" />
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              MY PROFILE
            </h2>
          </div>
        </div>

        {/* Profile Card Body: Avatar + Welcome Text */}
        <div className="flex items-center gap-3.5">
          {/* Standing Kkumdori Illustration */}
          <div className="relative flex h-20 w-16 sm:h-24 sm:w-20 shrink-0 items-center justify-center rounded-xl border border-[#d8d0c2] bg-[#fffdf0] p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visualAsset('character.main.kkumdori')}
              alt="꿈돌이"
              className="h-full w-auto object-contain select-none"
            />
          </div>

          {/* Welcome Message */}
          <div className="flex flex-col gap-1 text-[#2b2520]">
            <p className="text-sm sm:text-base font-black text-[#2b2520]">
              반가워요! 👋
            </p>
            <p className="text-xs sm:text-sm font-medium leading-tight text-[#5c5244]">
              대전 랜덤여행 미니홈피에 오신 걸 환영해요!
            </p>
            <p className="text-xs font-bold text-[#8c8273]">
              오늘은 어떤 대전의 매력을 발견하게 될까요? ✨
            </p>
          </div>
        </div>
      </section>

      {/* 2. TODAY IS... (Daily Mood Memo & Visitor Counter) */}
      <section
        aria-label="TODAY IS..."
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffdf0] p-4 sm:p-5"
      >
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
            TODAY IS...
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm sm:text-base font-black text-[#2b2520] leading-snug">
            설레는 대전 여행 가는 날! 💕
          </p>

          <div className="flex items-center justify-between rounded-xl bg-[#faf6ee] px-3 py-2 font-mono text-xs font-bold text-[#6b6257] border border-[#e8dfd0]">
            <span>TOTAL VISIT : 01234</span>
            <span>TODAY : 0056</span>
          </div>
        </div>
      </section>

      {/* 3. BGM PLAYING (Retro Web Music Player) */}
      <section
        aria-label="BGM PLAYING"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5"
      >
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            {/* Production music-note artwork (Figma 06_MEDIA). The asset is only
                52.7% x 59.1% opaque, so at the previous 16px box it rendered ~10px of
                actual note; FittedAsset compensates so the 22px box is 22px of artwork.
                Visual only -- the track metadata, equalizer and transport controls below
                are untouched, as is playback behavior. */}
            <FittedAsset assetKey="media.musicNote" className="h-[22px] w-[22px] shrink-0" />
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              BGM PLAYING
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#2b2520] leading-tight">
                대전의 오후 (Daejeon Afternoon)
              </span>
              <span className="font-mono text-xs font-bold text-[#8c8273]">
                by DAEJEON BEAT
              </span>
            </div>

            {/* Graphic Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
              <span className="w-1 h-2 bg-[#10b981] rounded-xs" />
              <span className="w-1 h-3.5 bg-[#ffb800] rounded-xs" />
              <span className="w-1 h-2.5 bg-[#ff5555] rounded-xs" />
              <span className="w-1 h-4 bg-[#10b981] rounded-xs" />
            </div>
          </div>

          {/*
            Retro Media Player Controls -- production composite (Figma Media/Playback/Controls).

            The 238x53 export is ONE image containing all four controls together with their
            own tray background and per-button chrome, so it is never split or cropped, and
            the previous CSS tray (bg / border / rounded / padding) is gone: keeping it would
            nest two trays. `max-w-[238px]` means the artwork is never upscaled past native,
            which keeps this row ~53px tall against the 54px it replaced -- the left column's
            vertical budget is unaffected.

            The four <button>s below are the SAME contract as before: transparent hit regions
            over the painted controls, in painted left-to-right order, each individually
            focusable with its own aria-label, and each still WITHOUT a handler. Their
            left/width percentages are measured from the export (columns differing from the
            tray colour), not estimated:
              previous  x 22..60   -> 9.24% / 16.39%
              pause     x 74..113  -> 31.09% / 16.81%
              next      x 125..162 -> 52.52% / 15.97%
              stop      x 176..213 -> 73.95% / 15.97%

            SCOPE: visual layer only. No <audio>, no playback state, no handlers, and this
            file stays a Server Component. Functional BGM playback is deferred to a dedicated
            future feature branch -- it is not implemented, changed or removed here.
          */}
          <div className="relative mx-auto w-full max-w-[238px]">
            <FittedAsset assetKey="media.playbackControls" className="h-auto w-full" />

            {[
              { label: 'Previous track', left: '9.24%', width: '16.39%' },
              { label: 'Pause track', left: '31.09%', width: '16.81%' },
              { label: 'Next track', left: '52.52%', width: '15.97%' },
              { label: 'Stop track', left: '73.95%', width: '15.97%' },
            ].map((control) => (
              <button
                key={control.label}
                type="button"
                aria-label={control.label}
                style={{ left: control.left, width: control.width }}
                className="absolute inset-y-0 cursor-pointer rounded-lg bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#ff5555]"
              />
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}
