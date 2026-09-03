import type { Zone } from '../lib/random/types';

export const ZONES = [
  {
    id: 'soje',
    name: '소제동',
    active: true,
  },
  {
    id: 'daeheung',
    name: '대흥동',
    active: true,
  },
  {
    id: 'seonhwa',
    name: '선화동',
    active: true,
  },
  {
    id: 'eoeun-gung',
    name: '어은동·궁동',
    active: true,
  },
  {
    id: 'galma',
    name: '갈마동',
    active: true,
  },
  {
    id: 'mannyeon',
    name: '만년동',
    active: true,
  },
  {
    id: 'doryong',
    name: '도룡동',
    active: true,
  },
  {
    id: 'banseok',
    name: '반석동',
    active: true, // Now active since fallback 3-stop works fine
  },
  {
    id: 'bongmyeong',
    name: '봉명동',
    active: true,
  },
  {
    id: 'gwanjeo',
    name: '관저동',
    active: true,
  },
  {
    id: 'eunhaeng',
    name: '은행동',
    active: true,
  },
  {
    id: 'daesa',
    name: '대사동',
    active: true,
  },
  {
    id: 'jukdong',
    name: '죽동',
    active: true,
  },
  {
    id: 'tanbang',
    name: '탄방동',
    active: true,
  },
  {
    id: 'songchon',
    name: '송촌동',
    active: true,
  },
  {
    id: 'daedong',
    name: '대동',
    active: true,
  },
] as const satisfies readonly Zone[];
