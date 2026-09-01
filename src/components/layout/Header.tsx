import React from 'react';
import Link from 'next/link';
import { visualAsset } from '../../config/visualAssets';
import { FittedAsset } from '../common';

/**
 * Retro OS window titlebar ("⭐ let's go daejeon!") plus a browser address-bar pill
 * ("❤️ letsgo-daejeon.com"), now skinned with the production Chrome artwork from the
 * Figma Production manifest (02_CHROME).
 *
 * Both `Chrome/*Controls` exports are SINGLE COMPOSITE SPRITES -- one file contains all
 * three arrows, another all three window buttons -- so each renders as one decorative
 * image rather than three separately positioned glyphs.
 *
 * Nothing here is interactive except the URL pill. The window "buttons" this replaced
 * carried `aria-label`s but had no handler; rendering the composite as a single
 * `aria-hidden` image removes three fake controls from the accessibility tree without
 * changing any behavior. The hamburger is likewise decorative and supplementary at every
 * width -- it is deliberately NOT wired up as a menu, and NOT a mobile-only replacement.
 * The site's only real navigation affordance remains the address-bar pill.
 */
export function Header() {
  return (
    <header className="w-full border-b-2 border-[#2b2520] bg-[#fffef9] shadow-xs">
      {/* 1. Retro OS Window Titlebar */}
      <div className="flex h-8 w-full items-center justify-between border-b border-[#2b2520] bg-[#f7f3ea] px-3 sm:px-4 text-xs font-black text-[#2b2520]">
        <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs">
          {/* Production Manifest star replaces the standalone glyph. Sized to the titlebar
              hierarchy it inherited (text-[11px] sm:text-xs), NOT enlarged. Reuses the
              existing decoration.symbol.star opaque-fit entry, so box size == visible size
              and the fixed h-8 titlebar height is unchanged. */}
          <FittedAsset
            assetKey="decoration.symbol.star"
            className="h-[11px] w-[11px] sm:h-3 sm:w-3 shrink-0"
          />
          <span>let&apos;s go daejeon!</span>
        </div>

        {/* Window Control Composite (decorative; minimize / maximize / close in one file).
            Height-locked so the 32px titlebar cannot grow. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visualAsset('chrome.windowControls')}
          alt=""
          aria-hidden="true"
          width={501}
          height={167}
          className="h-4 sm:h-5 w-auto select-none"
        />
      </div>

      {/* 2. Browser Navigation / Address Bar Strip */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 sm:px-6 sm:py-2 bg-[#fffef9]">
        {/* Navigation Control Composite (decorative; back / forward / reload in one file).
            Hidden below `sm`: it is pure decoration, and dropping it returns ~80px of
            horizontal room to the address pill on 360-400px viewports. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visualAsset('chrome.navigationControls')}
          alt=""
          aria-hidden="true"
          width={579}
          height={193}
          className="hidden sm:block h-6 w-auto shrink-0 select-none"
        />

        {/* Center URL Pill -- doubles as the site's Home control (address bar metaphor) */}
        <Link
          href="/"
          aria-label="대전 랜덤 여행 홈으로 이동"
          className="flex flex-1 max-w-md items-center justify-center gap-1.5 rounded-full border border-[#2b2520] bg-[#fcf8f0] py-1 px-3 text-[11px] sm:text-xs font-mono font-bold text-[#2b2520] shadow-inner transition-colors hover:bg-[#f7f3ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff5555] focus-visible:outline-offset-1"
        >
          <span className="text-[#ff5555]">❤️</span>
          <span>letsgo-daejeon.com</span>
        </Link>

        {/* Right menu glyph (decorative, supplementary at all widths) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visualAsset('chrome.menu')}
          alt=""
          aria-hidden="true"
          width={162}
          height={162}
          className="h-6 w-6 shrink-0 select-none"
        />
      </div>
    </header>
  );
}
