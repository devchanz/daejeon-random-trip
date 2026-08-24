import React from 'react';

/**
 * Visual Master Right Sidebar.
 * Distinct Korean Y2K scrapbook objects:
 * 1. DAEJEON PICK: Vintage postcard clipping card with stamp, skyline silhouette, and hashtag tags (zero hardcoded production place dependencies)
 * 2. RANDOM LOG: Grid notebook page shell for community shared notes (zero fake user/like data)
 */
export function RightSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="대전 추천 픽 및 랜덤 로그 (Right Sidebar)"
      className={`flex flex-col gap-5 select-none ${className}`}
    >
      {/* 1. DAEJEON PICK (Vintage Postcard Clipping Card) */}
      <section
        aria-label="DAEJEON PICK"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro rotate-0.5 transition-transform hover:rotate-0"
      >
        {/* Pink washi tape at top right */}
        <div
          aria-hidden="true"
          className="washi-tape-pink absolute -top-2.5 right-6 h-5 w-16 -rotate-6"
        />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ffb800] border border-[#2b2520]" />
            <h2 className="font-mono text-xs font-black tracking-wider uppercase text-[#2b2520]">
              DAEJEON PICK
            </h2>
          </div>
          <span className="rounded-md border border-[#2b2520] bg-[#ffeaa7] px-2 py-0.5 text-[10px] font-black text-[#634a00] shadow-retro-xs">
            FEATURED ✨
          </span>
        </div>

        {/* Postcard Frame with Stamp */}
        <div className="relative flex flex-col gap-2.5 rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] p-3 shadow-sm overflow-hidden">
          {/* Top Stamp decoration */}
          <div className="flex items-start justify-between">
            <div className="text-[11px] font-black text-[#2b2520]">
              대전토박이 추천 스팟
            </div>
            {/* Postage Stamp */}
            <div className="flex h-10 w-8 flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#ff5577] bg-[#fff0f3] text-[9px] font-mono font-black text-[#ff5577] shadow-xs">
              <span>🗼</span>
              <span className="text-[7px]">DJ-POST</span>
            </div>
          </div>

          {/* Stylized Postcard Skyline Artwork Container */}
          <div className="relative flex h-24 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-[#2b2520] bg-gradient-to-b from-[#162544] via-[#203a6c] to-[#3a588c] p-2 text-center text-white">
            {/* Moon & Stars */}
            <div className="absolute top-1.5 right-2 text-xs" aria-hidden="true">
              🌙 ✨
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xl" role="img" aria-label="Hanbit Tower">
                🗼
              </span>
              <span className="text-xs font-black tracking-tight text-[#fffdf8] drop-shadow-sm">
                엑스포과학공원 &amp; 한빛탑
              </span>
              <span className="text-[10px] text-[#e0e7ff] font-medium">
                낮에도 밤에도 매력 가득한 랜드마크
              </span>
            </div>
          </div>

          {/* Hashtag chips */}
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold">
            <span className="rounded-md border border-[#2b2520] bg-[#fffef9] px-2 py-0.5 text-[#2b2520] shadow-retro-xs">
              #갑천야경
            </span>
            <span className="rounded-md border border-[#2b2520] bg-[#fffef9] px-2 py-0.5 text-[#2b2520] shadow-retro-xs">
              #엑스포다리
            </span>
            <span className="rounded-md border border-[#2b2520] bg-[#fffef9] px-2 py-0.5 text-[#2b2520] shadow-retro-xs">
              #타워뷰
            </span>
          </div>
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
          <span className="font-mono text-[10px] font-black text-[#047857] bg-[#d1fae5] px-2 py-0.5 rounded border border-[#6ee7b7] shadow-retro-xs">
            COMMUNITY 🍀
          </span>
        </div>

        {/* Coming Soon Safe Shell (Zero fake users/likes/data) */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c7bca9] bg-[#fffef9]/95 p-4 sm:p-5 text-center shadow-xs">
          <span className="text-2xl" role="img" aria-label="Notebook">
            📓
          </span>
          <div className="text-xs font-black text-[#2b2520]">
            실시간 코스 공유 노트
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-[#756a5c]">
            여행자들이 뽑은 대전 랜덤 코스와 여행자 한 줄 후기를 함께 기록하는 공간이 준비 중입니다.
          </p>
          <span className="mt-1 rounded-full border-2 border-[#2b2520] bg-[#faf6ee] px-3 py-0.5 text-[10px] font-black text-[#2b2520] shadow-retro-xs">
            ✍️ COMING SOON
          </span>
        </div>
      </section>
    </aside>
  );
}
