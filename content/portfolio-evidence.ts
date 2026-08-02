import type { Project } from "./projects";
import { getProject } from "./projects";

export type EvidenceKind = "image" | "video" | "interactive" | "architecture" | "test" | "document";
export type EvidenceState = "available" | "planned" | "unavailable";
export type GuideRole = "recruiter" | "product-lead" | "technical";

export interface PortfolioEvidence {
  id: string;
  projectSlug: string;
  kind: EvidenceKind;
  title: string;
  summary: string;
  state: EvidenceState;
  publicSafe: boolean;
  evidenceRefs: string[];
  status: string;
  scope: string;
  boundary: string;
  assetUrl?: string;
  thumbnailUrl?: string;
  href?: string;
  fallbackHref?: string;
  verifiedAt?: string;
  durationSeconds?: number;
  chapters?: Array<{ label: string; seconds: number }>;
  transcript?: string;
  tags?: string[];
  roleWeights?: Record<GuideRole, number>;
}

export interface GuideRequest {
  role: GuideRole;
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export type GuideEvent =
  | { type: "meta"; mode: "live" | "guided"; requestId: string }
  | { type: "delta"; text: string }
  | { type: "sources"; items: Array<{ evidenceId: string; title: string; projectSlug: string; href: string; status: string }> }
  | { type: "done" }
  | { type: "error"; code: "INVALID_INPUT" | "OUT_OF_SCOPE" | "UPSTREAM_UNAVAILABLE"; message: string };

function requiredProject(slug: string) {
  const project = getProject(slug);
  if (!project) throw new Error(`Missing project: ${slug}`);
  return project;
}

export function buildEvidence(
  project: Project,
  item: Omit<PortfolioEvidence, "projectSlug" | "status" | "verifiedAt"> & { verifiedAt?: string },
): PortfolioEvidence {
  if (item.state === "available" && item.evidenceRefs.length === 0) {
    throw new Error(`Available evidence requires an authority reference: ${item.id}`);
  }
  if (item.state === "planned" && (item.href || item.assetUrl)) {
    throw new Error(`Planned evidence cannot expose a live primary control: ${item.id}`);
  }
  if (!item.publicSafe && item.state !== "unavailable") {
    throw new Error(`Non-public evidence must not enter the renderable catalog: ${item.id}`);
  }
  return {
    ...item,
    projectSlug: project.slug,
    status: project.status,
    verifiedAt: item.verifiedAt ?? project.lastVerifiedAt,
  };
}

const dataPlatform = requiredProject("data-platform");
const serviceAgent = requiredProject("service-agent");
const lumenInk = requiredProject("lumen-ink");

export const portfolioEvidence: PortfolioEvidence[] = [
  buildEvidence(dataPlatform, {
    id: "data-platform-closed-loop",
    kind: "architecture",
    title: "摄入、治理与运营视图闭环",
    summary: "公开安全的解释性架构图，展示来源进入候选数据、通过治理门并进入运营视图的路径。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-FEISHU-SOURCES", "E-FEISHU-PILOT-TESTS"],
    scope: "Sources → Ingest → Govern → Operational views",
    boundary: "架构图不是生产截图；正式业务写入仍保持 fail-closed。",
    assetUrl: "/evidence/data-platform/closed-loop.svg",
    tags: ["飞书", "数据", "摄入", "治理", "审计", "架构"],
    roleWeights: { recruiter: 6, "product-lead": 9, technical: 7 },
  }),
  buildEvidence(dataPlatform, {
    id: "data-platform-schema-verification",
    kind: "document",
    title: "生产 V2 Schema 只读核验",
    summary: "生产表集合已完成只读比对；当前证据只支持表级匹配，不支持字段级兼容或正式写入结论。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-FEISHU-SCHEMA", "E-FEISHU-LIVE-SCHEMA"],
    scope: "生产 Schema 元数据只读检查",
    boundary: "字段级差异待完成，Pilot 写入未启用；不公开 Base 或 table 标识符。",
    tags: ["飞书", "schema", "生产只读", "边界", "证据"],
    roleWeights: { recruiter: 7, "product-lead": 8, technical: 8 },
  }),
  buildEvidence(dataPlatform, {
    id: "data-platform-e2e-verification",
    kind: "test",
    title: "Test Base E2E 与精确清理",
    summary: "候选确认、SOP Gate、写入、幂等、审计和按 record ID 清理构成可回收的测试链路。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
    scope: "真实测试 Base 的摄入到清理链路",
    boundary: "测试通过说明链路可控，不代表生产业务 Pilot 已运行。",
    tags: ["飞书", "e2e", "测试", "幂等", "清理"],
    roleWeights: { recruiter: 8, "product-lead": 8, technical: 7 },
  }),
  buildEvidence(dataPlatform, {
    id: "data-platform-portal-entry",
    kind: "interactive",
    title: "数据平台公开入口",
    summary: "计划提供不含真实客户数据、只展示角色化运营视图的公开安全入口。",
    state: "planned",
    publicSafe: true,
    evidenceRefs: ["E-FEISHU-SOURCES"],
    scope: "公开安全的只读产品入口",
    boundary: "待补素材；当前不提供可点击入口，也不连接生产业务数据。",
    tags: ["飞书", "入口", "体验", "planned"],
    roleWeights: { recruiter: 6, "product-lead": 6, technical: 3 },
  }),
  buildEvidence(dataPlatform, {
    id: "data-platform-walkthrough",
    kind: "video",
    title: "数据平台业务闭环 Walkthrough",
    summary: "计划录制从来源摄入、人工确认、SOP Gate 到运营视图的完整演示。",
    state: "planned",
    publicSafe: true,
    evidenceRefs: ["E-FEISHU-PILOT-TESTS"],
    scope: "摄入与治理流程说明",
    boundary: "待补素材；未录制前不显示播放器或播放按钮。",
    transcript: "计划内容：来源进入候选记录，人工确认，治理 Gate，Test Base 写入与精确清理。",
    tags: ["飞书", "视频", "walkthrough", "planned"],
    roleWeights: { recruiter: 5, "product-lead": 5, technical: 3 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-risk-workflow",
    kind: "architecture",
    title: "风险优先的 Agent 工作流",
    summary: "展示输入、风险判断、查询解析、检索、支持度检查和人工接管的公开安全架构。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-SCS-SOURCE", "E-SCS-DEPLOY-039"],
    scope: "LangGraph 工作流与 fail-closed 路径",
    boundary: "架构图不等同于线上质量分数；安全结论仍为 provisional。",
    assetUrl: "/evidence/service-agent/risk-workflow.svg",
    tags: ["agent", "langgraph", "风险", "检索", "人工接管", "架构"],
    roleWeights: { recruiter: 6, "product-lead": 8, technical: 10 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-phase-g-summary",
    kind: "test",
    title: "Deploy 039 Phase G 验证摘要",
    summary: "后端完成多轮查询、证据支持度和高风险人工接管验证，并登记后续可用性、性能与知识覆盖债务。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-SCS-TESTS", "E-SCS-DEPLOY-039"],
    scope: "后端功能与安全回归",
    boundary: "工程回归和 Phase G 验证不等于线上回答准确率或生产 SLO。",
    tags: ["agent", "phase g", "回归", "安全", "证据"],
    roleWeights: { recruiter: 8, "product-lead": 8, technical: 9 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-controlled-demo",
    kind: "interactive",
    title: "B1 / B2 / B3 受控演示（备用模式）",
    summary: "公开前端提供三个静态场景与可解释降级，作为后端异常时的备用演示模式。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-SCS-PRODUCTION"],
    scope: "公开前端的静态受控体验（备用模式）",
    boundary: "Live 模式已启用，静态降级仅在 NEXT_PUBLIC_DEMO_STATUS≠live 时显示。",
    href: "https://zehuai-customer-demo.vercel.app/controlled",
    tags: ["agent", "demo", "b1", "b2", "b3", "体验"],
    roleWeights: { recruiter: 6, "product-lead": 5, technical: 4 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-live-frontend",
    kind: "interactive",
    title: "公网实时 Demo（已接入真实后端）",
    summary: "公开前端已切换到 CloudBase Deploy 039 后端，支持知识检索、多轮追问、来源展示与安全转人工。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-SCS-PRODUCTION", "E-SCS-DEPLOY-039"],
    scope: "公开前端到 Deploy 039 的实时 API",
    boundary: "安全仍为 provisional；高风险、低置信度及知识不足的问题 fail-closed 转人工。",
    href: "https://zehuai-customer-demo.vercel.app/",
    tags: ["agent", "frontend", "cloudbase", "live", "rag", "handoff"],
    roleWeights: { recruiter: 9, "product-lead": 8, technical: 9 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-live-demo-01",
    kind: "video",
    title: "真实演示｜知识问答与多轮承接",
    summary: "真实录屏展示用户从首轮咨询进入连续追问，Agent 保留会话上下文并呈现实际回复结果。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-SCS-PRODUCTION"],
    scope: "公网 Demo 的真实问答与多轮交互路径",
    boundary: "录屏用于证明真实交互过程，不代表所有问题均可自动回答，也不等同于线上准确率或生产 SLO。",
    assetUrl: "/evidence/service-agent/live-demo-01.mp4",
    thumbnailUrl: "/evidence/service-agent/live-demo-01.webp",
    verifiedAt: "2026-08-03",
    transcript: "真实演示录屏：用户输入、连续追问、Agent 实际回复及页面可见状态。具体交互以视频画面为准。",
    tags: ["agent", "视频", "真实演示", "多轮", "上下文"],
    roleWeights: { recruiter: 9, "product-lead": 8, technical: 7 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-live-demo-02",
    kind: "video",
    title: "真实演示｜LangGraph 运行追踪与可视化",
    summary: "真实录屏展示 LangGraph 监控面板中 customer-service-bot 的图结构、节点状态与输入输出属性，呈现 Agent 运行时的可观测形态。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-SCS-PRODUCTION"],
    scope: "公网 Demo 的运行追踪与 LangGraph 可视化界面",
    boundary: "录屏展示监控面板视图，不代表全部节点均已验证，也不等同于生产级可观测能力。",
    assetUrl: "/evidence/service-agent/live-demo-02.mp4",
    thumbnailUrl: "/evidence/service-agent/live-demo-02.webp",
    verifiedAt: "2026-08-03",
    transcript: "真实演示录屏：LangGraph 监控面板中的图结构、节点反馈与输入输出属性。具体界面以视频画面为准。",
    tags: ["agent", "视频", "真实演示", "LangGraph", "trace", "可视化"],
    roleWeights: { recruiter: 7, "product-lead": 8, technical: 9 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-workbench",
    kind: "image",
    title: "光砚 AI 图像编辑工作台",
    summary: "公开产品界面展示画布、工具参数、结构化指令和结果复核的工作台形态。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-EDIT"],
    scope: "工作台产品形态与已验证编辑路径",
    boundary: "界面出现的工具不代表全部已验证；当前仅文生图和图生图完成真实验证。",
    assetUrl: "/projects/lumen-ink/01.webp",
    tags: ["光砚", "图像", "工作台", "seedream", "体验"],
    roleWeights: { recruiter: 10, "product-lead": 8, technical: 5 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-provider-boundary",
    kind: "architecture",
    title: "Provider 与任务边界",
    summary: "公开安全的架构图展示工作台、任务状态、Provider 适配和结果历史之间的职责分离。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-EDIT"],
    scope: "Workbench → Task → Provider adapter → Result/history",
    boundary: "图示区分已验证路径和未验证编辑模式，不代表所有 Provider 均完成同等验证。",
    assetUrl: "/evidence/lumen/provider-boundary.svg",
    tags: ["光砚", "provider", "任务", "架构", "恢复"],
    roleWeights: { recruiter: 5, "product-lead": 7, technical: 10 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-edit-verification",
    kind: "test",
    title: "Seedream 4.5 真实编辑验证",
    summary: "统一编辑接口已用真实 Provider 完成文生图与图生图验证，并检查响应与密钥边界。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-LUMEN-EDIT"],
    scope: "Seedream 4.5 文生图与图生图",
    boundary: "液化、修复、消除和其他模式仍未验证；不由本次结果外推。",
    tags: ["光砚", "seedream", "验证", "文生图", "图生图"],
    roleWeights: { recruiter: 8, "product-lead": 8, technical: 9 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-live-entry",
    kind: "interactive",
    title: "打开光砚 Live Demo",
    summary: "公开入口用于体验工作台和已验证的真实 Provider 编辑路径。",
    state: "available",
    publicSafe: true,
    evidenceRefs: ["E-LUMEN-PRODUCTION", "E-LUMEN-EDIT"],
    scope: "公开工作台与真实 Provider 编辑",
    boundary: "仅两项操作完成验证；其他工具状态以页面内边界说明为准。",
    href: "https://lumen-ink.vercel.app/",
    tags: ["光砚", "live demo", "体验", "provider"],
    roleWeights: { recruiter: 10, "product-lead": 8, technical: 6 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-walkthrough",
    kind: "video",
    title: "光砚任务与结果回看 Walkthrough",
    summary: "计划录制建立任务、调用 Provider、复核结果和回到历史记录的完整操作。",
    state: "planned",
    publicSafe: true,
    evidenceRefs: ["E-LUMEN-SOURCE", "E-LUMEN-EDIT"],
    scope: "真实编辑任务工作流说明",
    boundary: "待补素材；未录制前不显示播放器或播放按钮。",
    transcript: "计划内容：建立任务、结构化提示、Provider 调用、结果复核与任务历史。",
    tags: ["光砚", "视频", "任务", "历史", "planned"],
    roleWeights: { recruiter: 6, "product-lead": 5, technical: 3 },
  }),
];

export const evidenceByProject = portfolioEvidence.reduce<Record<string, PortfolioEvidence[]>>((groups, item) => {
  (groups[item.projectSlug] ??= []).push(item);
  return groups;
}, {});

export function getEvidenceEnvironment(): "production" | "preview" | "development" {
  if (process.env.VERCEL_ENV === "preview") return "preview";
  if (process.env.NODE_ENV === "production") return "production";
  return "development";
}
