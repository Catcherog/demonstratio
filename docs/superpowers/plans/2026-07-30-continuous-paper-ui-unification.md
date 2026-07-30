# Continuous Paper Homepage UI Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved A “continuous paper editorial flow” to the entire portfolio homepage without changing content, module order, flagship hierarchy, or AI Guide behavior.

**Architecture:** Keep `app/page.tsx` and all React components unchanged. Extend the final cascade layer, `app/editorial-responsive.css`, so every homepage section consumes one continuous warm-paper system and only the architecture card and footer use deep plum. Strengthen the existing source contract test before CSS changes, then verify behavior with the existing guide tests, TypeScript, consistency gate, production build, and browser screenshots.

**Tech Stack:** Next.js 16 App Router, React 19, CSS cascade overrides, Node test runner, TypeScript, Playwright/Edge for screenshot verification.

## Global Constraints

- Do not change homepage module order, navigation information architecture, public copy, project metrics, evidence boundaries, project statuses, or resume links.
- Keep Feishu AI Business Data Platform, Service Agent, and Lumen equal-priority flagship cases; Collator remains a Feishu subsystem.
- Keep AI Guide as both a Hero CTA/invite and a complete section with all existing states and behavior.
- Add no image, video, external font, third-party UI dependency, or AI backend change.
- Use `#F3EEE4` continuous paper, `#FBF8F1` light paper, `#1C1820` ink, `#4F4054` deep plum, `#718C7B` sage, `#DFE7DE` sage surface, and `#E7DDE9` lilac surface.
- Body copy must remain at least `16px` where it is long-form, card copy at least `14px`, supporting copy at least `12px`, and only eyebrows/data labels may use `11px`.
- Preserve keyboard focus, 44px touch targets, `prefers-reduced-motion`, and zero horizontal page overflow at 360, 390, 768, 1024, 1440, and 1920px.
- Do all work on `codex/portfolio-continuous-paper-a`, based on production commit `da525f8`; create a backup ref before pushing.

---

### Task 1: Lock the full-page visual contract

**Files:**
- Modify: `tests/v5-home-contract.test.mjs`
- Test: `tests/v5-home-contract.test.mjs`

**Interfaces:**
- Consumes: `read(path): Promise<string>` already defined in the test file.
- Produces: a source contract for the continuous-paper marker, approved tokens, inset chapter selectors, AI Guide preservation, responsive breakpoints, and removal of old full-width dark colors from the final override layer.

- [ ] **Step 1: Add the failing continuous-paper contract**

Append this test after the existing AI Guide test:

```js
test("continuous paper editorial layer unifies every homepage section", async () => {
  const css = (await read("app/editorial-responsive.css")).toLowerCase();

  for (const token of [
    "--editorial-paper: #f3eee4",
    "--editorial-paper-high: #fbf8f1",
    "--editorial-ink: #1c1820",
    "--editorial-plum: #4f4054",
    "--editorial-sage: #718c7b",
    "--editorial-sage-soft: #dfe7de",
    "--editorial-lilac-soft: #e7dde9",
  ]) {
    assert.match(css, new RegExp(token));
  }

  for (const selector of [
    ".system-section > .section-shell",
    ".method-section > .section-shell",
    ".guide-section > .section-shell",
    ".experience-section > .section-shell",
    ".contact-section > .contact-layout",
  ]) {
    assert.ok(css.includes(selector), `missing full-page selector: ${selector}`);
  }

  assert.match(css, /editorial_continuous_paper_a_start/);
  assert.match(css, /\.system-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.method-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.guide-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(css, /#0c0f17|#0d1017|#191b18/);
});
```

- [ ] **Step 2: Run the contract and confirm the expected failure**

Run:

```bash
npm run test:v5
```

