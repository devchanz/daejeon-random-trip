# Daejeon Random Trip — Project State

## Snapshot
- **Last Updated**: 2026-08-31 (reduced-motion Slot hotfix, ADR-026)
- **Baseline Main Commit at Checkpoint**: `053289c` (`feat: implement result ticket focus flow`) — the Result/Ticket Output System is merged to `main`. The Random Log / Right Rail Community Surface below is implemented (as uncommitted working-tree changes, pending commit) and Human Browser validated on branch `feat/random-log-right-rail`, branched from this same `main` commit.
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9, pnpm 11, Supabase (PostgreSQL REST)
- **Current Status**: Core Controlled Random recommendation engine, provisional place dataset, setup/spin experience, referral sharing (`/api/share`, `/r/[shareCode]`), in-app Route Guide, shared route OG social preview hardening, `SlotVisualFrame` responsive visual architecture baseline, the Result/Ticket Output System DEV contract (centered Result Card overlay, output slit peek-cue architecture, minimize/reopen presentation lifecycle, nested-overlay keyboard ownership), and the Random Log / Right Rail Community Surface (public read IA, Result-gated writing decoupled from the 1-time reroll reward, 10-identity `CharacterSelector`) are implemented and Human Browser validated (ADR-008, ADR-011, ADR-022, ADR-023, ADR-024, ADR-025). Visual baseline integration is complete; the temporary `integration/visual-main` lane is closed. The `plan_mvp_visual_integration@00a15fe` branch remains only as the preserved approved Visual reference checkpoint (all new visual work must branch from latest `main`). A production regression where `prefers-reduced-motion: reduce` collapsed the Slot's SPINNING phase to an ~instant Result has been fixed and Human Browser E2E validated on branch `hotfix/slot-reduced-motion` — a shared lifecycle clock now drives both motion preferences, and reduced motion runs the same reel-roll animation at ~2x lower intensity rather than a shortened or substituted one (ADR-026). GA4 Analytics & Dashboard, Today's Pick, the production ticket-peek visual asset, production Kkumssi-family character artwork, and asset finalization are pending.

---

