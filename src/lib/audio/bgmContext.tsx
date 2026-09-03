'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BGM_TRACK_SRC } from '../../config/audio';

export interface BgmContextValue {
  /** Derived from the audio element's own `play`/`pause` events -- never assumed. */
  isPlaying: boolean;
  /**
   * Starts playback once, synchronously with the caller's own gesture (see
   * IntroGate.handleStart). Idempotent: a second/stray call is a no-op once
   * playback has genuinely started.
   */
  startPlayback: () => void;
  /** Pause <-> resume-from-current-position. */
  togglePlayback: () => void;
}

const BgmContext = createContext<BgmContextValue | null>(null);

/**
 * Owns the single shared `<audio>` element and playback state for the whole
 * page (desktop + mobile stages both consume this, see src/app/page.tsx --
 * MainExperience/LeftSidebar/IntroGate all mount twice, but there is only
 * ever one audio element and one playback state).
 */
export function BgmProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const value = useMemo<BgmContextValue>(
    () => ({
      isPlaying,
      startPlayback: () => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;
        const audio = audioRef.current;
        if (!audio) return;
        audio.play().catch(() => {
          // Rejected (autoplay policy, load failure, etc.) -- allow a later
          // retry (e.g. via the Play/Pause control) instead of latching a
          // permanently-broken "already started" state. `isPlaying` is
          // event-derived, so it already correctly stays false here.
          hasStartedRef.current = false;
        });
      },
      togglePlayback: () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
          hasStartedRef.current = true;
          audio.play().catch(() => {
            hasStartedRef.current = false;
          });
        } else {
          audio.pause();
        }
      },
    }),
    [isPlaying]
  );

  return (
    <BgmContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={BGM_TRACK_SRC} loop preload="metadata" />
    </BgmContext.Provider>
  );
}

/** Consumes the shared BGM playback state. Must be used under `BgmProvider`. */
export function useBgm(): BgmContextValue {
  const ctx = useContext(BgmContext);
  if (!ctx) {
    throw new Error('useBgm must be used within a BgmProvider');
  }
  return ctx;
}
