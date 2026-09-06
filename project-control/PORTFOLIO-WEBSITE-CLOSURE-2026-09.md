# Portfolio Website Closure — 2026-09

更新时间：2026-09-06（Asia/Shanghai）

## Final local verdict

`PORTFOLIO_VERDICT=LOCAL_INTERVIEW_READY_PENDING_PR_PREVIEW`

本地 source、面试路径、证据边界、production build 和浏览器 QA 已形成可审计闭环。这个 verdict 不等价于 Preview ready、production ready、current deployment source-SHA authority 或 backend/chat E2E 通过。

## Source and commits

- Website authority：`https://github.com/Catcherog/demonstratio.git` 对应的 `demonstratio` checkout。
- Base：`6302e2bb7f05989c24724b3cc360ea8dc3b05b82`（`origin/feat/portfolio-ai-guide-knowledge-sync-r2` 的本地 tracking state）。
- Docs commits：`2affe92`、`1d8ceee`。
- Implementation commit：`32b0152` — `feat(portfolio): close interview-ready AI product storytelling`。
- Branch：`codex/portfolio-interview-full-closure-20260906`。
- Worktree：`D:\360Downloads\Trae 项目\portfolio-interview-full-closure-20260906`。
- Protected workspace：`D:\360Downloads\Trae 项目\AI Business OS` 未编辑、未 reset、未 stash、未 clean。

## Delivered scope

- 首页从项目集合重排为 AI BUSINESS OS umbrella narrative：四层 operating model、build loop、三张 flagship cases。
- 新增 `/interview` presenter route，固定三分钟讲解、resume CTA、证据边界和 fallback order。
- Service Agent 页面将 `service-agent-live-demo-01` 录屏与受控演示作为 primary，公网实时入口降为 secondary。
- Feishu data platform 明确 Test Base E2E 与生产 Schema 只读边界。
- Lumen 明确为 controlled demo，只命名 Seedream 4.5 文生图与图生图两项验证。
- 保留 raw R1.3 21-binding authority manifest；公共 metrics 排除 `SCS-DEPLOYED-SHA`，不把历史绑定渲染为当前部署 provenance。
- 新增 Evidence Matrix、Interview Runbook、Owner Review、四个 demo scripts 和 sanitized browser QA evidence。

## Verification record

| Gate | Result |
| --- | --- |
| `npm test` | `46/46 PASS` |
| `npm run lint` | exit 0；`tsc --noEmit` |
| `npm run check:portfolio` | PASS；21 structured claims、22 authority IDs、16 public evidence records |
| `PORTFOLIO_AUTHORITY_DIR=... npm run test:cases` | `22/22 PASS` |
| `npm run build` | exit 0；Next 16.2.10，17/17 static pages，包含 `/interview` |
| `npm run test:case-browser` | `8/8 PASS` |
| 独立 Edge QA | `24` pages/pass；1440、1024、768、390 |
| Browser assertions | HTTP/internal links 200；0 console/page errors；0 broken/missing images；无横向溢出；focus、mobile menu、reduced motion 通过 |
| Diff/secret checks | `git diff --check` PASS；staged secret-pattern counts 0 |

详细矩阵：`PORTFOLIO-WEBSITE-EVIDENCE-MATRIX-2026-09.md`。浏览器原始摘要：`PORTFOLIO-WEBSITE-BROWSER-QA-2026-09.json`。

## PR and Preview handoff

| Item | State | Evidence / blocker |
| --- | --- | --- |
| GitHub branch push | `NOT_CREATED` | `git push -u origin codex/portfolio-interview-full-closure-20260906` was rejected by the environment safety approval because it exports the feature branch contents to the GitHub remote without an explicit destination-specific approval. No force-push occurred. |
| Pull Request | `NOT_CREATED` | Cannot create a PR until the branch exists on the remote. Intended title: `[Portfolio] Rebuild website for interview-ready AI product storytelling`。 |
| Vercel Preview | `NOT_CREATED` | `vercel deploy --yes` exited before deployment: CLI could not create `C:\Users\Catcher\AppData\Roaming\xdg.data\com.vercel.cli` / cache directories (`EPERM`). No token was supplied; no production command was run. |

## Deliberately not attempted

- No production deploy, alias promotion, rollback, DNS change, database write, real chat POST, credential request, or secret handling.
- No merge to `main` and no cleanup of the isolated worktree; the branch remains available for review iteration.
- No claim of current Vercel deployment source SHA/ref. The local Vercel project metadata remains context only.

## Next explicit human action

From an environment authorized to export this repository to the known remote, push `codex/portfolio-interview-full-closure-20260906` and open the intended PR without merging. Then run a non-production linked Vercel Preview from an authenticated environment, record its URL/deployment ID/source SHA/ref, and repeat the same browser QA against that Preview. Until those two records exist, use the local `/interview` route and recording-first demo runbook for interviews.
