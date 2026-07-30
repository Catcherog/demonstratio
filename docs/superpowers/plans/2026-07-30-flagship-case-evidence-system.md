# Flagship Case Evidence System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three flagship project pages with a recruiter-readable six-section evidence system that gives equal weight to product judgment and technical implementation, while keeping every public status, number, asset, video, and experience link bound to the R1.3 authority package.

**Architecture:** Keep `content/projects.ts` as the shared project index, add a typed flagship-case narrative layer for the three flagship slugs, and extend the existing evidence catalog instead of creating a parallel source. The dynamic route selects the new renderer only for the three flagship cases and preserves the existing renderer for supporting projects. A compact client-side section navigator observes server-rendered sections; all substantive content remains server-rendered and indexable.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS, Node built-in test runner, existing portfolio consistency gate.

## Global Constraints

- Implementation workspace: `D:\360Downloads\Trae 项目\ZeH image\.worktrees\flagship-evidence-plan-r1` on branch `codex/flagship-evidence-plan-r1`.
- Design baseline: `docs/superpowers/specs/2026-07-30-flagship-case-evidence-system-design.md` at commit `8cf2ac6`.
- Sole external authority: `D:\360Downloads\Trae 项目\_portfolio_handoff\job-ready-r1.3`.
- Authority order is fixed: `01-PUBLIC-SOURCE-OF-TRUTH.yaml` → `02-CLAIMS-EVIDENCE-MATRIX.md` → reports `12`–`16` → non-conflicting prohibitions in `06-PROHIBITED-CLAIMS.md`. Files `05` and `07` are historical context only.
- Do not publish a numeric value unless it has a `claimId`, a matching `evidenceRef`, and an exact value/label binding in the authority package.
- `16/16 smoke` and `Turn 2 3/3` remain internal verification details until the claims matrix assigns public bindings. Public UI may say only “Phase G 已验证”.
- Never turn an offline evaluation, controlled demo, Test Base, local test, or read-only production inspection into a production-quality or accuracy claim.
- Preserve the fixed section order: 项目概览 → 业务判断 → 产品方案 → 技术实现 → 迭代链路 → 项目证据.
- Product and technical sections must have equal visual weight. Do not collapse either into a small aside.
- Use the approved website palette: paper `#F2EEE4`, surface `#FBF8F1`, ink `#1C1820`, plum `#4F4054`, lilac `#B9A7C1`, soft lilac `#E7DDE9`, sage `#718C7B`, line `#D4CCC1`.
- The section navigation is compact, pale, and no taller than 44 px on desktop. It must not use a black or near-black background.
- No fabricated screenshots, videos, customer records, production UI states, or interactive controls. Missing media is represented as `planned` and visibly labelled “待补素材”.
- Exclude or redact Base IDs, table IDs, chat/open IDs, personal names, phone numbers, customer records, local absolute paths, account identifiers, environment IDs, tokens, JWTs, and unapproved third-party screenshots.
- Do not modify the external authority directory. Do not deploy, push, change DNS, update live environment variables, or call real write APIs under this plan.
- After every task: run the task-specific test, inspect `git diff --check`, and commit only the files listed in that task.

## Public Content Contract

Use these exact current status lines:

| Slug | Public status | Boundary that must remain visible |
| --- | --- | --- |
| `data-platform` | `Portfolio Pilot｜真实测试 Base E2E 已验证，生产 V2 Schema 表级匹配通过（10/10），正式业务 Pilot 待启用` | `10 表 / 216 字段` is a read-only production inspection; field-level diff and production writes remain incomplete. Historical `17 / 12` belongs to the Test Base baseline. |
| `service-agent` | `Controlled Demo｜后端已上线 CloudBase Deploy 039（Phase G 验证通过），前端仍指向 Render 静态降级` | Backend and public frontend are different availability surfaces. Safety is provisional; availability is degraded; latency and knowledge coverage still need improvement. |
| `lumen-ink` | `Live Demo｜真实 Provider 编辑已验证` | Only Seedream 4.5 text-to-image and image-to-image were verified `2/2`; liquefy, heal, erase, and other modes remain unverified. |

Synchronize `content/public-claims.json` to 21 metric-bearing bindings:

- Hero: 4.
- Data platform: 5, including `FEISHU-LIVE-SCHEMA = 10/10` and `FEISHU-LIVE-TABLE-COUNT = 10 / 216`.
- Service Agent: 7, including `SCS-REGRESSION-COUNT = 661` and `SCS-R2-EVAL-DIMENSIONS = 7`.
- Lumen: 5, including `LUMEN-EDIT-VERIFY = 2/2`.

## Component Interfaces

`FlagshipCasePage`

- Consumes: one `Project`, one `FlagshipCaseStudy`, and public-safe `PortfolioEvidence[]` for the same slug.
- Produces: one server-rendered article with exactly six addressable sections and one compact section navigator.
- Error behavior: unsupported slug stays on the legacy page; an evidence reference mismatch fails the consistency gate rather than silently rendering.

`CaseSectionNav`

