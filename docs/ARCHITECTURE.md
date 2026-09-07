# Architecture Contract: Daejeon Random Trip

## 1. Technology Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Linter**: ESLint 9
- **Package Manager**: pnpm (tracked via `pnpm-workspace.yaml`, `packageManager`)
- **Runtime Target**: Node.js (tracked via `.node-version`)
- **Hosting Target**: Vercel
- **Persistence Target**: Supabase (PostgreSQL)
- **Telemetry**: Google Analytics 4 (GA4)

---

## 2. Directory Blueprint & Routing Architecture

```
src/
├── app/
│   ├── layout.tsx                # Global root layout, font tokens, metadata
│   ├── page.tsx                  # Main Landing (IA: Left, Center Experience, Right); force-dynamic (ADR-025)
│   ├── random-log/
│   │   ├── page.tsx              # Public Random Log board (list + cursor "Load more"); force-dynamic (ADR-025)
│   │   └── [id]/
│   │       └── page.tsx          # Public Random Log detail (noindex), via getGuestbookEntryByPublicId
│   ├── r/
│   │   └── [shareCode]/
│   │       └── page.tsx          # Dedicated shared route view (noindex)
│   └── api/                      # Route handlers for share snapshot & guestbook API boundaries
│       ├── guestbook/
│       │   └── route.ts          # Input validation, sanitization, DB insert; GET supports cursor pagination
│       └── share/
│           └── route.ts          # Snapshot validation, shareCode generation & DB insert
├── components/
│   ├── experience/               # Core slot machine, setup, result overlay
│   │   ├── SetupArea.tsx         # Q1, Q2, and READY status
│   │   ├── SlotAnchor.tsx        # Stationary slot chassis & animated reels
│   │   ├── reelVisuals.ts        # Settled-reel activity artwork, mapped by route slot (presentation layer)
│   │   ├── ResultArea.tsx        # Centered focus Result Card overlay
│   │   └── ResultSheet.tsx       # Result Card body; independent Random Log / reroll CTA renderers (ADR-025)
│   ├── guide/                    # In-app structured route breakdown
│   │   ├── RouteGuideModal.tsx   # Portal-mounted modal (opened from the Result Card and /r/[shareCode])
│   │   └── RouteGuideTimeline.tsx# Ordered stop timeline, stay durations, tips, external map links
│   ├── share/                    # Referral / shared-route landing presentation
│   │   └── SharedRouteView.tsx   # /r/[shareCode] snapshot view + not-found state
│   ├── guestbook/                # Random Log writing form (Result-gated; no landing-page entry point)
│   │   ├── GuestbookComposer.tsx # In-flow modal opened from the Result Card; reward-eligible copy via a prop, never live reroll state (ADR-025)
│   │   └── CharacterSelector.tsx # Hero preview + fixed 5x2 picker over the 10 Kkumssi-family identities (ADR-025)
│   ├── random-log/               # Random Log public read surfaces (ADR-025)
│   │   ├── RandomLogRightRailPreview.tsx # Right sidebar live preview (top 3), reads the DB layer directly
│   │   ├── RandomLogList.tsx     # /random-log board: initial entries + client-owned "Load more"
│   │   ├── RandomLogCard.tsx     # Board card: character, nickname, timestamp, message excerpt, trip tags
│   │   ├── RandomLogDetail.tsx   # /random-log/[id] detail view + not-found state
│   │   ├── RandomLogAvatarBadge.tsx # Shared avatar_id -> imageSrc/badgeEmoji renderer
│   │   └── randomLogLabels.ts    # Zone/duration/preference label + KST-pinned timestamp helpers
│   ├── editorial/                # Feature-name-agnostic editorial banner shell (ADR-028)
│   │   └── EditorialSpotlightCard.tsx # Compact header + banner + optional tags; perched mascot; optional link
│   ├── sidebar/                  # MY PROFILE / editorial spotlight / VISITOR LOG (Random Log preview) widgets
│   │   ├── LeftSidebar.tsx       # MY PROFILE, TODAY IS…, BGM PLAYING widgets
│   │   └── RightSidebar.tsx      # EditorialSpotlightCard (heading="TODAY'S PICK") + RandomLogRightRailPreview
│   └── layout/                   # Global shell: header, footer, decorative layer
│       ├── Header.tsx            # Retro browser-chrome bar; the address-bar pill doubles as a site-wide Home link
│       ├── Footer.tsx            # Minimal landing footer
│       └── AmbientDecorations.tsx# Decorative sparkle/cloud pixel elements
├── lib/
│   ├── random/                   # Controlled Random Travel engine, duration budgeting & template matching
│   ├── database/                 # Supabase client wrapper & server data access layer
│   └── analytics/                # GA4 event tracking helpers and parameter sanitizers
├── config/                       # Modifiable policies, avatar definitions, duration budgets
│   ├── visualAssets.ts           # Central visual asset registry: 36 stable keys -> public paths (ADR-027)
│   └── avatars.ts                # 10 frozen Random Log identities joined to character.avatar.* asset keys
├── data/                         # Static seed data: editorial.ts, picks.ts, places.ts, zones.ts, templates.ts
└── content/                      # Static copy, descriptions, and user-facing strings
public/                           # Static assets: pixel art, character illustrations, audio
```

