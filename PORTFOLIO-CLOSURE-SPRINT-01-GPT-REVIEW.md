# PORTFOLIO-CLOSURE-SPRINT-01 — GPT 内容审查包

> **报告类型**: GPT Content Review Package
> **对应 Trae 报告**: `PORTFOLIO-CLOSURE-SPRINT-01-TRAE-REPORT.md`（同 commit）
> **报告生成时间**: 2026-07-23T17:24:38+08:00
> **审查目标**: 让 Web GPT（无本地仓库读取能力）能直接基于本文件审阅官网文案、状态分层、CTA 边界、业务主张与 PII/secret。
> **最终状态标记**:
> - `READY_FOR_GPT_CONTENT_REVIEW`
> - `READY_FOR_USER_ASSET_REVIEW`
> - `NOT_DEPLOYED`

---

## 1. 元信息

| 字段 | 值 |
|---|---|
| canonical repo | `https://github.com/Catcherog/demonstratio.git` |
| 分支 | `portfolio/closure-sprint-01` |
| Lane A HEAD | `96b791a47229d2d371ab4778d5ff7527050ef1a0` |
| 远程 URL（分支视图） | https://github.com/Catcherog/demonstratio/tree/portfolio/closure-sprint-01 |
| 首页文件 | `app/page.tsx`（248 行） |
| 详情页模板 | `app/projects/[slug]/page.tsx`（273 行，12 段） |
| 项目数据 | `content/projects.ts`（844 行，3 featured + 5 experiment） |
| 证据 JSON | `content/evidence/{feishu,scs,lumen}.json`（共 22 项） |
| consistency gate | `scripts/consistency-gate.mjs`（15 项检查，全部 PASS） |
| build 结果 | 13/13 静态页面生成成功，exit 0 |

---

## 2. 首页当前文案（直接复制 `app/page.tsx`）

### 2.1 Hero

- **availability**: `OPEN TO AI PRODUCT OPPORTUNITIES`
- **eyebrow**: `AI / AGENT PRODUCT MANAGER · TECHNICAL BUILDER`
- **h1（定位句）**: `AI Agent 产品经理,专注把复杂业务流程转化为可治理、可协同、可交付的 AI 系统。`
- **hero-lead**: `我是陈嘉伟。曾在 TP-Link 管理复杂软硬件项目组合,现作为 3 人全职创业团队的创始人兼 AI 产品负责人,围绕业务建模、Agent 编排、数据治理、人工复核、多端产品与云端交付构建 AI 产品矩阵。`
- **hero-tags（6 个能力标签）**:
  - 业务建模
  - Agent 编排
  - 数据治理
  - 人工复核
  - 多端产品
  - 云端交付
- **hero-actions**:
  - `查看重点案例 ↓`（href `#featured`）
  - `联系 ↗`（href `#contact`）
- **hero-links**:
  - `GitHub` → `https://github.com/Catcherog`
  - `Email` → `mailto:Jael_Chen@foxmail.com`
  - `联系` → `#contact`

### 2.2 hero-metrics（4 项，动态 + 静态混合）

| 数字 | label |
|---|---|
| `{featuredCount}` | Featured Case Studies（动态计算 = 3） |
| `{experimentCount}` | Selected Experiments（动态计算 = 5） |
| `17 / 12` | 数据表 / 自动化(历史基线) |
| `282 / 80+` | SKU / 峰值并行项目 |

### 2.3 Proof Section（capabilities 卡片网格，6 项）

来源 `content/projects.ts` 的 `capabilities` 数组：

| # | title | body | evidence |
|---|---|---|---|
| 01 | 业务建模 | 从业务链路、异常路径和成本约束出发定义 AI 场景,把销售、项目、交付、内容运营映射成数据模型。 | 17 张业务表(历史基线) · 18 类咨询场景 · 5 层平台架构 |
| 02 | Agent 编排 | 覆盖 Agent、RAG、模型路由、知识治理、人工质量闸门与本地微调。 | LangGraph 工作流 · 三级置信度 · QLoRA 双基座 · OpenAI 兼容服务 |
| 03 | 数据治理 | 把非结构化输入转化为可治理的业务数据,通过规则校验、人工复核和确定性写入控制风险。 | Candidate V1 合同 · BR-01~06 规则 · dry-run 集成门禁 · 双层幂等 |
| 04 | 人工复核 | 把低置信度和高风险动作交给人,AI 只提供候选,不做最终决策。 | NEEDS_REVIEW 流程 · 质量闸门 · 反馈飞轮 · 人工确认 |
| 05 | 多端产品 | Web、移动、IM 多入口产品化,覆盖品牌官网、小程序、微信公众号与 Portal。 | Next.js 16 · React Native · 微信原生 · 4 通道适配 |
| 06 | 云端交付 | 从需求、原型、开发验证到上线协同、评估设计与数据回流。 | CloudBase · Vercel · CDN · Vitest · 集成门禁 |

