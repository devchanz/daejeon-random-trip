'use client';

export { MainExperience, type MainExperienceProps } from './MainExperience';
export {
  ExperienceProvider,
  useExperienceEngine,
  type ExperienceProviderProps,
  type ExperienceEngine,
} from './ExperienceProvider';
export { ExperienceOverlays } from './ExperienceOverlays';
export { SetupArea } from './SetupArea';
export { OptionButton } from './OptionButton';
export { SlotAnchor, type SlotAnchorProps } from './SlotAnchor';
export { ResultArea, type ResultAreaProps } from './ResultArea';
export {
  MOTION_TIMINGS,
  REDUCED_MOTION_TIMINGS,
  getMotionTimings,
  NEUTRAL_ROLLING_SYMBOLS,
  usePrefersReducedMotion,
} from './motionConfig';
