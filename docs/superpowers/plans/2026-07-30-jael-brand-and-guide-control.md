# Jael Brand and Guide Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a legible handwritten Jael/J identity and a non-clipping AI guide submit control while preserving the approved homepage system.

**Architecture:** Keep the changes local to the existing header, guide form, favicon, and editorial CSS. Inline SVGs provide deterministic rendering and avoid new dependencies or system-font reliance for the favicon; contract tests lock the visual and accessibility semantics.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, inline SVG, Node test runner.

## Global Constraints

- Do not change homepage section structure, navigation labels, or case hierarchy.
- Preserve the approved warm beige, deep plum, muted lilac, sage, and ink palette.
- Use `Jael` in the header and a path-based handwritten `J` in the favicon.
- Keep the guide submit target circular and 44 px with explicit accessible state labels.
- Add no dependency and load no external font.

---

### Task 1: Lock the brand and guide control contract

**Files:**
- Modify: `tests/v5-home-contract.test.mjs`
- Test: `tests/v5-home-contract.test.mjs`

**Interfaces:**
- Consumes: source files read by the existing `read(path)` helper.
- Produces: regression assertions for header markup, guide button states, favicon SVG, and reduced-motion CSS.

- [ ] **Step 1: Write the failing test**

Add a test that requires `brand-signature`, the visible word `Jael`, idle/loading `aria-label` values, inline SVG state icons, a favicon without `<text>`, and reduced-motion handling for the guide spinner. It must reject `brand-mark">CJ`, `loading ? "思考中" : "发送"`, and malformed SVG font markup.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:v5`

Expected: FAIL because the current header still contains `CJ`, the guide button uses text labels, and the favicon contains `<text>`.

- [ ] **Step 3: Commit the contract**

Run: `git add tests/v5-home-contract.test.mjs docs/superpowers/specs/2026-07-30-jael-brand-and-guide-control-design.md docs/superpowers/plans/2026-07-30-jael-brand-and-guide-control.md && git commit -m "test: lock Jael brand and guide control"`

### Task 2: Implement deterministic brand and button visuals

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/PortfolioGuide.tsx`
- Modify: `app/editorial-responsive.css`
- Modify: `app/icon.svg`
- Test: `tests/v5-home-contract.test.mjs`

**Interfaces:**
- Consumes: the existing `loading` state and header brand link.
- Produces: `.brand-signature`, `.guide-submit-icon`, `.guide-submit-spinner`, and a valid path-only favicon.

- [ ] **Step 1: Implement the minimal markup**

Replace the `CJ` badge with a `Jael` signature span. Replace the guide button text with an upward-arrow SVG for idle state and a spinner SVG for loading state; set the button `aria-label` from the same `loading` state.

- [ ] **Step 2: Implement the minimal styling**

Style the signature with a compact handwritten font stack and a subtle baseline flourish. Center both button SVGs, animate only the spinner, and disable that animation under `prefers-reduced-motion`.

- [ ] **Step 3: Replace the favicon**

Use a valid square SVG with a deep-plum rounded field and a warm-paper Bezier path forming a handwritten `J`; include no `<text>` or external asset.

- [ ] **Step 4: Run focused tests**

Run: `npm run test:v5 && npm run test:guide`

Expected: all tests pass.

- [ ] **Step 5: Commit the implementation**

Run: `git add components/Header.tsx components/PortfolioGuide.tsx app/editorial-responsive.css app/icon.svg && git commit -m "fix: refine Jael brand and guide submit state"`

### Task 3: Verify and publish

**Files:**
- Verify only: application source and built routes.

**Interfaces:**
- Consumes: committed implementation from Tasks 1–2.
- Produces: verified Git commits, updated feature branch and `main`, and a READY production deployment.

- [ ] **Step 1: Run full local gates**

Run: `npm run test:v5`, `npm run test:guide`, `npm run lint`, `npm run check:portfolio`, and `npm run build -- --webpack`.

Expected: every command exits 0.

- [ ] **Step 2: Run browser verification**

Open the production build at desktop and mobile widths. Confirm the Jael signature, centered idle arrow, centered loading indicator, no collision in the mobile header, and a valid favicon link.

- [ ] **Step 3: Push the reviewed commits**

Push `codex/portfolio-continuous-paper-a`, fast-forward `main` to the same verified commit, and push `main` without force.

- [ ] **Step 4: Verify production deployment**

Wait for the Git-integrated Vercel deployment, require status `READY`, and verify `https://www.jaelchen.com/` returns the new brand and favicon assets.

