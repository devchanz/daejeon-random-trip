# Daejeon Random Trip — Project State

## Snapshot
- **Last Updated**: 2026-08-30
- **Baseline Main Commit at Checkpoint**: `f2789ef` (`feat: establish responsive visual slot baseline`)
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9, pnpm 11, Supabase (PostgreSQL REST)
- **Current Status**: Core Controlled Random recommendation engine, provisional place dataset, setup/spin experience, guestbook rewarded reroll loop, referral sharing (`/api/share`, `/r/[shareCode]`), in-app Route Guide, shared route OG social preview hardening, and `SlotVisualFrame` responsive visual architecture baseline are implemented, verified, and merged to `main`. Visual baseline integration is complete and Human Browser validated; the temporary `integration/visual-main` lane is closed. The `plan_mvp_visual_integration@00a15fe` branch remains only as the preserved approved Visual reference checkpoint (all new visual work must branch from latest `main`). GA4 Analytics & Dashboard, Today's Pick, Result/Ticket output visual redesign, and asset finalization are pending.

---

## Product Flow & Core Interaction
1. **Q1 (Duration)**: User selects local travel time in Daejeon (`반나절` / `하루`).
2. **Q2 (Preference)**: User selects travel vibe (`아무거나` / `먹방` / `산책` / `사진`).
3. **READY**: Condition summary displayed; primary CTA activates `“🎰 여행 뽑기!”`.
4. **SPINNING**: Slot reels spin with neutral arcade symbols; sequential stop (`Reel 1` 1100ms → `Reel 2` 1600ms → `Reel 3` 2100ms → final beat 400ms).
5. **RESULT**: Spin completes; currently presents an overlapping inline `ResultSheet` ticket displaying route stops, stay times, mission note, share CTA, and reroll CTA. *(Note: Final Ticket/output reveal and Result presentation are deferred until base proportions are approved).*
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
  └── reserved SlotOutputLayer   (sibling of SlotVisualFrame; not yet implemented)
```

**Verified production union bounds** (measured by direct PNG alpha-channel decoding across `slot-idle.png` / `slot-pulled.png` / `slot-shell.png`, cross-checked against Figma `00_FINAL_REFERENCE / Landing/Desktop`):
- Logical 600×500 canvas: `x=168, y=149, w≈280.333, h≈204.667`
- Source 1800×1500 asset (3× scale): `x=504, y=447, w=841, h=614`
- Corrects a prior incorrect assumption that the machine's physical footprint was ~58% of the logical canvas width — the verified figure is **~46.72%**.

**Scroll / overflow contract**: `SlotVisualFrame` uses `overflow: hidden`. Root cause of a pre-result empty-scroll-tail bug: the oversized absolute `LogicalCanvas` (≈2.14× the frame's width) extended `document.scrollHeight` while the frame used `overflow: visible`, reserving a large blank area below the ground scenery in every pre-result state. Fixing the frame to `overflow: hidden` does **not** block the future Ticket/Result reveal, because `SlotOutputLayer` is architected as a **sibling** of `SlotVisualFrame` (not a descendant of `LogicalCanvas`) and is therefore never subject to this clip. Pre-result states (`Q1`/`Q2`/`READY`/`SPINNING`) must not reserve large blank Result space; Result content should add vertical space only when the `RESULT` state actually renders it.

**State position lock**: `Q1`, `Q2`, `READY`, and `SPINNING` share pixel-identical geometry for Setup, `SlotVisualFrame`, and Helper (verified by direct DOM measurement at 1920 / 1440 / 1200 / 1024 / 400px). State transitions must never move the pre-result Hero.

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
- **Guestbook Persistence**: `/api/guestbook` (POST & GET) sanitizes text, validates avatar/nickname (2–12 chars)/message (1–50 chars), attaches route metadata, and writes to `guestbook_entries`.
- **1-Time Rewarded Reroll**:
  - Lifecycle: `locked` → `available` → `consumed`.
  - Unlocked strictly upon verified server DB insertion from `GuestbookComposer`.
  - Max 1 reward reroll per travel session, backed by browser `sessionStorage`.
  - Consumed only after successful route recommendation generation.
- **Shared Routes Persistence**:
  - `src/lib/database/share.ts` implements cryptographic rejection sampling (`generateShareCode`) and snapshot persistence (`createSharedRoute`, `getSharedRouteByCode`, `getSharedRouteBySourceRouteId`).
  - DDL migrations in `supabase/migrations/20260829000000_create_shared_routes.sql` and `20260829000001_configure_shared_routes_grants.sql`.
- **Shared Route Social Preview & URL Hardening**:
  - `src/lib/share/shareHelper.ts` provides `normalizeOrigin` and `getSiteOrigin()` supporting `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → `http://localhost:3000` fallback with URI scheme validation (rejecting `ftp:`, `javascript:`, etc.).
  - `src/app/layout.tsx` registers `metadataBase: new URL(getSiteOrigin())`.
  - `/r/[shareCode]` serves dynamic snapshot-only OpenGraph, Twitter (`card: 'summary'`), canonical URL, and `robots: { index: false, follow: false }` metadata.
