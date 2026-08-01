# SCS Case Page Layout Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax with - [ ] for tracking.

**Goal:** Refine the Service Agent flagship case page so its live demo has one primary entry, technical and iteration content read cleanly at every viewport, and wide-screen section navigation never overlays the正文.

**Architecture:** Keep the existing six-section server-rendered case page and evidence catalog. Add a small optional demo-status contract to the flagship case data, resolve an optional environment override against the data default, and let the evidence gallery collapse duplicate interactive records into one primary card. Use a page-local content grid for the wide-screen sticky rail and CSS-only responsive grids for technical and iteration cards.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Grid, Node test runner, existing tsc --noEmit and Next production build.

## Global Constraints

- Do not modify the backend, the real Demo URL, evidence IDs, business status text, or other case-page content.
- Do not introduce a required environment variable; NEXT_PUBLIC_DEMO_STATUS is an optional live/fallback override only.
- When the environment value is missing or invalid, resolve to service-agent.ts data demoStatus: "live".
- Preserve the six section IDs: overview, business, product, technical, iterations, evidence.
- Technical Service Agent cards must retain all 7 points; the first 6 occupy a 2 × 3 desktop grid and the last fail-closed card spans both columns.
- Iteration cards use 3 columns on desktop, 2 on tablet, and 1 on mobile; no horizontal overflow.
- Do not commit changes in this task.

---

### Task 1: Add red tests for the approved case-page contract

**Files:**
- Create: tests/service-agent-case-layout.test.mjs
- Read: content/flagship-cases/service-agent.ts
- Read: content/flagship-cases/types.ts
- Read: components/case-study/FlagshipCasePage.tsx
- Read: components/case-study/CaseEvidenceGallery.tsx
- Read: components/case-study/TechnicalImplementation.tsx
- Read: app/case-study.css

**Interfaces:**
- The tests describe the required DemoStatus data/default contract, the deduplicated primary/backup entry structure, the wide-screen content rail, and the responsive grid contracts.

- [ ] **Step 1: Write the failing test**

Create four focused Node tests. Keep the tests source-contract based, matching the repository's existing test style, and make each failure name the missing behavior:

~~~js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL("../" + relativePath, import.meta.url), "utf8");
}

test("Service Agent uses a live data default and collapses duplicate interactive entries", async () => {
  const caseSource = await read("content/flagship-cases/service-agent.ts");
  const types = await read("content/flagship-cases/types.ts");
  const gallery = await read("components/case-study/CaseEvidenceGallery.tsx");
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  assert.match(caseSource, /demoStatus:\s*"live"/);
  assert.match(types, /DemoStatus\s*=\s*"live"\s*\|\s*"fallback"/);
  assert.match(page, /resolveDemoStatus/);
  assert.match(page, /demoStatus=/);
  assert.match(gallery, /primaryInteractive/);
  assert.match(gallery, /backupInteractive/);
  assert.match(gallery, /备用模式/);
  assert.match(gallery, /kind !== "interactive"/);
});

test("technical implementation keeps the seven-point grid and wide final card", async () => {
  const component = await read("components/case-study/TechnicalImplementation.tsx");
  const css = await read("app/case-study.css");
  assert.match(component, /case-technical-grid/);
  assert.match(component, /case-technical-card-wide/);
  assert.match(css, /\.case-technical-grid[\s\S]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.case-technical-card-wide[\s\S]*grid-column:\s*1\s*\/\s*-1/);
});

