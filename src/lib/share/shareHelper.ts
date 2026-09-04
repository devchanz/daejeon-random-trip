/**
 * Client and shared utility functions for referral sharing.
 * Handles share text formatting, absolute URL construction,
 * Web Share API invocation with AbortError guard, and clipboard fallback.
 */

import { buildShareTitle, buildShareText } from '../../content/share';

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
  return buildShareTitle(routeTitle.trim());
}

/**
 * Formats social share text summary.
 */
export function formatShareText(routeTitle: string, stopCount: number): string {
  const cleanTitle = routeTitle.trim();
  const countLabel = stopCount > 0 ? `총 ${stopCount}곳` : '추천';
  return buildShareText(cleanTitle, countLabel);
}

/**
 * Normalizes and validates a candidate URL string into a clean origin (e.g. "https://example.com").
 * Returns null if the URL is invalid or uses an unsupported protocol (e.g. ftp:, javascript:).
 */
export function normalizeOrigin(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Detect explicit URI schemes (e.g. "https://", "ftp://", "javascript:") while ignoring port colons (e.g. "localhost:3000")
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:(?!\d+($|\/|\?))/.test(trimmed);

  if (hasScheme) {
    // Only http:// and https:// schemes are permitted
    if (!/^https?:\/\//i.test(trimmed)) {
      return null;
    }
  }

  // Prepend https:// if no supported scheme was supplied
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    // Invalid URL format
  }
  return null;
}

/**
 * Resolves current site origin from environment cascade with protocol and origin normalization.
 * Guarantees a valid, normalized http/https origin string without paths or trailing slashes.
 */
export function getSiteOrigin(): string {
  const envCandidate =
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeOrigin(process.env.VERCEL_URL);

  return envCandidate || 'http://localhost:3000';
}

/**
 * Constructs absolute or relative share URL for a given shareCode.
 * Stays bare/generic on purpose -- used for canonical/OG URL construction
 * (e.g. /r/[shareCode]'s generateMetadata) where UTM params must NOT appear.
 * The actual user-facing share flow uses `getAttributedShareUrl` below.
 */
export function getShareUrl(shareCode: string): string {
  const cleanCode = shareCode.trim();
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/r/${cleanCode}`;
  }
  return `${getSiteOrigin()}/r/${cleanCode}`;
}

/**
 * Fixed second-generation attribution tag for every user-generated
 * shared-route link. Values are deliberately constant and never
 * platform-guessed -- `navigator.share` never reveals which app the
 * recipient ultimately chose, so this identifies "reached via a friend's
 * shared link" as one category rather than inventing per-platform sources.
 */
const SHARED_ROUTE_UTM_PARAMS: Readonly<Record<string, string>> = {
  utm_source: 'user_share',
  utm_medium: 'referral',
  utm_campaign: 'daejeon_random_trip_2026',
  utm_content: 'shared_route',
};

/**
 * Builds the actual link handed to `navigator.share`/clipboard copy for a
 * given shareCode: the same `/r/[shareCode]` URL `getShareUrl` returns, with
 * the fixed `user_share` attribution appended as query params via the
 * native `URL` API (never string concatenation), so the shareCode path
 * segment itself is never touched -- only the query string is appended.
 * This is what lets GA4/GTM's standard acquisition reporting separate a
 * friend opening a shared route from the original campaign visitor who
 * generated it.
 */
export function getAttributedShareUrl(shareCode: string): string {
  const baseUrl = getShareUrl(shareCode);

  try {
    const url = new URL(baseUrl);
    for (const [key, value] of Object.entries(SHARED_ROUTE_UTM_PARAMS)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    // Should be unreachable -- getShareUrl always returns a valid absolute
    // URL -- but never let a malformed URL break the share flow.
    return baseUrl;
  }
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
