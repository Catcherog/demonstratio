# Portfolio Interview Full Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing portfolio into an interview-ready AI BUSINESS OS narrative with a clear three-minute comprehension path, evidence-bound flagship cases, a truthful demo fallback, and verified desktop/mobile delivery.

**Architecture:** Keep the current Next.js App Router, data-driven project registry, flagship case renderer, and evidence catalog. Add a small portfolio-story registry for the umbrella narrative and interview mode, expose current public-safe display statuses separately from the historical R1.3 authority contract, and make the home/case surfaces consume those registries rather than duplicating copy. Preserve the original AI Business OS repository and the chosen portfolio checkout; all implementation happens in the isolated worktree `codex/portfolio-interview-full-closure-20260906`.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS modules/global CSS already used by the repository, Node `node:test`, Playwright with the installed Microsoft Edge executable, npm scripts, and the existing portfolio authority/evidence tooling.

> **Closure status (2026-09-06):** Tasks 1–7 are complete in the isolated worktree. The authorized branch is pushed, PR #13 is OPEN (not merged), and a non-production Vercel Preview has been source-verified and browser-checked; see `project-control/PORTFOLIO-WEBSITE-CLOSURE-2026-09.md`.

## Global Constraints

- Never edit the dirty AI Business OS workspace at `D:\360Downloads\Trae 项目\AI Business OS`.
- Do not request, print, commit, or expose credentials; do not change DNS, production aliases, or production data.
- Preserve the external R1.3 authority package and its 21-claim consistency contract. If current public-safe status differs from the historical contract, keep the authority binding intact and introduce an explicit local display overlay with a documented reason.
- Do not claim live backend, production, business KPI, model accuracy, or deployment provenance without current evidence. Recording/controlled evidence is primary when live evidence is unavailable or intermittent.
- Use `apply_patch` for source and documentation edits. Commit only scoped changes in the isolated worktree.
- Every production-code change follows test-first red/green verification. Run the full existing suite and the portfolio consistency gate before claiming completion.

---

## Task 1: Record source authority and pre-implementation audit

- [ ] Create `project-control/PORTFOLIO-WEBSITE-AUTHORITY-2026-09.md`.
  - Record the selected source checkout, remote, branch, base SHA, Vercel project ID/domain, dirty-state boundary, candidate repos considered, and why `demonstratio` is the sole implementation authority.
  - Record that upstream refresh, GitHub CLI auth, and Vercel CLI auth are unavailable in this environment without credentials; local tracking metadata is not current deployment-SHA proof.
  - Record the explicit non-authorities: the AI Business OS root, historical `ZeH image` clones, the Feishu portal, Lumen app, and unrelated brand site.
- [ ] Create `project-control/PORTFOLIO-WEBSITE-PRE-IMPLEMENTATION-AUDIT-2026-09.md`.
  - Capture the current live-page audit, route/HTTP results, public claim risks, mobile viewport failure, visual hierarchy, evidence-boundary issues, and a 0–3 score per requested acceptance dimension.
  - Distinguish current public observations from local source facts and from historical authority facts.
- [ ] Add the required design/implementation pointers and explicit non-goals to the audit.
- [ ] Run `git diff --check`, the placeholder/secret scan used by the repository, and commit the authority/audit/plan documentation as one scoped docs commit.

## Task 2: Add red tests for the closure contract

- [ ] Add `tests/portfolio-interview-closure.test.mjs` before changing production code.
  - Assert `app/layout.tsx` exports a real mobile viewport contract.
  - Assert the homepage consumes an umbrella AI BUSINESS OS story and places architecture before the detailed case/library sections.
  - Assert the story registry defines four ordered layers: operations/human review, agent/automation, business data/memory, and adapters/APIs/models.
  - Assert `/interview` exists and links to the three flagship cases plus the resume selector.
  - Assert current display status is fallback-first for Service Agent and controlled for Lumen, while the raw 21-binding R1.3 manifest remains untouched.
  - Assert the deployment-SHA claim is not rendered through the public metric helper and the fallback evidence entry is recording-first.
- [ ] Run only the new test and capture the expected red failures before implementing the contract.

## Task 3: Implement the umbrella story and truthful evidence surfaces

- [ ] Add `content/portfolio-story.ts` with typed, reusable data for:
  - the AI BUSINESS OS positioning statement;
  - the four-layer system map and layer-to-case relationships;
  - the build loop `业务问题 → 数据/知识 → Agent/模型 → 人工复核 → 评估回流`;
  - interview prompts and three flagship case summaries;
  - current public-safe display statuses and demo mode notes.
- [ ] Add a public-status helper/overlay used by cards, case overview, metadata and demo presentation. Keep the historical `project.status` and external authority package unchanged for consistency-gate parity, and explain the overlay in the authority/audit docs.
- [ ] Update Service Agent display copy and case evidence to make recording/controlled verification the primary path, live URLs secondary, and upstream/chat intermittency explicit.
- [ ] Update Lumen display copy to say controlled demo and name only the two verified Seedream operations; preserve the existing unsupported-mode/auth boundaries.
- [ ] Update the public metric helper so the superseded `SCS-DEPLOYED-SHA` binding remains in the raw manifest for authority parity but is excluded from rendered public metrics, with a test covering the exclusion.
- [ ] Keep all displayed metrics and evidence references sourced from the central registries; do not add literal metric copies to components.

