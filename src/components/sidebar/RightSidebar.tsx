import React from 'react';

/**
 * Visual V4 Right Sidebar based on Figma 00_FINAL_REFERENCE (Landing/Desktop).
 * 1. TODAY'S PICK: Curated spot preview with character badge, tags, and detail link.
 * 2. VISITOR LOG: Mini-homepage guestbook preview with 3 log entries and pagination.
 */
export function RightSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="추천 스팟 및 방명록 (Right Sidebar)"
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* 1. TODAY'S PICK (Curated Spotlight Card)
          Layout reserves top-right edge for future seated character asset */}
      <section
        aria-label="TODAY'S PICK"
        className="relative overflow-visible rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro"
      >
        {/* Header with Star Badge */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-[#ffb800]">⭐</span>
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              TODAY&apos;S PICK
            </h2>
          </div>
        </div>

        {/* Spot Preview Body */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-[#2b2520]">
              대전 야경이 숨은 스팟
            </h3>
            <span className="rounded-md border border-[#2b2520] bg-[#ff5555] px-2 py-0.5 text-[10px] font-black text-white shadow-2xs">
              BEST
            </span>
          </div>

          {/* Photo Thumbnail / Placeholder Frame */}
          <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-xl border border-[#2b2520] bg-[#121720]">
            {/* Night scenery gradient placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#1e1b4b] to-[#312e81] flex items-center justify-center">
              <span className="text-3xl" role="img" aria-label="Night view">
                🌉
              </span>
            </div>
            <div className="absolute bottom-1.5 right-2.5 text-[10px] font-mono text-white/80 font-bold">
              GAPCHEON NIGHT
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 text-xs font-bold text-[#6b6257]">
            <span className="rounded-md bg-[#faf6ee] px-2 py-0.5 border border-[#e8dfd0]">
              #야경맛집
            </span>
            <span className="rounded-md bg-[#faf6ee] px-2 py-0.5 border border-[#e8dfd0]">
              #뷰맛집
            </span>
            <span className="rounded-md bg-[#faf6ee] px-2 py-0.5 border border-[#e8dfd0]">
              #감성여행
            </span>
          </div>

          {/* Detail Link Button */}
          <button
            type="button"
            className="mt-1 flex w-full items-center justify-center rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] py-2.5 text-xs sm:text-sm font-black text-[#2b2520] shadow-2xs hover:bg-[#fff9e6] cursor-pointer"
          >
            자세히 보기 &gt;
          </button>
        </div>
      </section>

      {/* 2. VISITOR LOG (Community Guestbook Preview) */}
      <section
        aria-label="VISITOR LOG"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro"
      >
        {/* Header with Clover Icon and Write Button */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-[#10b981]">🍀</span>
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              VISITOR LOG
            </h2>
          </div>
          <span className="rounded-lg border border-[#2b2520] bg-[#e0f2fe] px-2.5 py-1 text-xs font-black text-[#0369a1] shadow-2xs cursor-pointer hover:bg-[#bae6fd]">
            방명록 쓰기 &gt;
          </span>
        </div>

        {/* 3 Preview Log Rows */}
        <div className="flex flex-col divide-y divide-[#eee7d8]">
          {/* Row 1 */}
          <div className="flex items-start gap-2.5 py-2.5 text-xs sm:text-sm">
            <span className="text-lg select-none" role="img" aria-label="꿈돌이">
              ⭐
            </span>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#2b2520]">꿈돌이 💕</span>
                <span className="font-mono text-[10px] text-[#8c8273]">05.20 14:30</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5c5244] leading-tight mt-0.5">
                대전 너무 좋아요~ 또 올게요!
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start gap-2.5 py-2.5 text-xs sm:text-sm">
            <span className="text-lg select-none" role="img" aria-label="여행자B">
              🌱
            </span>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#2b2520]">여행자B</span>
                <span className="font-mono text-[10px] text-[#8c8273]">05.20 13:10</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5c5244] leading-tight mt-0.5">
                추천 코스 덕분에 알찬 여행했어요!
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-start gap-2.5 py-2.5 text-xs sm:text-sm">
            <span className="text-lg select-none" role="img" aria-label="대전러버">
              🥐
            </span>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#2b2520]">대전러버</span>
                <span className="font-mono text-[10px] text-[#8c8273]">05.20 12:25</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5c5244] leading-tight mt-0.5">
                성심당 빵지순례 성공! 행복해요 🥐
              </p>
            </div>
          </div>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-[#eee7d8] pt-2.5 mt-1 text-xs font-mono font-bold text-[#6b6257]">
          <span className="hover:text-[#2b2520] cursor-pointer">&larr; 이전</span>
          <span>1 / 20</span>
          <span className="hover:text-[#2b2520] cursor-pointer">다음 &rarr;</span>
        </div>
      </section>
    </aside>
  );
}
