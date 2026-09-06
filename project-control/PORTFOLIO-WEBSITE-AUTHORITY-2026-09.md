# Portfolio Website Authority — 2026-09

更新时间：2026-09-06（Asia/Shanghai）
工作目标：面向面试的 AI BUSINESS OS 作品集闭环

## Authority decision

本次实现的唯一 website source authority 是：

- Repository: `D:\360Downloads\Trae 项目\demonstratio`
- Remote: `https://github.com/Catcherog/demonstratio.git`
- Source branch before isolation: `feat/portfolio-ai-guide-knowledge-sync-r2`
- Source HEAD before isolation: `6302e2bb7f05989c24724b3cc360ea8dc3b05b82`
- Isolated implementation branch: `codex/portfolio-interview-full-closure-20260906`
- Isolated worktree: `D:\360Downloads\Trae 项目\portfolio-interview-full-closure-20260906`
- Framework: Next.js 16.2.10 / React 19.2.7
- Vercel project metadata in the source checkout: project `jaelchen-portfolio-vercel-extracted`, project ID `prj_n4HlFdwzKNRoCKtrxo5a7JhTcQoU`, team ID `team_ccwG4YQTgEQ21us4D2i2qhIe`
- Canonical public origin in source metadata: `https://www.jaelchen.com`

This selection is based on the matching `demonstratio` remote, linked Vercel project metadata, canonical domain, current source content, and the fact that this checkout is the only candidate whose source tree is the active portfolio website rather than an application subsystem or a historical layout clone.

## Candidate comparison

| Candidate | Decision | Reason |
| --- | --- | --- |
| `AI Business OS` root | Not website authority | Governing/product workspace; dirty state is protected and remains untouched. |
| `demonstratio` | Selected | Portfolio website source, matching remote/project/domain, current content and tests. |
| `ZeH image\demonstratio` | Historical/non-authoritative | Same repository family but a different historical branch with unrelated dirty changes. |
| `ZeH image\jaelchen-portfolio-vercel-extracted` | Historical/non-authoritative | Clean historical branch; useful as comparison only, not current website source. |
| `portal-clean-clone` / Feishu portal | Subsystem | Product demo, not the portfolio website. |
| `picture-edit` | Subsystem | Lumen application, not the portfolio website. |
| `zehuai-image` / `Web` | Separate brand site | Brand photography site, not the AI product portfolio. |

No second source authority remains unresolved. The historical clones share the repository family but do not compete with the selected current website checkout once branch, content, and Vercel project metadata are compared.

## State and control boundary

- The original `AI Business OS` checkout was on `busos-r2-scs-integration-01`, at `88ab8e6`, with extensive pre-existing modified/deleted/untracked files. It was not edited, reset, stashed, cleaned, or used as an implementation worktree.
- The selected source checkout had only a pre-existing untracked `test-results/` directory. It was not edited directly; the implementation uses the isolated worktree above.
- The failed dependency install directory was moved aside as a recoverable setup artifact: `D:\360Downloads\Trae 项目\_portfolio-node-modules-install-failed-20260906`. The isolated worktree uses a local copy of the already available dependency tree; no dependency lockfile or source authority was changed.

## Verification limits

The local `git ls-remote origin` refresh failed with Windows Schannel `SEC_E_NO_CREDENTIALS (0x8009030e)`. GitHub CLI auth and Vercel CLI auth were also unavailable because their user credential/config directories were inaccessible in this environment. No credential was requested, printed, or added.

Therefore:

- local branch/upstream tracking metadata is repository context, not current remote proof;
- the Vercel project ID/domain are source metadata, not deployment source-SHA proof;
- a READY alias, HTTP 200, or a recording cannot be upgraded to current production/source-SHA authority;
- PR push and Vercel Preview are attempted separately and reported as blocked if credentials remain unavailable.

## Evidence policy

The umbrella narrative is AI BUSINESS OS: Service Agent is the customer interaction intelligence flagship; Feishu is the business-data platform; Lumen is the multimodal production capability; human review, operations, governance, and evaluation are the reliability layer. Public copy is limited to evidence in the repository's authority package and public evidence catalog. Service Agent recording/controlled evidence is primary when live upstream/chat behavior is intermittent; Lumen is described as a controlled demo with only verified operations named.
