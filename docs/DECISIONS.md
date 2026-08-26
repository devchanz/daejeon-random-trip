# Architecture & Product Decision Records (ADR)

This document tracks fundamental product and architectural decisions for the Daejeon Random Trip MVP.

---

### ADR-001: Controlled Random Travel vs. Pure Independent Randomness
- **Status**: **Fixed**
- **Decision**: Route generation follows a structured funnel (`Preference -> Zone -> Candidate Filtering -> Route Template -> Place Selection -> Coherent Route`) rather than independently selecting unrelated random spots.
- **Why**: Pure randomness produces nonsensical itineraries (e.g., three consecutive cafes or distant stops across the city). Controlled randomness ensures physical plausibility and structured routing while preserving the excitement of surprise. (Note: Adopting this product mechanism is a fixed decision, but whether it drives higher marketing conversion than alternative models is an open hypothesis to measure via live campaign telemetry).
- **Revisit when**: If user feedback demands fully open-ended exploration across unlimited categories.

---

### ADR-002: Separation of Recommendation Engine and Visual Slot Animation
- **Status**: **Fixed**
- **Decision**: The recommendation engine (`src/lib/random`) computes the complete `RouteResult` first; an adapter layer maps the variable-stop route to the visual slot reel display format. The slot machine UI is solely an animated presentation layer that stops on the computed result.
- **Why**: Decoupling prevents visual rendering bugs from corrupting itinerary logic, keeps stop counts independent of visual reel counts, and ensures independently testable route logic (where randomness can be seeded or injected for automated testing). READY reels display presentation-only placeholder items without exposing itinerary data early.
- **Revisit when**: Never for the core engine separation; visual interaction styles and adapter mapping may evolve independently.

---

### ADR-003: No Runtime LLM for Route Generation
- **Status**: **Fixed**
- **Decision**: The MVP uses static curated templates, candidate place data, and controlled random selection/validation logic instead of calling runtime LLM APIs.
- **Why**: Eliminates runtime API costs, latency (crucial for quick slot spin feel), hallucinated locations, and rate-limiting failure modes during marketing campaigns.
- **Revisit when**: Future phases require dynamic natural-language storytelling or personalized multi-city generative guides.

---

### ADR-004: Primary Conversion Metric as a High-Intent Proxy
- **Status**: **Fixed**
- **Decision**: Track clicks on the primary route execution CTA (`route_map_click` / `“이 코스로 가보기”`) as the primary campaign conversion proxy.
- **Why**: Physical visits to Daejeon cannot be directly tracked or verified by a lightweight web landing page without intrusive native app permissions or physical beacons.
- **Revisit when**: Offline verification partnerships (e.g., stamp tours, merchant QR codes) become available.

---

### ADR-005: Strict PII and Free-Text Prohibition in Analytics
- **Status**: **Fixed**
- **Decision**: Do not explicitly collect or send RANDOM LOG nicknames, message strings, IP addresses, or arbitrary user input to Google Analytics 4 as custom parameters or user properties.
- **Why**: Implements a privacy-by-design architecture to reduce accidental PII leakage and support legal compliance obligations (such as PIPA and GDPR).
- **Revisit when**: Never (permanent privacy rule).

---

### ADR-006: Separation of Product Policies from UI Hard-coding
- **Status**: **Fixed**
- **Decision**: Business rules (reroll limits, duration options, preference types, zone weighting, Seongsimdang inclusion rules) must live in `src/config/` and `src/data/`, not inside React components.
- **Why**: Enables rapid policy adjustments during marketing campaigns without risky code refactors or UI regressions.
- **Revisit when**: Never.

---

### ADR-007: Two-Question Interaction Flow & State Progression (v0.4)
- **Status**: **Tentative**
- **Decision**: Present two sequential setup questions (`Q1`: Duration, `Q2`: Preference) before transitioning through `READY` → `SPIN` → `RESULT`. Primary Spin Action is `“여행 뽑기!”`. The slot lever is strictly a visual feedback/interaction mechanism and must not become a required separate action or secondary primary CTA.
- **Why**: Minimizes setup friction while capturing the minimum essential parameters needed for route template selection. Keeps the core interaction functional regardless of lever animation support.
- **Revisit when**: Analytics show significant drop-off between Q1 and Q2, or user testing demonstrates a need for alternative filter flows.

---

