export type ProjectCategory =
  | "Agent / RAG"
  | "Data / Automation"
  | "Multimodal"
  | "User Product"
  | "Growth"
  | "Model Training";

export type ProjectMetric = {
  value: string;
  label: string;
  note?: string;
};

export type ArchitectureStep = {
  label: string;
  detail: string;
};

export type DemoType = "public" | "controlled" | "local-only" | "unavailable";

export type EvidenceLink = {
  label: string;
  type: "screenshot" | "test" | "api" | "architecture" | "data" | "deploy";
  ref: string;
};

export type WorkflowStep = {
  label: string;
  detail: string;
};

export type ContributionArea = {
  area: string;
  detail: string;
};

export type Project = {
  slug: string;
  index: string;
  category: ProjectCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  summary: string;
  status: string;
  demoType: DemoType;
  role: string;
  team: string;
  period: string;
  featured?: boolean;
  archived?: boolean;
  provisional?: boolean;
  evidenceLabel?: string;
  metrics: ProjectMetric[];
  tags: string[];
  stack: string[];
  problem: string[];
  productStrategy?: string[];
  decisions: string[];
  outcomes: string[];
  architecture: ArchitectureStep[];
  keyWorkflow?: WorkflowStep[];
  tradeoffs: string[];
  nextSteps: string[];
  verifiedCapabilities: string[];
  inProgressCapabilities: string[];
  plannedCapabilities: string[];
  evidenceLinks?: EvidenceLink[];
  myContribution?: ContributionArea[];
  lastVerifiedAt?: string;
  relationships: { slug: string; label: string; detail: string }[];
  images: string[];
  imageMode?: "desktop" | "mobile" | "mixed";
  link?: { label: string; href: string; note?: string };
};