- Consumes: the six fixed `{ id, label }` entries.
- Produces: anchor navigation with one `aria-current="location"` item, updated by `IntersectionObserver`.
- Error behavior: if `IntersectionObserver` is unavailable, anchors still work and the first item remains selected.

`CaseEvidenceGallery`

- Consumes: public-safe evidence records for one case.
- Produces: image, video, experience, architecture, test, and document cards with explicit state and boundary copy.
- Error behavior: `planned` and `unavailable` never create playable or clickable primary controls; broken available media shows its text fallback and optional verified alternate link.

---

## Task 1: Lock Authority Resolution and Public Claim Synchronization

**Files:**

- Create: `scripts/lib/portfolio-authority.mjs`
- Create: `tests/flagship-authority-contract.test.mjs`
- Modify: `scripts/consistency-gate.mjs`
- Modify: `content/public-claims.json`
- Modify: `package.json`

- [ ] **Step 1: Write the failing authority and claim contract tests**

Create `tests/flagship-authority-contract.test.mjs` with tests that:

1. Build a temporary authority fixture and prove `PORTFOLIO_AUTHORITY_DIR` wins over fallback paths.
2. Parse the external `01-PUBLIC-SOURCE-OF-TRUTH.yaml` as JSON when it is available.
3. Filter `public_numeric_bindings` to entries with both `metric_value` and `metric_label`.
4. Assert the 21 repository claims match authority by `claimId`, value, label, and `evidenceRef`.
5. Assert surface counts equal `{ hero: 4, "data-platform": 5, "service-agent": 7, "lumen-ink": 5 }`.
6. Assert no claim uses `16/16`, `3/3`, `52/90`, an accuracy percentage, or `589`.

The core fixture should look like:

```js
const authority = {
  package: { id: "job-ready-r1.3", current_public_baseline: "R1.3" },
  public_numeric_bindings: [
    {
      id: "FEISHU-LIVE-SCHEMA",
      metric_value: "10/10",
      metric_label: "生产 V2 表级匹配",
      evidence_ref: "E-FEISHU-LIVE-SCHEMA",
    },
  ],
};
```

- [ ] **Step 2: Run the tests and confirm the expected failure**

Run:

```powershell
npm run test:cases
```

Expected: the script is missing or the new tests fail because the resolver and three new claims do not exist and `589` is still present.

- [ ] **Step 3: Implement one reusable authority resolver**

Create `scripts/lib/portfolio-authority.mjs` with these exports:

```js
export const AUTHORITY_FILENAME = "01-PUBLIC-SOURCE-OF-TRUTH.yaml";
export function getAuthorityCandidates(cwd = process.cwd(), env = process.env) {}
export function resolveAuthorityDir(cwd = process.cwd(), env = process.env) {}
export function loadPublicAuthority(cwd = process.cwd(), env = process.env) {}
export function getMetricBindings(authority) {}
```

Resolution order:

1. `PORTFOLIO_AUTHORITY_DIR` when supplied.
2. `../../../_portfolio_handoff/job-ready-r1.3` for `.worktrees/*` checkouts.
3. `../../_portfolio_handoff/job-ready-r1.3` for the main `demonstratio` checkout.
4. `../_portfolio_handoff/job-ready-r1.3` only as a final local fallback.

Throw one actionable error containing all checked absolute paths when no candidate contains the authority file. Do not silently select `job-ready-r1.3.1` or another package.

- [ ] **Step 4: Synchronize the metric manifest**

Update `content/public-claims.json` exactly as follows:

- Change `FEISHU-LIVE-SCHEMA` from `FAIL-CLOSED` / `生产 Schema 状态` to `10/10` / `生产 V2 表级匹配` and use `E-FEISHU-LIVE-SCHEMA`.
- Add `FEISHU-LIVE-TABLE-COUNT` with `10 / 216`, `生产 V2 表 / 字段`, `E-FEISHU-LIVE-SCHEMA`.
- Change `SCS-REGRESSION-COUNT` from `589` to `661`, retain the label `pytest 全量回归`, and make the note explicitly say it is an engineering regression count, not accuracy.
- Add `SCS-R2-EVAL-DIMENSIONS` with `7`, `R2 评测维度`, `E-SCS-R2-EVAL`.
- Add `LUMEN-EDIT-VERIFY` with `2/2`, `Seedream 4.5 编辑验证`, `E-LUMEN-EDIT`.

Do not add the report-only `16/16` or `3/3` values.

- [ ] **Step 5: Make the existing consistency gate consume the resolver**

Remove duplicated candidate-search logic from `scripts/consistency-gate.mjs`. Import `loadPublicAuthority()` and assert:

```js
assert.equal(authority.package.id, "job-ready-r1.3");
assert.equal(authority.package.current_public_baseline, "R1.3");
assert.equal(authority.package.authority_status, "PHASE_G_CLOSED_PROVISIONAL_PASS");
```

Replace the hard-coded 18-claim contract with authority-derived metric bindings and the 21-claim surface counts above.

- [ ] **Step 6: Add the test script and run the gates**

Add to `package.json`:

```json
"test:cases": "node --test tests/flagship-authority-contract.test.mjs"
```