## Task 4: Implement the interview-first information architecture

- [ ] Update `app/page.tsx` and home components so the first scroll communicates:
  1. who/positioning;
  2. AI BUSINESS OS umbrella and four layers;
  3. the three flagship cases with role, technical depth, evidence boundary, and demo path;
  4. the product-building method and reliability loop;
  5. optional guide/library and experience/contact.
- [ ] Update `components/SystemMap.tsx` to consume the four-layer story registry while preserving deep links to the case studies and supporting subsystem cases.
- [ ] Update `components/home/Hero.tsx`, `FeaturedCases.tsx`, `ProductMethod.tsx`, and `ExperienceContact.tsx` to use the shared story/status data and to remove collection-like or unsupported status language from the primary path.
- [ ] Add `app/interview/page.tsx` and a focused `components/InterviewMode.tsx` page with a concise talk track, evidence boundaries, flagship links, resume CTA, and fallback demo order.
- [ ] Add responsive/accessibility styles in the existing portfolio CSS: valid viewport behavior, readable 390px layout, visible focus states, reduced-motion handling, non-overflowing grids, and explicit media dimensions/prioritization.

## Task 5: Make case pages interview-safe

- [ ] Update `components/case-study/CaseOverview.tsx` and related case headings to use the public-safe display status and boundary copy.
- [ ] Update `components/case-study/CaseEvidenceGallery.tsx` so fallback mode selects the recording/controlled evidence first, labels live interactive links as secondary, and never presents an unverified live path as the default.
- [ ] Preserve the six-section flagship structure and the legacy renderer for the six supporting projects.
- [ ] Add one deterministic fallback/demo script per flagship case under `project-control/demo-scripts/` covering a 60–90 second walkthrough, expected evidence, failure handling, and claims that must not be spoken.
- [ ] Add/update contract tests for status overlays, recording-first selection, four-layer ordering, interview route, and the unchanged authority manifest.

## Task 6: Run local verification and audit the diff

- [ ] Run the targeted closure tests until green.
- [ ] Run `npm test`, `npm run lint`, `npm run check:portfolio`, `PORTFOLIO_AUTHORITY_DIR=... npm run test:cases`, and `npm run build` from the isolated worktree.
- [ ] Run the Playwright browser suite and a direct Edge audit at 1440, 1024, 768, and 390 widths for `/`, `/interview`, all three flagship cases, `/resume`, and all homepage internal links.
- [ ] Verify HTTP 200 for internal routes, zero page/console errors, no missing/zero-size images, no horizontal overflow, correct `clientWidth` at mobile, keyboard-visible focus, reduced-motion behavior, and correct primary/secondary demo labels.
- [ ] Run `git diff --check`, tracked secret scan, and a final public-claims scan for unsupported LIVE/production/accuracy/deployment-SHA language.
- [ ] Save sanitized browser results under `project-control/` if the repository’s existing evidence convention supports it; do not save cookies, headers, tokens, or private URLs.

## Task 7: PR and Preview handoff

- [ ] Commit implementation in reviewable scoped commits and verify the worktree contains only intended changes.
- [x] Push the exact branch and create/reuse PR #13 with title `[Portfolio] Rebuild website for interview-ready AI product storytelling`; do not merge.
- [x] Create a Vercel Preview using the linked project without touching production. Record Preview URL, deployment ID, source SHA/ref and environment.
- [x] Re-read the remote PR/Preview state and run desktop/mobile browser QA against the Preview.
- [x] Update `project-control/PORTFOLIO-WEBSITE-OWNER-REVIEW-2026-09.md`, `PORTFOLIO-WEBSITE-INTERVIEW-RUNBOOK-2026-09.md`, and `PORTFOLIO-WEBSITE-CLOSURE-2026-09.md` with acceptance verdict, verification commands/results, limitations, PR/Preview state, production unchanged statement, and the next explicit human action.
- [ ] Use verification-before-completion and requesting-code-review before the final response; use finishing-a-development-branch to present integration options without merging or releasing.

## Acceptance Criteria

- [x] Three-minute visitor can identify candidate, umbrella system, ownership, three flagship cases, technical depth, evidence boundaries, and demo fallback without reading every project card.
- [x] `/interview` provides a usable presenter path and does not introduce unsupported claims.
- [x] Service Agent recording/controlled evidence is primary; Lumen has a controlled two-operation demo boundary; Feishu boundaries remain explicit.
- [x] Mobile width is real and usable at 390px; desktop remains calm, readable, and non-overflowing.
- [x] Existing tests, consistency gate, case tests, build, browser checks, diff/secret scans pass; known upstream limitations are explicitly documented.
- [x] No production/DNS/data mutation occurs. PR and Preview are separated from production and source-authority claims.
