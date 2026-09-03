import { NextResponse } from 'next/server';
import {
  createGuestbookEntry,
  getRecentGuestbookEntries,
  type CreateGuestbookEntryInput,
} from '../../../lib/database';

/**
 * POST /api/guestbook
 *
 * Validates, sanitizes, and inserts a new visitor log entry into the persistent database.
 * Successful database persistence is required to unlock the 1-time reroll reward on the client.
 */
export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json().catch(() => null);

    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json(
        { success: false, error: '요청 데이터가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const body = rawBody as Record<string, unknown>;

    if (
      typeof body.avatarId !== 'string' ||
      typeof body.nickname !== 'string' ||
      typeof body.message !== 'string' ||
      typeof body.routeId !== 'string' ||
      typeof body.zoneId !== 'string' ||
      typeof body.durationType !== 'string' ||
      typeof body.preferenceType !== 'string'
    ) {
      return NextResponse.json(
        { success: false, error: '요청 데이터가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // placeNames is optional/additive: normalize defensively here (array + string
    // entries only) rather than rejecting the whole submission for a malformed
    // value -- the strict sanitize/length/count cap happens in
    // validateAndSanitizeGuestbookInput (src/lib/database/guestbook.ts).
    const rawPlaceNames = Array.isArray(body.placeNames)
      ? body.placeNames.filter((entry): entry is string => typeof entry === 'string')
      : undefined;

    const payload: CreateGuestbookEntryInput = {
      avatarId: body.avatarId,
      nickname: body.nickname,
      message: body.message,
      routeId: body.routeId,
      zoneId: body.zoneId,
      durationType: body.durationType as CreateGuestbookEntryInput['durationType'],
      preferenceType: body.preferenceType as CreateGuestbookEntryInput['preferenceType'],
      ...(rawPlaceNames ? { placeNames: rawPlaceNames } : {}),
    };

    const result = await createGuestbookEntry(payload);

    if (!result.success) {
      // Determine if error is client validation error vs server/db failure
      const isValidationError =
        result.error.includes('입력') ||
        result.error.includes('닉네임') ||
        result.error.includes('메시지') ||
        result.error.includes('캐릭터') ||
        result.error.includes('루트') ||
        result.error.includes('지역') ||
        result.error.includes('유형');

      const userErrorMessage = isValidationError
        ? result.error
        : '방명록 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

      return NextResponse.json(
        { success: false, error: userErrorMessage },
        { status: isValidationError ? 400 : 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/guestbook?limit=3&before=<ISO created_at>
 *
 * Retrieves recent visible visitor logs (Random Log) for community social proof
 * and board browsing. `before` pages further back in time for "Load more" on
 * the /random-log board.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get('limit');
    const limit = rawLimit ? parseInt(rawLimit, 10) : 3;
    const safeLimit = Number.isNaN(limit) ? 3 : Math.min(Math.max(1, limit), 100);
    const before = searchParams.get('before') ?? undefined;

    const result = await getRecentGuestbookEntries(safeLimit, before);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: '방명록 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 }
    );
  }
}
