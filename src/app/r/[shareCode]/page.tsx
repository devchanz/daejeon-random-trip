import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { SharedRouteView } from '../../../components/share';
import { getSharedRouteByCode, isValidShareCode } from '../../../lib/database';
import { getSiteOrigin } from '../../../lib/share';

interface PageProps {
  params: Promise<{
    shareCode: string;
  }>;
}

/**
 * Dynamic Open Graph and SEO metadata for shared route landing page.
 * Strictly snapshot-only: resolves all fields deterministically from SharedRouteRecord.
 * Enforces robots: { index: false, follow: false } (noindex) per ADR-014.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareCode } = await params;

  if (!isValidShareCode(shareCode)) {
    return {
      title: '공유 여행 코스 | 대전 랜덤 여행',
      description: '대전 랜덤 여행 추천 코스를 확인해보세요.',
      robots: { index: false, follow: false },
    };
  }

  const result = await getSharedRouteByCode(shareCode);
  if (!result.success || !result.data) {
    return {
      title: '여행 코스를 찾을 수 없습니다 | 대전 랜덤 여행',
      description: '존재하지 않거나 만료된 대전 여행 코스입니다.',
      robots: { index: false, follow: false },
    };
  }

  const record = result.data;
  const durationLabel = record.duration_type === 'half' ? '반나절' : '하루';
  const stopSummary = record.stops.map((s) => s.name).join(' → ');
  const title = `${record.title} | 대전 랜덤 여행`;
  const description = `[${durationLabel} 코스 · 총 ${record.stops.length}곳] ${stopSummary}`;
  const shareUrl = `${getSiteOrigin()}/r/${record.share_code}`;

  return {
    title,
    description,
    alternates: {
      canonical: shareUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: '대전 랜덤 여행',
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary',
      title,
      description,
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
