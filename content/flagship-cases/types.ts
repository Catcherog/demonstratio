export type FlagshipSlug = "data-platform" | "service-agent" | "lumen-ink";
export type DemoStatus = "live" | "fallback";

export function resolveDemoStatus(
  defaultStatus: DemoStatus,
  override = process.env.NEXT_PUBLIC_DEMO_STATUS,
): DemoStatus {
  return override === "live" || override === "fallback" ? override : defaultStatus;
}

export type CaseSectionId =
  | "overview"
  | "business"
  | "product"
  | "technical"
  | "iterations"
  | "evidence";

export interface NarrativePoint {
  title: string;
  detail: string;
  evidenceRefs: string[];
}

export interface IterationEntry {
  version: string;
  trigger: string;
  productChange: string;
  technicalChange: string;
  result: string;
  boundary: string;
  evidenceRefs: string[];
}

export interface FlagshipCaseStudy {
  slug: FlagshipSlug;
  demoStatus?: DemoStatus;
  overview: {
    oneLine: string;
    responsibility: string;
    status: string;
    boundary: string;
    claimIds: string[];
  };
  business: {
    whyBuild: string;
    signals: NarrativePoint[];
    judgments: NarrativePoint[];
    constraints: string[];
  };
  product: {
    form: string;
    users: string[];
    workflow: NarrativePoint[];
    decisions: NarrativePoint[];
    nonGoals: string[];
  };
  technical: {
    architecture: NarrativePoint[];
    mechanisms: NarrativePoint[];
    tradeoffs: NarrativePoint[];
  };
  iterations: IterationEntry[];
  evidenceIds: string[];
}
