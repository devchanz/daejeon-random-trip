import React from 'react';

/**
 * Visual Master Footer component.
 * Minimal, restrained retro paper footer with pixel city skyline motif and copyright information.
 */
export function Footer() {
  return (
    <footer className="w-full border-t-2 border-[#2b2520] bg-[#fffef9] py-6 px-4 text-center text-xs text-[#7d7366] select-none">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2.5">
        {/* Subtle decorative city silhouette motif */}
        <div className="flex items-center gap-2 text-base opacity-75" aria-hidden="true">
          <span>🌳</span>
          <span>🏙️</span>
          <span>🗼</span>
          <span>🌳</span>
          <span>🚊</span>
          <span>🌳</span>
          <span>🗼</span>
          <span>🏙️</span>
          <span>🌳</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#2b2520]">
          <span>DAEJEON RANDOM TRIP MVP</span>
          <span>&middot;</span>
          <span>LOCAL TRAVEL EXPERIMENT</span>
        </div>
        <p className="text-[11px] text-[#8e8477]">
          고민 없이 떠나는 대전 당일치기 &amp; 반일 랜덤 여행 코스 추천 서비스입니다.
        </p>
        <div className="text-[10px] text-[#aaa092]">
          &copy; {new Date().getFullYear()} DAEJEON RANDOM TRIP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