test("iteration path is a bounded 3/2/1 responsive grid", async () => {
  const css = await read("app/case-study.css");
  assert.match(css, /\.iteration-path[\s\S]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /@media \(max-width: 1180px\)[\s\S]*\.iteration-path[\s\S]*repeat\(2/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.iteration-path[\s\S]*repeat\(1/);
  assert.match(css, /\.iteration-path[\s\S]*overflow-x:\s*visible/);
  assert.doesNotMatch(css, /\.iteration-path[\s\S]*overflow-x:\s*auto/);
});

test("wide-screen section navigation owns a separate sticky layout column", async () => {
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  const css = await read("app/case-study.css");
  assert.match(page, /case-content-layout/);
  assert.match(page, /case-content-main/);
  assert.match(css, /@media \(min-width: 1280px\)[\s\S]*case-content-layout[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(min-width: 1280px\)[\s\S]*case-section-nav[\s\S]*position:\s*sticky/);
});
~~~

- [ ] **Step 2: Run the new test to verify it fails**

Run from D:/360Downloads/Trae 项目/ZeH image/demonstratio:

~~~powershell
node --test tests/service-agent-case-layout.test.mjs
~~~

Expected: the test file runs but fails because demoStatus, resolveDemoStatus, primaryInteractive, case-technical-grid, the bounded iteration grid, and case-content-layout do not yet exist.

---

### Task 2: Implement the explicit demo-status default and one primary entry

**Files:**
- Modify: content/flagship-cases/types.ts:1-55
- Modify: content/flagship-cases/service-agent.ts:1-8
- Modify: components/case-study/FlagshipCasePage.tsx:14-27
- Modify: components/case-study/CaseEvidenceGallery.tsx:1-60
- Test: tests/service-agent-case-layout.test.mjs

**Interfaces:**
- DemoStatus: "live" | "fallback".
- FlagshipCaseStudy.demoStatus?: DemoStatus.
- resolveDemoStatus(defaultStatus: DemoStatus, override?: string): DemoStatus: returns override only for exact live or fallback; otherwise returns defaultStatus.
- CaseEvidenceGallery({ id, items, demoStatus? }): only collapses interactive entries when demoStatus is supplied by the Service Agent page.

- [ ] **Step 1: Add the smallest status contract**

In types.ts, define:

~~~ts
export type DemoStatus = "live" | "fallback";
~~~

Add demoStatus?: DemoStatus to FlagshipCaseStudy and export:

~~~ts
export function resolveDemoStatus(defaultStatus: DemoStatus, override = process.env.NEXT_PUBLIC_DEMO_STATUS): DemoStatus {
  return override === "live" || override === "fallback" ? override : defaultStatus;
}
~~~

Add demoStatus: "live" to the root of serviceAgentCase. Do not change its status, boundary, evidence IDs, URLs, or other copy.

- [ ] **Step 2: Pass the resolved status only to Service Agent evidence**

In FlagshipCasePage.tsx, import resolveDemoStatus and pass:

~~~tsx
<CaseEvidenceGallery
  id="evidence"
  items={evidence}
  demoStatus={study.demoStatus ? resolveDemoStatus(study.demoStatus) : undefined}
/>
~~~

Keep the six section components and their order unchanged.

- [ ] **Step 3: Collapse the duplicate interactive records**

In CaseEvidenceGallery.tsx, when demoStatus exists:

~~~tsx
const interactiveItems = safeItems.filter((item) => item.kind === "interactive");
const primaryInteractive = interactiveItems.find((item) =>
  demoStatus === "live" ? item.id === "service-agent-live-frontend" : item.id === "service-agent-controlled-demo",
);
const backupInteractive = interactiveItems.find((item) => item.id !== primaryInteractive?.id);
const evidenceItems = demoStatus ? safeItems.filter((item) => item.kind !== "interactive") : safeItems;
~~~

Render one case-demo-entry article containing one EvidenceMedia call and one CTA from primaryInteractive. Add a text-only backup note using backupInteractive; do not render a second EvidenceMedia or anchor for it. If the preferred ID is absent, use interactiveItems[0] as a defensive fallback. Leave the existing behavior unchanged when demoStatus is undefined for the other flagship cases.

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

~~~powershell
node --test tests/service-agent-case-layout.test.mjs
~~~

Expected: the first test passes; the remaining layout tests still fail.

---

### Task 3: Implement the technical 2 × 3 plus wide-card layout

**Files:**
- Modify: components/case-study/TechnicalImplementation.tsx:1-31
- Modify: app/case-study.css:194-236 and new technical-grid rules near the other flagship card rules
- Test: tests/service-agent-case-layout.test.mjs

**Interfaces:**
- The component consumes the existing study.technical.architecture, tradeoffs, and mechanisms arrays.
- It produces one case-technical-grid with all points preserved, assigning case-technical-card-wide only to an odd final card.

- [ ] **Step 1: Build a stable visual ordering without changing data**

Construct a local array by pairing architecture and tradeoff points by index, then append mechanisms. For Service Agent the sequence is architecture 1, tradeoff 1, architecture 2, tradeoff 2, mechanism 1, mechanism 2, mechanism 3. Each item carries the original NarrativePoint and a category label. Render:

~~~tsx
<div className="case-technical-grid">
  {technicalCards.map(({ point, label }, index) => (
    <article
      key={point.title}
      className={"case-narrative-card case-technical-card" + (
        index === technicalCards.length - 1 && technicalCards.length % 2 === 1
          ? " case-technical-card-wide"
          : ""
      )}
    >
      <span>{label}</span>
      <h3>{point.title}</h3>
      <p>{point.detail}</p>
      <small>证据：{point.evidenceRefs.join(" · ")}</small>
    </article>
  ))}
</div>
~~~

- [ ] **Step 2: Add scoped grid styles**

Add:

~~~css
.case-technical-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
}

.case-technical-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.case-technical-card small { margin-top: auto; }
.case-technical-card-wide { grid-column: 1 / -1; }
~~~

At max-width: 900px, retain 2 columns if space permits; at max-width: 720px, set one column and reset case-technical-card-wide grid-column to auto. Use minmax(0, 1fr) and min-width: 0 so long Chinese/English titles cannot widen the page.

- [ ] **Step 3: Run the focused test**

Run:

~~~powershell
node --test tests/service-agent-case-layout.test.mjs
~~~

Expected: the demo-entry and technical-grid tests pass; iteration and navigation tests remain red.

---

### Task 4: Implement the bounded iteration grid and no-overflow rule

**Files:**
- Modify: app/case-study.css:308-326 and responsive media queries near 513-536
- Test: tests/service-agent-case-layout.test.mjs

**Interfaces:**
- IterationPath.tsx remains data-driven over the existing IterationEntry[]; no copy or evidence ref changes.

- [ ] **Step 1: Replace the overflow grid**

Use:

~~~css
.iteration-path {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: visible;
}

.iteration-path > li {
  min-width: 0;
  height: 100%;
}
~~~

Replace the old --iteration-columns and min-width: 260px contract. Add:

~~~css
@media (max-width: 1180px) {
  .iteration-path { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 720px) {
  .iteration-path { grid-template-columns: 1fr; }
}
~~~

Remove the old horizontal-scroll override from the max-width: 900px block. Add .flagship-case { overflow-x: clip; } to make the page-level boundary explicit without changing global layout.

- [ ] **Step 2: Run the focused test**

Run:

~~~powershell
node --test tests/service-agent-case-layout.test.mjs
~~~

Expected: the iteration test passes; only navigation layout assertions remain red.

---

### Task 5: Implement the wide-screen sticky rail and responsive container

**Files:**
- Modify: components/case-study/FlagshipCasePage.tsx:18-27
- Modify: app/case-study.css:14-17, navigation rules near 112-152, and responsive blocks
- Test: tests/service-agent-case-layout.test.mjs

**Interfaces:**
- The six existing section IDs and CaseSectionNav API remain unchanged.
- case-content-layout owns the navigation column; case-content-main owns all six section elements.

- [ ] **Step 1: Add the page-local layout wrapper**

Keep CaseHero outside the wrapper. Change the article body to:

~~~tsx
<div className="case-content-layout section-shell">
  <CaseSectionNav items={CASE_SECTIONS} />
  <div className="case-content-main">
    <CaseOverview id="overview" project={project} study={study} />
    <BusinessContext id="business" study={study} />
    <ProductDesign id="product" study={study} />
    <TechnicalImplementation id="technical" study={study} />
    <IterationPath id="iterations" entries={study.iterations} />
    <CaseEvidenceGallery id="evidence" items={evidence} demoStatus={...} />
  </div>
</div>
~~~

Do not add or remove section IDs.

- [ ] **Step 2: Define independent rail and正文 columns only at 1280px**

Add:

~~~css
.case-content-layout {
  width: min(1120px, calc(100% - 48px));
}

.case-content-main { min-width: 0; }
.case-content-main > .flagship-section { width: 100%; margin-inline: 0; }
.case-content-layout > .case-section-nav-inner { width: 100%; }

@media (min-width: 1280px) {
  .case-content-layout {
    width: min(1240px, calc(100% - 72px));
    display: grid;
    grid-template-columns: 168px minmax(0, 1fr);
    gap: clamp(28px, 3vw, 48px);
    align-items: start;
  }

  .case-content-layout > .case-section-nav {
    position: sticky;
    top: 108px;
    height: auto;
    max-height: calc(100vh - 132px);
    overflow: auto;
    border: 1px solid var(--case-line);
    border-radius: 22px;
  }

  .case-content-layout > .case-section-nav .case-section-nav-inner {
    width: auto;
    height: auto;
    display: grid;
    justify-content: stretch;
    padding: 10px;
  }

  .case-content-layout > .case-section-nav a { justify-content: flex-start; }
}
~~~

At <1280px, the existing top sticky nav remains in normal document order. Keep the existing mobile top offsets and horizontal nav behavior. Ensure case-content-main has no transform or overflow that would change sticky positioning.

- [ ] **Step 3: Run the focused test**

Run:

~~~powershell
node --test tests/service-agent-case-layout.test.mjs
~~~

Expected: all new layout contract tests pass.

---

### Task 6: Run project gates and viewport evidence checks

**Files:**
- Read: all files changed in Tasks 2-5
- Create outside source tree if supported: artifacts/scs-case-page-layout-refine/ screenshots and verification notes

- [ ] **Step 1: Run TypeScript and focused regression tests**

~~~powershell
npm run lint
node --test tests/service-agent-case-layout.test.mjs
npm run test:cases
~~~

Expected: lint and the new layout tests pass. npm run test:cases should be interpreted against the baseline: the authority package resolver may still fail before the 20 passing case assertions if the external package is not mounted.

- [ ] **Step 2: Run the full repository test set**

~~~powershell
npm run test:v5
npm run test:guide
npm run test:cases
~~~

Expected: all tests unrelated to the external authority-package blocker pass; no existing assertion about section IDs, evidence IDs, public status, or planned evidence regresses.

- [ ] **Step 3: Build the production artifact**

~~~powershell
npm run build
~~~

Expected: Next production build exits 0.

- [ ] **Step 4: Capture the required viewport evidence**

Run the local production app and inspect /projects/service-agent at 1440, 1280, 1024, 768, and 390px. Record for each viewport:

- one and only one primary experience CTA;
- desktop rail only at 1440/1280, top nav at 1024/768/390;
- technical cards as 2×3 plus a spanning seventh card on desktop;
- iteration cards as 3×2, 2×3, and 1 column respectively;
- no clipped text, covered content, or document.documentElement.scrollWidth > document.documentElement.clientWidth.

Save screenshots and a short evidence table under artifacts/scs-case-page-layout-refine/ if the available browser tooling supports it. Do not upload or deploy.

- [ ] **Step 5: Inspect the final diff and status**

~~~powershell
git status --short
git diff --check
git diff --stat
~~~

Expected: only the approved case-page components, Service Agent demo-status field/types, scoped CSS, tests, and spec/plan documents are changed; no commit is created.