---

## 3. Data Tiering & Persistence Architecture

The data architecture strictly separates ephemeral session computations from persistent community assets:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STATIC DATA TIER (src/data/, src/config/)                                │
│ - Editorial rail banners (editorial.ts) — validity window + daily rotation│
│ - Visual asset registry (config/visualAssets.ts) — 36 stable asset keys   │
│ - Place Candidates, Zones, and Route Templates                           │
│ - Product Policies (Duration budgets, reroll limits, weights)            │
├──────────────────────────────────────────────────────────────────────────┤
│ CLIENT / ANONYMOUS SESSION TIER (sessionStorage / Browser Session)       │
│ - Active RouteResult (Variable 1–4 stops, duration calculation)          │
│   + whether it has been logged — tab-scoped trip session (ADR-043).      │
│   Q1/Q2 are NOT persisted separately: a restored session derives its     │
│   duration/preference from the stored RouteResult itself.                │
│ - In-App Route Guide State                                               │
│ - Reroll Reward State (locked → available → consumed)                    │
│   (Maintained across tab refreshes during active session; no user login) │
├──────────────────────────────────────────────────────────────────────────┤
│ PERSISTENT DATABASE TIER (Supabase via Server/API Boundary)              │
│ - guestbook_entries (Community logs + moderation status: visible/hidden) │
│ - shared_routes (Immutable snapshots referenced by /r/[shareCode])       │
└──────────────────────────────────────────────────────────────────────────┘
```

> **Formal Data Contract**: Detailed entity definitions and database schemas are formally specified in [`docs/DATA_MODEL.md`](./DATA_MODEL.md).

---

## 4. Sequence & Growth Loop Flows

### 4.1 Core Conversion & Route Guide Flow
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Landing UI
    participant Engine as lib/random (Engine)
    participant Adapter as Visual Reel Adapter
    participant Slot as Slot Visuals & Slit
    participant Modal as Result Card Modal
    participant Guide as In-App Route Guide
    
    User->>UI: Select Q1 (Duration) & Q2 (Preference)
    UI->>Slot: Show placeholder READY reels (no route data leaked)
    User->>UI: Click "여행 뽑기!"
    UI->>Engine: generateRoute({ duration, preference })
    Engine->>Engine: Filter Places -> Match Template -> Validate Duration Budget
    Engine-->>Adapter: Ephemeral RouteResult (variable stops)
    Adapter-->>UI: Mapped 3-reel visual display data
    UI->>Slot: Start reel spin → Reel 1 / Reel 2 / Reel 3 sequential stops → final beat
    Slot->>Slot: Trigger short ticket/paper peek cue at output slit
    UI->>Modal: Slight dim + subtle blur (300–500ms after the peek cue is triggered)
    Modal-->>User: Display centered Result Card (3 CTAs)
    User->>Modal: Click Primary CTA ("이 코스로 가보기")
    Modal->>Guide: Transition to In-App Route Guide
    Guide-->>User: Display timeline, stay durations, transit times, and map links
    User->>Guide: Click outbound place map link (place_map_click)
```