## Product Flow & Core Interaction
1. **Q1 (Duration)**: User selects local travel time in Daejeon (`반나절` / `하루`).
2. **Q2 (Preference)**: User selects travel vibe (`아무거나` / `먹방` / `산책` / `사진`).
3. **READY**: Condition summary displayed; primary CTA activates `“🎰 여행 뽑기!”`.
4. **SPINNING**: Slot reels spin with neutral arcade symbols; sequential stop (`Reel 1` 1100ms → `Reel 2` 1600ms → `Reel 3` 2100ms → final beat 400ms).
5. **RESULT**: Spin completes; a brief output slit peek cue (`SlotOutputLayer`, mounted as a sibling of `SlotVisualFrame`) is followed 300–500ms later by the front-facing, centered **Result Card** (`ResultArea`, an in-flow `fixed` overlay — not a Portal, to respect `MainExperience`'s dual desktop/mobile mount) displaying route stops, stay times, mission note, and the CTA hierarchy: Route Guide (primary), Share (secondary), a Random Log CTA (secondary — always present once a Result exists), and a reroll CTA (tertiary — visible only while the reward is `available`; hidden, not disabled, once `locked` or `consumed`). Random Log write eligibility and reroll reward eligibility are independent (ADR-025). Background interaction is blocked and body scroll is locked while revealed. **결과 접기** (minimize) hides the card (`display:none`, not unmounted — `ResultSheet`'s local share state survives) and fully restores landing interactivity without discarding `state.result`; a persistent **내 여행 티켓 다시 보기** affordance in `SlotAnchor`'s helper band reopens the same Result. Opening `RouteGuideModal` or `GuestbookComposer` from the Result Card suspends Result's own Escape/Tab keyboard ownership until that nested overlay closes. *(Note: the peek cue's visual is currently disabled — `OUTPUT_PEEK_ENABLED = false` in `SlotOutputLayer.tsx` — pending the dedicated Figma output-slit ticket asset; the mount/timing architecture is implemented and dormant.)*
6. **ROUTE_GUIDE**: Clicking `“이 코스로 가보기”` on Result Card or `“이 코스 그대로 가보기”` on `/r/[shareCode]` opens `RouteGuideModal` (rendered via React Portal to `document.body` to avoid containing-block clipping) displaying detailed stop cards, stay durations, curated tips, and external Naver/Kakao map launch buttons.
7. **REFERRAL SHARE**: Clicking `“내 루트 공유하기”` creates an immutable snapshot via `/api/share` and opens native Web Share (with clipboard fallback); friends landing on `/r/[shareCode]` see the exact shared itinerary with dynamic OpenGraph/Twitter summary previews and can open the Route Guide or spin their own trip.

---

## Visual Baseline: SlotVisualFrame Architecture
Human Browser review approved the following as the **Visual baseline for main integration**. It supersedes the prior approach where the transparent 600×500 asset canvas itself participated in page layout, compensated with hand-tuned negative margins.

**Structure**:
```
SlotStage
  ├── SlotVisualFrame        (physical visible machine footprint; participates in page layout)
  │     └── 600×500 LogicalCanvas   (absolute; does NOT determine surrounding layout spacing)
  │           ├── DOM reels
  │           ├── production PNG (slot-idle.png / slot-pulled.png)
  │           └── DOM CTA
  └── SlotOutputLayer   (sibling of SlotVisualFrame; implemented — visual cue currently disabled pending the Figma output-slit ticket asset)
```

**Verified production union bounds** (measured by direct PNG alpha-channel decoding across `slot-idle.png` / `slot-pulled.png` / `slot-shell.png`, cross-checked against Figma `00_FINAL_REFERENCE / Landing/Desktop`):
- Logical 600×500 canvas: `x=168, y=149, w≈280.333, h≈204.667`
- Source 1800×1500 asset (3× scale): `x=504, y=447, w=841, h=614`
- Corrects a prior incorrect assumption that the machine's physical footprint was ~58% of the logical canvas width — the verified figure is **~46.72%**.

**Scroll / overflow contract**: `SlotVisualFrame` uses `overflow: hidden`. Root cause of a pre-result empty-scroll-tail bug: the oversized absolute `LogicalCanvas` (≈2.14× the frame's width) extended `document.scrollHeight` while the frame used `overflow: visible`, reserving a large blank area below the ground scenery in every pre-result state. Fixing the frame to `overflow: hidden` does **not** block the Ticket/Result reveal, because `SlotOutputLayer` is implemented as a **sibling** of `SlotVisualFrame` (not a descendant of `LogicalCanvas`) and is therefore never subject to this clip — it also only mounts once `revealStage` leaves `'hidden'`, so pre-result states are structurally unaffected regardless. Pre-result states (`Q1`/`Q2`/`READY`/`SPINNING`) must not reserve large blank Result space; Result content should add vertical space only when the `RESULT` state actually renders it.

**State position lock**: `Q1`, `Q2`, `READY`, and `SPINNING` share pixel-identical geometry for Setup, `SlotVisualFrame`, and Helper (verified by direct DOM measurement at 1920 / 1440 / 1200 / 1024 / 400px). State transitions must never move the pre-result Hero. The Result Card's minimized reopen affordance (`SlotAnchor`'s helper band) also respects this: it renders inside the band's existing fixed height, adding zero layout height.

**In-flow fixed overlay stacking contract**: `MainExperience`'s desktop/mobile dual-mount (`page.tsx`, gated by `hidden lg:flex` / `lg:hidden`) means overlays inside it (Result Card, Guestbook Composer) must render as in-flow `fixed` elements, never a Portal to `document.body` — a Portal would escape the responsive gate and could render the hidden breakpoint's overlay on top of the visible layout. This requires the three-column Visual Stage layout to keep its column wrappers at `z-auto` (no per-column `z-index`) so those in-flow fixed overlays aren't trapped inside `<main>`'s own stacking context — see ADR-024.

**Responsive Slot baseline** (Human-approved current values — **not** permanent final design values):
| Viewport | Physical Slot width |
|---|---|
| 400px mobile | ~360px |
| 1200px desktop | ~518px |
| 1440px desktop | ~614px |
| 1920px wide desktop | ~700px |

**Setup baseline**: The desktop Setup card was intentionally given additional vertical breathing room (question area height, option button height, vertical padding) to balance against the enlarged Slot. Mobile Setup dimensions are unchanged.

**Ground Scenery vs. Footer**: The tower/city/foliage artwork anchored beneath the Visual Stage is **Visual Stage Ground Scenery** — decorative, absolutely positioned, and structurally distinct from the semantic `Footer` component. `Footer` is intentionally excluded from the initial landing Hero.

**Mobile Core Hero composition**: `Title → Setup → Slot → Helper`. Supporting modules (My Profile, Today's Pick, Visitor Log, etc.) follow below the core Hero in a secondary scroll section.

**Key files**: `src/components/experience/slotGeometry.ts` (new — geometry constants and formulas), `src/components/experience/SlotAnchor.tsx`, `src/components/experience/SetupArea.tsx`, `src/components/experience/MainExperience.tsx`, `src/app/page.tsx`.

---

## Route Recommendation Contract
- **Engine Logic** (`src/lib/random`): Pure, testable logic decoupled from UI animations.
- **Ordered Route Templates**:
  - **Half-Day (`half`)**: Fixed **exactly 3 stops**: `Meal → Cafe → Preference` (`half_ordered_3`).
  - **Full-Day (`full`)**: Primary **4 stops**: `Meal → Cafe → Discovery → Preference` (`full_ordered_4`); graceful fallback to **3 stops**: `Meal → Cafe → Preference` (`full_fallback_3`), omitting Discovery while preserving user's chosen Preference.
- **Preferences**: `anything` ('아무거나', wildcard matching all candidates), `food` ('먹방'), `walk` ('산책'), `photo` ('사진').
- **Stop Roles vs Route Slots**: Conceptual place taxonomy is `anchor`, `meal`, `discovery`, `stay-extender`. Route slots are `meal`, `cafe`, `discovery`, `preference`. Canonical cafe identification is based on `PlaceCandidate.category === "카페·디저트"`.
- **Duration Budget Semantics**: In current provisional data, `estimatedTotalMinutes` strictly represents place stay duration ($\sum \text{Place.durationMin}$). Door-to-door transit times are omitted pending transit modeling. Numeric budget bounds (`minMinutes`, `maxMinutes`) remain unconfigured (TBD).

---

## Data Status
- **Place Candidates**: 163 runtime candidates in `src/data/places.ts`, generated from the current provisional / REVIEW-stage place dataset. Final tourism verification is pending.
- **Zones**: 8 total defined in `src/data/zones.ts`.
  - **Active (7)**: `soje`, `daeheung`, `seonhwa`, `eoeun-gung`, `galma`, `mannyeon`, `doryong`.
  - **Inactive (1)**: `banseok` (`active: false` due to lack of anchor/discovery candidates in provisional data).
- **Today's Pick Data**: `src/data/picks.ts` initialized with empty array (`TODAYS_PICKS = []`).

---

## Backend / Database / Share Infrastructure
- **Supabase Runtime**: Server-only REST client (`src/lib/database/client.ts`) using standard `fetch` with `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`). UI never accesses database directly.
- **Guestbook / Random Log Persistence**: `/api/guestbook` (`POST` & `GET`) sanitizes text, validates avatar/nickname (2–12 chars)/message (1–50 chars), attaches route metadata, and writes to `guestbook_entries`. `GET` additionally accepts a `before` cursor (ISO `created_at`) for board pagination, and `getGuestbookEntryByPublicId` (`src/lib/database/guestbook.ts`) is the sole lookup path for a single entry by its public identifier.
- **Random Log Public Read Surfaces**: A Right Rail live preview (`RandomLogRightRailPreview`, top 3 entries, React `cache()`-deduped across the desktop/mobile dual-render), the full board (`/random-log`, cursor-paginated "Load more"), and the detail route (`/random-log/[id]`) are all public and available before any slot spin — none of the read path depends on `phase === 'result'`. `export const dynamic = 'force-dynamic'` is set on `/` and `/random-log`: verified empirically that Next.js 16.3.2 does not infer dynamic rendering from an uncached `fetch()` alone on a route with no dynamic segment, so without it these routes would statically freeze their data at build time. See ADR-025.
- **Random Log Writing / Reroll Decoupling**: Writing requires an active generated Result (no landing-page write entry point) and is capped at one submission per Result within the current mounted client session (`loggedRouteIds`, plain React state in `MainExperience` — not persisted, not a DB constraint; a client UX guardrail, not a security boundary). `GuestbookComposer` shows reward-specific copy only when the submission that just completed actually granted the reward, snapshotted at submit time rather than read live from reroll state afterward. See ADR-025.
- **1-Time Rewarded Reroll** (unchanged, ADR-011):
  - Lifecycle: `locked` → `available` → `consumed`.
  - Unlocked strictly upon verified server DB insertion from `GuestbookComposer`.
  - Max 1 reward reroll per browser-tab session, backed by browser `sessionStorage`.
  - Consumed only after successful route recommendation generation.
  - A later Random Log submission (a new Result, after the reward is consumed) never grants a second reward; the reroll CTA is hidden entirely once `consumed`, not shown disabled.
- **Shared Routes Persistence**:
  - `src/lib/database/share.ts` implements cryptographic rejection sampling (`generateShareCode`) and snapshot persistence (`createSharedRoute`, `getSharedRouteByCode`, `getSharedRouteBySourceRouteId`).
  - DDL migrations in `supabase/migrations/20260829000000_create_shared_routes.sql` and `20260829000001_configure_shared_routes_grants.sql`.
- **Shared Route Social Preview & URL Hardening**:
  - `src/lib/share/shareHelper.ts` provides `normalizeOrigin` and `getSiteOrigin()` supporting `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → `http://localhost:3000` fallback with URI scheme validation (rejecting `ftp:`, `javascript:`, etc.).
  - `src/app/layout.tsx` registers `metadataBase: new URL(getSiteOrigin())`.
  - `/r/[shareCode]` serves dynamic snapshot-only OpenGraph, Twitter (`card: 'summary'`), canonical URL, and `robots: { index: false, follow: false }` metadata.
- **Character Registry**: `GUESTBOOK_AVATARS` (`src/config/avatars.ts`) holds the 10 real Kkumssi-family character identities as stable ids (`mongmong`, `kkumdongi`, `nebeu`, `geumdori`, `kkumnuri`, `kkumdori`, `doreu`, `kkumbichi`, `eunsuni`, `kkumsuni`) — a slug of each Figma character name, independent of any layer path/filename/asset URL, stored as `avatar_id` with no DB migration. `imageSrc` is unset for all 10 pending production asset extraction; `badgeEmoji` remains the structural fallback. The `kkumdori` avatar entry is a distinct role from the static `Character/Main/Kkumdori` brand illustration in `LeftSidebar.tsx` (`/assets/kkumdori-main.png`) and must not be aliased to it.

---

## Completed Milestones
- [x] Controlled Random recommendation engine with role taxonomy and fallback handling (`src/lib/random`).
- [x] Enforced Ordered Route Templates (Half: Meal -> Cafe -> Preference; Full: Meal -> Cafe -> Discovery -> Preference with 3-stop fallback).
- [x] Experience state machine & reducer (`src/lib/experience`).
- [x] Visual v4 layout shell (`Header`, `LeftSidebar`, `RightSidebar`, `Footer`, `MainExperience`).
- [x] Physical slot machine chassis with sequential reel stops, lever animation, and reduced-motion support. Reduced-motion support: a shared lifecycle clock (`getMotionTimings()`) drives SPINNING → RESULT for both motion preferences (no shortened/instant-Result branch), and the reel roll runs at reduced CSS-only intensity (~2x slower) rather than being suppressed or replaced — fixes a production regression found post-deploy; Human Browser E2E validated (ADR-026).
- [x] 163 runtime place candidates across 8 zones (7 active).
- [x] Supabase server REST client & `/api/guestbook` route handler.
- [x] Guestbook composer modal with input sanitization & rewarded reroll lifecycle (`sessionStorage`).
- [x] Share snapshot persistence foundation & DDL migrations (`src/lib/database/share.ts`, `supabase/migrations/`).
- [x] Shared Routes / Referral: `/api/share` route handler, dedicated `/r/[shareCode]` friend landing page, and ResultSheet Web Share / clipboard fallback.
- [x] In-App Route Guide: `RouteGuideModal` (React Portal to `document.body`) & `RouteGuideTimeline` with ordered stop sequence, stay durations, visit tips, external Naver/Kakao map launch buttons, and CTA wiring on `ResultSheet` and `SharedRouteView`.
- [x] Shared Route OG / Social Preview Hardening: `generateMetadata` OpenGraph, Twitter summary card, canonical alternates, `robots: { index: false, follow: false }`, `metadataBase` in root layout, and hardened `normalizeOrigin` / `getSiteOrigin` URL origin resolver.
- [x] `SlotVisualFrame` architecture baseline: physical-footprint frame + absolute `LogicalCanvas` separation, verified production asset bounds (~46.72%), scroll/overflow fix, state-position lock, and desktop Setup/Slot balance (approved via Human Browser review and merged to `main` in commit `f2789ef`).
- [x] Result/Ticket Output System DEV contract: centered `ResultArea` Result Card overlay (in-flow `fixed`, not a Portal, respecting `MainExperience`'s dual desktop/mobile mount), `SlotOutputLayer` output-slit peek-cue architecture (sibling of `SlotVisualFrame`, visual cue currently disabled pending the Figma ticket asset), 결과 접기 minimize/reopen presentation lifecycle preserving `state.result` and `ResultSheet`'s local share state, nested-overlay (`RouteGuideModal` / `GuestbookComposer`) keyboard-ownership suspension, and the `page.tsx` column stacking-context fix enabling in-flow fixed overlays to cover the full page (ADR-008, ADR-022, ADR-023, ADR-024). Human Browser validated; merged to `main`.
- [x] Random Log / Right Rail Community Surface: public read IA (`RandomLogRightRailPreview` in the Right Rail → `/random-log` board with cursor "Load more" → `/random-log/[id]` detail), all ungated and available before any slot spin, reached via `getGuestbookEntryByPublicId` reusing the existing `guestbook_entries.id` UUID as the public identifier (no DB migration). Writing remains Result-gated (no landing-page entry point) with a once-per-Result client UX guardrail (`loggedRouteIds`, unpersisted React state), fully decoupled from the pre-existing 1-time reroll reward (ADR-011) — a later Result may still be logged after the reward is consumed, without granting another one, and `GuestbookComposer`'s success copy reflects only what that specific submission actually granted. `CharacterSelector` rebuilt around the 10 real Kkumssi-family identities (large Hero preview + fixed 5×2 picker, no carousel; production artwork still deferred). `router.refresh()` + `export const dynamic = 'force-dynamic'` on `/` and `/random-log` keep the read surfaces live. Human Browser validated on branch `feat/random-log-right-rail` (ADR-025).

---

## Deferred / Known Gaps
- **Result/Ticket Output — VISUAL polish only**: The DEV contract (centered Result Card overlay, output slit peek-cue architecture, minimize/reopen, nested-overlay keyboard ownership) is implemented and Human Browser validated (ADR-008, ADR-022, ADR-023, ADR-024). Deferred: the production Figma output-slit ticket asset (currently disabled via `OUTPUT_PEEK_ENABLED = false` in `SlotOutputLayer.tsx`), its reveal/peek animation, a mini-ticket skin for the reopen affordance, and final Result Card typography/spacing/visual hierarchy. When that VISUAL pass begins, follow `docs/PRODUCT.md` + Fixed ADRs in `docs/DECISIONS.md` rather than inferring the final treatment from the current DEV-only presentation.
- **Today's Pick System**: Seed content in `src/data/picks.ts` (currently empty) and the right sidebar editorial banner widget are not implemented. Per ADR-015 (revised), scope is a simple Right Rail banner with ~5 rotating pixel-art variants and an optional external hyperlink — no `/pick/[slug]` detail page and no Q2 preference seeding are approved.
- **Analytics Telemetry & Dashboard**: `src/lib/analytics/`, GA4 event dispatchers, and Campaign & Funnel Analysis Dashboard not implemented — includes Random Log view/list/detail/character-selection events, explicitly deferred alongside the rest of GA4.
- **Transit Modeling**: Inter-stop travel times and transit modes are not modeled.
- **Production Brand Assets**: The 10 Kkumssi-family character identities are finalized as stable `avatar_id` values (`src/config/avatars.ts`); official illustrations, pixel artwork, and audio files are not yet in `public/`.
- **Random Log Community Features**: Comments, likes/ranking, profiles, edit/delete, and social reactions are intentionally not built (ADR-025) — component boundaries are kept extensible but no speculative tables or flags exist for them.
- **Dataset Verification**: Final tourism validation for candidate places is pending.

---

## Deferred Visual Polish (Post-SlotVisualFrame Baseline)
Intentionally deferred out of the `SlotVisualFrame` baseline pass; not yet scheduled:
- Final title artwork and Title → Setup spacing polish (current title/spacing is temporary)
- Final Y2K typography pass
- Slot palette / skin recolor
- Today's Pick seated character
- Additional cloud / sparkle decorative polish
- Intro / Start CTA
- SPINNING visual redesign
- Result redesign
- Ticket reveal / peek animation
- Final Result animation
- CTA hit-area correction (painted button is visually ~37–38% of the machine per both the production PNG and Figma reference; the interactive hitbox is intentionally still ~32% — unchanged in the `SlotVisualFrame` pass to avoid an unrelated interaction regression)

---

## Next Recommended Development Order
1. **Result/Ticket Output — VISUAL asset pass**: The DEV contract landed (see Completed Milestones). Once the Figma output-slit ticket asset is ready, flip `OUTPUT_PEEK_ENABLED` to `true` in `SlotOutputLayer.tsx` and implement the final peek/reveal animation, a mini-ticket skin for the `SlotAnchor` reopen affordance, and Result Card typography/spacing/visual hierarchy polish, per `docs/PRODUCT.md` + Fixed ADRs in `docs/DECISIONS.md`.
2. **Today's Pick**: Populate `src/data/picks.ts` with ~5 production pixel-art variants and a simple rotation schedule (e.g. by weekday); wire the right sidebar banner widget to display the active pick with an optional external hyperlink. No `/pick/[slug]` detail page or Q2 preference seeding (ADR-015, revised).
3. **Analytics (GA4 Telemetry & Campaign Dashboard)**: Implement `src/lib/analytics/` tracking helpers adhering to `docs/ANALYTICS.md` strict privacy guardrails (**zero PII, no visitor nicknames/messages, no user share_code parameters**), and deliver the Campaign & Funnel Analysis Dashboard to easily analyze paid traffic, acquisition UTMs, 4-loop funnel drop-offs, and proxy conversions without inspecting raw GA4 reports.
4. **Remaining Content / Data Completion**: Complete tourism verification for place candidates; extract and integrate official Kkumdori / Kkumssi Family production artwork into the `GUESTBOOK_AVATARS` `imageSrc` slots (identities/ids are already finalized — see ADR-025).

---

## Governance & Development Rules

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
