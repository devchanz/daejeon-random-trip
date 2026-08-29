# Daejeon Random Trip — Project State

## Snapshot
- **Last Updated**: 2026-08-29
- **Baseline Main Commit at Handoff Start**: `5060084`
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9, pnpm 11, Supabase (PostgreSQL REST)
- **Current Status**: Core Controlled Random recommendation engine, provisional place dataset, setup/spin experience, guestbook rewarded reroll loop, and referral sharing (`/api/share`, `/r/[shareCode]`, Result share CTA wiring) are implemented and verified. In-app route guide, analytics, and asset finalization are pending.

## Product Flow
1. **Q1 (Duration)**: User selects local travel time in Daejeon (`반나절` / `하루`).
2. **Q2 (Preference)**: User selects travel vibe (`아무거나` / `먹방` / `산책` / `사진`).
3. **READY**: Condition summary displayed; primary CTA activates `“🎰 여행 뽑기!”`.
4. **SPINNING**: Slot reels spin with neutral arcade symbols; sequential stop (`Reel 1` 1100ms → `Reel 2` 1600ms → `Reel 3` 2100ms → final beat 400ms).
5. **RESULT**: Spin completes; currently presents an overlapping inline `ResultSheet` ticket (with temporary 1400ms dim/blur backdrop) displaying route stops, stay times, and mission note. *(Note: Transition to centered modal overlay is an approved contract gap deferred to Final Visual Integration).*

## Route Recommendation Contract
- **Engine Logic** (`src/lib/random`): Pure, testable logic decoupled from UI animations.
- **Ordered Route Template**:
  - **Half-Day (`half`)**: Fixed **exactly 3 stops**: `Meal → Cafe → Preference` (`half_ordered_3`).
  - **Full-Day (`full`)**: Primary **4 stops**: `Meal → Cafe → Discovery → Preference` (`full_ordered_4`); graceful fallback to **3 stops**: `Meal → Cafe → Preference` (`full_fallback_3`), omitting Discovery while preserving user's chosen Preference.
- **Preferences**: `anything` ('아무거나', wildcard matching all candidates), `food` ('먹방'), `walk` ('산책'), `photo` ('사진').
- **Stop Roles vs Route Slots**: Conceptual place taxonomy is `anchor`, `meal`, `discovery`, `stay-extender`. Route slots are `meal`, `cafe`, `discovery`, `preference`. Canonical cafe identification is based on `PlaceCandidate.category === "카페·디저트"`.
- **Duration Budget Semantics**: In current provisional data, `estimatedTotalMinutes` strictly represents place stay duration ($\sum \text{Place.durationMin}$). Door-to-door transit times are omitted pending transit modeling. Numeric budget bounds (`minMinutes`, `maxMinutes`) remain unconfigured (TBD).

## Data Status
- **Place Candidates**: 163 runtime candidates in `src/data/places.ts`, generated from the current provisional / REVIEW-stage place dataset. Final tourism verification is pending.
- **Zones**: 8 total defined in `src/data/zones.ts`.
  - **Active (7)**: `soje`, `daeheung`, `seonhwa`, `eoeun-gung`, `galma`, `mannyeon`, `doryong`.
  - **Inactive (1)**: `banseok` (`active: false` due to lack of anchor/discovery candidates in provisional data).
- **Today's Pick Data**: `src/data/picks.ts` initialized with empty array (`TODAYS_PICKS = []`).

## Backend / Guestbook / Reroll
- **Supabase Runtime**: Server-only REST client (`src/lib/database/client.ts`) using standard `fetch` with `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`). UI never accesses database directly.
- **Guestbook Persistence**: `/api/guestbook` (POST & GET) sanitizes text, validates avatar/nickname (2–12 chars)/message (1–50 chars), attaches route metadata, and writes to `guestbook_entries`.
- **1-Time Rewarded Reroll**:
  - Lifecycle: `locked` → `available` → `consumed`.
  - Unlocked strictly upon verified server DB insertion from `GuestbookComposer`.
  - Max 1 reward reroll per travel session, backed by browser `sessionStorage`.
  - Consumed only after successful route recommendation generation.
- **Share Snapshot Foundation**: `src/lib/database/share.ts` implements cryptographic rejection sampling (`generateShareCode`) and snapshot persistence foundation only.
- **Asset Placeholders**: `GUESTBOOK_AVATARS` uses 4 development placeholder emojis (⭐, ✨, 🌱, 🎒). Official Kkumdori/Kkumssi assets are pending.

