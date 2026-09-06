# Data Model & Persistence Contract: Daejeon Random Trip

## 1. Overview & Storage Tiering Boundary

The data architecture separates data into three distinct lifecycle tiers to minimize backend complexity, maintain high performance during marketing campaigns, and strictly protect user privacy.

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Static Configuration & Seed Tier (src/data, src/config)             │
│    - Place Candidates, Route Templates, Zones                          │
│    - TODAY'S DAEJEON editorial carousel content (TS, §4) — implemented │
│    - Product Policies (Duration budgets, reroll limits, weights)       │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Client / Anonymous Session Tier (sessionStorage / Browser Session)  │
│    - User Preference State (Q1 duration, Q2 preference)                │
│    - Active RouteResult (Unsaved session itinerary)                    │
│    - Route Guide Display State                                         │
│    - Reroll Session State (locked → available → consumed)              │
│      (Session-scoped browser storage; persists across tab refreshes)   │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Persistent Database Tier (Supabase via Server/API Boundary)         │
│    - guestbook_entries (Community social proof; visible / hidden)      │
│    - shared_routes (Immutable snapshots with UUID PK + unique shareCode)│
│    - site_visits (Append-only visit event log)                         │
└────────────────────────────────────────────────────────────────────────┘
```

> **Key Architectural Rule**: General route generation is an ephemeral client/session computation. Standard generated `RouteResult` instances are **not** written to the persistent database unless explicitly shared by the user via the Referral Share action.

---

## 2. Core Domain Data Models

### 2.1 PlaceCandidate (Static Seed Data)
Represents a curated point of interest within a Daejeon travel zone.

```typescript
interface PlaceCandidate {
  id: string;                    // Unique place identifier (e.g., "sungsimdang-main")
  name: string;                  // Display name (e.g., "성심당 본점")
  category: string;              // Primary category (e.g., "베이커리", "카페", "명소")
  zoneId: string;                // Zone association (e.g., "eunhaeng-daeheung")
  durationMin: number;           // Typical stay duration in minutes (e.g., 45)
  tags: string[];                // Search and preference filter tags
  address?: string;              // Physical road address in Daejeon
  mapLinks?: {                   // Outbound external map links (provider-neutral)
    naver?: string;
    kakao?: string;
  };
  image?: string;                // Optional image asset path
  description?: string;          // Curated one-line description
  active: boolean;               // Availability flag
}
```

### 2.2 Zone & RouteTemplate (Static Engine Models)
Defines geographical clustering and structural itinerary rules.

```typescript
interface Zone {
  id: string;                    // Zone identifier (e.g., "daeheung-station")
  name: string;                  // Display name (e.g., "대전역·은행·대흥")
  centerCoords?: { lat: number; lng: number };
  active: boolean;
}

type RouteSlot = 'meal' | 'cafe' | 'discovery' | 'preference';

interface RouteTemplate {
  id: string;                    // Template ID (e.g., "half_ordered_3", "full_ordered_4")
  zoneId?: string;
  durationType: 'half' | 'full';
  preference?: 'anything' | 'food' | 'walk' | 'photo';
  targetDurationMin?: { min: number; max: number }; // Configurable duration budget range (TBD)
  slots: RouteSlot[];            // Ordered route slot sequence (e.g., ['meal', 'cafe', 'preference'])
}
```

### 2.3 RouteResult & RouteStop (Ephemeral Client / Session Model)
Represents a fully validated random itinerary produced by the recommendation engine during a user session.

```typescript
interface RouteResult {
  id: string;                    // Ephemeral client route ID
  zoneId: string;                // Recommended zone
  zoneName: string;              // Display zone name
  durationType: 'half' | 'full';
  preference: 'anything' | 'food' | 'walk' | 'photo';
  title: string;                 // Curated headline (e.g., "오늘은 대흥동 먹방 코스!")
  stops: RouteStop[];            // Variable sequence of 1–4 stops
  mission?: string;              // Optional playful travel mission
  estimatedTotalMinutes: number; // Sum of place stay durations + inter-stop travel times
  createdAt: string;             // ISO-8601 timestamp
}

