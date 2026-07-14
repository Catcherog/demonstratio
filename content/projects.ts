export type Project = {
  slug: string;
  index: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  highlights: string[];
  design: string[];
  technical: string[];
  images: string[];
  imageMode?: "desktop" | "mobile" | "mixed";
  link?: { label: string; href: string; note?: string };
};

export const projects: Project[] = [
  {
    slug: "data-platform",
    index: "01",
    category: "DATA PLATFORM · MOBILE OPS",
    title: "数据中台底座 + 移动作业 APP",
    subtitle: "工作室的标准化交付引擎",
    summary: "承载全业务数据流转与流程自动化，并通过跨端管理 APP 支持移动作业，把分散经验转化为可复用、可追踪的标准流程。",
    stack: ["飞书多维表", "Node.js", "React Native", "Expo", "CloudBase", "OCR", "ASR", "CLIP"],
    metrics: [
      { value: "17", label: "张核心数据表" },
      { value: "12", label: "条自动化规则" },
      { value: "70%", label: "培训效率提升" }
    ],
    highlights: [
      "5 大业务域覆盖核心业务、资源库、内容生产、知识库与管理。",
      "trigger_control_list 保护机制防止批量操作误触发，历史数据迁移 111 条、0 失败。",
      "APP 包含看板、项目、客户、资源、分发与知识库 6 大模块，支持离线缓存和待同步队列。",
      "SOP 检查清单随项目阶段智能推荐，新人上手周期从 2–3 周缩短至 3–5 天。"
    ],
    design: [
      "拆解摄影业务全链路，识别客户成交、项目创建、素材归档、成品任务生成、定金到账等 12 个关键流转节点。",
      "以飞书多维表作为核心数据载体，联动云盘与 Wiki，形成统一数据中台。",
      "移动端围绕外勤拍摄设计，优先解决弱网、权限与现场执行一致性。"
    ],
    technical: [
      "Node.js 同步脚本完成电子表格到多维表的增量同步。",
      "CloudBase 云函数代理飞书 API，隔离凭据并统一鉴权。",
      "部门 ID + 关键词匹配实现 admin / photographer / post 两级业务权限。",
      "React Native / Expo 跨端架构，14 个通用 UI 组件与 OAuth 回调云函数。"
    ],
    images: Array.from({ length: 10 }, (_, i) => `/projects/data-platform/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed"
  },
  {
    slug: "service-agent",
    index: "02",
    category: "RAG · AGENT · AI SERVICE",
    title: "Service Agent",
    subtitle: "AI 优先应答，未知问题转人工",
    summary: "围绕高端咨询场景构建独立 Agent 与 PC 端客服辅助系统，通过三轨知识库、置信度判读和数据飞轮持续提升回答质量。",
    stack: ["Python", "ChromaDB", "RAG", "SentenceTransformer", "腾讯云 COS", "CloudBase", "GLM"],
    metrics: [
      { value: "90%+", label: "检索准确率" },
      { value: "60%+", label: "重复咨询自动应答" },
      { value: "7×24", label: "秒级响应" }
    ],
    highlights: [
      "飞书文档权威主源、ChromaDB 向量检索与本地 JSON 镜像组成三轨知识库。",
      "查询重写、向量检索、重排序组成 RAG 全链路，配合 18 模块分类映射。",
      "置信度三级判读：高分直接采用，中间分人工复核，低分触发兜底与转人工。",
      "优质会话自动沉淀，经人工确认后同步回知识库，形成持续优化的数据飞轮。"
    ],
    design: [
      "把客服系统设计为“有效对话沉淀—知识增量同步—检索效果优化”的闭环，而不是一次性问答工具。",
      "以人工确认作为质量闸门，避免低质量回复直接污染知识库。",
      "通过冷启动代理网关降低 CloudBase 容器初始化延迟。"
    ],
    technical: [
      "glm_knowledge.json v3.0 作为跨项目同步镜像，配合 ChromaDB 与 COS 双向同步。",
      "500 字分块、多语言嵌入与重排序组合提升召回质量。",
      "sync_confirmed_to_all.py 一次完成 ChromaDB、JSON、COS 与飞书同步。",
      "18 个业务咨询场景覆盖品牌介绍、价格套餐、拍摄流程、FAQ 与危机应对。"
    ],
    images: Array.from({ length: 7 }, (_, i) => `/projects/service-agent/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop"
  },
  {
    slug: "lumen-ink",
    index: "03",
    category: "AI IMAGE · MULTI-MODEL",
    title: "光砚 AI 图像编辑工作台",
    subtitle: "把专业修图经验编译为可操作的 AI 产品",
    summary: "为专业修图师提供统一界面，将多模型图像能力、提示词框架和专业操作流程封装为可直接体验的产品。",
    stack: ["React", "TypeScript", "Vite", "Express", "GPT Image", "GLM", "Gemini", "Seedream"],
    metrics: [
      { value: "4", label: "类图像模型" },
      { value: "6", label: "大修图工具" },
      { value: "≈2×", label: "问价转化提升" }
    ],
    highlights: [
      "Provider 工厂模式统一接入多类图像模型，支持热切换与故障转移。",
      "六段式提示词框架把身份锚定、特征保留、修改指令、光影镜头与风格调性结构化。",
      "修脸、调色、液化、修复、消除、导出六大工具覆盖专业后期核心流程。",
      "三栏布局贴合 Photoshop / Lightroom 心智，支持操作历史持久化与任意步骤回退。"
    ],
    design: [
      "把复杂专业工作流拆为可理解的滑块、开关与预设，使客户无需掌握提示词也能完成操作。",
      "让潜在客户在咨询前直接体验技术能力，把技术展示转化为高客单价服务的信任资产。",
      "界面沿用专业修图软件的工具栏、画布与参数面板结构，降低学习成本。"
    ],
    technical: [
      "ProviderStore 采用工厂模式与适配器模式聚合不同模型供应商。",
      "前端 React + TypeScript + Vite，后端 Express + JWT。",
      "API Key 仅由用户自行配置；作品集不包含任何密钥。",
      "支持 JPEG、PNG、WebP 多格式导出及质量参数控制。"
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/lumen-ink/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
    link: { label: "访问光砚", href: "https://lumen-ink.vercel.app/", note: "需自行配置 API Key" }
  },
  {
    slug: "wechat-bot",
    index: "04",
    category: "WECHAT · AI CUSTOMER SERVICE",
    title: "微信公众号 AI 客服机器人",
    subtitle: "面向公众号客户的 7×24 秒级响应",
    summary: "覆盖 18 个业务咨询场景，通过插件化管线、知识库检索与多通道适配，承担非工作时段的基础咨询与重复问题应答。",
    stack: ["Python", "微信公众号 API", "GLM-4-Flash", "ChromaDB", "腾讯云 COS", "iLink", "Gewechat"],
    metrics: [
      { value: "18", label: "个业务场景" },
      { value: "50%+", label: "咨询自动应答" },
      { value: "4", label: "类消息通道" }
    ],
    highlights: [
      "六层架构拆分消息通道、业务调度、模型桥接、插件、语音与冷启动代理。",
      "BotManager 七步管线依次处理插件、群聊、客服会话、过滤、图片、AI 与后处理。",
      "支持公众号、iLink、Gewechat、itchat 四类通道与多模型 Bridge。",
      "与 Service Agent 共享数据飞轮，优质客服对话可回流知识库。"
    ],
    design: [
      "把 AI 定位为一线应答层，明确低置信度、复杂或敏感问题转人工。",
      "插件化设计使敏感词、角色设定、知识检索、联网搜索与飞书同步能够独立演进。",
      "归档、清洗、确认、同步的闭环保证机器人随业务更新。"
    ],
    technical: [
      "Bridge 层兼容 GLM / OpenAI 协议、Local HTTP、Ollama 与文件队列。",
      "关键模块包括 cs_session_manager、flywheel_archive、knowledge_store 与 scheduler。",
      "定时上传会话归档至 COS，由 Service Agent 拉取并清洗。",
      "冷启动代理网关缓解云容器首次响应延迟。"
    ],
    images: Array.from({ length: 3 }, (_, i) => `/projects/wechat-bot/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed",
    link: { label: "微信搜索体验", href: "#contact", note: "公众号：泽怀影像小怀" }
  },
  {
    slug: "collator",
    index: "05",
    category: "DATA AGENT · MULTIMODAL",
    title: "Collator 数据摄入 Agent",
    subtitle: "多源非结构化数据自动清洗与入库",
    summary: "面向聊天记录、图片、语音和文档等非结构化输入，构建感知、理解、执行三层 Agent，实现自动解析、校验、映射与入库。",
    stack: ["Python", "Tesseract OCR", "Whisper ASR", "CLIP", "飞书 API", "规则学习器"],
    metrics: [
      { value: "3", label: "层 Agent 架构" },
      { value: "5", label: "重约束校验" },
      { value: "8", label: "个核心子模块" }
    ],
    highlights: [
      "感知层识别多模态输入，理解层完成字段提取与映射，执行层负责校验和写入。",
      "空值处理、格式化、枚举映射、默认值组成四步清洗流水线。",
      "字段格式、必填、枚举、状态机与逻辑一致性构成五重约束。",
      "规则学习器从用户反馈中学习同义词，持续提高结构化准确率。"
    ],
    design: [
      "把人工整理资料的隐性规则显式化为 Schema、枚举、状态机与一致性校验。",
      "让系统在无法确定时回退到人工确认，而不是直接写入错误数据。",
      "通过反馈学习逐步降低重复纠正成本。"
    ],
    technical: [
      "core、agent、rules、schemas、multimodal、config、benchmark、utils 八个子模块解耦。",
      "为七张核心业务表设计 JSON Schema。",
      "OCR、ASR 与 CLIP 采用双引擎 fallback。",
      "规则学习器维护同义词与字段映射，支持增量更新。"
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/collator/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop"
  },
  {
    slug: "content-research",
    index: "06",
    category: "AUTOMATION · CONTENT RESEARCH",
    title: "多平台爆款内容调研工具",
    subtitle: "把竞品内容采集变成可复用的运营基础设施",
    summary: "统一采集小红书、B 站、微博、知乎与抖音的热门内容，通过多轮搜索、相关性评分和飞书入库提高公域调研效率。",
    stack: ["Python", "Playwright", "Exa", "Jina Reader", "飞书 API", "异步 IO"],
    metrics: [
      { value: "5", label: "大内容平台" },
      { value: "3", label: "种调研模式" },
      { value: "12×", label: "调研效率提升" }
    ],
    highlights: [
      "抽象基类 + 平台适配器，新平台只需实现三个抽象方法。",
      "关键词热门、竞品账号、智能多轮三种调研模式覆盖不同任务。",
      "标签扩展与相关性打分结合点赞、标签命中和标题命中提升召回。",
      "结果自动写入飞书爆款调研库，并附带截图与来源链接。"
    ],
    design: [
      "统一数据模型，避免运营团队为每个平台维护不同整理模板。",
      "把搜索策略、去重、异常重试与结果入库封装为稳定流程。",
      "针对平台限制设计渐进请求节奏和降级路径。"
    ],
    technical: [
      "小红书使用 Playwright 真实浏览器方案，其他平台使用 Exa + Jina Reader。",
      "URL path 去重剥离 query 参数，避免 token 造成重复记录。",
      "详情页采用两次重试与指数退避。",
      "异步 IO 提升跨平台抓取吞吐。"
    ],
    images: Array.from({ length: 5 }, (_, i) => `/projects/content-research/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mixed"
  },
  {
    slug: "mini-program",
    index: "07",
    category: "MINI PROGRAM · CONVERSION",
    title: "泽怀影像微信小程序",
    subtitle: "浏览、体验、预约的一体化转化载体",
    summary: "围绕高端影像服务设计作品浏览、美学问卷、AI 艺术影像体验与咨询预约，形成从种草到留资的完整路径。",
    stack: ["微信原生小程序", "CloudBase", "自定义 TabBar", "Canvas", "远程 JSON", "本地 Mock"],
    metrics: [
      { value: "11", label: "个页面" },
      { value: "9", label: "个业务组件" },
      { value: "<200KB", label: "核心包体积" }
    ],
    highlights: [
      "作品画廊、灵犀甄选问卷、AI 影像体验、咨询预约四大模块。",
      "远程 JSON + 本地 Mock 双源数据架构，保障弱网与离线场景。",
      "10 题美学问卷输出 AI 风格诊断报告，并支持 Canvas 海报生成。",
      "两类云函数分别处理 COS 临时凭据与咨询提交。"
    ],
    design: [
      "以品牌内容建立审美认同，再通过问卷与体验降低首次咨询门槛。",
      "转化路径为浏览种草—美学问卷—AI 修图体验—咨询留资。",
      "交互和视觉保持品牌一致，同时控制小程序包体积。"
    ],
    technical: [
      "五个 Tab 页面与六个子页面组成 11 页结构。",
      "自定义 TabBar 与九个业务组件复用核心交互。",
      "视频采用 H.264 Constrained Baseline Level 3.1 / AAC 编码规范。",
      "CloudBase 云函数处理凭据与表单提交。"
    ],
    images: Array.from({ length: 6 }, (_, i) => `/projects/mini-program/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "mobile",
    link: { label: "微信搜索体验", href: "#contact", note: "小程序：泽怀影像" }
  },
  {
    slug: "brand-website",
    index: "08",
    category: "BRAND SITE · WEB EXPERIENCE",
    title: "泽怀影像品牌官网",
    subtitle: "两周完成设计到上线的品牌主阵地",
    summary: "承载品牌故事、作品展示、服务流程和预约咨询，通过组件化开发、CDN 资源策略与 SEO 优化快速落地。",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "CloudBase", "CDN"],
    metrics: [
      { value: "2 周", label: "设计到上线" },
      { value: "15", label: "个可复用组件" },
      { value: "<2s", label: "首屏加载" }
    ],
    highlights: [
      "10 个核心区块覆盖 Hero、品牌故事、作品、流程与预约。",
      "静态托管与云存储分工，图片使用 CDN URL 直接访问。",
      "/media/ 资源前缀避免与 Vite 构建产物 /assets/ 冲突。",
      "懒加载、响应式图片、CDN 与 SEO 全链路优化。"
    ],
    design: [
      "以电影感影像为视觉主线，用留白、节奏和大图建立高端品牌印象。",
      "将品牌叙事、案例浏览与预约操作放在同一转化链路。",
      "在两周交付周期内优先保证核心信息、性能与移动端体验。"
    ],
    technical: [
      "React + TypeScript + Vite 组件化实现。",
      "表单状态机管理预约与咨询提交。",
      "图片懒加载、响应式尺寸与 CDN 缓存降低首屏成本。",
      "结构化元信息、语义标签、站点地图与页面描述完善 SEO。"
    ],
    images: Array.from({ length: 4 }, (_, i) => `/projects/brand-website/${String(i + 1).padStart(2, "0")}.webp`),
    imageMode: "desktop",
    link: { label: "访问品牌官网", href: "https://zehuai-image.vercel.app/" }
  }
];

export const capabilities = [
  "AI Native 产品架构",
  "Agent 产品设计",
  "RAG 知识库",
  "数据中台",
  "多模态处理",
  "图像生成",
  "业务全链路拆解"
];
