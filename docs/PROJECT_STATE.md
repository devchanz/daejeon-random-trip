# Daejeon Random Trip — Project State

## Snapshot
- **Last Updated**: 2026-09-04 (discovery/retention closeout, branch `feat/todays-daejeon-discovery`)
- **Current `main` HEAD**: `f91a8d9` (`feat: actualize production place data`)
- **Current branch**: `feat/todays-daejeon-discovery` — Human Browser E2E approved end-to-end, **not yet committed, not yet merged**. Every change described in this update exists only in this branch's working tree.
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9, pnpm 11, Supabase (PostgreSQL REST)
- **Working tree**: uncommitted branch work pending integration (see **A** below for the full file list).

**TL;DR**: `feat/todays-daejeon-discovery` is a discovery/retention + small UX cleanup pass on top of the `main`-merged INTRO/Route-Guide-DOM-CSS/Slot-Peek/place-data work. Headline changes: the Right Rail editorial surface is renamed **TODAY'S PICK → TODAY'S DAEJEON** and rebuilt as a manual 5-item carousel (no autoplay) over the approved production banner set, each with a real outbound destination URL, inside a **fixed `aspect-[15/8]` viewport** so switching banners never shifts page layout; the half-day Result's `ExploreMoreBanner` 4th cell is now wired — its CTA minimizes Result (never discards it) and scrolls to whichever TODAY'S DAEJEON rail instance is currently visible; Memory Log entries now snapshot the actual generated route's place names (`guestbook_entries.route_place_names`, nullable, additive, no backfill) so two logs sharing the same duration/preference/zone visibly differ; a share-copy blank-line bug is fixed; the Bonus Quest mission pool was replaced with a 34-item, ≤18-character production set; Footer team/email contrast was fixed; and `site_visits` — already wired to real code in a prior branch — is now confirmed end-to-end working after the user manually applied its two pending migrations. See **C** for the visual/architectural state and ADR-038 in `docs/DECISIONS.md` for the consolidated decision record.

This document is organized as: **A** what's merged, **B** the confirmed product contract, **C** the current visual/architectural state, **D** analytics state, **E** what's deferred, **F** known non-blocking polish, **G** next priorities, **H** governance rules that must not be casually overridden.

---

## A. Merged / Implemented

Most recent first:

- **`feat/todays-daejeon-discovery` (this branch, uncommitted, Human Browser E2E approved, ADR-038)** — Right Rail editorial surface renamed **TODAY'S PICK → TODAY'S DAEJEON** and rebuilt as a manual 5-item carousel (prev/next chevrons + `n / 5` indicator, touch swipe, no autoplay) over the approved production banner set (the obsolete uncaptioned `night-view` asset retired, its approved replacement `expo-bridge-night` already baking in the caption), each item now carrying a real outbound destination URL (`EditorialItem.href`, opened in a new tab); the carousel viewport is a **fixed `aspect-[15/8]` box** (`object-cover`, per-item `object-position` escape hatch) so the two ~16:9-sourced banners never change the card's rendered height when browsed to; half-day Result's `ExploreMoreBanner` 4th-cell CTA is wired end-to-end — a lightweight text-link action (not a competing filled button) that minimizes Result (never discards it) and scrolls to whichever TODAY'S DAEJEON rail instance (`data-today-daejeon-rail`, resolved via `offsetParent` visibility rather than a hardcoded breakpoint) is currently on screen; Memory Log entries now snapshot the actual generated route's place names (`guestbook_entries.route_place_names TEXT[] NULL`, additive migration, no backfill, all three read surfaces degrade safely on `NULL`); a share-copy blank-line bug fixed (`content/share.ts`); the Bonus Quest mission pool replaced with a 34-item, ≤18-character production set; Footer team/email line contrast fixed (ink `#2b2520`); and `site_visits` — code-complete since `feat/sidebar-actualization-bgm` — confirmed end-to-end working (`TOTAL VISIT`/`TODAY` showing real numbers) after its two pending migrations were applied. See **C** for the architecture and `docs/DECISIONS.md` ADR-038.
- **`feat/slot-peek` (Human Browser E2E accepted, ADR-036)** — SPIN → Peek → Result implemented and `OUTPUT_PEEK_ENABLED` flipped live, closing the long-dormant ADR-022 note without a new visual asset: a shared `ExperienceProvider` (mounted once) now owns the entire experience engine consumed by both the desktop/mobile `MainExperience` (Hero) presentations, fixing cross-breakpoint state continuity across READY/SPINNING/PEEK/RESULT; a single `ExperienceOverlays` (mounted once, outside both dual-mount trees) is now the sole render site for the reveal-emphasis backdrop, `ResultArea`, `GuestbookComposer`, and `RouteGuideModal`; Slot Peek itself is a measured-cavity, DOM/CSS paper strip occluded by a clipped re-instance of the existing chassis raster, visible only while `revealStage === 'peek'` with the approved Result-revealed/minimized visuals otherwise unchanged; completion is a `setTimeout` + run-token + `Date.now()` deadline/`visibilitychange` reconciliation contract; a new `ResultSkinPreload` prepares Result skin assets during READY/SPINNING. See **C** and `docs/DECISIONS.md` ADR-036 for the full architecture.
- **`feat/product-visual-polish` (this branch, uncommitted, Human Browser E2E approved, ADR-032–ADR-035)** — INTRO soft entry gate (new initial phase, footprint-locked to `SetupArea`/Q1 at every breakpoint); Route Guide rebuilt to 100% DOM/CSS (zero raster, all 6+1 skin/mission-shell rasters deleted and unregistered); mobile quick-jump arrow redesigned (pixel-art → neutral circular control); Random Log → Memory Log product-facing rename (copy only); native share final copy; shared-route mystery link-preview metadata + static verified 1200×630 OG asset wired (root + `/r/[shareCode]`, all branches, `summary_large_image`); Footer credit/contact line (`Made by TEAM ALJJA` / `문의 onethingtoall@gmail.com`); Q1/Q2 copy finalized, STEP-label typography de-emphasized, READY/SPINNING header treatment finalized; `MY PROFILE` sidebar copy finalized; dead `setup.intro.start` asset + registry entries removed (Phase 8 audit, zero runtime consumers verified). See **C** for the architecture and `docs/DECISIONS.md` ADR-032–ADR-035 for the individual decisions and their rejected alternatives.
- **Mobile short-height Slot viewport fix** (branch `fix/mobile-slot-short-viewport`, not yet merged to `main`; ADR-031) — Human Browser E2E passed on a real iPhone XS-class Safari device. See **C** below for the height-budget contract.
- **GA4 base analytics integration** (`6ae03c4`) — `@next/third-parties`'s `GoogleAnalytics` mounted once in root layout, gated on `NEXT_PUBLIC_GA_MEASUREMENT_ID`. See **D** below and `docs/ANALYTICS.md` §9.
- **Result Quest & Route Guide visual redesign** (`6560a5b`) — production-raster redesign of both the Result Card and the in-app Route Guide. **Route Guide's raster direction from this commit is now superseded** (see `feat/product-visual-polish` above and ADR-033) — Result's raster skin is unaffected and remains current. No ADR was recorded for this pass at the time (flagged in **G**; still an open documentation gap for the *Result* half specifically).
- **Visual Detail Pass** (`65f3546`, ADR-027–ADR-030) — DOS Gothic finalized as the production Korean/UI typeface; 31 production PNG assets integrated via a central visual asset registry (`src/config/visualAssets.ts`); Editorial Rail rebuilt (`EditorialItem` + `EditorialSpotlightCard`, 6 seeded items); Final CSS Polish (decorative shadow removal, decoration normalization, spacing/logo scale tuning).
- **Reduced-motion Slot hotfix** (`a3b888c`, ADR-026) — a shared lifecycle clock now drives SPINNING → RESULT identically for both motion preferences; reduced motion runs the same reel-roll animation at ~2× lower intensity rather than a shortened/instant one.
- **Random Log / Right Rail Community Surface** (`0aef8c7`, ADR-025) — public read IA (Right Rail preview → `/random-log` board → `/random-log/[id]` detail), all ungated and available pre-spin; writing remains Result-gated and is decoupled from the 1-time reroll reward. User-facing naming for this surface is now **Memory Log** (`feat/product-visual-polish`, ADR-034) — the technical architecture this entry describes is otherwise unchanged.
- **Result/Ticket Output System DEV contract** (`053289c`, ADR-008/ADR-022/ADR-023/ADR-024) — centered Result Card overlay, output-slit peek-cue mount architecture (visually dormant), minimize/reopen (결과 접기) lifecycle, nested-overlay keyboard-ownership handoff.
- **Earlier foundation** — Controlled Random recommendation engine (`src/lib/random`), experience state machine, Visual v4 layout shell, 163 provisional place candidates across 8 zones, Supabase REST backend, Guestbook + rewarded reroll, referral share snapshots (`/api/share`, `/r/[shareCode]`), in-app Route Guide, `SlotVisualFrame` responsive architecture baseline.

