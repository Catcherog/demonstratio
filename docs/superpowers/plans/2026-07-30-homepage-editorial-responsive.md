# Homepage Editorial Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved “B structure + A texture” homepage direction with a direct “进入 AI 导览” CTA and verified desktop, tablet, and mobile layouts.

**Architecture:** Keep the existing page order and AI guide behavior unchanged. Add one isolated CSS layer imported after `v5.css`, make only the semantic markup additions needed for the editorial title/path/prompt numbering, and retain the full AI guide after Product Method. Use source-contract tests plus real-browser viewport checks.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, Node test runner, CSS, Playwright for local visual verification.

## Global Constraints

- Baseline and rollback commit: `1c28d18882926271052ac0f926282a3c52f951e9`.
- Backup branch: `backup/homepage-before-editorial-responsive-20260730`.
- Feature branch: `codex/homepage-editorial-responsive-20260730`.
- Do not commit, push, deploy, or modify other worktrees in this execution.
- Preserve page order: Hero → Featured Cases → System Map → Product Method → full AI Guide → Project Library → Experience.
- Preserve three equal-priority flagship cases and all evidence-bound content.
- Replace only the hero CTA name `让 AI 用 90 秒介绍我` with `进入 AI 导览`; the recruiter prompt may retain `90 秒判断岗位匹配`.
- Required viewport checks: `1440×900`, `768×1024`, `390×844`; horizontal overflow must be zero.

---

### Task 1: Lock the approved UI contract and rollback boundary

**Files:**
- Modify: `tests/portfolio-guide-ux-r2.test.mjs`
- Create: `tests/homepage-editorial-responsive.test.mjs`
- Create: `docs/rollback/homepage-editorial-responsive-20260730.md`

**Interfaces:**
- Consumes: existing `Hero`, `Header`, layout import order, and the approved visual preview.
- Produces: source contracts for CTA naming, two-level AI guide hierarchy, semantic title lines, responsive style layer, and mobile quick resume access.

- [ ] **Step 1: Write failing source-contract tests**

  Update the existing AI invitation test to require `进入 AI 导览` and reject the old CTA. Add a new test file that requires:

  ```js
  assert.match(hero, /hero-title-desktop/);
  assert.match(hero, /hero-title-mobile/);
  assert.match(hero, /hero-guide-route/);
  assert.match(hero, /promptIndex/);
  assert.match(header, /header-mobile-resume/);
  assert.match(layout, /editorial-responsive\.css/);
  assert.match(css, /EDITORIAL_RESPONSIVE_R3_START/);
  assert.match(css, /@media \(max-width: 1050px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  ```

- [ ] **Step 2: Run tests and confirm RED**

  Run:

  ```powershell
  node --test tests/portfolio-guide-ux-r2.test.mjs tests/homepage-editorial-responsive.test.mjs
  ```

  Expected: failure because the old CTA remains and the new CSS layer/classes do not exist.

- [ ] **Step 3: Document rollback commands**

  Record the baseline SHA, backup branch, feature worktree path, and non-destructive inspection/recovery commands. Do not include reset, clean, push, or deploy commands.

### Task 2: Implement the editorial hero and responsive layer

**Files:**
- Modify: `components/home/Hero.tsx`
- Modify: `components/Header.tsx`
- Modify: `app/layout.tsx`
- Create: `app/editorial-responsive.css`

**Interfaces:**
- Consumes: existing `capabilities`, hero metrics, `#portfolio-guide`, current mobile menu state, and V5/R2 styles.
- Produces: one accessible `h1` with desktop/mobile visual line systems, a direct AI guide CTA, numbered guide prompts, decorative route, quick mobile resume access, and isolated responsive styling.

- [ ] **Step 1: Implement minimal semantic markup**

  Use a single accessible heading with `aria-label`, two `aria-hidden` visual line groups, a decorative SVG route, and indexed role prompts. Keep all href targets unchanged.

- [ ] **Step 2: Add the isolated style layer**

  Import `editorial-responsive.css` after `v5.css`. Implement warm paper texture, restrained sage/plum accents, staggered title rhythm, layered AI invite, capability rail, and larger metadata text.

- [ ] **Step 3: Implement tablet and mobile reflow**

  At `1050px`, stack the hero and convert capability rows to a three-card grid. At `720px`, use the mobile title lines, wrapped CTA layout, vertical guide prompts, single-column capabilities, 2×2 metrics, and no horizontal overflow.

- [ ] **Step 4: Run focused tests and confirm GREEN**

  Run:

  ```powershell
  node --test tests/portfolio-guide-ux-r2.test.mjs tests/homepage-editorial-responsive.test.mjs tests/v5-home-contract.test.mjs
  ```

  Expected: all focused tests pass.

### Task 3: Verify the complete local implementation

**Files:**
- Verify only; no new production files.

**Interfaces:**
- Consumes: completed responsive implementation.
- Produces: fresh automated and visual evidence suitable for user review.

- [ ] **Step 1: Run static and content gates**

  ```powershell
  npm run lint
  node --test tests/v5-home-contract.test.mjs tests/portfolio-guide-ux-r2.test.mjs tests/homepage-editorial-responsive.test.mjs tests/portfolio-guide.test.mjs tests/portfolio-ai-adapter.test.mjs
  npm run check:portfolio
  ```

- [ ] **Step 2: Run production build**

  ```powershell
  npm run build -- --webpack
  ```

- [ ] **Step 3: Verify browser viewports**

  Start the local app without deploying. Capture `1440×900`, `768×1024`, and `390×844`, and assert `document.documentElement.scrollWidth === document.documentElement.clientWidth` for each viewport.

- [ ] **Step 4: Review the final diff and rollback references**

  Confirm all tracked changes are confined to this feature worktree and that both backup and feature branches still point to the expected baseline/working state. Do not commit or publish.
