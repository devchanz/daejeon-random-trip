import React from 'react';

/**
 * Visual V4 Footer component.
 * Minimal, clean, restrained retro footer with subtle translucent background
 * allowing bottom scenery landscapes to integrate naturally.
 */
export function Footer() {
  return (
    <footer className="w-full bg-transparent py-4 px-4 text-center text-xs text-[#7d7366]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#2b2520]">
          <span>DAEJEON RANDOM TRIP MVP</span>
          <span>&middot;</span>
          <span>LOCAL TRAVEL EXPERIMENT</span>
        </div>
        <p className="text-[11px] text-[#8e8477]">
          고민 없이 떠나는 대전 당일치기 & 반일 랜덤 여행 코스 추천 서비스입니다.
        </p>
        <div className="text-[10px] text-[#aaa092]">
          &copy; {new Date().getFullYear()} Daejeon Random Trip. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