> **注**：`Vitest` 在 evidence 字段出现，但实际 consistency gate 用自定义 `scripts/consistency-gate.mjs`（Node.js），非 vitest。GPT 可审查此文案是否需要修正。

### 2.4 Capability Chain Section（8 步）

来源 `content/projects.ts` 的 `capabilityChain` 数组：

```
01 业务问题识别
→ 02 非结构化数据摄入
→ 03 AI 提取与 Agent 编排
→ 04 确定性治理
→ 05 人工复核
→ 06 业务系统写入
→ 07 自动化执行
→ 08 测试、监控与迭代
```

- **eyebrow**: `CAPABILITY FRAMEWORK`
- **h2**: `从业务问题到可交付的 AI 系统,一条完整能力链。`
- **intro**: `不把 LLM 直接等同于产品。先定义业务对象、风险和人工边界,再把可确定的规则、检索和工具调用放入工作流,最后用可复现证据验证输入、决策、写入和反馈闭环。`

### 2.5 Featured Case Studies Section

- **eyebrow**: `FEATURED CASE STUDIES`
- **h2**: `{featuredCount} 个主案例,证明核心能力。`
- **intro**: `飞书 AI 业务数据平台、Service Agent 与光砚分别证明数据治理、Agent 可靠性与多模态产品化能力;其余项目作为 Selected Experiments 保留在完整项目库。`

3 个 featured 卡片字段（每张卡片展示）：`images[0]` / `status` / `index` / `category` / `title` / `subtitle` / `summary` / `tags.slice(0,3)` / `status` / `decisions[0]` / `outcomes[0]` / `link.label` / `link.note`

### 2.6 System Section（Cross-Project Architecture）

- **eyebrow**: `CROSS-PROJECT ARCHITECTURE`
- **h2**: `{featuredCount} 个主案例 + {experimentCount} 个实验项目,组成一套 AI 产品系统。`
- **intro**: `客户触点负责体验与留资,智能服务处理咨询和数据摄入,数据平台统一业务流转,增长引擎反哺内容,模型层提供本地训练与推理。`

渲染 `<SystemMap />` 组件（Feishu 平台合并为单节点，layers 文案对齐 3 主案例）。

### 2.7 Method Section（Reliability by Design）

- **eyebrow**: `RELIABILITY BY DESIGN`
- **h2**: `AI 产品的核心不是"自动化更多",而是错误可控。`
- **method-lead**: `先定义业务边界和失败成本,再设计模型、工具调用、人工接管与数据反馈。`
- **4 个原则**:
  - 01 业务链路先于模型 — 先识别角色、关键节点、异常路径和可量化结果。
  - 02 质量闸门先于全自动 — 用置信度、规则校验和人工确认控制高风险输出。
  - 03 评估先于规模化 — 区分训练 loss、离线检索指标和真实业务效果。
  - 04 数据回流先于一次性交付 — 让确认后的真实数据持续更新知识、规则和模型。

### 2.8 Selected Experiments Section

- **eyebrow**: `SELECTED EXPERIMENTS`
- **h2**: `实验与辅助能力`
- **intro**: `以下项目作为主案例的技术附录与辅助能力,不抢占首页主要视觉层级。按岗位需要筛选 Agent、数据、多模态、用户端、增长与模型训练案例。`
- **metric-note**: `指标说明:标注为"内部估算 / 业务估算"的数值来自小样本测试或运营观察,未作为经过大样本验证的业务结论。`

渲染 `<ProjectLibrary projects={experimentProjects} />`（5 个实验项目：wechat-bot / content-research / brand-website / lora-finetuning / mini-program[archived]）。

### 2.9 Experience Section（时间线 3 段）

| 时间 | 标签 | h3 | 描述 |
|---|---|---|---|
| 2026.02 - 至今 | 全职创业 · 3 人团队 | 泽怀摄影工作室｜创始人兼 AI 产品负责人 | 从 0 到 1 构建 AI Native 产品矩阵,负责产品战略、业务建模、MVP 验证、技术方案与上线协同。 |
| 2024.07 - 2026.02 | 复杂项目组合管理 | TP-Link｜商用项目经理 | 负责 5 条软硬件产品线的项目组合、跨国需求和高风险交付,在供应链、研发与质量约束下推进决策。 |
| 2020.09 - 2024.06 | 材料科学与结构化思维 | 中南大学｜材料物理本科 | 大学生创新创业项目省级奖项,参与固态电池材料课题;校辩论队核心成员,CET-6。 |