## Completed Milestones
- [x] Controlled Random recommendation engine with role taxonomy and fallback handling (`src/lib/random`).
- [x] Enforced Ordered Route Templates (Half: Meal -> Cafe -> Preference; Full: Meal -> Cafe -> Discovery -> Preference with 3-stop fallback).
- [x] Experience state machine & reducer (`src/lib/experience`).
- [x] Visual v4 layout shell (`Header`, `LeftSidebar`, `RightSidebar`, `Footer`, `MainExperience`).
- [x] Physical slot machine chassis with sequential reel stops, lever animation, and reduced-motion support.
- [x] Overlapping inline Result Sheet with step timeline and mission card.
- [x] 163 runtime place candidates across 8 zones (7 active).
- [x] Supabase server REST client & `/api/guestbook` route handler.
- [x] Guestbook composer modal with input sanitization & rewarded reroll lifecycle (`sessionStorage`).
- [x] Share snapshot persistence foundation (`src/lib/database/share.ts`).
- [x] Shared Routes / Referral: `/api/share` route handler, dedicated `/r/[shareCode]` friend landing page with dynamic OG metadata, and ResultSheet Web Share / clipboard fallback.

## Deferred / Known Gaps
- **Result Visual Contract**: Latest docs (`docs/PRODUCT.md`, `ADR-008`) define a 2-stage reveal with output slit peek cue & centered `ResultModal` overlay; current code uses inline `ResultSheet`.
- **In-App Route Guide**: `RouteGuide.tsx` not implemented; `“이 코스로 가보기”` CTA is disabled.
- **Today's Pick System**: Seed content in `src/data/picks.ts`, `/pick/[slug]` detail page, right sidebar widget, and Q2 vibe seeding not implemented.
- **Full Guestbook Archive Page & Preview**: `/guestbook` read-only community feed page and right sidebar live feed connection not implemented.
- **Analytics Telemetry**: `src/lib/analytics/` and GA4 event dispatchers not implemented.
- **Transit Modeling**: Inter-stop travel times and transit modes are not modeled.
- **Production Brand Assets**: Official Kkumdori / Kkumssi Family illustrations, pixel artwork, and audio files are not yet in `public/`.
- **Dataset Verification**: Final tourism validation for candidate places is pending.

## Next Recommended Work
1. **RouteGuide**: Build `src/components/experience/RouteGuide.tsx` (structured itinerary breakdown, stay times, place guidance, and outbound map links) and wire `“이 코스로 가보기”` CTA.
2. **Today's Pick**: Populate `src/data/picks.ts`, build `/pick/[slug]` detail page, and update sidebar widget with Q2 preference seeding.
3. **Analytics / GA4**: Implement `src/lib/analytics/` tracking helpers adhering to `docs/ANALYTICS.md` strict privacy guardrails (**zero PII, no visitor nicknames/messages, no user share_code parameters**).
4. **Final Visual Integration**: Align Result presentation with approved centered `ResultModal` overlay and output slit peek cue (ADR-008), integrate official Kkumdori / Kkumssi Family assets and pixel art into frames/avatars.
5. **Remaining Content / Data Completion**: Implement `/guestbook` read-only archive feed and sidebar live stream; complete tourism verification for place candidates.

## Source of Truth
Authority is distributed across authoritative project documents:
- **Current implemented behavior** → Repository code (`src/`)
- **Approved product / UX contract** → `docs/PRODUCT.md` + Fixed ADRs in `docs/DECISIONS.md`
- **Architecture boundaries** → `docs/ARCHITECTURE.md`
- **Formal data contracts** → `docs/DATA_MODEL.md`
- **Analytics / privacy contract** → `docs/ANALYTICS.md`
- **Development rules** → `AGENTS.md`

> **Rule on Discrepancies**: When code implementation differs from an approved contract, treat it as a **known implementation gap**, not a reason to silently redefine the approved contract. `PROJECT_STATE.md` is an operational checkpoint/index, not a replacement for detailed ADRs or specifications.

## Development Workflow
- **Modes**:
  - **High**: Architecture design, contract definition, complex debugging, and final review.
  - **Medium**: Implementation and refactoring of approved contracts.
- **Guardrails**:
  - No unauthorized package installations.
  - No git commits, pushes, or branch switches without explicit user approval.
  - No destructive file operations. Scratch scripts require review before execution.
  - Browser screenshots / E2E verification serve as the visual source of truth where applicable.

## Git Completion Workflow
The term **"작업 마무리"** strictly denotes the complete delivery sequence:
1. Implementation complete
2. Validation checks (`pnpm lint`, `pnpm typecheck`, `pnpm build`)
3. Final High review
4. Browser visual / E2E verification (where applicable)
5. `git commit`
6. `git push`
7. Pull Request creation
8. Merge to `main`
9. Switch to `main` & `git pull --ff-only`
10. Local branch cleanup
11. Remote branch cleanup confirmation
