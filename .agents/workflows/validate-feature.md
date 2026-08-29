---
name: validate-feature
description: Run the standard validation sequence for feature tasks in this repository, including working-tree inventory, static checks, and a comprehensive read-only High reviewer.
---

# Feature Validation Workflow (`validate-feature`)

Purpose: Run the standard validation sequence for feature tasks in this repository.

---

## Phase 0: Working-Tree Inventory

Before running static validation, inventory all modified, staged, and untracked files in the working directory:

```bash
git status --short
```

- Identify all tracked modified/deleted files.
- Identify all untracked files (`??`).
- Record this inventory to ensure Phase 2 (Reviewer) inspects the **complete** change set, not just tracked diffs.

---

## Phase 1: Static Validation

Execute the following static checks sequentially:

1. **Git Diff Whitespace/Conflict Check**:
   ```bash
   git diff --check
   ```

2. **TypeScript Typecheck**:
   ```bash
   pnpm typecheck
   ```

3. **ESLint Linting**:
   ```bash
   pnpm lint
   ```

4. **Next.js Production Build**:
   ```bash
   pnpm build
   ```

### Failure Semantics
- **Failure Condition**: A validation step is considered failed **if and only if** the command exits with a non-zero exit code (e.g. exit code != 0).
- **Warnings**: Output warnings that exit with code 0 should be reported in the summary, but do **not** fail the workflow unless the command itself treats them as fatal errors.
- **On Failure**:
  - **STOP IMMEDIATELY**.
  - Report exactly which command failed along with the error output.
  - **DO NOT** modify code or attempt automatic fixes.

---

## Phase 2: Fresh Read-Only High Reviewer

If and only if ALL static checks in Phase 1 pass (all exit code 0):

1. Invoke a fresh read-only High reviewer / subagent.
2. The reviewer must inspect the **complete working-tree change set**:
   - All tracked changes shown by `git diff` (or `git diff HEAD`).
   - **Every untracked file** identified as `??` in Phase 0 (must be read directly via file viewing tools; do not assume `git diff` contains untracked files).
3. The reviewer must compare the complete change set against the authoritative project documents:
   - `AGENTS.md`
   - `docs/PRODUCT.md`
   - Fixed ADRs in `docs/DECISIONS.md`
   - `docs/ARCHITECTURE.md`
   - `docs/DATA_MODEL.md`
   - `docs/ANALYTICS.md`
   - `docs/PROJECT_STATE.md`

### Reviewer Guardrails & Strict Rules
- **Do not modify files**.
- **Do not create or execute scratch scripts**.
- **Do not install packages**.
- **Do not commit or push**.
- Focus on:
  - Critical issues (architectural/contract violations, breaking changes, data integrity failures)
  - Warnings (design discrepancies, missing edge cases, non-blocking risks)
  - Regression risk across existing features (e.g. slot machine, reroll loop, seed places)
  - Security and privacy compliance (zero PII, safe analytics)
  - Unrelated scope expansion

### Reviewer Output Format
The reviewer must output:

```markdown
## Critical
- [List critical issues or "None"]

## Warnings
- [List warnings or "None"]

## Verdict
[PASS | FIX REQUIRED]
```

---

## Phase 3: Workflow Decision & Reporting

1. **If the Reviewer returns `FIX REQUIRED`**:
   - **STOP IMMEDIATELY**.
   - Report the reviewer's findings, critical issues, and warnings to the user.
   - **DO NOT** apply fixes automatically.
   - Await user instructions. After fixes are applied, repeat the complete workflow from Phase 0.

2. **If the Reviewer returns `PASS`**:
   - Report that static validation **PASS**ed and reviewer **PASS**ed.
   - **STOP** and wait for explicit user action (e.g. human browser E2E, final merge-readiness review).

---

## Strict Git & Environment Governance

**NEVER AUTOMATE**:
- `git add`
- `git commit`
- `git push`
- `git switch` / `git checkout`
- `git merge`
- `git reset` / `git restore` / `git clean`
- branch creation or deletion
- PR creation or merge
- package installation

Only read-only inspection commands (`git status`, `git status --short`, `git diff`, `git diff --check`) are permitted within this workflow.
