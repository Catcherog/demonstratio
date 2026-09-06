# Portfolio Website Interview Runbook — 2026-09

更新时间：2026-09-06（Asia/Shanghai）
目标：在约三分钟内讲清 AI BUSINESS OS 的定位、系统层、三项旗舰能力和证据边界。

## Preflight

1. 打开 `/interview`，确认页面状态文案仍是 fallback/controlled，而不是未经复核的 LIVE/production 宣称。
2. 准备四个脚本：`umbrella.md`、`service-agent.md`、`data-platform.md`、`lumen.md`。
3. Service Agent 先打开 `service-agent-live-demo-01` 录屏；不要把实时入口作为开场依赖。
4. 若要复核本地 source，运行：

```text
npm test
npm run check:portfolio
npm run test:case-browser
```

若需要 authority case tests，先在本地环境设置已提供的 `PORTFOLIO_AUTHORITY_DIR`，不要把路径、cookie、header 或凭证放入页面或录屏。

## 三分钟顺序

### 0:00–0:30｜定位

“我是 AI / Agent 产品经理，负责把客户交互、业务数据和多模态能力组织成可验证产品，并把人工复核、治理和评估放回系统里。”

先指出 `/interview` 的 headline：这不是三个孤立 Demo，而是一套能被业务接住的 AI BUSINESS OS。强调这里是作品集的统一产品叙事，不声称三个系统共享同一个生产运行时。

### 0:30–1:15｜系统

按四层从上到下讲：

1. 运营与人工复核：风险 Gate、接管、评估回流；
2. Agent 与自动化：理解问题、检索证据、生成回答、拒答或转人工；
3. 业务数据与记忆：来源、Schema、SOP、候选记录与可追踪状态；
4. 适配器、API 与模型：Provider adapter、接口边界和模型能力。

用 build loop 收束：业务问题 → 数据/知识 → Agent/模型 → 人工复核 → 评估回流。

### 1:15–2:45｜三个旗舰案例

- **Service Agent**：讲风险优先的客户交互智能。先放真实录屏，再用受控 B1/B2/B3 说明证据支持、风险判断和转人工；实时公网入口只作为次级补充。
- **Feishu AI 业务数据平台**：讲数据合同、受控摄入、幂等、审计和可回收 Test Base E2E；再区分生产侧当前只是 Schema 元数据只读与表级匹配。
- **光砚 Lumen**：讲 Provider 抽象、任务状态、结果复核和多模态生产；只演示 Seedream 4.5 文生图与图生图两项已验证操作。

每个案例都遵循“问题 → 我负责的系统决策 → 当前可复核证据 → 明确边界”。

### 2:45–3:00｜收束

“我交付的不是一个看起来会回答的 Demo，而是一条能被业务接住、能被人工复核、能用评估结果继续迭代的 AI 产品链路。”

最后给出 `/resume`，如对方想深入，再按 case page 的六个 section 继续。

## 故障分流

| 现象 | 立即动作 |
| --- | --- |
| Service Agent upstream/chat E2E 不稳定 | 停止刷新和真实请求，回到录屏、架构图、受控场景。 |
| Lumen 登录或 CloudBase 返回 503 | 回到已核验图片和 Provider 边界，不把在线工作台说成全面可用。 |
| Feishu Portal 不可达 | 用闭环证据、架构图和 read-only Schema 结果继续，不进行外部写入。 |
| Preview 不可用 | 继续使用本地已验证 `/interview` 和录屏；在交付记录中标记 Preview 未证明。 |

## 绝不口述

- 不说所有问题都能自动回答、没有人工介入或已达到某个准确率。
- 不把 Test Base 数字说成生产业务 Pilot、业务 KPI 或通知自动化结果。
- 不把健康接口 200、READY alias、当前公网可达或旧 SHA 说成 deployment source-SHA 证明。
- 不说 Lumen 的液化、修复、消除、所有 Provider 或完整 auth 链路已经验证。
- 不发送真实生产聊天 POST，不公开 Base/table/token/secret 等标识。
