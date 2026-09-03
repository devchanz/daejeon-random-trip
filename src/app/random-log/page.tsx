import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { getRecentGuestbookEntries } from '../../lib/database/guestbook';
import { RandomLogList } from '../../components/random-log';

const PAGE_SIZE = 20;

/**
 * Forces per-request rendering. Without it, this route (no dynamic segment)
 * gets statically prerendered at build time and never refetches -- verified
 * via `pnpm build` output ("/random-log" as "○ Static") before this was added.
 */
export const dynamic = 'force-dynamic';

/**
 * Random Log board (/random-log): public, ungated browsing surface -- reachable
 * directly from the landing page, independent of whether a slot has been spun.
 */
export const metadata: Metadata = {
  title: '메모리 로그 | 대전 랜덤 여행',
  description: '대전 랜덤 여행을 뽑아본 사람들이 남긴 메모리 로그를 확인해보세요.',
  robots: { index: false, follow: false },
};

export default async function RandomLogPage() {
  const result = await getRecentGuestbookEntries(PAGE_SIZE);
  const entries = result.success ? result.data : [];
  const nextCursor =
    result.success && entries.length === PAGE_SIZE
      ? entries[entries.length - 1].created_at
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfbf7] text-[#2b2520]">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-line-control bg-[#fffef9] px-3.5 py-1.5 text-xs font-black text-[#2b2520] transition-colors hover:bg-[#faf6ee] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff5555] focus-visible:outline-offset-1"
        >
          <span aria-hidden="true">&larr;</span>
          <span>여행 뽑으러 돌아가기</span>
        </Link>

        <div className="mb-6 flex flex-col gap-1.5">
          <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#ff5555]">
            MEMORY LOG BOARD
          </span>
          <h1 className="text-xl font-black text-[#2b2520] sm:text-2xl">메모리 로그</h1>
          <p className="text-xs font-bold text-[#6b6257] sm:text-sm">
            대전 여행을 뽑아본 사람들이 남긴 메모리 로그예요.
          </p>
        </div>

        {!result.success ? (
          <div
            data-testid="random-log-board-error"
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line-soft bg-[#faf6ee] p-10 text-center"
          >
            <span className="text-3xl" role="img" aria-label="Error">
              ⚠️
            </span>
            <p className="text-sm font-bold text-[#6b6257]">
              메모리 로그를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          </div>
        ) : (
          <RandomLogList
            initialEntries={entries}
            initialNextCursor={nextCursor}
            pageSize={PAGE_SIZE}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