- **Asset Placeholders**: `GUESTBOOK_AVATARS` uses 4 development placeholder emojis (⭐, ✨, 🌱, 🎒). Official Kkumdori/Kkumssi assets are pending.

---

## Completed Milestones
- [x] Controlled Random recommendation engine with role taxonomy and fallback handling (`src/lib/random`).
- [x] Enforced Ordered Route Templates (Half: Meal -> Cafe -> Preference; Full: Meal -> Cafe -> Discovery -> Preference with 3-stop fallback).
- [x] Experience state machine & reducer (`src/lib/experience`).
- [x] Visual v4 layout shell (`Header`, `LeftSidebar`, `RightSidebar`, `Footer`, `MainExperience`).
- [x] Physical slot machine chassis with sequential reel stops, lever animation, and reduced-motion support.
- [x] 163 runtime place candidates across 8 zones (7 active).
- [x] Supabase server REST client & `/api/guestbook` route handler.
- [x] Guestbook composer modal with input sanitization & rewarded reroll lifecycle (`sessionStorage`).
- [x] Share snapshot persistence foundation & DDL migrations (`src/lib/database/share.ts`, `supabase/migrations/`).
- [x] Shared Routes / Referral: `/api/share` route handler, dedicated `/r/[shareCode]` friend landing page, and ResultSheet Web Share / clipboard fallback.
- [x] In-App Route Guide: `RouteGuideModal` (React Portal to `document.body`) & `RouteGuideTimeline` with ordered stop sequence, stay durations, visit tips, external Naver/Kakao map launch buttons, and CTA wiring on `ResultSheet` and `SharedRouteView`.
- [x] Shared Route OG / Social Preview Hardening: `generateMetadata` OpenGraph, Twitter summary card, canonical alternates, `robots: { index: false, follow: false }`, `metadataBase` in root layout, and hardened `normalizeOrigin` / `getSiteOrigin` URL origin resolver.
- [x] `SlotVisualFrame` architecture baseline: physical-footprint frame + absolute `LogicalCanvas` separation, verified production asset bounds (~46.72%), scroll/overflow fix, state-position lock, and desktop Setup/Slot balance (approved via Human Browser review and merged to `main` in commit `f2789ef`).

---

## Deferred / Known Gaps
- **Result Visual Redesign & Ticket Output**: Result functionality is operational. Final Ticket/output reveal and Result presentation are deferred until Q1/Q2/READY/SPIN base proportions are approved. When that visual pass begins, follow `docs/PRODUCT.md` + applicable Fixed ADRs in `docs/DECISIONS.md` rather than inferring the final treatment from the current implementation.
- **Today's Pick System**: Seed content in `src/data/picks.ts`, `/pick/[slug]` detail page, right sidebar widget, and Q2 vibe seeding not implemented.
- **Full Guestbook Archive Page & Preview**: `/guestbook` read-only community feed page and right sidebar live feed connection not implemented.
- **Analytics Telemetry & Dashboard**: `src/lib/analytics/`, GA4 event dispatchers, and Campaign & Funnel Analysis Dashboard not implemented.
- **Transit Modeling**: Inter-stop travel times and transit modes are not modeled.
- **Production Brand Assets**: Official Kkumdori / Kkumssi Family illustrations, pixel artwork, and audio files are not yet in `public/`.
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
1. **Result / Ticket Output System** *(next cross-functional feature)*:
   - **DEV ownership first**: functional DOM/state contract for the Result/Ticket lifecycle, route-data binding, `SlotOutputLayer` behavior (mounts as a sibling of `SlotVisualFrame`, per the Visual Baseline above), and CTA functionality.
   - **VISUAL ownership after the contract lands**: ticket appearance, peek/reveal animation, expanded Result sheet, STOP rows, Mission copy, CTA visual hierarchy, typography/spacing/polish.
2. **Today's Pick**: Populate `src/data/picks.ts`, build `/pick/[slug]` detail page, and update sidebar widget with Q2 preference seeding.
3. **Analytics (GA4 Telemetry & Campaign Dashboard)**: Implement `src/lib/analytics/` tracking helpers adhering to `docs/ANALYTICS.md` strict privacy guardrails (**zero PII, no visitor nicknames/messages, no user share_code parameters**), and deliver the Campaign & Funnel Analysis Dashboard to easily analyze paid traffic, acquisition UTMs, 4-loop funnel drop-offs, and proxy conversions without inspecting raw GA4 reports.
4. **Remaining Content / Data Completion**: Implement `/guestbook` read-only archive feed and sidebar live stream; complete tourism verification for place candidates; integrate official Kkumdori / Kkumssi Family assets and pixel art into frames/avatars.

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
