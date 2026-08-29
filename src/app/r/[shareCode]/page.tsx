import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { SharedRouteView } from '../../../components/share';
import { getSharedRouteByCode, isValidShareCode } from '../../../lib/database';

interface PageProps {
  params: Promise<{
    shareCode: string;
  }>;
}

/**
 * Resolves current site origin from environment cascade without inventing domains.
 */
function getSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

/**
 * Dynamic Open Graph and SEO metadata for shared route landing page.
 * Enforces robots: { index: false } (noindex) per ADR-014.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareCode } = await params;

  if (!isValidShareCode(shareCode)) {
    return {
      title: '공유 여행 코스 | 대전 랜덤 여행',
      description: '대전 랜덤 여행 추천 코스를 확인해보세요.',
      robots: { index: false },
    };
  }

  const result = await getSharedRouteByCode(shareCode);
  if (!result.success || !result.data) {
    return {
      title: '여행 코스를 찾을 수 없습니다 | 대전 랜덤 여행',
      description: '존재하지 않거나 만료된 대전 여행 코스입니다.',
      robots: { index: false },
    };
  }

  const record = result.data;
  const stopSummary = record.stops.map((s) => s.name).join(' → ');
  const description = `총 ${record.stops.length}곳 (${stopSummary}) 대전 여행 코스가 도착했어요!`;
  const shareUrl = `${getSiteOrigin()}/r/${record.share_code}`;

  return {
    title: `${record.title} | 대전 랜덤 여행`,
    description,
    robots: { index: false },
    openGraph: {
      title: `${record.title} | 대전 랜덤 여행`,
      description,
      url: shareUrl,
      siteName: '대전 랜덤 여행',
      type: 'website',
      locale: 'ko_KR',
    },
  };
}

/**
 * Dedicated Shared Route friend landing page (/r/[shareCode]).
 * Server Component fetching immutable route snapshot from persistent DB tier.
 */
export default async function SharedRoutePage({ params }: PageProps) {
  const { shareCode } = await params;

  let record = null;
  if (isValidShareCode(shareCode)) {
    const result = await getSharedRouteByCode(shareCode);
    if (result.success && result.data) {
      record = result.data;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-retro-dots text-[#2b2520]">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Content Container */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-10 flex flex-col items-center justify-center">
        <SharedRouteView record={record} />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