interface RouteStop {
  order: number;                 // 1-based stop sequence (1, 2, 3, 4)
  placeId: string;               // Reference to PlaceCandidate
  name: string;                  // Place name
  category: string;              // Category tag
  stayDurationMin: number;       // Estimated stay time at place (minutes)
  travelToNextMin?: number;      // Estimated transit time to next stop (minutes)
  transitMode?: 'walk' | 'transit' | 'taxi'; // Recommended transit mode
  address?: string;
  mapLinks?: {                   // External map links (provider-neutral)
    naver?: string;
    kakao?: string;
  };
  tips?: string;                 // Playful tip or caution
}
```

### 2.4 Route Transformation & RouteSnapshot Contract
The lifecycle progression connects domain models as follows:

```
PlaceCandidate ──► RouteResult ──► RouteGuide

Upon Referral Share:
RouteResult ──► RouteSnapshot ──► shared_routes
```

A `RouteSnapshot` immutably captures the generated itinerary at the moment of sharing, ensuring that future updates to seed place data do not alter previously shared trips.

```typescript
interface RouteSnapshot {
  sourceRouteId: string;        // Ephemeral route ID at time of generation
  zoneId: string;               // Recommended zone
  durationType: 'half' | 'full';
  preferenceType: 'anything' | 'food' | 'walk' | 'photo';
  title: string;                // Route title snapshot
  stops: SharedRouteStopSnapshot[]; // Immutable stop sequence snapshot
  mission?: string;             // Travel mission snapshot
  estimatedTotalMinutes: number;// Total estimated travel time
  schemaVersion: number;        // Data contract schema version (default 1)
}

