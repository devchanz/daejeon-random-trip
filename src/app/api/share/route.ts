import { NextResponse } from 'next/server';
import {
  createSharedRoute,
  type CreateSharedRouteInput,
} from '../../../lib/database';

/**
 * POST /api/share
 *
 * Validates route snapshot data and creates an immutable snapshot record in shared_routes.
 * If a snapshot for the same sourceRouteId already exists, reuses the existing share_code.
 * Returns the created/reused record and public share URL (/r/[shareCode]).
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
      typeof body.sourceRouteId !== 'string' ||
      typeof body.zoneId !== 'string' ||
      typeof body.durationType !== 'string' ||
      typeof body.preferenceType !== 'string' ||
      typeof body.title !== 'string' ||
      !Array.isArray(body.stops) ||
      typeof body.estimatedTotalMinutes !== 'number'
    ) {
      return NextResponse.json(
        { success: false, error: '필수 루트 정보가 누락되었거나 형식이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const payload: CreateSharedRouteInput = {
      sourceRouteId: body.sourceRouteId,
      zoneId: body.zoneId,
      durationType: body.durationType as CreateSharedRouteInput['durationType'],
      preferenceType: body.preferenceType as CreateSharedRouteInput['preferenceType'],
      title: body.title,
      stops: body.stops as CreateSharedRouteInput['stops'],
      mission: typeof body.mission === 'string' ? body.mission : undefined,
      estimatedTotalMinutes: body.estimatedTotalMinutes,
      schemaVersion: typeof body.schemaVersion === 'number' ? body.schemaVersion : 1,
    };

    const result = await createSharedRoute(payload);

    if (!result.success) {
      // Determine if error is client validation error vs server/db failure
      const isValidationError =
        result.error.includes('입력') ||
        result.error.includes('경유지') ||
        result.error.includes('루트') ||
        result.error.includes('지역') ||
        result.error.includes('유형') ||
        result.error.includes('제목') ||
        result.error.includes('시간') ||
        result.error.includes('미션') ||
        result.error.includes('버전');

      if (!isValidationError) {
        console.error('[API /api/share Error]: Failed to create shared route snapshot:', result.error);
      }

      const userErrorMessage = isValidationError
        ? result.error
        : '루트 공유 링크를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

      return NextResponse.json(
        { success: false, error: userErrorMessage },
        { status: isValidationError ? 400 : 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        shareCode: result.data.share_code,
        shareUrl: `/r/${result.data.share_code}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      '[API /api/share Exception]:',
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      {
        success: false,
        error: '서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 }
    );
  }
}
