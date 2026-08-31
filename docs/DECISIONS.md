# Architecture & Product Decision Records (ADR)

This document tracks fundamental product, architecture, and growth experience decisions for the Daejeon Random Trip MVP.

---

### ADR-001: Controlled Random Travel vs. Pure Independent Randomness
- **Status**: **Fixed**
- **Decision**: Route generation follows a structured funnel (`Preference -> Zone -> Candidate Filtering -> Route Template -> Place Selection -> Coherent Route`) rather than independently selecting unrelated random spots.
- **Why**: Pure randomness produces nonsensical itineraries (e.g., three consecutive cafes or distant stops across the city). Controlled randomness ensures physical plausibility and structured routing while preserving the excitement of surprise.
- **Revisit when**: If user feedback demands fully open-ended exploration across unlimited categories.

---

### ADR-002: Separation of Recommendation Engine and Visual Slot Animation
- **Status**: **Fixed**
- **Decision**: The recommendation engine (`src/lib/random`) computes the complete `RouteResult` first; an adapter layer maps the variable-stop route to the visual slot reel display format. The slot machine UI is solely an animated presentation layer that stops on the computed result.
- **Why**: Decoupling prevents visual rendering bugs from corrupting itinerary logic, keeps stop counts independent of visual reel counts, and ensures independently testable route logic. READY reels display presentation-only placeholder items without exposing itinerary data early.
- **Revisit when**: Never for the core engine separation; visual interaction styles and adapter mapping may evolve independently.

---

### ADR-003: No Runtime LLM for Route Generation
- **Status**: **Fixed**
- **Decision**: The MVP uses static curated templates, candidate place data, duration budgeting, and controlled random selection/validation logic instead of calling runtime LLM APIs.
- **Why**: Eliminates runtime API costs, latency (crucial for quick slot spin feel), hallucinated locations, and rate-limiting failure modes during marketing campaigns.
- **Revisit when**: Future phases require dynamic natural-language storytelling or personalized multi-city generative guides.

---

### ADR-004: Primary Conversion Metric as a High-Intent Proxy
- **Status**: **Fixed**
- **Decision**: Track clicks on outbound map links within the in-app Route Guide (`place_map_click`) as the Primary High-Intent Proxy Conversion. Today's Pick banner-click tracking is TBD/deferred (ADR-015, revised) — no secondary event is currently defined for it.
- **Why**: Physical visits to Daejeon cannot be directly tracked or verified by a lightweight web landing page without intrusive native app permissions or physical beacons.
- **Revisit when**: Offline verification partnerships (e.g., stamp tours, merchant QR codes) become available.

---

### ADR-005: Strict PII and Free-Text Prohibition in Analytics
- **Status**: **Fixed**
- **Decision**: Do not explicitly collect or send Visitor Log nicknames, message strings, IP addresses, or arbitrary user input to Google Analytics 4 as custom parameters or user properties.
- **Why**: Supports privacy-by-design and reduces the risk of accidental PII/free-text leakage.
- **Revisit when**: Never (permanent privacy rule).

---

### ADR-006: Separation of Product Policies from UI Hard-coding
- **Status**: **Fixed**
- **Decision**: Business rules (duration budget bounds, preference types, zone weighting, Seongsimdang inclusion rules, avatar lists) must live in `src/config/` and `src/data/`, not inside React components.
- **Why**: Enables rapid policy adjustments during marketing campaigns without risky code refactors or UI regressions.
- **Revisit when**: Never.

---

### ADR-007: Two-Question Interaction Flow & State Progression
- **Status**: **Fixed**
- **Decision**: Present two sequential setup questions (`Q1`: Duration, `Q2`: Preference) before transitioning through `READY` → `SPIN` → `RESULT` → `ROUTE_GUIDE`. Primary Spin Action is `“여행 뽑기!”`. The slot lever is strictly a visual feedback/interaction mechanism.
- **Why**: Minimizes setup friction while capturing the minimum essential parameters needed for route template selection and duration budgeting.
- **Revisit when**: Analytics show significant drop-off between Q1 and Q2.

---

