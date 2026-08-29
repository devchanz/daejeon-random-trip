# Daejeon Random Trip — Project State

## Snapshot
- **Last Updated**: 2026-08-30
- **Baseline Main Commit at Checkpoint**: `80b5226` (`feat: harden shared route social previews`)
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9, pnpm 11, Supabase (PostgreSQL REST)
- **Current Status**: Core Controlled Random recommendation engine, provisional place dataset, setup/spin experience, guestbook rewarded reroll loop, referral sharing (`/api/share`, `/r/[shareCode]`), in-app Route Guide, and shared route OG social preview hardening are implemented, verified, and merged to `main`. Visual tuning continues in a separate visual worktree (`plan_mvp_visual_integration`). Analytics, Today's Pick, Result visual redesign, Ticket output, and asset finalization are pending.

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

## Current Visual State Checkpoint

### Worktree & Mode
- Visual proportion tuning runs in a separate isolated worktree/branch: `plan_mvp_visual_integration`.
- **Figma MCP**: **OFF** for current browser-tuning work (enabled strictly when exact Figma asset/design extraction is required).
- **Browser Screenshot**: Represents the final visual source of truth.

### Approved Slot Machine Runtime Architecture
- PNG Assets: `public/assets/slot-idle.png`, `public/assets/slot-pulled.png`, `public/assets/slot-shell.png`.
- Unified 600×500 coordinate system with DOM reels and DOM CTA.
- State swap: Idle → Pulled (500ms) → Idle.
- Lever animation functional; reel/button internal alignment is approved.

### Restored Desktop Baseline (~1440px Viewport)
A recent global proportion pass caused unintended shrinkages and has been **SELECTIVELY ROLLED BACK**. The current safe restored baseline is:
- Overall Stage: ~1361px
- Left Column: 320px | Center Column: 673px | Right Column: 320px
- Setup Panel: 600px width
- SlotAnchor Canvas: 540px width
- Visible Physical Slot Body: ~313px width
- Visible Slot / Setup Ratio: ~52%
*(Note: This baseline is a temporary safe restore point, NOT the approved final visual).*

### Current Visual Problems to Solve
1. **Visible Physical Slot is too small**: ~52% ratio versus Setup panel makes the machine look miniature compared to the approved final reference.
2. **Setup-to-Slot Vertical Gap is too large**: Measured gap is ~124.8px (caused by ~24px layout gap + ~100.8px transparent top padding inside the 600×500 PNG canvas).

### Next Visual Pass Strategy
- Do **NOT** shrink the overall layout or page elements.
- Keep the application physically large, prominent, and readable.
- Scale the unified Slot composition substantially larger.
- Absorb transparent top padding into layout positioning so the physical machine sits closer beneath Setup.
- Preserve reels, PNG artwork, and CTA button as one unified composition.
- Apply minimal optical horizontal centering only after scale and vertical placement are calibrated.

### Open Visual / Content Items
- Footer landscape assets currently exhibit opaque/white background rectangle artifacts.
- Final global font replacement.
- Top-left landing title/copy replacement.
- Ticket output animation and presentation.
- Result visual redesign / final reveal treatment.

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

---

## Deferred / Known Gaps
- **Result Visual Redesign & Ticket Output**: Result functionality is operational. Final Ticket/output reveal and Result presentation are deferred until Q1/Q2/READY/SPIN base proportions are approved. When that visual pass begins, follow `docs/PRODUCT.md` + applicable Fixed ADRs in `docs/DECISIONS.md` rather than inferring the final treatment from the current implementation.
- **Today's Pick System**: Seed content in `src/data/picks.ts`, `/pick/[slug]` detail page, right sidebar widget, and Q2 vibe seeding not implemented.
- **Full Guestbook Archive Page & Preview**: `/guestbook` read-only community feed page and right sidebar live feed connection not implemented.
- **Analytics Telemetry**: `src/lib/analytics/` and GA4 event dispatchers not implemented.
- **Transit Modeling**: Inter-stop travel times and transit modes are not modeled.
- **Production Brand Assets**: Official Kkumdori / Kkumssi Family illustrations, pixel artwork, and audio files are not yet in `public/`.
- **Dataset Verification**: Final tourism validation for candidate places is pending.

---

## Next Recommended Development Order
1. **Continue Visual Scale + Position Pass**: Iterate from the restored baseline in `plan_mvp_visual_integration` to achieve correct slot scale and absorbed vertical gap.
2. **Visual Lane Integration**: Merge/rebase visual worktree safely with latest `main`.
3. **GA4 Analytics & Telemetry**: Implement `src/lib/analytics/` tracking helpers adhering to `docs/ANALYTICS.md` strict privacy guardrails (**zero PII, no visitor nicknames/messages, no user share_code parameters**).
4. **Ticket Output & Result Visual Redesign**: Build output slit reveal and final Result presentation once base stage proportions are finalized.
5. **Content & Data Verification**: Today's Pick system, `/guestbook` feed, and tourism place verification.

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
