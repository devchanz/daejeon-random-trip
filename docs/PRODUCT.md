# Product Contract: Daejeon Random Trip

## 1. Mission & Objective
- **Mission**: Help move people to Daejeon through a real performance-marketing campaign.
- **Project Scope**: A lightweight MVP to deploy a live landing page, acquire real marketing traffic, measure user behavior with GA4, and analyze campaign conversion.
- **Core Value Proposition**: Reduce travel-planning friction by offering **Controlled Random Travel** that generates coherent short-trip routes within Daejeon (local itinerary for time spent in Daejeon).

---

## 2. Problem Statement (Synthesized Framing)
**Synthesized Problem Hypothesis**:
Potential visitors often experience decision fatigue when planning short trips—sorting through numerous recommendations, coordinating schedules, and assembling individual stops into a coherent route. The product hypothesis is that providing a low-friction, curated random route generator reduces planning hesitation and encourages spontaneous local exploration in Daejeon.

---

## 3. Product Mechanism: Controlled Random Travel
This product does not generate pure, unconstrained random noise. Instead, it follows a structured recommendation flow:

```mermaid
flowchart LR
    A[User Preference] --> B[Zone Selection]
    B --> C[Zone Candidate Filtering]
    C --> D[Route Template Selection]
    D --> E[Place Selection & Randomization]
    E --> F[Coherent Route Result]
```

- **Zone**: A walkable/travelable neighborhood or tourism cluster (initial focus centered around Daejeon Station / old downtown).
- **Engine vs. UI**: The **Recommendation Engine** handles filtering, random selection, template matching, and route validation. The **Slot Machine** is solely an engaging visual interaction layer.
- **Flexible Stops**: Route stop count is flexible across templates rather than hard-coded to a fixed number.

---

## 4. Current UX Direction (Tentative v0.4)

### Setup & Interaction Flow
1. **Q1 (Duration)**: Local travel time in Daejeon (`Half Day` / `Full Day` — representing local time in Daejeon, not origin travel time)
2. **Q2 (Preference)**: Travel preference (`Anything` / `Food` / `Walk` / `Photo`)
3. **READY**: Transition into spin state.
4. **SLOT SPIN**: Visual reel animation matching the selected criteria.
5. **RESULT**: Appears **inline below the slot** once reels finish spinning.
6. **PRIMARY CTA**: Actionable route execution step (`“이 코스로 가보기”`).
7. **SECONDARY ACTIONS**: Share route or Reroll.

### Core UX Principles
- **Step-by-step simplicity**: One question at a time; avoids feeling like a tedious multi-field form.
- **Low-friction**: Avoids unnecessary intermediate "Confirm" or "Next" buttons between simple choices while keeping user progression clear.
- **Slot stability**: Minimizes unexpected layout shift across Q1, Q2, and READY so the interaction remains visually anchored.
- **Inline presentation**: The result unfolds inline below the slot rather than locking the screen with a permanent blocking modal.
- **CTA Hierarchy**:
  - **Primary**: `“이 코스로 가보기”` (Start / Map / Go with this course — high-intent proxy)
  - **Secondary**: `“내 루트 공유하기”` (Share my route)
  - **Tertiary**: `“다시 뽑기”` (Reroll)
- **Guestbook**: Secondary engagement feature; does not interrupt or block the core travel funnel.

---

## 5. Scope Boundaries

### In-Scope (MVP)
- Landing page with responsive retro/Y2K desktop 3-column identity (current design direction).
- Controlled random route generation engine (candidate filtering, random selection, template matching, route validation).
- Interactive slot machine reel animation.
- Dynamic route display with stop details and mission.
- Simple guestbook (nickname + short message + auto-attached route snapshot; no user signup).
- GA4 event tracking and campaign parameter collection.
- Primary proxy conversion CTA linking out to navigation/maps.

### Explicitly Out-of-Scope (MVP)
- Runtime LLM / AI-generated travel routes.
- User account creation, authentication, or profile management.
- Direct physical GPS check-in or visit verification.
- Citywide comprehensive tourism database (initial focus limited to key clusters).
- Whole-image PNG page slicing (UI elements must be semantic DOM/code).
- Manual route transcription in the guestbook (must be automated via snapshot).

---

## 6. Decisions & Hypotheses Status

| Item | Status | Details |
| :--- | :--- | :--- |
| **Controlled Random Travel** | **Fixed Product Decision** | Structured recommendation flow separated from visual reel animation. (Mechanism choice is fixed; conversion effectiveness is an unvalidated hypothesis to measure via campaign). |
| **Proxy Conversion Model** | **Fixed Measurement Decision** | Map navigation click (`route_map_click`) serves as high-intent proxy metric for physical travel interest. |
| **No Runtime LLM** | **Fixed Architecture Decision** | Static curated templates, candidate place data, and controlled random selection for speed, cost control, and reliability. |
| **Target Demographic (20–30s)** | *Working Hypothesis* | Operational target for marketing copy/ads; not a validated product constraint. |
| **v0.4 2-Question Flow** | *Tentative* | Subject to adjustment based on user testing and campaign funnel drop-off data. |
| **Initial Zone Coverage** | *Tentative* | Centered on Daejeon Station / old downtown; expandable post-MVP. |

---

## 7. Success Behavior & Measurable Signals
- **Setup Funnel**: User progression through Q1/Q2 to READY produces measurable completion and drop-off rates in GA4.
- **Perceived Latency**: The recommendation engine and slot animation deliver a coherent route with acceptable perceived latency without blocking runtime delays.
- **Primary Conversion Proxy**: The rate of clicks on the primary CTA (`route_map_click` / `“이 코스로 가보기”`) provides an actionable signal of travel intent to evaluate performance marketing campaigns.
- **Social Engagement & Privacy**: Route sharing (`route_share_click`) and guestbook submissions operate smoothly with zero PII or free-text leakage into analytics.
