import React from 'react';

/**
 * Visual V4 Header component based on Figma 00_FINAL_REFERENCE (Landing/Desktop).
 * Features a retro OS window titlebar ("⭐ let's go daejeon!") with window control buttons,
 * and a browser address bar pill ("❤️ letsgo-daejeon.com") with navigation icons.
 */
export function Header() {
  return (
    <header className="w-full border-b-2 border-[#2b2520] bg-[#fffef9] shadow-xs">
      {/* 1. Retro OS Window Titlebar */}
      <div className="flex h-8 w-full items-center justify-between border-b border-[#2b2520] bg-[#f7f3ea] px-3 sm:px-4 text-xs font-black text-[#2b2520]">
        <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs">
          <span>⭐</span>
          <span>let&apos;s go daejeon!</span>
        </div>

        {/* Window Control Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Minimize window"
            className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#2b2520] bg-[#ffd54f] text-[9px] font-bold text-[#2b2520] shadow-2xs hover:brightness-105"
          >
            &minus;
          </button>
          <button
            type="button"
            aria-label="Maximize window"
            className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#2b2520] bg-[#ffb74d] text-[8px] font-bold text-[#2b2520] shadow-2xs hover:brightness-105"
          >
            &#9633;
          </button>
          <button
            type="button"
            aria-label="Close window"
            className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#2b2520] bg-[#ff5555] text-[9px] font-bold text-white shadow-2xs hover:brightness-105"
          >
            &times;
          </button>
        </div>
      </div>

      {/* 2. Browser Navigation / Address Bar Strip */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 sm:px-6 sm:py-2 bg-[#fffef9]">
        {/* Navigation arrow buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-[#2b2520]">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#2b2520] bg-[#ffb800] text-[11px] font-black text-[#2b2520] shadow-2xs select-none"
          >
            &larr;
          </span>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#2b2520] bg-[#ffb800] text-[11px] font-black text-[#2b2520] shadow-2xs select-none"
          >
            &rarr;
          </span>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#2b2520] bg-[#ffb800] text-[11px] font-black text-[#2b2520] shadow-2xs select-none"
          >
            &#8635;
          </span>
        </div>

        {/* Center URL Pill */}
        <div className="flex flex-1 max-w-md items-center justify-center gap-1.5 rounded-full border border-[#2b2520] bg-[#fcf8f0] py-1 px-3 text-[11px] sm:text-xs font-mono font-bold text-[#2b2520] shadow-inner select-none">
          <span className="text-[#ff5555]">❤️</span>
          <span>letsgo-daejeon.com</span>
        </div>

        {/* Right menu icon */}
        <div className="flex items-center">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-[#2b2520] bg-[#faf6ee] text-xs font-black text-[#2b2520] shadow-2xs select-none"
          >
            &#9776;
          </span>
        </div>
      </div>
    </header>
  );
}
