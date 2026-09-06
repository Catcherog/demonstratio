export type PublicDemoMode = "fallback" | "controlled";

export type PublicStatusSlug = "data-platform" | "service-agent" | "lumen-ink";

export type PublicProjectStatus = {
  label: string;
  mode: PublicDemoMode;
  primaryEvidenceId: string;
  boundary: string;
  secondaryLabel: string;
};

export const publicProjectStatuses = {
  "data-platform": {
    label: "Controlled Pilot｜测试 Base E2E + 生产 Schema 只读核验",
    mode: "controlled",
    primaryEvidenceId: "data-platform-e2e-verification",
    boundary: "测试 Base 链路已验证；生产只支持表级 Schema 只读匹配，字段差异和正式业务写入仍保持关闭。",
    secondaryLabel: "公开 Portal 作为产品形态补充",
  },
  "service-agent": {
    label: "Fallback-first｜真实录屏 + 受控 Agent 演示",
    mode: "fallback",
    primaryEvidenceId: "service-agent-live-demo-01",
    boundary: "录屏和受控入口优先用于面试讲解；公网前端当前可达，但 backend 与 deployment SHA 尚未复核。",
    secondaryLabel: "公网实时入口为次级路径",
  },
  "lumen-ink": {
    label: "Controlled Demo｜Seedream 4.5 两项编辑已验证",
    mode: "controlled",
    primaryEvidenceId: "lumen-edit-verification",
    boundary: "仅 Seedream 4.5 文生图与图生图完成真实验证；登录可用性和液化、修复、消除等其他模式不外推。",
    secondaryLabel: "在线工作台作为补充入口",
  },
} satisfies Record<PublicStatusSlug, PublicProjectStatus>;

export function getPublicProjectStatus(slug: string) {
  return publicProjectStatuses[slug as PublicStatusSlug];
}
