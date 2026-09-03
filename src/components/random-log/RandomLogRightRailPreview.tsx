import React, { cache } from 'react';
import Link from 'next/link';
import { getRecentGuestbookEntries } from '../../lib/database/guestbook';
import { RandomLogAvatarBadge } from './RandomLogAvatarBadge';
import { formatShortTimestamp } from './randomLogLabels';
import { VISITOR_LOG_COPY } from '../../content/sidebar';

const PREVIEW_LIMIT = 3;

// Request-scoped de-duplication only (React cache()) -- shares one query across
// RightSidebar's desktop + mobile duplicate-render, not a persistent/data cache.
// No Next.js caching directive is applied: reads stay dynamic-per-request so a
// newly submitted entry is visible on the very next render.
const getCachedRecentEntries = cache((limit: number) => getRecentGuestbookEntries(limit));

/**
 * Right Rail live Random Log preview. Server Component -- fetches directly from
 * the DB layer (no internal API round-trip), mirroring the /r/[shareCode] precedent.
 */
export async function RandomLogRightRailPreview() {
  const result = await getCachedRecentEntries(PREVIEW_LIMIT);
  const entries = result.success ? result.data : [];

  return (
    <>
      <div className="flex flex-col divide-y divide-line-soft">
        {entries.length === 0 ? (
          <p className="py-3 text-center text-xs font-bold text-[#8c8273]">
            {VISITOR_LOG_COPY.emptyState}
          </p>
        ) : (
          entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/random-log/${entry.id}`}
              className="-mx-1 flex items-start gap-2.5 rounded-lg px-1 py-2.5 text-xs transition-colors hover:bg-[#faf6ee] sm:text-sm"
            >
              {/* 28px was too small to identify a character: the avatars are landscape
                  (up to 1.75:1) and object-contain letterboxes them inside the circular
                  badge, so the widest character was only ~16px tall. 34/36px is still
                  inside the row's text-driven height (nickname + message ≈ 34-42px), so
                  no row grows and no other avatar consumer is affected -- the badge
                  component, composer hero and 5x2 selector are untouched. */}
              <RandomLogAvatarBadge
                avatarId={entry.avatar_id}
                className="h-[34px] w-[34px] lg:h-9 lg:w-9 text-lg"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-black text-[#2b2520]">{entry.nickname}</span>
                  <span className="shrink-0 font-mono text-[10px] text-[#8c8273]">
                    {formatShortTimestamp(entry.created_at)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs leading-tight text-[#5c5244] sm:text-sm">
                  {entry.message}
                </p>
                {/* Actual generated place names, when this entry carries a snapshot
                    (route_place_names) -- see RandomLogCard.tsx for the same rule:
                    NULL/empty renders nothing, never a placeholder line. */}
                {entry.route_place_names && entry.route_place_names.length > 0 && (
                  <p className="truncate text-[10px] font-bold text-[#8a7a5c]">
                    {entry.route_place_names.join(' · ')}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-1 border-t border-line-soft pt-2.5">
        <Link
          href="/random-log"
          className="flex w-full items-center justify-center rounded-lg border border-line-control bg-[#e0f2fe] px-2.5 py-1.5 text-xs font-black text-[#0369a1] hover:bg-[#bae6fd]"
        >
          {VISITOR_LOG_COPY.viewAllCta}
        </Link>
      </div>
    </>
  );
}
