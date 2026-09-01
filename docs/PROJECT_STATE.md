# Daejeon Random Trip — Project State

## Snapshot
- **Last Updated**: 2026-09-01 (**Final CSS Polish** — landing-card shadow removal, decoration normalization, spacing)

### Final CSS Polish (branch `feat/visual-detail-pass`, still uncommitted)
CSS/layout polish only — no product logic, no interaction architecture, no new visual direction. **Static validation passes; Human Browser QA outstanding.**

- **Landing-card shadow policy**: all decorative offset/drop/retro shadows removed from the landing-card system — `shadow-retro`, `shadow-retro-xs` and `shadow-2xs` across MY PROFILE / TODAY IS… / BGM / VISITOR LOG / Editorial / Setup / Q1–Q2 option buttons / Random Log preview, **including the Q1/Q2 selected state**. Removal is **per call site**: the `.shadow-retro*` utilities stay defined in `globals.css` because **11 other files** (Result, ResultSheet, SlotAnchor, SlotOutputLayer, Route Guide ×2, Guestbook ×2, Random Log card/detail, SharedRouteView) still use them — so Result / Route Guide / Share / dialogs / Slot artwork are untouched. **Flat rings are kept** (`focus-visible:ring-2`, and the selected-state `ring-2` accent): they are accessibility/state indicators, not depth effects, even though Tailwind compiles them as `box-shadow`. No shadow was replaced by another shadow, and no new depth effect was introduced. The Q1/Q2 selected state remains unmistakable on four pre-existing non-shadow signals — red border vs dark, pink background vs cream, accent ring, and the 1px pressed-in translate — plus `aria-pressed`.
- **Card ornaments removed**: the three decorative `🔖` bookmark marks (MY PROFILE, TODAY IS…, BGM PLAYING) and the Setup header's decorative `✨`. **Semantic section icons kept**: the MY PROFILE symbol (the `🐱` glyph was replaced in place by `decoration.symbol.clover` at 16px — the section keeps an icon, only its artwork changed), the BGM music note, the Editorial star, the VISITOR LOG clover. Ambient `PixelCloud` / `PixelSparkle` background artwork kept.
- **Decoration normalization**: the standalone `⭐` in the Setup header is replaced by the Production Manifest `decoration.symbol.star`, deliberately at **12/14px** (matching the emoji's inherited `text-xs sm:text-sm` size) rather than the rail's 20px, to preserve the Setup header's existing hierarchy. **Baked-in PNG decorations are never modified or double-rendered** (Logo, Editorial banners, Slot artwork).
- **Right-rail Star/Clover**: root cause was that both were **uncompensated** — at a 16px box the star rendered ~12.4px and the clover only ~9.3px. Added opaque-fit entries (**star 1.255, clover 1.511**) and moved both to a 20px box via `FittedAsset`, giving **≈20px of visible artwork** (+61% / +89%). Header row height unchanged: 20px sits inside the `font-mono text-sm` 20px line box. One entry per asset serves both the Setup header and the rail — only the box differs.
- **Desktop spacing**: stage wrapper `pt-1` → `pt-5` (**+16px**). Because the left column and centre `<main>` are siblings of one `flex flex-row items-start` row, this moves **both the Logo and Setup down by the same 16px**, keeping them aligned by construction. Mobile Setup does not move. **No Slot size change; `slotGeometry.ts` frozen.**
- **Mobile logo**: `clamp(150px,min(52vw,28svh),220px)` → **`clamp(200px,min(72vw,34svh),300px)`** — 218px at 360×640 (+22%), 270px at 375×812 (+38%), capped at 300px. `72vw` drives wide-but-short devices, `34svh` guards short viewports, the cap prevents a bloated tablet logo. Aspect preserved, no horizontal overflow. Because the box uses the opaque aspect with compensation, box width == visible artwork width.
- **Mobile right-rail quick-jump**: a mobile-only `<a href="#mobile-right-rail">` beside the logo, jumping past the stacked LeftSidebar straight to TODAY'S PICK (VISITOR LOG follows directly). **Plain anchor — no `use client`, no state, no scroll listener, no `scrollIntoView`, and no global `scroll-behavior`.** Absolutely positioned so the logo stays centred and the arrow cannot overlap artwork (0px added height); 44×44 touch target; `lg:hidden`. The `id` lives on a **mobile-only wrapper in `page.tsx`**, never inside `RightSidebar`, which renders twice with both mounts always in the DOM.
- **BGM equalizer — deferred to `feat/bgm-playback`.** Investigation found the bars were **never animated** (the version at `HEAD` is byte-identical and `globals.css` has no equalizer keyframes), so nothing regressed. Animating them now would assert playback that does not exist. Intended behaviour there: `isPlaying` → animate, paused/stopped → static. **Known item recorded for that branch**: the header reads "BGM PLAYING" and the composite paints an active-looking pause control while no real playback exists — not changed here.

- **Prior snapshot**: 2026-09-01 (Visual Detail Pass closeout — DOS Gothic finalized + final manifest assets, ADR-030)

### Visual Detail Pass — Closeout (branch `feat/visual-detail-pass`, still uncommitted)
Closing change for the branch. **Static validation passes; Human Browser smoke QA is outstanding and includes one P1 gate that can still block branch close.**

- **Font finalized (ADR-030)**: **DOS Gothic** is the production Korean/UI typeface, selected by Human Browser review. The audition switch (`ACTIVE_UI_FONT`, `UiFontCandidate`, the Stardust/Mona declarations and lookup) is removed, and the five unused TTFs are deleted after a verified **0-reference** check — `src/app/font/` now holds `DOSGothic.ttf` only, and the build emits only that face. `--font-ui` stays role-named so `globals.css` need not change if the typeface does. **Geist Mono untouched**; **Geist Sans deliberately retained** as the `--font-sans` fallback because DOS Gothic lacks `·`, `“ ”`, `…`, `▾` and `’ – — × −`, all of which the UI renders.
- **Licence hygiene**: `licenses/DOSGothic-LICENSE.txt` — MIT (Damheo Lee), fetched **byte-exact** from upstream `github.com/hurss/fonts` and content-verified before writing (the binary embeds no licence fields). The repo had no prior notice convention, so no aggregate file was invented and **no product-UI credit was added**. Font binary unmodified.
- **Final manifest assets** (identity from the semantic Figma frame; raster children are all normalized to `Image`): `Media/Playback/Controls` (new), `Editorial/Banner/KkumssiFamily` + `Editorial/Banner/ExpoBridgeNight` (new evergreen items), and in-place replacements of `Setup/Preference/Food` and `Editorial/Banner/Tashu`. Registry **36 → 39**; `public/assets` **37 → 40**. All five verified against frame, filename, dimensions, alpha, integrity and content.
- **Two measured corrections that were not optional**: Food opaque-fit **1.000 → 1.461** (the new export is 48.4%×68.5% opaque, not full-bleed — at 1.0 it would render ~68% of its box while every other Q2 icon fills its own), and Tashu intrinsic META **{670,373} → {670,358}** (aspect changed 1.796 → 1.872).
- **BGM controls — visual layer only**: production composite via `FittedAsset`, capped `max-w-[238px]` so it is never upscaled (~53px vs the 54px row it replaced — left-column budget unaffected). Duplicated CSS tray removed since the artwork carries its own. Four **transparent** control regions overlaid in painted order, each focusable with its own `aria-label` and a `focus-visible` ring, at percentages **measured** from the export. **No `<audio>`, no state, no handlers; `LeftSidebar` remains a Server Component.** *Visual controls finalized in `feat/visual-detail-pass`. Functional BGM playback deferred to a dedicated future feature branch.*
- **Perched mascot — position-only**: hands now grip the card's top border. The 137×151 canvas carries 23px (15.23%) of transparent padding below the paws, which had sunk them 12–20px inside the card; only `-top-*` offsets changed (`top = 0.84768 × H − 2`). **All widths preserved, `sm:w-14` included**, as is the horizontal anchor.
- **Editorial pool 4 → 6**; `selectEditorialItem` unchanged and still deterministic per Asia/Seoul date; SeptemberEvents' window untouched (verified 09-30 eligible, 10-01 not). New items carry no invented `href` or validity window.
- **Outstanding P1 gate**: keyboard-Tab the four BGM control regions at 1440/1024/375 — any meaningful mismatch between a painted control and its focus/hit region blocks branch close. Also mascot alignment at 1440/1024/**768**/375×812; if `sm:w-14` makes correct alignment impossible without a visible collision, that is **reported, not resolved** by changing sizes or rail spacing.
- **Not entered**: Result redesign, quest work, Share Card, Result responsive actions. The known short-mobile Result issue is unchanged — neither fixed nor worsened.

- **Prior snapshot**: 2026-09-01 (Secondary Visual Tuning Pass — typography + opaque-fit compensation, ADR-029)

### Secondary Visual Tuning Pass (branch `feat/visual-detail-pass`, stacked on the uncommitted first pass)
Targeted tuning after Human Browser review of the first integration. **Static validation passes; Human Browser E2E is outstanding and includes a gate that can still reverse the global font application.**

- **Typography (ADR-029)**: PF Stardust registered once via `next/font/local` — 400 → Regular, 700 → Bold, 800 → ExtraBold, **900 → ExtraBold (same file, registered explicitly)**, so the 104 existing `font-black` sites hit a real face with no synthetic bolding and no component edits. Verified in build output: 4 `@font-face` rules, ExtraBold URL emitted once. `--font-sans` → Stardust (Korean / user-facing); **`--font-mono` → Geist Mono unchanged**, preserving all 29 retro English pixel labels. Geist Sans retained as the sans fallback. `preload: false` + `display: swap` while the typeface is provisional.
- **Root cause of "everything looks small"**: measured opaque bounds showed most exports carry heavy transparent padding — `setup.preference.food` 100% opaque vs `setup.preference.walk` 42.7%, a **2.3× visible-size spread from an identical box**; the logo only 64.7% opaque vertically. Fixed as **data, not asset edits**: `VISUAL_ASSET_OPAQUE_FIT` + the single `FittedAsset` component. **All 31 PNGs remain byte-identical to the Figma exports.**
- **Brand logo**: box now uses the OPAQUE aspect (622×264) and is width-driven — visible width grows 64–86% for **−5 to +5px** of desktop column height. Mobile uses `min(52vw, 28svh)` so short viewports shrink the logo instead of pushing the Setup/Slot hero below the fold (+12.6px worst case).
- **Q1/Q2 icons**: 24px mobile / 28px desktop for Q1; **22px from `sm` up for Q2**, deliberately conservative because the 4-across row is already width-critical and `아무거나` already wraps. Compensation alone roughly doubles the padded icons regardless of box size. Setup card height locks (`h-[218px] sm:h-[186px]`, `h-[128px] sm:h-[92px]`, `h-[88px] sm:h-[64px]`) verified unchanged.
- **Slot CTA**: decorative emoji removed from all three labels (they consumed ~30% of the painted button's usable width); responsive scale 14 → 24px across breakpoints. **`slotGeometry.ts` untouched — CTA coordinates and hitbox unchanged.** The READY helper text that quoted the old label was corrected to match.
- **SPINNING status**: 14/15px at 700 over 12/13px at 400, replacing 12/14 at 900 over 11/12 at 700 — a much stronger hierarchy. Container geometry unchanged. **READY was NOT retuned** (regression-only, per scope).
- **Random Log right-rail avatars**: 28px → 34px / 36px. Row height is text-driven (~34–42px), so **no row grows** and no other avatar consumer changes.
- **PixelClouds**: both were crossing the chrome divider — the header measures 75px and the columns start at y=79, so `-top-4` placed them at y=63. Left → `top-1 -left-8`; right → `top-0 -left-4` with height trimmed to `h-12` so it clears both the divider (75) and the editorial card top (~133). Offsets/size only, no z-index changes. Mobile has no ambient decoration.
- **Known deferred**: the short-mobile Result action issue remains unfixed. **New acceptance criterion:** PF Stardust must not worsen it — if the font adds wrapping, grows the Result Card, or pushes primary actions further out of reach, that is a blocker for the global font, not a licence to edit Result.

- **Prior snapshot**: 2026-09-01 (Visual Detail Pass — production asset integration, ADR-027, ADR-028)

### Visual Detail Pass (branch `feat/visual-detail-pass`, branched from `main` @ `a3b888c`)
Production artwork from the Figma **Production manifest** (`oyEWRpRpaslcF3Iyuw3Jfa`, node `151:2`) is integrated as a **visual replacement only**. No product logic, state machine, recommendation engine, motion timing, slot geometry, or database behavior changed. Static validation (`git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`) passes; **Human Browser E2E is still outstanding**.

- **Assets**: 31 assets exported from the manifest into `public/assets/` (21 non-avatar + 10 avatar), all RGBA with alpha preserved, at native pixel-art resolution (no upscaling — Figma's 2× resample would blur pixel art). The registry totals **36** entries (the 31 new plus 5 pre-existing production assets). *31 and 36 are different numbers and are validated separately.*
- **Asset registry (ADR-027)**: `src/config/visualAssets.ts` is now the single source of truth for image paths, keyed by the Figma handoff keys (`setup.duration.halfDay`, …).
- **Brand**: hero renders `brand-logo-primary.png`; the wordmark is now **“오늘 대전 갈래!”** (supersedes the text-rendered “대전 갈래..?”). Desktop sizing is height-driven (`h-[clamp(88px,7.4vw,120px)]`) and the left title band's `min-h` reservation was **removed rather than raised**, so the band's height is exactly the logo's. The left column therefore shifts down ~38–64px depending on width — this is budgeted, not incidental, and is a required E2E check against the ground-scenery artwork.
- **Chrome**: the three `Chrome/*Controls` exports are single composite sprites, not per-glyph files, and render as one decorative image each. The three window "buttons" they replaced carried `aria-label`s but had no handler; they are now `aria-hidden` artwork, which removes three fake controls from the accessibility tree without changing behavior. Nav controls hide below `sm` (decoration only, returns ~80px to the address pill).
- **Q1/Q2**: production icons wired via `iconSrc` on `OptionButton`, with the emoji sets retained as fallback. Canonical mapping verified visually and **not** inverted: `half`/반나절 = SUN, `full`/하루 = MOON. The icon box (16/20px) is smaller than the emoji line box it replaced, so the height-locked Setup card cannot grow.
- **Slot settled reels (ADR-028 sibling boundary, ARCHITECTURE §17)**: settled reels now show activity characters mapped by route slot (Meal→food, Cafe→dessert, Discovery/Preference→tashu) instead of label chip + place name. Rolling symbols, geometry, timings, reduced-motion tables, CTA coordinates, and the spin lifecycle are untouched — the diff is the settled branch's contents, one added `h-full`, and three `<link rel="preload">` tags (required: the images only mount at reel-stop, 1100ms normal / 650ms reduced).
- **Random Log avatars**: all 10 `imageSrc` values populated in `src/config/avatars.ts`. **Zero component edits** — every render point already branched on `imageSrc`. The 10 stable application ids are unchanged, so stored `avatar_id` values keep resolving.
- **Editorial rail (ADR-028)**: rebuilt as `EditorialItem` (`src/data/editorial.ts`) + `EditorialSpotlightCard` (`src/components/editorial/`), with a perched mascot at the card's top-right and a matching perch band in the right column. Measured height at 1440: **340px → 259px with tags, 229px without** (−81 / −111px); shorter at every audited breakpoint. Validity + rotation contracts verified by direct execution, including the exclusive `activeUntil` boundary (September banner eligible on 2026-09-30, gone on 2026-10-01).
- **Decoration scope**: `decoration.symbol.star` is currently used by the standalone Header title-bar star, the Setup header star, and the Editorial / TODAY'S PICK header star. `decoration.symbol.clover` is currently used by the MY PROFILE header and the VISITOR LOG header. Ambient `PixelSparkle` / `PixelCloud` background artwork remains separate and unchanged. Production PNG decorations baked into the Logo / Editorial banners / Slot artwork are never double-rendered. The asset identities stay feature-agnostic; each consumer is an explicit approved decision rather than an automatic consequence of the asset existing.
- **Known deferred**: the short-mobile Result action accessibility issue is explicitly **not** addressed in this pass (Result Card redesign owns it). Acceptance criterion recorded for that redesign: *all primary Result actions must remain reachable on narrow AND short mobile viewports without becoming inaccessible below the viewport.*
- **`OUTPUT_PEEK_ENABLED` remains `false`** — the output-slit ticket artwork is still absent from the manifest and belongs to the Result Card redesign.

- **Prior snapshot**: 2026-08-31 (reduced-motion Slot hotfix, ADR-026)
- **Baseline Main Commit at Checkpoint**: `053289c` (`feat: implement result ticket focus flow`) — the Result/Ticket Output System is merged to `main`. The Random Log / Right Rail Community Surface below is implemented (as uncommitted working-tree changes, pending commit) and Human Browser validated on branch `feat/random-log-right-rail`, branched from this same `main` commit.
- **Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, ESLint 9, pnpm 11, Supabase (PostgreSQL REST)
- **Current Status**: Core Controlled Random recommendation engine, provisional place dataset, setup/spin experience, referral sharing (`/api/share`, `/r/[shareCode]`), in-app Route Guide, shared route OG social preview hardening, `SlotVisualFrame` responsive visual architecture baseline, the Result/Ticket Output System DEV contract (centered Result Card overlay, output slit peek-cue architecture, minimize/reopen presentation lifecycle, nested-overlay keyboard ownership), and the Random Log / Right Rail Community Surface (public read IA, Result-gated writing decoupled from the 1-time reroll reward, 10-identity `CharacterSelector`) are implemented and Human Browser validated (ADR-008, ADR-011, ADR-022, ADR-023, ADR-024, ADR-025). Visual baseline integration is complete; the temporary `integration/visual-main` lane is closed. The `plan_mvp_visual_integration@00a15fe` branch remains only as the preserved approved Visual reference checkpoint (all new visual work must branch from latest `main`). A production regression where `prefers-reduced-motion: reduce` collapsed the Slot's SPINNING phase to an ~instant Result has been fixed and Human Browser E2E validated on branch `hotfix/slot-reduced-motion` — a shared lifecycle clock now drives both motion preferences, and reduced motion runs the same reel-roll animation at ~2x lower intensity rather than a shortened or substituted one (ADR-026). GA4 Analytics & Dashboard, Today's Pick, the production ticket-peek visual asset, production Kkumssi-family character artwork, and asset finalization are pending.

---

## Product Flow & Core Interaction
1. **Q1 (Duration)**: User selects local travel time in Daejeon (`반나절` / `하루`).
2. **Q2 (Preference)**: User selects travel vibe (`아무거나` / `먹방` / `산책` / `사진`).
3. **READY**: Condition summary displayed; primary CTA activates `“🎰 여행 뽑기!”`.
4. **SPINNING**: Slot reels spin with neutral arcade symbols; sequential stop (`Reel 1` 1100ms → `Reel 2` 1600ms → `Reel 3` 2100ms → final beat 400ms).
5. **RESULT**: Spin completes; a brief output slit peek cue (`SlotOutputLayer`, mounted as a sibling of `SlotVisualFrame`) is followed 300–500ms later by the front-facing, centered **Result Card** (`ResultArea`, an in-flow `fixed` overlay — not a Portal, to respect `MainExperience`'s dual desktop/mobile mount) displaying route stops, stay times, mission note, and the CTA hierarchy: Route Guide (primary), Share (secondary), a Random Log CTA (secondary — always present once a Result exists), and a reroll CTA (tertiary — visible only while the reward is `available`; hidden, not disabled, once `locked` or `consumed`). Random Log write eligibility and reroll reward eligibility are independent (ADR-025). Background interaction is blocked and body scroll is locked while revealed. **결과 접기** (minimize) hides the card (`display:none`, not unmounted — `ResultSheet`'s local share state survives) and fully restores landing interactivity without discarding `state.result`; a persistent **내 여행 티켓 다시 보기** affordance in `SlotAnchor`'s helper band reopens the same Result. Opening `RouteGuideModal` or `GuestbookComposer` from the Result Card suspends Result's own Escape/Tab keyboard ownership until that nested overlay closes. *(Note: the peek cue's visual is currently disabled — `OUTPUT_PEEK_ENABLED = false` in `SlotOutputLayer.tsx` — pending the dedicated Figma output-slit ticket asset; the mount/timing architecture is implemented and dormant.)*
6. **ROUTE_GUIDE**: Clicking `“이 코스로 가보기”` on Result Card or `“이 코스 그대로 가보기”` on `/r/[shareCode]` opens `RouteGuideModal` (rendered via React Portal to `document.body` to avoid containing-block clipping) displaying detailed stop cards, stay durations, curated tips, and external Naver/Kakao map launch buttons.
7. **REFERRAL SHARE**: Clicking `“내 루트 공유하기”` creates an immutable snapshot via `/api/share` and opens native Web Share (with clipboard fallback); friends landing on `/r/[shareCode]` see the exact shared itinerary with dynamic OpenGraph/Twitter summary previews and can open the Route Guide or spin their own trip.

---

## Visual Baseline: SlotVisualFrame Architecture
Human Browser review approved the following as the **Visual baseline for main integration**. It supersedes the prior approach where the transparent 600×500 asset canvas itself participated in page layout, compensated with hand-tuned negative margins.

**Structure**:
```
SlotStage
  ├── SlotVisualFrame        (physical visible machine footprint; participates in page layout)
  │     └── 600×500 LogicalCanvas   (absolute; does NOT determine surrounding layout spacing)
  │           ├── DOM reels
  │           ├── production PNG (slot-idle.png / slot-pulled.png)
  │           └── DOM CTA
  └── SlotOutputLayer   (sibling of SlotVisualFrame; implemented — visual cue currently disabled pending the Figma output-slit ticket asset)
```

**Verified production union bounds** (measured by direct PNG alpha-channel decoding across `slot-idle.png` / `slot-pulled.png` / `slot-shell.png`, cross-checked against Figma `00_FINAL_REFERENCE / Landing/Desktop`):
- Logical 600×500 canvas: `x=168, y=149, w≈280.333, h≈204.667`
- Source 1800×1500 asset (3× scale): `x=504, y=447, w=841, h=614`
- Corrects a prior incorrect assumption that the machine's physical footprint was ~58% of the logical canvas width — the verified figure is **~46.72%**.

**Scroll / overflow contract**: `SlotVisualFrame` uses `overflow: hidden`. Root cause of a pre-result empty-scroll-tail bug: the oversized absolute `LogicalCanvas` (≈2.14× the frame's width) extended `document.scrollHeight` while the frame used `overflow: visible`, reserving a large blank area below the ground scenery in every pre-result state. Fixing the frame to `overflow: hidden` does **not** block the Ticket/Result reveal, because `SlotOutputLayer` is implemented as a **sibling** of `SlotVisualFrame` (not a descendant of `LogicalCanvas`) and is therefore never subject to this clip — it also only mounts once `revealStage` leaves `'hidden'`, so pre-result states are structurally unaffected regardless. Pre-result states (`Q1`/`Q2`/`READY`/`SPINNING`) must not reserve large blank Result space; Result content should add vertical space only when the `RESULT` state actually renders it.

**State position lock**: `Q1`, `Q2`, `READY`, and `SPINNING` share pixel-identical geometry for Setup, `SlotVisualFrame`, and Helper (verified by direct DOM measurement at 1920 / 1440 / 1200 / 1024 / 400px). State transitions must never move the pre-result Hero. The Result Card's minimized reopen affordance (`SlotAnchor`'s helper band) also respects this: it renders inside the band's existing fixed height, adding zero layout height.

**In-flow fixed overlay stacking contract**: `MainExperience`'s desktop/mobile dual-mount (`page.tsx`, gated by `hidden lg:flex` / `lg:hidden`) means overlays inside it (Result Card, Guestbook Composer) must render as in-flow `fixed` elements, never a Portal to `document.body` — a Portal would escape the responsive gate and could render the hidden breakpoint's overlay on top of the visible layout. This requires the three-column Visual Stage layout to keep its column wrappers at `z-auto` (no per-column `z-index`) so those in-flow fixed overlays aren't trapped inside `<main>`'s own stacking context — see ADR-024.

**Responsive Slot baseline** (Human-approved current values — **not** permanent final design values):
| Viewport | Physical Slot width |
|---|---|
| 400px mobile | ~360px |
| 1200px desktop | ~518px |
| 1440px desktop | ~614px |
| 1920px wide desktop | ~700px |

**Setup baseline**: The desktop Setup card was intentionally given additional vertical breathing room (question area height, option button height, vertical padding) to balance against the enlarged Slot. Mobile Setup dimensions are unchanged.

**Ground Scenery vs. Footer**: The tower/city/foliage artwork anchored beneath the Visual Stage is **Visual Stage Ground Scenery** — decorative, absolutely positioned, and structurally distinct from the semantic `Footer` component. `Footer` is intentionally excluded from the initial landing Hero.

**Mobile Core Hero composition**: `Title → Setup → Slot → Helper`. Supporting modules (My Profile, Today's Pick, Visitor Log, etc.) follow below the core Hero in a secondary scroll section.

**Key files**: `src/components/experience/slotGeometry.ts` (new — geometry constants and formulas), `src/components/experience/SlotAnchor.tsx`, `src/components/experience/SetupArea.tsx`, `src/components/experience/MainExperience.tsx`, `src/app/page.tsx`.

---

## Route Recommendation Contract
- **Engine Logic** (`src/lib/random`): Pure, testable logic decoupled from UI animations.
- **Ordered Route Templates**:
  - **Half-Day (`half`)**: Fixed **exactly 3 stops**: `Meal → Cafe → Preference` (`half_ordered_3`).
  - **Full-Day (`full`)**: Primary **4 stops**: `Meal → Cafe → Discovery → Preference` (`full_ordered_4`); graceful fallback to **3 stops**: `Meal → Cafe → Preference` (`full_fallback_3`), omitting Discovery while preserving user's chosen Preference.
- **Preferences**: `anything` ('아무거나', wildcard matching all candidates), `food` ('먹방'), `walk` ('산책'), `photo` ('사진').
- **Stop Roles vs Route Slots**: Conceptual place taxonomy is `anchor`, `meal`, `discovery`, `stay-extender`. Route slots are `meal`, `cafe`, `discovery`, `preference`. Canonical cafe identification is based on `PlaceCandidate.category === "카페·디저트"`.
- **Duration Budget Semantics**: In current provisional data, `estimatedTotalMinutes` strictly represents place stay duration ($\sum \text{Place.durationMin}$). Door-to-door transit times are omitted pending transit modeling. Numeric budget bounds (`minMinutes`, `maxMinutes`) remain unconfigured (TBD).

---

## Data Status
- **Place Candidates**: 163 runtime candidates in `src/data/places.ts`, generated from the current provisional / REVIEW-stage place dataset. Final tourism verification is pending.
- **Zones**: 8 total defined in `src/data/zones.ts`.
  - **Active (7)**: `soje`, `daeheung`, `seonhwa`, `eoeun-gung`, `galma`, `mannyeon`, `doryong`.
  - **Inactive (1)**: `banseok` (`active: false` due to lack of anchor/discovery candidates in provisional data).
- **Today's Pick Data**: `src/data/picks.ts` initialized with empty array (`TODAYS_PICKS = []`).

---

## Backend / Database / Share Infrastructure
- **Supabase Runtime**: Server-only REST client (`src/lib/database/client.ts`) using standard `fetch` with `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`). UI never accesses database directly.
- **Guestbook / Random Log Persistence**: `/api/guestbook` (`POST` & `GET`) sanitizes text, validates avatar/nickname (2–12 chars)/message (1–50 chars), attaches route metadata, and writes to `guestbook_entries`. `GET` additionally accepts a `before` cursor (ISO `created_at`) for board pagination, and `getGuestbookEntryByPublicId` (`src/lib/database/guestbook.ts`) is the sole lookup path for a single entry by its public identifier.
- **Random Log Public Read Surfaces**: A Right Rail live preview (`RandomLogRightRailPreview`, top 3 entries, React `cache()`-deduped across the desktop/mobile dual-render), the full board (`/random-log`, cursor-paginated "Load more"), and the detail route (`/random-log/[id]`) are all public and available before any slot spin — none of the read path depends on `phase === 'result'`. `export const dynamic = 'force-dynamic'` is set on `/` and `/random-log`: verified empirically that Next.js 16.3.2 does not infer dynamic rendering from an uncached `fetch()` alone on a route with no dynamic segment, so without it these routes would statically freeze their data at build time. See ADR-025.
- **Random Log Writing / Reroll Decoupling**: Writing requires an active generated Result (no landing-page write entry point) and is capped at one submission per Result within the current mounted client session (`loggedRouteIds`, plain React state in `MainExperience` — not persisted, not a DB constraint; a client UX guardrail, not a security boundary). `GuestbookComposer` shows reward-specific copy only when the submission that just completed actually granted the reward, snapshotted at submit time rather than read live from reroll state afterward. See ADR-025.
- **1-Time Rewarded Reroll** (unchanged, ADR-011):
  - Lifecycle: `locked` → `available` → `consumed`.
  - Unlocked strictly upon verified server DB insertion from `GuestbookComposer`.
  - Max 1 reward reroll per browser-tab session, backed by browser `sessionStorage`.
  - Consumed only after successful route recommendation generation.
  - A later Random Log submission (a new Result, after the reward is consumed) never grants a second reward; the reroll CTA is hidden entirely once `consumed`, not shown disabled.
- **Shared Routes Persistence**:
  - `src/lib/database/share.ts` implements cryptographic rejection sampling (`generateShareCode`) and snapshot persistence (`createSharedRoute`, `getSharedRouteByCode`, `getSharedRouteBySourceRouteId`).
  - DDL migrations in `supabase/migrations/20260829000000_create_shared_routes.sql` and `20260829000001_configure_shared_routes_grants.sql`.
- **Shared Route Social Preview & URL Hardening**:
  - `src/lib/share/shareHelper.ts` provides `normalizeOrigin` and `getSiteOrigin()` supporting `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → `http://localhost:3000` fallback with URI scheme validation (rejecting `ftp:`, `javascript:`, etc.).
  - `src/app/layout.tsx` registers `metadataBase: new URL(getSiteOrigin())`.
  - `/r/[shareCode]` serves dynamic snapshot-only OpenGraph, Twitter (`card: 'summary'`), canonical URL, and `robots: { index: false, follow: false }` metadata.
- **Character Registry**: `GUESTBOOK_AVATARS` (`src/config/avatars.ts`) holds the 10 real Kkumssi-family character identities as stable ids (`mongmong`, `kkumdongi`, `nebeu`, `geumdori`, `kkumnuri`, `kkumdori`, `doreu`, `kkumbichi`, `eunsuni`, `kkumsuni`) — a slug of each Figma character name, independent of any layer path/filename/asset URL, stored as `avatar_id` with no DB migration. All 10 `imageSrc` values are populated with the production `Character/Avatar/*` artwork, resolved through the `visualAsset()` registry rather than literal paths; `badgeEmoji` remains the structural fallback for any future entry added before its artwork is exported. **Identity vs display**: the 10 user-visible `name` values are Korean (`몽몽`, `꿈동이`, `네브`, `금돌이`, `꿈누리`, `꿈돌이`, `도르`, `꿈빛이`, `은순이`, `꿈순이`) and are presentation copy only — they surface in the character selector and as the avatar badge's accessible name. The stable ids, `DEFAULT_AVATAR_ID`, the `avatar_id` validator in `src/lib/database/guestbook.ts`, and every persisted/DB value are **unchanged**, so display names may be re-worded without touching stored data. The `kkumdori` avatar entry is a distinct role from the static `Character/Main/Kkumdori` brand illustration in `LeftSidebar.tsx` (`character.main.kkumdori`) and must not be aliased to it.

---

## Completed Milestones
- [x] Controlled Random recommendation engine with role taxonomy and fallback handling (`src/lib/random`).
- [x] Enforced Ordered Route Templates (Half: Meal -> Cafe -> Preference; Full: Meal -> Cafe -> Discovery -> Preference with 3-stop fallback).
- [x] Experience state machine & reducer (`src/lib/experience`).
- [x] Visual v4 layout shell (`Header`, `LeftSidebar`, `RightSidebar`, `Footer`, `MainExperience`).
- [x] Physical slot machine chassis with sequential reel stops, lever animation, and reduced-motion support. Reduced-motion support: a shared lifecycle clock (`getMotionTimings()`) drives SPINNING → RESULT for both motion preferences (no shortened/instant-Result branch), and the reel roll runs at reduced CSS-only intensity (~2x slower) rather than being suppressed or replaced — fixes a production regression found post-deploy; Human Browser E2E validated (ADR-026).
- [x] 163 runtime place candidates across 8 zones (7 active).
- [x] Supabase server REST client & `/api/guestbook` route handler.
- [x] Guestbook composer modal with input sanitization & rewarded reroll lifecycle (`sessionStorage`).
- [x] Share snapshot persistence foundation & DDL migrations (`src/lib/database/share.ts`, `supabase/migrations/`).
- [x] Shared Routes / Referral: `/api/share` route handler, dedicated `/r/[shareCode]` friend landing page, and ResultSheet Web Share / clipboard fallback.
- [x] In-App Route Guide: `RouteGuideModal` (React Portal to `document.body`) & `RouteGuideTimeline` with ordered stop sequence, stay durations, visit tips, external Naver/Kakao map launch buttons, and CTA wiring on `ResultSheet` and `SharedRouteView`.
- [x] Shared Route OG / Social Preview Hardening: `generateMetadata` OpenGraph, Twitter summary card, canonical alternates, `robots: { index: false, follow: false }`, `metadataBase` in root layout, and hardened `normalizeOrigin` / `getSiteOrigin` URL origin resolver.
- [x] `SlotVisualFrame` architecture baseline: physical-footprint frame + absolute `LogicalCanvas` separation, verified production asset bounds (~46.72%), scroll/overflow fix, state-position lock, and desktop Setup/Slot balance (approved via Human Browser review and merged to `main` in commit `f2789ef`).
- [x] Result/Ticket Output System DEV contract: centered `ResultArea` Result Card overlay (in-flow `fixed`, not a Portal, respecting `MainExperience`'s dual desktop/mobile mount), `SlotOutputLayer` output-slit peek-cue architecture (sibling of `SlotVisualFrame`, visual cue currently disabled pending the Figma ticket asset), 결과 접기 minimize/reopen presentation lifecycle preserving `state.result` and `ResultSheet`'s local share state, nested-overlay (`RouteGuideModal` / `GuestbookComposer`) keyboard-ownership suspension, and the `page.tsx` column stacking-context fix enabling in-flow fixed overlays to cover the full page (ADR-008, ADR-022, ADR-023, ADR-024). Human Browser validated; merged to `main`.
- [x] Random Log / Right Rail Community Surface: public read IA (`RandomLogRightRailPreview` in the Right Rail → `/random-log` board with cursor "Load more" → `/random-log/[id]` detail), all ungated and available before any slot spin, reached via `getGuestbookEntryByPublicId` reusing the existing `guestbook_entries.id` UUID as the public identifier (no DB migration). Writing remains Result-gated (no landing-page entry point) with a once-per-Result client UX guardrail (`loggedRouteIds`, unpersisted React state), fully decoupled from the pre-existing 1-time reroll reward (ADR-011) — a later Result may still be logged after the reward is consumed, without granting another one, and `GuestbookComposer`'s success copy reflects only what that specific submission actually granted. `CharacterSelector` rebuilt around the 10 real Kkumssi-family identities (large Hero preview + fixed 5×2 picker, no carousel; production artwork still deferred). `router.refresh()` + `export const dynamic = 'force-dynamic'` on `/` and `/random-log` keep the read surfaces live. Human Browser validated on branch `feat/random-log-right-rail` (ADR-025).

---

## Deferred / Known Gaps
- **Result/Ticket Output — VISUAL polish only**: The DEV contract (centered Result Card overlay, output slit peek-cue architecture, minimize/reopen, nested-overlay keyboard ownership) is implemented and Human Browser validated (ADR-008, ADR-022, ADR-023, ADR-024). Deferred: the production Figma output-slit ticket asset (currently disabled via `OUTPUT_PEEK_ENABLED = false` in `SlotOutputLayer.tsx`), its reveal/peek animation, a mini-ticket skin for the reopen affordance, and final Result Card typography/spacing/visual hierarchy. When that VISUAL pass begins, follow `docs/PRODUCT.md` + Fixed ADRs in `docs/DECISIONS.md` rather than inferring the final treatment from the current DEV-only presentation.
- **Editorial Rail (TODAY'S PICK)** — *implemented per ADR-028; only the items below remain deferred.* The rail ships as `EditorialItem` (`src/data/editorial.ts`, 6 seeded items) + `EditorialSpotlightCard`, with validity-window filtering and deterministic Asia/Seoul daily rotation. Still deferred: no `href`/`external` destinations are seeded, so the optional-link path ships dormant; banner-click / impression tracking remains TBD (see `docs/ANALYTICS.md`). The legacy `src/data/picks.ts` (`TODAYS_PICKS = []`) is retained but referenced by no UI — only its `getSeoulDateString` helper is reused. Unchanged exclusions per ADR-015 (revised): no `/pick/[slug]` detail page, no Q2 preference seeding, no editorial → Slot funnel.
- **Analytics Telemetry & Dashboard**: `src/lib/analytics/`, GA4 event dispatchers, and Campaign & Funnel Analysis Dashboard not implemented — includes Random Log view/list/detail/character-selection events, explicitly deferred alongside the rest of GA4.
- **Transit Modeling**: Inter-stop travel times and transit modes are not modeled.
- **Production Brand Assets**: the official Kkumssi-family illustrations and production pixel artwork have shipped in `public/assets/`. The visual asset registry contains **39 registered paths, all 39 resolving**; `slot-shell.png` remains deliberately outside that registry. The 10 Random Log avatar artworks are wired to their stable `avatar_id` identities through `src/config/avatars.ts`. Still absent: **audio files** (the current BGM surface is visual-only) and the dedicated output-slit ticket artwork deferred to the Result redesign.
- **Random Log Community Features**: Comments, likes/ranking, profiles, edit/delete, and social reactions are intentionally not built (ADR-025) — component boundaries are kept extensible but no speculative tables or flags exist for them.
- **Dataset Verification**: Final tourism validation for candidate places is pending.

---

## Deferred Visual Polish (Post-SlotVisualFrame Baseline)
Intentionally deferred out of the `SlotVisualFrame` baseline pass; not yet scheduled:
- Final title artwork and Title → Setup spacing polish (current title/spacing is temporary)
- Final Y2K typography pass
- Slot palette / skin recolor
- Today's Pick seated character
- Additional cloud / sparkle decorative polish
- Intro / Start CTA
- SPINNING visual redesign
- Result redesign
- Ticket reveal / peek animation
- Final Result animation
- CTA hit-area correction (painted button is visually ~37–38% of the machine per both the production PNG and Figma reference; the interactive hitbox is intentionally still ~32% — unchanged in the `SlotVisualFrame` pass to avoid an unrelated interaction regression)

---

## Next Recommended Development Order
1. **Result/Ticket Output — VISUAL asset pass**: The DEV contract landed (see Completed Milestones). Once the Figma output-slit ticket asset is ready, flip `OUTPUT_PEEK_ENABLED` to `true` in `SlotOutputLayer.tsx` and implement the final peek/reveal animation, a mini-ticket skin for the `SlotAnchor` reopen affordance, and Result Card typography/spacing/visual hierarchy polish, per `docs/PRODUCT.md` + Fixed ADRs in `docs/DECISIONS.md`.
2. **Editorial Rail follow-ups**: the rail itself shipped (ADR-028) — 6 seeded items in `src/data/editorial.ts` with validity-window filtering and deterministic Asia/Seoul daily rotation. Remaining: seed real `href`/`external` destinations once they exist (the shell already supports them), and decide banner-click / impression tracking, currently TBD in `docs/ANALYTICS.md`. Still excluded: no `/pick/[slug]` detail page, no Q2 preference seeding (ADR-015, revised).
3. **Analytics (GA4 Telemetry & Campaign Dashboard)**: Implement `src/lib/analytics/` tracking helpers adhering to `docs/ANALYTICS.md` strict privacy guardrails (**zero PII, no visitor nicknames/messages, no user share_code parameters**), and deliver the Campaign & Funnel Analysis Dashboard to easily analyze paid traffic, acquisition UTMs, 4-loop funnel drop-offs, and proxy conversions without inspecting raw GA4 reports.
4. **Remaining Content / Data Completion**: Complete tourism verification for place candidates. *(The Kkumdori / Kkumssi Family production artwork integration listed here previously is done — all 10 `GUESTBOOK_AVATARS` `imageSrc` slots are populated; identities/ids were already finalized per ADR-025.)*

---

## Governance & Development Rules

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