### 4.2 Participation & 1-Time Reroll Reward Flow
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Modal as Result Card
    participant Comp as Visitor Log Composer
    participant API as Server API (/api/guestbook)
    participant DB as Supabase (guestbook_entries)
    participant Session as Client Reroll State (sessionStorage)
    participant Slot as Slot Machine

    User->>Modal: Click "랜덤 로그 남기고 1회 더 뽑기"
    Modal->>Comp: Open Composer (Avatar, Nickname, Message, Auto-attached Route)
    User->>Comp: Select Kkumssi Avatar, enter Nickname & Message
    Comp->>API: POST /api/guestbook (Payload)
    API->>API: Server validation & content sanitization
    API->>DB: INSERT guestbook_entries
    DB-->>API: Insertion OK
    API-->>Comp: Success Response (201 Created)
    Comp->>Session: Unlock Reroll Reward (locked -> available)
    Session-->>Slot: Update Spin Button to Active Reroll State
    User->>Slot: Click Reroll Spin (route_reroll)
    Slot->>Session: Mark Reroll Consumed (available -> consumed)
    Slot->>Slot: Execute 2nd Spin (Final route generated)
```

> **After the reward is consumed (ADR-025)**: the 2nd (or any later) Result may still be logged — writing is gated on having an active Result, not on `Session`'s reward state. The Composer opens with non-reward copy ("랜덤 로그 남기기"), the write succeeds and appears on the public read surfaces below, and `Session` stays `consumed` — `unlockRerollReward`'s existing guard refuses to re-unlock, so this can never grant a second reward. The reroll CTA itself is hidden (not shown disabled) once `consumed`.
>
> **Public read surfaces are passive** and intentionally have no sequence diagram of their own: the Right Rail preview, `/random-log`, and `/random-log/[id]` are plain server-rendered reads of `guestbook_entries`, available before any spin, requiring no client action beyond navigation.

### 4.3 Referral Share Loop
```mermaid
sequenceDiagram
    autonumber
    actor User
    actor Friend
    participant Modal as Result Card
    participant API as Server API (/api/share)
    participant DB as Supabase (shared_routes)
    participant Share as Web Share / Clipboard
    participant Page as /r/[shareCode] Page
    participant Landing as Main Landing

    User->>Modal: Click "내 루트 공유하기"
    Modal->>API: POST /api/share (Route Snapshot)
    API->>API: Validate Route Snapshot schema
    API->>API: Generate unique shareCode (e.g., "F7k2Ma9Q")
    API->>DB: INSERT shared_routes (id: UUID, share_code: "F7k2Ma9Q", snapshot)
    DB-->>API: Insertion OK
    API-->>Modal: Return share URL (/r/F7k2Ma9Q)
    Modal->>Share: Trigger Web Share API (fallback: link copy)
    Share-->>Friend: Friend receives URL https://domain/r/F7k2Ma9Q
    Friend->>Page: Visit /r/[shareCode]
    Page-->>Friend: Display shared route, stops, mission, and CTAs
    Friend->>Page: Click Primary CTA ("나도 여행 뽑아보기")
    Page->>Landing: Navigate to Main Landing (Referral Acquisition)
