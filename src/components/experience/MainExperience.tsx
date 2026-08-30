'use client';

import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  INITIAL_EXPERIENCE_STATE,
  experienceReducer,
  startSpin,
  completeSpin,
  type ExperienceState,
  createInitialRerollState,
  getOrCreateRerollSessionState,
  unlockRerollReward,
  consumeRerollReward,
  type RerollSessionState,
} from '../../lib/experience';
import {
  generateRoute,
  RecommendationEngineError,
  type Zone,
  type PlaceCandidate,
  type RouteResult,
} from '../../lib/random';
import type { GuestbookEntryRecord } from '../../lib/database/types';
import { normalizeRouteResult } from '../../lib/guide';
import { GuestbookComposer } from '../guestbook';
import { RouteGuideModal } from '../guide';
import { SetupArea } from './SetupArea';
import { SlotAnchor } from './SlotAnchor';
import { ResultArea } from './ResultArea';
import {
  MOTION_TIMINGS,
  usePrefersReducedMotion,
} from './motionConfig';

export interface MainExperienceProps {
  initialState?: ExperienceState;
  zones?: Zone[];
  candidates?: PlaceCandidate[];
  spinDurationMs?: number;
  random?: () => number;
  onSpinStart?: () => void;
  onSpinComplete?: (result: RouteResult) => void;
  className?: string;
}

/**
 * MainExperience orchestration layer.
 * Coordinates Q1 -> Q2 -> READY -> SPINNING -> RESULT lifecycle.
 * Manages lever visual feedback, sequential reel stops, pending RouteResult,
 * temporary reveal emphasis, and user-triggered viewport choreography without polluting domain state models.
 */
