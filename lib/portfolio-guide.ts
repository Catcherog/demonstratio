import { flagshipCaseStudies, type FlagshipCaseStudy, type NarrativePoint } from "@/content/flagship-cases";
import { portfolioEvidence } from "@/content/portfolio-evidence";
import { getProject, projects, type Project } from "@/content/projects";

export type GuideRole = "recruiter" | "product-lead" | "technical";

export type PortfolioSource = {
  evidenceId: string;
  projectSlug: string;
  title: string;
  status: string;
  href: string;
  section: string;
  excerpt: string;
  score: number;
};

export type PortfolioDocument = Omit<PortfolioSource, "score"> & {
  content: string;
  searchText: string;
  evidenceIds: string[];
};

export type GuideHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

const ROLE_HINTS: Record<GuideRole, string[]> = {
  recruiter: ["角色", "职责", "交付", "成果", "经历", "岗位", "能力", "负责", "团队"],
  "product-lead": ["产品", "决策", "取舍", "业务", "闭环", "用户", "流程", "指标", "边界"],
  technical: ["技术", "架构", "实现", "代码", "可靠性", "测试", "模型", "RAG", "Agent", "API"],
};

const SYNONYMS: Record<string, string[]> = {
  agent: ["agent", "智能体", "客服", "langgraph", "rag", "service agent", "service-agent"],
  飞书: ["飞书", "数据平台", "数据中台", "base", "多维表", "collator", "摄入"],
  光砚: ["光砚", "lumen", "图像", "修图", "多模态", "provider", "模型路由"],
  微信: ["微信", "公众号", "机器人", "小程序", "wechat"],
  增长: ["增长", "调研", "内容", "竞品", "小红书", "抖音"],
  微调: ["微调", "lora", "qlora", "训练", "本地模型", "推理"],
  风险: ["风险", "fail-closed", "人工接管", "置信度", "拒答", "边界"],
  证据: ["证据", "验证", "测试", "状态", "评测", "指标", "回归"],
  导览: [
    "ai 导览",
    "ai导览",
    "作品集导览",
    "作品集助手",
    "官网机器人",
    "导览机器人",
    "作品集机器人",
    "portfolio guide",
    "ai guide",
    "招聘官助手",
  ],
};

const BROAD_PROJECT_TERMS = [
  "全部",
  "所有",
  "其他",
  "其余",
  "除了",
  "主案例之外",
  "还有哪些",
  "还做过哪些",
  "完整项目",
  "项目库",
  "技术版图",
  "能力版图",
];

const PROJECT_ALIASES: Record<string, string[]> = {
  "data-platform": ["飞书", "数据平台", "数据中台", "base"],
  "service-agent": ["service agent", "serviceagent", "service-agent", "客服 agent", "客服agent", "langgraph", "rag"],
  "lumen-ink": ["光砚", "lumen", "图像编辑", "修图", "多模态"],
  "wechat-bot": ["公众号", "微信机器人", "wechat bot", "wechat-bot"],
  collator: ["collator", "摄入 agent", "摄入agent", "数据摄入"],
  "content-research": ["内容调研", "增长工具", "爆款"],
  "mini-program": ["微信小程序", "小程序"],
  "brand-website": ["品牌官网", "泽怀官网"],
  "lora-finetuning": ["lora", "qlora", "微调", "本地推理"],
  "portfolio-guide": [
    "ai 导览",
    "ai导览",
    "作品集导览",
    "作品集助手",
    "官网机器人",
    "导览机器人",
    "portfolio guide",
    "ai guide",
  ],
};

const CROSS_PROJECT_TERMS = [...BROAD_PROJECT_TERMS, "对比", "区别", "关系"];

function compact(items: Array<string | undefined | null>): string[] {
  return items.filter((item): item is string => Boolean(item?.trim()));
}