### ADR-008: Centered Result Card Action Hierarchy (Superseding Inline Result Sheet)
- **Status**: **Fixed (Supersedes legacy inline long receipt)** — implemented via `ResultArea.tsx` / `SlotOutputLayer.tsx`, Human Browser validated.
- **Decision**: Result presentation adopts the 2-stage reveal flow (output slit peek cue followed 300–500ms after the peek cue is triggered by a front-facing centered `Result Card` modal overlay, rendered as an in-flow `fixed` overlay — not a Portal, since `MainExperience` mounts twice for desktop/mobile and a Portal would escape that responsive gate). The Result Card features three distinct action pathways:
  1. **Conversion (Primary)**: `“이 코스로 가보기”` → Transitions to the in-app `Route Guide`.
  2. **Referral (Secondary)**: `“내 루트 공유하기”` → Generates snapshot and short URL `/r/[shareCode]`.
  3. **Participation / Reward (Tertiary)**: `“랜덤 로그 남기고 1회 더 뽑기”` → Opens in-flow Visitor Log composer and unlocks 1 reroll upon server-verified DB save.
  - Result Card body is semantic React / DOM / CSS; glassmorphism is prohibited; slot machine remains stationary.
  - Result Card keyboard ownership (Escape-to-minimize, Tab focus containment) is active only while Result is the topmost interactive layer; it suspends automatically whenever `RouteGuideModal` or `GuestbookComposer` is open above it, and reactivates — without minimizing Result — once the nested overlay closes.
- **Why**: Eliminates layout jumping and viewport displacement caused by long paper extrusion while focusing user attention on structured conversion, referral, and community participation.
- **Revisit when**: Post-launch campaign analytics show significant conversion drop-offs.

---

### ADR-009: Target Audience Assumption (20–30s)
- **Status**: **Tentative**
- **Decision**: Treat the 20–30s demographic as a working marketing campaign segment rather than a hard product constraint.
- **Why**: Marketing copy and visual motifs (Y2K retro) are hypothesized to appeal to this segment, but the underlying product value (effortless local travel discovery) may resonate across wider audiences.
- **Revisit when**: Post-campaign audience insights, channel engagement, and conversion evidence reveal actual visitor distribution.

---

### ADR-010: Initial Geographic Cluster Scope
- **Status**: **Tentative**
- **Decision**: Seed candidate place data primarily around Daejeon Station and the old downtown district (Eunhaeng-dong / Daeheung-dong).
- **Why**: High density of walkable attractions, dining, and transit access simplifies MVP travel viability.
- **Revisit when**: Expanding the tourism database to Yuseong, Dunsan, or Daedeok clusters in subsequent iterations.

---

### ADR-011: Visitor Log & 1-Time Reroll Reward Loop (Superseding Unconditional Free Rerolls)
- **Status**: **Fixed (Supersedes legacy unconstrained free reroll policy)**
- **Decision**: Deprecate unconditional free rerolls. Rerolls start `locked`. Submitting a Visitor Log (Kkumssi avatar, 2–12 char nickname, max 50 char message) triggers a server-side DB `INSERT` into `guestbook_entries`. Upon verified success, the user receives exactly 1 reward reroll (`available` → `consumed`) backed by browser `sessionStorage`. Maximum 1 reward reroll per travel session.
- **Why**: Converts reroll demand into community social proof and active engagement without introducing user login complexity.
- **Revisit when**: Moderation/spam issues arise or campaign scale requires authenticated accounts.

---

### ADR-012: Approved Visual v4 Base & Visual Skin Boundaries
- **Status**: **Tentative (Approved Visual Base)**
- **Decision**: Adopt Visual v4 ("Korean Y2K Personal Web × Random Travel Toy" structure: Header `DAEJEON RANDOM TRIP`, Left Sidebar `MY PROFILE` / `TODAY IS…` / `BGM PLAYING`, Center `Setup Area` → `Slot Anchor` → `Result Overlay` → `Route Guide`, Right Sidebar `TODAY’S PICK` / `VISITOR LOG`). Direct legacy terminology is avoided in architectural models. Full-screen image slicing and glassmorphism are prohibited.
- **Why**: Maintains emotional brand identity while keeping presentation concerns cleanly modular and responsive.
- **Revisit when**: Design team delivers future theme skins or asset updates.

---

### ADR-013: In-App Route Guide Architecture Over Direct Map Redirect
- **Status**: **Fixed**
- **Decision**: Clicking `“이 코스로 가보기”` does not directly navigate away to an external map app. Instead, it opens an in-app `Route Guide` view displaying total estimated travel time, stop sequence (1–4), stay durations, transit times, tips, and individual outbound map links (`place_map_click`).
- **Why**: Direct external redirects discard the coherent itinerary context, whereas an in-app Route Guide gives users the structured plan they need before choosing which individual stop to open in navigation.
- **Revisit when**: Deep linking / multi-stop map route sharing APIs become viable across major Korean map providers.

