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

export type Project = {
  slug: string;
  index: string;
  category: ProjectCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  summary: string;
  status: string;
  role: string;
  team: string;
  period: string;
  featured?: boolean;
  evidenceLabel?: string;
  metrics: ProjectMetric[];
  tags: string[];
  stack: string[];
  problem: string[];
  decisions: string[];
  outcomes: string[];
  architecture: ArchitectureStep[];
  tradeoffs: string[];
  nextSteps: string[];
  relationships: { slug: string; label: string; detail: string }[];
  images: string[];
  imageMode?: "desktop" | "mobile" | "mixed";
  link?: { label: string; href: string; note?: string };
};

export const projects: Project[] = [
  {
    slug: "data-platform",
    index: "01",
    category: "Data / Automation",
    categoryLabel: "DATA PLATFORM · MOBILE OPS",
    title: "数据中台底座 + 移动作业 APP",
    subtitle: "把非标摄影交付拆成可追踪、可协作的标准流程",
    summary:
      "围绕获客、咨询、拍摄、后期、交付与复盘，建立统一业务数据模型、自动化规则与移动作业入口，作为 9 个项目的运营底座。",
    status: "已投入业务使用",
    role: "产品负责人 / 数据模型设计 / MVP 开发",
    team: "3 人创业团队",
    period: "2026.02 - 至今",
    featured: true,
    metrics: [
      { value: "17", label: "张核心数据表" },
      { value: "12", label: "条自动化规则" },
      { value: "2-3周 → 3-5天", label: "新人上手周期" },
      { value: "111 / 0", label: "历史迁移条目 / 失败" },
    ],
    tags: ["数据产品", "流程自动化", "移动作业"],
    stack: ["飞书多维表", "Node.js", "React Native", "Expo", "CloudBase", "OCR", "ASR", "CLIP"],
    problem: [
      "客户、项目、素材、供应商、话术与内容数据分散在聊天、表格和个人经验中，项目推进依赖口头同步。",
      "摄影业务存在大量异常路径与现场作业场景，单纯增加表单无法解决弱网、权限和执行一致性问题。",
    ],
    decisions: [
      "先拆解 12 个关键流转节点，再定义客户、项目、素材、内容与知识 5 个业务域，避免直接从表结构反推业务。",
      "以飞书多维表作为低成本数据底座，通过触发保护、状态机与角色权限控制批量误操作。",
      "移动端优先覆盖现场高频动作，加入离线缓存和待同步队列，而非复刻完整后台。",
    ],
    outcomes: [
      "17 张表与 12 条自动化覆盖客户全生命周期和拍摄全流程，上线以来未出现流程性漏单。",
      "完成 111 条历史数据迁移，迁移失败为 0；新人上手周期由 2-3 周缩短至 3-5 天。",
      "为 Service Agent、Collator、内容调研、小程序与官网提供统一数据接口和流程触发点。",
    ],
    architecture: [
      { label: "业务建模", detail: "12 个关键节点、5 个业务域与角色权限" },
      { label: "数据底座", detail: "17 张多维表、状态机、枚举与唯一标识" },
      { label: "自动化", detail: "12 条规则、触发保护与异常升级" },
      { label: "移动作业", detail: "角色化看板、离线缓存、待同步队列" },
      { label: "数据回流", detail: "交付结果、客户反馈与知识更新进入复盘" },
    ],
    tradeoffs: [
      "采用飞书低代码而非自建数据库，换取更快上线与业务可维护性；对复杂权限和批处理使用云函数补足。",
      "移动端只覆盖现场核心动作，牺牲少量后台配置能力，降低团队维护成本。",
    ],
    nextSteps: [
      "建立字段级数据质量看板，持续监测缺失率、异常状态与自动化失败率。",
      "将关键业务事件抽象为统一事件流，为后续 Agent 调用与分析提供稳定接口。",
    ],
    relationships: [
      { slug: "collator", label: "Collator", detail: "非结构化资料经清洗校验后写入数据中台。" },
      { slug: "service-agent", label: "Service Agent", detail: "知识与客户上下文由中台提供。" },
      { slug: "mini-program", label: "微信小程序", detail: "咨询和预约留资回写中台。" },
    ],
    images: Array.from({ length: 10 }, (_, i) => `/projects/data-platform/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed",
  },
  {
    slug: "service-agent",
    index: "02",
    category: "Agent / RAG",
    categoryLabel: "RAG · AGENT · AI SERVICE",
    title: "Service Agent",
    subtitle: "AI 优先应答，低置信度问题进入人工质量闸门",
    summary:
      "面向高端摄影咨询，设计查询改写、检索、重排序、置信度分流、人工复核与知识回流，重点解决准确性、边界控制和持续更新。",
    status: "业务验证中",
    role: "产品定义 / Agent 架构 / 评估方案 / MVP 开发",
    team: "3 人创业团队",
    period: "2026.04 - 至今",
    featured: true,
    evidenceLabel: "以下准确率与自动应答率为内部小样本估算，待固定评测集与线上数据验证。",
    metrics: [
      { value: "18", label: "类咨询场景" },
      { value: "3 级", label: "置信度分流" },
      { value: "90%+", label: "检索准确率", note: "内部估算" },
      { value: "50%+", label: "基础咨询自动应答", note: "内部估算" },
    ],
    tags: ["Agent", "RAG", "Human-in-the-loop"],
    stack: ["Python", "LangGraph", "Dify", "LangSmith", "SentenceTransformer", "CloudBase", "COS", "GLM"],
    problem: [
      "价格、档期、拍摄流程与敏感边界容错率低，纯大模型容易编造；静态 FAQ 又无法覆盖自然语言表达。",
      "客服知识持续变化，若没有审核和回流机制，检索库会快速过期或被低质量对话污染。",
    ],
    decisions: [
      "定义 18 类咨询场景与明确的可答、需确认、必须转人工边界，先设计风险策略再设计对话。",
      "采用查询改写、候选检索与重排序链路，并通过三级置信度决定直接建议、人工复核或兜底转人工。",
      "把人工确认作为知识更新的质量闸门，优质会话才进入飞书主源、检索库和 JSON 镜像。",
    ],
    outcomes: [
      "完成从需求定义、知识组织、Agent 编排到 PC 客服辅助界面的端到端验证。",
      "内部小样本估算检索准确率 90%+，基础重复咨询自动应答 50%+；指标已明确标注为估算。",
      "形成“对话使用 - 归档清洗 - 人工确认 - 知识同步 - 检索增强”的可持续闭环。",
    ],
    architecture: [
      { label: "场景路由", detail: "18 类意图、敏感边界与人工接管条件" },
      { label: "查询理解", detail: "对话上下文、查询改写与关键词补全" },
      { label: "检索增强", detail: "向量召回、候选重排序与引用上下文" },
      { label: "质量闸门", detail: "高分建议、中分复核、低分转人工" },
      { label: "知识飞轮", detail: "归档、清洗、人工确认和多端同步" },
    ],
    tradeoffs: [
      "不追求无条件自动回复，牺牲部分自动化率以换取价格、档期与敏感场景的可靠性。",
      "保留飞书权威主源和本地 JSON 镜像，避免单一向量库成为不可解释的知识黑箱。",
    ],
    nextSteps: [
      "建立覆盖 18 场景的固定评测集，分开统计召回率、答案采纳率、转人工率与知识过期率。",
      "在真实流量中做分阶段灰度，校准置信度阈值并记录误答成本。",
    ],
    relationships: [
      { slug: "wechat-bot", label: "微信公众号机器人", detail: "机器人负责通道接入和会话归档，Agent 负责知识与质量。" },
      { slug: "lora-finetuning", label: "LoRA 微调", detail: "微调模型作为本地推理与云端 API 的备选后端。" },
      { slug: "data-platform", label: "数据中台", detail: "客户上下文和业务知识由统一数据底座支撑。" },
    ],
    images: Array.from({ length: 7 }, (_, i) => `/projects/service-agent/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
  },
  {
    slug: "lumen-ink",
    index: "03",
    category: "Multimodal",
    categoryLabel: "AI IMAGE · MULTI-MODEL",
    title: "光砚 AI 图像编辑工作台",
    subtitle: "把修图专家经验抽象为可操作的参数、流程与模型能力",
    summary:
      "统一接入多类图像模型，将专业人像修图中的特征保留、光影、镜头与风格要求产品化，降低客户体验和团队复用门槛。",
    status: "可在线体验",
    role: "产品负责人 / 交互设计 / 全栈 MVP",
    team: "个人主导，团队业务验证",
    period: "2026.05 - 至今",
    featured: true,
    evidenceLabel: "转化相关结果来自早期业务观察，当前网站不以未经充分验证的提升倍数作为主证据。",
    metrics: [
      { value: "4", label: "类模型 Provider" },
      { value: "6", label: "类专业工具" },
      { value: "6 段", label: "结构化提示词" },
      { value: "1 套", label: "统一模型抽象" },
    ],
    tags: ["多模态", "AI 创作", "模型抽象"],
    stack: ["React", "TypeScript", "Vite", "Express", "GPT Image", "GLM", "Gemini", "Seedream"],
    problem: [
      "专业修图需求难以用一句提示词准确表达，客户也无法理解模型差异和结果边界。",
      "不同模型的接口、参数和失败模式不一致，直接接入会把复杂性暴露给用户和业务团队。",
    ],
    decisions: [
      "以 Provider 工厂与适配器统一模型调用、错误处理和故障转移，避免界面与某一供应商耦合。",
      "把专家经验拆成身份锚定、特征保留、修改指令、光影镜头、风格调性与负面约束六段结构。",
      "沿用 Photoshop / Lightroom 的三栏心智，提供历史记录、回退和可理解的参数，而非纯聊天框。",
    ],
    outcomes: [
      "完成 GPT Image、GLM、Gemini、Seedream 等模型的统一接入和热切换验证。",
      "修脸、调色、液化、修复、消除、导出六类工具覆盖主要人像后期流程。",
      "产品作为售前体验与内部标准化工具使用，降低客户理解 AI 交付的成本。",
    ],
    architecture: [
      { label: "需求结构化", detail: "六段式提示词与专业参数预设" },
      { label: "Provider 层", detail: "统一模型接口、鉴权、限流与错误映射" },
      { label: "任务调度", detail: "模型选择、热切换、失败重试与降级" },
      { label: "编辑工作台", detail: "画布、工具栏、参数面板与历史记录" },
      { label: "交付输出", detail: "JPEG / PNG / WebP 与质量参数" },
    ],
    tradeoffs: [
      "采用用户自配 API Key，降低公开演示成本和密钥风险，但增加首次体验配置步骤。",
      "优先统一高频能力，不追求完全抹平不同模型的专有参数，保留高级入口。",
    ],
    nextSteps: [
      "建立同一任务跨 Provider 的质量、时延与成本评测面板。",
      "增加可复用风格包与人工审核标注，形成图像结果的业务评测集。",
    ],
    relationships: [
      { slug: "mini-program", label: "微信小程序", detail: "作为用户端 AI 体验入口，承接咨询前的信任建立。" },
      { slug: "data-platform", label: "数据中台", detail: "体验结果与咨询留资可进入客户流程。" },
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/lumen-ink/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
    link: { label: "访问光砚", href: "https://lumen-ink.vercel.app/", note: "体验需自行配置模型 API Key" },
  },
  {
    slug: "wechat-bot",
    index: "04",
    category: "Agent / RAG",
    categoryLabel: "WECHAT · AI CUSTOMER SERVICE",
    title: "微信公众号 AI 客服机器人",
    subtitle: "通道接入、基础应答与人工接管的第一线",
    summary:
      "将 Agent 能力接入微信公众号及其他消息通道，负责消息归一化、关键词知识检索、会话归档、人工接管与数据回流。",
    status: "业务验证中",
    role: "产品定义 / 通道架构 / MVP 开发",
    team: "3 人创业团队",
    period: "2026.04 - 至今",
    evidenceLabel: "自动应答率为业务运营观察，尚未形成大样本统计。",
    metrics: [
      { value: "18", label: "类业务场景" },
      { value: "4", label: "类消息通道" },
      { value: "7 步", label: "消息处理管线" },
      { value: "50%+", label: "基础咨询自动应答", note: "内部估算" },
    ],
    tags: ["WeChat", "客服 Agent", "通道适配"],
    stack: ["Python", "微信公众号 API", "GLM-4-Flash", "JSON 关键词检索", "jieba", "字符 bigram", "COS"],
    problem: [
      "公众号非工作时段响应慢，重复问题占用有限人力；不同通道的消息格式、群聊规则和客服会话状态不一致。",
      "向量数据库在轻量部署与可维护性上成本偏高，需要更透明、可本地维护的检索方案。",
    ],
    decisions: [
      "以 BotManager 七步管线依次处理插件、群聊、客服会话、过滤、图片、AI 与后处理，保持通道和业务逻辑解耦。",
      "知识检索从 ChromaDB 迁移到 JSON 关键词检索，使用 jieba 分词并以字符 bigram 兜底，提高透明度和部署稳定性。",
      "明确 AI 为一线基础应答层，复杂、敏感和低置信度问题必须转人工。",
    ],
    outcomes: [
      "支持公众号、iLink、Gewechat 与 itchat 等通道适配，统一进入同一消息处理管线。",
      "会话本地归档并同步至 COS，供 Service Agent 拉取、清洗和人工确认。",
      "内部运营观察显示基础重复咨询自动应答约 50%+，但仍按估算口径展示。",
    ],
    architecture: [
      { label: "消息通道", detail: "公众号 / iLink / Gewechat / itchat" },
      { label: "业务调度", detail: "七步消息管线与客服会话状态" },
      { label: "知识检索", detail: "JSON 关键词、jieba 与字符 bigram 兜底" },
      { label: "模型桥接", detail: "GLM / OpenAI 协议 / 本地模型备选" },
      { label: "归档回流", detail: "本地记录、COS 同步与人工确认" },
    ],
    tradeoffs: [
      "关键词检索牺牲部分语义召回，换取更轻量、透明和稳定的部署；复杂检索由 Service Agent 承担。",
      "通道层只做基础路由与归档，避免在机器人内堆叠全部业务逻辑。",
    ],
    nextSteps: [
      "按场景统计转人工原因、命中词和误答样本，完善关键词和同义词治理。",
      "增加通道级健康检查和本地模型降级，降低云端 API 不可用影响。",
    ],
    relationships: [
      { slug: "service-agent", label: "Service Agent", detail: "共享知识飞轮，Agent 提供复杂检索与审核。" },
      { slug: "lora-finetuning", label: "LoRA 微调", detail: "可作为云端模型不可用时的本地备选推理后端。" },
    ],
    images: Array.from({ length: 3 }, (_, i) => `/projects/wechat-bot/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed",
  },
  {
    slug: "collator",
    index: "05",
    category: "Data / Automation",
    categoryLabel: "DATA AGENT · MULTIMODAL",
    title: "Collator 数据摄入 Agent",
    subtitle: "把聊天、图片、语音与文档转成可校验的业务数据",
    summary:
      "以感知、理解、执行三层 Agent 处理多源非结构化输入，通过四步清洗、五重约束与人工确认，将资料稳定写入数据中台。",
    status: "MVP 验证完成",
    role: "产品架构 / Schema 设计 / MVP 开发",
    team: "个人主导",
    period: "2026.03 - 2026.06",
    metrics: [
      { value: "3 层", label: "Agent 架构" },
      { value: "4 步", label: "清洗流水线" },
      { value: "5 重", label: "约束校验" },
      { value: "7", label: "张业务表 Schema" },
    ],
    tags: ["数据 Agent", "多模态", "Schema"],
    stack: ["Python", "Tesseract OCR", "Whisper ASR", "CLIP", "飞书 API", "JSON Schema", "规则学习器"],
    problem: [
      "业务资料大量存在于聊天记录、图片、语音与文档中，人工整理慢且容易遗漏字段。",
      "LLM 直接提取后写库会产生格式、枚举、状态和逻辑错误，自动化越快，错误扩散越快。",
    ],
    decisions: [
      "将系统分为感知、理解、执行三层，分别负责多模态识别、字段映射和校验写入。",
      "把隐性业务规则显式化为 JSON Schema、枚举、状态机和一致性约束；不确定数据进入人工确认。",
      "规则学习器只学习用户确认后的同义词和字段映射，避免模型自行修改关键规则。",
    ],
    outcomes: [
      "完成 OCR / ASR / CLIP 多模态输入、四步清洗与五重校验的端到端 MVP。",
      "为 7 张核心业务表定义 Schema，并将异常和低置信度记录送入人工确认队列。",
      "作为数据中台的非结构化入口，减少重复整理并提高字段一致性。",
    ],
    architecture: [
      { label: "感知层", detail: "文本、图片、语音和文档识别" },
      { label: "理解层", detail: "实体提取、字段映射与上下文判断" },
      { label: "清洗层", detail: "空值、格式、枚举与默认值处理" },
      { label: "约束层", detail: "必填、状态机、逻辑一致性和低置信度" },
      { label: "执行层", detail: "人工确认、写入与反馈学习" },
    ],
    tradeoffs: [
      "规则与 Schema 优先于端到端自动写入，牺牲少量速度以避免业务数据污染。",
      "多模态引擎采用可替换接口，允许在成本、质量和本地部署之间选择。",
    ],
    nextSteps: [
      "建设人工确认界面的差异对比和批量审核，提高反馈效率。",
      "用固定脏数据集测试字段准确率、约束拦截率与人工修改率。",
    ],
    relationships: [
      { slug: "data-platform", label: "数据中台", detail: "清洗后的结构化数据写入统一业务表。" },
      { slug: "lora-finetuning", label: "LoRA 微调", detail: "整理后的知识文档可进入训练数据准备链路。" },
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/collator/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
  },
  {
    slug: "content-research",
    index: "06",
    category: "Growth",
    categoryLabel: "AUTOMATION · CONTENT RESEARCH",
    title: "多平台爆款内容调研工具",
    subtitle: "把一次性竞品搜索变成可复用的增长基础设施",
    summary:
      "统一采集小红书、抖音、B 站、微博与知乎内容，通过平台适配器、搜索策略、相关性评分和飞书入库支持选题与竞品分析。",
    status: "内部使用",
    role: "产品定义 / 数据模型 / 自动化开发",
    team: "个人主导",
    period: "2026.05 - 2026.06",
    evidenceLabel: "效率提升约 5 倍为业务时间观察，未进行严格实验。",
    metrics: [
      { value: "5", label: "大内容平台" },
      { value: "3", label: "种调研模式" },
      { value: "≈5×", label: "单次调研效率", note: "业务估算" },
      { value: "1 套", label: "统一数据模型" },
    ],
    tags: ["增长产品", "平台适配", "自动化"],
    stack: ["Python", "Playwright", "Exa", "Jina Reader", "飞书 API", "异步 IO"],
    problem: [
      "运营需要在多个平台重复搜索、截图、去重和整理，结果格式不一致，难以复用。",
      "平台反爬和页面结构频繁变化，单一抓取方式稳定性差。",
    ],
    decisions: [
      "定义统一内容数据模型，平台差异封装在抽象基类和适配器中，新平台只实现必要接口。",
      "根据平台限制组合 Playwright、Exa 与 Jina Reader，并设计重试、节奏控制和降级路径。",
      "热门关键词、竞品账号、智能多轮三种模式分别服务不同调研任务。",
    ],
    outcomes: [
      "覆盖 5 个主流内容平台，结果自动去重、评分并写入飞书调研库。",
      "业务观察显示单次内容调研和素材搜寻效率提升约 5 倍，已明确标注为估算。",
      "统一来源链接、截图和标签，为小程序与官网内容运营提供结构化输入。",
    ],
    architecture: [
      { label: "任务定义", detail: "热门关键词 / 竞品账号 / 智能多轮" },
      { label: "平台适配", detail: "五个平台与多种抓取策略" },
      { label: "质量处理", detail: "去重、重试、相关性评分与异常记录" },
      { label: "结果入库", detail: "来源、截图、标签和分析结论同步飞书" },
      { label: "内容反哺", detail: "进入官网、小程序和运营选题" },
    ],
    tradeoffs: [
      "不追求绕过所有平台限制，优先使用合法公开页面和可替换数据源，保留人工补充。",
      "适配器统一核心字段，但允许平台特有指标保留扩展字段。",
    ],
    nextSteps: [
      "建立调研任务的命中率、有效素材率和人工筛选时间指标。",
      "增加平台变化监控和适配器测试，降低页面改版导致的中断。",
    ],
    relationships: [
      { slug: "data-platform", label: "数据中台", detail: "调研结果写入飞书内容库。" },
      { slug: "mini-program", label: "微信小程序", detail: "爆款主题和素材反哺用户端内容。" },
      { slug: "brand-website", label: "品牌官网", detail: "竞品洞察用于更新品牌内容与 SEO。" },
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/content-research/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed",
  },
  {
    slug: "mini-program",
    index: "07",
    category: "User Product",
    categoryLabel: "MINI PROGRAM · CONVERSION",
    title: "泽怀影像微信小程序",
    subtitle: "从浏览种草、审美诊断到咨询留资的移动端路径",
    summary:
      "围绕高端影像服务设计作品浏览、美学问卷、AI 体验和预约咨询，将 AI 能力转化为用户可理解的销售触点。",
    status: "MVP 完成",
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
      "高客单价摄影服务在首次咨询前缺少可体验、可自我表达的触点，客户只能浏览作品后直接问价。",
      "小程序需要在包体、弱网和品牌视觉之间平衡，同时保持预约与数据回写稳定。",
    ],
    decisions: [
      "设计“作品浏览 - 美学问卷 - AI 体验 - 咨询留资”路径，逐步建立审美认同和服务理解。",
      "采用远程 JSON + 本地 Mock 双源降级，核心内容在弱网或接口异常时仍可用。",
      "问卷输出风格诊断和可分享海报，避免仅作为一次性表单。",
    ],
    outcomes: [
      "完成 5 个 Tab 页面、6 个子页面和 9 个业务组件，覆盖浏览、诊断、体验和预约。",
      "核心包控制在 200KB 以内，并通过 CloudBase 云函数处理凭据与咨询提交。",
      "与光砚和数据中台打通产品叙事：AI 体验建立信任，留资进入后续咨询与交付。",
    ],
    architecture: [
      { label: "内容入口", detail: "作品、品牌故事和服务流程" },
      { label: "审美诊断", detail: "10 题问卷、结果解释与分享海报" },
      { label: "AI 体验", detail: "光砚能力的用户端入口" },
      { label: "咨询预约", detail: "表单校验、云函数提交与状态反馈" },
      { label: "数据降级", detail: "远程 JSON、本地 Mock 和弱网兜底" },
    ],
    tradeoffs: [
      "优先原生小程序和轻量资源，牺牲部分复杂动画以保证首开和包体。",
      "AI 体验以可控预设为主，避免在用户端暴露复杂模型配置。",
    ],
    nextSteps: [
      "定义从作品浏览到咨询提交的分步漏斗指标，验证问卷与 AI 体验的实际贡献。",
      "增加内容管理与实验配置，支持不同主题和入口的 A/B 测试。",
    ],
    relationships: [
      { slug: "lumen-ink", label: "光砚", detail: "提供可理解的 AI 图像体验。" },
      { slug: "data-platform", label: "数据中台", detail: "预约和咨询留资进入客户流程。" },
      { slug: "content-research", label: "内容调研", detail: "爆款主题与素材反哺内容运营。" },
    ],
    images: Array.from({ length: 6 }, (_, i) => `/projects/mini-program/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mobile",
    link: { label: "微信搜索体验", href: "#contact", note: "小程序：泽怀影像" },
  },
  {
    slug: "brand-website",
    index: "08",
    category: "User Product",
    categoryLabel: "BRAND SITE · WEB EXPERIENCE",
    title: "泽怀影像品牌官网",
    subtitle: "在两周内完成品牌叙事、作品展示与预约入口",
    summary:
      "通过组件化开发、CDN 资源策略与 SEO，搭建高端影像业务的品牌主阵地，并与小程序和数据中台形成统一转化入口。",
    status: "已上线",
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
      "新业务缺少统一品牌入口，作品、服务流程和咨询方式分散，无法形成可信的高端服务叙事。",
      "时间和团队资源有限，需要在两周内优先完成可上线、可维护和移动端可用的版本。",
    ],
    decisions: [
      "将品牌故事、作品、服务流程、信任信息与预约操作组织为一条连续转化路径。",
      "静态托管与云存储分工，图片走 CDN，并通过懒加载、响应式尺寸与语义元信息控制性能和 SEO。",
      "以 15 个可复用组件支撑快速调整，避免为一次上线写大量不可维护页面代码。",
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
      "首版采用单页叙事和静态内容，优先上线速度；复杂 CMS 需求留到业务验证后。",
      "大图保证品牌质感，同时使用响应式资源和懒加载控制移动端成本。",
    ],
    nextSteps: [
      "接入真实转化漏斗和 Web Vitals，验证内容区块对咨询的贡献。",
      "增加案例独立路由和结构化数据，提升长尾搜索收录。",
    ],
    relationships: [
      { slug: "data-platform", label: "数据中台", detail: "咨询表单和客户信息进入统一流程。" },
      { slug: "content-research", label: "内容调研", detail: "竞品与选题分析反哺品牌内容。" },
      { slug: "mini-program", label: "微信小程序", detail: "官网负责品牌搜索，小程序承接微信内体验。" },
    ],
    images: Array.from({ length: 4 }, (_, i) => `/projects/brand-website/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
    link: { label: "访问品牌官网", href: "https://zehuai-image.vercel.app/" },
  },
  {
    slug: "lora-finetuning",
    index: "09",
    category: "Model Training",
    categoryLabel: "MODEL FINE-TUNING · LOCAL INFERENCE",
    title: "LoRA 客服 Agent 微调",
    subtitle: "从业务语料、QLoRA 训练到 OpenAI 兼容本地推理",
    summary:
      "将 30+ 篇业务文档清洗为单轮与多轮 SFT 数据，在 16GB 单卡上完成 Qwen 1.5B / 7B 双基座 QLoRA，并封装本地 RAG 与推理服务。",
    status: "训练与本地验证完成",
    role: "产品验证 / 数据准备 / 训练与推理工程",
    team: "个人主导",
    period: "2026.06 - 2026.07",
    metrics: [
      { value: "2", label: "个微调基座" },
      { value: "4bit", label: "QLoRA 量化" },
      { value: "2.377 → 1.369", label: "1.5B 训练 loss" },
      { value: "2.732 → 1.524", label: "7B 训练 loss" },
    ],
    tags: ["模型微调", "本地推理", "QLoRA"],
    stack: ["Python", "PyTorch", "LLaMA-Factory", "PEFT", "bitsandbytes", "FastAPI", "bge-small-zh-v1.5"],
    problem: [
      "通用模型不了解业务术语、服务流程和客服语气，RAG 检索失败时仍可能给出通用或编造回答。",
      "云端 API 受成本、延迟与数据边界约束，需要验证本地模型能否作为可替换后端。",
    ],
    decisions: [
      "将 30+ 篇飞书文档清洗为 Alpaca 单轮与 ShareGPT 多轮数据，分离知识表达与对话风格学习。",
      "选择 QLoRA 4bit、LoRA rank 16 与双基座策略，在 16GB 单卡约束下平衡训练可行性、时延和质量。",
      "推理层遵循 OpenAI 兼容协议，提供流式 SSE、会话管理、本地 RAG 和输出护栏，便于接入现有 Agent。",
    ],
    outcomes: [
      "Qwen2-1.5B loss 从 2.377 收敛至 1.369；Qwen2.5-7B 从 2.732 收敛至 1.524。",
      "完成数据准备、训练、Adapter 导出、模型合并、本地检索和 FastAPI 服务的端到端链路。",
      "本地模型可作为 Service Agent 与微信机器人的备选后端，但业务效果仍需独立评测集验证。",
    ],
    architecture: [
      { label: "数据准备", detail: "飞书提取、去重、分块和格式转换" },
      { label: "双基座训练", detail: "Qwen 1.5B / 7B、QLoRA 4bit、LoRA rank 16" },
      { label: "模型导出", detail: "Adapter 检查点、基座合并和版本管理" },
      { label: "本地 RAG", detail: "向量检索、上下文注入与输出护栏" },
      { label: "兼容服务", detail: "FastAPI、SSE、会话和 OpenAI 协议" },
    ],
    tradeoffs: [
      "训练 loss 只能证明优化过程收敛，不等于业务回答质量；网站明确区分训练证据与产品效果。",
      "小模型时延更低、部署更轻，7B 质量潜力更高；通过统一 API 保持可替换性。",
    ],
    nextSteps: [
      "构建涵盖事实准确、拒答、语气、流程与敏感边界的独立测试集，对比基座、LoRA、RAG 和 LoRA+RAG。",
      "统计首字时延、吞吐、显存和单次推理成本，建立双基座路由策略。",
    ],
    relationships: [
      { slug: "service-agent", label: "Service Agent", detail: "优质知识与会话可进入训练集，本地模型可作为推理后端。" },
      { slug: "wechat-bot", label: "微信公众号机器人", detail: "OpenAI 兼容接口便于在云端 API 失效时降级。" },
      { slug: "collator", label: "Collator", detail: "结构化和清洗能力可用于训练语料准备。" },
    ],
    images: [
      "/projects/lora-finetuning/01.png",
      "/projects/lora-finetuning/02.png",
      "/projects/lora-finetuning/03.png",
      "/projects/lora-finetuning/04.png",
    ],
    imageMode: "desktop",
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

export const featuredProjects = ["service-agent", "data-platform", "lumen-ink"]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export const capabilities = [
  {
    title: "产品判断",
    body: "从业务链路、异常路径和成本约束出发定义 AI 场景，不从模型能力反推功能。",
    evidence: "12 个业务节点 · 18 类咨询场景 · 5 层产品架构",
  },
  {
    title: "AI 系统设计",
    body: "覆盖 Agent、RAG、模型路由、知识治理、人工质量闸门与本地微调。",
    evidence: "三级置信度 · QLoRA 双基座 · OpenAI 兼容服务",
  },
  {
    title: "端到端交付",
    body: "能完成需求、原型、开发验证、上线协同、评估设计与数据回流。",
    evidence: "9 个项目 · 17 表 / 12 自动化 · Web / 小程序 / APP",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
