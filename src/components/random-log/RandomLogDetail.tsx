import React from 'react';
import Link from 'next/link';
import type { GuestbookEntryRecord } from '../../lib/database/types';
import { RandomLogAvatarBadge } from './RandomLogAvatarBadge';
import {
  formatFullTimestamp,
  getZoneLabel,
  getDurationLabel,
  getPreferenceLabel,
} from './randomLogLabels';

export interface RandomLogDetailProps {
  entry: GuestbookEntryRecord | null;
  className?: string;
}

/**
 * Random Log detail view (/random-log/[id]). Renders the full entry, or a
 * dedicated not-found state for a missing, hidden, or malformed identifier --
 * mirroring SharedRouteView's not-found pattern for /r/[shareCode].
 */
export function RandomLogDetail({ entry, className = '' }: RandomLogDetailProps) {
  if (!entry) {
    return (
      <article
        data-testid="random-log-not-found"
        className={`relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border-3 border-[#2b2520] bg-[#fffef9] p-6 text-center shadow-retro-xl sm:p-8 ${className}`}
      >
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
        />

        <div className="flex flex-col items-center gap-4 pb-2 pt-4">
          <span className="text-5xl" role="img" aria-label="Not Found">
            🍀
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff5555]">
              LOG NOT FOUND
            </span>
            <h2 className="text-xl font-black text-[#2b2520] sm:text-2xl">
              존재하지 않거나 삭제된 랜덤 로그예요
            </h2>
          </div>
          <p className="max-w-sm text-xs font-bold leading-relaxed text-[#6b6257] sm:text-sm">
            링크가 올바르지 않거나 더 이상 표시되지 않는 로그일 수 있어요.
          </p>

          <div className="mt-2 w-full border-t-2 border-[#2b2520] pt-4">
            <Link
              href="/random-log"
              className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-[#2b2520] bg-[#ff5555] px-6 py-3.5 text-sm font-black text-white shadow-retro-xs transition-all hover:bg-[#ff3b3b] active:translate-x-[1px] active:translate-y-[1px]"
            >
              🍀 랜덤 로그 목록으로
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      data-testid="random-log-detail"
      className={`relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border-3 border-[#2b2520] bg-[#fffef9] p-5 shadow-retro-xl sm:p-8 ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-2 border-b-2 border-dashed border-[#d8d0c2] bg-[#f7f3ea]"
      />

      <div className="flex flex-col gap-5 pt-1">
        <header className="flex items-center gap-3 border-b-2 border-[#2b2520] pb-4">
          <RandomLogAvatarBadge avatarId={entry.avatar_id} className="h-14 w-14 text-3xl" />
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#ff5555]">
              RANDOM LOG
            </span>
            <h1 className="text-lg font-black text-[#2b2520] sm:text-xl">{entry.nickname}</h1>
            <span className="font-mono text-[11px] text-[#8c8273]">
              {formatFullTimestamp(entry.created_at)}
            </span>
          </div>
        </header>

        <p className="break-words text-sm font-bold leading-relaxed text-[#2b2520] sm:text-base">
          {entry.message}
        </p>

        <div className="flex flex-wrap gap-1.5 text-xs font-bold text-[#6b6257]">
          <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5">
            {getZoneLabel(entry.zone_id)}
          </span>
          <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5">
            {getDurationLabel(entry.duration_type)}
          </span>
          <span className="rounded-md border-2 border-[#2b2520] bg-[#faf6ee] px-2.5 py-0.5">
            {getPreferenceLabel(entry.preference_type)}
          </span>
        </div>

        <div className="border-t-2 border-[#2b2520] pt-3">
          <Link
            href="/random-log"
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] px-3 py-2.5 text-xs font-bold text-[#2b2520] shadow-retro-xs transition-all hover:bg-[#f0eae0] active:translate-x-[1px] active:translate-y-[1px]"
          >
            ← 랜덤 로그 목록으로
          </Link>
        </div>
      </div>
    </article>
  );
}