### Data status
- **Place Candidates**: 163 runtime candidates in `src/data/places.ts` (provisional / REVIEW-stage dataset; final tourism verification pending).
- **Zones**: 8 defined in `src/data/zones.ts` — 7 active (`soje`, `daeheung`, `seonhwa`, `eoeun-gung`, `galma`, `mannyeon`, `doryong`), 1 inactive (`banseok`, lacking anchor/discovery candidates).
- **Today's Pick legacy data**: `src/data/picks.ts` retained (`TODAYS_PICKS = []`), referenced by no UI — only its `getSeoulDateString` helper is reused by the current Editorial Rail.

### Backend / database / share infrastructure
- **Supabase**: server-only REST client (`src/lib/database/client.ts`), `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`). UI never accesses the database directly. Application connectivity is confirmed working against the real remote project (verified via live `guestbook_entries`/`site_visits` reads and writes below) — the CLI itself is not linked from this worktree (no `supabase/config.toml`), so project ref/link-state questions are separate from the (confirmed-working) application connection.
- **Guestbook / Random Log persistence**: `/api/guestbook` (`POST`/`GET`) sanitizes text, validates avatar/nickname (2–12 chars)/message (≤50 chars), attaches route metadata, writes to `guestbook_entries`. `GET` supports `before` cursor pagination. Entries now additionally snapshot the generated route's actual place names (`route_place_names TEXT[] NULL`, `20260904000002_add_route_place_names_to_guestbook_entries.sql`) — nullable/additive, no backfill; see **DATA_MODEL.md** §3.1 and ADR-038.
- **Site visits**: `/api/visits` (`POST`, fire-and-forget from `VisitBeacon`) inserts one row per browser tab-session into `site_visits`; `TOTAL VISIT`/`TODAY` (KST) are read server-side by `VisitCounterRow` directly from `src/lib/database/visits.ts` (no internal API round-trip). Migrations `20260904000000_create_site_visits.sql` + `...0001_configure_site_visits_grants.sql` are applied and this is Human-Browser-confirmed showing real incrementing counts.
- **Shared routes**: `src/lib/database/share.ts` (cryptographic `generateShareCode`, immutable snapshot persistence); DDL in `supabase/migrations/20260829000000_create_shared_routes.sql` + `...0001_configure_shared_routes_grants.sql`.
- **Shared route social preview**: `src/lib/share/shareHelper.ts` resolves site origin (`NEXT_PUBLIC_SITE_URL` → Vercel env fallbacks); `/r/[shareCode]` serves dynamic OpenGraph/Twitter metadata, `robots: noindex`.
- **Character registry**: `GUESTBOOK_AVATARS` (`src/config/avatars.ts`) — 10 stable Kkumssi-family identity ids, all with production `imageSrc` artwork wired through the visual asset registry.

---

## B. Confirmed Product Contract