创业期 3 个 bullet：
- `{featuredCount} 个主案例 + {experimentCount} 个实验项目`
- 业务建模、Agent 编排、数据治理与多端产品端到端实践
- LangGraph、RAG、多模态与 QLoRA 真实落地

TP-Link 期 3 个 bullet：
- 282 个 SKU 全生命周期、峰值 80+ 项目并行
- 主导海外 NFC 功能定义与交互方案
- 高风险项目追回 2 周工期,5 款产品提前 15 天量产

### 2.10 Contact Section

- **eyebrow**: `CONTACT`
- **h2**: `目标方向:AI 应用 / Agent 产品经理。`
- **intro**: `倾向有技术深度、重视真实落地和产品评估的 AI 公司。接受全国、海外及远程机会。`
- **contact-actions**:
  - 邮箱：`Jael_Chen@foxmail.com`
  - GitHub：`Catcherog` → `https://github.com/Catcherog`
  - 简历(临时入口)：PDF → `/resume/chen-jiawei-ai-agent-cn-one-page.pdf`
- **footer-bottom**: `© 2026 陈嘉伟` / `返回顶部 ↑`

---

## 3. 三大主案例简介（从 `content/projects.ts` 摘录）

### 3.1 feishu-platform

| 字段 | 值 |
|---|---|
| slug | `feishu-platform` |
| index | `01` |
| category | `Data / Automation` |
| categoryLabel | `FEISHU AI BUSINESS DATA PLATFORM` |
| title | `飞书 AI 业务数据平台` |
| subtitle | `把聊天记录、截图、表单和人工录入转化为可治理的飞书业务数据` |
| summary | `面向中小型业务团队的 AI 业务数据平台,通过智能录入、Candidate 候选生成、SOP 治理规则、人工复核与 dry-run 写入,把非结构化输入转化为可治理的飞书业务数据,并通过自动化通知和智能机器人降低录入与协作成本。` |
| status | `Portfolio MVP｜核心链路已实现,最终集成收尾中` |
| demoType | `local-only` |
| role | `产品负责人 / 数据模型设计 / 治理规则 / MVP 开发` |
| team | `3 人创业团队` |
| period | `2026.02 - 至今` |
| featured | `true` |
| provisional | `true` |
| evidenceLabel | `17 张表与 12 条自动化为旧版业务底座(历史基线)。当前 V2 链路以 dry-run 集成门禁为证据,真实飞书写入未上线。OCR/ASR/CLIP 按真实进度分开标记,未形成统一可验证闭环。` |

**metrics（4 项）**：
- `5 层` / 平台模块架构
- `6/6` / dry-run 集成门禁
- `17` / 张业务表(历史基线)（note: 旧版底座）
- `504+91` / Collator + SOP 单元测试

**tags（4 项，前 3 个展示在卡片）**：数据平台 / 治理规则 / 人工复核 / Agent 摄入

**stack**：Next.js 16 / Fastify / TypeScript / Zod / Node.js / 飞书 Bitable / Vitest

**problem（2 项）**：
1. 客户、项目、素材、供应商与内容数据分散在聊天记录、截图和个人经验中,人工整理慢且容易遗漏字段。
2. LLM 直接提取后写库会产生格式、枚举、状态和逻辑错误;普通表单无法处理弱网、权限和异常路径,单次 LLM 调用不足以保证业务数据可治理。

**productStrategy（4 项）**：
1. 产品目标:把非结构化输入转化为可治理的飞书业务数据,降低录入与协作成本。
2. 产品边界:当前只验证文本摄入链路与 dry-run 写入,真实飞书 API 写入与多模态适配保持受控边界。
3. 方案选择:采用 Collator + SOP + Portal 双入口治理架构,治理规则和合同校验真实执行,只有最终写入为 dry-run。
4. 暂不做:不接入真实 OCR/ASR/CLIP 引擎,不配置生产飞书凭据,不部署公开演示。

**decisions（3 项）**：
1. 将平台分为智能录入层(Portal/Collator)、智能处理层(LLM+Candidate)、治理层(SOP+规则+人审)、数据层(飞书 Bitable)、执行层(自动化+通知+机器人+APP)五层,各层职责清晰。
2. 以飞书多维表作为权威业务数据底座,AI 只提供候选,不做最终写入决策(BR-05);类型缺失进入 NEEDS_REVIEW 而非猜测(BR-03)。
3. 采用 dry-run writer 验证全链路,保证治理规则和合同校验真实执行,但最终写入不接触生产飞书表,换取零风险演示。

**link**：`{ label: "本地运行说明", href: "#contact", note: "Prototype 阶段,暂无公开演示链接" }`

### 3.2 service-agent

