/**
 * TEMPORARY SPIKE FIXTURE — remove after slot integration test
 *
 * Local dummy data used ONLY for validating the slot machine animation and
 * spin lifecycle in the browser when ?demo=1 query parameter is active.
 * NOT production data.
 */

import type { Zone, PlaceCandidate } from '../random';
import type { ExperienceState } from '../experience';

/**
 * Temporary mock zone for Daeheung-dong demo.
 */
export const DEMO_ZONES: Zone[] = [
  {
    id: 'daeheung',
    name: '대흥동',
    description: '원도심 문화예술 및 맛집 거리',
    active: true,
  },
];

/**
 * Temporary mock candidates adhering to PlaceCandidate contract.
 * Provides candidates across anchor, meal, discovery, and stay-extender roles
 * to satisfy all RouteTemplate requirements during demo spins.
 */
export const DEMO_CANDIDATES: PlaceCandidate[] = [
  {
    id: 'demo-place-1',
    name: '정동문화사',
    category: '구움과자/디저트',
    zoneId: 'daeheung',
    durationMin: 30,
    tags: ['bakery', 'food', 'dessert', 'anchor', 'discovery'],
    roles: ['discovery', 'anchor'],
    active: true,
  },
  {
    id: 'demo-place-2',
    name: '광천식당',
    category: '두루치기/칼국수',
    zoneId: 'daeheung',
    durationMin: 50,
    tags: ['food', 'meal', 'restaurant', 'dining'],
    roles: ['meal'],
    active: true,
  },
  {
    id: 'demo-place-3',
    name: '대흥동 카페거리',
    category: '카페/산책',
    zoneId: 'daeheung',
    durationMin: 40,
    tags: ['cafe', 'coffee', 'discovery', 'walk', 'stay-extender'],
    roles: ['stay-extender', 'discovery'],
    active: true,
  },
  {
    id: 'demo-place-4',
    name: '대흥동 골목',
    category: '문화/산책',
    zoneId: 'daeheung',
    durationMin: 30,
    tags: ['photo', 'walk', 'discovery', 'alley'],
    roles: ['discovery'],
    active: true,
  },
  {
    id: 'demo-place-5',
    name: '성심당 본점',
    category: '베이커리',
    zoneId: 'daeheung',
    durationMin: 45,
    tags: ['food', 'bakery', 'anchor', 'highlight'],
    roles: ['anchor', 'meal'],
    active: true,
  },
  {
    id: 'demo-place-6',
    name: '엑스포과학공원 & 한빛탑',
    category: '랜드마크/야경',
    zoneId: 'daeheung',
    durationMin: 60,
    tags: ['landmark', 'photo', 'nightview', 'stay-extender'],
    roles: ['stay-extender', 'anchor'],
    active: true,
  },
];

/**
 * Pre-configured READY state for instant spin testing on ?demo=1.
 */
export const DEMO_INITIAL_STATE: ExperienceState = {
  phase: 'ready',
  duration: 'half',
  preference: 'food',
};
