# Portfolio Interview Full Closure Design

## Goal

将现有 AI project portfolio 收敛为一个面向面试的、可信的 AI Business OS 产品故事：访客在约 3 分钟内能理解候选人是谁、解决什么业务问题、亲自负责什么、系统如何工作、证据在哪里，以及演示在外部依赖不可用时如何继续。

## Context and boundaries

- 官网 source authority 是 `C:\\...\\demonstratio` 对应的 `Catcherog/demonstratio.git`；本次实现使用其当前 `feat/portfolio-ai-guide-knowledge-sync-r2` 内容创建独立 branch。
- `AI Business OS` backend、Service Agent backend、Feishu Base、Lumen provider 和 DNS/production alias 不在本次代码改动范围内。
- Service Agent 当前展示必须保持 `录屏/受控演示优先`；公网前端可达不等于 upstream chat 稳定，也不等于 deployment source SHA 已被当前平台元数据证明。
- Feishu 必须区分 Test Base 历史验收、生产 Schema 只读核验和正式业务写入；Lumen 只把已验证的 Provider 操作作为真实证据。
- 当前官网基线已有 editorial paper/sage/forest 视觉层和成熟 case renderer；本次优先增量重构，避免框架、路由和样式体系重写。

## Design direction

采用“calm technical editorial”方向：米白纸张为主表面，森林绿作为结构性强调，鼠尾草绿和暖沙色用于证据状态与分组；大字号 serif 标题负责叙事，小字号 sans-serif 负责状态和证据。页面应像一份可阅读的产品 casebook，而不是霓虹 dashboard。

记忆点是“一个 AI Business OS，四层互相约束”：

1. Operations / Human Review：人工确认、质量闸门、转人工和审计。
2. Agent / Lumen / Automation：Service Agent、Collator、Lumen 和流程自动化。
3. Business Data / Memory：客户、项目、订单、素材、会话和知识。
4. Adapters / APIs / Models：Feishu API、CloudBase、模型与 Provider adapter。

动效仅用于首屏分层、卡片 hover、架构层次和 section reveal；必须支持 `prefers-reduced-motion`，不引入连续背景动画或大型动画依赖。

## Information architecture

### Homepage

1. Hero：`AI 产品 / 项目负责人` 定位，说明“把 Agent、业务数据和生成式 AI 变成可验证、可运营的真实业务系统”，只保留查看案例、AI 导览、简历三个主要动作。
2. Selected impact：用少量可追溯的证据说明业务规模、历史 Test Base 和已验证能力，不把测试数写成业务 KPI。
3. AI Business OS overview：先讲碎片化业务问题和产品假设，再说明三个主要能力层的分工。
4. Architecture：四层 AI Business OS 图，所有层在桌面和移动端都保持可读；支持案例可作为标签或次级链接，不抢主叙事。
5. Flagship cases：统一卡片语法呈现 Business Data / Service Agent / Multimodal 三个案例，每张卡片固定展示 outcome、role、problem/solution 摘要、最多两个 evidence metrics 和 case study CTA。
6. How I build AI products：Business Problem → Requirement → Workflow/State → Model/Tool/RAG → Evaluation → Quality Gate → Human Review → Deployment → Monitoring/Iteration。
7. AI Guide：继续保留只读证据导览，但明确它是可选深度入口，不阻塞 3 分钟阅读路径。
8. Project library：九个项目可筛选，旗舰项目和支持项目在视觉上区分；移动端先给旗舰项目之后的紧凑列表，再提供显式“查看全部”。
9. Experience/contact：把 TP-Link 的复杂项目组合管理与 AI 创业连接起来，并保留 CN/EN resume、GitHub、email 和电话入口。

### Interview mode

新增 `/interview`，复用 Header、架构组件和 evidence links，内容收敛为一屏可连续讲解的摘要：候选人定位、Business OS 四层架构、三项 flagship proof、top decisions、Service Agent 录屏/受控入口、简历和联系。它不复制完整 case pages。

### Case pages

保留现有旗舰 renderer 的六个锚点：Overview、Evidence、Business、Product、Technical、Iterations。只调整状态口径、演示路径和共享标题，使三类案例在同一模板下突出真实差异与关键决策。

## Data and evidence model

