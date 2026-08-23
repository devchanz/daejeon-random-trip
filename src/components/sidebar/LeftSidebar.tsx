import React from 'react';

/**
 * Visual V4 Left Sidebar.
 * Distinct scrapbook paper objects:
 * 1. DAEJEON GUIDE: Guide note / passport-style info sheet with corner tag and step checklist
 * 2. TRIP MIX: Mixtape cassette panel with authentic retro tape graphics
 * 3. TODAY'S MEMO: Taped sticky memo note with handwriting tone
 */
export function LeftSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="대전 여행 안내 및 메모 (Left Sidebar)"
      className={`flex flex-col gap-5 ${className}`}
    >
      {/* 1. DAEJEON GUIDE (Guide Note / Paper Info Card) */}
      <section
        aria-label="DAEJEON GUIDE"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro"
      >
        {/* Top Paperclip / Stamp decoration */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-[#2b2520] bg-[#ff5555] text-white text-[10px] shadow-retro-xs">
              ★
            </span>
            <h2 className="font-mono text-xs font-black tracking-wider uppercase text-[#2b2520]">
              DAEJEON GUIDE
            </h2>
          </div>
          <span className="rounded-md border border-[#2b2520] bg-[#ffeaa7] px-2 py-0.5 text-[10px] font-black text-[#634a00] shadow-retro-xs">
            안내소
          </span>
        </div>

        {/* Guide Content: Friendly text and step explanation */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border-2 border-[#e4dcce] bg-[#faf6ee] p-3 text-xs leading-relaxed text-[#4a4237]">
            <p className="font-black text-[#2b2520] mb-1">
              👋 대전에 오신 것을 환영해요!
            </p>
            <p className="font-medium text-[#5c5244]">
              복잡한 여행 계획은 이제 그만. 체류 시간과 취향을 선택하면 나만의 대전 랜덤 코스를 바로 뽑아드립니다.
            </p>
          </div>

          {/* Step checklist */}
          <div className="flex flex-col gap-2 rounded-xl bg-[#fdfbf7] p-2.5 border border-[#eee7d8] text-[11px] text-[#6b6257]">
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#2b2520] bg-[#2b2520] text-[9px] text-white">
                1
              </span>
              <span>체류 시간 (반나절 / 하루) 선택</span>
            </div>
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#2b2520] bg-[#2b2520] text-[9px] text-white">
                2
              </span>
              <span>원하는 테마 (먹방/산책/사진 등) 선택</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-[#2b2520]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#2b2520] bg-[#ff5555] text-[9px] text-white">
                3
              </span>
              <span>슬롯머신으로 행운의 코스 뽑기!</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRIP MIX (Mixtape Cassette Panel) */}
      <section
        aria-label="TRIP MIX"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#faf4e6] p-4 sm:p-5 shadow-retro"
      >
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-black tracking-wider uppercase text-[#2b2520]">
              📻 TRIP MIX
            </span>
          </div>
          <span className="font-mono text-[10px] font-black text-[#8c8273]">
            VOL. 01
          </span>
        </div>

        {/* Cassette Tape Artwork */}
        <div className="flex flex-col gap-2.5 rounded-2xl border-2 border-[#2b2520] bg-[#2b2520] p-3.5 text-[#fffdf8] shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#ffb800] font-bold">
            <span>SIDE A &middot; 45 RPM</span>
            <span className="rounded bg-[#ff5555] px-1 py-0.2 text-[8px] text-white">
              STEREO
            </span>
          </div>

          {/* Tape window with reel spools */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#1b1713] rounded-xl border border-[#443b32]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-[#ffb800] bg-[#2b2520]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
            <div className="h-4 w-14 rounded-md bg-[#332c25] border border-[#554a3e] flex items-center justify-center text-[8px] font-mono text-[#8c8273]">
              DAEJEON
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-[#ffb800] bg-[#2b2520]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </div>

          <div className="text-center pt-0.5">
            <div className="text-xs font-black text-[#fffdf8] tracking-wide">
              DAEJEON CITY WALK
            </div>
            <div className="text-[10px] font-medium text-[#c4b9aa]">
              대전천 바람과 함께 걷는 오후의 BGM
            </div>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S MEMO (Taped Sticky Memo Pad) */}
      <section
        aria-label="TODAY'S MEMO"
        className="relative rounded-2xl border-2 border-[#2b2520] bg-[#fffdf0] p-4 sm:p-5 shadow-retro -rotate-1 transition-transform hover:rotate-0"
      >
        {/* Yellow washi tape strip at top */}
        <div
          aria-hidden="true"
          className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-24 rounded-xs"
        />

        <div className="flex items-center gap-1.5 border-b border-dashed border-[#d8d0c2] pb-2 mb-2.5 text-[11px] font-mono font-black text-[#8c8273]">
          <span>📌 TODAY&apos;S MEMO</span>
        </div>

        <p className="text-xs font-bold leading-relaxed text-[#4a4237]">
          &ldquo;성심당 빵 한 봉지 챙겨 들고, 슬롯이 정해준 숨은 골목 명소를 천천히 거닐어보세요. 대전의 진짜 매력은 골목 속에 있습니다.&rdquo;
        </p>
      </section>
    </aside>
  );
}
