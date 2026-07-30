# Flagship Case Evidence System Verification

- Verification date: 2026-07-30 (Asia/Singapore)
- Target remote branch: `codex/flagship-evidence-plan-r1`
- User-confirmed remote baseline: `4bb8c750d0a8978c88c42ffd436e90490f4ccc98`
- Design baseline retained in remote history: `8cf2ac6`
- Plan commit retained in remote history: `da69181`
- Sandbox implementation source HEAD: `c3f403703215ef72c54f12d3f47c75209e5ed7fa`
- Authority package: `job-ready-r1.3`
- Authority status: `PHASE_G_CLOSED_PROVISIONAL_PASS`
- Authority verified at: `2026-07-30T06:30:00+08:00`

## Verification verdict

`CODE_AND_CONTRACT_PASS / BUILD_AND_BROWSER_PENDING_DEPENDENCY_RESTORE`

Tasks 1–8 and the Task 9 code-level checks were implemented in an isolated reconstruction of the supplied worktree. All deterministic Node contracts, the R1.3 consistency gate, public-safety checks, and TypeScript syntax transpilation pass. A dependency-backed Next.js build, full `tsc --noEmit`, and browser verification could not be executed in this sandbox because the supplied source archive intentionally excluded `node_modules` and the sandbox could not reach the npm/GitHub registries.

This limitation is environmental. It is not recorded as a product or code pass. Trae must run the dependency-backed build and browser checklist on the original worktree before deployment or PR creation.

## Authority and public-claim verification

The consistency gate resolved the authority package through `PORTFOLIO_AUTHORITY_DIR` and confirmed:

- Package ID: `job-ready-r1.3`
- Public baseline: `R1.3`
- Authority state: `PHASE_G_CLOSED_PROVISIONAL_PASS`
- Structured public claims: 21
- Surface distribution: hero 4, data platform 5, Service Agent 7, Lumen 5
- Authority evidence IDs: 22
- Public evidence inventory records: 15
- Report-only values such as `16/16`, `3/3`, and `52/90` are absent from flagship public surfaces.

## Deterministic command results

| Command | Result |
| --- | --- |
| `npm run test:v5` | PASS — 9/9 |
| `npm run test:guide` | PASS — 14/14 |
| `PORTFOLIO_AUTHORITY_DIR=... npm run test:cases` | PASS — 21/21 |
| `PORTFOLIO_AUTHORITY_DIR=... npm run check:portfolio` | PASS — 21 claims, 22 authority evidence IDs, 15 public evidence records |
| TypeScript `transpileModule` syntax scan across `app`, `components`, `content`, and `lib` | PASS — 39/39 source files |
| `git diff --check` / `git diff --cached --check` | PASS for every implementation commit |
| Flagship public-safety scan | PASS — no matches in flagship routes, case components, narrative data, evidence catalog, guide data, or derived SVG assets |
| `npm run lint` | ENVIRONMENT BLOCKED — React/Next packages and type declarations absent because `node_modules` was excluded |
| `npm run build -- --webpack` | ENVIRONMENT BLOCKED — `next` executable absent |

The normal lint output contained missing-module and missing-JSX-type errors caused by the absent dependencies. A separate pure TypeScript check found and fixed one real narrowing issue in `CaseSectionNav`; the final syntax scan passes.

## Route and renderer contract

The following route behavior is covered by deterministic tests:

- `/projects/data-platform` selects `FlagshipCasePage`.
- `/projects/service-agent` selects `FlagshipCasePage`.
- `/projects/lumen-ink` selects `FlagshipCasePage`.
- Supporting projects such as `/projects/wechat-bot` retain `LegacyProjectPage`.
- Unknown slugs retain `notFound()` behavior.
- Static params and metadata remain derived from `projects`.

Each flagship page exposes the fixed six-section sequence:

1. 项目概览
2. 业务判断
3. 产品方案
4. 技术实现
5. 迭代链路
6. 项目证据

The section navigator is a client enhancement over server-rendered anchors, uses `IntersectionObserver`, preserves a no-observer fallback, and maintains `aria-current="location"`.

## Evidence inventory

### Data platform

Available:

- `data-platform-closed-loop`
- `data-platform-schema-verification`
- `data-platform-e2e-verification`

Planned and non-interactive:

- `data-platform-portal-entry`
- `data-platform-walkthrough`

Boundary: production V2 inspection is read-only and supports table-level `10/10` plus `10 / 216`; field-level diff and formal Pilot writes remain incomplete. Historical `17 / 12` belongs to the Test Base baseline.

### Service Agent

Available:

- `service-agent-risk-workflow`
- `service-agent-phase-g-summary`
- `service-agent-controlled-demo`

Planned and non-interactive:

- `service-agent-live-frontend`
- `service-agent-walkthrough`

Boundary: CloudBase Deploy 039 backend passed Phase G provisionally, while the current public frontend still points to the Render static fallback. Availability, latency, and knowledge coverage remain production-hardening work.

### Lumen

Available:

- `lumen-workbench`
- `lumen-provider-boundary`
- `lumen-edit-verification`
- `lumen-live-entry`

Planned and non-interactive:

- `lumen-walkthrough`

Boundary: only Seedream 4.5 text-to-image and image-to-image were verified `2/2`. Liquefy, heal, erase, and other modes remain unverified.

## Public-safety verification

The new public evidence layer:

- Does not reference the previous Service Agent `01.webp`–`07.webp` set.
- Does not reference the previous data-platform `01.webp` screenshot.
- Uses three public-safe explanatory SVG diagrams with `<title>` and `<desc>`.
- Keeps only the manually reviewed first Lumen workbench screenshot.
- Contains no production Base IDs, table IDs, local drive paths, JWTs, bearer tokens, account IDs, or environment IDs.
- Prevents `planned` evidence from exposing a primary `href` or playable `assetUrl`.
- Filters AI guide retrieval to `publicSafe && state === "available"` records with authority evidence references.

## Browser verification pending on original worktree

The following URLs and viewports are required after dependencies are restored:

- `http://localhost:3000/projects/data-platform`
- `http://localhost:3000/projects/service-agent`
- `http://localhost:3000/projects/lumen-ink`
- `http://localhost:3000/projects/wechat-bot`
- `http://localhost:3000/#featured`

Viewports:

- 1440 × 1000
- 768 × 1024
- 390 × 844

Trae must verify section landing offsets, active navigation, keyboard focus, evidence fallback behavior, external-link boundaries, no autoplay, no horizontal overflow, and absence of console/hydration errors. The browser portion is explicitly not claimed as completed in this record.

## External-action statement

No production deployment, GitHub push, pull request creation, DNS change, environment-variable update, or real external write API call was performed during this implementation.
