import type { RouteResult, RouteStop, SharedRouteStopSnapshot } from '../random/types';
import type { SharedRouteRecord } from '../database/types';

export interface RouteGuideStop {
  order: number;
  name: string;
  category: string;
  stayDurationMin?: number;
  address?: string;
  tips?: string;
  mapLinks?: {
    naver?: string;
    kakao?: string;
  };
}

export interface RouteGuideData {
  title: string;
  zoneId?: string;
  zoneName?: string;
  durationType: 'half' | 'full' | string;
  preferenceType: 'anything' | 'food' | 'walk' | 'photo' | string;
  estimatedTotalMinutes: number;
  mission?: string | null;
  stops: RouteGuideStop[];
}

/**
 * Normalizes an in-memory RouteResult into unified RouteGuideData.
 */
export function normalizeRouteResult(result: RouteResult): RouteGuideData {
  return {
    title: result.title,
    zoneId: result.zoneId,
    zoneName: result.zoneName,
    durationType: result.durationType,
    preferenceType: result.preference,
    estimatedTotalMinutes: result.estimatedTotalMinutes,
    mission: result.mission ?? null,
    stops: (result.stops || []).map((stop: RouteStop, index: number) => ({
      order: stop.order ?? index + 1,
      name: stop.name,
      category: stop.category,
      stayDurationMin: stop.stayDurationMin,
      address: stop.address,
      tips: stop.tips,
      mapLinks: stop.mapLinks,
    })),
  };
}

/**
 * Normalizes an immutable SharedRouteRecord snapshot into unified RouteGuideData.
 */
export function normalizeSharedRouteRecord(record: SharedRouteRecord): RouteGuideData {
  return {
    title: record.title,
    zoneId: record.zone_id,
    durationType: record.duration_type,
    preferenceType: record.preference_type,
    estimatedTotalMinutes: record.estimated_total_minutes,
    mission: record.mission ?? null,
    stops: (record.stops || []).map((stop: SharedRouteStopSnapshot, index: number) => ({
      order: stop.order ?? index + 1,
      name: stop.name,
      category: stop.category,
      stayDurationMin: stop.stayDurationMin,
      address: stop.address,
      tips: stop.tips,
      mapLinks: stop.mapLinks,
    })),
  };
}

/**
 * Formats duration minutes into human-friendly Korean string.
 * Example: 90 -> "약 1시간 30분", 120 -> "약 2시간", 45 -> "약 45분"
 */
export function formatDurationSummary(minutes: number): string {
  if (!minutes || minutes <= 0) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `약 ${hours}시간 ${remainingMinutes}분`;
  }
  if (hours > 0) {
    return `약 ${hours}시간`;
  }
  return `약 ${remainingMinutes}분`;
}
