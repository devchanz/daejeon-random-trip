import React from 'react';

/**
 * Visual V4 Header component.
 * Features the primary brand "DAEJEON RANDOM TRIP" with playful retro toy styling,
 * paper badges, and responsive desktop/mobile presentation without fake navigation controls.
 */
export function Header() {
  return (
    <header className="w-full border-b-2 border-[#2b2520] bg-[#fffef9] shadow-sm">
      {/* Top decorative ticker strip */}
      <div className="w-full bg-[#2b2520] px-4 py-1 text-center text-[11px] font-mono font-medium tracking-widest text-[#fffdf8] flex items-center justify-between overflow-hidden">
        <span className="hidden sm:inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#ff5555] motion-safe:animate-pulse" />
          <span className="font-bold">DAEJEON RANDOM TRIP</span>
        </span>
        <span className="mx-auto sm:mx-0 font-bold tracking-wider flex items-center gap-1.5">
          <span>🎲</span>
          <span>고민 없이 뽑아보는 대전 랜덤 여행</span>
          <span>🎲</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[#ffb800] font-bold">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          <span>DAEJEON, KR</span>
        </span>
      </div>

      {/* Main Brand Area */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Toy Slot Machine Icon Badge */}
          <div className="relative flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2b2520] bg-[#ff5555] text-white shadow-retro select-none">
            <span className="text-2xl sm:text-3xl" role="img" aria-label="Slot machine">
              🎰
            </span>
            {/* Tiny screw accent */}
            <span className="absolute top-1 left-1 h-1 w-1 rounded-full bg-white/60" />
            <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-black/30" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#2b2520]">
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

        {/* Decorative stamp tag (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="rounded-xl border-2 border-[#2b2520] bg-[#faf4e6] px-3.5 py-1.5 text-center shadow-retro-sm rotate-1">
            <div className="text-[10px] font-mono font-black uppercase text-[#8c8273]">
              LOCAL TRIP TOY
            </div>
            <div className="text-xs font-black text-[#2b2520] flex items-center gap-1 justify-center">
              <span>✨</span>
              <span>랜덤 여행 생성기</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
