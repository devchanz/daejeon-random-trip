import type {
  CreateGuestbookEntryInput,
  GuestbookEntryRecord,
  DatabaseResult,
} from './types';
import { getDatabaseClient, type DatabaseClientContract } from './client';
import {
  SUPPORTED_DURATIONS,
  SUPPORTED_PREFERENCES,
  GUESTBOOK_AVATARS,
} from '../../config/product';

/**
 * UUID (v1-v5) format matcher, used to validate the `id` column value before
 * it is used as the public route identifier for /random-log/[id].
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Route stops render 1-4 (ADR-018/ADR-019) -- the snapshot can never need more. */
const MAX_ROUTE_PLACE_NAMES = 4;
/** Generous ceiling for a curated place name (longest current production names run ~20-24 chars). */
const MAX_PLACE_NAME_LENGTH = 60;

/**
 * Validates whether a given string is a well-formed UUID.
 */
export function isValidGuestbookEntryId(id: unknown): id is string {
  return typeof id === 'string' && UUID_PATTERN.test(id.trim());
}

/**
 * Sanitizes single-line user input by stripping control characters and trimming whitespace.
 */
function sanitizeText(text: string): string {
  // Remove control characters (ASCII 0-31 and 127), trim whitespace
  return text.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Defensively normalizes a candidate route-place-names snapshot: array-only,
 * string entries only, each sanitized + length-capped, capped to
 * MAX_ROUTE_PLACE_NAMES entries, empty entries dropped. Never throws --
 * invalid input normalizes to `undefined` (stored as NULL) rather than
 * rejecting the whole submission, since this snapshot is additive/optional.
 */
function sanitizePlaceNames(input: unknown): string[] | undefined {
  if (!Array.isArray(input)) {
    return undefined;
  }

  const cleaned = input
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => sanitizeText(entry).slice(0, MAX_PLACE_NAME_LENGTH))
    .filter((entry) => entry.length > 0)
    .slice(0, MAX_ROUTE_PLACE_NAMES);

  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Validates and sanitizes guestbook entry submission input.
 * Strict rules:
 * - Avatar ID: Required, must be one of the configured GUESTBOOK_AVATARS IDs (1–32 characters)
 * - Nickname: Required, 2–12 characters
 * - Message: Required, 1–50 characters
 * - Route Info: routeId (1–64), zoneId (1–32), durationType & preferenceType in supported list
 * - Place names snapshot: optional, array only, max 4 entries, each sanitized and
 *   length-capped; invalid/absent normalizes to omitted (stored as NULL), never rejects
 *   the submission
 */
export function validateAndSanitizeGuestbookInput(
  input: CreateGuestbookEntryInput
): { valid: true; data: CreateGuestbookEntryInput } | { valid: false; error: string } {
  if (!input) {
    return { valid: false, error: '입력 데이터가 없습니다.' };
  }

  const avatarId = sanitizeText(input.avatarId || '');
  const isValidAvatar =
    Boolean(avatarId) &&
    avatarId.length <= 32 &&
    GUESTBOOK_AVATARS.some((avatar) => avatar.id === avatarId);

  if (!isValidAvatar) {
    return { valid: false, error: '올바른 캐릭터 아바타를 선택해주세요.' };
  }

  const nickname = sanitizeText(input.nickname || '');
  if (nickname.length < 2 || nickname.length > 12) {
    return { valid: false, error: '닉네임은 2자 이상 12자 이하로 입력해주세요.' };
  }

  const message = sanitizeText(input.message || '');
  if (message.length < 1 || message.length > 50) {
    return { valid: false, error: '메시지는 1자 이상 50자 이하로 입력해주세요.' };
  }

  const routeId = sanitizeText(input.routeId || '');
  if (!routeId || routeId.length > 64) {
    return { valid: false, error: '루트 정보가 올바르지 않습니다.' };
  }

  const zoneId = sanitizeText(input.zoneId || '');
  if (!zoneId || zoneId.length > 32) {
    return { valid: false, error: '지역 정보가 올바르지 않습니다.' };
  }

  if (!SUPPORTED_DURATIONS.includes(input.durationType)) {
    return { valid: false, error: '유효하지 않은 여행 시간 유형입니다.' };
  }

  if (!SUPPORTED_PREFERENCES.includes(input.preferenceType)) {
    return { valid: false, error: '유효하지 않은 여행 취향 유형입니다.' };
  }

  const placeNames = sanitizePlaceNames(input.placeNames);

  return {
    valid: true,
    data: {
      avatarId,
      nickname,
      message,
      routeId,
      zoneId,
      durationType: input.durationType,
      preferenceType: input.preferenceType,
      ...(placeNames ? { placeNames } : {}),
    },
  };
}

/**
 * Creates a new visitor log entry in the persistent database.
 * Validates and sanitizes input before executing server database write.
 */
export async function createGuestbookEntry(
  input: CreateGuestbookEntryInput,
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<GuestbookEntryRecord>> {
  const validation = validateAndSanitizeGuestbookInput(input);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const {
      avatarId,
      nickname,
      message,
      routeId,
      zoneId,
      durationType,
      preferenceType,
      placeNames,
    } = validation.data;

    const record = await client.insertGuestbookEntry({
      avatar_id: avatarId,
      nickname,
      message,
      route_id: routeId,
      zone_id: zoneId,
      duration_type: durationType,
      preference_type: preferenceType,
      status: 'visible',
      route_place_names: placeNames ?? null,
    });

    return { success: true, data: record };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '방명록 저장 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Retrieves the most recent visible guestbook entries (Random Log) for community
 * social proof and board browsing. Pass `before` (an entry's ISO created_at) to
 * page further back in time -- used by the /random-log board's "Load more".
 */
export async function getRecentGuestbookEntries(
  limit: number = 3,
  before?: string,
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<GuestbookEntryRecord[]>> {
  try {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const records = await client.selectRecentGuestbookEntries(safeLimit, before);
    return { success: true, data: records };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '방명록 조회 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Retrieves a single visible guestbook entry (Random Log) by its public
 * identifier for the /random-log/[id] detail page.
 *
 * This is the one function the detail page is allowed to call to reach the
 * row -- it queries the `id` column today, but callers only ever depend on
 * "the public identifier" resolving to a record or null, so a future switch
 * to a dedicated public_code column only changes this function's internals.
 */
export async function getGuestbookEntryByPublicId(
  publicId: string,
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<GuestbookEntryRecord | null>> {
  if (!isValidGuestbookEntryId(publicId)) {
    return { success: false, error: '유효하지 않은 랜덤 로그 식별자입니다.' };
  }

  try {
    const record = await client.selectGuestbookEntryById(publicId.trim());
    return { success: true, data: record };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '랜덤 로그 조회 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}
