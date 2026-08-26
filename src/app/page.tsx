import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';
import { MainExperience } from '../components/experience';
import {
  DEMO_ZONES,
  DEMO_CANDIDATES,
  DEMO_INITIAL_STATE,
} from '../lib/demo/fixture';

interface HomePageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const isDemo =
    resolvedParams?.demo === '1' || resolvedParams?.demo === 'true';

  return (
    <div className="flex min-h-screen flex-col bg-retro-dots text-[#2b2520]">
      {/* 1. Visual V4 Header */}
      <Header />

      {/* 2. Responsive 3-Column Grid Layout */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left Sidebar: DAEJEON GUIDE, TRIP MIX, TODAY'S MEMO */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <LeftSidebar />
          </div>

          {/* Center Column: Hero Main Experience (Setup -> Slot -> Result) */}
          <main className="order-1 flex w-full flex-col items-center lg:order-2 lg:col-span-6">
            <MainExperience
              zones={isDemo ? DEMO_ZONES : []}
              candidates={isDemo ? DEMO_CANDIDATES : []}
              initialState={isDemo ? DEMO_INITIAL_STATE : undefined}
            />
          </main>

          {/* Right Sidebar: DAEJEON PICK, RANDOM LOG */}
          <div className="order-3 lg:order-3 lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* 3. Visual V4 Footer */}
      <Footer />
    </div>
  );
}
