import React from 'react';
import Link from 'next/link';
import type { GuestbookEntryRecord } from '../../lib/database/types';
import { RandomLogAvatarBadge } from './RandomLogAvatarBadge';
import {
  formatShortTimestamp,
  getZoneLabel,
  getDurationLabel,
  getPreferenceLabel,
} from './randomLogLabels';

export interface RandomLogCardProps {
  entry: GuestbookEntryRecord;
}

/** A single Random Log board entry: character, nickname, timestamp, message excerpt, minimal trip tags. */
export function RandomLogCard({ entry }: RandomLogCardProps) {
  return (
    <Link
      href={`/random-log/${entry.id}`}
      data-testid="random-log-card"
      className="flex flex-col gap-2 rounded-2xl border-2 border-line-soft bg-[#fffef9] p-4 transition-all hover:bg-[#faf6ee]"
    >
      <div className="flex items-center gap-2.5">
        <RandomLogAvatarBadge avatarId={entry.avatar_id} className="h-9 w-9 text-xl" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-black text-[#2b2520]">{entry.nickname}</span>
          <span className="font-mono text-[10px] text-[#8c8273]">
            {formatShortTimestamp(entry.created_at)}
          </span>
        </div>
      </div>

      <p className="line-clamp-2 text-sm leading-snug text-[#5c5244]">{entry.message}</p>

      <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-[#6b6257]">
        <span className="rounded-md border border-line-soft bg-[#faf6ee] px-2 py-0.5">
          {getZoneLabel(entry.zone_id)}
        </span>
        <span className="rounded-md border border-line-soft bg-[#faf6ee] px-2 py-0.5">
          {getDurationLabel(entry.duration_type)}
        </span>
        <span className="rounded-md border border-line-soft bg-[#faf6ee] px-2 py-0.5">
          {getPreferenceLabel(entry.preference_type)}
        </span>
      </div>
    </Link>
  );
}