### Core interaction flow
0. **INTRO**: the experience's actual initial phase (`ExperiencePhase = 'intro' | 'q1' | 'q2' | 'ready' | 'spinning' | 'result'`), added in `feat/product-visual-polish` (ADR-032). A translucent soft entry gate — same paper/ticket visual language as the rest of the app, headline `대전 랜덤 여행, 시작해볼까요? ✨`, CTA `여행 시작하기` — layers over the existing Setup/Slot hero without adding page height; its own card occupies the **exact same footprint as the Q1 Setup card** at every breakpoint, so INTRO→Q1 reads as one panel's content changing, not a popup closing. See **C** below.
1. **Q1 (Duration)**: `반나절` (half) / `하루종일` (full) — local Daejeon travel time, not origin-to-Daejeon travel time. *(Korean label for `full` is `하루종일`, not `하루` — unified across `SetupArea`, `RouteGuideModal`, `SharedRouteView`, `randomLogLabels`, and the `/r/[shareCode]` OG metadata in the redesign commit.)*
2. **Q2 (Preference)**: `아무거나` (anything) / `먹방` (food) / `산책` (walk) / `사진` (photo). There is **no** user-facing night/야간 preference — the dataset label `산책·야간` may map to the user-facing `산책` option, but is not a distinct selectable value.
3. **READY**: condition summary; primary CTA `"🎰 여행 뽑기!"`.
4. **SPINNING**: sequential reel stop showing activity characters (not place names), reduced-motion runs the same sequence at lower intensity (ADR-026).
5. **RESULT**: `ResultQuest` renders inside `ResultArea` (centered, in-flow `fixed` overlay, not a Portal — see **C**). 결과 접기 (minimize) hides without discarding `state.result`; reopened via `SlotAnchor`'s persistent affordance.
6. **ROUTE_GUIDE**: `RouteGuideModal` (Portal to `document.body`) — ordered stop timeline, stay/visit-order copy (no clock schedule), external Naver/Kakao map links.
7. **REFERRAL SHARE**: immutable snapshot via `/api/share`, Web Share API with clipboard fallback, friend lands on `/r/[shareCode]`.

### Result Card action hierarchy
1. **Conversion (Primary)**: `"이 코스로 가보기"` → opens Route Guide.
2. **Referral (Secondary)**: `"내 루트 공유하기"` → creates/reuses a share snapshot, triggers Web Share/clipboard.
3. **Participation / Reward (Tertiary)**: **one unified CTA labeled `"다시 뽑기"`**, driven entirely by reroll reward state:
   - `locked` → opens the Random Log (Guestbook) composer in-flow.
   - `available` → executes the reroll directly.
   - `consumed` → CTA is not rendered (hidden, not disabled); the share button spans the full row instead.
   - There is **no** separate, always-visible "leave a Random Log" row in the Result body — the standalone low-emphasis Random Log row that previously existed was intentionally removed. Locked `다시 뽑기` remains the sole entry point into the Random Log composer/reward flow.

### Result Card content composition
- Stops render in a fixed four-cell grid (2×2 desktop / 1-col×4 mobile), identical layout regardless of stop count.
- **Half-day (3-stop) routes fill the 4th cell with an `ExploreMoreBanner`** (`"조금 더 놀다 갈래?"`) instead of leaving it empty or stretching STOP 3. This banner is presentation-only, carries no place data, and is never treated as a domain stop by `src/lib/random` or the `RouteResult`/`RouteStop` types. Its CTA (`"대전 더 둘러보기"`, styled as a lightweight text link — deliberately not a second filled button competing with the primary CTA) is wired (ADR-038): it minimizes Result (결과 접기 semantics — `state.result` is never touched) and scrolls to whichever TODAY'S DAEJEON rail instance is currently visible, then moves focus there. No `src/lib/random`/domain change.
- An optional **Bonus Quest** mission line (`RouteResult.mission`) may render below the stops, drawn from a fixed pool of generic playful prompts in `src/config/missions.ts` (**34 entries, ≤18 characters each** as of `feat/todays-daejeon-discovery` — replaced from an earlier 5-entry pool that included two longer strings clipping risk on narrow mobile widths), selected by the engine's injected random source. This is presentation framing over the pre-existing `mission` field, not a new recommendation axis, and carries no operational/place-detail data.

### Route recommendation contract (unchanged)
- **Engine**: `src/lib/random`, pure/testable, decoupled from UI animation, seedable random source.
- **Half-Day (`half`)**: fixed **exactly 3 stops**: `Meal → Cafe → Preference` (`half_ordered_3`).
- **Full-Day (`full`)**: primary **4 stops**: `Meal → Cafe → Discovery → Preference` (`full_ordered_4`); graceful fallback to **3 stops** (`full_fallback_3`) preserving the user's chosen Preference.
- **Preferences**: `anything` / `food` / `walk` / `photo`. Route slots: `meal`, `cafe`, `discovery`, `preference` — distinct from conceptual candidate roles (`anchor`, `meal`, `discovery`, `stay-extender`). Canonical cafe identification: `PlaceCandidate.category === "카페·디저트"`.
- **Duration**: `estimatedTotalMinutes` strictly represents place stay duration; inter-stop transit time is not yet modeled. Numeric budget bounds remain TBD. **Duration/stay-time does not structurally drive Result or Route Guide content** — Q1 half/full is trip-mode copy, never a computed duration shown on the Result Card (that lives only in the Route Guide header, and even there without per-stop transit math).

### Reroll & Random Log (unchanged mechanics, ADR-011 / ADR-025)
- Lifecycle: `locked` → `available` → `consumed`, backed by `sessionStorage`, max 1 reward reroll per browser-tab session.
- Unlocks only on verified server DB insertion into `guestbook_entries`.
- Writing eligibility (`loggedRouteIds`, per-mounted-session React state, one log per Result) is fully decoupled from reward eligibility (`rerollState.rerollReward === 'locked'`) — a later Result may still be logged after the reward is consumed, without granting a second reward.

### Editorial Rail ("TODAY'S DAEJEON", renamed from "TODAY'S PICK") — manual carousel (ADR-015 revised, ADR-028, ADR-038)
- Right Rail surface only — no detail page, no Q2 seeding, no Slot funnel, no voting.
- **5 production banners** (`kkumssi-family`, `bread-tour`, `tashu`, `expo-bridge-night`, `september-events`), each with a real `href`/`external: true` destination — the previous 6th item (`night-view`, obsolete uncaptioned artwork) is retired. Validity-window filtering is unchanged (only `september-events` is date-bound, `2026-09-01`–`2026-10-01` exclusive); **all currently-eligible items render as a manually browsable carousel** (prev/next + `n / N` indicator + touch swipe, no autoplay) instead of the old single-item daily rotation — see ADR-038 and ADR-028 (composition/shell contract otherwise unchanged).
- Carousel viewport is a fixed `aspect-[15/8]` box regardless of which item's raster is loaded (the 5 assets span ~15:8 and ~16:9 natively) — zero layout shift when browsing. Banner-click/impression analytics remain TBD (see **D**).