Expected: the first four tests pass and the new test fails because `--editorial-lilac-soft`, the whole-page selectors, and `EDITORIAL_CONTINUOUS_PAPER_A_START` do not yet exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/v5-home-contract.test.mjs
git commit -m "test: lock continuous paper homepage contract"
```

---

### Task 2: Apply the approved desktop visual system to every section

**Files:**
- Modify: `app/editorial-responsive.css`
- Test: `tests/v5-home-contract.test.mjs`

**Interfaces:**
- Consumes: existing homepage class names from `Hero`, `FeaturedCases`, `SystemMap`, `ProductMethod`, `PortfolioGuide`, `ProjectLibrary`, and `ExperienceContact`.
- Produces: final-cascade CSS tokens and section surfaces. No component API or DOM change is permitted.

- [ ] **Step 1: Replace the editorial tokens with the approved palette**

Change the `:root` block to these values while retaining `--editorial-line` and `--editorial-shadow` names for existing consumers:

```css
:root {
  --editorial-paper: #f3eee4;
  --editorial-paper-high: #fbf8f1;
  --editorial-ink: #1c1820;
  --editorial-plum: #4f4054;
  --editorial-sage: #718c7b;
  --editorial-sage-soft: #dfe7de;
  --editorial-lilac-soft: #e7dde9;
  --editorial-line: rgba(49, 40, 51, .16);
  --editorial-shadow: 0 28px 70px rgba(43, 34, 38, .12);
}
```

Update all remaining `--editorial-peach` uses to `--editorial-lilac-soft`, and change `body` to end in `var(--editorial-paper)`.

- [ ] **Step 2: Tighten the Hero-to-featured transition**

In the existing Hero rules:

```css
.hero.section-shell {
  min-height: 0;
  padding-bottom: 58px;
}

.featured-section {
  position: relative;
  padding-top: 82px;
  border-top: 1px solid var(--editorial-line);
  background: transparent;
}

.featured-section::before {
  content: "";
  position: absolute;
  top: -20px;
  left: 50%;
  width: 180px;
  height: 38px;
  transform: translateX(-50%);
  border: 1px solid var(--editorial-line);
  border-bottom: 0;
  border-radius: 55% 55% 0 0;
  background: var(--editorial-paper);
}
```

Keep all Hero copy, CTA, proof-strip, and AI invite selectors unchanged except for color-token substitutions.

- [ ] **Step 3: Add the full-page desktop override block**

Insert this new block before the existing media queries, retaining the marker exactly:

```css
/* EDITORIAL_CONTINUOUS_PAPER_A_START */
main { background: var(--editorial-paper); }

.system-section,
.method-section,
.guide-section,
.experience-section,
.contact-section {
  color: var(--editorial-ink);
  background: transparent;
}