### ADR-008: CTA Hierarchy and Centered Focus Result Card Overlay (Superseding Inline Result Sheet)
- **Status**: **Fixed**
- **Decision**: The inline long vertical receipt/paper pushdown model is explicitly deprecated. Result presentation adopts a 2-stage reveal flow:
  1. **Physical Peek Cue**: When sequential reel spin finishes (Reel 1 → Reel 2 → Reel 3 → short final beat), a short ticket/paper peek animation emerges from the slot output slit as a tactile dispensing cue. The slot machine itself remains completely stationary.
  2. **Centered Focus Overlay**: 300–500ms after the peek cue is triggered, the landing page receives a slight dim and subtle backdrop blur, and the front-facing **Result Card** (modal overlay) appears centered in the viewport.
  - **Result Card Contents**: Route title (e.g., `“오늘은 대흥동 먹방 코스!”`), STOP 1~4 details, and optional mission memo.
  - **CTA Hierarchy**:
    - **Primary CTA**: `“이 코스로 가보기”` (Map / Navigation link — primary proxy conversion).
    - **Secondary CTA**: `“내 루트 공유하기”` (Opens RANDOM LOG note composer).
    - **Tertiary CTA**: `“다시 뽑기”` (Reroll).
  - **Visual & Engineering Guardrails**:
    - Result Card body must be constructed in semantic React / DOM / CSS (never an image asset).
    - **No Glassmorphism**: Preserves the tactile retro / Korean Y2K / paper / arcade aesthetic (solid borders, tactile shadows, retro paper textures, stamps, washi tape). Modern translucent frosted glassmorphism is strictly prohibited.
    - Backdrop blur is applied subtly and lightly to the background page solely to focus visual attention on the Result Card.
- **Why**: Long vertical receipt extrusion pushed the slot machine out of the viewport, created awkward scroll jumps, and degraded mobile usability. The centered focus overlay brings immediate, crisp legibility to the generated itinerary and high-intent CTAs. The output slit peek cue retains the physical "ticket dispensing" metaphor without in-flow document expansion.
- **Revisit when**: Post-launch campaign analytics or A/B testing suggest refinements to overlay dismissal/docking behavior or revised CTA copy.

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

### ADR-011: RANDOM LOG & Shared Route Snapshot Model
- **Status**: **Tentative**
- **Decision**: Implement RANDOM LOG as a shared-route snapshot mechanism using neutral domain terminology (not a new feed product, operator curation, or recommendation algorithm). User clicks `“내 루트 공유하기”` to open/activate the composer (presentation is flexible by viewport/layout, e.g. desktop activation vs. mobile scroll/open, and is not constrained to a modal or drawer); submitting attaches the active `RouteResult` snapshot alongside a nickname and short message. Likes/reactions are omitted for MVP. GA4 telemetry event names (`guestbook_open`, `guestbook_submit`) remain governed by `docs/ANALYTICS.md`.
- **Why**: Keeps friction low and social proof high without interrupting the primary travel funnel or adding backend feed complexity.
- **Revisit when**: Spam/moderation issues arise, or Supabase persistence requirements shift.

---

### ADR-012: Approved Visual v4 Base & Visual Skin / Asset Boundaries
- **Status**: **Tentative (Approved Visual Base)**
- **Decision**: Adopt Visual v4 ("Korean Y2K Personal Web × Random Travel Toy" structure: Header `DAEJEON RANDOM TRIP`, Left Sidebar `DAEJEON GUIDE` / `TRIP MIX`, Center `Setup Area` → `Slot Anchor` → `Result Overlay`, Right Sidebar `DAEJEON PICK` / `RANDOM LOG`) as the approved visual base for implementation. Visual skin styling (colors, typography, borders, shadows, paper textures, stickers, slot chassis, reel easing) must remain decoupled via semantic tokens. Direct legacy vocabulary (`Profile`, `BGM`, `Guestbook`, `Minihome`, `TODAY / TOTAL`) is explicitly avoided. Dreamdori/Kkumdori must remain an independent image asset/component (using the approved provided PNG as truth, to be integrated into `public/` when the asset package is added). Full-screen image slicing is prohibited.
- **Why**: Allows continuous visual polish and responsive adaptations without tangling presentation details with underlying route engine logic, accessibility, or asset licensing.
- **Revisit when**: Design team delivers future theme skins or asset updates.
