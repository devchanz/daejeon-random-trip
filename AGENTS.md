<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Agent Rules: Daejeon Random Trip MVP

## 1. Repository Purpose
This repository hosts the **Daejeon Random Trip** MVP — a performance-marketing-driven web landing page that recommends coherent short-trip routes within Daejeon (local itinerary for time spent in Daejeon) using Controlled Random Travel mechanics and tracks user conversion via GA4.

## 2. Core Documentation Reading
Before implementing changes, consult the project control-plane documents relevant to the task:
- `docs/PRODUCT.md`: Mission, problem framing, scope, interaction flow, and hypotheses.
- `docs/ARCHITECTURE.md`: Planned module boundaries, data flow, config/engine separation, and guardrails.
- `docs/DECISIONS.md`: Architecture Decision Records (ADRs) with Fixed vs. Tentative statuses.
- `docs/ANALYTICS.md`: GA4 event funnel, allowed parameters, proxy conversion metric, and privacy rules.

## 3. Engineering & Collaboration Guardrails
- **Planned Module Boundaries**: Respect the separation of concerns across planned directories:
  - `src/lib/random`: Controlled recommendation logic, candidate filtering, random selection, template matching, and route validation (no UI or runtime LLM dependencies; randomness may be seedable/injectable in tests).
  - `src/components`: UI presentation and animated slot machine reel visuals.
  - `src/config` & `src/data`: Modifiable product policies and candidate/template seed data.
  - `src/content`: Static copy and user-facing text strings.
  - `src/lib/analytics`: GA4 event dispatchers and sanitizers (no PII / free-text transmission).
- **No UI Hard-coding**: Prefer config and data modifications over hard-coding business constants into React components.
- **Data Integrity**: Do not present invented places, facts, or metrics as real production data. Clearly labeled mocks and fixtures are explicitly permitted for tests and local development.
- **Task Scope**: Keep unrelated changes out of task scope. Strictly respect the allowed-file boundaries given in task prompts.
- **Version Control**: Do not commit changes to git unless explicitly requested by the user.

## 4. Validation Expectations
- **Whitespace & Formatting Hygiene**:
  - Before reporting implementation complete, all created or edited files must not contain unintended trailing blank lines at EOF and must pass `git diff --check`.
- **For Source & Config Changes**:
  - `git diff --check` (Whitespace and merge conflict marker verification)
  - `pnpm lint` (ESLint 9)
  - `pnpm typecheck` (`tsc --noEmit`)
  - `pnpm build` (Next.js build verification when appropriate)
- **For Documentation-Only Work**:
  - Perform lighter, task-appropriate validation (`git status --short`, `git diff --check`).
  - Do not run unnecessary full production builds for pure markdown updates.
