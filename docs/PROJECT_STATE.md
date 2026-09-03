# Daejeon Random Trip — Project State

## Snapshot
- **Last Updated**: 2026-09-02
- **Current `main` HEAD**: `6ae03c4` (`feat: add GA4 base analytics integration`)
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9, pnpm 11, Supabase (PostgreSQL REST)
- **Working tree**: clean at time of writing; no uncommitted branch work pending integration.

**TL;DR**: The Result Card and Route Guide have both shipped their production-raster visual redesign (`6560a5b`), replacing the old DOM-styled `ResultSheet` with a unified skin-driven `ResultQuest` renderer and a skin-banded `RouteGuideModal`. GA4 Phase 1 base analytics landed immediately after (`6ae03c4`) — the tag loads and has been manually verified in production, but no custom event instrumentation exists yet. The core recommendation engine, spin lifecycle, Random Log / Right Rail community surface, referral sharing, and the visual asset system (DOS Gothic font, 62 registered production assets) are all stable and unchanged by these two commits.

This document is organized as: **A** what's merged, **B** the confirmed product contract, **C** the current visual/architectural state, **D** analytics state, **E** what's deferred, **F** known non-blocking polish, **G** next priorities, **H** governance rules that must not be casually overridden.

---

## A. Merged / Implemented

Most recent first:

- **Mobile short-height Slot viewport fix** (branch `fix/mobile-slot-short-viewport`, not yet merged to `main`; ADR-031) — Human Browser E2E passed on a real iPhone XS-class Safari device. See **C** below for the height-budget contract.
- **GA4 base analytics integration** (`6ae03c4`) — `@next/third-parties`'s `GoogleAnalytics` mounted once in root layout, gated on `NEXT_PUBLIC_GA_MEASUREMENT_ID`. See **D** below and `docs/ANALYTICS.md` §9.
- **Result Quest & Route Guide visual redesign** (`6560a5b`) — production-raster redesign of both the Result Card and the in-app Route Guide. See **C** below for the architecture; no corresponding ADR was recorded for this pass (flagged in **G**).
- **Visual Detail Pass** (`65f3546`, ADR-027–ADR-030) — DOS Gothic finalized as the production Korean/UI typeface; 31 production PNG assets integrated via a central visual asset registry (`src/config/visualAssets.ts`); Editorial Rail rebuilt (`EditorialItem` + `EditorialSpotlightCard`, 6 seeded items); Final CSS Polish (decorative shadow removal, decoration normalization, spacing/logo scale tuning).
- **Reduced-motion Slot hotfix** (`a3b888c`, ADR-026) — a shared lifecycle clock now drives SPINNING → RESULT identically for both motion preferences; reduced motion runs the same reel-roll animation at ~2× lower intensity rather than a shortened/instant one.
- **Random Log / Right Rail Community Surface** (`0aef8c7`, ADR-025) — public read IA (Right Rail preview → `/random-log` board → `/random-log/[id]` detail), all ungated and available pre-spin; writing remains Result-gated and is decoupled from the 1-time reroll reward.
- **Result/Ticket Output System DEV contract** (`053289c`, ADR-008/ADR-022/ADR-023/ADR-024) — centered Result Card overlay, output-slit peek-cue mount architecture (visually dormant), minimize/reopen (결과 접기) lifecycle, nested-overlay keyboard-ownership handoff.
- **Earlier foundation** — Controlled Random recommendation engine (`src/lib/random`), experience state machine, Visual v4 layout shell, 163 provisional place candidates across 8 zones, Supabase REST backend, Guestbook + rewarded reroll, referral share snapshots (`/api/share`, `/r/[shareCode]`), in-app Route Guide, `SlotVisualFrame` responsive architecture baseline.

### Data status
- **Place Candidates**: 163 runtime candidates in `src/data/places.ts` (provisional / REVIEW-stage dataset; final tourism verification pending).
- **Zones**: 8 defined in `src/data/zones.ts` — 7 active (`soje`, `daeheung`, `seonhwa`, `eoeun-gung`, `galma`, `mannyeon`, `doryong`), 1 inactive (`banseok`, lacking anchor/discovery candidates).
- **Today's Pick legacy data**: `src/data/picks.ts` retained (`TODAYS_PICKS = []`), referenced by no UI — only its `getSeoulDateString` helper is reused by the current Editorial Rail.