```

---

## 5. Key Architectural Boundaries & Guardrails

### 1. Engine, Visual Reel Adapter, and READY Reel Separation
- The `lib/random` engine calculates the logical `RouteResult` independently of UI animations (randomness can be seeded or injected for automated testing).
- A visual adapter layer maps variable-stop `RouteResult` data into the visual reel display format consumed by the slot presentation.
- **READY State Guardrail**: Content displayed on reels in the READY state is presentation-only idle/placeholder content. It must **never** expose or leak the generated `RouteResult` before spin completion.
- The UI reveals the detailed itinerary via a 2-stage presentation only after all reels stop and the final beat finishes: (1) a brief ticket/paper peek cue at the slot output slit, followed (300–500ms after the peek cue is triggered) by (2) the front-facing centered Result Card overlay against a lightly dimmed/blurred backdrop.

### 2. Spin Action vs. Visual Lever Mechanism
- The fixed product behavior is the **Spin Action** (`“여행 뽑기!”`) and its corresponding state transition (`READY` → `SPIN` → `RESULT`).
- The lever is strictly an engaging visual interaction / feedback mechanism.
- The application must function reliably if lever animation fails, lever assets are changed, or the lever is removed in a future skin.
- The lever must **never** become a separate required action, a blocking prerequisite, or a second primary CTA.

### 3. Stationary Slot Anchor Boundary
- The Slot Anchor remains **completely stationary** across all lifecycle states (`Q1`, `Q2`, `READY`, `SPIN`, `RESULT`, `ROUTE_GUIDE`).
- No vertical translation, DOM pushing, or layout displacement occurs upon result generation.
- The output slit serves strictly as a physical reveal cue (a brief peek animation).

### 4. Result Card & Route Guide DOM Architecture
- All modal dialogs (`Result Card`, `Guestbook Composer`) and views (`Route Guide`, `/guestbook`, `/r/[shareCode]`) must be constructed in **semantic React / DOM / CSS**. Monolithic sliced image layouts are strictly prohibited.
- **Glassmorphism Prohibition**: Modals and cards must retain the approved retro / Korean Y2K / paper / arcade aesthetic (solid borders, tactile shadows, retro paper textures, stamps, washi tape). Modern frosted glassmorphism is prohibited.
- Backdrop blur is applied subtly and lightly (`backdrop-blur-sm` / slight dim) solely to direct visual focus.

### 5. Character Asset Boundary
- Character illustrations (e.g., Kkumdori / 꿈돌이 and Kkumssi Family) must remain **independent image assets/components**.
- Do **not** bake character artwork directly into panel, slot chassis, or background wallpaper artwork.
- The approved character assets in `public/` are the authoritative source of truth, addressed through `src/config/visualAssets.ts` (see boundary 16).
- **Asset identity is not application identity.** The 10 Random Log avatar ids (`mongmong`, `kkumdongi`, `nebeu`, `geumdori`, `kkumnuri`, `kkumdori`, `doreu`, `kkumbichi`, `eunsuni`, `kkumsuni`) are persisted as `avatar_id` and are frozen. They are joined to `character.avatar.*` asset keys in `src/config/avatars.ts` and nowhere else, so re-exporting or renaming artwork can never reach the database, and renaming a Figma layer can never orphan a stored entry. `badgeEmoji` is retained as the structural fallback for any future identity whose artwork has not yet been exported.
- `character.avatar.kkumdori` (selectable guestbook variant) and `character.main.kkumdori` (static brand illustration in `LeftSidebar`) are distinct roles and must never be aliased to one another.

### 6. Duration Budgeting & Recommendation Engine Guardrails
- `src/lib/random` enforces duration budgets connected to Q1 choices (`half` vs. `full`).
- Route total travel time is calculated conceptually as: `∑ (Place Stay Durations) + ∑ (Inter-stop Travel Times)` and presented in casual, human-readable strings (`“약 4시간”`).
- Specific duration budget bounds are configurable in `src/config/` rather than hardcoded in engine logic; exact hour ranges will be calibrated once candidate place data is compiled.

### 7. Policy & Data Decoupling (No UI Hard-coding)
- **Product Policies** live in `src/config/`:
  - Maximum reroll limits
  - Available duration and preference choices
  - Zone eligibility rules
  - Special inclusion/weighting policies (e.g., Seongsimdang inclusion frequency)
  - Avatar list and duration budget thresholds
- **Places & Templates** live in `src/data/`.
- UI components must strictly consume configs and props; business constants must not be embedded directly into React components.

### 8. Persistence Layer & Server/API Access Boundary
- Persistent data interactions (`guestbook_entries`, `shared_routes`) are strictly encapsulated behind Server/API route handlers (`/api/guestbook`, `/api/share`) and `src/lib/database/`.
- UI components must **never** execute direct database writes or issue raw database queries.
- Reward rerolls are unlocked only after verified server-side validation and database insert success.

### 9. Editorial Rail Boundary (Revised Scope — ADR-015, superseded by ADR-028)
- A Right Rail editorial / visual banner only — not a detail-page route, not a discovery funnel, not a Q2-seeding mechanism.
- Managed entirely in static data (`src/data/editorial.ts`) without dynamic server-side CMS dependencies.
- **Feature-name-agnostic by construction.** The surface is currently labelled "TODAY'S PICK", but that string lives *only* in the `heading` prop passed from `RightSidebar` — never in a type, file path, id, or asset key. Renaming the feature must stay a one-string change.
- `EditorialItem` carries a required `kind` (`spot | theme | event | experience | campaign`). Different kinds share **one** presentation shell (`EditorialSpotlightCard`); `kind` describes an item and must not fork the layout into per-kind variants or tabs.
- Selection filters by validity window first (`activeFrom` inclusive, `activeUntil` **exclusive**); every eligible item is then browsable in seed order (ADR-038 replaced the original deterministic-per-Asia/Seoul-date rotation with a manual carousel, and ADR-042 added ~2s auto-advance on top of it). The first rendered item is still index 0 on both server and client, so there is no hydration mismatch; advancing is a client-only effect.
- A banner may optionally hyperlink (`href`, `external`) to a site related to the featured artwork/place/theme. No internal route or Q2 state is touched. No `href` is seeded in the current pass.
- `src/data/picks.ts` (`TodaysPickItem`, `TODAYS_PICKS = []`) is retained but referenced by no UI. The editorial rail deliberately does **not** reuse it: that model sits behind the recommendation-engine boundary and is shaped for a `/pick/[slug]` page that does not exist.

### 10. Analytics & Privacy Boundary
- Telemetry helpers in `src/lib/analytics/` sanitize and enforce safe non-PII parameters.
- Free-text strings (visitor nicknames, messages) and personal information (email, phone, demographics) are **never** transmitted to GA4.
- The application database does not collect or store persistent user IP profiles (while allowing transient infrastructure metadata processing for security and rate limiting).

### 11. Slot Visual Frame & Logical Canvas Separation
- `SlotVisualFrame` (`src/components/experience/SlotAnchor.tsx`) represents the physical visible slot machine footprint and participates in normal page layout flow. The original 600×500 asset coordinate system (`LogicalCanvas`) is absolutely positioned inside the frame and must never determine surrounding layout spacing (no negative-margin compensation).
- Verified geometry constants and formulas live in `src/components/experience/slotGeometry.ts`, not hardcoded inline in components. See ADR-020.

### 12. Ground Scenery Is Not Semantic Footer
- Decorative tower/city/foliage artwork anchored beneath the Visual Stage is Ground Scenery — structurally and semantically distinct from the `Footer` component. `Footer` is intentionally excluded from the initial landing Hero. See ADR-021.

### 13. SlotOutputLayer Reserved as a Sibling, Not a Descendant
- The future Result/Ticket output reveal (ADR-008) mounts inside `SlotStage` as a sibling of `SlotVisualFrame`, never inside `LogicalCanvas` or subject to the frame's `overflow: hidden` clip. See ADR-022.

### 14. Random Log: Public Read / Result-Gated Write / Reward Decoupling Boundary
- Random Log **reading** (Right Rail preview, `/random-log`, `/random-log/[id]`) is public and ungated — available before any spin, never conditioned on `phase === 'result'` or any session state.
- Random Log **writing** is gated on having an active generated Result (no landing-page write entry point) and capped at one submission per Result within the current mounted client session — a plain, unpersisted React state guardrail (`loggedRouteIds` in `MainExperience`), not a DB constraint.
- Writing eligibility and reroll reward eligibility (ADR-011) are **independent state machines** — never re-coupled into one CTA switch. `GuestbookComposer` receives reward context as an explicit prop (`rewardEligible`), and snapshots it at submit time rather than reading it live afterward, so its success copy always reflects what that specific submission actually granted.
- The `/random-log/[id]` public identifier reuses the existing `guestbook_entries.id` UUID directly (no migration, no new column), reached only through the `getGuestbookEntryByPublicId` data-access boundary — never an inline query — so the identifier scheme can evolve later without touching UI or routes.
- `export const dynamic = 'force-dynamic'` is required on `/` and `/random-log`: Next.js 16.3.2 does not infer dynamic rendering from an uncached `fetch()` alone on a route with no dynamic segment.
- See ADR-025 for the full contract and rationale, including the explicit MVP abuse-boundary scope (client UX guardrail, not a security control; no auth, device identity, reward ledger, DB uniqueness, or rate limiting).

### 15. Motion Preference: Shared Lifecycle Clock, CSS-Only Reduced Intensity
- The SPINNING → RESULT product lifecycle is driven exclusively by `setTimeout` beats in `MainExperience.tsx`, never by `animationend`/`transitionend` or any other coupling to CSS animation completion. `prefers-reduced-motion` selects **which timing table** drives that single lifecycle (`getMotionTimings()` in `motionConfig.ts`, returning `MOTION_TIMINGS` or `REDUCED_MOTION_TIMINGS`) — it must never select a shortened or skipped lifecycle.
- Visual motion intensity for `prefers-reduced-motion: reduce` is adjusted **only** in `src/app/globals.css`, inside the existing `@media (prefers-reduced-motion: reduce)` block, as `animation-duration` overrides on the same classes/keyframes normal motion uses. Reduced motion must reuse the existing reel DOM, track, and roll metaphor at lower velocity — introducing a distinct visual metaphor (e.g., a symbol-shuffle/crossfade system) for reduced motion is out of scope; the approved full-motion Slot animation is the single visual source of truth for both motion preferences.
- See ADR-026.

### 16. Visual Asset Registry Boundary (ADR-027)
- Every production image path resolves through `src/config/visualAssets.ts` — `VISUAL_ASSETS` (39 entries), `VisualAssetKey`, `visualAsset(key)`, and `VISUAL_ASSET_META`. Components must not hard-code `/assets/...` string literals.
- Enforces the separation: **Figma semantic frame → exported filename → stable code key → feature/component usage.** Each layer changes without touching the others; renaming a *feature* never requires renaming an asset.
- Keys are transcribed verbatim from the Figma Production manifest's per-asset `handoff` labels, so the registry mirrors a contract the design side authors rather than a locally invented naming scheme.
- Registry membership (39), Figma-exported registered asset count (34) and `public/assets/` file count (40) are **three different numbers** and must not be conflated in validation: 34 manifest-exported assets + 5 pre-existing production assets adopted for single-source-of-truth = 39 registered; the 40th file is `slot-shell.png`, present in `public/assets/` but referenced by no component and deliberately unregistered. Note also that an *export* is not necessarily a new *entry*: the closeout pass exported five assets but added only three keys, because `Setup/Preference/Food` and `Editorial/Banner/Tashu` were replacements overwritten in place under their existing keys and filenames.
- The path type and `VisualAssetKey` catch malformed paths and typo'd keys at compile time but cannot catch a **missing file** — a registry-path existence check (39/39) is therefore a required validation step alongside lint / typecheck / build.

### 17. Settled Slot Reel Content Boundary (Visual Detail Pass)
- The settled reels present **activity character artwork**, mapped by **route slot**, not by the drawn place: reel 0 = Meal → `character.activity.food`, reel 1 = Cafe → `character.activity.dessert`, reel 2 = Discovery/Preference → `character.activity.tashu` (`src/components/experience/reelVisuals.ts`).
- This mapping lives in the **presentation layer**. `src/lib/random` stays free of UI and asset concerns, and `ReelDisplayModel` gains no field to support it.
- Detailed route and place information belongs to the **Result Card**, never the reel window — the window is too small to carry it legibly. The reel region's `aria-label` still announces the stop name, so the information remains available to assistive technology.
- Rolling symbols (`NEUTRAL_ROLLING_SYMBOLS`) remain emoji and are unchanged; only the *settled* state's content was replaced.
- Because the artwork mounts only at the instant a reel stops (1100ms normal / 650ms reduced), `SlotAnchor` must preload the three images (`<link rel="preload" as="image">`), or a cold first spin settles into empty windows.
- Slot geometry, motion timings, the reduced-motion tables, CTA coordinates, and the spin lifecycle are unchanged by this boundary.

### 18. Typography Boundary (DOS Gothic — ADR-030, supersedes the Stardust decision in ADR-029)
- **DOS Gothic is the selected production Korean/UI typeface.** One local family, registered once in `src/app/layout.tsx` via `next/font/local`. Components must never import or reference a font file directly, and no second `font-family` may be declared for it.
- The CSS variable is **role-named** (`--font-ui`), not font-named, so `globals.css` need not change if the typeface does. The three-candidate audition switch (`ACTIVE_UI_FONT`) was temporary and is removed — **no A/B font switch may exist in production source**.
- Registered as a **single 400 entry** so 700/800/900 fall through to browser synthetic bold. A `'400 900'` range would tell the browser the one face covers the whole range, suppressing synthesis and flattening every weight — do not add one.
- **Category split is deliberate and must be preserved.** `--font-sans` → DOS Gothic (Korean and all user-facing copy, inherited via `body`). `--font-mono` → **Geist Mono, unchanged**, carrying the retro English pixel labels (`MY PROFILE`, `TODAY IS...`, `BGM PLAYING`, `TODAY'S PICK`, `VISITOR LOG`, `TOTAL VISIT`, `STEP n/2`, timestamps, the URL pill). A global font replacement is **not** the intent.
- **Geist Sans is retained** as the second entry in the `--font-sans` stack, and this is load-bearing: DOS Gothic lacks `·` (SPINNING `하루 · 산책`), `“ ”` (READY quotes), `…` (truncate ellipsis), `▾` (RESULT `결과 접기 ▾`) and `’ – — × −`. Without it those resolve to an unspecified system font.
- **Known accepted limitations** (not solved on this branch): internally Medium/500, and no real Bold/ExtraBold companion, so heavy weights are a platform-dependent renderer approximation that degrades pixel faces. **Never mix another DOS face (e.g. DOSIyagiBoldface) in as a substitute bold** — those are separate designs, not weight variants of this family.
- **The cascade reaches source-frozen components.** Any component inheriting `--font-sans` can change its rendered layout with a zero-line diff. "Source frozen" (file not edited) and "render frozen" (output unchanged) are different guarantees; only the first is provable by `git diff`. Result Card, Route Guide, composer, Random Log and shared-route surfaces are source-frozen but must be regression-tested visually.
- `preload: false` + `display: swap`. At ~8.25 MB this is a large TTF; converting delivery to WOFF2 and revisiting preload is a recorded non-blocking pre-production follow-up.
- **Licence**: MIT (Damheo Lee). Verbatim upstream notice at `licenses/DOSGothic-LICENSE.txt`; the font binary must not be modified, and no product-UI credit surface is added.

