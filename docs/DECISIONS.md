# Architecture & Product Decision Records (ADR)

This document tracks fundamental product and architectural decisions for the Daejeon Random Trip MVP.

---

### ADR-001: Controlled Random Travel vs. Pure Independent Randomness
- **Status**: **Fixed**
- **Decision**: Route generation follows a structured funnel (`Preference -> Zone -> Candidate Filtering -> Route Template -> Place Selection -> Coherent Route`) rather than independently selecting unrelated random spots.
- **Why**: Pure randomness produces nonsensical itineraries (e.g., three consecutive cafes or distant stops across the city). Controlled randomness ensures physical plausibility and high-quality user experience while preserving the excitement of surprise.
- **Revisit when**: If user feedback demands fully open-ended exploration across unlimited categories.

---

### ADR-002: Separation of Recommendation Engine and Visual Slot Animation
- **Status**: **Fixed**
- **Decision**: The recommendation engine (`src/lib/random`) computes the complete `RouteResult` first; the slot machine UI is solely an animated presentation layer that stops on the computed result.
- **Why**: Decoupling prevents visual rendering bugs from corrupting itinerary logic and ensures deterministic, testable route calculations.
- **Revisit when**: Never for the core engine separation; visual interaction styles may evolve independently.

---

### ADR-003: No Runtime LLM for Route Generation
- **Status**: **Fixed**
- **Decision**: The MVP uses static curated templates and candidate place data with deterministic matching logic instead of calling runtime LLM APIs.
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
- **Decision**: Never send guestbook nicknames, message strings, or arbitrary user input to Google Analytics 4.
- **Why**: Adherence to privacy standards, GDPR/PIPA compliance, and prevention of accidental PII leakage into analytics pipelines.
- **Revisit when**: Never (permanent privacy rule).

---

### ADR-006: Separation of Product Policies from UI Hard-coding
- **Status**: **Fixed**
- **Decision**: Business rules (reroll limits, duration options, preference types, zone weighting, Seongsimdang inclusion rules) must live in `src/config/` and `src/data/`, not inside React components.
- **Why**: Enables rapid policy adjustments during marketing campaigns without risky code refactors or UI regressions.
- **Revisit when**: Never.

---

### ADR-007: Two-Question Interaction Flow (v0.4)
- **Status**: **Tentative**
- **Decision**: Present two sequential setup questions (Q1: Half day / Full day, Q2: Anything / Food / Walk / Photo) before transitioning to the READY and SPIN states.
- **Why**: Minimizes setup friction while capturing the minimum essential parameters needed for route template selection.
- **Revisit when**: Analytics show significant drop-off between Q1 and Q2, or user testing demonstrates a need for budget or transportation filters.

---

### ADR-008: CTA Hierarchy and Inline Result Presentation
- **Status**: **Tentative**
- **Decision**: Primary CTA is `“이 코스로 가보기”`, Secondary is `“내 루트 공유하기”`, Tertiary is `“다시 뽑기”`. Result unfolds inline below the slot rather than inside a blocking modal.
- **Why**: Directs users toward the main conversion action while keeping the screen accessible without modal trap frustration.
- **Revisit when**: Stakeholder reviews or A/B testing show modal layouts or alternate CTA copy yield higher engagement.

---

### ADR-009: Target Audience Assumption (20–30s)
- **Status**: **Tentative**
- **Decision**: Treat the 20–30s demographic as a working marketing campaign segment rather than a hard product constraint.
- **Why**: Marketing copy and visual motifs (Y2K retro) appeal strongly to this group, but the underlying product value (effortless travel discovery) applies to wider audiences.
- **Revisit when**: Post-campaign GA4 demographics and conversion reports reveal actual visitor distribution.

---

### ADR-010: Initial Geographic Cluster Scope
- **Status**: **Tentative**
- **Decision**: Seed candidate place data primarily around Daejeon Station and the old downtown district (Eunhaeng-dong / Daeheung-dong).
- **Why**: High density of walkable attractions, dining, and transit access simplifies MVP travel viability.
- **Revisit when**: Expanding the tourism database to Yuseong, Dunsan, or Daedeok clusters in subsequent iterations.

---

### ADR-011: Guestbook Route Snapshot Model
- **Status**: **Tentative**
- **Decision**: Allow users to post a guestbook note with nickname, short message, and an automatically attached `RouteResult` snapshot without requiring account signup.
- **Why**: Keeps friction low and social proof high, connecting visitor commentary directly with generated itineraries.
- **Revisit when**: Spam/moderation issues arise, or Supabase persistence requirements shift.

---

### ADR-012: DOM Code vs. Static Pixel Asset Boundary
- **Status**: **Tentative**
- **Decision**: Render layout, responsive structures, interactive reels, and typography in semantic DOM/Tailwind; reserve static image assets (`public/`) for character art (Dreamdori/Kkumdori), complex illustrations, and stickers.
- **Why**: Balances the nostalgic pixel-art visual identity with accessibility, fast loading, and responsive layouts across screen sizes.
- **Revisit when**: Design team delivers finalized asset packages and art direction.
