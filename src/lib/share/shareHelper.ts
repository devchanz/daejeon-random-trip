/**
 * Client and shared utility functions for referral sharing.
 * Handles share text formatting, absolute URL construction,
 * Web Share API invocation with AbortError guard, and clipboard fallback.
 */

export interface ShareContentParams {
  title: string;
  stopCount: number;
  shareCode: string;
}

export type ShareExecutionResult =
  | { status: 'shared'; method: 'web_share' }
  | { status: 'copied'; method: 'clipboard' }
  | { status: 'canceled' }
  | { status: 'error'; error: string };

/**
 * Formats user-facing share title.
 */
export function formatShareTitle(routeTitle: string): string {
  const cleanTitle = routeTitle.trim();
  return cleanTitle.length > 0
    ? `대전 랜덤 여행 코스 | ${cleanTitle}`
    : '대전 랜덤 여행 코스';
}

/**
 * Formats social share text summary.
 */
export function formatShareText(routeTitle: string, stopCount: number): string {
  const cleanTitle = routeTitle.trim();
  const countLabel = stopCount > 0 ? `총 ${stopCount}곳` : '추천';
  return `🎰 친구가 뽑은 대전 랜덤 여행 코스 도착!\n📍 ${cleanTitle}\n✨ ${countLabel} 여행 코스를 확인해보세요.`;
}

/**
 * Constructs absolute or relative share URL for a given shareCode.
 */
export function getShareUrl(shareCode: string): string {
  const cleanCode = shareCode.trim();
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/r/${cleanCode}`;
  }
  return `/r/${cleanCode}`;
}

/**
 * Triggers native Web Share API with AbortError cancellation guard,
 * gracefully falling back to clipboard copy if Web Share is unsupported or fails.
 */
export async function triggerShare(params: {
  title: string;
  text: string;
  url: string;
}): Promise<ShareExecutionResult> {
  const { title, text, url } = params;

  // 1. Attempt native Web Share API if available
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return { status: 'shared', method: 'web_share' };
    } catch (err: unknown) {
      // User dismissed/canceled the share sheet -> return canceled quietly (no clipboard fallback)
      if (err instanceof Error && err.name === 'AbortError') {
        return { status: 'canceled' };
      }
      // Non-abort error: fall through to clipboard fallback
    }
  }

  // 2. Clipboard Fallback
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(url);
      return { status: 'copied', method: 'clipboard' };
    }

    // Legacy fallback for older WebViews or restricted environments
    if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        return { status: 'copied', method: 'clipboard' };
      }
    }

    return {
      status: 'error',
      error: '클립보드 접근이 제한되어 있습니다. 주소를 직접 복사해 주세요.',
    };
  } catch {
    return {
      status: 'error',
      error: '링크 복사 중 오류가 발생했습니다. 다시 시도해 주세요.',
    };
  }
}