export function MainExperience({
  initialState = INITIAL_EXPERIENCE_STATE,
  zones = [],
  candidates = [],
  spinDurationMs = MOTION_TIMINGS.TOTAL_SPIN_MS,
  random,
  onSpinStart,
  onSpinComplete,
  className = '',
}: MainExperienceProps) {
  const [state, dispatch] = useReducer(experienceReducer, initialState);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  // Travel session & Reroll reward state (backed by sessionStorage)
  // Hydration-safe: deterministic initial state for SSR/first render, restored on mount
  const [rerollState, setRerollState] = useState<RerollSessionState>(() =>
    createInitialRerollState('')
  );

  useEffect(() => {
    // Synchronize client sessionStorage after mount (hydration-safe)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRerollState(getOrCreateRerollSessionState());
  }, []);

  const [isGuestbookOpen, setIsGuestbookOpen] = useState<boolean>(false);
  const [isRouteGuideOpen, setIsRouteGuideOpen] = useState<boolean>(false);

  // Presentation-only local state
  const [pendingResult, setPendingResult] = useState<RouteResult | null>(null);
  const [spinningStoppedReelCount, setSpinningStoppedReelCount] = useState<number>(0);
  const [isLeverActive, setIsLeverActive] = useState<boolean>(false);
  const [isRevealEmphasis, setIsRevealEmphasis] = useState<boolean>(false);

  // User motion preference
  const prefersReducedMotion = usePrefersReducedMotion();

  // Viewport & trigger tracking refs
  const isUserTriggeredSpinRef = useRef<boolean>(false);
  const resultAreaRef = useRef<HTMLElement | null>(null);

  // Derived stopped reel count: 3 when in result, spinningStoppedReelCount when spinning, 0 otherwise
  const stoppedReelCount =
    state.phase === 'result' ? 3 : state.phase === 'spinning' ? spinningStoppedReelCount : 0;

  // Handle spin presentation lifecycle & sequential reel stops
  useEffect(() => {
    if (state.phase !== 'spinning' || !pendingResult) {
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delayMs: number) => {
      const id = setTimeout(fn, delayMs);
      timeouts.push(id);
      return id;
    };

    if (prefersReducedMotion) {
      // Reduced motion: fast sequence
      schedule(() => {
        setIsLeverActive(false);
        setSpinningStoppedReelCount(3);
        dispatch(completeSpin(pendingResult));
        onSpinComplete?.(pendingResult);
      }, MOTION_TIMINGS.REDUCED_MOTION_TOTAL_MS);
    } else {
      // Standard motion sequence: Lever pull -> Reel 1 stop -> Reel 2 stop -> Reel 3 stop -> Complete
      // Guard: Spin completion delay must never fire before all reels have stopped plus final beat
      const minSpinDurationMs =
        MOTION_TIMINGS.REEL_3_STOP_MS + MOTION_TIMINGS.FINAL_BEAT_MS;
      const effectiveSpinDurationMs = Math.max(spinDurationMs, minSpinDurationMs);

      // 1. Lever returns to rest position
      schedule(() => {
        setIsLeverActive(false);
      }, MOTION_TIMINGS.LEVER_PULL_MS);

      // 2. Reel 1 stops
      schedule(() => {
        setSpinningStoppedReelCount(1);
      }, MOTION_TIMINGS.REEL_1_STOP_MS);

      // 3. Reel 2 stops
      schedule(() => {
        setSpinningStoppedReelCount(2);
      }, MOTION_TIMINGS.REEL_2_STOP_MS);

      // 4. Reel 3 stops
      schedule(() => {
        setSpinningStoppedReelCount(3);
      }, MOTION_TIMINGS.REEL_3_STOP_MS);

      // 5. Short final beat -> Complete spin & trigger reveal emphasis
      schedule(() => {
        dispatch(completeSpin(pendingResult));
        onSpinComplete?.(pendingResult);
        setIsRevealEmphasis(true);
      }, effectiveSpinDurationMs);
    }

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [state.phase, pendingResult, spinDurationMs, onSpinComplete, prefersReducedMotion]);

  // Reveal emphasis duration auto-dismiss
  useEffect(() => {
    if (isRevealEmphasis) {
      const timer = setTimeout(() => {
        setIsRevealEmphasis(false);
      }, MOTION_TIMINGS.REVEAL_EMPHASIS_MS);
      return () => clearTimeout(timer);
    }
  }, [isRevealEmphasis]);

  // Viewport choreography: Natural auto-scroll only on user-triggered spin transition to RESULT
  useEffect(() => {
    if (state.phase === 'result' && isUserTriggeredSpinRef.current) {
      isUserTriggeredSpinRef.current = false;

      const timer = setTimeout(() => {
        if (resultAreaRef.current) {
          const rect = resultAreaRef.current.getBoundingClientRect();
          // Avoid jarring jump if Result is already comfortably visible in upper viewport
          const isAlreadyComfortablyVisible =
            rect.top >= 60 && rect.top <= window.innerHeight * 0.4;

          if (!isAlreadyComfortablyVisible) {
            resultAreaRef.current.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [state.phase, prefersReducedMotion]);

  // Primary Spin action triggered from SlotAnchor
  const handleSpin = () => {
    if (state.phase !== 'ready' || !state.duration || !state.preference) {
      return;
    }

    setRecommendationError(null);

    // Validate recommendation data availability
    if (!zones || zones.length === 0 || !candidates || candidates.length === 0) {
      setRecommendationError('추천 데이터를 준비 중이에요.');
      return;
    }

    try {
      // 1. Attempt route generation via Controlled Random Travel engine
      const generated = generateRoute({
        durationType: state.duration,
        preference: state.preference,
        zones,
        candidates,
        random,
      });

      // 2. Prepare pending presentation state and record user-triggered flag
      setPendingResult(generated);
      isUserTriggeredSpinRef.current = true;
      setSpinningStoppedReelCount(0);
      setIsLeverActive(true);

      // 3. Dispatch START_SPIN to initiate spinning presentation
      dispatch(startSpin());
      onSpinStart?.();
    } catch (err) {
      // Recommendation failure: do not transition to SPINNING; remain in READY with user feedback
      const message =
        err instanceof RecommendationEngineError
          ? '현재 조건으로 추천할 수 있는 코스가 없어요.'
          : '추천 코스를 생성하지 못했습니다.';
      setRecommendationError(message);
    }
  };

  // Rewarded 1-time reroll action triggered from ResultSheet
  const handleExecuteReroll = () => {
    // 1. Verify state.phase === 'result', rerollReward === 'available', and session initialized
    if (
      state.phase !== 'result' ||
      rerollState.rerollReward !== 'available' ||
      !rerollState.routeSessionId
    ) {
      return;
    }

    setRecommendationError(null);

    // 2. Verify zones/candidates
    if (!zones || zones.length === 0 || !candidates || candidates.length === 0) {
      setRecommendationError('추천 데이터를 준비 중이에요.');
      return;
    }

    try {
      // 3. Attempt route generation via Controlled Random Travel engine
      const generated = generateRoute({
        durationType: state.duration,
        preference: state.preference,
        zones,
        candidates,
        random,
      });

      // 4. ONLY AFTER route generation succeeds:
      //    Consume reward in session storage (available -> consumed)
      const nextReroll = consumeRerollReward(rerollState.routeSessionId);
      if (!nextReroll) {
        return;
      }

      // 5. Update reroll state, pending result, and start spin presentation
      setRerollState(nextReroll);
      setPendingResult(generated);
      isUserTriggeredSpinRef.current = true;
      setSpinningStoppedReelCount(0);
      setIsLeverActive(true);

      dispatch(startSpin());
      onSpinStart?.();
    } catch (err) {
      // Failed recommendation generation leaves reward as 'available'
      const message =
        err instanceof RecommendationEngineError
          ? '현재 조건으로 추천할 수 있는 코스가 없어요.'
          : '추천 코스를 생성하지 못했습니다.';
      setRecommendationError(message);
    }
  };

  // Callback when guestbook submission successfully writes to persistent DB
  const handleGuestbookSuccess = (entry: GuestbookEntryRecord) => {
    const activeSessionId =
      rerollState.routeSessionId || getOrCreateRerollSessionState().routeSessionId;
    const nextState = unlockRerollReward(activeSessionId, entry.route_id);
    setRerollState(nextState);
  };

  return (
    <div
      data-testid="main-experience"
      className={`relative z-30 flex w-full flex-col items-center gap-6 ${className}`}
    >
      {/* Temporary Reveal Emphasis Backdrop (subtle dim + backdrop-blur, pointer-events-none) */}
      {isRevealEmphasis && (
        <div
          aria-hidden="true"
          data-testid="reveal-emphasis-overlay"
          className="pointer-events-none fixed inset-0 z-20 bg-[#2b2520]/15 backdrop-blur-[1.5px] transition-opacity duration-700 animate-reveal-fade-in motion-reduce:hidden"
        />
      )}

      {/* 1. Setup Area: Q1 -> Q2 -> READY */}
      <SetupArea state={state} dispatch={dispatch} />

      {/* 2. Slot Anchor: Stable visual anchor across READY -> SPINNING -> RESULT */}
      <SlotAnchor
        state={state}
        onSpin={handleSpin}
        errorMessage={state.phase === 'ready' ? recommendationError : null}
        stoppedReelCount={stoppedReelCount}
        pendingResult={pendingResult}
        isLeverActive={isLeverActive}
      />

      {/* 3. Result Area: Inline presentation boundary below slot with responsive scroll anchor */}
      <ResultArea
        ref={resultAreaRef}
        state={state}
        rerollReward={rerollState.rerollReward}
        onOpenGuestbook={() => setIsGuestbookOpen(true)}
        onExecuteReroll={handleExecuteReroll}
        onOpenRouteGuide={() => setIsRouteGuideOpen(true)}
      />

      {/* 4. Guestbook Composer Modal (In-flow modal triggered from Result Card) */}
      {isGuestbookOpen && state.phase === 'result' && state.result && (
        <GuestbookComposer
          routeResult={state.result}
          isOpen={isGuestbookOpen}
          onClose={() => setIsGuestbookOpen(false)}
          onSuccess={handleGuestbookSuccess}
        />
      )}

      {/* 5. Route Guide Modal (In-flow structured itinerary guidance) */}
      {isRouteGuideOpen && state.phase === 'result' && state.result && (
        <RouteGuideModal
          guideData={normalizeRouteResult(state.result)}
          isOpen={isRouteGuideOpen}
          onClose={() => setIsRouteGuideOpen(false)}
        />
      )}
    </div>
  );
}