---

## C. Current Visual State

### INTRO — soft entry gate (new, `feat/product-visual-polish`, ADR-032)
- New initial `ExperiencePhase` (`'intro'`), before `q1`. `IntroGate.tsx` renders a translucent warm veil + a small ticket-style card as an `absolute inset-0` overlay on top of the existing `SetupArea`+`Slot` box inside `MainExperience` — 0px added to document layout, and the underlying `SetupArea`/`SlotAnchor` subtree is `inert` while it's up (not just visually covered).
- **Footprint contract**: the ticket card is `w-full h-full` inside a band pinned to exactly `h-[var(--hero-setup-h)]`, with **no `sm:` override at any breakpoint** — its rect is byte-identical to `SetupArea`'s own rect at every viewport, mobile through desktop. INTRO and Q1 are two states of the same card region, not two different UI elements. (An earlier pass gave desktop its own wider, independently-positioned panel; Human Browser rejected that relationship and it was removed, not tuned — see ADR-032.)
- Copy (final, not placeholder): eyebrow `★ ENTRY TICKET ★`, headline `대전 랜덤 여행, 시작해볼까요? ✨`, supporting line `버튼 하나로 오늘의 코스를 뽑아드려요!`, CTA `여행 시작하기`.
- Exit: ~200ms opacity+scale transition (`prefers-reduced-motion` collapses it to instant), then `START_INTRO` dispatches and Q1 renders at the exact same coordinates — verified live, zero layout jump.

### Result & Route Guide skin architecture
Result and Route Guide now use **two different, deliberately divergent** rendering strategies — this divergence is intentional, not an inconsistency to reconcile.

- **Result — ONE renderer, per-state raster (unchanged since `6560a5b`)**: `ResultQuest` (`src/components/experience/result/`) replaces the deleted `ResultSheet.tsx` (485 lines removed). `resolveResultSkin(rerollReward)` in `resultSkin.ts` selects between exactly two complete states — `normal` and `consumed` — each a full header/body/actions raster set at both mobile and desktop breakpoints. Verified by an asset-level test that stacking each state's three bands reproduces its Figma master pixel-for-pixel (0 byte mismatches). `QuestHeader`, `ResultBodySkinCanvas`, and `ResultActions` all use the same `.skin-canvas` mechanism (`background-size: 100% auto` in an aspect-locked container, rendering at exactly 1.0×, never stretched). Result's raster contract is **frozen** by this branch — not touched, not re-litigated.
- **Route Guide — rebuilt to 100% DOM/CSS, zero raster (new, `feat/product-visual-polish`, ADR-033, supersedes the `6560a5b` raster direction for this surface)**: `RouteGuideModal`/`RouteGuideTimeline` ship no raster assets at all any more. All 6 header/body/footer skin bands and the mission-shell crop are deleted from `public/assets/` and unregistered from `visualAssets.ts`. The shell now uses the same paper-card language as the Random Log family (cream sheet, `border-2 border-line-soft`), with the Result-measured per-stop accent palette (`src/config/resultAccents.ts`) as the route's color identity — the stop-number node is a solid accent-fill dot (fill **and** border both the stop's own accent, ink-colored number) on one continuous, zero-gap rail. `guideSkin.ts` now holds only the shared cream-paper token and a re-export of `resolveResultAccent`, nothing raster.
- **Breakpoint contract fixed to 1024px** (Result only, unchanged from `6560a5b`): the Result skin swap keys off `1024px` (`lg`), matching `page.tsx`'s `hidden lg:flex` / `lg:hidden` dual mount of `MainExperience`. Previously it keyed off `640px` (`sm`), which meant viewports between 640–1023px (rendering the mobile mount) were served *desktop* skin bands — and in the consumed state, where no desktop raster existed at the time, the action band silently disappeared. This is the **desktop-consumed action-band registration bug**, fixed by the breakpoint alignment plus the arrival of an approved desktop-consumed raster (`Result/Skin/DesktopBlank-RerollConsumed2Action`, node `329:2`); the old CSS reconstruction fallback for that state has been deleted rather than kept as a second code path.
- **Full-day duration label unified to `하루종일`** app-wide (see **B**).
- **`hasLoggedCurrentResult` is a dead prop**: `ResultArea` still accepts and `MainExperience` still computes/passes it (ADR-025 per-Result tracking logic is unchanged), but nothing renders it any more — it was the standalone Random Log row, now removed.

### Shared Route (`/r/[shareCode]`) — visual system + mystery link-preview metadata (new, ADR-035)
- **Page content** (`SharedRouteView.tsx`): unchanged in this branch except for terminology (Memory Log, if it ever appears there) — same ticket-style card, per-stop accent-bordered cards reusing `resultAccents.ts`, coral primary CTA, neutral secondary CTA. Real zone, real place names, itinerary, and mission all render normally once the link is opened.
- **Pre-click metadata is now deliberately a "mystery" preview**, distinct from the page content above: `<title>`/`openGraph.title`/`twitter.title` for a valid record render `` `??동 · ${durationLabel} | 대전 랜덤 여행` `` (`??동` is a **literal fixed string**, never a real zone), and the description is the fixed line `어디로 갈지는 링크를 열어 확인해보세요 👀` for every valid record (no more dynamic stop-count/place-name summary). Invalid-code and not-found branches keep their own separate, non-mystery titles. Canonical URL, `siteName`, `locale`, and the `robots: noindex, follow: false` contract (ADR-014) are all unchanged.
- Verified live against two real, freshly-generated share codes (one half-day, one full-day) — confirmed the metadata never leaks the real zone/place names while the opened page still shows them.

