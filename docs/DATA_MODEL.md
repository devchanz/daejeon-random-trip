# Data Model & Persistence Contract: Daejeon Random Trip

## 1. Overview & Storage Tiering Boundary

The data architecture separates data into three distinct lifecycle tiers to minimize backend complexity, maintain high performance during marketing campaigns, and strictly protect user privacy.

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Static Configuration & Seed Tier (src/data, src/config)             │
│    - Place Candidates, Route Templates, Zones                          │
│    - 7-Day Today's Pick Content (TS/JSON)                              │
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
Stores visitor log entries submitted exclusively from the Result Card composer flow (`“랜덤 로그 남기고 1회 더 뽑기”`). Powers the community social proof stream on `/guestbook` (read-only archive) and unlocks the 1-time Reroll Reward.

| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key |
| `avatar_id` | `VARCHAR(32)` | No | Selected Kkumssi Family avatar asset identifier |
| `nickname` | `VARCHAR(12)` | No | User nickname (2–12 characters, sanitized) |
| `message` | `VARCHAR(50)` | No | One-liner message (max 50 characters, sanitized) |
| `route_id` | `VARCHAR(64)` | No | Source route ID associated with this log |
| `zone_id` | `VARCHAR(32)` | No | Recommended zone ID |
| `duration_type` | `VARCHAR(16)` | No | `'half'` or `'full'` |
| `preference_type` | `VARCHAR(16)` | No | `'anything'`, `'food'`, `'walk'`, or `'photo'` |
| `status` | `VARCHAR(16)` | No | Moderation status: `'visible'` (default) or `'hidden'` |
| `created_at` | `TIMESTAMPTZ` | No | Submission timestamp (default `now()`) |

> **Privacy Guardrails**:
> - No phone numbers, email addresses, or demographic identifiers are ever collected or stored in `guestbook_entries`.
> - The application database does not store persistent user IP address profiles (while allowing transient infrastructure metadata processing for security and rate limiting).
> - Nicknames and message strings are never forwarded to GA4 telemetry.

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

---

## 4. Today's Pick Static Data Model

Picks are managed entirely via static TypeScript/JSON data (`src/data/picks.ts`) without Supabase or CMS overhead. 7 curated items correspond to the 7-day campaign schedule, supporting modifiable daily combinations of Pixel Artwork and Kkumssi Family characters.

```typescript
interface TodaysPickItem {
  id: string;                    // Pick identifier (e.g., "pick-01-soje")
  slug: string;                  // URL slug for /pick/[slug] (e.g., "soje-dong-cafe")
  campaignDate: string;          // Target active date in YYYY-MM-DD (Asia/Seoul)
  title: string;                 // Headline (e.g., "소제동 철도관사촌 골목 산책")
  subtitle: string;              // Short description / vibe hook
  pixelAsset: string;            // Pixel artwork path for Landing frame
  characterId: string;           // Kkumssi family character ID / asset key (e.g., "kkumdori")
  characterAsset?: string;       // Direct character artwork path (if mapped)
  photos: string[];              // Real photography asset paths for Detail page
  tags: string[];                // Tag list (e.g., ["#철도관사", "#카페거리", "#포토존"])
  recommendedPreference: 'food' | 'walk' | 'photo' | 'anything'; // Pre-seeding target for Q2
  recommendationReason: string;  // Curated one-line recommendation reason
  stayDuration: string;          // Display stay time (e.g., "약 1시간 30분")
  recommendedTime: string;       // Recommended visiting time (e.g., "오후 2시 ~ 5시")
  access: string;                // Transit guide (e.g., "대전역 동광장 도보 5분")
  caution: string;               // Practical visitor tip/caution
  mapLinks?: {                   // Outbound external map links (provider-neutral)
    naver?: string;
    kakao?: string;
  };
}
```

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
2. **Participation Trigger**: User clicks `“랜덤 로그 남기고 1회 더 뽑기”` on the Result Card and submits a visitor log entry.
3. **Unlock Condition**: Server API validates payload and DB `INSERT` into `guestbook_entries` succeeds → State transitions to `available`.
4. **Second Spin**: User executes reroll spin → State transitions to `consumed`.
5. **Session Cap & Persistence**: Maximum 1 reward reroll per travel session. The state is maintained across same-tab page refreshes via `sessionStorage` during the active travel session, but is not an account-based permanent reward. Additional guestbook submissions never grant additional rerolls.