### 19. Opaque-Fit Compensation Boundary (ADR-029)
- Several Figma exports carry large transparent margins, so CSS box size and visible artwork size diverge (measured: `setup.preference.food` 100% opaque vs `setup.preference.walk` 42.7% — a 2.3× spread from an identical box).
- **Exported PNGs are never modified.** Compensation is data, declared in `VISUAL_ASSET_OPAQUE_FIT` (`src/config/visualAssets.ts`) alongside `VISUAL_ASSET_META`, and applied in exactly one component, `FittedAsset`.
- **Feature components must never write their own `scale()` or `translate()`.** A stray transform in a feature component is a boundary violation, not a shortcut.
- **Contract:** `scale` fits the opaque bounding box's **largest dimension** into the layout box while **preserving the artwork's aspect ratio**. It does *not* make both opaque axes equal the box — the shorter axis stays proportionally smaller, which is correct (a camera reads wider than tall). What is normalized is optical mass along the dominant axis.
- `transform` does not participate in layout, so compensation can never move surrounding UI; the layout box is exactly the classes the caller passes. `FittedAsset` applies `pointer-events-none` unconditionally because the transparent overflow it creates would otherwise sit above neighbouring controls (the brand logo's overflow reaches into the header's address-bar link).
- Scope is the 10 confirmed assets: the brand logo, the six Q1/Q2 setup icons, the BGM note, and the two decoration symbols — `decoration.symbol.star` (**1.255**) and `decoration.symbol.clover` (**1.511**), which were added once measurement showed them rendering ~12.4px and ~9.3px inside a 16px box. It is deliberately **not** applied to avatars (~98% opaque), editorial banners, or the settled reel characters.
- Optional per-asset `{ dx, dy }` centring exists in the same metadata and **ships unset** — measured offsets are within tolerance (worst: −1.7px on a 22px icon). It exists so a Human Browser finding is corrected centrally rather than per component.