function createDocument(
  project: Project,
  sectionId: string,
  section: string,
  content: string,
  evidenceIds: string[],
): PortfolioDocument {
  const common = [
    project.title,
    project.subtitle,
    project.summary,
    project.status,
    project.role,
    project.team,
    project.period,
    project.category,
    project.categoryLabel,
    ...project.tags,
    ...project.stack,
  ].join("\n");
  return {
    evidenceId: `${project.slug}:${sectionId}`,
    evidenceIds,
    projectSlug: project.slug,
    title: project.title,
    status: project.status,
    href: `/projects/${project.slug}`,
    section,
    excerpt: content.slice(0, 320),
    content,
    searchText: `${common}\n${section}\n${content}`.toLowerCase(),
  };
}

function flattenSupportingProject(project: Project): PortfolioDocument[] {
  const projectEvidenceIds = (project.evidenceLinks ?? []).map((item) => item.ref);
  const documents = [
    createDocument(project, "overview", "项目概览", compact([
      `项目：${project.title}`,
      `定位：${project.subtitle}`,
      `摘要：${project.summary}`,
      `当前状态：${project.status}`,
      `我的角色：${project.role}`,
      `团队：${project.team}`,
      `周期：${project.period}`,
      project.evidenceLabel ? `证据边界：${project.evidenceLabel}` : undefined,
    ]).join("\n"), projectEvidenceIds),
    createDocument(project, "decisions", "业务问题与产品决策", compact([
      ...project.problem.map((item, index) => `问题 ${index + 1}：${item}`),
      ...(project.productStrategy ?? []).map((item, index) => `产品策略 ${index + 1}：${item}`),
      ...project.decisions.map((item, index) => `决策 ${index + 1}：${item}`),
      ...project.tradeoffs.map((item, index) => `取舍 ${index + 1}：${item}`),
    ]).join("\n"), projectEvidenceIds),
    createDocument(project, "architecture", "架构与实现", compact([
      ...project.architecture.map((item, index) => `架构 ${index + 1}｜${item.label}：${item.detail}`),
      ...(project.keyWorkflow ?? []).map((item, index) => `工作流 ${index + 1}｜${item.label}：${item.detail}`),
      `技术栈：${project.stack.join("、")}`,
    ]).join("\n"), projectEvidenceIds),
    createDocument(project, "evidence", "成果、证据与边界", compact([
      ...project.outcomes.map((item, index) => `成果 ${index + 1}：${item}`),
      ...project.metrics.map((metric, index) => `指标 ${index + 1}：${metric.value} ${metric.label}${metric.note ? `（${metric.note}）` : ""}${metric.evidenceRef ? `；证据 ${metric.evidenceRef}` : ""}`),
      ...(project.verifiedCapabilities ?? []).map((item) => `已验证：${item}`),
      ...(project.inProgressCapabilities ?? []).map((item) => `进行中：${item}`),
      ...(project.plannedCapabilities ?? []).map((item) => `计划：${item}`),
      ...(project.evidenceLinks ?? []).map((item) => `证据：${item.label}｜${item.ref}｜${item.type}`),
      project.lastVerifiedAt ? `最后核验时间：${project.lastVerifiedAt}` : undefined,
    ]).join("\n"), projectEvidenceIds),
    createDocument(project, "contribution", "个人贡献与项目关系", compact([
      ...(project.myContribution ?? []).map((item) => `贡献｜${item.area}：${item.detail}`),
      ...project.relationships.map((item) => `关系｜${item.label}：${item.detail}`),
      ...project.nextSteps.map((item, index) => `下一步 ${index + 1}：${item}`),
    ]).join("\n"), projectEvidenceIds),
  ];
  return documents.filter((document) => document.content.trim().length > 0);
}

const SECTION_LABELS = {
  overview: "项目概览",
  business: "业务判断",
  product: "产品方案",
  technical: "技术实现",
  iterations: "迭代链路",
  evidence: "项目证据",
} as const;

function pointLines(prefix: string, points: NarrativePoint[]) {
  return points.map((point, index) => `${prefix} ${index + 1}｜${point.title}：${point.detail}；证据 ${point.evidenceRefs.join("、")}`);
}