.system-section { padding: 30px 0 0; }
.system-section > .section-shell {
  width: min(1500px, calc(100% - 72px));
  padding: 78px 74px;
  color: var(--editorial-paper-high);
  border: 1px solid rgba(255, 255, 255, .09);
  border-radius: 46px 22px 46px 22px;
  background: var(--editorial-plum);
  box-shadow: 18px 22px 0 rgba(113, 140, 123, .13);
}
.system-section .eyebrow { color: #d8cad9; }
.system-heading > p { color: #d8cfd7; }
.system-layer { border-color: rgba(255, 255, 255, .15); background: rgba(255, 255, 255, .045); }
.layer-heading > span { color: var(--editorial-ink); background: #d8cad9; }
.layer-heading p,
.layer-projects i { color: #d4cad3; }
.layer-projects > * { border-color: rgba(255, 255, 255, .16); background: rgba(28, 24, 32, .08); }
.layer-projects a:hover { border-color: var(--editorial-paper-high); background: rgba(28, 24, 32, .2); }
.layer-projects span { color: #d8cad9; }

.method-section { padding: 28px 0 0; overflow: visible; }
.method-section > .section-shell {
  width: min(1500px, calc(100% - 72px));
  padding: 78px 74px;
  border: 1px solid var(--editorial-line);
  border-radius: 28px 46px 28px 46px;
  background: rgba(251, 248, 241, .78);
  box-shadow: var(--editorial-shadow);
}
.method-section .eyebrow { color: var(--editorial-plum); }
.method-lead,
.method-principles p { color: #6f6873; }
.method-principles { border-color: var(--editorial-line); }
.method-principles > article { border-color: var(--editorial-line); background: rgba(255, 255, 255, .24); }
.method-principles span { color: var(--editorial-sage); }
.flywheel-ring { border-color: rgba(79, 64, 84, .24); }
.flywheel-ring::before,
.flywheel-ring::after { background: var(--editorial-sage); box-shadow: 0 0 18px rgba(113, 140, 123, .45); }
.flywheel-center { border-color: rgba(79, 64, 84, .2); background: var(--editorial-plum); box-shadow: 14px 16px 0 var(--editorial-sage-soft); }
.flywheel-center span,
.flywheel-step > span { color: #d8cad9; }
.flywheel-center small { color: #e4dce4; }
.flywheel-step { color: var(--editorial-ink); border-color: var(--editorial-line); background: var(--editorial-paper-high); }
.flywheel-step small { color: #6f6873; }

.guide-section { padding: 28px 0 0; }
.guide-section > .section-shell {
  width: min(1500px, calc(100% - 72px));
  padding: 78px 72px;
  border: 1px solid rgba(83, 105, 91, .16);
  border-radius: 28px 48px 28px 48px;
  background: var(--editorial-sage-soft);
}
.guide-intro > p:not(.eyebrow) { color: #59655d; }
.guide-window { background: var(--editorial-paper-high); box-shadow: 0 28px 68px rgba(66, 72, 68, .14); }

.project-library-section { padding-top: 108px; background: transparent; }
.library-card { border-radius: 20px 30px 20px 20px; background: rgba(251, 248, 241, .66); }

.experience-section { padding: 28px 0 0; border: 0; }
.experience-section > .section-shell {
  width: min(1500px, calc(100% - 72px));
  padding: 78px 72px;
  border: 1px solid rgba(79, 64, 84, .12);
  border-radius: 44px 24px 44px 24px;
  background: rgba(231, 221, 233, .38);
}

.contact-section { padding: 28px 0 0; }
.contact-section > .contact-layout,
.contact-section > .footer-bottom {
  width: min(1500px, calc(100% - 72px));
  color: var(--editorial-paper-high);
  background: var(--editorial-plum);
}
.contact-section > .contact-layout { padding: 78px 72px 48px; border-radius: 46px 24px 0 0; }
.contact-section > .footer-bottom { margin-top: 0; padding: 26px 72px; border-radius: 0 0 24px 46px; }
.contact-section .eyebrow { color: #d8cad9; }
.contact-layout > div:first-child p:last-child,
.contact-actions span,
.footer-bottom { color: #d8cfd7; }
/* EDITORIAL_CONTINUOUS_PAPER_A_END */
```

- [ ] **Step 4: Run the source contract**

```bash
npm run test:v5
```

Expected: 5 tests pass, 0 fail.

- [ ] **Step 5: Commit the desktop system**

```bash
git add app/editorial-responsive.css
git commit -m "feat: unify homepage with continuous paper system"
```

---

### Task 3: Complete responsive, accessibility, and visual verification

**Files:**
- Modify: `app/editorial-responsive.css`
- Test: `tests/v5-home-contract.test.mjs`

**Interfaces:**
- Consumes: full-page desktop selectors introduced in Task 2.
- Produces: breakpoint-specific padding, single-column behavior, 44px controls, reduced-motion handling, and verified zero-overflow screenshots.

- [ ] **Step 1: Add container overrides at existing breakpoints**

Add these rules to the matching existing media queries:

```css
@media (max-width: 1050px) {
  .system-section > .section-shell,
  .method-section > .section-shell,
  .guide-section > .section-shell,
  .experience-section > .section-shell,
  .contact-section > .contact-layout,
  .contact-section > .footer-bottom {
    width: min(100% - 48px, 1120px);
    padding-right: 48px;
    padding-left: 48px;
  }
}

@media (max-width: 800px) {
  .system-section,
  .method-section,
  .guide-section,
  .experience-section,
  .contact-section { padding-top: 18px; }

  .system-section > .section-shell,
  .method-section > .section-shell,
  .guide-section > .section-shell,
  .experience-section > .section-shell,
  .contact-section > .contact-layout,
  .contact-section > .footer-bottom {
    width: calc(100% - 32px);
    padding-right: 28px;
    padding-left: 28px;
    border-radius: 28px 18px 28px 18px;
  }

  .system-section > .section-shell,
  .method-section > .section-shell,
  .guide-section > .section-shell,
  .experience-section > .section-shell { padding-top: 52px; padding-bottom: 52px; }
  .contact-section > .contact-layout { padding-top: 54px; padding-bottom: 36px; border-radius: 28px 18px 0 0; }
  .contact-section > .footer-bottom { padding-top: 22px; padding-bottom: 22px; border-radius: 0 0 18px 28px; }
}

@media (max-width: 520px) {
  .system-section > .section-shell,
  .method-section > .section-shell,
  .guide-section > .section-shell,
  .experience-section > .section-shell,
  .contact-section > .contact-layout,
  .contact-section > .footer-bottom {
    width: calc(100% - 24px);
    padding-right: 20px;
    padding-left: 20px;
  }

  .hero-lead,
  .featured-heading > p,
  .split-heading > p,
  .method-lead,
  .guide-intro > p:not(.eyebrow) { font-size: 16px; }
  .flagship-summary,
  .library-body > p,
  .timeline article > div p { font-size: 14px; }
}

@media (prefers-reduced-motion: reduce) {
  .flagship-card,
  .flagship-card:hover,
  .hero-ai-prompts a,
  .hero-ai-prompts a:hover { transform: none !important; }
}
```

- [ ] **Step 2: Run all deterministic gates**

```bash
npm run test:v5
npm run test:guide
npm run lint
npm run check:portfolio
npm run build -- --webpack
```

Expected: 5/5 V5 tests, 11/11 guide tests, TypeScript success, portfolio consistency success, and a successful 16-page production build.

- [ ] **Step 3: Start the production build locally**

```bash
npm run start -- -p 4317
```

Expected: Next.js reports `Ready` at `http://localhost:4317`.

- [ ] **Step 4: Capture and inspect desktop and mobile pages**

Use Playwright with installed Edge to load `http://localhost:4317`, wait for `networkidle`, and save:

```text
artifacts/ui-a/home-1440.png
artifacts/ui-a/home-390.png
artifacts/ui-a/system-method-guide-1440.png
```

For each viewport, assert in the script:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Manually inspect these transitions: Hero → flagship cases, architecture → method → AI Guide, and project library → experience → contact. Confirm real project images load and the AI Guide form remains present.

- [ ] **Step 5: Commit responsive refinements**

Do not commit screenshot artifacts. Commit only CSS changes:

```bash
git add app/editorial-responsive.css
git commit -m "fix: refine continuous paper responsive layout"
```

---

### Task 4: Protect rollback and push the completed branch

**Files:**
- No source files.
- Verify: Git history and remote refs.

**Interfaces:**
- Consumes: green implementation branch and production baseline `da525f8`.
- Produces: backup branch `backup/homepage-before-continuous-paper-a-20260730` and pushed feature branch `codex/portfolio-continuous-paper-a`.

- [ ] **Step 1: Verify the final diff is scoped**

```bash
git status --short
git diff --stat origin/main...HEAD
git diff --name-only origin/main...HEAD
```

Expected tracked files only:

```text
app/editorial-responsive.css
docs/superpowers/plans/2026-07-30-continuous-paper-ui-unification.md
docs/superpowers/specs/2026-07-30-continuous-paper-ui-unification-design.md
tests/v5-home-contract.test.mjs
```

- [ ] **Step 2: Create the rollback branch at the production baseline**

```bash
git branch backup/homepage-before-continuous-paper-a-20260730 da525f8
```

Expected: the backup ref resolves exactly to `da525f84f0fd18844c54f41ada5f1043fe2f55bd`.

- [ ] **Step 3: Push backup and feature refs**

```bash
git push origin backup/homepage-before-continuous-paper-a-20260730
git push -u origin codex/portfolio-continuous-paper-a
```

Expected: both refs are accepted by GitHub, and the remote feature HEAD equals local `HEAD`.

- [ ] **Step 4: Report completion without claiming production deployment**

Report the branch, commits, backup ref, deterministic gates, screenshot widths, and remote commit hash. Do not claim that production changed unless a separate production deployment or merge is explicitly performed and verified.