---

### ADR-014: Referral Loop via Shared Route Snapshot URL (`/r/[shareCode]`)
- **Status**: **Fixed**
- **Decision**: Clicking `“내 루트 공유하기”` creates an immutable JSON snapshot in `shared_routes` via server API and generates a short URL (`/r/[shareCode]`, e.g., `/r/F7k2Ma9Q`). The `/r/[shareCode]` page is a dedicated friend landing (`noindex`) featuring the route snapshot and two CTAs: Primary `“나도 여행 뽑아보기”` (referral acquisition) and Secondary `“이 코스 그대로 가보기”` (opens Route Guide). Kakao SDK / Login is omitted in favor of Web Share API and clipboard copy.
- **Why**: Query-string route serialization is fragile and messy. Snapshot storage guarantees permanent route immutability even if place data is updated later, and provides a clean viral landing page for new users.
- **Revisit when**: Dynamic Open Graph card generation is a prioritized non-blocking enhancement within the MVP cycle; dedicated Kakao Talk SDK / message templates remain strictly out of scope.

---

### ADR-015: Today's Pick as a Right Rail Editorial Banner (Revises Prior Detail-Page / Q2-Seeding Scope)
- **Status**: **Fixed**
- **Decision**: Today's Pick remains a Right Rail editorial / visual banner surface only. Approximately 5 production pixel-art variants are planned; the displayed artwork may rotate by weekday or another simple schedule. A banner may optionally hyperlink to an external site related to the featured artwork/place/theme. No dedicated `/pick/[slug]` detail page, no Q2 preference-seeding CTA, and no Today's Pick → Slot funnel are approved.
- **Why**: The previously documented `/pick/[slug]` detail page and Q2 preference-seeding CTA were never implemented (`TODAYS_PICKS` is an empty array; no `/pick` route exists; the sidebar's `자세히 보기` button has no handler) and are no longer approved scope. Today's Pick is confirmed as a simple editorial surface rather than a secondary discovery/seeding funnel, avoiding unapproved complexity and an unreviewed second entry point into the Slot experience.
- **Revisit when**: Product explicitly approves a detail-page or Q2-seeding flow for Today's Pick as new, reviewed scope.

---

### ADR-016: Elimination of Main Navigation Tabs to Maximize Slot Viewport Priority
- **Status**: **Fixed**
- **Decision**: Remove legacy top navigation tabs (`여행 뽑기`, `가이드`, `맛집 리스트`, `내 보관함`).
- **Why**: Top tabs implied multi-page portal browsing and directory search, contradicting the core value proposition (“계획하지 말고, 대전에서 여행을 뽑아보자.”). Removing them recovers vertical screen real estate and immediately focuses the user on the Setup Area and Slot Anchor.
- **Revisit when**: Post-MVP product scope explicitly introduces multi-city or complex user dashboard capabilities.

---

### ADR-017: Selective Persistence Boundary (Supabase for Guestbook & Shares Only)
- **Status**: **Fixed**
- **Decision**: Limit Supabase persistent storage strictly to `guestbook_entries` and `shared_routes`. General route generation and Q1/Q2 selections are ephemeral; reroll session states are managed in session-scoped browser storage (`sessionStorage`).
- **Why**: Minimizes database write volume, eliminates latency from the core slot spin interaction, and maintains strict privacy by avoiding storing anonymous browse sessions.
- **Revisit when**: Persistent user accounts or cross-device itinerary sync are added in future versions.

---

### ADR-018: Route Stop Count and Provisional Duration Policy
- **Status**: **Fixed**
- **Decision**:
  - **Half-Day (`half`)**: Fixed **3 stops** (2-stop half-day templates are deprecated and removed).
  - **Full-Day (`full`)**: **3–4 stops** (4 stops preferred when `stay-extender` candidates are available; 3 stops retained as graceful fallback).
  - **Duration Budgets**: Numeric duration bounds (`minMinutes`, `maxMinutes`) remain unconfigured (TBD) in `DURATION_BUDGET_POLICIES`. In provisional MVP data, `estimatedTotalMinutes` strictly represents place stay time ($\sum \text{Place.durationMin}$) without inter-stop transit time.
- **Why**: 2-stop half-day routes generated insufficiently engaging itineraries with low stay times (min 65m, p10 95m). Fixing half-day to 3 stops naturally lifts the duration floor (min 115m, p10 145m, median 175m) and guarantees 100% route generation success across all 7 active zones without requiring brittle numeric rejection loops on provisional place data.
- **Revisit when**: Place candidate dataset undergoes full tourism verification and door-to-door transit time modeling is implemented.

---

### ADR-019: Ordered Route Template Sequence & Preference-Preserving Fallback
- **Status**: **Fixed**
- **Decision**:
  - **Half-Day (`half`)**: Fixed sequence of exactly 3 stops: `Meal → Cafe → Preference`.
  - **Full-Day (`full`)**: Primary sequence of 4 stops: `Meal → Cafe → Discovery → Preference`.
  - **Full-Day Graceful Fallback**: If a 4-stop itinerary cannot be fulfilled in a zone, gracefully fall back to 3 stops (`Meal → Cafe → Preference`), omitting intermediate `Discovery` while strictly preserving the user's explicit Q2 Preference selection.
  - **Slot & Role Boundaries**: Canonical cafe identification is based on `PlaceCandidate.category === "카페·디저트"`. The conceptual `CandidateRole` taxonomy (`anchor`, `meal`, `discovery`, `stay-extender`) remains unchanged.
- **Why**: Pure role-based random ordering produced unnatural sequences (e.g. meal placed at the end of a half-day trip). The Ordered Route structure guarantees coherent, intuitive local itineraries (Meal -> Cafe -> Activity) while keeping randomness and zero database overhead.
- **Revisit when**: Multi-city extensions or dynamic duration-window constraints are introduced.

---

### ADR-020: SlotVisualFrame / LogicalCanvas Separation
- **Status**: **Fixed**
- **Decision**: The slot machine's physical visible footprint (`SlotVisualFrame`) participates in normal page layout flow, sized to the production assets' measured non-transparent pixel bounds (~46.72% of the 600×500 logical canvas width, not the previously assumed ~58%). The original 600×500 asset coordinate system (`LogicalCanvas`, containing reels/PNG/CTA) is absolutely positioned inside the frame and must never determine surrounding layout spacing.
- **Why**: Letting the transparent logical canvas itself participate in layout required hand-tuned negative margins to compensate for its padding, which drifted out of sync at every viewport and could never be fixed by re-tuning constants alone. Separating "physical footprint" from "asset coordinate system" removes the compensation entirely.
- **Revisit when**: The production slot PNG assets (`slot-idle.png` / `slot-pulled.png` / `slot-shell.png`) are re-exported at different bounds — the measured constants in `src/components/experience/slotGeometry.ts` would need re-verification.

---

### ADR-021: Ground Scenery Is Not Semantic Footer
- **Status**: **Fixed**
- **Decision**: The tower/city/foliage artwork anchored beneath the Visual Stage is decorative **Ground Scenery** (absolutely positioned, `pointer-events-none`), structurally and semantically distinct from the `Footer` component. `Footer` is intentionally excluded from the initial landing Hero.
- **Why**: Prevents future confusion or accidental conflation when legal/nav footer content is eventually scoped for the landing page.
- **Revisit when**: A semantic Footer is scoped for the landing page.

---

### ADR-022: SlotOutputLayer as a Sibling of SlotVisualFrame
- **Status**: **Fixed** — implemented via `SlotOutputLayer.tsx`, mounted from `SlotAnchor.tsx` at the sibling position reserved for it; Human Browser validated.
- **Decision**: The Result/Ticket output reveal (ADR-008's output slit peek cue) mounts inside `SlotStage` as a **sibling** of `SlotVisualFrame` — never as a descendant of `LogicalCanvas` or inside the frame's clipped bounds. The visual paper/ticket cue itself is currently disabled (`OUTPUT_PEEK_ENABLED = false` in `SlotOutputLayer.tsx`) because the DEV placeholder read as a plain white rectangle against the production slot PNG; the component, its mount point, its props, and this sibling contract all remain live and dormant, so reinstating the cue is a single flag flip once the dedicated Figma output-slit ticket asset lands.
- **Why**: `SlotVisualFrame` uses `overflow: hidden` (ADR-020) to fix an empty-scroll-tail bug. ADR-008's reveal needs to extend below the physical chassis; nesting it inside the frame would force a permanent clip that contradicts that contract. A sibling mount is unaffected by the frame's overflow.
- **Revisit when**: The Figma output-slit ticket asset is ready — flip `OUTPUT_PEEK_ENABLED` to `true` and verify the cue against production asset proportions (see `docs/PROJECT_STATE.md` → Next Recommended Development Order).

---

### ADR-023: Result Minimize / Reopen (결과 접기) Resolves the Result Dismissal Path
- **Status**: **Fixed** — implemented via `revealStage: 'minimized'` in `MainExperience.tsx`, `ResultArea.tsx`, and the reopen affordance in `SlotAnchor.tsx`'s helper band; Human Browser validated.
- **Decision**: The Result Card is dismissed by **minimizing** (결과 접기), never by closing or discarding. Minimizing sets the presentation-only `revealStage` to `'minimized'`: the overlay hides (`display:none`, not unmounted, so `ResultSheet`'s local share state survives), body scroll and background interaction are fully restored, and `state.result` is never touched — no route regeneration, no reducer dispatch. A persistent reopen affordance (`🎫 내 여행 티켓 다시 보기`) lives in `SlotAnchor`'s helper band, directly beneath the slot's output slit (zero added layout height, preserving the ADR-020 position-lock contract), and returns to the exact same revealed Result Card with every CTA/reward/reroll state intact. Escape, while Result holds keyboard ownership (ADR-008), also minimizes rather than closing or discarding.
- **Why**: ADR-008 established the centered Result Card modal overlay but left dismissal undefined. A persistent overlay with no exit trapped the user — background scroll-locked and click-blocked with no way out — and was explicitly flagged as an open Product/UX question during implementation. Minimize resolves it while preserving Result data and the ticket metaphor ("결과가 접혀 있다", not "결과가 사라졌다").
- **Revisit when**: Product wants an actual close/discard action distinct from minimize, or the reopen affordance's placement needs revisiting for discoverability.

---

### ADR-024: Landing Page Columns Stay Out of Their Own Stacking Context
- **Status**: **Fixed** — implemented via `src/app/page.tsx`; Human Browser validated.
- **Decision**: The three-column Visual Stage layout (`src/app/page.tsx`) does not assign `z-index` to the Left Sidebar, Center (`<main>`), or Right Sidebar column wrappers. Only the shared content wrapper they sit inside keeps `z-10`, which is enough to stay above the decorative Ground Scenery (`z-0`).
- **Why**: `z-index` on a flex item creates a stacking context even without an explicit `position`. All three columns previously carried `z-10`, so every in-flow `fixed` overlay inside `MainExperience` (Result Card, Guestbook Composer, the reveal-emphasis backdrop) resolved its own `z-index` inside `<main>`'s local stacking context instead of the page's — DOM order then decided paint order between columns, so the Right Sidebar (rendered after `<main>`) visually painted over these overlays while the Left Sidebar (rendered before) did not. Removing the redundant column-level `z-index` lets in-flow fixed overlays cover the whole page as intended, without a Portal — which would reintroduce the dual-mount hazard of `MainExperience` rendering twice for desktop/mobile (see ADR-008).
- **Revisit when**: A future column needs its own `z-index` for an unrelated reason — re-verify against this contract before adding one.

---

### ADR-025: Random Log — Public Read IA, Result-Gated Writing, and Reward/Write Decoupling
- **Status**: **Fixed** — implemented (public read surfaces, `CharacterSelector`, write/reward decoupling) on branch `feat/random-log-right-rail`; Human Browser validated. Extends ADR-011, which remains accurate and unmodified.
- **Decision**:
  1. **Public read IA, three tiers, ungated**: Right Rail live preview (top 3, `RandomLogRightRailPreview`) → `/random-log` full board (cursor-paginated "Load more") → `/random-log/[id]` detail. All three are reachable directly from the landing page before any slot spin; none depends on `phase === 'result'` or any session state. The board is not optional scaffolding around the detail page, and the detail page is not a modal.
  2. **Result-gated writing, no landing-page entry point**: Writing a Random Log still requires an active generated Result, exactly as ADR-011 established (`Result` → "랜덤 로그 남기고 1회 더 뽑기" / "랜덤 로그 남기기" → `GuestbookComposer`). The Right Rail's only affordance into the write flow is none at all — it links to the read surface, never opens `GuestbookComposer`.
  3. **Once-per-Result client UX guardrail**: A Result may be logged at most once within the current mounted client session, tracked via `loggedRouteIds` (a plain `Set<string>` in `MainExperience`'s React state, keyed on `RouteResult.id`). Deliberately **not** persisted to `sessionStorage`, not a DB column, and not a uniqueness constraint — `state.result` itself is never persisted across a reload, so there is nothing to guard after one.
  4. **Writing eligibility separated from reroll reward eligibility**: These were previously one CTA switched on `rerollReward` alone (`'locked'` was the *only* branch that opened `GuestbookComposer`), which made the composer permanently unreachable once the reward reached `'consumed'`. `ResultSheet` now renders two independent CTAs — a Random Log CTA driven by `hasLoggedCurrentResult`, and a reroll CTA driven by `rerollReward` alone, hidden entirely (not disabled) outside `'available'`. `GuestbookComposer` receives a `rewardEligible` prop from the same `rerollState` (never a duplicated state machine) and **snapshots** it into local state at submit time — reading the live prop in the success view is wrong, because a reward-granting submission synchronously flips `rerollReward` in the same React batch that shows the success screen, which would make even a real reward-unlock report as non-reward after the fact.
  5. **One rewarded reroll per browser-tab session, unchanged**: `rerollSession.ts` (`unlockRerollReward` / `consumeRerollReward`) was not modified. Its existing guard — refuse to re-unlock once `'consumed'` — is what makes a later Random Log submission safe to allow at all: logging Result B can never grant a second reward, without any new code enforcing it.
  6. **Public identifier reuses the existing UUID, behind a data-access boundary**: `/random-log/[id]` uses `guestbook_entries.id` directly — no migration, no new `public_code` column. Safe because the table has no anon/authenticated RLS policy (server-only, `status='visible'`-filtered access) and a UUIDv4 is not sequential/enumerable. The detail page reaches the row through exactly one function, `getGuestbookEntryByPublicId` (`src/lib/database/guestbook.ts`), never an inline query, so a future move to a `shared_routes.share_code`-style short code changes only that function's internals.
  7. **Production character artwork remains deferred**: `GUESTBOOK_AVATARS` (`src/config/avatars.ts`) now holds the 10 real Kkumssi-family identities from the Figma handoff as stable ids (`mongmong`, `kkumdongi`, `nebeu`, `geumdori`, `kkumnuri`, `kkumdori`, `doreu`, `kkumbichi`, `eunsuni`, `kkumsuni`), replacing the earlier 4 generic placeholders — but every entry's `imageSrc` is left unset pending asset extraction; `badgeEmoji` is the structural fallback. `CharacterSelector` is a Hero preview + fixed 5×2 picker (all 10 visible at once, no carousel/scroll-arrows) built to accept `imageSrc` with no redesign once assets land. The `kkumdori` avatar entry is a distinct role from the static `Character/Main/Kkumdori` brand illustration already in `LeftSidebar.tsx` and must not be aliased to it.
  8. **Rendering freshness required an explicit fix**: `export const dynamic = 'force-dynamic'` is set on `/` and `/random-log`. Verified empirically via `pnpm build`: Next.js 16.3.2 does not infer dynamic rendering from an uncached `fetch()` alone on a route with no dynamic segment, so without this, both routes would statically freeze their Random Log data at build time. `router.refresh()` (called in `GuestbookComposer` immediately after a confirmed-successful POST) is the client-side trigger that makes a new submission visible on the current page without a manual reload — it re-renders Server Component data while explicitly preserving unaffected client state (Result reveal/minimize, composer state) and performing no navigation.
- **MVP Abuse Boundary (explicit, intentional)**: The once-per-Result rule and the one-reroll-per-session rule are both client-side UX guardrails, not security controls. `POST /api/guestbook` remains callable with any client-supplied `route_id`. A fresh browser tab/session can trivially re-earn the reward and re-log. No auth, device identity, reward ledger, DB uniqueness constraint, or API rate limiting was added — this is explicitly out of scope for this MVP, matching the existing no-login philosophy (ADR-011, ADR-017).
- **Explicitly deferred / not implemented**: comments, likes/ranking, profiles, edit/delete, social reactions, sharing on Random Log entries; GA4 events for any Random Log surface; production Figma character artwork extraction; a `public_code`-style identifier migration. None of these are documented as implemented anywhere else in this repo's docs.
- **Why**: Product review found that coupling write eligibility to reward eligibility silently deleted the write path forever once the one reward was spent — a real defect, not a design tradeoff. Separating the two into independent, minimally-scoped mechanisms (a session-local `Set`, an existing untouched reward guard, an explicit prop instead of implicit derivation) fixes the defect without introducing accounts, a ledger, or any new persistence tier.
- **Revisit when**: Product wants Random Log write frequency to scale beyond one-per-Result, wants genuine abuse prevention (rate limiting / auth), or approves production character artwork / a `public_code` identifier migration as new, reviewed scope.