```powershell
npm run test:cases
npm run check:portfolio
npm run lint
```

Expected: all pass; `check:portfolio` reports 21 structured claims from package `job-ready-r1.3`.

- [ ] **Step 7: Commit the authority layer**

```powershell
git add scripts/lib/portfolio-authority.mjs tests/flagship-authority-contract.test.mjs scripts/consistency-gate.mjs content/public-claims.json package.json
git diff --cached --check
git commit -m "feat: bind flagship claims to r1.3 authority"
```

---

## Task 2: Add the Typed Six-Section Case Narrative Model

**Files:**

- Create: `content/flagship-cases/types.ts`
- Create: `content/flagship-cases/data-platform.ts`
- Create: `content/flagship-cases/service-agent.ts`
- Create: `content/flagship-cases/lumen-ink.ts`
- Create: `content/flagship-cases/index.ts`
- Create: `tests/flagship-case-contract.test.mjs`
- Modify: `content/projects.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing case-structure test**

Create `tests/flagship-case-contract.test.mjs`. Read the five source files and assert:

- The registry contains only `data-platform`, `service-agent`, and `lumen-ink`.
- Every case defines the six section keys `overview`, `business`, `product`, `technical`, `iterations`, and `evidenceIds`.
- Every case contains at least two business judgments, two product decisions, two technical mechanisms, three iteration entries, and four evidence IDs.
- Every public number is represented as a claim ID, never duplicated as a free-form metric field.
- Exact status lines match the Public Content Contract.
- Service Agent source contains `Phase G 已验证` but not `16/16`, `3/3`, `52/90`, `589`, or `准确率`.
- Data platform clearly separates historical Test Base `17 / 12` from production read-only `10 / 216`.
- Lumen states that only two Seedream edit operations are verified.

Update `test:cases` in `package.json` so it runs both contract files:

```json
"test:cases": "node --test tests/flagship-authority-contract.test.mjs tests/flagship-case-contract.test.mjs"
```

- [ ] **Step 2: Run the test and confirm it fails**

```powershell
node --test tests/flagship-case-contract.test.mjs
```

Expected: failure because the typed case files do not exist.

- [ ] **Step 3: Define the domain types**

Use this contract in `content/flagship-cases/types.ts`:

```ts
export type FlagshipSlug = "data-platform" | "service-agent" | "lumen-ink";
export type CaseSectionId =
  | "overview"
  | "business"
  | "product"
  | "technical"
  | "iterations"
  | "evidence";

export interface NarrativePoint {
  title: string;
  detail: string;
  evidenceRefs: string[];
}

export interface IterationEntry {
  version: string;
  trigger: string;
  productChange: string;
  technicalChange: string;
  result: string;
  boundary: string;
  evidenceRefs: string[];
}

export interface FlagshipCaseStudy {
  slug: FlagshipSlug;
  overview: {
    oneLine: string;
    responsibility: string;
    status: string;
    boundary: string;
    claimIds: string[];
  };
  business: {
    whyBuild: string;
    signals: NarrativePoint[];
    judgments: NarrativePoint[];
    constraints: string[];
  };
  product: {
    form: string;
    users: string[];
    workflow: NarrativePoint[];
    decisions: NarrativePoint[];
    nonGoals: string[];
  };
  technical: {
    architecture: NarrativePoint[];
    mechanisms: NarrativePoint[];
    tradeoffs: NarrativePoint[];
  };
  iterations: IterationEntry[];
  evidenceIds: string[];
}
```

Keep evidence references on every factual point. Do not store raw customer data or internal identifiers in these files.

- [ ] **Step 4: Author the three evidence-bound narratives**

`data-platform.ts` must cover:

- Why: fragmented lead, order, project, and delivery data prevented one operational view.
- Business judgment: stabilize intake, identity, governance, and audit before expanding automation.
- Product form: data platform plus operational views and a controlled portal entry.
- Technical focus: source ingestion, idempotency, schema mapping, redaction, audit, exact cleanup, and fail-closed production writes.
- Iteration chain: historical V1 Test Base → E2E cleanup verification → V2 table-set alignment → field diff and formal Pilot boundary.
- Claims: `FEISHU-TABLE-COUNT`, `FEISHU-AUTOMATION-COUNT`, `FEISHU-TEST-E2E`, `FEISHU-LIVE-SCHEMA`, `FEISHU-LIVE-TABLE-COUNT`.

`service-agent.ts` must cover:

- Why: customer-service answers require both useful retrieval and deterministic risk boundaries.
- Business judgment: distinguish ordinary consultation, high-risk requests, and unsupported questions; handoff quality is a product outcome.
- Product form: B1/B2/B3 controlled scenarios, evidence-bearing answers, human handoff, and knowledge-gap recovery.
- Technical focus: LangGraph 8/11, N03.5 query resolution, multi-query retrieval, evidence/context dual gate, R0–R3 fail-closed policy.
- Iteration chain: static controlled demo → Deploy 028 safe baseline → Deploy 031/032 regression discovery → Deploy 039 Phase G validated → production hardening.
- Claims: `SCS-WORKFLOW-SHAPE`, `SCS-REGRESSION-COUNT`, `SCS-RISK-TAXONOMY`, `SCS-SCENARIO-TAXONOMY`, `SCS-AUDIT-DATASET`, `SCS-DEPLOYED-SHA`, `SCS-R2-EVAL-DIMENSIONS`.

`lumen-ink.ts` must cover:

- Why: professional image workflows need repeatable control, provider isolation, and recoverable task history rather than one-shot generation.
- Business judgment: validate a narrow real edit path before claiming the full tool set.
- Product form: workbench, structured prompt, generation/edit task, result review, and history.
- Technical focus: provider adapter, task state, storage/persistence boundary, error handling, authorization, and recovery ownership.
- Iteration chain: local workbench → preview read path → production health/auth checks → Seedream 4.5 text-to-image and image-to-image `2/2` → unverified modes remain closed.
- Claims: `LUMEN-PROVIDER-COUNT`, `LUMEN-TOOL-COUNT`, `LUMEN-PROMPT-SECTIONS`, `LUMEN-ABSTRACTION-COUNT`, `LUMEN-EDIT-VERIFY`.

- [ ] **Step 5: Export a strict registry**

In `content/flagship-cases/index.ts`:

```ts
const flagshipCases = {
  "data-platform": dataPlatformCase,
  "service-agent": serviceAgentCase,
  "lumen-ink": lumenInkCase,
} satisfies Record<FlagshipSlug, FlagshipCaseStudy>;

