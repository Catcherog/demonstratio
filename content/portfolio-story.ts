export type StoryLayerNode = {
  index: string;
  label: string;
  slug: string;
  detail: string;
  kind: "flagship" | "supporting";
};

export type BusinessOsLayer = {
  index: string;
  label: string;
  caption: string;
  nodes: StoryLayerNode[];
};

export const businessOsLayers: BusinessOsLayer[] = [
  {
    index: "01",
    label: "运营与人工复核",
    caption: "把风险、异常和不确定性变成可接管的工作流。",
    nodes: [
      { index: "01", label: "Service Agent", slug: "service-agent", detail: "回答、澄清、拒答与转人工", kind: "flagship" },
      { index: "02", label: "飞书治理", slug: "data-platform", detail: "SOP Gate、回读与审计", kind: "flagship" },
    ],
  },
  {
    index: "02",
    label: "Agent 与自动化",
    caption: "让模型在明确的工具、证据和失败路径里工作。",
    nodes: [
      { index: "03", label: "Service Agent", slug: "service-agent", detail: "检索、重排、支持度与 fail-closed", kind: "flagship" },
      { index: "04", label: "Collator", slug: "collator", detail: "多模态资料进入候选记录", kind: "supporting" },
    ],
  },
  {
    index: "03",
    label: "业务数据与记忆",
    caption: "把业务对象、知识和反馈沉淀为可治理的数据合同。",
    nodes: [
      { index: "05", label: "飞书 AI 业务数据平台", slug: "data-platform", detail: "客户、项目、素材与内容统一建模", kind: "flagship" },
      { index: "06", label: "内容调研", slug: "content-research", detail: "来源、标签与洞察反哺业务", kind: "supporting" },
    ],
  },
  {
    index: "04",
    label: "适配器、API 与模型",
    caption: "用可替换的 Provider、接口和模型能力支撑不同任务。",
    nodes: [
      { index: "07", label: "光砚", slug: "lumen-ink", detail: "Provider 路由、任务状态与结果复核", kind: "flagship" },
      { index: "08", label: "LoRA 微调", slug: "lora-finetuning", detail: "业务语料与本地推理验证", kind: "supporting" },
    ],
  },
];

export const portfolioStory = {
  name: "AI BUSINESS OS",
  eyebrow: "AI BUSINESS OS · PRODUCT SYSTEMS",
  positioning: "我把客户触点、业务数据、Agent / 模型能力和人工可靠性组织成一套可验证的 AI 产品系统。",
  headline: "不是三个孤立 Demo，而是一套能被业务接住的 AI BUSINESS OS。",
  systemDescription: "从业务问题开始，经由数据与知识、Agent / 模型和可替换接口，最终回到人工复核、评估和下一轮迭代。",
  buildLoop: ["业务问题", "数据 / 知识", "Agent / 模型", "人工复核", "评估回流"],
  reliabilityHeadline: "先把错误变得可见，再让自动化变得更快。",
  experienceLine: "从复杂项目交付，到 AI BUSINESS OS 创业。",
  flagshipCases: [
    {
      slug: "data-platform",
      href: "/projects/data-platform",
      label: "业务数据平台",
      title: "飞书 AI 业务数据平台",
      capability: "把非结构化业务资料变成可治理、可追踪的业务对象。",
      proof: "Test Base E2E、生产 Schema 表级只读核验、正式写入保持 fail-closed。",
    },
    {
      slug: "service-agent",
      href: "/projects/service-agent",
      label: "客户交互智能",
      title: "Service Agent",
      capability: "用风险优先的 Agent 工作流决定回答、澄清、拒答或转人工。",
      proof: "真实录屏和受控 B1 / B2 / B3 先于不稳定的实时上游入口。",
    },
    {
      slug: "lumen-ink",
      href: "/projects/lumen-ink",
      label: "多模态生产",
      title: "光砚 Lumen",
      capability: "把图像生成收敛为有 Provider 边界、任务状态和结果复核的工作台。",
      proof: "Seedream 4.5 文生图与图生图已验证；其他编辑模式不外推。",
    },
  ],
} as const;