function availableEvidenceForProject(slug: string) {
  return portfolioEvidence.filter(
    (item) => item.projectSlug === slug && item.publicSafe && item.state === "available" && item.evidenceRefs.length > 0,
  );
}

function flagshipDocuments(study: FlagshipCaseStudy): PortfolioDocument[] {
  const project = getProject(study.slug);
  if (!project) throw new Error(`Missing flagship project: ${study.slug}`);
  const availableEvidence = availableEvidenceForProject(study.slug);
  const availableEvidenceIds = availableEvidence.map((item) => item.id);
  const create = (sectionId: keyof typeof SECTION_LABELS, content: string) =>
    createDocument(project, sectionId, SECTION_LABELS[sectionId], content, availableEvidenceIds);

  return [
    create("overview", compact([
      `项目：${project.title}`,
      `一句话：${study.overview.oneLine}`,
      `责任：${study.overview.responsibility}`,
      `当前状态：${project.status}`,
      `证据边界：${study.overview.boundary}`,
      `公开指标绑定：${study.overview.claimIds.join("、")}`,
    ]).join("\n")),
    create("business", compact([
      `为什么做：${study.business.whyBuild}`,
      ...pointLines("业务信号", study.business.signals),
      ...pointLines("关键判断", study.business.judgments),
      ...study.business.constraints.map((item, index) => `约束 ${index + 1}：${item}`),
    ]).join("\n")),
    create("product", compact([
      `产品形态：${study.product.form}`,
      `用户：${study.product.users.join("、")}`,
      ...pointLines("工作流", study.product.workflow),
      ...pointLines("产品决策", study.product.decisions),
      ...study.product.nonGoals.map((item, index) => `非目标 ${index + 1}：${item}`),
    ]).join("\n")),
    create("technical", compact([
      ...pointLines("架构", study.technical.architecture),
      ...pointLines("关键机制", study.technical.mechanisms),
      ...pointLines("技术取舍", study.technical.tradeoffs),
      `技术栈：${project.stack.join("、")}`,
    ]).join("\n")),
    create("iterations", study.iterations.map((entry, index) => compact([
      `迭代 ${index + 1}｜${entry.version}`,
      `触发：${entry.trigger}`,
      `产品变化：${entry.productChange}`,
      `技术变化：${entry.technicalChange}`,
      `结果：${entry.result}`,
      `边界：${entry.boundary}`,
      `证据：${entry.evidenceRefs.join("、")}`,
    ]).join("\n")).join("\n\n")),
    create("evidence", availableEvidence.map((item, index) => compact([
      `证据 ${index + 1}｜${item.id}｜${item.title}`,
      `类型：${item.kind}`,
      `状态：${item.state}`,
      `范围：${item.scope}`,
      `摘要：${item.summary}`,
      `边界：${item.boundary}`,
      `权威引用：${item.evidenceRefs.join("、")}`,
    ]).join("\n")).join("\n\n")),
  ];
}

const PORTFOLIO_GUIDE_SOURCE_IDS = [
  "app/api/portfolio-guide/route.ts",
  "lib/portfolio-guide.ts",
  "lib/portfolio-ai/config.ts",
  "components/PortfolioGuide.tsx",
];

