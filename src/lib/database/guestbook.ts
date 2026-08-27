import type {
  CreateGuestbookEntryInput,
  GuestbookEntryRecord,
  DatabaseResult,
} from './types';
import { getDatabaseClient, type DatabaseClientContract } from './client';
import { SUPPORTED_DURATIONS, SUPPORTED_PREFERENCES } from '../../config/product';

/**
 * Sanitizes single-line user input by stripping control characters and trimming whitespace.
 */
function sanitizeText(text: string): string {
  // Remove control characters (ASCII 0-31 and 127), trim whitespace
  return text.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Validates and sanitizes guestbook entry submission input.
 * Strict rules:
 * - Avatar ID: Required, 1–32 characters
 * - Nickname: Required, 2–12 characters
 * - Message: Required, 1–50 characters
 * - Route Info: routeId (1–64), zoneId (1–32), durationType & preferenceType in supported list
 */
export function validateAndSanitizeGuestbookInput(
  input: CreateGuestbookEntryInput
): { valid: true; data: CreateGuestbookEntryInput } | { valid: false; error: string } {
  if (!input) {
    return { valid: false, error: '입력 데이터가 없습니다.' };
  }

  const avatarId = sanitizeText(input.avatarId || '');
  if (!avatarId || avatarId.length > 32) {
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
    const { avatarId, nickname, message, routeId, zoneId, durationType, preferenceType } =
      validation.data;

    const record = await client.insertGuestbookEntry({
      avatar_id: avatarId,
      nickname,
      message,
      route_id: routeId,
      zone_id: zoneId,
      duration_type: durationType,
      preference_type: preferenceType,
      status: 'visible',
    });

    return { success: true, data: record };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '방명록 저장 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Retrieves the most recent visible guestbook entries for community social proof.
 */
export async function getRecentGuestbookEntries(
  limit: number = 3,
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<GuestbookEntryRecord[]>> {
  try {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const records = await client.selectRecentGuestbookEntries(safeLimit);
    return { success: true, data: records };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '방명록 조회 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}
