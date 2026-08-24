import React from 'react';

/**
 * Visual Master Header component.
 * Features the primary brand "DAEJEON RANDOM TRIP" with retro application frame chrome,
 * pixel accents, segmented feature tags, and compact responsive layout without fake navigation or interactive window controls.
 */
export function Header() {
  return (
    <header className="w-full border-b-2 border-[#2b2520] bg-[#fffef9] shadow-sm select-none">
      {/* Top retro window chrome bar */}
      <div className="w-full border-b border-[#2b2520]/20 bg-[#faf6ee] px-4 py-1 text-center text-[11px] font-mono text-[#2b2520] flex items-center justify-between overflow-hidden">
        {/* Left window indicator */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-2.5 w-2.5 rounded-full border border-[#2b2520] bg-[#ff6b8b]" />
          <span className="inline-flex h-2.5 w-2.5 rounded-full border border-[#2b2520] bg-[#ffb800]" />
          <span className="inline-flex h-2.5 w-2.5 rounded-full border border-[#2b2520] bg-[#10b981]" />
          <span className="hidden sm:inline font-black ml-1 text-[10px] tracking-widest text-[#756a5c]">
            DAEJEON RANDOM TRIP v1.0
          </span>
        </div>

        {/* Center motto */}
        <div className="mx-auto sm:mx-0 font-bold text-xs tracking-wider flex items-center gap-1.5 text-[#4a4237]">
          <span>🍀</span>
          <span>고민 없이 뽑아보는 대전 랜덤 여행</span>
          <span>🍀</span>
        </div>

        {/* Right decorative window controls (strictly non-interactive per spec) */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-[#8c8273]">
          <span className="flex h-4 w-4 items-center justify-center rounded border border-[#2b2520]/40 bg-[#fffef9] text-[9px]">
            &minus;
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded border border-[#2b2520]/40 bg-[#fffef9] text-[8px]">
            &#9633;
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded border border-[#2b2520]/40 bg-[#fffef9] text-[9px] text-[#ff5555]">
            &times;
          </span>
        </div>
      </div>

      {/* Main Brand Area */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Toy Slot Machine Icon Badge */}
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2b2520] bg-[#ff5577] text-white shadow-retro select-none">
            <span className="text-2xl sm:text-3xl pixelated" role="img" aria-label="Slot machine">
              🎰
            </span>
            {/* Tiny highlight accents */}
            <span className="absolute top-1 left-1 h-1 w-1 rounded-full bg-white/70" />
            <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-black/30" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#2b2520]">
                DAEJEON RANDOM TRIP
              </h1>
              <span className="inline-block -rotate-2 rounded-md border-2 border-[#2b2520] bg-[#ffb800] px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase text-[#2b2520] shadow-retro-xs transition-transform hover:rotate-0">
                LET&apos;S GO!
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#756a5c]">
              체류 시간과 취향만 고르면 바로 뽑히는 나만의 대전 코스
            </p>
          </div>
        </div>

        {/* Segmented Feature Tags (Pure presentation visual rhythm, non-clickable) */}
        <div className="hidden lg:flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-xl border-2 border-[#2b2520] bg-[#faf6ee] p-1 shadow-retro-xs text-xs font-black">
            <span className="rounded-lg border border-[#2b2520] bg-[#ff5577] px-2.5 py-1 text-white shadow-retro-xs">
              🎲 여행 뽑기
            </span>
            <span className="px-2 py-1 text-[#756a5c]">
              🧭 가이드
            </span>
            <span className="px-2 py-1 text-[#756a5c]">
              📻 트립 믹스
            </span>
            <span className="px-2 py-1 text-[#756a5c]">
              🌟 대전 픽
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