| 字段 | 值 |
|---|---|
| slug | `service-agent` |
| index | `02` |
| category | `Agent / RAG` |
| categoryLabel | `RAG · AGENT · AI SERVICE` |
| title | `Service Agent` |
| subtitle | `AI 优先应答,低置信度问题进入人工质量闸门` |
| summary | `面向高端摄影咨询,设计查询改写、检索、重排序、置信度分流、人工复核与知识回流,重点解决准确性、边界控制和持续更新。` |
| status | `Portfolio MVP｜演示维护中` |
| demoType | `unavailable` |
| role | `产品定义 / Agent 架构 / 评估方案 / MVP 开发` |
| team | `3 人创业团队` |
| period | `2026.04 - 至今` |
| featured | `true` |
| provisional | `true` |
| evidenceLabel | `公开演示域名 chat.jael.com 当前连接关闭,演示维护中。自动应答率与准确率为内部小样本估算,待固定评测集与线上数据验证。` |

**metrics（4 项）**：
- `18` / 类咨询场景
- `3 级` / 置信度分流
- `LangGraph` / 工作流编排
- `28` / 个测试文件

**tags**：Agent / RAG / Human-in-the-loop / LangGraph

**stack**：Python / LangGraph / Flask / Next.js / Chroma / SentenceTransformer / CloudBase

**problem（2 项）**：
1. 价格、档期、拍摄流程与敏感边界容错率低,纯大模型容易编造;静态 FAQ 又无法覆盖自然语言表达。
2. 客服知识持续变化,若没有审核和回流机制,检索库会快速过期或被低质量对话污染。

**productStrategy（4 项）**：
1. 产品目标:用 LangGraph 编排检索、风险分流、生成、质量检查与人工接管,完成 Web/API 端到端 MVP。
2. 产品边界:当前为业务验证阶段,公开演示维护中,不主张生产 SLO。
3. 方案选择:采用确定性节点与 LLM 节点组合工作流,保留飞书权威主源和本地 JSON 镜像。
4. 暂不做:不追求无条件自动回复,不把内部小样本估算写成生产指标。

**decisions（3 项）**：
1. 定义 18 类咨询场景与明确的可答、需确认、必须转人工边界,先设计风险策略再设计对话。
2. 采用查询改写、候选检索与重排序链路,并通过三级置信度决定直接建议、人工复核或兜底转人工。
3. 把人工确认作为知识更新的质量闸门,优质会话才进入飞书主源、检索库和 JSON 镜像。

**link**：`{ label: "查看案例｜演示维护中", href: "#contact", note: "chat.jael.com 当前连接关闭,演示维护中" }`

### 3.3 lumen-ink

| 字段 | 值 |
|---|---|
| slug | `lumen-ink` |
| index | `03` |
| category | `Multimodal` |
| categoryLabel | `AI IMAGE · MULTI-MODEL` |
| title | `光砚 AI 图像编辑工作台` |
| subtitle | `把修图专家经验抽象为可操作的参数、流程与模型能力` |
| summary | `统一接入多类图像模型,将专业人像修图中的特征保留、光影、镜头与风格要求产品化,降低客户体验和团队复用门槛。` |
| status | `Controlled Demo｜受控演示,申请体验` |
| demoType | `controlled` |
| role | `产品负责人 / 交互设计 / 全栈 MVP` |
| team | `个人主导,团队业务验证` |
| period | `2026.05 - 至今` |
| featured | `true` |
| provisional | 无（未设置） |
| evidenceLabel | `线上 lumen-ink.vercel.app 要求密码,采用受控访问方式。CloudBase NoSQL 持久化处于最终验收,当前提供受控演示,不主张开放公开访问。` |

**metrics（4 项）**：
- `4` / 类模型 Provider
- `6` / 类专业工具
- `46` / 个测试文件
- `1 套` / 统一模型抽象

**tags**：多模态 / AI 创作 / 模型抽象 / 受控演示

**stack**：React / TypeScript / Vite / Express / GPT Image / GLM / Gemini / Seedream / CloudBase NoSQL

**problem（2 项）**：
1. 专业修图需求难以用一句提示词准确表达,客户也无法理解模型差异和结果边界。
2. 不同模型的接口、参数和失败模式不一致,直接接入会把复杂性暴露给用户和业务团队。

**productStrategy（4 项）**：
1. 产品目标:统一生成、编辑、参考图、任务状态、资产管理和失败恢复到一套可持续迭代的产品体验。
2. 产品边界:当前提供受控演示,CloudBase 持久化处于最终验收,不主张开放公开访问。
3. 方案选择:Provider 工厂与适配器统一模型调用,采用 NoSQL 持久化与高风险审计。
4. 暂不做:不公开密码,不展示直接体验入口,不主张已证明所有真实 CloudBase 并发语义。