export function getFlagshipCaseStudy(slug: string) {
  return flagshipCases[slug as FlagshipSlug];
}

export const flagshipCaseStudies = Object.values(flagshipCases);
```

- [ ] **Step 6: Synchronize shared project summaries**

Update the three objects in `content/projects.ts` so homepage cards, project library cards, metadata, and legacy consumers use the current status lines. Replace stale Service Agent `589`, stale “后端修复中”, stale Lumen “真实编辑待验证”, and stale Feishu “缺生产只读权限” language. Keep the compact summaries natural and recruiter-facing; avoid formulaic “不是……而是……” copy.

- [ ] **Step 7: Run tests and commit**

```powershell
npm run test:cases
npm run test:v5
npm run lint
git diff --check
git add content/flagship-cases content/projects.ts tests/flagship-case-contract.test.mjs package.json
git commit -m "feat: add evidence-bound flagship case narratives"
```

Expected: all tests pass and all three case files satisfy the typed contract.

---

## Task 3: Extend the Existing Evidence Catalog and Remove Unsafe Public Assets

**Files:**

- Modify: `content/portfolio-evidence.ts`
- Modify: `lib/portfolio-guide/core.mjs`
- Modify: `tests/portfolio-guide.test.mjs`
- Modify: `tests/flagship-case-contract.test.mjs`
- Modify: `content/projects.ts`
- Create: `public/evidence/data-platform/closed-loop.svg`
- Create: `public/evidence/service-agent/risk-workflow.svg`
- Create: `public/evidence/lumen/provider-boundary.svg`

- [ ] **Step 1: Add failing evidence-state and asset-safety tests**

Extend the tests to assert:

- `EvidenceState` is exactly `available | planned | unavailable`; `mock` no longer exists.
- Production guide retrieval includes only public-safe `available` evidence.
- Preview rendering may display `planned` cards, but those cards have no `href` or playable `assetUrl`.
- Every available local asset starts with `/evidence/` or is an individually approved Lumen UI screenshot.
- No evidence record references the current Service Agent `01.webp`–`07.webp` set or the current data-platform `01.webp` screenshot.
- No source contains a local drive path, Feishu Base/table ID pattern, email address, phone number, bearer token, JWT, or account identifier.

Run:

```powershell
npm run test:guide
npm run test:cases
```

Expected: failure because `mock` and unsafe legacy image references still exist.

- [ ] **Step 2: Extend `PortfolioEvidence` without creating a second catalog**

Change the interface to:

```ts
export type EvidenceState = "available" | "planned" | "unavailable";

