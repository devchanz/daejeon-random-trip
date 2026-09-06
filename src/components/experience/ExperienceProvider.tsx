'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  INITIAL_EXPERIENCE_STATE,
  experienceReducer,
  startIntro,
  startSpin,
  completeSpin,
  restoreResult,
  type ExperienceAction,
  type ExperienceState,
  createInitialRerollState,
  getOrCreateRerollSessionState,
  unlockRerollReward,
  consumeRerollReward,
  type RerollSessionState,
  readTripSession,
  saveTripSession,
  consumeComposeHandoff,
} from '../../lib/experience';
import {
  generateRoute,
  RecommendationEngineError,
  type Zone,
  type PlaceCandidate,
  type RouteResult,
} from '../../lib/random';
import type { GuestbookEntryRecord } from '../../lib/database/types';
import { MOTION_TIMINGS, getMotionTimings, usePrefersReducedMotion } from './motionConfig';
import { pushDataLayerEvent } from '../../lib/analytics';

export interface ExperienceProviderProps {
  children: React.ReactNode;
  initialState?: ExperienceState;
  zones?: Zone[];
  candidates?: PlaceCandidate[];
  /** Full-motion spin duration override (test/injection seam). Ignored when the user prefers reduced motion -- that path uses its own timing table (see motionConfig.ts). */
  spinDurationMs?: number;
  random?: () => number;
  onSpinStart?: () => void;
  onSpinComplete?: (result: RouteResult) => void;
}

export interface ExperienceEngine {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
  rerollState: RerollSessionState;
  recommendationError: string | null;
  isGuestbookOpen: boolean;
  isRouteGuideOpen: boolean;
  setIsGuestbookOpen: (open: boolean) => void;
  setIsRouteGuideOpen: (open: boolean) => void;
  pendingResult: RouteResult | null;
  spinningStoppedReelCount: number;
  isLeverActive: boolean;
  isRevealEmphasis: boolean;
  revealStage: 'hidden' | 'peek' | 'revealed' | 'minimized';
  stoppedReelCount: number;
  hasLoggedCurrentResult: boolean;
  reopenButtonRefs: React.MutableRefObject<Set<HTMLButtonElement>>;
  handleStartIntro: () => void;
  handleSpin: () => void;
  handleExecuteReroll: () => void;
  handleGuestbookSuccess: (entry: GuestbookEntryRecord) => void;
  handleMinimizeResult: () => void;
  handleReopenResult: () => void;
  handleExploreMore: () => void;
  handleScrollToHero: () => void;
}

/**
 * Shared marker attribute on the two page-level TODAY'S DAEJEON rail wrappers
 * (desktop column + mobile `#mobile-right-rail`, see page.tsx). `RightSidebar`
 * itself dual-mounts (desktop/mobile), so this can never live inside it --
 * exactly the same reason the existing `#mobile-right-rail` id lives on the
 * page's own mobile wrapper rather than the component. Resolving "which one
 * is visible" at click time via `offsetParent` (instead of a hardcoded
 * `min-width` breakpoint check) means this behavior automatically tracks
 * whichever CSS rule (`hidden lg:flex` / `lg:hidden`) actually governs
 * visibility, rather than re-encoding that rule a second time here.
 */
export const TODAYS_DAEJEON_RAIL_ATTR = 'data-today-daejeon-rail';

/**
 * Marker on the hero (`MainExperience`) root -- the counterpart of
 * TODAYS_DAEJEON_RAIL_ATTR, for the opposite direction of travel: the Memory Log
 * write affordance's `코스 뽑기` sends a reader who has no route yet back up into the
 * existing Q1/Q2/Spin flow. `MainExperience` dual-mounts exactly like the rail
 * does, so "which one is visible" is resolved the same way (offsetParent at
 * click time), never by re-encoding the `lg:` breakpoint a second time.
 */
export const HERO_EXPERIENCE_ATTR = 'data-hero-experience';

const ExperienceContext = createContext<ExperienceEngine | null>(null);

