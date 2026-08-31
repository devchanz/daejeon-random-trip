import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { RandomLogDetail } from '../../../components/random-log';
import { getGuestbookEntryByPublicId } from '../../../lib/database/guestbook';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Dynamic metadata for a single Random Log entry.
 * Snapshot-only, noindex (this is pre-launch community content, matching the
 * /r/[shareCode] precedent) -- never derived from anything beyond the record itself.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getGuestbookEntryByPublicId(id);

  if (!result.success || !result.data) {
    return {
      title: '랜덤 로그를 찾을 수 없습니다 | 대전 랜덤 여행',
      description: '존재하지 않거나 삭제된 랜덤 로그입니다.',
      robots: { index: false, follow: false },
    };
  }

  const entry = result.data;

  return {
    title: `${entry.nickname}님의 랜덤 로그 | 대전 랜덤 여행`,
    description: entry.message,
    robots: { index: false, follow: false },
  };
}

/**
 * Random Log detail page (/random-log/[id]). Public, ungated -- reachable
 * directly from the landing page's Right Rail preview or the board, independent
 * of whether a slot has been spun. Server Component fetching directly from the
 * DB layer via the getGuestbookEntryByPublicId boundary (no internal API hop).
 */
export default async function RandomLogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getGuestbookEntryByPublicId(id);
  const entry = result.success ? result.data : null;

  return (
    <div className="flex min-h-screen flex-col bg-retro-dots text-[#2b2520]">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <RandomLogDetail entry={entry} />
      </main>

      <Footer />
    </div>
  );
}
