import { dataPlatformCase } from "./data-platform";
import { lumenInkCase } from "./lumen-ink";
import { serviceAgentCase } from "./service-agent";
import type { FlagshipCaseStudy, FlagshipSlug } from "./types";

const flagshipCases = {
  "data-platform": dataPlatformCase,
  "service-agent": serviceAgentCase,
  "lumen-ink": lumenInkCase,
} satisfies Record<FlagshipSlug, FlagshipCaseStudy>;

export function getFlagshipCaseStudy(slug: string) {
  return flagshipCases[slug as FlagshipSlug];
}

export const flagshipCaseStudies = Object.values(flagshipCases);
export type { CaseSectionId, FlagshipCaseStudy, FlagshipSlug, IterationEntry, NarrativePoint } from "./types";
