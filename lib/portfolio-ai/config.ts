// Provider-neutral configuration resolution for portfolio AI.
// New variables (PORTFOLIO_AI_*) are authoritative.
// Old variables (ZHIPU_API_KEY, GLM_API_KEY, ZHIPU_BASE_URL) are compat aliases.

export type PortfolioAiConfig = {
  provider: string;
  apiKey: string | undefined;
  baseUrl: string;
  model: string;
  fallbackModels: string[];
  maxOutputTokens: number;
  temperature: number;
  timeoutMs: number;
  rateLimit: number;
  promptVersion: string;
  disabled: boolean;
};

/**
 * Default Base URL is Volcengine Ark Coding Plan endpoint.
 * The user's actual provider is 火山引擎方舟 Coding Plan, not 智谱官方直连.
 */
const DEFAULT_BASE_URL = "https://ark.cn-beijing.volces.com/api/coding/v3";
const DEFAULT_MODEL = "glm-5.2";
const DEFAULT_PROVIDER = "volcengine-ark";

function boundedInteger(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function boundedTemperature(value: string | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  if (!Number.isFinite(parsed)) return 0.2;
  return Math.min(1, Math.max(0, parsed));
}

function parseFallbackModels(): string[] {
  return (process.env.PORTFOLIO_AI_FALLBACK_MODELS ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean)
    .slice(0, 3);
}

/**
 * Resolve the API key with backward-compatible fallback.
 * Priority: PORTFOLIO_AI_API_KEY → ZHIPU_API_KEY → GLM_API_KEY
 */
export function resolveApiKey(): string | undefined {
  return (
    process.env.PORTFOLIO_AI_API_KEY?.trim() ||
    process.env.ZHIPU_API_KEY?.trim() ||
    process.env.GLM_API_KEY?.trim() ||
    undefined
  );
}

/**
 * Resolve the Base URL with backward-compatible fallback.
 * Priority: PORTFOLIO_AI_BASE_URL → ZHIPU_BASE_URL → Volcengine Ark default
 */
export function resolveBaseUrl(): string {
  const raw =
    process.env.PORTFOLIO_AI_BASE_URL?.trim() ||
    process.env.ZHIPU_BASE_URL?.trim() ||
    DEFAULT_BASE_URL;
  return raw.replace(/\/+$/, "");
}

/** Whether the API key comes from a legacy variable (for logging). */
export function isLegacyKeySource(): boolean {
  return (
    !process.env.PORTFOLIO_AI_API_KEY &&
    Boolean(process.env.ZHIPU_API_KEY || process.env.GLM_API_KEY)
  );
}

export function resolveConfig(): PortfolioAiConfig {
  return {
    provider: process.env.PORTFOLIO_AI_PROVIDER?.trim() || DEFAULT_PROVIDER,
    apiKey: resolveApiKey(),
    baseUrl: resolveBaseUrl(),
    model: process.env.PORTFOLIO_AI_MODEL?.trim() || DEFAULT_MODEL,
    fallbackModels: parseFallbackModels(),
    maxOutputTokens: boundedInteger(
      process.env.PORTFOLIO_AI_MAX_OUTPUT_TOKENS,
      1_600,
      256,
      4_096,
    ),
    temperature: boundedTemperature(process.env.PORTFOLIO_AI_TEMPERATURE),
    timeoutMs: boundedInteger(process.env.PORTFOLIO_AI_TIMEOUT_MS, 38_000, 5_000, 42_000),
    rateLimit: Math.max(1, Number.parseInt(process.env.PORTFOLIO_AI_RATE_LIMIT ?? "12", 10) || 12),
    promptVersion: process.env.PORTFOLIO_AI_PROMPT_VERSION ?? "portfolio-guide-r1",
    disabled: process.env.PORTFOLIO_AI_DISABLED === "1",
  };
}

/** Unique model candidates (primary first, then fallbacks). */
export function uniqueModels(primary: string, fallbacks: string[]): string[] {
  return [...new Set([primary, ...fallbacks])];
}