**decisions（3 项）**：
1. 以 Provider 工厂与适配器统一模型调用、错误处理和故障转移,避免界面与某一供应商耦合。
2. 把专家经验拆成身份锚定、特征保留、修改指令、光影镜头、风格调性与负面约束六段结构。
3. 采用 NoSQL 持久化与高风险审计,覆盖幂等、事务、删除协调与 Storage 生命周期。

**link**：`{ label: "受控演示｜申请体验", href: "https://lumen-ink.vercel.app/", note: "由于演示会产生模型调用成本,当前采用受控访问方式" }`

---

## 4. 三大主案例状态分层（直接复制 `verifiedCapabilities` / `inProgressCapabilities` / `plannedCapabilities`）

### 4.1 feishu-platform

**verifiedCapabilities（7 项）**：
- 17 张业务表模型(历史基线)
- Candidate V1 合同(Zod 校验)
- SOP BR-01~06 治理规则
- 6/6 dry-run 集成门禁通过
- Portal 6 段可视化流程
- 双层幂等(摄入级 + 业务级)
- 文本摄入链路验证

**inProgressCapabilities（3 项）**：
- 真实飞书 API 写入(待配置凭据)
- Portal 公开部署(待 Preview)
- 机器人真实部署(协议设计阶段)

**plannedCapabilities（3 项）**：
- 真实 OCR 引擎接入(Tesseract / 飞书 OCR)
- ASR / CLIP 多模态适配
- 字段级数据质量看板

**lastVerifiedAt**: `2026-07-22T17:33:41Z`

### 4.2 service-agent

**verifiedCapabilities（6 项）**：
- LangGraph 工作流编排
- RAG 知识检索
- 意图与风险判断
- 人工接管路径
- 反馈飞轮闭环
- Web/API 端到端代码

**inProgressCapabilities（3 项）**：
- 公开演示恢复(chat.jael.com 连接关闭)
- 冻结评测集建立
- STATUS 文档同步

**plannedCapabilities（3 项）**：
- 真实流量灰度上线
- 指标评测(召回率/采纳率/转人工率)
- 知识过期率监控

**lastVerifiedAt**: `2026-07-23T00:00:00Z`

### 4.3 lumen-ink

**verifiedCapabilities（6 项）**：
- 多模型 Provider 抽象(OpenAI/GLM/Seedream/Gemini)
- 图片生成与编辑流程
- 异步任务状态与历史任务
- 6 类编辑工具(修脸/调色/液化/修复/消除/导出)
- JPEG/PNG/WebP 多格式导出
- 幂等与事务机制

**inProgressCapabilities（3 项）**：
- CloudBase NoSQL 持久化最终验收(FIX-R9)
- 删除协调与 Storage 生命周期
- Preview / Production 分级

**plannedCapabilities（3 项）**：
- 跨 Provider 评测面板
- 可复用风格包与审核标注
- 定时清理与并发优化

**lastVerifiedAt**: `2026-07-23T00:00:00Z`

---

## 5. 每页 section 结构

### 5.1 详情页 12 段模板（`app/projects/[slug]/page.tsx`）

| # | Section 标识 | 标题 | 字段来源 | 备注 |
|---|---|---|---|---|
| 01 | OVERVIEW | 项目概览 | subtitle / team / status / role / period / demoType | 含 case-facts aside |
| 02 | PROBLEM | 业务问题与痛点 | problem[] / tradeoffs[0] | 两栏布局 |
| 03 | PRODUCT STRATEGY | 产品策略与边界 | productStrategy[] | 仅当 productStrategy 存在时渲染 |
| 04 | SYSTEM ARCHITECTURE | 系统架构 | architecture[] / stack[] | 含 implementation-strip |
| 05 | KEY WORKFLOW | 关键用户路径 | keyWorkflow[] | 仅当 keyWorkflow 存在时渲染 |
| 06 | KEY PRODUCT DECISIONS | 关键决策 | decisions[] | 深色背景段 |
| 07 | EVIDENCE | 展示证据与边界 | outcomes[] / evidenceLinks[] / evidenceLabel | 含 evidence-warning |
| 08 | CURRENT VERSION & ROADMAP | 当前版本与路线图 | verifiedCapabilities / inProgressCapabilities / plannedCapabilities / lastVerifiedAt | StatusBadge 三栏组件 |
| 09 | MY CONTRIBUTION | 我的贡献 | myContribution[] | 仅当 myContribution 存在时渲染 |
| 10 | PRODUCT EVIDENCE | 界面/流程证据 | images[] / imageMode | ProjectGallery 组件 |
| 11 | TRADE-OFFS & NEXT | 取舍与下一步 | tradeoffs[] / nextSteps[] | 两栏布局 |
| 12 | CROSS-PROJECT RELATIONSHIPS | 跨项目关系 | relationships[] | 链接网格 |