export interface PortfolioEvidence {
  id: string;
  projectSlug: string;
  kind: EvidenceKind;
  title: string;
  summary: string;
  state: EvidenceState;
  publicSafe: boolean;
  evidenceRefs: string[];
  status: string;
  scope: string;
  boundary: string;
  assetUrl?: string;
  thumbnailUrl?: string;
  href?: string;
  fallbackHref?: string;
  verifiedAt?: string;
  durationSeconds?: number;
  chapters?: Array<{ label: string; seconds: number }>;
  transcript?: string;
  tags?: string[];
  roleWeights?: Record<GuideRole, number>;
}
```

Make `buildEvidence` reject an available record with no evidence reference and reject a planned record with a live primary control.

- [ ] **Step 3: Define the evidence inventory**

Use at least these IDs:

| Case | Available now | Planned, visibly non-interactive |
| --- | --- | --- |
| Data platform | `data-platform-closed-loop`, `data-platform-schema-verification`, `data-platform-e2e-verification` | `data-platform-portal-entry`, `data-platform-walkthrough` |
| Service Agent | `service-agent-risk-workflow`, `service-agent-phase-g-summary`, `service-agent-controlled-demo` | `service-agent-live-frontend`, `service-agent-walkthrough` |
| Lumen | `lumen-workbench`, `lumen-provider-boundary`, `lumen-edit-verification`, `lumen-live-entry` | `lumen-walkthrough` |

The Service Agent controlled demo links to the existing public frontend and states that it is a static B1/B2/B3 fallback still pointing to Render. The Lumen live entry links to the verified public URL and states the two-operation boundary. The data-platform portal remains planned until a public-safe route exists.

- [ ] **Step 4: Create safe derived diagrams**

Create three editorial SVGs using only public labels and approved colors:

- Data platform: Sources → Ingest → Govern → Operational views, with read-only production schema and fail-closed write boundary.
- Service Agent: Input → Risk classification → Query resolution → Retrieval → supported answer or human handoff.
- Lumen: Workbench → Task → Provider adapter → Result/history, with a visible verified/unverified mode split.

Each SVG must include a `<title>` and `<desc>`, use no embedded raster data, and contain no identifier from the authority package. These are explanatory architecture artifacts, not screenshots; label them accordingly in the gallery.

- [ ] **Step 5: Stop publishing unsafe or misleading images**

Update the three flagship `images` arrays in `content/projects.ts`:

- Data platform cover uses `/evidence/data-platform/closed-loop.svg`.
- Service Agent cover uses `/evidence/service-agent/risk-workflow.svg`.
- Lumen may keep its first product UI screenshot only after manual visual review confirms no secret, personal data, unverified status, or stale feature claim; otherwise use `/evidence/lumen/provider-boundary.svg`.

Do not delete legacy files in this task. Removing their references is sufficient and preserves recoverability. A later asset-cleanup change can delete them after deployment verification.

- [ ] **Step 6: Update guide filtering semantics**

In `lib/portfolio-guide/core.mjs`:

- Production: return only `publicSafe && state === "available"` with non-empty evidence refs.
- Preview/development: also return `planned` records for display, but retrieval sources and outbound controls still use only `available` records.
- Remove all `mock` handling and update test names from “mocks” to “planned evidence”.

- [ ] **Step 7: Verify and commit**

```powershell
npm run test:guide
npm run test:cases
npm run lint
git diff --check
git add content/portfolio-evidence.ts content/projects.ts lib/portfolio-guide/core.mjs tests/portfolio-guide.test.mjs tests/flagship-case-contract.test.mjs public/evidence
git commit -m "feat: make flagship evidence public-safe and stateful"
```

---

## Task 4: Introduce the Flagship Renderer Without Regressing Supporting Projects

**Files:**

- Create: `components/case-study/FlagshipCasePage.tsx`
- Create: `components/case-study/LegacyProjectPage.tsx`
- Create: `components/case-study/CaseHero.tsx`
- Create: `components/case-study/CaseOverview.tsx`
- Create: `components/case-study/BusinessContext.tsx`
- Create: `components/case-study/ProductDesign.tsx`
- Create: `components/case-study/TechnicalImplementation.tsx`
- Create: `components/case-study/IterationPath.tsx`
- Create: `components/case-study/CaseSectionNav.tsx`
- Create: `components/case-study/CaseEvidenceGallery.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `tests/flagship-case-contract.test.mjs`

- [ ] **Step 1: Add a failing route-selection contract**

Assert the route:

- Calls `getFlagshipCaseStudy(slug)`.
- Renders `FlagshipCasePage` only when a flagship case exists.
- Renders `LegacyProjectPage` for every other existing project.
- Keeps `generateStaticParams()` and metadata generation data-driven from `projects`.
- Preserves the current `notFound()` behavior for unknown slugs.

Run `npm run test:cases`; expect failure.

- [ ] **Step 2: Extract the existing page unchanged**

Move the current generic project-page JSX and its previous/next navigation into `components/case-study/LegacyProjectPage.tsx`. Do not redesign supporting projects in this task. The component consumes `project`, `previous`, and `next`.

- [ ] **Step 3: Build the six server-rendered sections**

`FlagshipCasePage` renders:

```tsx
<article className="flagship-case">
  <CaseHero project={project} study={study} />
  <CaseSectionNav items={CASE_SECTIONS} />
  <CaseOverview id="overview" study={study} />
  <BusinessContext id="business" study={study} />
  <ProductDesign id="product" study={study} />
  <TechnicalImplementation id="technical" study={study} />
  <IterationPath id="iterations" entries={study.iterations} />
  <CaseEvidenceGallery id="evidence" items={evidence} />
</article>
```

Every section needs an `h2`, a concise lead, and structured cards. Product and technical components use the same outer grid and card density. Avoid repetitive heading formulas and excessive badges. In this task, `CaseSectionNav` is a server-rendered six-anchor row and `CaseEvidenceGallery` is a public-safe text-card renderer; Tasks 5 and 6 progressively enhance them without changing their public props.

- [ ] **Step 4: Select the renderer in the route**

The route body becomes conceptually:

```tsx
const study = getFlagshipCaseStudy(slug);
if (study) {
  return (
    <FlagshipCasePage
      project={project}
      study={study}
      evidence={evidenceByProject[slug] ?? []}
    />
  );
}
return <LegacyProjectPage project={project} previous={previous} next={next} />;
```

- [ ] **Step 5: Run structural verification and commit**

```powershell
npm run test:cases
npm run test:v5
npm run lint
npm run build -- --webpack
git diff --check
git add app/projects/[slug]/page.tsx components/case-study tests/flagship-case-contract.test.mjs
git commit -m "feat: render six-section flagship case pages"
```

Expected: three flagship routes build with the new renderer; a supporting project such as `/projects/wechat-bot` still builds with the legacy renderer.

---

## Task 5: Add the Compact Pale Active Section Navigation

**Files:**

- Modify: `components/case-study/CaseSectionNav.tsx`
- Modify: `components/case-study/FlagshipCasePage.tsx`
- Modify: `tests/flagship-case-contract.test.mjs`

- [ ] **Step 1: Add failing navigation contracts**

Assert:

- Labels appear once and in the exact approved order.
- Anchors target `#overview`, `#business`, `#product`, `#technical`, `#iterations`, and `#evidence`.
- The component uses `IntersectionObserver` and `aria-current="location"`.
- It includes a no-observer fallback.
- Section elements use `scroll-margin-top` via the case stylesheet.

- [ ] **Step 2: Implement the client component**

Use one client component with:

```ts
const CASE_SECTIONS = [
  ["overview", "项目概览"],
  ["business", "业务判断"],
  ["product", "产品方案"],
  ["technical", "技术实现"],
  ["iterations", "迭代链路"],
  ["evidence", "项目证据"],
] as const;
```

Observer configuration:

```ts
{ rootMargin: "-132px 0px -58% 0px", threshold: [0, 0.2, 0.6] }
```

Choose the intersecting section nearest the top boundary. On click, update the URL hash through native anchor behavior; do not intercept keyboard navigation. Use `aria-label="案例板块导航"` on the nav.

- [ ] **Step 3: Verify and commit**

```powershell
npm run test:cases
npm run lint
git diff --check
git add components/case-study/CaseSectionNav.tsx components/case-study/FlagshipCasePage.tsx tests/flagship-case-contract.test.mjs
git commit -m "feat: add active flagship section navigation"
```

---

## Task 6: Build the Mixed Evidence Gallery, Video State, and Experience Entries

**Files:**

- Modify: `components/case-study/CaseEvidenceGallery.tsx`
- Create: `components/case-study/EvidenceMedia.tsx`
- Modify: `components/case-study/FlagshipCasePage.tsx`
- Modify: `tests/flagship-case-contract.test.mjs`

- [ ] **Step 1: Add failing rendering-safety tests**

Assert source contracts for:

- `planned` cards render the text “待补素材”.
- `planned` and `unavailable` branches do not render `<video>`, live `<iframe>`, or a primary outbound link.
- Video uses `controls`, `preload="metadata"`, a poster, a transcript/summary, and no `autoPlay`.
- Interactive evidence uses an external `<a>` with `target="_blank"` and `rel="noreferrer"`, never an embedded credential-bearing iframe.
- Available images have meaningful `alt`; architecture SVGs are described as diagrams, not live screenshots.
- Every evidence card shows state, verification date, scope, boundary, and evidence reference.

- [ ] **Step 2: Implement evidence-kind rendering**

Render the six kinds as follows:

- `image`: responsive image with click-to-zoom only when the asset is available and public-safe.
- `video`: native video with controls, poster, duration, chapter list, and text fallback.
- `interactive`: a bounded experience card with “打开体验” and a separate boundary sentence.
- `architecture`: safe SVG or structured diagram with source evidence refs.
- `test`: human-readable verification summary; never imply test count equals product quality.
- `document`: report summary plus approved public route only; do not link local files.

Do not render `publicSafe=false` records in any environment.

- [ ] **Step 3: Implement explicit failure behavior**

`EvidenceMedia` keeps local state for media load failure. On error:

- Replace the failed media with title, summary, and boundary.
- Offer `fallbackHref` only if the evidence record is `available` and the alternate route is verified.
- Preserve the evidence reference so a recruiter still understands what was verified.

- [ ] **Step 4: Verify and commit**

```powershell
npm run test:cases
npm run test:guide
npm run lint
git diff --check
git add components/case-study/CaseEvidenceGallery.tsx components/case-study/EvidenceMedia.tsx components/case-study/FlagshipCasePage.tsx tests/flagship-case-contract.test.mjs
git commit -m "feat: add bounded media and experience evidence"
```

---

## Task 7: Apply the Approved Visual System and Responsive Layout

**Files:**

- Create: `app/case-study.css`
- Modify: `app/layout.tsx`
- Modify: `tests/flagship-case-contract.test.mjs`

- [ ] **Step 1: Add failing visual-token contracts**

Assert `case-study.css` contains all eight approved color values and does not set the section nav background to `#000`, `#111`, `#171b27`, or `#1C1820`.

Assert these structural rules exist:

