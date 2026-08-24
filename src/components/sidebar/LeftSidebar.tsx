import React from 'react';
import Image from 'next/image';

/**
 * Visual Master Left Sidebar.
 * Distinct Korean Y2K personal-web scrapbook objects:
 * 1. DAEJEON GUIDE: Pinned profile card with modular mascot frame, speech note, and travel point summary
 * 2. TRIP MIX: Nostalgic pastel blue mini music-player card with decorative equalizer & transport controls
 * 3. TODAY'S MEMO: Taped sticky memo note with handwriting tone
 */
export function LeftSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="대전 여행 안내 및 트립 믹스 (Left Sidebar)"
      className={`flex flex-col gap-5 select-none ${className}`}
    >
      {/* 1. DAEJEON GUIDE (Pinned Profile & Guide Note) */}
      <section
        aria-label="DAEJEON GUIDE"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro"
      >
        {/* Top Paperclip / Stamp decoration */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-[#2b2520] bg-[#ff5577] text-white text-[10px] shadow-retro-xs">
              ★
            </span>
            <h2 className="font-mono text-xs font-black tracking-wider uppercase text-[#2b2520]">
              DAEJEON GUIDE
            </h2>
          </div>
          <span className="rounded-md border border-[#2b2520] bg-[#ffeaa7] px-2 py-0.5 text-[10px] font-black text-[#634a00] shadow-retro-xs">
            안내소 🍀
          </span>
        </div>

        {/* Mascot & Profile Content */}
        <div className="flex flex-col gap-3">
          {/* Mascot frame & intro card */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-[#e4dcce] bg-[#faf6ee] p-2.5">
            {/* Mascot Character Avatar */}
            <div className="relative flex h-20 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-[#2b2520] bg-[#fffdf0] p-1 shadow-retro-xs">
              <Image
                src="/mascot-kkumdor.png"
                alt="대전 여행 가이드 마스코트"
                width={64}
                height={78}
                className="pixelated object-contain drop-shadow-xs"
                priority={false}
              />
              <span className="absolute top-0.5 right-0.5 text-[8px]" aria-hidden="true">
                ✨
              </span>
            </div>

            {/* Speech bubble note */}
            <div className="flex flex-1 flex-col justify-center text-xs leading-relaxed text-[#4a4237]">
              <p className="font-black text-[#2b2520] mb-0.5">
                짠! 대전 가이드예요 👋
              </p>
              <p className="text-[11px] font-medium text-[#5c5244] leading-snug">
                체류 시간과 취향만 고르면 딱 맞는 하루 코스를 쏙쏙 뽑아드려요!
              </p>
            </div>
          </div>

          {/* Quick Profile info checklist */}
          <div className="flex flex-col gap-1.5 rounded-xl bg-[#fdfbf7] p-2.5 border border-[#eee7d8] text-[11px] text-[#6b6257]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#8c8273]">도시</span>
              <span className="font-black text-[#2b2520]">대한민국 대전광역시</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#8c8273]">추천 포인트</span>
              <span className="font-bold text-[#e11d48]">#성심당 #칼국수 #원도심 #야경</span>
            </div>
            <div className="border-t border-dashed border-[#e4dcce] pt-1.5 text-[10px] text-[#7d7364] leading-tight">
              💡 <span className="font-bold">TIP:</span> 슬롯머신으로 행운의 랜덤 코스를 즉시 완성해보세요!
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRIP MIX (Pastel Blue Nostalgic Mini Player Panel) */}
      <section
        aria-label="TRIP MIX"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#eef5fb] p-4 sm:p-5 shadow-retro"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-black tracking-wider uppercase text-[#2b2520]">
              📻 TRIP MIX
            </span>
          </div>
          <span className="font-mono text-[10px] font-black text-[#476a8a] bg-[#dbeafe] px-2 py-0.5 rounded border border-[#93c5fd] shadow-retro-xs">
            VOL. 01 🎵
          </span>
        </div>

        {/* Mini Music Player Box */}
        <div className="flex flex-col gap-2.5 rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-3 text-[#2b2520] shadow-sm">
          {/* Top Status & Equalizer Display */}
          <div className="flex items-center justify-between text-[10px] font-mono font-bold">
            <span className="rounded bg-[#ff5577] px-1.5 py-0.5 text-[9px] text-white shadow-retro-xs">
              NOW PLAYING
            </span>

            {/* Tiny Animated Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-4 px-1" aria-hidden="true">
              <span className="w-1 rounded-xs bg-[#ff5577] animate-eq-1" />
              <span className="w-1 rounded-xs bg-[#ffb800] animate-eq-2" />
              <span className="w-1 rounded-xs bg-[#10b981] animate-eq-3" />
              <span className="w-1 rounded-xs bg-[#3b82f6] animate-eq-4" />
              <span className="w-1 rounded-xs bg-[#8b5cf6] animate-eq-5" />
            </div>
          </div>

          {/* Track Info */}
          <div className="pt-0.5">
            <div className="text-xs font-black text-[#2b2520] tracking-tight">
              대전의 오후 (Daejeon Afternoon)
            </div>
            <div className="text-[10px] font-medium text-[#756a5c]">
              by DAEJEON BEAT &middot; 로컬 여행 사운드
            </div>
          </div>

          {/* Retro Transport Visual Controls (Purely decorative visual display) */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-3 pt-1 border-t border-dashed border-[#e4dcce]"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#2b2520] bg-[#faf6ee] text-[10px] text-[#4a4237] shadow-retro-xs">
              &#9664;&#9664;
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-[#2b2520] bg-[#ff5577] text-xs text-white shadow-retro-xs font-black">
              &#10074;&#10074;
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#2b2520] bg-[#faf6ee] text-[10px] text-[#4a4237] shadow-retro-xs">
              &#9654;&#9654;
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#2b2520] bg-[#faf6ee] text-[10px] text-[#4a4237] shadow-retro-xs">
              🎧
            </div>
          </div>

          {/* Progress Bar Display */}
          <div className="flex items-center justify-between text-[9px] font-mono text-[#8c8273] gap-2 pt-0.5">
            <span>01:32</span>
            <div className="h-1.5 flex-1 rounded-full bg-[#e5decb] overflow-hidden border border-[#d8d0c2]">
              <div className="h-full w-[42%] bg-[#ff5577]" />
            </div>
            <span>03:45</span>
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

        <div className="flex items-center justify-between border-b border-dashed border-[#d8d0c2] pb-2 mb-2.5 text-[11px] font-mono font-black text-[#8c8273]">
          <span className="flex items-center gap-1">
            <span>📌</span>
            <span>TODAY&apos;S MEMO</span>
          </span>
          <span className="text-[10px] text-[#ffb800]">✨</span>
        </div>

        <p className="text-xs font-bold leading-relaxed text-[#4a4237]">
          &ldquo;성심당 빵 한 봉지 챙겨 들고, 슬롯이 정해준 숨은 골목 명소를 천천히 거닐어보세요. 대전의 진짜 매력은 골목 속에 있습니다.&rdquo;
        </p>
      </section>
    </aside>
  );
}
