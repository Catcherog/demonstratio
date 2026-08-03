import type { FlagshipCaseStudy } from "./types";

export const dataPlatformCase: FlagshipCaseStudy = {
  slug: "data-platform",
  overview: {
    oneLine: "把分散在聊天、表格和个人经验中的摄影业务信息，收敛为可治理、可追踪、可审计的业务数据链路。",
    responsibility: "负责业务建模、产品边界、数据合同、治理规则、摄入链路与 Pilot 验证方案。",
    status: "Portfolio Pilot｜真实测试 Base E2E 已验证，生产 V2 Schema 表级匹配通过（10/10），正式业务 Pilot 待启用",
    boundary: "历史 Test Base 的 17 / 12 是 V1 验收基线；当前生产只读检查为 10 / 216，并完成表级匹配。字段级差异和正式业务写入仍保持 fail-closed。",
    claimIds: [
      "FEISHU-TABLE-COUNT",
      "FEISHU-AUTOMATION-COUNT",
      "FEISHU-TEST-E2E",
      "FEISHU-LIVE-SCHEMA",
      "FEISHU-LIVE-TABLE-COUNT",
    ],
  },
  business: {
    whyBuild: "客户、订单、项目、素材与交付状态缺少统一身份和流转口径，团队无法获得一张可信的运营视图，也难以安全扩大自动化。",
    signals: [
      {
        title: "信息源分散",
        detail: "同一业务对象在聊天记录、人工表格和现场记录中重复出现，状态和责任人无法稳定对齐。",
        evidenceRefs: ["E-FEISHU-SOURCES"],
      },
      {
        title: "异常路径成本高",
        detail: "非标摄影交付包含补拍、延期、素材缺失和权限异常，直接增加表单会把错误放大到后续自动化。",
        evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
      },
    ],
    judgments: [
      {
        title: "先稳定摄入与身份",
        detail: "先保证原始来源、候选记录和业务对象可追溯，再讨论自动创建和跨表联动。",
        evidenceRefs: ["E-FEISHU-SOURCES", "E-FEISHU-PILOT-TESTS"],
      },
      {
        title: "先治理再扩自动化",
        detail: "人工确认、SOP Gate、幂等、审计和精确清理是正式 Pilot 的前置条件，而不是上线后的补丁。",
        evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
      },
    ],
    constraints: [
      "生产检查只允许读取 Schema，不读取客户记录。",
      "字段级差异未完成前，不开启正式业务写入。",
      "历史 Test Base 口径与生产 V2 口径必须分开展示。",
    ],
  },
  product: {
    form: "飞书业务数据平台、角色化运营视图与受控摄入入口的组合产品。",
    users: ["业务负责人", "现场执行人员", "运营与交付协作者", "负责复核数据的管理员"],
    workflow: [
      {
        title: "来源进入摄入层",
        detail: "截图、文本或表单输入保留来源上下文，进入候选数据而不是直接成为业务事实。",
        evidenceRefs: ["E-FEISHU-SOURCES", "E-FEISHU-PILOT-TESTS"],
      },
      {
        title: "人工确认与治理",
        detail: "候选记录经过人工补全和 SOP Gate，输出 PASS、NEEDS_REVIEW 或 REJECT。",
        evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
      },
      {
        title: "写入与运营视图",
        detail: "通过治理门的数据才可进入 Test Base，并验证重复输入、审计记录与按 ID 精确清理。",
        evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
      },
    ],
    decisions: [
      {
        title: "把飞书作为记录系统",
        detail: "保留业务团队可直接维护的低代码界面，复杂治理和摄入逻辑由独立服务承担。",
        evidenceRefs: ["E-FEISHU-SOURCES"],
      },
      {
        title: "正式写入默认关闭",
        detail: "生产 Schema 只读检查和 Pilot 写入拆成两个 Gate，避免表级匹配被误解为生产写入已完成。",
        evidenceRefs: ["E-FEISHU-LIVE-SCHEMA"],
      },
    ],
    nonGoals: [
      "不在当前阶段替换飞书为自建全量 ERP。",
      "不把 Test Base 的自动化数量表述为 V2 生产部署结果。",
      "不在缺少字段级差异证据时开启真实客户数据写入。",
    ],
  },
  technical: {
    architecture: [
      {
        title: "Sources → Ingest",
        detail: "将截图、文本和表单归一为带来源的候选数据，并隔离机器识别结果与业务事实。",
        evidenceRefs: ["E-FEISHU-SOURCES"],
      },
      {
        title: "Govern → Operational views",
        detail: "SOP Gate、身份关联和写入策略共同决定记录能否进入业务视图。",
        evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
      },
    ],
    mechanisms: [
      {
        title: "Schema mapping",
        detail: "按 V2 目标表集合进行只读生产检查，表级匹配通过后继续保留字段级差异任务。",
        evidenceRefs: ["E-FEISHU-SCHEMA", "E-FEISHU-LIVE-SCHEMA"],
      },
      {
        title: "三层幂等与审计",
        detail: "请求、业务对象和写入日志共同限制重复创建，并保留可追踪的处理结果。",
        evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
      },
      {
        title: "脱敏与精确清理",
        detail: "公开材料排除真实业务标识；测试记录按已记录的 record ID 精确回收。",
        evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
      },
    ],
    tradeoffs: [
      {
        title: "低代码速度与复杂治理",
        detail: "用飞书降低业务维护成本，同时把高风险批处理和治理逻辑放在可测试的服务层。",
        evidenceRefs: ["E-FEISHU-SOURCES"],
      },
      {
        title: "先表级、后字段级",
        detail: "先确认生产表集合与 V2 目标一致，再逐字段核验，避免一次性扩大读取和写入范围。",
        evidenceRefs: ["E-FEISHU-LIVE-SCHEMA"],
      },
    ],
  },
  iterations: [
    {
      version: "V1 · Test Base 基线",
      trigger: "团队需要把历史业务对象和自动化规则显性化。",
      productChange: "建立 Test Base 业务模型和运营视图。",
      technicalChange: "形成历史表结构、字段和自动化基线。",
      result: "历史基线被记录并可与后续 V2 分开比较。",
      boundary: "历史数量不是当前生产部署证明。",
      evidenceRefs: ["E-FEISHU-SCHEMA"],
    },
    {
      version: "E2E · 可回收测试链路",
      trigger: "需要证明非结构化输入不会直接污染业务记录。",
      productChange: "增加候选确认、三态 Gate 和清理闭环。",
      technicalChange: "接入 OCR、幂等、审计与 record ID 精确清理。",
      result: "测试摄入到精确清理链路完成验证。",
      boundary: "仅限 Test Base，不触达正式业务数据。",
      evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
    },
    {
      version: "V2 · 生产 Schema 对齐",
      trigger: "正式 Pilot 前需要核对生产数据结构是否兼容。",
      productChange: "把生产检查拆为只读 Schema Gate 和后续写入 Gate。",
      technicalChange: "读取生产表与字段元数据，执行目标表集合对齐。",
      result: "生产 V2 表级匹配完成。",
      boundary: "字段级差异仍待完成，Pilot 写入保持关闭。",
      evidenceRefs: ["E-FEISHU-LIVE-SCHEMA"],
    },
    {
      version: "Public Portal UI · 公开产品入口",
      trigger: "需要让招聘方直接理解候选确认、治理 Gate 和受控写入计划的产品交互。",
      productChange: "发布飞书智能录入台公开前端，展示从来源输入到结果回读的操作流程。",
      technicalChange: "前端部署至 Vercel；Collator 与 SOP 服务继续保持受控连接和写入边界。",
      result: "公开 Portal UI 已可访问。",
      boundary: "公开入口不等于正式业务 Base 已开放写入；本轮 partial 运行不能作为成功案例。",
      evidenceRefs: ["E-FEISHU-SOURCES", "E-FEISHU-PILOT-TESTS"],
    },
    {
      version: "Pilot · 待启用",
      trigger: "字段差异、权限和回滚方案闭合后才能进入真实业务验证。",
      productChange: "限定 Pilot 范围、操作角色和异常升级路径。",
      technicalChange: "启用受控写入、监控与可回滚清理。",
      result: "尚未执行。",
      boundary: "正式业务 Pilot 与通知自动化均未启用。",
      evidenceRefs: ["E-FEISHU-LIVE-SCHEMA"],
    },
  ],
  evidenceIds: [
    "data-platform-closed-loop",
    "data-platform-schema-verification",
    "data-platform-e2e-verification",
    "data-platform-portal-entry",
    "data-platform-walkthrough",
  ],
};