详情页还包含：case-hero（breadcrumb / subtitle / summary / tags / case-facts / metrics / evidenceLabel / provisional 提示）与底部 case-navigation（上一个 / 全部 N 个项目 / 下一个）和 case-contact（联系 + 简历下载）。

### 5.2 首页 9 section 列表（`app/page.tsx`）

1. Hero（含 hero-copy / hero-visual / hero-metrics）
2. Proof Section（capabilities 6 卡片）
3. Capability Chain Section（8 步）
4. Featured Case Studies（3 主案例卡片）
5. System Section（SystemMap）
6. Method Section（4 原则 + DataFlywheel）
7. Selected Experiments（ProjectLibrary）
8. Experience Section（时间线 3 段）
9. Contact Section（邮箱 / GitHub / 简历）

---

## 6. 所有 In Closure / Next Iteration 项（合并表）

| 项目 | 分类 | 能力 |
|---|---|---|
| feishu-platform | In Closure | 真实飞书 API 写入(待配置凭据) |
| feishu-platform | In Closure | Portal 公开部署(待 Preview) |
| feishu-platform | In Closure | 机器人真实部署(协议设计阶段) |
| feishu-platform | Next Iteration | 真实 OCR 引擎接入(Tesseract / 飞书 OCR) |
| feishu-platform | Next Iteration | ASR / CLIP 多模态适配 |
| feishu-platform | Next Iteration | 字段级数据质量看板 |
| service-agent | In Closure | 公开演示恢复(chat.jael.com 连接关闭) |
| service-agent | In Closure | 冻结评测集建立 |
| service-agent | In Closure | STATUS 文档同步 |
| service-agent | Next Iteration | 真实流量灰度上线 |
| service-agent | Next Iteration | 指标评测(召回率/采纳率/转人工率) |
| service-agent | Next Iteration | 知识过期率监控 |
| lumen-ink | In Closure | CloudBase NoSQL 持久化最终验收(FIX-R9) |
| lumen-ink | In Closure | 删除协调与 Storage 生命周期 |
| lumen-ink | In Closure | Preview / Production 分级 |
| lumen-ink | Next Iteration | 跨 Provider 评测面板 |
| lumen-ink | Next Iteration | 可复用风格包与审核标注 |
| lumen-ink | Next Iteration | 定时清理与并发优化 |

**总计**：9 项 In Closure + 9 项 Next Iteration = 18 项。

---

## 7. 所有 CTA

### 7.1 首页 CTA

| 位置 | 文案 | href | target |
|---|---|---|---|
| hero-actions | `查看重点案例 ↓` | `#featured` | 同窗口 |
| hero-actions | `联系 ↗` | `#contact` | 同窗口 |
| hero-links | `GitHub` | `https://github.com/Catcherog` | `_blank` |
| hero-links | `Email` | `mailto:Jael_Chen@foxmail.com` | 同窗口 |
| hero-links | `联系` | `#contact` | 同窗口 |
| hero-visual（3 个面板） | `{index} · {categoryLabel}` | `/projects/{slug}` | 同窗口 |
| Featured 卡片 | `阅读完整案例 ↗` | `/projects/{slug}` | 同窗口 |
| Featured 卡片 | `{link.label}` | `{link.href}` | 视项目而定 |
| contact-actions | `邮箱` | `mailto:Jael_Chen@foxmail.com` | 同窗口 |
| contact-actions | `GitHub` | `https://github.com/Catcherog` | `_blank` |
| contact-actions | `简历(临时入口)` | `/resume/chen-jiawei-ai-agent-cn-one-page.pdf` | `_blank` |
| footer-bottom | `返回顶部 ↑` | `#top` | 同窗口 |

### 7.2 详情页 CTA（按项目）

| 项目 | link.label | link.href | link.note |
|---|---|---|---|
| feishu-platform | `本地运行说明` | `#contact` | `Prototype 阶段,暂无公开演示链接` |
| service-agent | `查看案例｜演示维护中` | `#contact` | `chat.jael.com 当前连接关闭,演示维护中` |
| lumen-ink | `受控演示｜申请体验` | `https://lumen-ink.vercel.app/` | `由于演示会产生模型调用成本,当前采用受控访问方式` |

### 7.3 详情页通用 CTA

- `阅读完整案例 ↗`（Featured 卡片，首页跳详情页）
- `← 上一个案例` + 项目标题（case-navigation）
- `全部 {totalCount} 个项目`（case-navigation，totalCount 动态 = 8）
- `下一个案例 →` + 项目标题（case-navigation）
- `联系我 ↗`（case-contact，mailto）
- `下载简历(临时入口) ↗`（case-contact，PDF）

### 7.4 实验项目 CTA（在 ProjectLibrary 渲染）

