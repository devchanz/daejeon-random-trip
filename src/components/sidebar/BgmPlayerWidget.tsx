'use client';

import React from 'react';
import { FittedAsset } from '../common';
import { BGM_PLAYING_COPY } from '../../content/sidebar';
import { useBgm } from '../../lib/audio/bgmContext';
import { usePrefersReducedMotion } from '../experience/motionConfig';

/**
 * Equalizer bar visual spec (height/color), unchanged from the prior static
 * presentation -- only the animation behavior below is new.
 */
const EQUALIZER_BARS = [
  { height: 'h-2', color: 'bg-[#10b981]', duration: '0.9s', delay: '0s' },
  { height: 'h-3.5', color: 'bg-[#ffb800]', duration: '1.1s', delay: '0.15s' },
  { height: 'h-2.5', color: 'bg-[#ff5555]', duration: '0.8s', delay: '0.3s' },
  { height: 'h-4', color: 'bg-[#10b981]', duration: '1s', delay: '0.05s' },
] as const;

/**
 * Interactive BGM control surface (track info, equalizer, playback
 * controls), extracted from LeftSidebar.tsx so the sidebar's outer shell can
 * stay a Server Component. Consumes the single shared BgmProvider -- see
 * src/lib/audio/bgmContext.tsx -- so it reflects the same playback state
 * regardless of which responsive stage (desktop/mobile) it renders inside.
 */
export function BgmPlayerWidget() {
  const { isPlaying, togglePlayback } = useBgm();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-black text-[#2b2520] leading-tight">
            {BGM_PLAYING_COPY.trackTitle}
          </span>
          <span className="font-mono text-xs font-bold text-[#8c8273]">
            {BGM_PLAYING_COPY.trackArtist}
          </span>
        </div>

        {/* Graphic Equalizer Bars -- the animation stays mounted at all times
            (never conditionally applied) and only `animation-play-state`
            toggles, so pausing visibly freezes the bars mid-cycle instead of
            resetting to a default static frame. Reduced motion never applies
            the animation at all and the bars just sit at their base heights. */}
        <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
          {EQUALIZER_BARS.map((bar, index) => (
            <span
              key={index}
              className={`w-1 ${bar.height} ${bar.color} rounded-xs origin-bottom`}
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      animationName: 'eq-bounce',
                      animationDuration: bar.duration,
                      animationDelay: bar.delay,
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationPlayState: isPlaying ? 'running' : 'paused',
                    }
              }
            />
          ))}
        </div>
      </div>

      {/*
        Retro Media Player Controls -- production composite (Figma Media/Playback/Controls),
        swapped between two pixel-identical-geometry states by playback state:
        playing -> media.playbackControls (Pause artwork, Figma 352:166),
        paused  -> media.playbackControlsPlay (Play artwork, Figma 377:170,
        normalized onto the same canvas -- see visualAssets.ts). Both assets
        share identical outer geometry (1662x370 / 238x53), so the swap causes
        zero layout shift.

        Only the center ("Pause track"/"Play track") region is a real,
        focusable <button> -- the sole interactive playback control per the
        BGM contract. Previous/Next/Stop are decoration only: plain
        aria-hidden regions with no button semantics, no tabIndex, no
        onClick, and no pointer/focus affordance.
      */}
      <div className="relative mx-auto w-full max-w-[238px]">
        <FittedAsset
          assetKey={isPlaying ? 'media.playbackControls' : 'media.playbackControlsPlay'}
          className="h-auto w-full"
        />

        {BGM_PLAYING_COPY.decorativeControls.map((control) => (
          <div
            key={control.label}
            aria-hidden="true"
            style={{ left: control.left, width: control.width }}
            className="absolute inset-y-0"
          />
        ))}

        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause track' : 'Play track'}
          style={{
            left: BGM_PLAYING_COPY.playPauseControl.left,
            width: BGM_PLAYING_COPY.playPauseControl.width,
          }}
          className="absolute inset-y-0 cursor-pointer rounded-lg bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#ff5555]"
        />
      </div>
    </div>
  );
}