function portfolioGuideDocuments(): PortfolioDocument[] {
  const title = "作品集 AI 导览";
  const status = "Production｜证据约束型实时导览";

  const sections: Array<{
    id: string;
    section: string;
    content: string;
  }> = [
    {
      id: "overview",
      section: "系统定位",
      content: [
        "作品集 AI 导览是内嵌在官网中的只读证据导览系统。",
        "它不是 Studio Customer Service，不复用 Service Agent 的 LangGraph 工作流。",
        "它的目标是帮助招聘官、产品负责人和技术面试官理解项目事实、产品判断、技术实现、本人贡献和当前能力边界。",
        "系统不会修改飞书、知识库、项目数据或任何外部系统。",
      ].join("\n"),
    },
    {
      id: "retrieval",
      section: "知识源与检索",
      content: [
        "导览知识由官网代码中的公开内容动态构建，主要来源包括 content/projects.ts、content/flagship-cases、content/portfolio-evidence.ts，以及公开工作与教育经历。",
        "当前检索使用关键词、项目别名、角色提示和规则加权排序，不使用 ChromaDB、Embedding 或向量数据库。",
        "每次问题默认最多选择 8 个公开证据片段，并把完整片段作为上下文交给模型。",
        "计划中、不可公开或没有权威引用的证据不会进入旗舰案例知识上下文。",
      ].join("\n"),
    },
    {
      id: "runtime",
      section: "模型与运行链路",
      content: [
        "服务端通过火山引擎方舟的 OpenAI-compatible Chat Completions 接口调用模型，默认模型配置为 GLM-5.2。",
        "回答通过 NDJSON 流式返回，同时返回命中的项目来源、项目状态和章节。",
        "系统支持 live、guided 和 fallback 三种模式；主模型不可用时可以尝试备用模型，全部失败时使用离线证据回答。",
        "单次问题最多 600 个字符；当前会话最多携带最近 6 条 user/assistant 历史消息。",
      ].join("\n"),
    },
    {
      id: "safety",
      section: "安全与能力边界",
      content: [
        "导览只允许基于公开证据回答，不得补写未公开的客户、收入、准确率、生产效果或模型评测结果。",
        "它没有长期记忆；最近 6 条消息只用于当前浏览器会话中的连续追问。",
        "它没有工具调用、外部写入或业务操作能力。",
        "工程测试数量只能证明代码回归，不能解释为模型回答准确率。",
        "当前没有正式发布的 AI 导览回答质量分数。",
      ].join("\n"),
    },
    {
      id: "maintenance",
      section: "资料更新机制",
      content: [
        "导览知识与官网公开事实共用同一套 TypeScript 内容源。",
        "项目状态、证据、工作流或能力边界发生变化时，需要同时更新官网事实文件、检索别名和合同测试。",
        "当前没有独立向量索引，因此更新资料后不需要执行文档切分、Embedding 或向量库重建。",
        "知识更新通过代码审查、自动测试、Preview 问答回归和 Production 发布完成。",
      ].join("\n"),
    },
  ];

  return sections.map(({ id, section, content }) => ({
    evidenceId: `portfolio-guide:${id}`,
    evidenceIds: PORTFOLIO_GUIDE_SOURCE_IDS,
    projectSlug: "portfolio-guide",
    title,
    status,
    href: "/#portfolio-guide",
    section,
    excerpt: content.slice(0, 320),
    content,
    searchText: [
      title,
      status,
      section,
      content,
      "AI 导览 作品集助手 官网机器人 portfolio guide evidence grounded read only",
    ]
      .join("\n")
      .toLowerCase(),
  }));
}

