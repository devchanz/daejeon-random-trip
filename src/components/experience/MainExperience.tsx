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
 * temporary reveal emphasis, and the output slit peek cue -> Result Card reveal
 * <-> minimize (결과 접기) presentation lifecycle, without polluting domain state models.
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

  // Random Log writing state -- deliberately separate from the reroll reward state
  // machine above. Writing eligibility is "does the *current Result* have a log yet",
  // reward eligibility is "has this *session* claimed its one reroll"; conflating the
  // two is what previously made the composer unreachable once the reward was consumed.
  // Not persisted: state.result itself is never persisted (the reducer always seeds
  // from INITIAL_EXPERIENCE_STATE), so after a reload there is no Result to write about.
  const [loggedRouteIds, setLoggedRouteIds] = useState<Set<string>>(() => new Set());

  // Presentation-only local state
  const [pendingResult, setPendingResult] = useState<RouteResult | null>(null);
  const [spinningStoppedReelCount, setSpinningStoppedReelCount] = useState<number>(0);
  const [isLeverActive, setIsLeverActive] = useState<boolean>(false);
  const [isRevealEmphasis, setIsRevealEmphasis] = useState<boolean>(false);
  // Result/Ticket output presentation lifecycle:
  //   hidden -> peek (output slit cue) -> revealed (Result Card) <-> minimized (결과 접기)
  // 'minimized' is presentation-only, like every other value here: it never touches the
  // reducer or state.result (see ResultArea.tsx docstring for the full minimize contract).
  const [revealStage, setRevealStage] = useState<'hidden' | 'peek' | 'revealed' | 'minimized'>(
    'hidden'
  );

  // User motion preference
  const prefersReducedMotion = usePrefersReducedMotion();

  // Focus target for the reopen affordance rendered inside SlotAnchor's helper band.
  // MainExperience owns revealStage, so it (not ResultArea, not SlotAnchor) is
  // responsible for moving focus onto this button on minimize.
  const reopenButtonRef = useRef<HTMLButtonElement | null>(null);

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
      // Reduced motion: fast sequence, skip the output slit peek cue and reveal the Result Card directly
      schedule(() => {
        setIsLeverActive(false);
        setSpinningStoppedReelCount(3);
        dispatch(completeSpin(pendingResult));
        onSpinComplete?.(pendingResult);
        setRevealStage('revealed');
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

      // 5. Short final beat -> Complete spin, trigger reveal emphasis & output slit peek cue
      schedule(() => {
        dispatch(completeSpin(pendingResult));
        onSpinComplete?.(pendingResult);
        setIsRevealEmphasis(true);
        setRevealStage('peek');
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

  // Result/Ticket output presentation: peek cue -> Result Card reveal.
  // Deliberately its own effect (not part of the spin effect above), because that effect is
  // keyed on state.phase and tears down (clearing all pending timers) the instant completeSpin
  // flips the phase to 'result' -- a timer scheduled there would never fire.
  useEffect(() => {
    if (revealStage === 'peek') {
      const timer = setTimeout(() => {
        setRevealStage('revealed');
      }, MOTION_TIMINGS.OUTPUT_PEEK_TO_CARD_MS);
      return () => clearTimeout(timer);
    }
  }, [revealStage]);

  // On minimize (결과 접기), move focus onto the reopen affordance -- ResultArea's card
  // unmounts its focus target (display:none), so without this, focus would fall to <body>.
  useEffect(() => {
    if (revealStage === 'minimized') {
      reopenButtonRef.current?.focus();
    }
  }, [revealStage]);

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

      // 2. Prepare pending presentation state
      setPendingResult(generated);
      setSpinningStoppedReelCount(0);
      setIsLeverActive(true);
      setRevealStage('hidden');

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
      setSpinningStoppedReelCount(0);
      setIsLeverActive(true);
      setRevealStage('hidden');

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
    // 1. Mark this Result as logged -- independent of reward state, and never
    //    re-unlocks a reroll on a later Result that reuses the same tracking.
    setLoggedRouteIds((prev) => {
      const next = new Set(prev);
      next.add(entry.route_id);
      return next;
    });

    // 2. Reward unlock is unchanged: unlockRerollReward already refuses to
    //    re-unlock once 'consumed' (see rerollSession.ts), so writing a log
    //    against a later Result can never grant a second reroll.
    const activeSessionId =
      rerollState.routeSessionId || getOrCreateRerollSessionState().routeSessionId;
    const nextState = unlockRerollReward(activeSessionId, entry.route_id);
    setRerollState(nextState);
  };

  // Whether the *currently displayed* Result has already had a Random Log
  // submitted against it -- independent of session-wide reroll reward state.
  const hasLoggedCurrentResult = Boolean(
    state.result && loggedRouteIds.has(state.result.id)
  );

  // 결과 접기 (minimize): Result data, share state, and reward/reroll lifecycle are all
  // untouched -- only the presentation stage changes. See ResultArea.tsx for the mount/
  // reveal split this depends on.
  const handleMinimizeResult = () => {
    if (revealStage === 'revealed') {
      setRevealStage('minimized');
    }
  };

  // 내 여행 티켓 (reopen): returns to the same revealed Result Card, unchanged.
  const handleReopenResult = () => {
    if (revealStage === 'minimized') {
      setRevealStage('revealed');
    }
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

      {/* 2. Slot Anchor: Stable visual anchor across READY -> SPINNING -> RESULT.
          Also hosts the "내 여행 티켓" reopen affordance in its helper band while
          Result is minimized -- see SlotAnchor.tsx for why that placement was chosen
          over a viewport-corner floating button. */}
      <SlotAnchor
        state={state}
        onSpin={handleSpin}
        errorMessage={state.phase === 'ready' ? recommendationError : null}
        stoppedReelCount={stoppedReelCount}
        pendingResult={pendingResult}
        isLeverActive={isLeverActive}
        revealStage={revealStage}
        onReopenResult={handleReopenResult}
        reopenButtonRef={reopenButtonRef}
      />

      {/* 3. Result Area: Centered focus overlay (Result Card), revealed after the output slit peek cue.
          isNestedOverlayOpen suspends Result's own Escape/Tab keyboard ownership while
          RouteGuideModal or GuestbookComposer is open above it -- see ResultArea.tsx. */}
      <ResultArea
        state={state}
        revealStage={revealStage}
        rerollReward={rerollState.rerollReward}
        hasLoggedCurrentResult={hasLoggedCurrentResult}
        onOpenGuestbook={() => setIsGuestbookOpen(true)}
        onExecuteReroll={handleExecuteReroll}
        onOpenRouteGuide={() => setIsRouteGuideOpen(true)}
        onMinimize={handleMinimizeResult}
        isNestedOverlayOpen={isGuestbookOpen || isRouteGuideOpen}
      />

      {/* 4. Guestbook Composer Modal (In-flow modal triggered from Result Card) */}
      {isGuestbookOpen && state.phase === 'result' && state.result && (
        <GuestbookComposer
          routeResult={state.result}
          isOpen={isGuestbookOpen}
          // 'locked' is the only reward state in which THIS submission can still
          // unlock the reroll -- mirrors renderRandomLogCTA's own copy branch in
          // ResultSheet.tsx, derived from the same rerollState, never duplicated.
          rewardEligible={rerollState.rerollReward === 'locked'}
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
