# Portfolio Website Evidence Matrix — 2026-09

更新时间：2026-09-06（Asia/Shanghai）
范围：`codex/portfolio-interview-full-closure-20260906` 的本地与远端 Preview 面试闭环
证据原则：公开页面只引用可定位的公共证据；本地通过、Preview 通过、生产状态和当前部署 source-SHA 仍分别记录。

## Umbrella narrative

| 叙事 | 页面/代码来源 | 面试可用证据 | 当前边界 |
| --- | --- | --- | --- |
| AI BUSINESS OS 定位 | `content/portfolio-story.ts`, `/`, `/interview` | 四层架构、五步 build loop、三张 flagship cards | 这是产品叙事与能力归纳，不外推为单一已上线系统或业务 KPI。 |
| 运营与人工复核 | `content/portfolio-story.ts`, `SystemMap` | 风险 Gate、人工接管、评估回流 | 只说明设计与已有案例证据，不说全自动或零人工。 |
| Agent 与自动化 | Service Agent case | `service-agent-live-demo-01`, `service-agent-controlled-demo` | 录屏/受控演示优先；不说所有问题自动回答或准确率。 |
| 业务数据与记忆 | Feishu data-platform case | `data-platform-e2e-verification`, `data-platform-schema-verification` | Test Base E2E 与生产 Schema 只读边界分开；不说生产业务 Pilot。 |
| 适配器、API 与模型 | Lumen case | `lumen-provider-boundary`, `lumen-edit-verification` | 只把 Provider 抽象和两项 Seedream 验证作为当前可说范围；RunningHub 为服务端专用 adapter，缺少配置时 connected path 为 BLOCKED。 |

## Flagship evidence

| Flagship | 主路径 | 次级路径 | 当前公开状态 | 不得升级的表述 |
| --- | --- | --- | --- | --- |
| Service Agent | `service-agent-live-demo-01` 真实录屏 → `service-agent-controlled-demo` 受控场景 | `service-agent-live-frontend` 公网入口 | `Fallback-first｜真实录屏 + 受控 Agent 演示` | 不把公网可达、READY alias、旧 SHA 或代理入口说成当前 backend / deployment source-SHA 证明。 |
| Feishu AI 业务数据平台 | `data-platform-e2e-verification` Test Base 闭环 | `data-platform-schema-verification` 生产 Schema 只读；`data-platform-portal-entry` 产品形态 | `Controlled Pilot｜测试 Base E2E + 生产 Schema 只读核验` | 不把 17/12、10/216、10/10 说成生产业务 Pilot、通知自动化或成功写入 KPI。 |
| 光砚 Lumen | `lumen-workbench` → `lumen-provider-boundary` → `lumen-edit-verification` | `lumen-live-entry` 在线补充入口 | `Controlled Demo｜Seedream 4.5 两项编辑已验证` | 不说液化、修复、消除、全部 Provider 或完整登录链路已验证。 |

## Claims and implementation controls

| 控制项 | 原始来源 | 页面处理 | 验证 |
| --- | --- | --- | --- |
| R1.3 authority manifest | `content/public-claims.json` | 21 条原始绑定保持不变，包含历史 `SCS-DEPLOYED-SHA` | `npm run check:portfolio`; `npm run test:cases` |
| 当前公共 metrics | `content/projects.ts` | `getPublicMetrics` 排除 `SCS-DEPLOYED-SHA`，避免无当前 deployment metadata 时误作 provenance | `tests/portfolio-interview-closure.test.mjs` |
| 状态文案 | `content/portfolio-status.ts` | 用本地、可审计的 public-safe overlay 覆盖旗舰卡片/详情页/证据入口；不改原始 R1.3 contract | `npm test`; Edge QA `statusText` |
| Demo 顺序 | `components/case-study/CaseEvidenceGallery.tsx` | Service Agent fallback 时录屏/受控证据 primary，实时入口 secondary | closure test + 8/8 Playwright + Edge QA |

## Verification evidence

| 类型 | 结果 | 说明 |
| --- | --- | --- |
| Contract/unit tests | `60/60 PASS` | 包含原有 suite、Interview ownership、RunningHub boundary 与 guide status 回归测试、Service Agent case layout suite。 |
| TypeScript | `npm run lint` exit 0 | 仓库脚本实际执行 `tsc --noEmit`。 |
| Consistency | `npm run check:portfolio` exit 0 | 21 structured claims、22 authority IDs、16 public evidence records。 |
| Authority cases | `22/22 PASS` | 使用 `PORTFOLIO_AUTHORITY_DIR` 指向 job-ready-r1.3 handoff。 |
| Production build | `npm run build` exit 0 | Next 16.2.10；17/17 static pages；包含 `/interview`。 |
| Browser | Playwright `8/8 PASS`；Edge QA `24` pages | 1440/1024/768/390；HTTP 200、无 console/page error、无 broken image、无横向溢出、focus/reduced-motion/mobile nav 通过。 |
| Remote Preview | PASS | Preview URL、首页、`/interview`、Service Agent、Feishu、Lumen 在 1440×1000 与 390×844 通过；source ref/SHA 从最终 Vercel metadata 读取，environment 为 preview；最终 deployment 字段见最终报告。 |

## Authority boundary

- 本矩阵证明的是隔离 worktree 的本地 source、测试和浏览器结果。
- PR #13 与 Vercel Preview 的远端记录已取得；其 source ref/SHA 与本地 HEAD 的对应关系单独核验，不从 READY 状态或本地结果推断。
- 没有执行生产部署、alias promotion、DNS、外部数据库写入、真实聊天 POST 或凭证处理。