### Native share payload (final, `src/content/share.ts`)
- `buildShareTitle()` → `우리 대전여행 갈래?` (route-independent, fixed).
- `buildShareText()` → `우리 대전여행 갈래?\n코스는 이미 뽑아놨어 🎲\n네 취향 코스도 궁금해\n👉 바로 뽑고 공유하기` — the title line is deliberately repeated as the text body's own first line, because some share targets ignore `navigator.share`'s `title` field and render only `text`. All 4 lines are consecutive, no blank line (`feat/todays-daejeon-discovery` fixed an unintended blank line that previously separated the CTA line from the rest).
- This is a fully separate system from the shared-route OG/Twitter metadata above — they intentionally do not share copy or code paths, only the URL construction (`getShareUrl`).

### OG / social metadata (new — previously did not exist at all)
- A verified static brand asset, `public/og-daejeon-random-trip.png` — decoded and pixel-checked: exactly **1200×630**, fully opaque (0 of 756,000 pixels below full alpha), ~221KB. **Not** a `visualAssets.ts` entry (that registry is scoped to in-app game-art; this is a crawler/metadata asset, referenced by a plain absolute path) and never dynamically generated.
- Wired into root `layout.tsx`'s default `openGraph`/`twitter` blocks (previously absent entirely — every route served a text-only preview before this branch) and into all three `/r/[shareCode]` `generateMetadata` branches (invalid code / not found / valid record), each with `twitter.card: 'summary_large_image'` (previously `'summary'`, and previously absent on root entirely).
- Root title/description are final: `대전 랜덤 여행 | DAEJEON RANDOM TRIP` / `시간과 취향만 고르면 시작되는 대전 랜덤 여행`.
- **Production verification still required** (see **E**): only tested via local dev server + real generated share codes in this branch. Kakao/message-app crawler and cache behavior has not been checked against a real deployed origin.

### Mobile quick-jump arrow (redesigned, `src/app/page.tsx`)
- Was a pixel-art coral down-arrow inside a 30×30 bordered plate (rejected — read as "a pixel icon / game UI button", not a quiet utility control). Now a plain neutral circular utility button (white/`#e5e5e5`-bordered circle, simple stroke-based down-chevron SVG, ink on focus-visible only) — deliberately breaks from the retro/pixel palette for this one control, matching a familiar "scroll down" affordance instead. Same 44×44 hit target, same `href="#mobile-right-rail"`, same `lg:hidden` visibility contract, same position (`absolute right-0 top-1/2 -translate-y-1/2`) — none of that changed, only the visible treatment.