- `.case-section-nav` maximum desktop height `44px`.
- Desktop sticky top `92px` below the fixed 66 px header plus its top offset.
- Mobile sticky top `76px` below the 58 px header.
- `.flagship-section { scroll-margin-top: 148px; }` on desktop.
- Product and technical content share the same grid declaration.
- Mobile navigation uses horizontal overflow and does not wrap into multiple rows.
- Focus-visible styles use plum or sage with sufficient contrast.

- [ ] **Step 2: Create the scoped stylesheet**

Start with:

```css
.flagship-case {
  --case-paper: #F2EEE4;
  --case-surface: #FBF8F1;
  --case-ink: #1C1820;
  --case-plum: #4F4054;
  --case-lilac: #B9A7C1;
  --case-lilac-soft: #E7DDE9;
  --case-sage: #718C7B;
  --case-line: #D4CCC1;
  color: var(--case-ink);
  background: var(--case-paper);
}
```

Desktop layout:

- Content width: `min(1120px, calc(100% - 48px))`.
- Text measure: 62–72 characters for narrative paragraphs.
- Section padding: 88–104 px.
- Product and technical sections: identical two-column grid, one lead column plus one evidence/detail column.
- Iteration chain: horizontal at 1200 px and stacked below 900 px.
- Evidence grid: two columns, with one featured item allowed to span both.

Navigation:

- Surface background `rgba(251, 248, 241, .94)`.
- Border `#D4CCC1`; subtle shadow only.
- Active item uses `#4F4054` text and `#E7DDE9` background.
- Height no more than 44 px; item labels stay single-line.

Mobile below 720 px:

- Page gutters 18 px.
- Section padding 60–68 px.
- Nav uses `overflow-x: auto`, hidden decorative scrollbar, and 40 px minimum tap height.
- All grids collapse to one column.
- Evidence media keeps intrinsic ratio and never causes horizontal overflow.

- [ ] **Step 3: Import the stylesheet after global styles**

Add `import "./case-study.css";` to `app/layout.tsx`. Keep selectors under `.flagship-case` or `.case-section-nav` so supporting pages are unchanged.

- [ ] **Step 4: Verify and commit**

```powershell
npm run test:cases
npm run test:v5
npm run lint
npm run build -- --webpack
git diff --check
git add app/case-study.css app/layout.tsx tests/flagship-case-contract.test.mjs
git commit -m "style: align flagship cases with the paper palette"
```

---

## Task 8: Synchronize Homepage Summaries and the AI Portfolio Guide

**Files:**

- Modify: `lib/portfolio-guide.ts`
- Modify: `lib/portfolio-guide/core.mjs`
- Modify: `tests/portfolio-guide.test.mjs`
- Modify: `tests/v5-home-contract.test.mjs`
- Modify: `scripts/consistency-gate.mjs`
- Review: `components/home/FeaturedCases.tsx`

- [ ] **Step 1: Add failing cross-surface consistency tests**

Assert:

- Homepage featured cards show the same three current status lines used by the detail pages.
- AI guide documents include the six case sections for all three flagship slugs.
- Guide sources cite evidence IDs and never expose `planned` evidence as a source.
- Stale phrases are absent across `content`, `components`, `app`, and guide documents: `589`, `后端修复中`, `真实编辑待验证`, `缺少生产只读权限`, `52/90`, and any public accuracy percentage.
- The guide distinguishes Service Agent backend Deploy 039 from the public frontend’s Render fallback.
- The guide distinguishes Feishu historical Test Base numbers from current read-only production schema inspection.

- [ ] **Step 2: Build guide documents from the flagship narrative layer**

In `lib/portfolio-guide.ts`, add six structured documents per flagship case. Each document contains:

```ts
{
  id: `${study.slug}:${sectionId}`,
  projectSlug: study.slug,
  section: sectionId,
  title: `${project.title} · ${sectionLabel}`,
  content: normalizedPublicText,
  evidenceIds: availableEvidenceIds,
}
```

Do not change the public guide API. Retrieval continues to rank role relevance, topic match, and evidence-backed content. The generated fallback response must cite only retrieved, available, public-safe evidence.

- [ ] **Step 3: Keep homepage cards data-driven**

`FeaturedCases.tsx` should continue reading from `projects`. Change it only if needed to prevent duplicated status strings or to surface one short boundary line. Do not hard-code case-specific facts in the component.

- [ ] **Step 4: Expand the consistency gate**

Add checks that:

- Every flagship `overview.claimIds` entry exists in `public-claims.json`.
- Every narrative `evidenceRefs` entry exists in the authority catalog.
- Every `evidenceId` resolves to the same project slug.
- All three public surfaces—homepage, detail page data, and guide documents—derive status from `projects.ts` or the same case registry.
- Prohibited/stale phrase scanning covers generated guide text.

- [ ] **Step 5: Verify and commit**

```powershell
npm run test:v5
npm run test:guide
npm run test:cases
npm run check:portfolio
npm run lint
git diff --check
git add lib/portfolio-guide.ts lib/portfolio-guide/core.mjs tests/portfolio-guide.test.mjs tests/v5-home-contract.test.mjs scripts/consistency-gate.mjs components/home/FeaturedCases.tsx
git commit -m "feat: synchronize flagship evidence across public surfaces"
```

