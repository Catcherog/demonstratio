# SCS 案例页布局精修设计

**Project ID:** MONOREPO-PORTFOLIO
**Task ID:** SCS-CASE-PAGE-LAYOUT-REFINE-01
**Status:** APPROVED_FOR_IMPLEMENTATION
**Scope:** Service Agent 旗舰案例页的体验入口、技术实现、迭代链路与宽屏导航布局

## 目标

在不重构全站、不改变 Service Agent 真实 Demo URL、证据 ID、业务状态或其他案例内容的前提下，修复案例页的重复体验入口、技术卡片失衡、迭代卡片裁切和宽屏导航遮挡问题。桌面端保持编辑式暖白视觉，移动端按单列阅读顺序呈现。

## 设计决策

### 体验入口

content/flagship-cases/service-agent.ts 增加 demoStatus: "live"，作为明确的数据默认值。NEXT_PUBLIC_DEMO_STATUS 只作为可选覆盖：

- live：使用 service-agent-live-frontend 作为唯一主入口。
- fallback：使用 service-agent-controlled-demo 作为唯一主入口。
- 未设置或值无效：回退到案例数据中的 demoStatus，因此默认仍为 live，不会因 undefined 意外切换到备用模式。

两条记录的相同 URL 不再生成两个独立体验卡。主卡保留一个“打开体验”按钮；另一条记录只作为卡片内的备用模式说明，不再渲染第二个入口按钮。两个证据记录及其 evidence ID 继续保留在数据源中。

### 技术实现

TechnicalImplementation 将架构与工程取舍按索引交错，再接入全部机制点，形成 Service Agent 的 7 张技术卡：前 6 张按桌面端 2 列 × 3 行排列，第 7 张 R0–R3 fail-closed policy 跨两列。卡片文案和 evidence refs 直接来自既有 study.technical 数据，不复制或改写业务描述。

- 桌面端：2 列；奇数末卡跨两列。
- 平板端：2 列，在更窄宽度降为 1 列。
- 移动端：1 列。
- 使用 min-width: 0 和网格伸展，避免窄列文本把页面撑出横向滚动。

### 迭代链路

保留每个 IterationEntry 的触发、产品变化、技术变化、结果、边界和证据字段。网格改为：

- 桌面端 3 列 × 2 行；
- 平板端 2 列 × 3 行；
- 移动端 1 列；
- 取消 overflow-x: auto 和卡片 min-width，禁止通过横向滚动隐藏内容。

### 导航与容器

FlagshipCasePage 将六个现有 section 放入 case-content-layout：宽屏时导航和正文是两个独立网格列，导航不会覆盖正文；低于 1280px 时导航恢复为顶部横向 sticky 导航。section ID 和 hash 跳转保持不变。

- >=1280px：case-section-nav 为独立 sticky 侧栏。
- <1280px：沿用顶部 sticky 导航。
- 移动端：顶部导航允许横向滚动，但正文和迭代卡片不产生页面级横向溢出。
- 外层宽度在宽屏提升到约 1240px，为侧栏和正文预留空间；正文列使用 minmax(0, 1fr)。

## 受影响边界

- 允许修改：components/case-study/FlagshipCasePage.tsx、CaseEvidenceGallery.tsx、TechnicalImplementation.tsx、content/flagship-cases/types.ts、content/flagship-cases/service-agent.ts、app/case-study.css，以及针对本任务的测试与 spec/plan 文档。
- 不修改：后端、真实 Demo URL、证据 ID、Service Agent 业务状态文案、其他案例数据、其他案例页专属内容。
- 不新增必须配置的环境变量；环境变量仅在存在且值为 live 或 fallback 时覆盖数据默认值。

## 验证标准

1. Service Agent Live 默认只显示一个体验主按钮，B1/B2/B3 仅显示为备用模式说明。
2. NEXT_PUBLIC_DEMO_STATUS=fallback 显示受控演示为唯一主按钮；未设置时仍采用 demoStatus: "live"。
3. Service Agent 技术点仍为 7 个，前 6 个两列，最后一个跨两列。
4. 迭代链路在桌面/平板/移动端分别为 3/2/1 列，不使用横向溢出。
5. >=1280px 导航占独立侧栏列；<1280px 保持顶部导航。
6. 在 1440、1280、1024、768、390px 视口检查无正文遮挡、卡片裁切或页面级横向滚动。
7. 通过现有 lint/typecheck、相关契约测试、全量项目测试和生产 build；既有 authority package 路径问题需单独记录，不与本次页面改造混淆。
