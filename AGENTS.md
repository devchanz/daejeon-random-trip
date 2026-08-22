<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Agent Rules: Daejeon Random Trip MVP

## 1. Repository Purpose
This repository hosts the **Daejeon Random Trip** MVP — a performance-marketing-driven web landing page that recommends day-trip itineraries in Daejeon using Controlled Random Travel mechanics and tracks user conversion via GA4.

## 2. Core Documentation Reading
Before implementing changes, always consult the project control-plane documents:
- `docs/PRODUCT.md`: Mission, user problem, scope, interaction flow, and hypotheses.
- `docs/ARCHITECTURE.md`: Module boundaries, data flow, config/engine separation, and guardrails.
- `docs/DECISIONS.md`: Architecture Decision Records (ADRs) with Fixed vs. Tentative statuses.
- `docs/ANALYTICS.md`: GA4 event funnel, allowed parameters, proxy conversion metric, and privacy rules.

## 3. Engineering & Collaboration Guardrails
- **Module Boundaries**: Respect the separation of concerns:
  - `src/lib/random`: Recommendation logic & template matching (deterministic; no UI or runtime LLM dependencies).
  - `src/components`: UI presentation and animated slot machine reel visuals.
  - `src/config` & `src/data`: Modifiable product policies and seed data.
  - `src/lib/analytics`: GA4 event dispatchers (no PII / free-text transmission).
- **No UI Hard-coding**: Prefer config and data modifications over hard-coding business constants into React components.
- **Data Integrity**: Do not invent fake Daejeon tourism datasets or places outside verified project data.
- **Task Scope**: Keep unrelated changes out of task scope. Strictly respect the allowed-file boundaries given in task prompts.
- **Version Control**: Do not commit changes to git unless explicitly requested by the user.

## 4. Validation Expectations
- **For Source & Config Changes**:
  - `pnpm lint` (ESLint 9)
  - `pnpm typecheck` (`tsc --noEmit`)
  - `pnpm build` (Next.js build verification when appropriate)
- **For Documentation-Only Work**:
  - Perform lighter, task-appropriate validation (`git status --short`, `git diff --check`).
  - Do not run unnecessary full production builds for pure markdown updates.