If `FeaturedCases.tsx` has no required diff, omit it from `git add`.

---

## Task 9: Full Build, Browser Verification, and GPT Handoff

**Files:**

- Create: `docs/verification/2026-07-30-flagship-case-evidence-verification.md`
- Modify only if a gate reveals a defect: files owned by Tasks 1–8.

- [ ] **Step 1: Run the complete deterministic gate set**

```powershell
npm run test:v5
npm run test:guide
npm run test:cases
npm run check:portfolio
npm run lint
npm run build -- --webpack
git diff --check
```

Expected:

- V5 homepage contract: all pass.
- Guide contract: all pass.
- Flagship authority and case contracts: all pass.
- Portfolio consistency gate: 21 structured claims, exact authority package `job-ready-r1.3`, no prohibited claim.
- TypeScript: zero errors.
- Next.js webpack build: success for all static project routes.

- [ ] **Step 2: Start a local server for browser verification**

```powershell
npm run dev
```

Verify these URLs at 1440 × 1000, 768 × 1024, and 390 × 844:

- `http://localhost:3000/projects/data-platform`
- `http://localhost:3000/projects/service-agent`
- `http://localhost:3000/projects/lumen-ink`
- `http://localhost:3000/projects/wechat-bot`
- `http://localhost:3000/#featured`

- [ ] **Step 3: Verify recruiter comprehension and section behavior**

For each flagship page confirm:

1. The title, role, current status, and boundary are understandable above the fold.
2. The six-section navigator is visible, pale, no taller than 44 px on desktop, and shows the current section.
3. Clicking all six items lands with the section heading unobscured by the fixed header.
4. Product and technical sections have comparable weight and density.
5. The business section answers why the project was built and what judgment changed the direction.
6. The product section shows form, user flow, product decisions, and non-goals.
7. The technical section shows architecture, key mechanisms, tradeoffs, and fail-closed boundaries.
8. The iteration section connects trigger → product change → technical change → verified result → remaining boundary.
9. Available evidence is operable; planned video/experience cards are visibly non-operable.
10. There is no horizontal overflow or multi-row nav at 390 px.

- [ ] **Step 4: Verify media, accessibility, and fallback behavior**

- Keyboard-tab through the section nav and all available evidence controls.
- Confirm exactly one navigation item has `aria-current="location"` while scrolling.
- Disable `IntersectionObserver` in the browser console and confirm anchor navigation still works.
- Force an image/video URL failure locally and confirm the fallback summary appears without a blank player.
- Confirm video does not autoplay and exposes a transcript or equivalent text summary.
- Confirm external experience links open in a new tab with a visible boundary statement.
- Confirm no console error, hydration warning, failed source-map loop, or inaccessible button name.

- [ ] **Step 5: Perform a final public-safety scan**

```powershell
$roots = @('app','components','content','lib','public/evidence')
Get-ChildItem -Path $roots -Recurse -File |
  Select-String -Pattern 'cli_[a-zA-Z0-9]+|tbl[a-zA-Z0-9]+|Bearer\s+|eyJ[a-zA-Z0-9_-]+\.|[A-Z]:\\|589|52/90|16/16|3/3' -CaseSensitive
```

Expected: no matches in public content or assets. If a pattern exists only in a test asserting prohibition, document and exclude that test path from the release scan rather than weakening the rule.

- [ ] **Step 6: Record verification evidence**

Create `docs/verification/2026-07-30-flagship-case-evidence-verification.md` with:

- Branch and HEAD.
- Authority package ID and verified timestamp.
- Exact command results and test counts.
- The five verified URLs.
- Viewports checked.
- Evidence items available versus planned by case.
- Known boundaries: Feishu formal Pilot/write, Service Agent frontend API switch and hardening, Lumen unverified edit modes, and all unrecorded videos.
- Explicit statement: no production deployment or external write was performed.

- [ ] **Step 7: Commit the verification record**

```powershell
git add docs/verification/2026-07-30-flagship-case-evidence-verification.md
git diff --cached --check
git commit -m "docs: verify flagship case evidence system"
git status --short
```

Expected: clean worktree. Stop here. Deployment and push require a separate user instruction.

## Definition of Done

- Three flagship routes use the new six-section template; supporting routes retain the legacy template.
- A recruiter can identify the project, current section, product judgment, technical implementation, iteration history, evidence, and limitations without opening a drawer.
- Navigation is compact, pale, responsive, keyboard accessible, and scroll-aware.
- Product and technical sections receive equal hierarchy and space.
- Every public number has an exact authority binding; report-only values are absent from public surfaces.
- Every evidence card is public-safe and honestly labelled `available`, `planned`, or `unavailable`.
- Video and experience entries are supported without presenting missing material as live.
- Homepage, detail pages, public claims, and AI guide use the same current statuses and evidence boundaries.
- All deterministic gates, build, responsive browser checks, accessibility checks, and public-safety scans pass.
- No deploy, push, DNS change, live environment change, or real external write occurs under this plan.