function experienceDocuments(): PortfolioDocument[] {
  const items = [
    {
      evidenceId: "experience:tp-link",
      title: "TP-Link 商用项目经理经历",
      status: "2024.07—2026.02",
      section: "复杂项目组合管理",
      excerpt: "负责 5 条软硬件产品线、282 个 SKU 全生命周期及峰值 80+ 项目并行。",
      content: "陈嘉伟曾任 TP-Link 商用项目经理，负责 5 条软硬件产品线的项目组合、跨国需求和高风险交付；管理 282 个 SKU 全生命周期，峰值 80+ 项目并行；主导海外 NFC 功能定义与交互方案；高风险项目追回 2 周工期，5 款产品提前 15 天量产。",
    },
    {
      evidenceId: "experience:startup",
      title: "泽怀摄影工作室创业经历",
      status: "2026.02—至今",
      section: "AI 产品创业",
      excerpt: "3 人全职创业团队创始人兼 AI 产品负责人，构建五层 AI Native 产品系统。",
      content: "陈嘉伟现为 3 人全职创业团队的创始人兼 AI 产品负责人，负责产品战略、业务建模、MVP 验证、技术方案、开发协作、上线与评估设计。作品集包含 3 个主案例、Collator 飞书子系统及其他业务支撑项目。",
    },
    {
      evidenceId: "experience:education",
      title: "中南大学材料物理本科",
      status: "2020.09—2024.06",
      section: "教育背景",
      excerpt: "材料物理本科，省级大学生创新创业项目奖项，参与固态电池材料课题，CET-6。",
      content: "陈嘉伟毕业于中南大学材料物理专业，获得大学生创新创业项目省级奖项，参与固态电池材料课题研究，CET-6。材料科学训练支持其结构化分析复杂系统与约束。",
    },
  ];
  return items.map((item) => ({
    ...item,
    evidenceIds: [item.evidenceId],
    projectSlug: "experience",
    href: "/#experience",
    searchText: `${item.title}\n${item.section}\n${item.content}`.toLowerCase(),
  }));
}

const flagshipBySlug = new Map<string, FlagshipCaseStudy>(flagshipCaseStudies.map((study) => [study.slug, study]));

export const portfolioDocuments: PortfolioDocument[] = [
  ...projects.flatMap((project) => {
    const study = flagshipBySlug.get(project.slug);
    return study ? flagshipDocuments(study) : flattenSupportingProject(project);
  }),
  ...portfolioGuideDocuments(),
  ...experienceDocuments(),
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s，。！？、；：,.!?;:()（）\[\]【】“”'"`]/g, "");
}

function queryTerms(question: string, role: GuideRole): string[] {
  const normalized = question.toLowerCase();
  const terms = new Set<string>();

  for (const raw of normalized.split(/[\s，。！？、；：,.!?;:()（）\[\]【】“”'"`/\\|-]+/)) {
    const term = raw.trim();
    if (term.length >= 2) terms.add(term);
  }

  for (const [canonical, variants] of Object.entries(SYNONYMS)) {
    if (variants.some((variant) => normalized.includes(variant.toLowerCase()))) {
      terms.add(canonical);
      variants.forEach((variant) => terms.add(variant.toLowerCase()));
    }
  }

  ROLE_HINTS[role].forEach((term) => terms.add(term.toLowerCase()));
  return [...terms];
}

function scoreDocument(document: PortfolioDocument, question: string, terms: string[]): number {
  const haystack = document.searchText;
  const normalizedQuestion = normalize(question);
  let score = 0;

  for (const term of terms) {
    if (!term) continue;
    const lower = term.toLowerCase();
    if (haystack.includes(lower)) score += lower.length >= 4 ? 7 : 4;
    if (document.title.toLowerCase().includes(lower)) score += 8;
    if (document.section.toLowerCase().includes(lower)) score += 5;
  }

  for (const alias of PROJECT_ALIASES[document.projectSlug] ?? []) {
    if (normalizedQuestion.includes(normalize(alias))) score += 18;
  }

  if (document.section.includes("架构") && /架构|技术|实现|工作流|节点|api|代码/i.test(question)) score += 9;
  if (document.section.includes("决策") && /决策|取舍|为什么|产品|业务/i.test(question)) score += 9;
  if (document.section.includes("成果") && /证据|验证|结果|指标|评测|状态/i.test(question)) score += 9;
  if (document.section.includes("贡献") && /负责|贡献|角色|团队|本人|个人/i.test(question)) score += 9;
  if (document.projectSlug === "experience" && /经历|工作|教育|tplink|tp-link|背景|简历/i.test(question)) score += 16;

  return score;
}

const FOLLOW_UP_PRONOUNS = ["它", "它的", "它用", "它是", "它有", "这个", "那个", "这", "那", "其", "该"];

function isPronounFollowUp(message: string): boolean {
  const trimmed = message.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length <= 24) {
    return FOLLOW_UP_PRONOUNS.some((pronoun) => trimmed.includes(pronoun));
  }
  return FOLLOW_UP_PRONOUNS.some((pronoun) => trimmed.startsWith(pronoun));
}

function lastUserMessage(history: GuideHistoryMessage[] | undefined): string | undefined {
  if (!history || history.length === 0) return undefined;
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index].role === "user") return history[index].content;
  }
  return undefined;
}

