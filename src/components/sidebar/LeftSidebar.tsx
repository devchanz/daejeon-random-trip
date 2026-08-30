import React from 'react';

/**
 * Visual V4 Left Sidebar based on Figma 00_FINAL_REFERENCE (Landing/Desktop).
 * 1. MY PROFILE: Kkumdori character illustration with friendly intro note.
 * 2. TODAY IS...: Daily travel mood memo with mini-homepage visit counters.
 * 3. BGM PLAYING: Retro music player widget with track info and control buttons.
 */
export function LeftSidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="미니홈피 프로필 및 메모 (Left Sidebar)"
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* 1. MY PROFILE (Character & Welcome Memo) */}
      <section
        aria-label="MY PROFILE"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro"
      >
        {/* Header Bar with Bookmark Ribbon */}
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base" role="img" aria-label="Profile">
              🐱
            </span>
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              MY PROFILE
            </h2>
          </div>
          <span className="text-sm font-bold text-[#ffb800]" aria-hidden="true">
            🔖
          </span>
        </div>

        {/* Profile Card Body: Avatar + Welcome Text */}
        <div className="flex items-center gap-3.5">
          {/* Standing Kkumdori Illustration */}
          <div className="relative flex h-20 w-16 sm:h-24 sm:w-20 shrink-0 items-center justify-center rounded-xl border border-[#d8d0c2] bg-[#fffdf0] p-1 shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/kkumdori-main.png"
              alt="꿈돌이"
              className="h-full w-auto object-contain select-none"
            />
          </div>

          {/* Welcome Message */}
          <div className="flex flex-col gap-1 text-[#2b2520]">
            <p className="text-sm sm:text-base font-black text-[#2b2520]">
              반가워요! 👋
            </p>
            <p className="text-xs sm:text-sm font-medium leading-tight text-[#5c5244]">
              대전 랜덤여행 미니홈피에 오신 걸 환영해요!
            </p>
            <p className="text-xs font-bold text-[#8c8273]">
              오늘은 어떤 대전의 매력을 발견하게 될까요? ✨
            </p>
          </div>
        </div>
      </section>

      {/* 2. TODAY IS... (Daily Mood Memo & Visitor Counter) */}
      <section
        aria-label="TODAY IS..."
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffdf0] p-4 sm:p-5 shadow-retro"
      >
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
            TODAY IS...
          </h2>
          <span className="text-sm font-bold text-[#ffb800]" aria-hidden="true">
            🔖
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm sm:text-base font-black text-[#2b2520] leading-snug">
            설레는 대전 여행 가는 날! 💕
          </p>

          <div className="flex items-center justify-between rounded-xl bg-[#faf6ee] px-3 py-2 font-mono text-xs font-bold text-[#6b6257] border border-[#e8dfd0]">
            <span>TOTAL VISIT : 01234</span>
            <span>TODAY : 0056</span>
          </div>
        </div>
      </section>

      {/* 3. BGM PLAYING (Retro Web Music Player) */}
      <section
        aria-label="BGM PLAYING"
        className="relative overflow-hidden rounded-2xl border-2 border-[#2b2520] bg-[#fffef9] p-4 sm:p-5 shadow-retro"
      >
        <div className="flex items-center justify-between border-b-2 border-[#2b2520] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-[#ff5555]">🎵</span>
            <h2 className="font-mono text-sm font-black tracking-wider uppercase text-[#2b2520]">
              BGM PLAYING
            </h2>
          </div>
          <span className="text-sm font-bold text-[#ffb800]" aria-hidden="true">
            🔖
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#2b2520] leading-tight">
                대전의 오후 (Daejeon Afternoon)
              </span>
              <span className="font-mono text-xs font-bold text-[#8c8273]">
                by DAEJEON BEAT
              </span>
            </div>

            {/* Graphic Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
              <span className="w-1 h-2 bg-[#10b981] rounded-xs" />
              <span className="w-1 h-3.5 bg-[#ffb800] rounded-xs" />
              <span className="w-1 h-2.5 bg-[#ff5555] rounded-xs" />
              <span className="w-1 h-4 bg-[#10b981] rounded-xs" />
            </div>
          </div>

          {/* Retro Media Player Controls */}
          <div className="flex items-center justify-center gap-2.5 rounded-xl bg-[#faf6ee] p-2.5 border border-[#e8dfd0]">
            <button
              type="button"
              aria-label="Previous track"
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#2b2520] bg-[#fffef9] text-xs font-black text-[#2b2520] shadow-2xs hover:bg-[#fff9e6] cursor-pointer"
            >
              &#9198;
            </button>
            <button
              type="button"
              aria-label="Pause track"
              className="flex h-8 w-9 items-center justify-center rounded-lg border-2 border-[#2b2520] bg-[#ff5555] text-xs font-black text-white shadow-2xs hover:bg-[#ff3b3b] cursor-pointer"
            >
              &#10074;&#10074;
            </button>
            <button
              type="button"
              aria-label="Next track"
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#2b2520] bg-[#fffef9] text-xs font-black text-[#2b2520] shadow-2xs hover:bg-[#fff9e6] cursor-pointer"
            >
              &#9197;
            </button>
            <button
              type="button"
              aria-label="Stop track"
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#2b2520] bg-[#fffef9] text-xs font-black text-[#2b2520] shadow-2xs hover:bg-[#fff9e6] cursor-pointer"
            >
              &#9632;
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
}
