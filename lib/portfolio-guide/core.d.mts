import type { GuideRequest, PortfolioEvidence } from "@/content/portfolio-evidence";

export type ValidationResult =
  | { ok: true; value: GuideRequest & { history: NonNullable<GuideRequest["history"]> } }
  | { ok: false; error: { code: "INVALID_INPUT"; message: string } };

export function validateGuideRequest(input: unknown): ValidationResult;
export function classifyMessage(message: string): "portfolio" | "injection" | "out-of-scope";
export function filterGuideEvidence(items: PortfolioEvidence[]): PortfolioEvidence[];
export function getRenderableEvidence(items: PortfolioEvidence[], environment?: "production" | "preview" | "development"): PortfolioEvidence[];
export function retrieveEvidence(request: Pick<GuideRequest, "role" | "message">, items: PortfolioEvidence[], limit?: number): PortfolioEvidence[];
export function buildGuidedAnswer(request: Pick<GuideRequest, "role" | "message">, sources: PortfolioEvidence[]): string;
export function resolveGuideResponse(
  request: Pick<GuideRequest, "role" | "message">,
  items: PortfolioEvidence[],
  upstream?: (context: { request: Pick<GuideRequest, "role" | "message">; sources: PortfolioEvidence[] }) => Promise<string>,
): Promise<{ mode: "live" | "guided"; text: string; sources: PortfolioEvidence[] }>;
export function createRateLimiter(options?: { limit?: number; windowMs?: number }): { check(key: string, now?: number): { allowed: boolean; remaining: number } };