| 项目 | link.label | link.href | link.note |
|---|---|---|---|
| wechat-bot | 无 link 字段 | — | — |
| content-research | 无 link 字段 | — | — |
| brand-website | `访问品牌官网` | `https://zehuai-image.vercel.app/` | — |
| lora-finetuning | 无 link 字段 | — | — |
| mini-program | `微信搜索体验` | `#contact` | `小程序:泽怀影像` |

---

## 8. 候选截图说明（从 evidence JSON 中筛 12 项）

按 `evidenceType` 为 `screenshot` 或 `architecture` 优先选取，覆盖三大主案例：

| # | Evidence ID | Title | Project | Capability | Type | Public Safe | 当前状态 | 建议用途 |
|---|---|---|---|---|---|---|---|---|
| 1 | FEISHU-002 | Portal 浏览器证据(6 张脱敏截图) | feishu-platform | 智能录入层 | screenshot | true | VERIFIED | 首页 Featured feishu 卡片主图 |
| 2 | FEISHU-006 | 五层平台架构图 | feishu-platform | 系统架构 | architecture | true | VERIFIED | feishu 详情页 04 SYSTEM ARCHITECTURE |
| 3 | FEISHU-001 | 集成 Gate 6/6 场景通过 | feishu-platform | 智能处理层 | test | true | VERIFIED | feishu 详情页 07 EVIDENCE |
| 4 | FEISHU-007 | dry-run 审计日志与事务快照 | feishu-platform | 数据层 | data | true | VERIFIED | feishu 详情页 07 EVIDENCE |
| 5 | SCS-001 | LangGraph 工作流流程图 | service-agent | Agent 编排 | architecture | true | VERIFIED | service-agent 详情页 04 SYSTEM ARCHITECTURE |
| 6 | SCS-002 | 客服聊天页面 | service-agent | 前端入口 | screenshot | true | VERIFIED | 首页 Featured service-agent 卡片主图 |
| 7 | SCS-003 | 人工接管案例 | service-agent | 人工节点 | screenshot | true | VERIFIED | service-agent 详情页 10 PRODUCT EVIDENCE |
| 8 | SCS-004 | 知识检索 API 证据 | service-agent | RAG | api | true | VERIFIED | service-agent 详情页 07 EVIDENCE |
| 9 | LUMEN-001 | 工作台首页 | lumen-ink | 前端入口 | screenshot | true | VERIFIED | 首页 Featured lumen-ink 卡片主图 |
| 10 | LUMEN-002 | 生成或编辑流程 | lumen-ink | 生成式工作台 | screenshot | true | VERIFIED | lumen-ink 详情页 10 PRODUCT EVIDENCE |
| 11 | LUMEN-004 | Provider 抽象图(OpenAI/GLM/Seedream/Gemini) | lumen-ink | 模型抽象 | architecture | true | VERIFIED | lumen-ink 详情页 04 SYSTEM ARCHITECTURE |
| 12 | LUMEN-005 | NoSQL 持久化状态图(CloudBase FIX-R9) | lumen-ink | 持久化层 | architecture | true | **IN_PROGRESS** | lumen-ink 详情页 08 CURRENT VERSION & ROADMAP |

> **注**：SCS-007（Demo Disclosure: chat.jael.com 连接关闭）状态为 `CONTRADICTED`，**不建议**作为截图展示。已从候选清单中排除。

---

## 9. 已使用但尚无量化证据的业务主张（7 项）

| # | 主张文本 | 出现位置 | 是否有证据 | 建议 GPT 审查方向 |
|---|---|---|---|---|
| 1 | `17 张业务表与 12 条自动化`（标注"历史基线"） | feishu-platform metrics[2] + hero-metrics[2] + capabilities[0].evidence + capabilities[2].evidence | 部分证据（17 表模型存在，12 自动化无独立量化） | 是否保留 / 改为更弱表述 / 增加证据说明 / 标注"业务叙述" |
| 2 | `Collator 504 单元测试 + SOP 91 单元测试` | feishu-platform metrics[3] + outcomes[2] | 仓库内部计数 | 是否标注"截至 commit `1e5e5ad` / `d5e08de` 的内部计数" |
| 3 | `282 SKU / 峰值 80+ 项目` | hero-metrics[3] + experience timeline[1].bullets[0] | TP-Link 时期业务叙述，无独立证据 | 是否保留 / 标注"业务叙述，未经独立审计" / 改为范围表述 |
| 4 | `5 款产品提前 15 天量产` | experience timeline[1].bullets[2] | 业务叙述，无独立证据 | 同上，或删除具体数字改为"按时交付高风险项目" |
| 5 | `18 类咨询场景 / 3 级置信度分流` | service-agent metrics[0] + metrics[1] + capabilities[0].evidence | 设计产物，非线上验证 | 是否标注"设计产物" / 区分"设计完成" vs "线上验证" |
| 6 | `819 tracked 文件 / 28 测试文件 / 560 文档` | service-agent outcomes[2] | 仓库内部统计 | 是否标注"截至 commit `f98b1f5` 的内部统计" |
| 7 | `4 类模型 Provider / 6 类专业工具 / 46 测试文件` | lumen-ink metrics[0] + metrics[1] + metrics[2] + outcomes[2] | 仓库内部统计 | 同上，标注"截至 commit `ca6a317` 的内部统计" |