- `content/portfolio-evidence.ts` 继续作为媒体、交互入口、验证时间、范围和边界的 central registry。
- `content/public-claims.json` 继续作为展示指标的 structured manifest；组件只能通过 `getPublicMetrics` 读取，不在 JSX 内重复声明 claim ID。
- 新增的 `content/portfolio-story.ts`（或等价模块）只承载 Business OS 层、capability pipeline 和 interview mode copy，避免架构叙事散落在组件中。
- 每个展示指标保留 `data-claim-id` 与 `data-evidence-ref`，case page 继续渲染 evidence reference 和 boundary。
- Service Agent 的公开状态改为录屏/受控演示优先，live link 作为 upstream-dependent 次级路径；不公开当前 deployment provenance 不足以证明的“公网代码 SHA”语义。
- Lumen 的公开状态改为 Controlled Demo，并在文案中明确真实验证仅覆盖 Seedream 4.5 文生图和图生图；健康接口或根页可达不外推为全面在线可用。

## Component and interaction changes

- `app/layout.tsx` 导出 Next `Viewport`，显式设置 `width: device-width` 和 `initialScale: 1`，修复真实手机布局被 1280px layout viewport 压缩的问题。
- `Hero` 替换为候选人/系统定位文案，并保持最多三个 primary actions；mobile 只显示短 copy 和三项 proof。
- `FeaturedCases` 增加 Business OS 语义和统一的 role/problem/evidence grammar；前三卡片首张视觉媒体可优先加载，其余媒体保持 lazy。
- `SystemMap` 改成四层 stack，桌面使用横向节点，移动端使用语义化纵向层列表，避免压缩成不可读的工程图。
- `CaseEvidenceGallery` 支持 Service Agent 的 recording-first path：首要媒体为真实录屏/controlled fallback，live front-end 只作为明确标注的次级入口。
- 新的 `/interview` 组件使用普通 anchor 和同源路径；不引入客户端状态或重复一套 case 数据。
- 所有新增按钮使用 button/link 正确语义、44px 左右 tap target、可见 focus ring、中文 alt text 和 reduced-motion 覆盖。

## Failure and demo behavior

- Service Agent：首要按钮/证据是 `Watch Demo`；可继续打开受控 B1/B2/B3 演示；live 入口显示“受 upstream 可用性影响”，不在普通访客界面显示内部诊断。
- Business OS / Feishu：优先公开架构图、脱敏 Portal UI 和录屏/说明；不依赖面试官访问私有 Base，不声称正式业务写入已开放。
- Lumen：展示工作台和真实 Provider 编辑证据；外部 provider 或 auth 失败时保留截图/验证摘要与边界，不把失败包装成成功。
- Planned evidence 不渲染可点击播放器或 live CTA；unavailable evidence 显示可解释状态。

## Testing and quality gates

先增加会失败的内容契约测试，再实现：

- Hero、Business OS umbrella、四层架构和 `/interview` route 存在且顺序正确。
- Service Agent 与 Lumen 状态、demo path 和边界文案符合当前 authority；不存在 unsupported production claim。
- 所有 evidence refs 可解析，planned evidence 仍不可交互。
- `Viewport` metadata 存在，browser 在 390px 下的 `clientWidth` 等于 viewport，关键 route 无横向 overflow。
- 首页、三旗舰页、resume 和 interview route 返回 200；internal links、resume assets、image alt 和 console errors 通过浏览器 smoke。
- 仓库原生 `npm test`、`npm run lint`、`npm run check:portfolio`、`npm run test:cases`、`npm run build`、`git diff --check` 和 secret scan 全部通过，或在 closure 文档中明确记录真实 blocker。

## Non-goals

- 不修复 Service Agent 上游、重部署生产、变更 DNS、旋转凭证或发送真实聊天/反馈流量。
- 不重写 Next.js、router、state library 或引入第二套 CSS framework。
- 不把四个项目拆成更多 landing pages，不制作持续动画背景或 4K 工程图。
- 不新增没有 source/evidence binding 的 DAU、收入、准确率、生产流量、成本节省或稳定性数字。

## Acceptance signal

完成后，访客应能把网站复述为：候选人围绕真实摄影业务构建了一套 AI Business OS；Feishu 是业务数据基础，Service Agent 是风险优先的客户交互层，Lumen 是多模态生产能力，Evaluation/Human Review/Governance 是可靠性层；每个 claim 都有明确证据和当前边界，且面试演示不依赖单一外部服务。