/**
 * ExperienceProvider -- the SINGLE authoritative experience engine, mounted
 * exactly once (see page.tsx), shared by both the desktop and mobile
 * `MainExperience` (Hero) presentations.
 *
 * WHY THIS EXISTS (cross-breakpoint continuity, docs/DECISIONS.md ADR-036):
 * page.tsx dual-mounts the responsive Hero presentation with pure CSS
 * `hidden lg:flex` / `lg:hidden` -- neither tree ever unmounts on resize.
 * Before this provider existed, EACH Hero owned its own `useReducer` and its
 * own spin/peek timers, so whichever tree the user had not interacted with
 * sat idling at `phase:'intro'` since first paint; crossing 1024px swapped
 * which of two independently-live, never-synchronized state machines was
 * painted, losing READY/SPINNING/PEEK/RESULT entirely. Centralizing every
 * piece of state, every timer, and every handler here -- so there is
 * structurally only one of each, regardless of which Hero is visible --
 * removes the defect at its source rather than working around it. This
 * mirrors the codebase's own existing precedent for "must mount twice, must
 * behave as one": `BgmProvider` (src/lib/audio/bgmContext.tsx) already owns
 * a single `<audio>` element and a single playback state for the same two
 * permanently dual-mounted trees, for the identical stated reason.
 *
 * Every effect/timer below is a SINGLE INSTANCE by construction (this
 * component is mounted once) -- see ADR-036's dual-mount audit for why every
 * other timer/effect/listener remaining in the duplicated Hero components
 * (IntroGate's exit timer, the reopen-button focus effect) either can only
 * ever be triggered by a real DOM click (impossible on a `display:none`
 * subtree) or never mutates this engine's state at all.
 */
