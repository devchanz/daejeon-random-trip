import type {
  CreateSharedRouteInput,
  SharedRouteRecord,
  DatabaseResult,
} from './types';
import type { SharedRouteStopSnapshot, PlaceMapLinks } from '../random/types';
import { getDatabaseClient, type DatabaseClientContract } from './client';
import { SUPPORTED_DURATIONS, SUPPORTED_PREFERENCES } from '../../config/product';

/**
 * Alphanumeric characters used for generating short URL-safe share codes.
 * Omits ambiguous characters (0, O, I, l) for high readability.
 */
export const SHARE_CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Standard length of public share codes.
 */
export const SHARE_CODE_LENGTH = 8;

/**
 * Validates whether a given string is a well-formed share code.
 * Ensures the code is exactly SHARE_CODE_LENGTH long and composed strictly of SHARE_CODE_CHARS.
 */
export function isValidShareCode(code: unknown): code is string {
  if (typeof code !== 'string') {
    return false;
  }
  const trimmed = code.trim();
  if (trimmed.length !== SHARE_CODE_LENGTH) {
    return false;
  }
  for (let i = 0; i < trimmed.length; i++) {
    if (!SHARE_CODE_CHARS.includes(trimmed[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Generates an 8-character URL-safe random share code (e.g., "F7k2Ma9Q")
 * using cryptographically secure random values with rejection sampling to eliminate modulo bias.
 */
export function generateShareCode(length: number = SHARE_CODE_LENGTH): string {
  const charsLength = SHARE_CODE_CHARS.length;
  const maxValidByte = 256 - (256 % charsLength); // 224
  let code = '';

  while (code.length < length) {
    const bytes = new Uint8Array(length - code.length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] < maxValidByte) {
        code += SHARE_CODE_CHARS[bytes[i] % charsLength];
        if (code.length === length) break;
      }
    }
  }

  return code;
}

/**
 * Validates an individual stop snapshot within a shared route.
 */
function validateStopSnapshot(
  stop: unknown,
  index: number
): { valid: true; data: SharedRouteStopSnapshot } | { valid: false; error: string } {
  if (!stop || typeof stop !== 'object') {
    return { valid: false, error: `${index + 1}번째 경유지 정보가 올바르지 않습니다.` };
  }

  const s = stop as Partial<SharedRouteStopSnapshot>;

  if (typeof s.order !== 'number' || !Number.isInteger(s.order) || s.order < 1) {
    return { valid: false, error: `${index + 1}번째 경유지의 순서(order)가 올바르지 않습니다.` };
  }

  if (typeof s.placeId !== 'string' || s.placeId.trim().length === 0 || s.placeId.trim().length > 64) {
    return { valid: false, error: `${index + 1}번째 경유지의 장소 식별자(placeId)가 올바르지 않습니다.` };
  }

  if (typeof s.name !== 'string' || s.name.trim().length === 0 || s.name.trim().length > 100) {
    return { valid: false, error: `${index + 1}번째 경유지의 장소명(name)이 올바르지 않습니다.` };
  }

  if (typeof s.category !== 'string' || s.category.trim().length === 0 || s.category.trim().length > 50) {
    return { valid: false, error: `${index + 1}번째 경유지의 카테고리(category)가 올바르지 않습니다.` };
  }

  if (typeof s.stayDurationMin !== 'number' || !Number.isFinite(s.stayDurationMin) || s.stayDurationMin < 0) {
    return { valid: false, error: `${index + 1}번째 경유지의 체류 시간(stayDurationMin)은 0 이상의 유효한 숫자여야 합니다.` };
  }

  if (
    s.travelToNextMin !== undefined &&
    s.travelToNextMin !== null &&
    (typeof s.travelToNextMin !== 'number' || !Number.isFinite(s.travelToNextMin) || s.travelToNextMin < 0)
  ) {
    return { valid: false, error: `${index + 1}번째 경유지의 이동 시간(travelToNextMin)은 0 이상의 유효한 숫자여야 합니다.` };
  }

  if (s.transitMode !== undefined && s.transitMode !== null && (typeof s.transitMode !== 'string' || s.transitMode.length > 20)) {
    return { valid: false, error: `${index + 1}번째 경유지의 이동 수단(transitMode) 정보가 올바르지 않습니다.` };
  }

  if (s.address !== undefined && s.address !== null && (typeof s.address !== 'string' || s.address.length > 200)) {
    return { valid: false, error: `${index + 1}번째 경유지의 주소(address) 정보가 올바르지 않습니다.` };
  }

  if (s.tips !== undefined && s.tips !== null && (typeof s.tips !== 'string' || s.tips.length > 200)) {
    return { valid: false, error: `${index + 1}번째 경유지의 팁(tips) 정보가 올바르지 않습니다.` };
  }

  let validatedMapLinks: PlaceMapLinks | undefined = undefined;
  if (s.mapLinks !== undefined && s.mapLinks !== null) {
    if (typeof s.mapLinks !== 'object' || Array.isArray(s.mapLinks)) {
      return { valid: false, error: `${index + 1}번째 경유지의 지도 링크(mapLinks) 형식이 올바르지 않습니다.` };
    }

    const ml = s.mapLinks as Record<string, unknown>;

    if (
      ml.naver !== undefined &&
      ml.naver !== null &&
      typeof ml.naver !== 'string'
    ) {
      return { valid: false, error: `${index + 1}번째 경유지의 네이버 지도 링크 형식이 올바르지 않습니다.` };
    }

    if (
      ml.kakao !== undefined &&
      ml.kakao !== null &&
      typeof ml.kakao !== 'string'
    ) {
      return { valid: false, error: `${index + 1}번째 경유지의 카카오 지도 링크 형식이 올바르지 않습니다.` };
    }

    const naver = typeof ml.naver === 'string' && ml.naver.trim().length > 0 ? ml.naver.trim() : undefined;
    const kakao = typeof ml.kakao === 'string' && ml.kakao.trim().length > 0 ? ml.kakao.trim() : undefined;

    if (naver || kakao) {
      validatedMapLinks = {
        ...(naver ? { naver } : {}),
        ...(kakao ? { kakao } : {}),
      };
    }
  }

  return {
    valid: true,
    data: {
      order: s.order,
      placeId: s.placeId.trim(),
      name: s.name.trim(),
      category: s.category.trim(),
      stayDurationMin: s.stayDurationMin,
      travelToNextMin: s.travelToNextMin !== undefined && s.travelToNextMin !== null ? s.travelToNextMin : undefined,
      transitMode: s.transitMode ? s.transitMode.trim() : undefined,
      address: s.address ? s.address.trim() : undefined,
      mapLinks: validatedMapLinks,
      tips: s.tips ? s.tips.trim() : undefined,
    },
  };
}

/**
 * Validates a CreateSharedRouteInput payload.
 * Enforces strict boundaries without silent coercion.
 */
export function validateSharedRouteInput(
  input: CreateSharedRouteInput
): { valid: true; data: CreateSharedRouteInput } | { valid: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: '입력 데이터가 없습니다.' };
  }

  if (
    typeof input.sourceRouteId !== 'string' ||
    input.sourceRouteId.trim().length === 0 ||
    input.sourceRouteId.trim().length > 64
  ) {
    return { valid: false, error: '원본 루트 ID(sourceRouteId)가 유효하지 않습니다 (1~64자).' };
  }

  if (
    typeof input.zoneId !== 'string' ||
    input.zoneId.trim().length === 0 ||
    input.zoneId.trim().length > 32
  ) {
    return { valid: false, error: '지역 정보(zoneId)가 유효하지 않습니다 (1~32자).' };
  }

  if (!SUPPORTED_DURATIONS.includes(input.durationType)) {
    return { valid: false, error: '유효하지 않은 여행 시간 유형(durationType)입니다.' };
  }

  if (!SUPPORTED_PREFERENCES.includes(input.preferenceType)) {
    return { valid: false, error: '유효하지 않은 여행 취향 유형(preferenceType)입니다.' };
  }

  if (
    typeof input.title !== 'string' ||
    input.title.trim().length === 0 ||
    input.title.trim().length > 100
  ) {
    return { valid: false, error: '루트 제목(title)이 유효하지 않습니다 (1~100자).' };
  }

  if (!Array.isArray(input.stops)) {
    return { valid: false, error: '경유지(stops) 목록이 올바르지 않습니다.' };
  }

  if (input.durationType === 'half' && input.stops.length !== 3) {
    return { valid: false, error: '반나절(half) 여행 코스는 정확히 3개의 경유지(stops)여야 합니다.' };
  }

  if (input.durationType === 'full' && (input.stops.length < 3 || input.stops.length > 4)) {
    return { valid: false, error: '하루(full) 여행 코스는 3개 또는 4개의 경유지(stops)여야 합니다.' };
  }

  const validatedStops: SharedRouteStopSnapshot[] = [];
  for (let i = 0; i < input.stops.length; i++) {
    const stopResult = validateStopSnapshot(input.stops[i], i);
    if (!stopResult.valid) {
      return { valid: false, error: stopResult.error };
    }
    validatedStops.push(stopResult.data);
  }

  if (
    typeof input.estimatedTotalMinutes !== 'number' ||
    !Number.isFinite(input.estimatedTotalMinutes) ||
    input.estimatedTotalMinutes < 0
  ) {
    return { valid: false, error: '예상 소요 시간(estimatedTotalMinutes)은 0 이상의 유효한 숫자여야 합니다.' };
  }

  if (
    input.schemaVersion !== undefined &&
    (typeof input.schemaVersion !== 'number' || !Number.isInteger(input.schemaVersion) || input.schemaVersion <= 0)
  ) {
    return { valid: false, error: '스키마 버전(schemaVersion)은 양의 정수여야 합니다.' };
  }

  if (
    input.mission !== undefined &&
    input.mission !== null &&
    (typeof input.mission !== 'string' || input.mission.trim().length > 255)
  ) {
    return { valid: false, error: '미션(mission)은 255자 이하의 문자열이어야 합니다.' };
  }

  return {
    valid: true,
    data: {
      sourceRouteId: input.sourceRouteId.trim(),
      zoneId: input.zoneId.trim(),
      durationType: input.durationType,
      preferenceType: input.preferenceType,
      title: input.title.trim(),
      stops: validatedStops,
      mission: input.mission ? input.mission.trim() : undefined,
      estimatedTotalMinutes: input.estimatedTotalMinutes,
      schemaVersion: input.schemaVersion ?? 1,
    },
  };
}

/**
 * Creates an immutable route snapshot record in the shared_routes table.
 * If a snapshot for the sourceRouteId already exists, the existing record is reused.
 */
export async function createSharedRoute(
  input: CreateSharedRouteInput,
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<SharedRouteRecord>> {
  const validation = validateSharedRouteInput(input);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const {
      sourceRouteId,
      zoneId,
      durationType,
      preferenceType,
      title,
      stops,
      mission,
      estimatedTotalMinutes,
      schemaVersion,
    } = validation.data;

    // Check if a snapshot for this sourceRouteId already exists to reuse existing shareCode
    const existing = await client.selectSharedRouteBySourceRouteId(sourceRouteId);
    if (existing) {
      return { success: true, data: existing };
    }

    const shareCode = generateShareCode();

    const record = await client.insertSharedRoute({
      share_code: shareCode,
      source_route_id: sourceRouteId,
      zone_id: zoneId,
      duration_type: durationType,
      preference_type: preferenceType,
      title,
      stops,
      mission: mission ?? null,
      estimated_total_minutes: estimatedTotalMinutes,
      schema_version: schemaVersion ?? 1,
    });

    return { success: true, data: record };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '루트 공유 저장 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Retrieves an immutable shared route snapshot by its public shareCode.
 */
export async function getSharedRouteByCode(
  shareCode: string,
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<SharedRouteRecord | null>> {
  if (!shareCode || typeof shareCode !== 'string' || !isValidShareCode(shareCode.trim())) {
    return { success: false, error: '유효하지 않은 공유 코드입니다.' };
  }

  try {
    const record = await client.selectSharedRouteByCode(shareCode.trim());
    return { success: true, data: record };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '공유 루트 조회 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Retrieves an immutable shared route snapshot by its sourceRouteId.
 */
export async function getSharedRouteBySourceRouteId(
  sourceRouteId: string,
  client: DatabaseClientContract = getDatabaseClient()
): Promise<DatabaseResult<SharedRouteRecord | null>> {
  if (!sourceRouteId || typeof sourceRouteId !== 'string' || sourceRouteId.trim().length === 0) {
    return { success: false, error: '유효하지 않은 원본 루트 ID입니다.' };
  }

  try {
    const record = await client.selectSharedRouteBySourceRouteId(sourceRouteId.trim());
    return { success: true, data: record };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '공유 루트 조회 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}