**GPT 审查重点**：
- 主张 1 与主张 2 中"12 条自动化"是审计包 `08_WEBSITE_AUDIT_JAELCHEN.md` 已标记的"无独立量化证明"项，建议明确处理。
- 主张 3 与主张 4 是 TP-Link 业务叙述，可能影响招聘方对"AI 产品经理"定位的认知，建议评估是否保留。
- 主张 5-7 是设计产物或仓库统计，可作为"工程证据"但不应作为"业务效果"。

---

## 10. 审查请求

### 10.1 GPT 需审阅的 5 个维度

| 维度 | 审查要点 | 关键文件位置 |
|---|---|---|
| **文案口径** | Hero 定位句、6 能力标签、3 主案例 subtitle/summary 是否准确、是否过度承诺 | §2.1, §2.4, §3.1-3.3 |
| **状态分层** | verified/inProgress/planned 是否清晰分层、是否有未验收能力写成当前事实 | §4.1-4.3, §6 |
| **CTA 边界** | 所有 CTA 是否与 demoType 一致、是否泄露密码、是否有"立即在线体验"等禁止措辞 | §7.1-7.4 |
| **业务主张** | 7 项无量化证据的业务主张是否需要弱化、删除或补证 | §9 |
| **PII / secret** | 是否有手机号、token、表 ID、客户信息泄露 | consistency gate 已自动检查，GPT 复核 |

### 10.2 不可自行上调的字段（provisional 标记）

以下两个项目的 `provisional: true` 标记保留，表示"当前公开状态待 Codex 最终校正，不得自行上调"：

- **feishu-platform**：`provisional: true`
- **service-agent**：`provisional: true`

详情页会渲染 PROVISIONAL 警示文案：`PROVISIONAL:当前公开状态待 Codex 最终校正,不得自行上调。`

**lumen-ink** 无此标记（因为 CloudBase FIX-R9 已在 LUMEN-CLOUDBASE-NOSQL-IMPLEMENT-01 完成实现，仅待最终验收）。

### 10.3 Codex delta-review 输入待生成

规范引用的 Codex 后续输出 `D:\360Downloads\Trae 项目\_portfolio_audit\delta-review\08_TRAE_IMPLEMENTATION_INPUT.md` **当前尚未生成**。本 Sprint 基于审计包 00-14 + 本地仓库核验制定。若 Codex 后续输出与本 Sprint 内容冲突，以 Codex 输出为准并更新官网。

### 10.4 GPT 审查输出建议格式

GPT 完成审查后，建议输出：

```
## GPT Review Result

### PASS / CONDITIONAL PASS / FAIL

### 文案口径审查
- [通过/修改建议] 每条文案的审查结论

### 状态分层审查
- [通过/修改建议]

### CTA 边界审查
- [通过/修改建议]

### 业务主张审查
- [保留/弱化/删除/补证] 每项主张的处理建议

### PII / secret 审查
- [通过/发现风险]

### 不可上调字段确认
- [确认 provisional 标记保留]

### 下一步建议
- 是否可 merge 到 main
- 是否可触发 Vercel 部署
- 需要用户补充的业务事实
```

---

## 附录: 实验项目列表（5 项，不在 GPT 重点审查范围）

| slug | index | title | status | demoType | featured | archived |
|---|---|---|---|---|---|---|
| wechat-bot | 04 | 微信公众号 AI 客服机器人 | Portfolio Demo | local-only | false | false |
| content-research | 05 | 多平台爆款内容调研工具 | Experiment | local-only | false | false |
| brand-website | 06 | 泽怀影像品牌官网 | Final Validation | public | false | false |
| lora-finetuning | 07 | LoRA 客服 Agent 微调 | Experiment | local-only | false | false |
| mini-program | 08 | 泽怀影像微信小程序 | Experiment | local-only | false | **true** |

`mini-program` 标记为 `archived: true`，不出现在首页 Selected Experiments（experimentProjects 过滤了 archived），但 `/projects/mini-program` 路由仍可访问。

---

**审查包结束**

GPT 审查完成后，请将审查结果通过 `PORTFOLIO-CLOSURE-SPRINT-01-GPT-REVIEW-RESULT.md`（或等价文件）反馈给 Trae，Trae 将根据审查结果执行必要的修正并重新提交。
