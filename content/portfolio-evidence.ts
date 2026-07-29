import type { Project } from "./projects";
import { getProject } from "./projects";

export type EvidenceKind = "image" | "video" | "interactive" | "architecture" | "test" | "document";
export type EvidenceState = "available" | "mock" | "unavailable";
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
  assetUrl?: string;
  thumbnailUrl?: string;
  href?: string;
  verifiedAt?: string;
  chapters?: Array<{ label: string; seconds: number }>;
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

function currentEvidenceRefs(project: Project) {
  const refs = [
    ...(project.evidenceLinks ?? []).map((item) => item.ref),
    ...project.metrics.map((item) => item.evidenceRef).filter((item): item is string => Boolean(item)),
  ];
  return [...new Set(refs)];
}

function buildEvidence(
  project: Project,
  item: Omit<PortfolioEvidence, "projectSlug" | "status" | "evidenceRefs" | "verifiedAt">,
): PortfolioEvidence {
  return {
    ...item,
    projectSlug: project.slug,
    status: project.status,
    evidenceRefs: currentEvidenceRefs(project),
    verifiedAt: project.lastVerifiedAt,
  };
}

const dataPlatform = requiredProject("data-platform");
const serviceAgent = requiredProject("service-agent");
const lumenInk = requiredProject("lumen-ink");

export const portfolioEvidence: PortfolioEvidence[] = [
  buildEvidence(dataPlatform, {
    id: "data-platform-governance",
    kind: "architecture",
    title: "飞书平台的治理与写入边界",
    summary: dataPlatform.decisions[0],
    state: "available",
    publicSafe: true,
    assetUrl: dataPlatform.images[0],
    tags: ["飞书", "数据", "治理", "幂等", "审计", "交付"],
    roleWeights: { recruiter: 5, "product-lead": 8, technical: 7 },
  }),
  buildEvidence(dataPlatform, {
    id: "data-platform-e2e",
    kind: "test",
    title: "真实测试 Base E2E 证据",
    summary: dataPlatform.outcomes[0],
    state: "available",
    publicSafe: true,
    assetUrl: dataPlatform.images[1] ?? dataPlatform.images[0],
    tags: ["飞书", "e2e", "测试", "清理", "证据"],
    roleWeights: { recruiter: 7, "product-lead": 7, technical: 6 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-workflow",
    kind: "architecture",
    title: "风险优先的 Agent 工作流",
    summary: serviceAgent.decisions[0],
    state: "available",
    publicSafe: true,
    assetUrl: serviceAgent.images[0],
    tags: ["agent", "langgraph", "风险", "人工接管", "架构"],
    roleWeights: { recruiter: 4, "product-lead": 6, technical: 9 },
  }),
  buildEvidence(serviceAgent, {
    id: "service-agent-regression",
    kind: "test",
    title: "Service Agent 回归与公开边界",
    summary: serviceAgent.outcomes[0],
    state: "available",
    publicSafe: true,
    assetUrl: serviceAgent.images[1] ?? serviceAgent.images[0],
    tags: ["agent", "pytest", "回归", "fail-closed", "证据"],
    roleWeights: { recruiter: 7, "product-lead": 6, technical: 8 },
  }),
  buildEvidence(serviceAgent, {
    id: "portfolio-guide-readonly",
    kind: "interactive",
    title: "只读作品集导览",
    summary: "从公开项目证据中检索并回答问题；不执行外部写入，也不替招聘方作判断。",
    state: "available",
    publicSafe: true,
    href: "/#portfolio-guide",
    tags: ["agent", "导览", "体验", "公开证据"],
    roleWeights: { recruiter: 8, "product-lead": 6, technical: 5 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-workbench",
    kind: "image",
    title: "光砚 AI 图像编辑工作台",
    summary: lumenInk.summary,
    state: "available",
    publicSafe: true,
    assetUrl: lumenInk.images[0],
    tags: ["光砚", "图像", "多模型", "工作台", "体验"],
    roleWeights: { recruiter: 9, "product-lead": 7, technical: 4 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-provider-boundary",
    kind: "architecture",
    title: "Provider 抽象与当前验证边界",
    summary: lumenInk.decisions[0],
    state: "available",
    publicSafe: true,
    assetUrl: lumenInk.images[1] ?? lumenInk.images[0],
    tags: ["光砚", "provider", "架构", "失败恢复", "边界"],
    roleWeights: { recruiter: 4, "product-lead": 6, technical: 9 },
  }),
  buildEvidence(lumenInk, {
    id: "lumen-walkthrough-mock",
    kind: "video",
    title: "光砚操作 Walkthrough",
    summary: "待补充从新建任务、参数调整、生成结果到版本回看的完整操作视频。",
    state: "mock",
    publicSafe: false,
    thumbnailUrl: lumenInk.images[1] ?? lumenInk.images[0],
    chapters: [{ label: "建立任务", seconds: 0 }, { label: "生成与编辑", seconds: 18 }, { label: "版本回看", seconds: 52 }],
    tags: ["光砚", "视频", "体验"],
    roleWeights: { recruiter: 5, "product-lead": 4, technical: 2 },
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