export function resolveSearchQuery(
  message: string,
  history: GuideHistoryMessage[] | undefined,
): string {
  if (!history || history.length === 0) return message;
  if (!isPronounFollowUp(message)) return message;
  const lastUser = lastUserMessage(history);
  if (!lastUser) return message;
  return `${lastUser} ${message}`;
}

export function retrievePortfolioSources(
  question: string,
  role: GuideRole,
  limit = 8,
  history?: GuideHistoryMessage[],
): PortfolioSource[] {
  const searchQuery = resolveSearchQuery(question, history);
  const terms = queryTerms(searchQuery, role);
  const broadProjectQuestion = BROAD_PROJECT_TERMS.some((term) => searchQuery.toLowerCase().includes(term));
  const crossProject = CROSS_PROJECT_TERMS.some((term) => searchQuery.toLowerCase().includes(term));

  if (broadProjectQuestion) {
    return projects.map((project) => {
      const overview = portfolioDocuments.find(
        (document) => document.projectSlug === project.slug && document.section === "项目概览",
      );
      return {
        evidenceId: overview?.evidenceId ?? `${project.slug}:overview`,
        projectSlug: project.slug,
        title: project.title,
        status: project.status,
        href: `/projects/${project.slug}`,
        section: "项目概览",
        excerpt: overview?.excerpt ?? project.summary,
        score: overview ? scoreDocument(overview, searchQuery, terms) : 0,
      };
    });
  }

  const normalizedQuestion = searchQuery.toLowerCase();
  const explicitProjectSlugs = Object.entries(PROJECT_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => normalizedQuestion.includes(alias.toLowerCase())))
    .map(([slug]) => slug);

  const candidateDocuments = explicitProjectSlugs.length > 0
    ? portfolioDocuments.filter((document) => explicitProjectSlugs.includes(document.projectSlug))
    : portfolioDocuments;

  const ranked = candidateDocuments
    .map((document) => ({ ...document, score: scoreDocument(document, searchQuery, terms) }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "zh-CN"));

  const selected: PortfolioSource[] = [];
  const sectionKeys = new Set<string>();
  const projectCounts = new Map<string, number>();
  const maxScore = ranked[0]?.score ?? 0;
  const minimumRelevantScore = Math.max(5, Math.floor(maxScore * 0.25));

  for (const document of ranked) {
    if (selected.length >= limit) break;
    if (selected.length >= 4 && document.score < minimumRelevantScore) break;

    const key = `${document.projectSlug}:${document.section}`;
    if (sectionKeys.has(key)) continue;

    const count = projectCounts.get(document.projectSlug) ?? 0;
    const maxPerProject = explicitProjectSlugs.length > 1 ? 2 : crossProject ? 1 : 4;
    if (count >= maxPerProject) continue;

    selected.push({
      evidenceId: document.evidenceId,
      projectSlug: document.projectSlug,
      title: document.title,
      status: document.status,
      href: document.href,
      section: document.section,
      excerpt: document.excerpt,
      score: document.score,
    });
    sectionKeys.add(key);
    projectCounts.set(document.projectSlug, count + 1);
  }

  if (crossProject && explicitProjectSlugs.length === 0) {
    const represented = new Set(selected.map((item) => item.projectSlug));
    for (const project of projects) {
      if (selected.length >= Math.max(limit, projects.length)) break;
      if (represented.has(project.slug)) continue;
      const overview = portfolioDocuments.find(
        (document) => document.projectSlug === project.slug && document.section === "项目概览",
      );
      if (!overview) continue;
      selected.push({
        evidenceId: overview.evidenceId,
        projectSlug: overview.projectSlug,
        title: overview.title,
        status: overview.status,
        href: overview.href,
        section: overview.section,
        excerpt: overview.excerpt,
        score: 1,
      });
      represented.add(project.slug);
    }
  }

  if (selected.length === 0) {
    return projects.slice(0, 3).map((project) => ({
      evidenceId: `${project.slug}:overview`,
      projectSlug: project.slug,
      title: project.title,
      status: project.status,
      href: `/projects/${project.slug}`,
      section: "项目概览",
      excerpt: project.summary,
      score: 0,
    }));
  }

  return selected;
}

