import React from 'react';

/**
 * Visual V4 Right Sidebar.
 * Distinct scrapbook paper objects:
 * 1. DAEJEON PICK: Scrapbook clipping / featured theme card with photo-corner accents
 * 2. RANDOM LOG: Grid notebook page with perforated header (coming-soon safe)
 */
export function RightSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="대전 추천 테마 및 코스 로그 (Right Sidebar)"
      className={`flex flex-col gap-5 ${className}`}
    >
      {/* 1. DAEJEON PICK (Scrapbook Clipping Card) */}
      <section
        aria-label="DAEJEON PICK"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro rotate-0.5 transition-transform hover:rotate-0"
      >
        {/* Pink washi tape at top right */}
        <div
          aria-hidden="true"
          className="washi-tape-pink absolute -top-2.5 right-6 h-5 w-16 -rotate-6"
        />

        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffb800] border border-[#2b2520]" />
            <h2 className="font-mono text-xs font-black tracking-wider uppercase text-[#2b2520]">
              DAEJEON PICK
            </h2>
          </div>
          <span className="rounded-md border border-[#2b2520] bg-[#ffeaa7] px-2 py-0.5 text-[10px] font-black text-[#634a00] shadow-retro-xs">
            FEATURED
          </span>
        </div>

        {/* Spotlight Paper Clipping (Neutral Preview Placeholder) */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c7bca9] bg-[#faf6ee] p-4 text-center">
          <span className="text-2xl" role="img" aria-label="Sparkles">
            ✨
          </span>
          <div className="text-xs font-black text-[#2b2520]">
            이달의 추천 테마
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-[#756a5c]">
            대전의 대표 테마 및 스팟 추천 데이터가 준비 중입니다. 슬롯머신으로 랜덤 코스를 먼저 만나보세요!
          </p>
          <span className="mt-1 rounded-full border border-[#2b2520] bg-[#fffef9] px-2.5 py-0.5 text-[10px] font-black text-[#2b2520] shadow-retro-xs">
            PREVIEW
          </span>
        </div>
      </section>

      {/* 2. RANDOM LOG (Grid Notebook Page / Social Proof Shell) */}
      <section
        aria-label="RANDOM LOG"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#faf4e6] p-4 sm:p-5 shadow-retro bg-notebook-grid"
      >
        {/* Notebook top binding holes */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#10b981] border border-[#2b2520]" />
            <h2 className="font-mono text-xs font-black tracking-wider uppercase text-[#2b2520]">
              RANDOM LOG
            </h2>
          </div>
          <span className="font-mono text-[10px] font-black text-[#8c8273]">
            COMMUNITY
          </span>
        </div>

        {/* Coming Soon Safe Shell (Zero fake users/likes/data) */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c7bca9] bg-[#fffef9]/90 p-5 text-center shadow-xs">
          <span className="text-2xl" role="img" aria-label="Notebook">
            📓
          </span>
          <div className="text-xs font-black text-[#2b2520]">
            실시간 코스 공유 노트
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-[#756a5c]">
            여행자들이 뽑은 대전 랜덤 코스와 짧은 한 줄 후기를 공유하는 공간이 준비 중입니다.
          </p>
          <span className="mt-1 rounded-full border-2 border-[#2b2520] bg-[#fffef9] px-3 py-0.5 text-[10px] font-black text-[#2b2520] shadow-retro-xs">
            COMING SOON
          </span>
        </div>
      </section>
    </aside>
  );
}
