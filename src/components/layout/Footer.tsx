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
          <span>DAEJEON RANDOM TRIP</span>
        </div>
        <p className="text-[11px] text-[#8e8477]">
          시간과 취향만 고르면 시작되는 대전 랜덤 여행
        </p>
        <p className="text-[10px] text-[#aaa092]">
          Made by TEAM ALJJA &middot;{' '}
          <a href="mailto:onethingtoall@gmail.com" className="hover:underline">
            문의 onethingtoall@gmail.com
          </a>
        </p>
        <div className="text-[10px] text-[#aaa092]">
          &copy; {new Date().getFullYear()} Daejeon Random Trip. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