### TODAY'S DAEJEON carousel (new, `feat/todays-daejeon-discovery`, ADR-038)
- Renamed from "TODAY'S PICK". `EditorialSpotlightCard` (`src/components/editorial/`) is now a manual carousel (`'use client'`, local `activeIndex` state) over `getActiveEditorialItems()` (`src/data/editorial.ts`) — no autoplay, no library. Prev/next are bare chevron glyphs (no circular background/border — a Human Browser correction from an earlier filled-circle treatment) positioned at the banner's outer edges, plus a `n / N` pill indicator; a `sr-only` `aria-live="polite"` region announces position changes for screen readers. Touch swipe (delta-X threshold, no library) is supported alongside the buttons.
- **Fixed media viewport**: the banner renders inside a `relative aspect-[15/8] w-full overflow-hidden` box — `object-cover` + per-item `object-position` (`EditorialItem.bannerObjectPosition`, defaults to `'center'`) fill it regardless of the source raster's own aspect. This exists because the 5 approved production banners are not all one ratio (`tashu`/`kkumssi-family`/`expo-bridge-night` ≈15:8; `bread-tour`/`september-events` ≈16:9) — sizing the box by the loaded image's own intrinsic dimensions (the first-pass implementation) made the card visibly grow/shrink as the carousel advanced, shifting MEMORY LOG and everything below it. Fixed-viewport height is now measurement-verified byte-identical across all 5 items at 1440/390/360px.
- **Real destinations**: all 5 items now carry `href` + `external: true`, opened in a new tab (`target="_blank" rel="noopener noreferrer"`). The obsolete uncaptioned `night-view` banner is retired (its approved, already-captioned replacement `expo-bridge-night` covers the same "night view" concept). An item without `href` still renders as a non-interactive `<div>` (not an inert `<a>`) — the shell's original href-optional contract is preserved.
- The two page-level rail wrappers (desktop column, `#mobile-right-rail`) carry a shared `data-today-daejeon-rail` marker (`ExperienceProvider.tsx`'s `TODAYS_DAEJEON_RAIL_ATTR`) so ExploreMore's CTA (below) can resolve "whichever one is visible" via `offsetParent` rather than re-encoding the `lg:` breakpoint.
- Banner-click/impression analytics remain TBD (unchanged from before this branch — see **D**).

### ExploreMore → TODAY'S DAEJEON (wired, `feat/todays-daejeon-discovery`, ADR-038)
- `ExploreMoreBanner`'s CTA (`"대전 더 둘러보기"`) is a plain inline text link (underline, muted ink colour) — not a second filled button, so it stays visually subordinate to the Result's real primary action (`"이 코스로 가보기"`); a first-pass filled-coral-button treatment was rejected in Human Browser review for competing with that primary action and crowding the cell on mobile.
- Click: `ExperienceProvider.handleExploreMore` minimizes Result (`결과 접기` semantics — `state.result` is never touched, matching ADR-023) via `requestAnimationFrame`, resolves the currently-visible `[data-today-daejeon-rail]` element, calls `scrollIntoView` (`smooth`, or `auto` under `prefers-reduced-motion`), then moves focus onto that rail wrapper (`tabIndex={-1}` + `outline-none`, mirroring `ResultArea`'s own dialog-container focus pattern — no visible focus ring, but real screen-reader landing).
- No `src/lib/random`/domain change; the cell's fixed-grid/no-fake-STOP-4 contract (MainQuest.tsx) is unaffected.

### Footer (updated, `src/components/layout/Footer.tsx`)
- Brand line: `DAEJEON RANDOM TRIP` (the earlier `... MVP · LOCAL TRAVEL EXPERIMENT` internal-sounding suffix was removed).
- Description: `시간과 취향만 고르면 시작되는 대전 랜덤 여행` (same final copy as the root site description).
- Credit/contact line: `Made by TEAM ALJJA · 문의 onethingtoall@gmail.com`, the email a real `mailto:` link — text colour corrected to the primary ink (`#2b2520`, from a low-contrast `#aaa092`) in `feat/todays-daejeon-discovery`; wording/layout/spacing unchanged.
- Copyright line unchanged. `Footer` is still intentionally excluded from the main landing hero (ADR-021) — it renders on `/random-log`, `/random-log/[id]`, and `/r/[shareCode]`.

### Memory Log terminology & content (ADR-034, extended by ADR-038)
- All user-visible "랜덤 로그" / "VISITOR LOG" / "RANDOM LOG" copy is now "메모리 로그" / "MEMORY LOG" — sidebar heading/empty-state, `/random-log` board and `/random-log/[id]` detail pages (headings, metadata, error/empty states), Guestbook composer eyebrow/title/success copy. **Technical naming is untouched**: `RandomLog*` components, the `/random-log` route, `guestbook_entries`/`guestbook.ts` DB/API identifiers. Two DB-layer error strings still say "랜덤 로그" but are never rendered to a user (verified) — left as dead text, not a visible inconsistency.
- **Route identity snapshot** (new, `feat/todays-daejeon-discovery`): each Memory Log card/detail view now also shows the actual generated route's place names (`entry.route_place_names`, joined `' · '`) when present, so two entries sharing the same duration/preference/zone still visibly differ. `/random-log/[id]`'s label for this line reads `"뽑은 코스"` ("the drawn course") — deliberately not `"다녀온 곳"` ("places visited"), since the log is created immediately after the route is drawn, before any travel happens. See **DATA_MODEL.md** §3.1 for the schema and ADR-038 for the decision.

### Asset registry
- `src/config/visualAssets.ts`: **55 registered paths**, all resolving; `public/assets/` holds **56 files** (`slot-shell.png` deliberately outside the registry, unchanged from prior state). Down from 56/57 after the Phase 8 closeout audit removed the dead `setup.intro.start` entry + its file (zero runtime consumers — the shipped INTRO gate is DOM/CSS, not this PNG) and the 6+1 retired Route Guide raster entries were already gone before this closeout (retired earlier in this same branch, see ADR-033). Unchanged by `feat/todays-daejeon-discovery` — the TODAY'S DAEJEON carousel reuses 5 of the 6 already-registered editorial banner assets; no export/registry change was needed.
- DOS Gothic is the production Korean/UI typeface (ADR-030), registered as a single 400-weight face (`--font-ui`) with `preload: false`; Geist Sans remains the `--font-sans` fallback because DOS Gothic lacks several glyphs the UI renders (see **F**).
- `OUTPUT_PEEK_ENABLED` is now **live** (`feat/slot-peek`, ADR-036) — the output cue is no longer a placeholder rectangle: no new raster asset was added or is pending; the registry stays at **55 registered paths** / `public/assets/` at **56 files**, unchanged by this branch.

### Slot Peek (implemented, `feat/slot-peek`, ADR-036)
- **SPIN → Peek → Result** is fully implemented and enabled. Peek renders a shallow paper strip physically emerging from the slot's measured output cavity, occluded in front by a re-instanced, clipped copy of the exact chassis raster `SlotAnchor` already renders (`SlotOutputLayer.tsx`) — zero new visual assets, zero Slot movement, no modal, no multi-frame raster animation.
- **Cross-breakpoint continuity**: a new `ExperienceProvider` (mounted once in `page.tsx`) now owns the entire experience engine (reducer/state, `revealStage`, spin lifecycle, `spinningStoppedReelCount`, `pendingResult`, reroll/reset lifecycle, Peek completion + run-token) as a single shared instance consumed by both the desktop and mobile `MainExperience` (Hero) presentations — which still dual-mount exactly as before (`hidden lg:flex` / `lg:hidden`, unchanged geometry). This replaced two independent per-Hero engines that could desync across a resize; see ADR-036 for the full root-cause/fix writeup.
- **Single overlay ownership**: a new `ExperienceOverlays` (mounted once, outside both dual-mount trees) is now the sole render site for the reveal-emphasis backdrop, `ResultArea`, `GuestbookComposer`, and `RouteGuideModal` — previously duplicated per Hero. `ResultArea`'s own in-flow-`fixed` implementation (ADR-008) is unchanged.
- **Visibility contract**: the Peek layer exists only while `revealStage === 'peek'`; it unmounts completely the instant `revealStage` becomes `'revealed'`, contributing zero visible pixels thereafter. The approved Result-revealed and minimized (결과 접기) visuals (ADR-008/ADR-023) are unchanged and carry no new Peek-related cue.
- **Completion robustness**: the Fixed 300–500ms peek→card product beat (`OUTPUT_PEEK_TO_CARD_MS = 400`, unchanged) is driven by a plain `setTimeout` in `ExperienceProvider`, hardened with a `Date.now()`-based wall-clock deadline reconciled by a single scoped `visibilitychange` listener — so a tab backgrounded/suspended during Peek and later foregrounded past its deadline completes immediately rather than waiting on a possibly browser-throttled timer. Guarded by a run-token + idempotent functional state update against any duplicate transition.
- **Result asset preparation**: a new `ResultSkinPreload` (active only during READY/SPINNING) issues breakpoint-gated `<link rel="preload">` hints for the three Result skin raster bands, so an uncached first run doesn't decode them inside the reveal frame.
- **Human Browser E2E accepted** by the user for this implementation.
- See ADR-036 in `docs/DECISIONS.md` for the complete architecture, rejected intermediate approaches, and measured geometry.

### SlotVisualFrame architecture (unchanged since prior snapshot)
```
SlotStage
  ├── SlotVisualFrame        (physical visible machine footprint; participates in page layout)
  │     └── 600×500 LogicalCanvas   (absolute; does NOT determine surrounding layout spacing)
  │           ├── DOM reels
  │           ├── production PNG (slot-idle.png / slot-pulled.png)
  │           └── DOM CTA
  └── SlotOutputLayer   (sibling of SlotVisualFrame; mount live, visual cue disabled)
```
- Verified production union bounds: logical 600×500 canvas machine footprint `x=168, y=149, w≈280.333, h≈204.667` (~46.72% of canvas width).
- `SlotVisualFrame` uses `overflow: hidden`; `SlotOutputLayer` is a sibling (not a descendant of `LogicalCanvas`), so it is never subject to that clip.
- State position lock: `Q1`/`Q2`/`READY`/`SPINNING` share pixel-identical Setup/Slot/Helper geometry across viewports.
- In-flow `fixed` overlay stacking contract: because `MainExperience` dual-mounts (desktop/mobile, `hidden lg:flex` / `lg:hidden`), Result Card and Guestbook Composer render as in-flow `fixed` elements, never a Portal (a Portal would escape the responsive gate). `RouteGuideModal` is the one exception — it *is* a Portal, but is not gated by the dual mount the same way and needs to escape ancestor transform/containing-block traps.
- Responsive Slot width baseline: ~360px @400px mobile, ~518px @1200px, ~614px @1440px, ~700px @1920px.
- **Mobile short-height viewport contract** (ADR-031, Human Browser validated on a real iPhone XS-class Safari device): full Slot chassis is the first-view target for supported portrait mobile viewports (~≥600svh); below that floor the page degrades to natural document scrolling rather than shrinking the Slot further. Hero height budgeting is driven entirely by `svh` tokens — never `dvh` — with no device-name/UA-specific rules. Mobile `SetupArea` stays a fixed 200px card (`sm:` 186px, unchanged); Q2's mobile option grid is two 44px rows in a 96px box with an 8px gap (Q1's grid, a single 88px row, is untouched). The Q1/Q2/READY/SPINNING position lock above is preserved throughout; the completed Result/Route Guide/Guestbook overlay hotfix is unaffected.

---

## D. Analytics State

See `docs/ANALYTICS.md` §9 for the authoritative, detailed status. Summary:
- **Merged**: GA4 Phase 1 base integration — `@next/third-parties` `GoogleAnalytics` in root layout, gated on `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Vercel Production env var). No GTM. No manual/duplicate `gtag`/`page_view` implementation.
- **Manually verified in Production**: tag loads, GA4 Realtime shows active users, `google-analytics.com/g/collect` fires `page_view`, UTM landing params (`utm_source=chatgpt_test&utm_medium=test&utm_campaign=ga4_setup&utm_content=link_a`) land in the collect payload's `dl`. Team has GA4 property access.
- **Not yet true**: campaign/UTM naming convention unfinalized; standard Traffic Acquisition report may still be awaiting processed data; **zero** custom events from the Event Catalog are instrumented (`src/lib/analytics/` does not exist); Campaign & Funnel Analysis Dashboard not built; TODAY'S DAEJEON banner-click/impression tracking still TBD (real `href`s now exist as of `feat/todays-daejeon-discovery`, but no click/impression event was added). Neither `feat/product-visual-polish` nor `feat/todays-daejeon-discovery` added any analytics instrumentation — this state is unchanged from before both branches and is explicitly out of scope for the latter (discovery/retention + UX cleanup only).
- **Conceptual funnel now has an updated first step, spec-only, not implemented**: with INTRO added ahead of Q1 (see **B**/**C**), the eventual Core Conversion funnel's first steps would conceptually be `landing_view → trip_start_click → preference_time_select (Q1) → preference_style_select (Q2) → ...`, replacing the older `quick_setup_start` framing in `docs/ANALYTICS.md` §2/§3.1 with an explicit INTRO step. **No event names have been finalized or instrumented for this** — `docs/ANALYTICS.md`'s Event Catalog is unchanged pending an explicit decision on final event naming; this is noted here only so a future analytics pass accounts for the new phase rather than skipping straight from `page_view` to `setup_complete`.
- **Privacy contract (unchanged, must be preserved when instrumentation lands)**: never transmit Memory Log nicknames, Memory Log free text, `share_code`, IP, email, phone, or other PII. `place_map_click` is the primary proxy conversion and must never be represented as proof of a physical visit.

---

## E. Deferred / Not Implemented

Items below are deliberately out of scope for the branches that produced them — not unfinished work on those branches. These are next-branch candidates.

- **Left Sidebar visit counters** — ~~static presentational strings~~ **done**: `TOTAL VISIT`/`TODAY` are real, server-read `site_visits` counts (see **A**), Human-Browser-confirmed. The BGM widget remains presentation-only (no `<audio>`, no playback state — see the BGM bullet below); real audio integration is still deferred to a future branch.
- **Custom GA4 event instrumentation & Campaign/Funnel Dashboard** — spec exists in full (`docs/ANALYTICS.md` §3, §8); zero code exists yet. See **D** for the conceptual (spec-only) funnel update this branch's INTRO phase implies.
- ~~Output-slit ticket peek visual asset (Slot Peek)~~ — **implemented and enabled**, `feat/slot-peek`, ADR-036 (no longer deferred; see **A**/**C**).
- **Performance profiling** — no formal profiling has been done on the SPIN → Result sequence or on the now-shipped SPIN → Peek → Result sequence. Deferred.
- **GA4 / GTM custom instrumentation** — see above; no GTM container exists either (GA4 loads directly via `@next/third-parties`, not a container — see **D**).
- **Place Data Refresh + Content Resilience** ? **COMPLETE**. The obsolete 163-place provisional dataset was discarded. The normalized 258-place dataset is now the production place-data Source of Truth, containing 256 active and 2 inactive (REVIEW) records across 16 canonical route zones. Food, walk, and photo preferences are now deterministically generated. Long Korean place-name resilience (wrapping without clipping) was fixed in the Result StopCard, and Route Guide output verified. The recommendation engine required no changes.
- **Production-environment OG preview verification** — the OG image + shared-route mystery metadata (ADR-035) were verified against a local dev server and real generated share codes only. Kakao/message-app crawler and cache behavior (image fetch, cache TTL, re-crawl on update) must be checked after a real deployment; local/ngrok preview behavior must not be treated as final production acceptance.
- ~~ExploreMore banner destination~~ — **done** (ADR-038): wired to scroll into TODAY'S DAEJEON after minimizing Result.
- **Editorial Rail (TODAY'S DAEJEON) banner-click/impression tracking** — ~~hrefs unseeded~~ **hrefs done** (ADR-038, all 5 items); impression/click analytics remain TBD (`docs/ANALYTICS.md` §3.4) — left for the analytics lane.
- **Transit modeling** — inter-stop travel times/modes not modeled; `estimatedTotalMinutes` is stay-duration-only.
- **BGM real playback** — the BGM widget's control artwork and hit regions are visual/interaction-ready (`feat/visual-detail-pass`), but there is no `<audio>` element, no playback state, and no handlers; explicitly deferred to a dedicated `feat/bgm-playback` branch. The equalizer bars are static (never animated), so nothing currently misrepresents playback beyond the visual "PLAYING" label itself (recorded as polish in **F**).
- **Random Log (Memory Log) community features** — comments, likes/ranking, profiles, edit/delete are intentionally not built (ADR-025); no speculative schema exists for them. (Naming: user-facing copy is Memory Log per ADR-034; the underlying ADR-025 architecture this bullet describes is unrenamed.)
- **`/pick/[slug]` detail page, Q2 preference-seeding CTA, Today's Pick → Slot funnel** — explicitly out of scope (ADR-015, revised).

---

## F. Known Non-Blocking Polish

- **Result action hitboxes below 44px on some breakpoints**: `ResultActions.tsx`'s DOM buttons are sized to the painted well beneath them (zero-stretch raster constraint), which at small card widths falls below a 44px touch target. This is an accepted, explicitly flagged consequence of the "no stretch, ever" raster contract — not silently regressed, but not fixed either; any fix requires new raster geometry, not CSS.
- **DOS Gothic glyph gaps**: the face lacks `·` (U+00B7), `"` `"`, `…`, `▾`, `'`, `–`, `—`, `×`, `−` — all of which the UI renders in specific places (SPINNING condition summary, READY quotes, truncation ellipses, 결과 접기 chevron). These fall back to Geist Sans, which is why Geist Sans remains in the `--font-sans` stack rather than being removed.
- **DOS Gothic is a ~8.25MB TTF with `preload: false`**; WOFF2 conversion is a recorded non-blocking production follow-up.
- **Desktop-consumed source Figma nodes carry an opaque white exterior**: the native source nodes (`314:55` mobile consumed, `326:56` desktop consumed) were measured to still have an opaque white background, which would reintroduce a white box around the card if sliced directly. The manually-cleaned production aliases (`290:4`, `329:2`) are used instead — flagged for design to fix upstream.
- **CTA hit-area on the Slot chassis**: painted button reads ~37–38% of the machine per production PNG/Figma; interactive hitbox is intentionally still ~32% — unchanged since the `SlotVisualFrame` baseline pass to avoid an unrelated interaction regression.
- **BGM header says "PLAYING" with static (non-animated) equalizer bars** and no real `<audio>` — recorded, not changed; see **E**.

---

## G. Next Priorities

1. **Merge/integrate `feat/todays-daejeon-discovery`** — complete, Human Browser E2E approved, uncommitted. Committing/pushing/PR/merge all require explicit user instruction per **H**; not performed as part of this closeout.
2. **Analytics**: implement `src/lib/analytics/` custom event dispatchers against `docs/ANALYTICS.md` §3's Event Catalog (parameter whitelist §4), verify each in GA4 DebugView (§7), then build the Campaign & Funnel Analysis Dashboard (§8). Account for the INTRO phase (see **D**) and decide TODAY'S DAEJEON banner-click/impression tracking (§3.4) now that real hrefs exist. **Explicitly not started by this branch.**
3. **Production OG/share verification** — after real deployment, check Kakao/message-app crawler and cache behavior for the shared-route mystery preview + static OG image (ADR-035); local/ngrok verification is not a substitute.
4. **Real BGM playback** (`<audio>`, state, handlers) on a dedicated `feat/bgm-playback` branch — currently presentation-only by design (see **E**).
5. **Result action tap-target remediation** (painted wells <44px) — needs design input on raster geometry, not a pure code fix.
6. **Documentation gap**: a dedicated ADR for the Result Card's own raster skin redesign from `6560a5b` (still current/unchanged, never separately recorded) and for the GA4 base integration (`6ae03c4`) remain unwritten. Governance/documentation gap, not a code defect; unrelated to and not addressed by this branch.

---

## H. Do-Not-Change / Governance Rules

### DEV Task Lifecycle
```
status → branch check → clean/latest main → feature branch → implementation → /validate-feature → Human Browser E2E (performed by user) → commit → push → PR → merge → main pull → branch cleanup
```

### Core Operating Guardrails
- **Never start implementation directly on `main`**.
- **Human Browser E2E** is performed exclusively by the user.
- **Visual and Dev lanes remain isolated during active parallel work and are integrated only at explicit checkpoints.**
- **Browser screenshots** are the final visual source of truth.
- **Figma MCP** is enabled only when exact asset/design token extraction is needed.
- **No agent may execute mutating git operations** (`git commit`, `git push`, `git merge`, branch deletion) without explicit user instruction.
- **Snapshot-Only Isolation**: Shared routes and metadata must never join back to live place datasets or expose internal database IDs.
- **Mobile hero height budgeting uses `svh`, never `dvh`, and never a device-name/UA-specific rule** (ADR-031) — `dvh` re-resolves as the mobile browser toolbar retracts, reflowing the hero mid-scroll; `svh` is static. The Slot is never shrunk further to force a fit — below the supported short-height floor (~600svh), the page degrades to natural document scrolling instead.

### Module boundaries (from `AGENTS.md`)
- `src/lib/random`: recommendation logic only — no UI, no runtime LLM, seedable/injectable randomness.
- `src/components`: UI presentation and animated visuals.
- `src/config` & `src/data`: product policy and seed data — prefer these over hard-coding business constants into components.
- `src/content`: static copy.
- `src/lib/analytics`: GA4 dispatchers/sanitizers — no PII, no free-text transmission (currently does not exist yet — see **E**, **G**).
