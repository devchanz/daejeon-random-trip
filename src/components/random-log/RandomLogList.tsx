'use client';

import React, { useState } from 'react';
import type { GuestbookEntryRecord } from '../../lib/database/types';
import { RandomLogCard } from './RandomLogCard';

export interface RandomLogListProps {
  initialEntries: GuestbookEntryRecord[];
  initialNextCursor: string | null;
  pageSize?: number;
}

/**
 * Random Log board: renders the initial (server-fetched) page of entries and
 * owns "Load more" pagination via a cursor-based fetch against GET /api/guestbook.
 */
export function RandomLogList({
  initialEntries,
  initialNextCursor,
  pageSize = 20,
}: RandomLogListProps) {
  const [entries, setEntries] = useState<GuestbookEntryRecord[]>(initialEntries);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line-soft bg-[#faf6ee] p-10 text-center">
        <span className="text-3xl" role="img" aria-label="Empty">
          🍀
        </span>
        <p className="text-sm font-bold text-[#6b6257]">아직 메모리 로그가 없어요</p>
      </div>
    );
  }

  const handleLoadMore = async () => {
    if (!nextCursor || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams({ limit: String(pageSize), before: nextCursor });
      const response = await fetch(`/api/guestbook?${params.toString()}`);
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.error ?? '메모리 로그를 더 불러오지 못했습니다.');
        return;
      }

      const newEntries = data.data as GuestbookEntryRecord[];
      setEntries((prev) => [...prev, ...newEntries]);
      setNextCursor(
        newEntries.length === pageSize ? newEntries[newEntries.length - 1].created_at : null
      );
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <RandomLogCard key={entry.id} entry={entry} />
        ))}
      </div>

      {errorMessage && (
        <p role="alert" className="text-center text-xs font-bold text-[#991b1b]">
          {errorMessage}
        </p>
      )}

      {nextCursor && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLoading}
          className={`mx-auto rounded-xl border-2 border-line-control px-6 py-2.5 text-xs font-black transition-all ${
            isLoading
              ? 'cursor-wait bg-[#faf6ee] text-[#a89f91]'
              : 'cursor-pointer bg-[#fffef9] text-[#2b2520] hover:bg-[#faf6ee]'
          }`}
        >
          {isLoading ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
}
