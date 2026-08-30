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
- **Decision**: Track clicks on outbound map links within the in-app Route Guide (`place_map_click`) as the Primary High-Intent Proxy Conversion. Map clicks on Today's Pick detail pages are tracked separately as `pick_map_click` (secondary travel-intent signal).
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
- **Status**: **Fixed (Supersedes legacy inline long receipt)**
- **Decision**: Result presentation adopts the 2-stage reveal flow (output slit peek cue followed 300–500ms after the peek cue is triggered by a front-facing centered `Result Card` modal overlay). The Result Card features three distinct action pathways:
  1. **Conversion (Primary)**: `“이 코스로 가보기”` → Transitions to the in-app `Route Guide`.
  2. **Referral (Secondary)**: `“내 루트 공유하기”` → Generates snapshot and short URL `/r/[shareCode]`.
  3. **Participation / Reward (Tertiary)**: `“랜덤 로그 남기고 1회 더 뽑기”` → Opens in-flow Visitor Log composer and unlocks 1 reroll upon server-verified DB save.
  - Result Card body is semantic React / DOM / CSS; glassmorphism is prohibited; slot machine remains stationary.
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

### ADR-015: 7-Day Static Today’s Pick with Preference-Seeding CTA
- **Status**: **Fixed**
- **Decision**: Maintain 7 curated spotlight spots as static TypeScript data (`src/data/picks.ts`) mapped to the 7-day campaign schedule (Asia/Seoul). The Landing preview features pixel artwork and Kkumssi character decoration; clicking opens `/pick/[slug]` with real photography. The primary CTA `“이 분위기로 여행 뽑기”` navigates to Landing with Q2 pre-seeded to the pick's `recommendedPreference`.
- **Why**: Drives content discovery and sparks spontaneous travel interest without incurring CMS/Supabase overhead or giving users planning decision fatigue.
- **Revisit when**: Daily dynamic CMS management is required for long-running evergreen campaigns.

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

### ADR-022: SlotOutputLayer Reserved as a Sibling of SlotVisualFrame
- **Status**: **Tentative** (reserved, not yet implemented)
- **Decision**: The future Result/Ticket output reveal (ADR-008's output slit peek cue) will mount inside `SlotStage` as a **sibling** of `SlotVisualFrame` — never as a descendant of `LogicalCanvas` or inside the frame's clipped bounds.
- **Why**: `SlotVisualFrame` uses `overflow: hidden` (ADR-020) to fix an empty-scroll-tail bug. ADR-008's reveal needs to extend below the physical chassis; nesting it inside the frame would force a permanent clip that contradicts that contract. A sibling mount is unaffected by the frame's overflow.
- **Revisit when**: The Result/Ticket Output System is implemented (see `docs/PROJECT_STATE.md` → Next Recommended Work).
