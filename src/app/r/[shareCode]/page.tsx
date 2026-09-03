import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { SharedRouteView } from '../../../components/share';
import { getSharedRouteByCode, isValidShareCode } from '../../../lib/database';
import { getSiteOrigin } from '../../../lib/share';
import { getDurationLabel } from '../../../content/labels';

interface PageProps {
  params: Promise<{
    shareCode: string;
  }>;
}

/**
 * Same static brand OG asset root layout.tsx uses (public/og-daejeon-random-trip.png,
 * verified 1200x630 opaque PNG) -- reused as-is here too, never a route-specific
 * image and never dynamically generated. Not a src/config/visualAssets.ts entry;
 * that registry is scoped to in-app game-art, this is a crawler/metadata asset.
 */
const OG_IMAGE = {
  url: '/og-daejeon-random-trip.png',
  width: 1200,
  height: 630,
  alt: '대전 랜덤 여행 | DAEJEON RANDOM TRIP',
};

/**
 * Dynamic Open Graph and SEO metadata for shared route landing page.
 * Strictly snapshot-only: resolves all fields deterministically from SharedRouteRecord.
 * Enforces robots: { index: false, follow: false } (noindex) per ADR-014.
 * All three branches (invalid code / not found / valid record) carry the
 * same static OG image, so link previews look consistent even on error states.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareCode } = await params;

  if (!isValidShareCode(shareCode)) {
    const title = '공유 여행 코스 | 대전 랜덤 여행';
    const description = '대전 랜덤 여행 추천 코스를 확인해보세요.';
    return {
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: { title, description, images: [OG_IMAGE] },
      twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
    };
  }

  const result = await getSharedRouteByCode(shareCode);
  if (!result.success || !result.data) {
    const title = '여행 코스를 찾을 수 없습니다 | 대전 랜덤 여행';
    const description = '존재하지 않거나 만료된 대전 여행 코스입니다.';
    return {
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: { title, description, images: [OG_IMAGE] },
      twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
    };
  }

  const record = result.data;
  const durationLabel = getDurationLabel(record.duration_type);
  // Deliberately NOT `record.title` -- the generated route title bakes in the
  // drawn zone/dong (e.g. "선화동 반일 코스"), which would spoil the mystery.
  // `??동` is a LITERAL product-facing placeholder (not derived from
  // `record.zone_id` in any way) -- the canonical duration label is the only
  // real routing info exposed pre-click. The description is now a fixed
  // curiosity line: the previous version rendered the full stop list (place
  // names + count), which leaked exactly the itinerary detail the mystery
  // link is meant to withhold until the recipient actually opens it -- the
  // real place names/itinerary/mission still render normally on the shared
  // page itself (SharedRouteView), only this pre-click metadata changed.
  const title = `??동 · ${durationLabel} | 대전 랜덤 여행`;
  const description = '어디로 갈지는 링크를 열어 확인해보세요 👀';
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
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
    <div className="flex min-h-screen flex-col bg-[#fdfbf7] text-[#2b2520]">
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