export function contextForSources(sources: PortfolioSource[]): string {
  const sourceIds = new Set(sources.map((source) => source.evidenceId));
  return portfolioDocuments
    .filter((document) => sourceIds.has(document.evidenceId))
    .map(
      (document, index) =>
        `【证据 ${index + 1}｜${document.title}｜${document.section}｜${document.evidenceId}｜公开证据 ${document.evidenceIds.join("、")}】\n${document.content.slice(0, 1800)}`,
    )
    .join("\n\n");
}

export function roleInstruction(role: GuideRole): string {
  const instructions: Record<GuideRole, string> = {
    recruiter:
      "以招聘官视角优先回答岗位匹配、职责边界、真实交付、可验证成果和职业迁移能力。不要只堆技术名词。",
    "product-lead":
      "以产品负责人视角优先回答业务问题、产品判断、方案取舍、失败成本、迭代顺序和数据闭环。",
    technical:
      "以技术面试官视角优先回答系统架构、数据流、模型与确定性逻辑的分工、可靠性机制、测试证据及未完成边界。",
  };
  return instructions[role];
}

export function staticPortfolioAnswer(
  question: string,
  role: GuideRole,
  sources: PortfolioSource[],
  history?: GuideHistoryMessage[],
): string {
  // Deduplicate by project slug: each project appears at most once in the offline answer.
  // This prevents "微信公众号 AI 客服机器人" from appearing 3+ times when retrieval
  // returns multiple sections (overview, decisions, architecture, evidence) for the same project.
  const seenProjects = new Set<string>();
  const dedupedSources = sources.filter((source) => {
    if (seenProjects.has(source.projectSlug)) return false;
    seenProjects.add(source.projectSlug);
    return true;
  });
  const top = dedupedSources.slice(0, 4);
  const searchQuery = resolveSearchQuery(question, history);
  const crossProject = CROSS_PROJECT_TERMS.some((term) => searchQuery.toLowerCase().includes(term));

  const conclusion = crossProject
    ? "结论：这份作品集以三个旗舰案例集中证明核心能力，并由其余公开案例补充通道、增长、用户产品、数据摄入和模型训练等支撑能力。"
    : `结论：与这个问题最相关的是${top
        .slice(0, 3)
        .map((source) => `「${source.title}」`)
        .join("、")}。`;

  const evidence = top
    .map(
      (source, index) =>
        `${index + 1}. ${source.title}｜${source.section}\n${source.excerpt}\n当前状态：${source.status}`,
    )
    .join("\n\n");

  const roleTail: Record<GuideRole, string> = {
    recruiter: "岗位判断建议：重点核对他是否能把业务问题转成产品边界，并用证据说明本人负责范围和交付状态。",
    "product-lead": "产品判断建议：重点看决策顺序、自动化边界、人工质量闸门和数据回流，而不是只看功能数量。",
    technical: "技术判断建议：重点看模型与确定性规则如何分工、失败时如何降级，以及测试数字是否被正确解释。",
  };

  return `${conclusion}\n\n关键证据\n${evidence}\n\n能力边界\n以上内容来自公开项目资料。历史基线、Controlled Demo、进行中能力和已验证能力必须分开理解；没有证据支持的准确率、生产效果或业务指标不会被补写。\n\n${roleTail[role]}`;
}