### Backend / database / share infrastructure
- **Supabase**: server-only REST client (`src/lib/database/client.ts`), `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`). UI never accesses the database directly.
- **Guestbook / Random Log persistence**: `/api/guestbook` (`POST`/`GET`) sanitizes text, validates avatar/nickname (2–12 chars)/message (≤50 chars), attaches route metadata, writes to `guestbook_entries`. `GET` supports `before` cursor pagination.
- **Shared routes**: `src/lib/database/share.ts` (cryptographic `generateShareCode`, immutable snapshot persistence); DDL in `supabase/migrations/20260829000000_create_shared_routes.sql` + `...0001_configure_shared_routes_grants.sql`.
- **Shared route social preview**: `src/lib/share/shareHelper.ts` resolves site origin (`NEXT_PUBLIC_SITE_URL` → Vercel env fallbacks); `/r/[shareCode]` serves dynamic OpenGraph/Twitter metadata, `robots: noindex`.
- **Character registry**: `GUESTBOOK_AVATARS` (`src/config/avatars.ts`) — 10 stable Kkumssi-family identity ids, all with production `imageSrc` artwork wired through the visual asset registry.

---

## B. Confirmed Product Contract

### Core interaction flow
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
- **Half-day (3-stop) routes fill the 4th cell with an `ExploreMoreBanner`** (`"조금 더 놀다 갈래?"`) instead of leaving it empty or stretching STOP 3. This banner is presentation-only, carries no place data, and is never treated as a domain stop by `src/lib/random` or the `RouteResult`/`RouteStop` types. Its destination CTA is currently unwired (no URL/route/modal/analytics event) pending a product decision — it renders as a non-interactive prompt until one exists.
- An optional **Bonus Quest** mission line (`RouteResult.mission`) may render below the stops, drawn from a small fixed pool of generic playful prompts in `src/config/missions.ts`, selected by the engine's injected random source. This is presentation framing over the pre-existing `mission` field, not a new recommendation axis, and carries no operational/place-detail data.

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

### Editorial Rail ("TODAY'S PICK") — unchanged (ADR-015 revised, ADR-028)
- Right Rail banner only — no detail page, no Q2 seeding, no Slot funnel, no voting.
- 6 production banners (5 evergreen + 1 date-bound), validity-window-filtered then deterministically rotated per Asia/Seoul calendar date.
- No `href`/`external` destinations seeded yet; banner-click/impression analytics TBD (see **D**).

---

## C. Current Visual State

### Result & Route Guide skin architecture (new, from `6560a5b`)
Both the Result Card and Route Guide are now painted primarily by approved production raster "skin bands," with DOM limited to transparent content overlays and hitboxes — no reconstructed borders, shadows, gradients, or frames layered on top of the artwork.

- **Result — ONE renderer, per-state raster**: `ResultQuest` (`src/components/experience/result/`) replaces the deleted `ResultSheet.tsx` (485 lines removed). `resolveResultSkin(rerollReward)` in `resultSkin.ts` selects between exactly two complete states — `normal` and `consumed` — each a full header/body/actions raster set at both mobile and desktop breakpoints. Verified by an asset-level test that stacking each state's three bands reproduces its Figma master pixel-for-pixel (0 byte mismatches). `QuestHeader`, `ResultBodySkinCanvas`, and `ResultActions` all use the same `.skin-canvas` mechanism (`background-size: 100% auto` in an aspect-locked container, rendering at exactly 1.0×, never stretched).
- **Route Guide skins**: `guideSkin.ts` — deliberately minimal (cobalt frame + cream paper + one Mission decorative shell); the long stop timeline stays entirely DOM-driven inside a vertically-tiling `.skin-strip` background.
- **Breakpoint contract fixed to 1024px**: the Result/Route Guide skin swap now keys off `1024px` (`lg`), matching `page.tsx`'s `hidden lg:flex` / `lg:hidden` dual mount of `MainExperience`. Previously it keyed off `640px` (`sm`), which meant viewports between 640–1023px (rendering the mobile mount) were served *desktop* skin bands — and in the consumed state, where no desktop raster existed at the time, the action band silently disappeared. This is the **desktop-consumed action-band registration bug**, now fixed by the breakpoint alignment plus the arrival of an approved desktop-consumed raster (`Result/Skin/DesktopBlank-RerollConsumed2Action`, node `329:2`); the old CSS reconstruction fallback for that state has been deleted rather than kept as a second code path.
- **Full-day duration label unified to `하루종일`** app-wide (see **B**).
- **`hasLoggedCurrentResult` is a dead prop**: `ResultArea` still accepts and `MainExperience` still computes/passes it (ADR-025 per-Result tracking logic is unchanged), but nothing renders it any more — it was the standalone Random Log row, now removed.