export function ExperienceProvider({
  children,
  initialState = INITIAL_EXPERIENCE_STATE,
  zones = [],
  candidates = [],
  spinDurationMs = MOTION_TIMINGS.TOTAL_SPIN_MS,
  random,
  onSpinStart,
  onSpinComplete,
}: ExperienceProviderProps) {
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
  // Mirrored into this tab's trip session together with state.result (ADR-043,
  // tripSession.ts) -- both used to be memory-only, so leaving `/` for
  // /random-log and coming back forgot the route AND whether it had been logged.
  const [loggedRouteIds, setLoggedRouteIds] = useState<Set<string>>(() => new Set());

  // Presentation-only engine state
  const [pendingResult, setPendingResult] = useState<RouteResult | null>(null);
  const [spinningStoppedReelCount, setSpinningStoppedReelCount] = useState<number>(0);
  const [isLeverActive, setIsLeverActive] = useState<boolean>(false);
  const [isRevealEmphasis, setIsRevealEmphasis] = useState<boolean>(false);
  // Result/Ticket output presentation lifecycle:
  //   hidden -> peek (Slot Peek cavity emergence) -> revealed (Result Card) <-> minimized (결과 접기)
  // 'minimized' is presentation-only, like every other value here: it never touches the
  // reducer or state.result (see ResultArea.tsx docstring for the full minimize contract).
  const [revealStage, setRevealStage] = useState<'hidden' | 'peek' | 'revealed' | 'minimized'>(
    'hidden'
  );

  // Monotonically incremented on every new spin/reroll (the two entry points that
  // reset revealStage to 'hidden') so a stale peek-completion timer/listener from a
  // superseded run can never fire against a newer one. See the peek effect below.
  const peekRunRef = useRef(0);

  // User motion preference
  const prefersReducedMotion = usePrefersReducedMotion();

  // Focus targets for the reopen affordance rendered inside each Hero's SlotAnchor
  // helper band. Both Hero instances register their own button here; on minimize we
  // focus whichever one is actually visible/focusable (the other is inside a
  // `display:none` ancestor, so focusing it is a documented no-op).
  const reopenButtonRefs = useRef<Set<HTMLButtonElement>>(new Set());

  // Previous revealStage, so the minimize-focus effect below can tell a genuine
  // 결과 접기 from a session restore that simply starts out minimized.
  const previousRevealStageRef = useRef(revealStage);

  // TRIP RESTORE (tab-session scoped -- see src/lib/experience/tripSession.ts).
  //
  // This provider is mounted only on `/`, so walking to `/random-log` and back
  // unmounts the reducer and forgets the route the reader just generated -- and
  // with it whether that route had been logged, which the Memory Log write
  // affordance (ADR-042) depends on. Restoring here rebuilds exactly that, and nothing else.
  //
  // NOT A GENERATION: no route is recommended, no spin runs, revealStage never
  // enters 'peek', and NO analytics is dispatched -- `spin`/`reroll` live in
  // their own handlers and `result_view` fires only from the peek->revealed
  // transition below, which this path never triggers. A restored trip is the
  // same trip, not a new conversion.
  //
  // Comes back MINIMIZED, not revealed: the reader navigated back to the page,
  // they did not ask for the Result Card to be thrown at them. The existing
  // "내 여행 티켓 다시 보기" affordance (SlotAnchor's helper band) is how they
  // reopen it -- unchanged, and the same control a manual 결과 접기 leaves behind.
  //
  // Runs once on mount, after paint, exactly like the rerollState sync above, so
  // SSR and the first client render both still produce the pristine INTRO markup
  // (no hydration mismatch). RESTORE_RESULT is additionally guarded to the
  // 'intro' phase in the reducer, so a StrictMode double-invoke cannot double-apply.
  useEffect(() => {
    // Read (and strip) the handoff marker first, unconditionally, so a `/`
    // arrival with no restorable trip still leaves a clean address bar.
    const requestedComposer = consumeComposeHandoff();

    const restored = readTripSession();
    if (!restored) return;

    dispatch(restoreResult(restored.result));
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoggedRouteIds(new Set(restored.loggedRouteIds));
    setRevealStage('minimized');

    // COMPOSER HANDOFF from /random-log's `기록 남기기` (ADR-044): open the ONE
    // existing composer against the just-restored route -- no second composer,
    // no second submit path, and no analytics (only a confirmed submission ever
    // dispatches random_log_submit, from inside GuestbookComposer as before).
    // Ignored when that route has already been logged, so a hand-edited or
    // re-shared URL can never reopen the composer for an entry that exists.
    if (requestedComposer && !restored.loggedRouteIds.includes(restored.result.id)) {
      setIsGuestbookOpen(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // TRIP PERSIST. Writes whenever the current Result changes (initial spin and
  // every reroll alike -- route B replaces route A) or its logged status changes.
  // Never writes an empty trip, so the pre-restore first render cannot clobber
  // what the restore effect above is about to read.
  useEffect(() => {
    if (state.phase !== 'result' || !state.result) return;
    saveTripSession(state.result, Array.from(loggedRouteIds));
  }, [state.phase, state.result, loggedRouteIds]);

  // Derived stopped reel count: 3 when in result, spinningStoppedReelCount when spinning, 0 otherwise
  const stoppedReelCount =
    state.phase === 'result' ? 3 : state.phase === 'spinning' ? spinningStoppedReelCount : 0;

  // Handle spin presentation lifecycle & sequential reel stops.
  // Single instance (this provider is mounted once): exactly one COMPLETE_SPIN
  // dispatch per spin, exactly one stopped-reel progression, regardless of which
  // Hero presentation is currently visible.
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

    // Single lifecycle path for both motion preferences: motion preference selects
    // WHICH timing table drives the sequence, never whether the sequence happens.
    // Visual motion (CSS, suppressed via prefers-reduced-motion in globals.css) is
    // independent from this product-state clock (plain setTimeout beats -- see
    // this file's docstring). `spinDurationMs` is a test/injection seam whose
    // default is the full-motion total; honoring it under reduced motion would
    // re-inflate the sequence back to the full-motion length, so reduced motion
    // always uses its own table's total instead.
    const timings = getMotionTimings(prefersReducedMotion);
    const minSpinDurationMs = timings.REEL_3_STOP_MS + timings.FINAL_BEAT_MS;
    const effectiveSpinDurationMs = prefersReducedMotion
      ? minSpinDurationMs
      : Math.max(spinDurationMs, minSpinDurationMs);

    // 1. Lever returns to rest position
    schedule(() => {
      setIsLeverActive(false);
    }, timings.LEVER_PULL_MS);

    // 2. Reel 1 stops
    schedule(() => {
      setSpinningStoppedReelCount(1);
    }, timings.REEL_1_STOP_MS);

    // 3. Reel 2 stops
    schedule(() => {
      setSpinningStoppedReelCount(2);
    }, timings.REEL_2_STOP_MS);

    // 4. Reel 3 stops
    schedule(() => {
      setSpinningStoppedReelCount(3);
    }, timings.REEL_3_STOP_MS);

    // 5. Short final beat -> Complete spin, trigger reveal emphasis & enter Peek
    schedule(() => {
      dispatch(completeSpin(pendingResult));
      onSpinComplete?.(pendingResult);
      setIsRevealEmphasis(true);
      setRevealStage('peek');
    }, effectiveSpinDurationMs);

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

  // Slot Peek -> Result Card reveal: the SOLE completion authority for the Fixed
  // 300-500ms product beat (docs/PRODUCT.md 5.1, docs/ARCHITECTURE.md 5.1), plus a
  // deadline-reconciliation contract for backgrounded/suspended tabs (ADR-036).
  //
  // Deliberately its own effect (not part of the spin effect above), because that
  // effect is keyed on state.phase and tears down (clearing all pending timers) the
  // instant completeSpin flips the phase to 'result' -- a timer scheduled there
  // would never fire.
  //
  // COMPLETION AUTHORITY: a plain setTimeout, never requestAnimationFrame (stops in
  // background tabs) and never animationend/transitionend (cancelled and never
  // delivered in a display:none subtree -- and this codebase has none of those
  // listeners at all). `reconcile` is idempotent twice over: the run-token guard
  // (rejects a superseded run) and the functional updater (no-op unless still
  // 'peek'), so the timer firing and the visibilitychange reconciliation below can
  // never together produce a double transition.
  //
  // DEADLINE CLOCK: Date.now() (wall-clock), deliberately not performance.now().
  // The question this deadline answers is "has 400ms of REAL elapsed time passed
  // while the page may have been backgrounded or the device suspended" -- and a
  // navigation-relative monotonic clock can itself pause across a true OS-level
  // suspend, which would make an overdue peek misreport as not-overdue right when
  // this check needs to catch it. Date.now() is anchored to the system real-time
  // clock, which keeps advancing through a suspend by definition. The classic
  // objection to Date.now() (NTP/manual clock jumps) doesn't apply: this check is
  // never the sole completion authority -- the setTimeout above still runs
  // independently -- so a clock jump can only affect whether this optimization
  // fires early/late, never whether the transition completes at all.
  useEffect(() => {
    if (revealStage !== 'peek') return;

    const timings = getMotionTimings(prefersReducedMotion);
    const run = peekRunRef.current;
    const deadline = Date.now() + timings.OUTPUT_PEEK_TO_CARD_MS;
    // Scoped to this effect instance (one per peek run): guarantees result_view
    // dispatches at most once per run even though `reconcile` may itself run
    // twice (the timer AND a post-deadline visibilitychange reconciliation).
    let resultViewDispatched = false;

    const reconcile = () => {
      if (peekRunRef.current !== run) return; // guard 1: superseded run
      setRevealStage((prev) => (prev === 'peek' ? 'revealed' : prev)); // guard 2: idempotent no-op

      // result_view: fires exactly once per genuine peek -> revealed
      // transition -- never on ResultArea's own render/reopen-from-minimized
      // (that path never re-enters 'peek', so this effect never re-runs for it).
      if (!resultViewDispatched && state.result) {
        resultViewDispatched = true;
        pushDataLayerEvent('result_view', {
          route_id: state.result.id,
          zone_id: state.result.zoneId,
          stop_count: state.result.stops?.length,
          duration_type: state.duration,
          preference_type: state.preference,
        });
      }
    };

    const revealTimer = setTimeout(reconcile, timings.OUTPUT_PEEK_TO_CARD_MS);

    // Reconciliation path: if the page was backgrounded/frozen and resumes AFTER
    // the deadline has already passed, complete immediately instead of waiting for
    // a possibly still-throttled/clamped timer to get around to firing. Never the
    // only path to completion -- purely removes visible lag on resume.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && Date.now() >= deadline) {
        reconcile();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(revealTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
    // `state` is intentionally omitted: this effect must re-run ONLY on the
    // peek/reduced-motion transitions above, never on every state change
    // during an active peek run. By the time `revealStage` flips to 'peek'
    // (the dependency that actually re-triggers this effect), `completeSpin`
    // has already been dispatched in the same batch, so the closure's
    // `state.result`/`state.duration`/`state.preference` are already the
    // fresh post-spin values -- see the spin effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealStage, prefersReducedMotion]);

  // On minimize (결과 접기), move focus onto whichever Hero's reopen affordance is
  // actually visible/focusable -- the hidden Hero's button lives inside a
  // display:none ancestor, so calling .focus() on it is a documented no-op, and
  // calling it on every registered button is therefore safe (at most one has any
  // effect). ResultArea's own card unmounts its focus target (display:none), so
  // without this, focus would fall to <body>.
  //
  // Only a real 결과 접기 ('revealed' -> 'minimized') moves focus. A restored trip
  // (see the restore effect above) *starts* at 'minimized' without any user
  // action, and focusing the reopen button there would steal focus -- and scroll
  // the page to the Slot -- the moment the reader lands back on `/`.
  useEffect(() => {
    const previousStage = previousRevealStageRef.current;
    previousRevealStageRef.current = revealStage;

    if (revealStage !== 'minimized' || previousStage !== 'revealed') {
      return;
    }

    for (const button of reopenButtonRefs.current) {
      button.focus();
    }
  }, [revealStage]);

  // INTRO soft entry gate -> Q1. See IntroGate.tsx; the gate itself delays
  // this call by its own exit-transition duration, so by the time it fires
  // the overlay has already faded/scaled out.
  const handleStartIntro = () => {
    pushDataLayerEvent('intro_start');
    dispatch(startIntro());
  };

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
      peekRunRef.current += 1;
      setPendingResult(generated);
      setSpinningStoppedReelCount(0);
      setIsLeverActive(true);
      setRevealStage('hidden');

      // spin: the initial valid route-generation spin only -- the rewarded
      // reroll dispatches its own separate `reroll` event below, never this one.
      pushDataLayerEvent('spin', {
        duration_type: state.duration,
        preference_type: state.preference,
      });

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

  // Rewarded 1-time reroll action triggered from Result (ResultActions)
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
      peekRunRef.current += 1;
      setRerollState(nextReroll);
      setPendingResult(generated);
      setSpinningStoppedReelCount(0);
      setIsLeverActive(true);
      setRevealStage('hidden');

      // reroll: fires instead of (never alongside) `spin` for this action --
      // referenced against the result being left behind, since result_view
      // will separately fire once the NEW result is revealed.
      pushDataLayerEvent('reroll', {
        route_id: state.result.id,
        zone_id: state.result.zoneId,
      });

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
  const hasLoggedCurrentResult = Boolean(state.result && loggedRouteIds.has(state.result.id));

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

  // Scrolls to whichever mount of a dual-mounted, attribute-marked landmark is
  // actually on screen. Shared by handleExploreMore (-> rail) and
  // handleScrollToHero (-> hero); page.tsx dual-mounts both landmarks with pure
  // CSS, so at most one of each has a non-null offsetParent at any time.
  const scrollToVisibleMarked = (markerAttr: string) => {
    if (typeof window === 'undefined') return;

    requestAnimationFrame(() => {
      const marked = Array.from(document.querySelectorAll<HTMLElement>(`[${markerAttr}]`));
      const visible = marked.find((el) => el.offsetParent !== null);
      if (!visible) return;

      visible.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });

      // Optional a11y landing: move focus onto the visible wrapper itself
      // (tabIndex={-1} + outline-none, see page.tsx / MainExperience) -- the same
      // "focus the container, not the first control" pattern ResultArea's own
      // dialog already uses, so a screen reader announces the section without
      // a visible focus ring appearing around it.
      visible.focus();
    });
  };

  // ExploreMore (half-day 4th cell, "대전 더 둘러보기"): minimizes Result --
  // never resets/discards it, same non-destructive contract as 결과 접기 above
  // -- then scrolls to whichever TODAY'S DAEJEON rail wrapper is currently
  // visible. Never both: page.tsx dual-mounts the responsive rail exactly
  // like it dual-mounts MainExperience, so at most one marked wrapper has a
  // non-null offsetParent at a time.
  const handleExploreMore = () => {
    // Fired first, before any minimize/scroll side effect below.
    pushDataLayerEvent('explore_more_click', {
      route_id: state.result?.id,
      zone_id: state.result?.zoneId,
    });

    if (revealStage === 'revealed') {
      setRevealStage('minimized');
    }

    // Deferred one frame (inside scrollToVisibleMarked): the Result overlay's
    // display:none (from the minimize above) must actually apply before
    // scrollIntoView measures layout, otherwise a still-scroll-locked/overlay-
    // obscured document can resolve a stale target position.
    scrollToVisibleMarked(TODAYS_DAEJEON_RAIL_ATTR);
  };

  // Memory Log action's `코스 뽑기` / post-log `다시 뽑기`: brings the hero back on
  // screen so the Setup card (or the spin that was just started) is actually
  // visible. Deliberately fires NO analytics -- it is a scroll, not an
  // `intro_start`, and it never touches phase, Result, or reward state.
  const handleScrollToHero = () => {
    scrollToVisibleMarked(HERO_EXPERIENCE_ATTR);
  };

  const engine: ExperienceEngine = {
    state,
    dispatch,
    rerollState,
    recommendationError,
    isGuestbookOpen,
    isRouteGuideOpen,
    setIsGuestbookOpen,
    setIsRouteGuideOpen,
    pendingResult,
    spinningStoppedReelCount,
    isLeverActive,
    isRevealEmphasis,
    revealStage,
    stoppedReelCount,
    hasLoggedCurrentResult,
    reopenButtonRefs,
    handleStartIntro,
    handleSpin,
    handleExecuteReroll,
    handleGuestbookSuccess,
    handleMinimizeResult,
    handleReopenResult,
    handleExploreMore,
    handleScrollToHero,
  };

  return <ExperienceContext.Provider value={engine}>{children}</ExperienceContext.Provider>;
}

/** Consumes the single shared experience engine. Must be used inside `ExperienceProvider`. */
export function useExperienceEngine(): ExperienceEngine {
  const engine = useContext(ExperienceContext);
  if (!engine) {
    throw new Error('useExperienceEngine must be used within an ExperienceProvider');
  }
  return engine;
}