interface SharedRouteStopSnapshot {
  order: number;
  placeId: string;
  name: string;
  category: string;
  stayDurationMin: number;
  travelToNextMin?: number;
  transitMode?: string;
  mapLinks?: {
    naver?: string;
    kakao?: string;
  };
  tips?: string;
}
```

---

## 3. Persistent Database Models (Supabase)

### 3.1 `guestbook_entries` Table
Stores Random Log entries submitted from the one shared composer, reachable from the Result Card CTA or from the landing page's Memory Log write affordance (ADR-042/ADR-045). Writing still requires an active generated Result in either case — the strip is an entry point, not a way to post without a route. Powers three public, ungated read surfaces — the Right Rail preview, the `/random-log` board, and the `/random-log/[id]` detail route — and unlocks the 1-time Reroll Reward on a user's first eligible submission (ADR-011, ADR-025).

| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key, and reused directly as the public identifier for `/random-log/[id]` (see below) |
| `avatar_id` | `VARCHAR(32)` | No | Selected Kkumssi Family character identifier — a stable slug (e.g. `kkumdori`), independent of any Figma layer path, filename, or asset URL |
| `nickname` | `VARCHAR(12)` | No | User nickname (2–12 characters, sanitized) |
| `message` | `VARCHAR(50)` | No | One-liner message (max 50 characters, sanitized) |
| `route_id` | `VARCHAR(64)` | No | Source `RouteResult.id` this log was submitted against — see §5.1 for how this backs the once-per-Result write guardrail |
| `zone_id` | `VARCHAR(32)` | No | Recommended zone ID |
| `duration_type` | `VARCHAR(16)` | No | `'half'` or `'full'` |
| `preference_type` | `VARCHAR(16)` | No | `'anything'`, `'food'`, `'walk'`, or `'photo'` |
| `status` | `VARCHAR(16)` | No | Moderation status: `'visible'` (default) or `'hidden'` |
| `created_at` | `TIMESTAMPTZ` | No | Submission timestamp (default `now()`); also the cursor column for `/random-log` board pagination |
| `route_place_names` | `TEXT[]` | **Yes** | Immutable snapshot of the generated route's actual stop names (max 4), captured at submission time so two logs sharing the same duration/preference/zone still visibly differ. Added additively (`20260904000002_add_route_place_names_to_guestbook_entries.sql`) — every row submitted before that migration is `NULL` and is never backfilled; all three read surfaces treat `NULL`/empty the same (render nothing), never an empty placeholder list. |

> **Privacy Guardrails**:
> - No phone numbers, email addresses, or demographic identifiers are ever collected or stored in `guestbook_entries`.
> - The application database does not store persistent user IP address profiles (while allowing transient infrastructure metadata processing for security and rate limiting).
> - Nicknames and message strings are never forwarded to GA4 telemetry.

> **Public Identifier (ADR-025)**: `/random-log/[id]` reuses the existing `id` UUID directly — no new `public_code`-style column, no migration. This is safe because `guestbook_entries` has no anon/authenticated RLS policy (only `service_role` can read it), so the table is never reachable except through server code that already enforces `status = 'visible'`, and a UUIDv4 is not sequential/enumerable. Unlike `shared_routes.share_code` (§3.2), a dedicated short code wasn't judged worth the migration here: Random Log links are clicked from the rail/board, not hand-typed/shared. The detail page reaches this column through exactly one function, `getGuestbookEntryByPublicId` (`src/lib/database/guestbook.ts`) — never an inline query — so a future move to a `shared_routes`-style short code would only change that function's internals, not the UI or route shape.

### 3.2 `shared_routes` Table
Stores immutable snapshots of itineraries when users click `“내 루트 공유하기”`. Enables short referral URLs (`/r/[shareCode]`) that remain permanent and resilient to subsequent candidate data updates.

| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Internal Primary Key (default `gen_random_uuid()`) |
| `share_code` | `VARCHAR(16)` | No | Unique Public Lookup Code (e.g., `"F7k2Ma9Q"`, indexed unique) |
| `source_route_id` | `VARCHAR(64)` | No | Ephemeral route ID at time of generation |
| `zone_id` | `VARCHAR(32)` | No | Zone identifier |
| `duration_type` | `VARCHAR(16)` | No | `'half'` or `'full'` |
| `preference_type` | `VARCHAR(16)` | No | Travel preference |
| `title` | `VARCHAR(100)` | No | Route title snapshot |
| `stops` | `JSONB` | No | Immutable snapshot of `SharedRouteStopSnapshot[]` sequence |
| `mission` | `VARCHAR(255)` | Yes | Mission memo snapshot |
| `estimated_total_minutes` | `INT` | No | Total estimated travel time in minutes |
| `schema_version` | `INT` | No | Data contract version (default `1`) |
| `created_at` | `TIMESTAMPTZ` | No | Creation timestamp (default `now()`) |

### 3.3 `site_visits` Table
Append-only visit event log — one row per counted visit (one browser tab-session, de-duplicated client-side before `POST /api/visits` is ever called; see `src/lib/visitor/visitSession.ts` / `VisitBeacon.tsx`). No other columns: `TOTAL VISIT` is a row count, `TODAY` is a row count filtered to `created_at >= <KST midnight>`, both recomputed at read time by `src/lib/database/visits.ts` — no daily reset job needed.

| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key (default `gen_random_uuid()`) |
| `created_at` | `TIMESTAMPTZ` | No | Visit timestamp (default `now()`); the only column ever queried (count / count-since) |

Migrations: `20260904000000_create_site_visits.sql` (table + `created_at` index), `20260904000001_configure_site_visits_grants.sql` (revokes `anon`/`authenticated`, grants `SELECT, INSERT` to `service_role`). Both applied; `TOTAL VISIT`/`TODAY` confirmed showing real counts in Human Browser.

---

## 4. TODAY'S DAEJEON Editorial Carousel Data Model (Implemented, `src/data/editorial.ts`, ADR-028/ADR-038)

The Right Rail editorial carousel ("TODAY'S DAEJEON", renamed from "TODAY'S PICK") is 100% static TypeScript data — no Supabase or CMS overhead. `EditorialItem` (not `TodaysPickItem` — see the retired-concept note below) is deliberately feature-name-agnostic: the current display name appears nowhere in this type.

```typescript
type EditorialKind = 'spot' | 'theme' | 'event' | 'experience' | 'campaign';