### Asset registry
- `src/config/visualAssets.ts`: **62 registered paths**, all resolving; `public/assets/` holds **63 files** (`slot-shell.png` deliberately outside the registry, unchanged from prior state).
- DOS Gothic is the production Korean/UI typeface (ADR-030), registered as a single 400-weight face (`--font-ui`) with `preload: false`; Geist Sans remains the `--font-sans` fallback because DOS Gothic lacks several glyphs the UI renders (see **F**).
- `OUTPUT_PEEK_ENABLED` **remains `false`** in `SlotOutputLayer.tsx` — the output-slit peek cue mount/timing architecture (including new sub-beat scheduling added in `6560a5b`'s `peekPhase`) is implemented and dormant, pending the dedicated Figma ticket asset.

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
- **Not yet true**: campaign/UTM naming convention unfinalized; standard Traffic Acquisition report may still be awaiting processed data; **zero** custom events from the Event Catalog are instrumented (`src/lib/analytics/` does not exist); Campaign & Funnel Analysis Dashboard not built; Today's Pick banner-click/impression tracking still TBD.
- **Privacy contract (unchanged, must be preserved when instrumentation lands)**: never transmit Visitor Log nicknames, Random Log free text, `share_code`, IP, email, phone, or other PII. `place_map_click` is the primary proxy conversion and must never be represented as proof of a physical visit.

---

## E. Deferred / Not Implemented

- **Custom GA4 event instrumentation & Campaign/Funnel Dashboard** — spec exists in full (`docs/ANALYTICS.md` §3, §8); zero code exists yet.
- **Output-slit ticket peek visual asset** — mount/timing architecture implemented and dormant (`OUTPUT_PEEK_ENABLED = false`); needs the dedicated Figma asset, the reveal/peek animation, and a mini-ticket skin for the reopen affordance.
- **ExploreMore banner destination** — no URL, route, modal, or analytics event decided; renders as a non-interactive prompt.
- **Editorial Rail hrefs & banner-click tracking** — shell supports optional external links; none are seeded; impression/click analytics TBD.
- **Transit modeling** — inter-stop travel times/modes not modeled; `estimatedTotalMinutes` is stay-duration-only.
- **BGM real playback** — the BGM widget's control artwork and hit regions are visual/interaction-ready (`feat/visual-detail-pass`), but there is no `<audio>` element, no playback state, and no handlers; explicitly deferred to a dedicated `feat/bgm-playback` branch. The equalizer bars are static (never animated), so nothing currently misrepresents playback beyond the visual "PLAYING" label itself (recorded as polish in **F**).
- **Dataset tourism verification** — the 163 provisional place candidates await final verification; hours/details are provisional.
- **Random Log community features** — comments, likes/ranking, profiles, edit/delete are intentionally not built (ADR-025); no speculative schema exists for them.
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

1. **Analytics**: implement `src/lib/analytics/` custom event dispatchers against `docs/ANALYTICS.md` §3's Event Catalog (parameter whitelist §4), verify each in GA4 DebugView (§7), then build the Campaign & Funnel Analysis Dashboard (§8).
2. **Decide the ExploreMore banner's destination** — currently an unwired presentation-only prompt on all half-day (3-stop) Results.
3. **Result/Route Guide visual pass follow-through**: source the output-slit ticket asset and flip `OUTPUT_PEEK_ENABLED`; implement its reveal/peek animation and a mini-ticket reopen-affordance skin.
4. **Editorial Rail follow-ups**: seed real `href`/`external` destinations; decide banner-click/impression tracking (TBD in `docs/ANALYTICS.md` §3.4).
5. **Result action tap-target remediation** (painted wells <44px) — needs design input on raster geometry, not a pure code fix.
6. **BGM real playback** on a dedicated `feat/bgm-playback` branch.
7. **Dataset tourism verification** for the 163 provisional place candidates.
8. **Documentation gap**: record ADRs for the Result Quest / Route Guide skin redesign (`6560a5b`) and the GA4 base integration (`6ae03c4`) — both are merged to `main` with no corresponding entry in `docs/DECISIONS.md` (last recorded is ADR-030). This is a governance/documentation gap, not a code defect — see the human-decision items in the recovery report that produced this update.

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