export const projects: Project[] = [
  {
    slug: "feishu-platform",
    index: "01",
    category: "Data / Automation",
    categoryLabel: "FEISHU AI BUSINESS DATA PLATFORM",
    title: "飞书 AI 业务数据平台",
    subtitle: "把聊天记录、截图、表单和人工录入转化为可治理的飞书业务数据",
    summary:
      "面向中小型业务团队的 AI 业务数据平台,通过智能录入、Candidate 候选生成、SOP 治理规则、人工复核与 dry-run 写入,把非结构化输入转化为可治理的飞书业务数据。自动化通知与机器人作为执行层能力,当前处于协议设计与受控验证阶段,未主张已实现降本效果。",
    status: "Portfolio MVP｜核心 dry-run 链路已验证,生产集成收尾中",
    demoType: "local-only",
    role: "产品负责人 / 数据模型设计 / 治理规则 / MVP 开发",
    team: "3 人创业团队",
    period: "2026.02 - 至今",
    featured: true,
    provisional: true,
    evidenceLabel:
      "17 张表与 12 条自动化为旧版业务底座(历史基线)。当前 V2 链路以 dry-run 集成门禁为证据,真实飞书写入未上线。OCR/ASR/CLIP 按真实进度分开标记,未形成统一可验证闭环。",
    metrics: [
      { value: "5 层", label: "平台模块架构" },
      { value: "6/6", label: "dry-run 集成门禁" },
      { value: "17 / 12", label: "数据表 / 自动化(历史基线)", note: "旧版底座" },
      { value: "504+91", label: "Collator + SOP 单元测试" },
    ],
    tags: ["数据平台", "治理规则", "人工复核", "Agent 摄入"],
    stack: ["Next.js 16", "Fastify", "TypeScript", "Zod", "Node.js", "飞书 Bitable", "Vitest"],
    problem: [
      "客户、项目、素材、供应商与内容数据分散在聊天记录、截图和个人经验中,人工整理慢且容易遗漏字段。",
      "LLM 直接提取后写库会产生格式、枚举、状态和逻辑错误;普通表单无法处理弱网、权限和异常路径,单次 LLM 调用不足以保证业务数据可治理。",
    ],
    productStrategy: [
      "产品目标:把非结构化输入转化为可治理的飞书业务数据,降低录入与协作成本。",
      "产品边界:当前只验证文本摄入链路与 dry-run 写入,真实飞书 API 写入与多模态适配保持受控边界。",
      "方案选择:采用 Collator + SOP + Portal 双入口治理架构,治理规则和合同校验真实执行,只有最终写入为 dry-run。",
      "暂不做:不接入真实 OCR/ASR/CLIP 引擎,不配置生产飞书凭据,不部署公开演示。",
    ],
    decisions: [
      "将平台分为智能录入层(Portal/Collator)、智能处理层(LLM+Candidate)、治理层(SOP+规则+人审)、数据层(飞书 Bitable)、执行层(自动化+通知+机器人+APP)五层,各层职责清晰。",
      "以飞书多维表作为权威业务数据底座,AI 只提供候选,不做最终写入决策(BR-05);类型缺失进入 NEEDS_REVIEW 而非猜测(BR-03)。",
      "采用 dry-run writer 验证全链路,保证治理规则和合同校验真实执行,但最终写入不接触生产飞书表,换取零风险演示。",
    ],
    outcomes: [
      "完成 Portal 上传、候选预览、证据查看、人工修正、确认写入和转复核 6 段可视化流程。",
      "集成 Gate 6/6 场景 PASS,包含 fail-closed(SOP BLOCKED → 无写入副作用)和幂等(重复 confirm 返回相同 completed_at)验证。",
      "Collator 504 单元测试 + typecheck 通过;SOP 91 单元测试通过;Portal build 成功。",
    ],
    architecture: [
      { label: "智能录入层", detail: "Portal(Next.js)+ Collator(Fastify :8787),7 个截图 API,MockOcrEngine" },
      { label: "智能处理层", detail: "LLM 提取 + Candidate V1 合同(Zod 校验),字段级原文证据" },
      { label: "治理层", detail: "SOP(:3001)+ BR-01~06 业务规则 + PRE_WRITE Handler + 人工复核" },
      { label: "数据层", detail: "飞书 Bitable 权威业务数据库 + dry-run writer(不接触生产表)" },
      { label: "执行层", detail: "自动化通知、机器人协议(设计阶段)、移动作业 APP" },
    ],
    keyWorkflow: [
      { label: "1. 截图上传", detail: "Portal 上传匿名截图 → Collator POST /v1/screenshots" },
      { label: "2. 候选生成", detail: "MockOcrEngine 提取文本块 → Candidate V1 结构化(保留字段级原文)" },
      { label: "3. 人工修正", detail: "Portal 展示 OCR 证据 → 用户修正 project_type → CONFIRMED" },
      { label: "4. 治理校验", detail: "SOP PRE_WRITE → BR-01~06 规则校验 → PASS / NEEDS_REVIEW / BLOCKED" },
      { label: "5. dry-run 写入", detail: "TransactionalBatchWriter(dry-run)→ 审计日志 + 事务快照" },
    ],
    tradeoffs: [
      "采用 dry-run writer 而非真实飞书写入,换取零风险演示和可重复验证;真实写入留给后续接入。",
      "MockOcrEngine 返回固定预设文本,不接入真实 OCR,换取可重复演示和零凭据风险。",
      "17 表与 12 自动化为旧版业务底座(历史基线),V2 链路以 dry-run 集成门禁为当前证据。",
    ],
    nextSteps: [
      "接入真实 OCR 引擎和飞书生产凭据,在受控环境验证 live write 路径。",
      "建立固定评测集,统计 OCR 字段准确率、治理拦截率和人工修改率。",
      "将 Portal 部署 Preview,形成可分享的演示链接。",
    ],
    verifiedCapabilities: [
      "17 张业务表模型(历史基线)",
      "Candidate V1 合同(Zod 校验)",
      "SOP BR-01~06 治理规则",
      "6/6 dry-run 集成门禁通过",
      "Portal 6 段可视化流程",
      "双层幂等(摄入级 + 业务级)",
      "文本摄入链路验证",
    ],
    inProgressCapabilities: [
      "受控 live-write 复验、凭据治理与上线开关",
      "Portal 公开部署(待 Preview)",
      "机器人真实部署(协议设计阶段)",
    ],
    plannedCapabilities: [
      "真实 OCR 引擎接入(Tesseract / 飞书 OCR)",
      "ASR / CLIP 多模态适配",
      "字段级数据质量看板",
    ],
    evidenceLinks: [
      { label: "集成 Gate 6/6 证据", type: "test", ref: "FEISHU-001" },
      { label: "Portal 浏览器证据", type: "screenshot", ref: "FEISHU-002" },
      { label: "Collator 504 单元测试", type: "test", ref: "FEISHU-003" },
      { label: "SOP 91 单元测试", type: "test", ref: "FEISHU-004" },
      { label: "Candidate V1 合同", type: "api", ref: "FEISHU-005" },
      { label: "五层架构图", type: "architecture", ref: "FEISHU-006" },
      { label: "dry-run 审计日志", type: "data", ref: "FEISHU-007" },
    ],
    myContribution: [
      { area: "用户与业务需求", detail: "定义 17 张业务表模型与 12 条自动化规则,识别 5 个业务域" },
      { area: "产品架构", detail: "设计五层平台架构与双入口治理(Collator + SOP)" },
      { area: "Agent / 数据流", detail: "Candidate V1 合同设计与 MockOcrEngine 适配器" },
      { area: "工程协作", detail: "3 人创业团队协作,本人负责数据模型、治理规则与 Portal MVP 开发;使用 Trae、Cursor 等 AI 编码工具加速原型实现,业务决策、治理规则设计与代码审查由本人完成" },
      { area: "测试与验收", detail: "6/6 集成门禁设计与验证,Collator 504 + SOP 91 单元测试" },
      { area: "迭代决策", detail: "dry-run 优先策略,Mock OCR 换取零风险演示" },
    ],
    lastVerifiedAt: "2026-07-22T17:33:41Z",
    relationships: [
      { slug: "service-agent", label: "Service Agent", detail: "知识与客户上下文由平台提供。" },
      { slug: "wechat-bot", label: "微信机器人", detail: "机器人负责通道接入,平台负责数据治理。" },
      { slug: "lumen-ink", label: "光砚", detail: "体验结果与咨询留资可进入客户流程。" },
    ],
    images: Array.from({ length: 10 }, (_, i) => `/projects/data-platform/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed",
    link: { label: "本地原型｜联系申请", href: "#contact", note: "Prototype 阶段,暂无公开演示链接" },
  },
  {
    slug: "service-agent",
    index: "02",
    category: "Agent / RAG",
    categoryLabel: "RAG · AGENT · AI SERVICE",
    title: "Studio Customer Service",
    subtitle: "影像工作室 AI 辅助客服 Agent",
    summary:
      "面向影像工作室咨询与运营场景的 Agentic Workflow,通过 LangGraph 8 节点 11 边工作流编排知识检索、意图/风险判断、答案生成、质量检查、人工接管与反馈飞轮,以 fail-closed 策略控制高风险承诺。",
    status: "作品集 Demo｜演示维护中",
    demoType: "unavailable",
    role: "产品定义 / Agent 架构 / 评估方案 / MVP 开发",
    team: "3 人创业团队",
    period: "2026.04 - 至今",
    featured: true,
    provisional: true,
    evidenceLabel:
      "公开演示域名 chat.jael.com 当前连接关闭,演示维护中。自动应答率与准确率为内部小样本估算,待固定评测集与线上数据验证。497 tests 为 2026-07-23 pytest 全量回归证据,非准确率指标。",
    metrics: [
      { value: "8 / 11", label: "LangGraph 节点 / 边" },
      { value: "497", label: "pytest 全量回归", note: "2026-07-23 证据" },
      { value: "R0–R3", label: "风险分级 fail-closed" },
      { value: "f98b1f5", label: "代码闭合 SHA" },
    ],
    tags: ["Agent", "LangGraph", "RAG", "Human-in-the-loop", "fail-closed"],
    stack: ["Python", "LangGraph", "Flask", "Next.js", "ChromaDB", "飞书知识库", "OpenAI-compatible LLM interface"],
    problem: [
      "客服培训成本高,话术一致性难保证;价格、档期与拍摄流程的敏感边界容错率低,纯大模型容易编造或作出高风险承诺。",
      "客服知识持续变化,若没有审核和回流机制,检索库会快速过期或被低质量对话污染。",
    ],
    productStrategy: [
      "产品目标:用受控 Agent 工作流编排检索、风险分流、生成、质量检查与人工接管,完成 Web/API 端到端 MVP。",
      "产品边界:当前为作品集 Demo,公开演示维护中,不主张生产 SLO,不声明生产上线或生产试点。",
      "方案选择:采用 LangGraph 确定性节点与 LLM 节点组合工作流,LLM 通过可配置的 OpenAI 兼容接口接入,未配置 Key 时回退本地模板匹配。",
      "暂不做:不追求无条件自动回复,不把内部小样本估算写成生产指标,不公开展示具体 LLM 型号。",
    ],
    decisions: [
      "定义 18 类咨询场景与 R0–R3 风险分级,先设计风险策略与 fail-closed 边界,再设计对话流程;高风险与低置信度路径直接转人工接管。",
      "采用查询改写、ChromaDB 向量召回与候选重排序链路,并通过三级置信度决定直接建议、人工复核或兜底转人工。",
      "知识与规则分离:飞书知识库作为权威主源,ChromaDB 仅承担语义检索,本地 JSON 镜像提供可解释副本,避免单一向量库成为不可解释的知识黑箱。",
      "LLM 生成与模板回退双路径:LLM 通过可配置的 OpenAI 兼容接口接入,未配置 LLM_API_KEY 时回退本地模板匹配,保证服务可用性。",
      "把人工确认作为知识更新的质量闸门,优质会话才进入飞书主源、检索库和 JSON 镜像,形成反馈飞轮。",
    ],
    outcomes: [
      "完成从需求定义、知识组织、LangGraph 8 节点 11 边编排到 PC 客服辅助界面的端到端 MVP。",
      "LangGraph 工作流、RAG 检索、风险分流、fail-closed 人工接管与反馈飞轮均有代码证据。",
      "497 tests 全量回归通过(2026-07-23 pytest 证据),0 failed;28 个测试文件、819 tracked 文件支持当前架构。",
      "三项生产写入安全门禁保持关闭:PRODUCTION_PILOT_ALLOWED=false、EXTERNAL_WRITE_ACTIONS_ALLOWED=false、STORE_MESSAGE_CONTENT=false;Demo 限流 30/min,多轮 history 边界 6 条。",
      "代码闭合 SHA f98b1f5,SCS-MANUAL-012 LLM 配置闭合(OCI revision 固定 + base image digest + 脚本清理)。",
    ],
    architecture: [
      { label: "场景路由", detail: "18 类意图、R0–R3 风险分级与人工接管条件" },
      { label: "查询理解", detail: "对话上下文、查询改写与关键词补全" },
      { label: "检索增强", detail: "ChromaDB 向量召回、候选重排序与引用上下文" },
      { label: "质量闸门", detail: "高分建议、中分复核、低分/高风险 fail-closed 转人工" },
      { label: "知识飞轮", detail: "归档、清洗、人工确认和多端同步" },
    ],
    keyWorkflow: [
      { label: "N1 意图与风险路由", detail: "用户咨询 → 18 类场景识别 → R0–R3 风险分级" },
      { label: "N2 查询改写", detail: "对话上下文 + 关键词补全 → 检索查询" },
      { label: "N3 知识检索", detail: "ChromaDB 向量召回 → 候选文档" },
      { label: "N4 候选重排序", detail: "重排序 + 引用上下文构建" },
      { label: "N5 答案生成", detail: "可配置 OpenAI 兼容 LLM 接口生成;未配置 Key 时回退模板匹配" },
      { label: "N6 质量闸门", detail: "三级置信度分流:高分直接建议 / 中分人工复核 / 低分或高风险 fail-closed" },
      { label: "N7 人工接管", detail: "fail-closed 兜底:低置信度、高风险承诺与敏感边界统一转人工" },
      { label: "N8 反馈飞轮", detail: "归档 → 清洗 → 人工确认 → 飞书主源 / ChromaDB / JSON 镜像同步" },
    ],
    tradeoffs: [
      "不追求无条件自动回复,牺牲部分自动化率以换取价格、档期与敏感场景的可靠性。",
      "保留飞书权威主源和本地 JSON 镜像,避免单一向量库成为不可解释的知识黑箱。",
      "LLM 生成与模板回退双路径,牺牲部分回答质量以换取服务可用性(未配置 Key 时仍可运行)。",
    ],
    nextSteps: [
      "恢复公开演示域名健康检查,或明确标注演示维护中。",
      "建立覆盖 18 场景的固定评测集,分开统计召回率、答案采纳率与转人工率。",
      "在真实流量中做分阶段灰度,校准置信度阈值并记录误答成本。",
    ],
    verifiedCapabilities: [
      "LangGraph 8 节点 11 边工作流编排",
      "RAG 知识检索(ChromaDB 向量召回 + 重排序)",
      "意图识别与 R0–R3 风险分级",
      "fail-closed 人工接管路径",
      "反馈飞轮闭环(归档→清洗→人工确认→知识同步)",
      "LLM 生成与模板回退双路径",
      "Web/API 端到端 MVP",
      "497 tests 全量回归通过(2026-07-23)",
      "三项生产写入安全门禁保持关闭",
    ],
    inProgressCapabilities: [
      "公开演示恢复(chat.jael.com 连接关闭)",
      "冻结评测集建立",
      "STATUS 文档同步至 SCS-MANUAL-012",
    ],
    plannedCapabilities: [
      "真实流量灰度上线",
      "指标评测(召回率/采纳率/转人工率)",
      "知识过期率监控",
    ],
    evidenceLinks: [
      { label: "LangGraph 工作流流程图", type: "architecture", ref: "SCS-001" },
      { label: "客服聊天页面", type: "screenshot", ref: "SCS-002" },
      { label: "人工接管案例", type: "screenshot", ref: "SCS-003" },
      { label: "知识检索 API 证据", type: "api", ref: "SCS-004" },
      { label: "28 个测试文件 / 497 tests", type: "test", ref: "SCS-005" },
      { label: "反馈飞轮闭环代码", type: "api", ref: "SCS-006" },
      { label: "Demo Disclosure(演示维护中)", type: "deploy", ref: "SCS-007" },
    ],
    myContribution: [
      { area: "用户与业务需求", detail: "影像工作室咨询与运营场景调研,定义 18 类咨询场景与 R0–R3 风险分级" },
      { area: "产品架构", detail: "LangGraph 8 节点 11 边工作流编排、风险路由与 fail-closed 策略设计" },
      { area: "Agent / 数据流", detail: "RAG 检索链路、三级置信度分流、反馈飞轮与知识更新闸门" },
      { area: "工程协作", detail: "3 人团队协作,Flask API + Next Web + ChromaDB + 飞书知识库,负责 Agent 架构与评估方案" },
      { area: "测试与验收", detail: "497 tests 全量回归、SCS-MANUAL-012 LLM 配置闭合、三项生产写入安全门禁验证" },
      { area: "迭代决策", detail: "公网 Demo 与生产写动作分离(fail-closed + 安全开关始终 false)" },
    ],
    lastVerifiedAt: "2026-07-23T00:00:00Z",
    relationships: [
      { slug: "wechat-bot", label: "微信公众号机器人", detail: "机器人负责通道接入和会话归档,Agent 负责知识与质量。" },
      { slug: "lora-finetuning", label: "LoRA 微调", detail: "微调模型作为本地推理与云端 API 的备选后端。" },
      { slug: "feishu-platform", label: "飞书平台", detail: "客户上下文和业务知识由统一数据底座支撑。" },
    ],
    images: Array.from({ length: 7 }, (_, i) => `/projects/service-agent/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
    link: { label: "查看案例｜演示维护中", href: "#contact", note: "chat.jael.com 当前连接关闭,演示维护中" },
  },
  {
    slug: "lumen-ink",
    index: "03",
    category: "Multimodal",
    categoryLabel: "AI IMAGE · MULTI-MODEL",
    title: "光砚 AI 图像编辑工作台",
    subtitle: "把修图专家经验抽象为可操作的参数、流程与模型能力",
    summary:
      "统一接入多类图像模型,将专业人像修图中的特征保留、光影、镜头与风格要求产品化,降低客户体验和团队复用门槛。",
    status: "Controlled Demo｜受控演示,申请体验",
    demoType: "controlled",
    role: "产品负责人 / 交互设计 / 全栈 MVP",
    team: "个人主导,团队业务验证",
    period: "2026.05 - 至今",
    featured: true,
    provisional: true,
    evidenceLabel:
      "现有受控演示:lumen-ink.vercel.app 密码保护,申请体验。NoSQL 升级状态:CloudBase 持久化处于最终验收(FIX-R9),readyForPreview=false,未达到公开访问标准。",
    metrics: [
      { value: "4", label: "类模型 Provider" },
      { value: "6", label: "类专业工具" },
      { value: "46", label: "个测试文件" },
      { value: "1 套", label: "统一模型抽象" },
    ],
    tags: ["多模态", "AI 创作", "模型抽象", "受控演示"],
    stack: ["React", "TypeScript", "Vite", "Express", "GPT Image", "GLM", "Gemini", "Seedream", "CloudBase NoSQL"],
    problem: [
      "专业修图需求难以用一句提示词准确表达,客户也无法理解模型差异和结果边界。",
      "不同模型的接口、参数和失败模式不一致,直接接入会把复杂性暴露给用户和业务团队。",
    ],
    productStrategy: [
      "产品目标:统一生成、编辑、参考图、任务状态、资产管理和失败恢复到一套可持续迭代的产品体验。",
      "产品边界:当前提供受控演示,CloudBase 持久化处于最终验收,不主张开放公开访问。",
      "方案选择:Provider 工厂与适配器统一模型调用,采用 NoSQL 持久化与高风险审计。",
      "暂不做:不公开密码,不展示直接体验入口,不主张已证明所有真实 CloudBase 并发语义。",
    ],
    decisions: [
      "以 Provider 工厂与适配器统一模型调用、错误处理和故障转移,避免界面与某一供应商耦合。",
      "把专家经验拆成身份锚定、特征保留、修改指令、光影镜头、风格调性与负面约束六段结构。",
      "采用 NoSQL 持久化与高风险审计,覆盖幂等、事务、删除协调与 Storage 生命周期。",
    ],
    outcomes: [
      "完成 GPT Image、GLM、Gemini、Seedream 等模型的统一接入和热切换验证。",
      "修脸、调色、液化、修复、消除、导出六类工具覆盖主要人像后期流程。",
      "46 个测试文件、162 个文档支持当前架构,持久化、幂等、事务、删除协调有高风险审计证据。",
    ],
    architecture: [
      { label: "需求结构化", detail: "六段式提示词与专业参数预设" },
      { label: "Provider 层", detail: "统一模型接口、鉴权、限流与错误映射" },
      { label: "任务调度", detail: "模型选择、热切换、失败重试与降级" },
      { label: "持久化层", detail: "CloudBase NoSQL、幂等、事务与删除协调" },
      { label: "编辑工作台", detail: "画布、工具栏、参数面板与历史记录" },
    ],
    keyWorkflow: [
      { label: "1. 需求输入", detail: "六段式提示词(身份锚定/特征保留/修改指令/光影/风格/负面约束)" },
      { label: "2. 模型选择", detail: "Provider 工厂 → 选择模型 → 参数适配" },
      { label: "3. 异步任务", detail: "提交生成/编辑任务 → 任务状态轮询 → 历史记录" },
      { label: "4. 结果处理", detail: "图片预览 → 编辑工具链 → JPEG/PNG/WebP 导出" },
      { label: "5. 持久化", detail: "NoSQL 存储 → 幂等校验 → 删除协调 → Storage 生命周期" },
    ],
    tradeoffs: [
      "采用受控访问方式(密码保护),降低公开演示的模型调用成本和密钥风险。",
      "高风险持久化审计优先,不追求完全抹平不同模型的专有参数,保留高级入口。",
    ],
    nextSteps: [
      "完成 CloudBase NoSQL 持久化最终验收(FIX-R9)。",
      "建立同一任务跨 Provider 的质量、时延与成本评测面板。",
      "增加可复用风格包与人工审核标注,形成图像结果的业务评测集。",
    ],
    verifiedCapabilities: [
      "多模型 Provider 抽象(OpenAI/GLM/Seedream/Gemini)",
      "图片生成与编辑流程",
      "异步任务状态与历史任务",
      "6 类编辑工具(修脸/调色/液化/修复/消除/导出)",
      "JPEG/PNG/WebP 多格式导出",
      "幂等与事务机制",
    ],
    inProgressCapabilities: [
      "CloudBase NoSQL 持久化最终验收(FIX-R9)",
      "删除协调与 Storage 生命周期",
      "Preview / Production 分级",
    ],
    plannedCapabilities: [
      "跨 Provider 评测面板",
      "可复用风格包与审核标注",
      "定时清理与并发优化",
    ],
    evidenceLinks: [
      { label: "工作台首页", type: "screenshot", ref: "LUMEN-001" },
      { label: "生成编辑流程", type: "screenshot", ref: "LUMEN-002" },
      { label: "任务历史与状态", type: "screenshot", ref: "LUMEN-003" },
      { label: "Provider 抽象图", type: "architecture", ref: "LUMEN-004" },
      { label: "NoSQL 持久化状态", type: "architecture", ref: "LUMEN-005" },
      { label: "失败恢复流程", type: "api", ref: "LUMEN-006" },
      { label: "46 个测试文件", type: "test", ref: "LUMEN-007" },
      { label: "受控演示说明", type: "deploy", ref: "LUMEN-008" },
    ],
    myContribution: [
      { area: "用户与业务需求", detail: "高端摄影修图体验与内部标准化工具需求" },
      { area: "产品架构", detail: "Provider 工厂与适配器设计,六段式提示词结构" },
      { area: "Agent / 数据流", detail: "任务调度、异步状态与持久化链路" },
      { area: "工程协作", detail: "个人主导产品与架构,团队提供业务验证;使用 Trae、Cursor 等 AI 编码工具实现 MVP,模型选型、Provider 抽象与持久化审计由本人设计" },
      { area: "测试与验收", detail: "46 个测试文件与高风险持久化审计" },
      { area: "迭代决策", detail: "受控演示策略,NoSQL 持久化分级验收" },
    ],
    lastVerifiedAt: "2026-07-23T00:00:00Z",
    relationships: [
      { slug: "feishu-platform", label: "飞书平台", detail: "体验结果与咨询留资可进入客户流程。" },
      { slug: "mini-program", label: "微信小程序", detail: "作为用户端 AI 体验入口。" },
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/lumen-ink/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
    link: { label: "受控演示｜申请体验", href: "https://lumen-ink.vercel.app/", note: "演示会产生模型调用成本,当前采用受控访问方式" },
  },
  {
    slug: "wechat-bot",
    index: "04",
    category: "Agent / RAG",
    categoryLabel: "WECHAT · AI CUSTOMER SERVICE",
    title: "微信公众号 AI 客服机器人",
    subtitle: "通道接入、基础应答与人工接管的第一线",
    summary:
      "将 Agent 能力接入微信公众号及其他消息通道,负责消息归一化、关键词知识检索、会话归档、人工接管与数据回流。",
    status: "Portfolio Demo",
    demoType: "local-only",
    role: "产品定义 / 通道架构 / MVP 开发",
    team: "3 人创业团队",
    period: "2026.04 - 至今",
    evidenceLabel: "自动应答率为业务运营观察,尚未形成大样本统计。",
    metrics: [
      { value: "4", label: "类消息通道" },
      { value: "7 步", label: "消息处理管线" },
      { value: "JSON", label: "关键词检索" },
      { value: "50%+", label: "基础咨询自动应答", note: "内部估算" },
    ],
    tags: ["WeChat", "客服 Agent", "通道适配"],
    stack: ["Python", "微信公众号 API", "GLM-4-Flash", "JSON 关键词检索", "jieba", "字符 bigram", "COS"],
    problem: [
      "公众号非工作时段响应慢,重复问题占用有限人力;不同通道的消息格式、群聊规则和客服会话状态不一致。",
      "向量数据库在轻量部署与可维护性上成本偏高,需要更透明、可本地维护的检索方案。",
    ],
    decisions: [
      "以 BotManager 七步管线依次处理插件、群聊、客服会话、过滤、图片、AI 与后处理,保持通道和业务逻辑解耦。",
      "知识检索从 ChromaDB 迁移到 JSON 关键词检索,使用 jieba 分词并以字符 bigram 兜底,提高透明度和部署稳定性。",
      "明确 AI 为一线基础应答层,复杂、敏感和低置信度问题必须转人工。",
    ],
    outcomes: [
      "支持公众号、iLink、Gewechat 与 itchat 等通道适配,统一进入同一消息处理管线。",
      "会话本地归档并同步至 COS,供 Service Agent 拉取、清洗和人工确认。",
      "内部运营观察显示基础重复咨询自动应答约 50%+,但仍按估算口径展示。",
    ],
    architecture: [
      { label: "消息通道", detail: "公众号 / iLink / Gewechat / itchat" },
      { label: "业务调度", detail: "七步消息管线与客服会话状态" },
      { label: "知识检索", detail: "JSON 关键词、jieba 与字符 bigram 兜底" },
      { label: "模型桥接", detail: "GLM / OpenAI 协议 / 本地模型备选" },
      { label: "归档回流", detail: "本地记录、COS 同步与人工确认" },
    ],
    tradeoffs: [
      "关键词检索牺牲部分语义召回,换取更轻量、透明和稳定的部署;复杂检索由 Service Agent 承担。",
      "通道层只做基础路由与归档,避免在机器人内堆叠全部业务逻辑。",
    ],
    nextSteps: [
      "按场景统计转人工原因、命中词和误答样本,完善关键词和同义词治理。",
      "增加通道级健康检查和本地模型降级,降低云端 API 不可用影响。",
    ],
    verifiedCapabilities: [
      "4 通道适配(公众号/iLink/Gewechat/itchat)",
      "BotManager 七步管线",
      "JSON 关键词检索 + jieba + bigram",
      "会话归档与 COS 同步",
    ],
    inProgressCapabilities: [
      "通道级健康检查",
      "转人工原因统计",
    ],
    plannedCapabilities: [
      "关键词与同义词治理",
      "本地模型降级",
    ],
    relationships: [
      { slug: "service-agent", label: "Service Agent", detail: "共享知识飞轮,Agent 提供复杂检索与审核。" },
      { slug: "lora-finetuning", label: "LoRA 微调", detail: "可作为云端模型不可用时的本地备选推理后端。" },
    ],
    images: Array.from({ length: 3 }, (_, i) => `/projects/wechat-bot/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed",
  },
  {
    slug: "content-research",
    index: "05",
    category: "Growth",
    categoryLabel: "AUTOMATION · CONTENT RESEARCH",
    title: "多平台爆款内容调研工具",
    subtitle: "把一次性竞品搜索变成可复用的增长基础设施",
    summary:
      "统一采集小红书、抖音、B 站、微博与知乎内容,通过平台适配器、搜索策略、相关性评分和飞书入库支持选题与竞品分析。",
    status: "Experiment",
    demoType: "local-only",
    role: "产品定义 / 数据模型 / 自动化开发",
    team: "个人主导",
    period: "2026.05 - 2026.06",
    evidenceLabel: "效率提升约 5 倍为业务时间观察,未进行严格实验。",
    metrics: [
      { value: "5", label: "大内容平台" },
      { value: "3", label: "种调研模式" },
      { value: "≈5×", label: "单次调研效率", note: "业务估算" },
      { value: "1 套", label: "统一数据模型" },
    ],
    tags: ["增长产品", "平台适配", "自动化"],
    stack: ["Python", "Playwright", "Exa", "Jina Reader", "飞书 API", "异步 IO"],
    problem: [
      "运营需要在多个平台重复搜索、截图、去重和整理,结果格式不一致,难以复用。",
      "平台反爬和页面结构频繁变化,单一抓取方式稳定性差。",
    ],
    decisions: [
      "定义统一内容数据模型,平台差异封装在抽象基类和适配器中,新平台只实现必要接口。",
      "根据平台限制组合 Playwright、Exa 与 Jina Reader,并设计重试、节奏控制和降级路径。",
      "热门关键词、竞品账号、智能多轮三种模式分别服务不同调研任务。",
    ],
    outcomes: [
      "覆盖 5 个主流内容平台,结果自动去重、评分并写入飞书调研库。",
      "业务观察显示单次内容调研和素材搜寻效率提升约 5 倍,已明确标注为估算。",
      "统一来源链接、截图和标签,为小程序与官网内容运营提供结构化输入。",
    ],
    architecture: [
      { label: "任务定义", detail: "热门关键词 / 竞品账号 / 智能多轮" },
      { label: "平台适配", detail: "五个平台与多种抓取策略" },
      { label: "质量处理", detail: "去重、重试、相关性评分与异常记录" },
      { label: "结果入库", detail: "来源、截图、标签和分析结论同步飞书" },
      { label: "内容反哺", detail: "进入官网、小程序和运营选题" },
    ],
    tradeoffs: [
      "不追求绕过所有平台限制,优先使用合法公开页面和可替换数据源,保留人工补充。",
      "适配器统一核心字段,但允许平台特有指标保留扩展字段。",
    ],
    nextSteps: [
      "建立调研任务的命中率、有效素材率和人工筛选时间指标。",
      "增加平台变化监控和适配器测试,降低页面改版导致的中断。",
    ],
    verifiedCapabilities: [
      "5 平台适配(小红书/抖音/B站/微博/知乎)",
      "3 种调研模式",
      "统一内容数据模型",
      "飞书入库与去重",
    ],
    inProgressCapabilities: [
      "平台变化监控",
    ],
    plannedCapabilities: [
      "命中率与有效素材率指标",
      "适配器测试",
    ],
    relationships: [
      { slug: "feishu-platform", label: "飞书平台", detail: "调研结果写入飞书内容库。" },
      { slug: "brand-website", label: "品牌官网", detail: "竞品洞察用于更新品牌内容与 SEO。" },
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/content-research/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed",
  },
  {
    slug: "brand-website",
    index: "06",
    category: "User Product",
    categoryLabel: "BRAND SITE · WEB EXPERIENCE",
    title: "泽怀影像品牌官网",
    subtitle: "在两周内完成品牌叙事、作品展示与预约入口",
    summary:
      "通过组件化开发、CDN 资源策略与 SEO,搭建高端影像业务的品牌主阵地,并与小程序和数据中台形成统一转化入口。",
    status: "Final Validation",
    demoType: "public",
    role: "产品规划 / 内容架构 / 前端交付",
    team: "3 人创业团队",
    period: "2026.03 - 2026.04",
    metrics: [
      { value: "2 周", label: "设计到上线" },
      { value: "15", label: "个可复用组件" },
      { value: "10", label: "个核心区块" },
      { value: "<2s", label: "目标首屏加载" },
    ],
    tags: ["品牌产品", "Web", "SEO"],
    stack: ["React", "TypeScript", "Vite", "Tailwind", "CloudBase", "CDN"],
    problem: [
      "新业务缺少统一品牌入口,作品、服务流程和咨询方式分散,无法形成可信的高端服务叙事。",
      "时间和团队资源有限,需要在两周内优先完成可上线、可维护和移动端可用的版本。",
    ],
    decisions: [
      "将品牌故事、作品、服务流程、信任信息与预约操作组织为一条连续转化路径。",
      "静态托管与云存储分工,图片走 CDN,并通过懒加载、响应式尺寸与语义元信息控制性能和 SEO。",
      "以 15 个可复用组件支撑快速调整,避免为一次上线写大量不可维护页面代码。",
    ],
    outcomes: [
      "两周内完成 10 个核心区块和 15 个组件的设计、开发和上线。",
      "建立官网、小程序和公众号之间的统一品牌入口与咨询路径。",
      "完成站点地图、页面描述、语义结构和资源加载优化。",
    ],
    architecture: [
      { label: "品牌叙事", detail: "Hero、品牌故事、审美主张与信任信息" },
      { label: "作品浏览", detail: "案例分类、响应式图片与懒加载" },
      { label: "服务理解", detail: "流程、套餐边界与常见问题" },
      { label: "预约入口", detail: "表单状态、CloudBase 和反馈" },
      { label: "分发优化", detail: "CDN、SEO、站点地图与社交分享" },
    ],
    tradeoffs: [
      "首版采用单页叙事和静态内容,优先上线速度;复杂 CMS 需求留到业务验证后。",
      "大图保证品牌质感,同时使用响应式资源和懒加载控制移动端成本。",
    ],
    nextSteps: [
      "接入真实转化漏斗和 Web Vitals,验证内容区块对咨询的贡献。",
      "增加案例独立路由和结构化数据,提升长尾搜索收录。",
    ],
    verifiedCapabilities: [
      "15 个可复用组件",
      "10 个核心区块",
      "CDN 与 SEO 优化",
      "CloudBase 预约提交",
    ],
    inProgressCapabilities: [
      "转化漏斗与 Web Vitals",
    ],
    plannedCapabilities: [
      "案例独立路由",
      "结构化数据",
    ],
    relationships: [
      { slug: "feishu-platform", label: "飞书平台", detail: "咨询表单和客户信息进入统一流程。" },
      { slug: "content-research", label: "内容调研", detail: "竞品与选题分析反哺品牌内容。" },
    ],
    images: Array.from({ length: 4 }, (_, i) => `/projects/brand-website/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
    link: { label: "访问品牌官网", href: "https://zehuai-image.vercel.app/" },
  },
  {
    slug: "lora-finetuning",
    index: "07",
    category: "Model Training",
    categoryLabel: "MODEL FINE-TUNING · LOCAL INFERENCE",
    title: "LoRA 客服 Agent 微调",
    subtitle: "从业务语料、QLoRA 训练到 OpenAI 兼容本地推理",
    summary:
      "将业务文档清洗为单轮与多轮 SFT 数据,在 16GB 单卡上完成 Qwen 1.5B / 7B 双基座 QLoRA,并封装本地 RAG 与推理服务。",
    status: "Experiment",
    demoType: "local-only",
    role: "产品验证 / 数据准备 / 训练与推理工程",
    team: "个人主导",
    period: "2026.06 - 2026.07",
    evidenceLabel: "训练 loss 只能证明优化过程收敛,不等于业务回答质量。35 题评测准确率 51.43%,明确改进方向。",
    metrics: [
      { value: "2", label: "个微调基座" },
      { value: "4bit", label: "QLoRA 量化" },
      { value: "2.377→1.369", label: "1.5B 训练 loss" },
      { value: "51.43%", label: "35 题评测准确率" },
    ],
    tags: ["模型微调", "本地推理", "QLoRA"],
    stack: ["Python", "PyTorch", "LLaMA-Factory", "PEFT", "bitsandbytes", "FastAPI", "bge-small-zh-v1.5"],
    problem: [
      "通用模型不了解业务术语、服务流程和客服语气,RAG 检索失败时仍可能给出通用或编造回答。",
      "云端 API 受成本、延迟与数据边界约束,需要验证本地模型能否作为可替换后端。",
    ],
    decisions: [
      "将业务文档清洗为 Alpaca 单轮与 ShareGPT 多轮数据,分离知识表达与对话风格学习。",
      "选择 QLoRA 4bit、LoRA rank 16 与双基座策略,在 16GB 单卡约束下平衡训练可行性、时延和质量。",
      "推理层遵循 OpenAI 兼容协议,提供流式 SSE、会话管理、本地 RAG 和输出护栏,便于接入现有 Agent。",
    ],
    outcomes: [
      "Qwen2-1.5B loss 从 2.377 收敛至 1.369;Qwen2.5-7B 从 2.732 收敛至 1.524。",
      "完成数据准备、训练、Adapter 导出、模型合并、本地检索和 FastAPI 服务的端到端链路。",
      "35 题评测准确率 51.43%,本地模型可作为备选后端,但业务效果仍需独立评测集验证。",
    ],
    architecture: [
      { label: "数据准备", detail: "飞书提取、去重、分块和格式转换" },
      { label: "双基座训练", detail: "Qwen 1.5B / 7B、QLoRA 4bit、LoRA rank 16" },
      { label: "模型导出", detail: "Adapter 检查点、基座合并和版本管理" },
      { label: "本地 RAG", detail: "向量检索、上下文注入与输出护栏" },
      { label: "兼容服务", detail: "FastAPI、SSE、会话和 OpenAI 协议" },
    ],
    tradeoffs: [
      "训练 loss 只能证明优化过程收敛,不等于业务回答质量;网站明确区分训练证据与产品效果。",
      "小模型时延更低、部署更轻,7B 质量潜力更高;通过统一 API 保持可替换性。",
    ],
    nextSteps: [
      "构建涵盖事实准确、拒答、语气、流程与敏感边界的独立测试集,对比基座、LoRA、RAG 和 LoRA+RAG。",
      "统计首字时延、吞吐、显存和单次推理成本,建立双基座路由策略。",
    ],
    verifiedCapabilities: [
      "Qwen 1.5B / 7B 双基座 QLoRA 训练",
      "35 题评测基准(51.43%)",
      "OpenAI 兼容推理服务",
      "本地 RAG 与输出护栏",
    ],
    inProgressCapabilities: [
      "独立测试集构建",
    ],
    plannedCapabilities: [
      "双基座路由策略",
      "首字时延与成本统计",
    ],
    relationships: [
      { slug: "service-agent", label: "Service Agent", detail: "优质知识与会话可进入训练集,本地模型可作为推理后端。" },
      { slug: "wechat-bot", label: "微信公众号机器人", detail: "OpenAI 兼容接口便于在云端 API 失效时降级。" },
    ],
    images: [
      "/projects/lora-finetuning/01.png",
      "/projects/lora-finetuning/02.png",
      "/projects/lora-finetuning/03.png",
      "/projects/lora-finetuning/04.png",
    ],
    imageMode: "desktop",
  },
  {
    slug: "mini-program",
    index: "08",
    category: "User Product",
    categoryLabel: "MINI PROGRAM · CONVERSION",
    title: "泽怀影像微信小程序",
    subtitle: "从浏览种草、审美诊断到咨询留资的移动端路径",
    summary:
      "围绕高端影像服务设计作品浏览、美学问卷、AI 体验和预约咨询,将 AI 能力转化为用户可理解的销售触点。",
    status: "Experiment",
    demoType: "local-only",
    archived: true,
    role: "产品规划 / 信息架构 / 交互验收",
    team: "3 人创业团队",
    period: "2026.05 - 2026.06",
    metrics: [
      { value: "11", label: "个页面" },
      { value: "9", label: "个业务组件" },
      { value: "10", label: "题美学问卷" },
      { value: "<200KB", label: "核心包体积" },
    ],
    tags: ["微信产品", "转化路径", "AI 体验"],
    stack: ["微信原生小程序", "CloudBase", "自定义 TabBar", "Canvas", "远程 JSON", "本地 Mock"],
    problem: [
      "高客单价摄影服务在首次咨询前缺少可体验、可自我表达的触点,客户只能浏览作品后直接问价。",
      "小程序需要在包体、弱网和品牌视觉之间平衡,同时保持预约与数据回写稳定。",
    ],
    decisions: [
      "设计作品浏览 - 美学问卷 - AI 体验 - 咨询留资路径,逐步建立审美认同和服务理解。",
      "采用远程 JSON + 本地 Mock 双源降级,核心内容在弱网或接口异常时仍可用。",
      "问卷输出风格诊断和可分享海报,避免仅作为一次性表单。",
    ],
    outcomes: [
      "完成 5 个 Tab 页面、6 个子页面和 9 个业务组件,覆盖浏览、诊断、体验和预约。",
      "核心包控制在 200KB 以内,并通过 CloudBase 云函数处理凭据与咨询提交。",
      "与光砚和数据中台打通产品叙事:AI 体验建立信任,留资进入后续咨询与交付。",
    ],
    architecture: [
      { label: "内容入口", detail: "作品、品牌故事和服务流程" },
      { label: "审美诊断", detail: "10 题问卷、结果解释与分享海报" },
      { label: "AI 体验", detail: "光砚能力的用户端入口" },
      { label: "咨询预约", detail: "表单校验、云函数提交与状态反馈" },
      { label: "数据降级", detail: "远程 JSON、本地 Mock 和弱网兜底" },
    ],
    tradeoffs: [
      "优先原生小程序和轻量资源,牺牲部分复杂动画以保证首开和包体。",
      "AI 体验以可控预设为主,避免在用户端暴露复杂模型配置。",
    ],
    nextSteps: [
      "定义从作品浏览到咨询提交的分步漏斗指标,验证问卷与 AI 体验的实际贡献。",
      "增加内容管理与实验配置,支持不同主题和入口的 A/B 测试。",
    ],
    verifiedCapabilities: [
      "11 个页面与 9 个业务组件",
      "10 题美学问卷",
      "远程 JSON + 本地 Mock 降级",
      "CloudBase 云函数提交",
    ],
    inProgressCapabilities: [
      "工作区整理(当前极脏)",
    ],
    plannedCapabilities: [
      "分步漏斗指标",
      "A/B 测试配置",
    ],
    relationships: [
      { slug: "lumen-ink", label: "光砚", detail: "提供可理解的 AI 图像体验。" },
      { slug: "feishu-platform", label: "飞书平台", detail: "预约和咨询留资进入客户流程。" },
    ],
    images: Array.from({ length: 6 }, (_, i) => `/projects/mini-program/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mobile",
    link: { label: "微信搜索体验", href: "#contact", note: "小程序:泽怀影像" },
  },
];

export const categories: (ProjectCategory | "全部")[] = [
  "全部",
  "Agent / RAG",
  "Data / Automation",
  "Multimodal",
  "User Product",
  "Growth",
  "Model Training",
];

export const featuredProjects = projects.filter(
  (project): project is Project => Boolean(project.featured),
);

export const experimentProjects = projects.filter(
  (project): project is Project => !project.featured && !project.archived,
);

export const archivedProjects = projects.filter(
  (project): project is Project => Boolean(project.archived),
);

export const capabilities = [
  {
    title: "业务建模",
    body: "从业务链路、异常路径和成本约束出发定义 AI 场景,把销售、项目、交付、内容运营映射成数据模型。",
    evidence: "17 张业务表(历史基线) · 18 类咨询场景 · 5 层平台架构",
  },
  {
    title: "Agent 编排",
    body: "覆盖 Agent、RAG、模型路由、知识治理、人工质量闸门与本地微调。",
    evidence: "LangGraph 工作流 · 三级置信度 · QLoRA 双基座 · OpenAI 兼容服务",
  },
  {
    title: "数据治理",
    body: "把非结构化输入转化为可治理的业务数据,通过规则校验、人工复核和确定性写入控制风险。",
    evidence: "Candidate V1 合同 · BR-01~06 规则 · dry-run 集成门禁 · 双层幂等",
  },
  {
    title: "人工复核",
    body: "把低置信度和高风险动作交给人,AI 只提供候选,不做最终决策。",
    evidence: "NEEDS_REVIEW 流程 · 质量闸门 · 反馈飞轮 · 人工确认",
  },
  {
    title: "多端产品",
    body: "Web、移动、IM 多入口产品化,覆盖品牌官网、小程序、微信公众号与 Portal。",
    evidence: "Next.js 16 · React Native · 微信原生 · 4 通道适配",
  },
  {
    title: "云端交付",
    body: "从需求、原型、开发验证到上线协同、评估设计与数据回流。",
    evidence: "CloudBase · Vercel · CDN · Vitest · 集成门禁",
  },
];

export const capabilityChain = [
  "业务问题识别",
  "非结构化数据摄入",
  "AI 提取与 Agent 编排",
  "确定性治理",
  "人工复核",
  "业务系统写入",
  "自动化执行",
  "测试、监控与迭代",
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
