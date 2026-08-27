import type { Zone } from '../lib/random/types';

/**
 * Curated travel zones across Daejeon for Controlled Random Travel.
 *
 * NOTE on Banseok (반석동):
 * The provisional dataset currently has no anchor or discovery candidates in Banseok.
 * It is temporarily set to active: false pending provisional role-data review.
 */
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
    active: false, // Temporarily inactive pending provisional role-data review
  },
] as const satisfies readonly Zone[];
