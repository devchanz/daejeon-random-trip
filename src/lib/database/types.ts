import type { DurationType, PreferenceType } from '../../config/product';
import type { SharedRouteStopSnapshot } from '../random/types';

export type { SharedRouteStopSnapshot };

export type GuestbookModerationStatus = 'visible' | 'hidden';

/**
 * Database record model for guestbook_entries table.
 * Conforms to docs/DATA_MODEL.md section 3.1.
 */
export interface GuestbookEntryRecord {
  id: string;                    // UUID Primary Key
  avatar_id: string;             // Selected Kkumssi family avatar identifier
  nickname: string;              // User nickname (2–12 chars, sanitized)
  message: string;               // One-liner message (max 50 chars, sanitized)
  route_id: string;              // Source route ID associated with this log
  zone_id: string;               // Recommended zone ID
  duration_type: DurationType;   // 'half' | 'full'
  preference_type: PreferenceType; // 'anything' | 'food' | 'walk' | 'photo'
  status: GuestbookModerationStatus; // Moderation status ('visible' | 'hidden')
  created_at: string;            // ISO submission timestamp
}

/**
 * Validated server input payload for creating a new guestbook entry.
 */
export interface CreateGuestbookEntryInput {
  avatarId: string;
  nickname: string;
  message: string;
  routeId: string;
  zoneId: string;
  durationType: DurationType;
  preferenceType: PreferenceType;
}

/**
 * Database record model for shared_routes table.
 * Conforms to docs/DATA_MODEL.md section 3.2.
 */
export interface SharedRouteRecord {
  id: string;                    // Internal UUID Primary Key
  share_code: string;            // Unique Public Lookup Code (e.g., "F7k2Ma9Q")
  source_route_id: string;       // Ephemeral route ID at time of generation
  zone_id: string;               // Zone identifier
  duration_type: DurationType;   // 'half' | 'full'
  preference_type: PreferenceType; // 'anything' | 'food' | 'walk' | 'photo'
  title: string;                 // Route title snapshot
  stops: SharedRouteStopSnapshot[]; // Immutable snapshot sequence
  mission?: string | null;       // Mission memo snapshot
  estimated_total_minutes: number; // Total estimated travel time in minutes
  schema_version: number;        // Data contract version (default 1)
  created_at: string;            // Creation timestamp
}

/**
 * Validated server input payload for creating a shared route snapshot.
 */
export interface CreateSharedRouteInput {
  sourceRouteId: string;
  zoneId: string;
  durationType: DurationType;
  preferenceType: PreferenceType;
  title: string;
  stops: SharedRouteStopSnapshot[];
  mission?: string;
  estimatedTotalMinutes: number;
  schemaVersion?: number;
}

/**
 * Generic result envelope for database operations.
 */
export type DatabaseResult<T> =
  | { success: true; data: T; error?: undefined }
  | { success: false; data?: undefined; error: string };