interface EditorialItem {
  id: string;                       // Stable, feature-name-agnostic identifier
  kind: EditorialKind;               // Semantic role; describes an item, never forks the layout
  title: string;                     // Accessible name -- surfaced as the banner's alt text, not a visible row
  bannerAssetKey: VisualAssetKey;     // src/config/visualAssets.ts registry key
  bannerObjectPosition?: string;      // CSS object-position inside the shared fixed aspect-[15/8] carousel viewport (default 'center')
  tags?: readonly string[];
  badge?: string;                     // Short inline flag in the header row
  href?: string;                      // Real outbound destination; absent items render non-interactive
  external?: boolean;                 // Opens href in a new tab (target/rel)
  activeFrom?: string;                // YYYY-MM-DD, Asia/Seoul, inclusive
  activeUntil?: string;               // YYYY-MM-DD, Asia/Seoul, exclusive
}
```

- **Production seed** (`EDITORIAL_ITEMS`, 5 entries): `kkumssi-family`, `bread-tour`, `tashu`, `expo-bridge-night`, `september-events` (date-bound `2026-09-01`–`2026-10-01` exclusive; the other 4 are evergreen). Each carries a real `href` + `external: true`. The earlier 6th seed item (`night-view`, obsolete uncaptioned artwork) is removed, not merely deactivated.
- **Selection**: `getActiveEditorialItems(dateStr, items)` filters by validity window only (no per-day rotation/pick — every eligible item is browsable in the carousel). Deterministic between server and client render (same Asia/Seoul date string), so no hydration mismatch.
- **Retired concept**: this is deliberately **not** `TodaysPickItem` (`src/lib/random/types.ts`) — that 17-field shape was built for an unimplemented `/pick/[slug]` detail page + Q2-seeding flow (ADR-015, revised out of scope) and lives behind the recommendation-engine boundary. It remains unreferenced by any route or call site; `src/data/picks.ts` (`TODAYS_PICKS = []`) is dead code, kept only for its `getSeoulDateString` helper (reused by `editorial.ts`).

---

## 5. Reroll Session State Model (Client / Session-Scoped Storage)

Tracks the single-reward reroll lifecycle during an anonymous user session without requiring account authentication. Persistence is backed by `sessionStorage` in the browser:

```typescript
type RerollRewardState = 'locked' | 'available' | 'consumed';

interface RerollSessionState {
  routeSessionId: string;        // Ephemeral identifier for the active travel session
  rerollReward: RerollRewardState; // Initial: 'locked'
  unlockedAt?: string;           // ISO timestamp of successful guestbook submission
  consumedAt?: string;           // ISO timestamp of second spin execution
  awardedRouteId?: string;       // Route ID for which the reroll was unlocked
}
```

### State Progression Guardrails
1. **Initial Spin**: Produces 1st `RouteResult`. `rerollReward` is `locked`.
2. **Participation Trigger**: User clicks `“랜덤 로그 남기고 1회 더 뽑기”` on the Result Card and submits a Random Log entry.
3. **Unlock Condition**: Server API validates payload and DB `INSERT` into `guestbook_entries` succeeds → State transitions to `available`.
4. **Second Spin**: User executes reroll spin → State transitions to `consumed`.
5. **Session Cap & Persistence**: Maximum 1 reward reroll per browser-tab session. The state is maintained across same-tab page refreshes via `sessionStorage` during the active session, but is not an account-based permanent reward. Additional Random Log submissions never grant additional rerolls (§5.1).

## 5.1 Random Log Write Eligibility (ADR-025) — Deliberately Separate from Reroll State

Writing eligibility ("has *this* Result already been logged") and reroll reward eligibility ("has this *session* claimed its one reroll") are two independent questions, tracked in two independent places:

```typescript
// ExperienceProvider.tsx — plain component state, NOT part of RerollSessionState.
// Mirrored into the tab-scoped trip session (ADR-043) so it survives a navigation:
const [loggedRouteIds, setLoggedRouteIds] = useState<Set<string>>(() => new Set());
```

- **Never a DB column and never a uniqueness constraint** — it stays a client-side answer. It is, however, mirrored into the tab-scoped trip session alongside the active `RouteResult` (`src/lib/experience/tripSession.ts`, ADR-043): both used to be memory-only, which meant walking from `/` to `/random-log` and back silently forgot the route *and* whether it had already been logged. The mirror is `sessionStorage`-only and dies with the tab.
- **Keyed on `RouteResult.id`** (written to `guestbook_entries.route_id` on submission), which is guaranteed fresh per `generateRoute()` call — including every reroll — so a reroll always produces a Result that can be logged again.
- **A client UX guardrail, not a security boundary.** `POST /api/guestbook` remains directly callable with any client-supplied `route_id`; this is unchanged by, and not improved by, the once-per-Result rule. Real abuse prevention (rate limiting, auth, a reward ledger) is explicitly out of scope for this MVP — see ADR-025.
- Submitting a log always attempts to unlock the reroll via the unchanged `unlockRerollReward` (§5 above), which already refuses to re-unlock once `consumed` — so logging a later Result can never grant a second reward, with no additional guard needed here.
