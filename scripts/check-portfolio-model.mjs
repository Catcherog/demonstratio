#!/usr/bin/env node

// Supplier-neutral model integration check.
// Verifies the portfolio AI guide uses provider-neutral configuration
// (PORTFOLIO_AI_*) with Volcengine Ark as the default provider,
// not hardcoded 智谱 official direct connection.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const passes = [];

function read(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) {
    failures.push(`缺少文件：${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolute, "utf8");
}

function check(condition, label) {
  if (condition) passes.push(label);
  else failures.push(label);
}

const route = read("app/api/portfolio-guide/route.ts");
const config = read("lib/portfolio-ai/config.ts");
const errors = read("lib/portfolio-ai/errors.ts");
const provider = read("lib/portfolio-ai/providers/volcengine-ark.ts");
const envExample = read(".env.example");
const packageText = read("package.json");
const guide = read("lib/portfolio-guide.ts");

let packageJson = {};
try {
  packageJson = JSON.parse(packageText);
} catch {
  failures.push("package.json 不是有效 JSON");
}

// --- Configuration: provider-neutral variables ---
check(
  config.includes("PORTFOLIO_AI_API_KEY") && !config.includes("process.env.ZHIPU_API_KEY?.trim() || undefined"),
  "config 应以 PORTFOLIO_AI_API_KEY 为权威变量（不应仅依赖 ZHIPU_API_KEY）",
);
check(
  config.includes("PORTFOLIO_AI_API_KEY?.trim()") && config.includes("ZHIPU_API_KEY?.trim()"),
  "config 应兼容旧变量 ZHIPU_API_KEY",
);
check(
  config.includes("GLM_API_KEY?.trim()"),
  "config 应兼容旧变量 GLM_API_KEY",
);
check(
  config.includes("PORTFOLIO_AI_BASE_URL?.trim()") && config.includes("ZHIPU_BASE_URL?.trim()"),
  "config 应以 PORTFOLIO_AI_BASE_URL 为主，兼容 ZHIPU_BASE_URL",
);
check(
  config.includes("ark.cn-beijing.volces.com/api/coding/v3"),
  "config 默认 Base URL 应为火山方舟 Coding Plan 端点",
);
check(
  !config.includes('DEFAULT_ZHIPU_BASE_URL = "https://open.bigmodel.cn'),
  "config 不应硬编码智谱官方 Base URL 作为默认值",
);
check(
  config.includes("PORTFOLIO_AI_PROVIDER") && config.includes("volcengine-ark"),
  "config 应支持 PORTFOLIO_AI_PROVIDER 并默认 volcengine-ark",
);

// --- Error classification ---
check(
  errors.includes("API_KEY_MISSING") &&
    errors.includes("UPSTREAM_UNAUTHORIZED") &&
    errors.includes("UPSTREAM_FORBIDDEN") &&
    errors.includes("MODEL_NOT_FOUND") &&
    errors.includes("UPSTREAM_RATE_LIMITED") &&
    errors.includes("UPSTREAM_TIMEOUT") &&
    errors.includes("UPSTREAM_ABORTED") &&
    errors.includes("UPSTREAM_INVALID_RESPONSE") &&
    errors.includes("UPSTREAM_UNKNOWN"),
  "errors 应定义全部 9 类错误码",
);
check(
  errors.includes("classifyHttpError") && errors.includes("case 401") && errors.includes("case 403") && errors.includes("case 404") && errors.includes("case 429"),
  "errors 应将 HTTP 状态码映射到对应错误码",
);
check(
  errors.includes("redactSecrets") && errors.includes("Bearer [redacted]"),
  "errors 应脱敏 Bearer Token",
);
check(
  errors.includes("fallbackNote") && errors.includes("实时模型尚未配置") === false,
  "fallbackNote 不应将上游失败归因为'尚未配置'",
);
check(
  errors.includes("实时模型服务暂不可用") || errors.includes("请求较多"),
  "errors 应提供区分性的用户文案",
);

// --- Adapter: Volcengine Ark OpenAI-compatible ---
check(
  provider.includes("callVolcengineArk") && provider.includes("/chat/completions"),
  "provider 应调用 /chat/completions 端点",
);
check(
  provider.includes("Authorization: `Bearer ${options.apiKey}`"),
  "provider 应使用 Bearer Token 认证",
);
check(
  provider.includes("stream: true") && provider.includes("text/event-stream"),
  "provider 应请求流式 SSE 响应",
);
check(
  provider.includes("[DONE]"),
  "provider 应正确处理 SSE 结束标记",
);
check(
  provider.includes("classifyHttpError") || provider.includes("classifyError"),
  "provider 应对错误进行分类",
);
check(
  !provider.includes("open.bigmodel.cn"),
  "provider 不应硬编码智谱官方域名",
);

// --- Route: uses new modules ---
check(
  route.includes("@/lib/portfolio-ai/config") && route.includes("resolveConfig"),
  "route 应从 config 模块导入 resolveConfig",
);
check(
  route.includes("@/lib/portfolio-ai/providers/volcengine-ark") && route.includes("callVolcengineArk"),
  "route 应使用 callVolcengineArk 适配器",
);
check(
  route.includes("@/lib/portfolio-ai/errors") && route.includes("fallbackNote"),
  "route 应使用 errors 模块的 fallbackNote",
);
check(
  !route.includes("DEFAULT_ZHIPU_BASE_URL"),
  "route 不应包含智谱专属常量",
);
check(
  !route.includes("zhipuApiKey") && !route.includes("zhipuBaseURL"),
  "route 不应包含智谱专属函数名",
);
check(
  !route.includes("open.bigmodel.cn"),
  "route 不应硬编码智谱官方域名",
);
check(
  route.includes("logProviderEvent"),
  "route 应使用结构化日志函数",
);
check(
  route.includes("errorCode") && route.includes("httpStatus") && route.includes("requestId"),
  "route 日志应包含错误码、HTTP 状态和 Request ID",
);
check(
  !route.includes("console.warn(`[portfolio-guide] ZHIPU_API_KEY"),
  "route 不应继续使用'ZHIPU_API_KEY is not configured'日志",
);

// --- Offline dedup ---
check(
  guide.includes("seenProjects") && guide.includes("projectSlug"),
  "staticPortfolioAnswer 应按 projectSlug 去重",
);

// --- .env.example ---
check(
  envExample.includes("PORTFOLIO_AI_API_KEY="),
  ".env.example 应声明 PORTFOLIO_AI_API_KEY",
);
check(
  envExample.includes("PORTFOLIO_AI_BASE_URL="),
  ".env.example 应声明 PORTFOLIO_AI_BASE_URL",
);
check(
  envExample.includes("PORTFOLIO_AI_PROVIDER="),
  ".env.example 应声明 PORTFOLIO_AI_PROVIDER",
);
check(
  envExample.includes("ark.cn-beijing.volces.com/api/coding/v3"),
  ".env.example 默认 Base URL 应为火山方舟端点",
);
check(
  !envExample.includes("https://open.bigmodel.cn"),
  ".env.example 不应引导使用智谱官方端点",
);
check(
  !envExample.includes("NEXT_PUBLIC_ZHIPU_API_KEY") && !envExample.includes("NEXT_PUBLIC_PORTFOLIO_AI_API_KEY"),
  ".env.example 不应使用 NEXT_PUBLIC_ 前缀",
);

// --- package.json scripts ---
check(
  Boolean(packageJson.scripts?.["check:portfolio-model"]),
  "package.json 应包含 check:portfolio-model 脚本",
);
check(
  packageJson.scripts?.["check:portfolio-glm"] === "node scripts/check-portfolio-model.mjs",
  "check:portfolio-glm 应重定向到 check-portfolio-model.mjs",
);
check(
  !packageJson.dependencies?.["@ai-sdk/openai-compatible"],
  "package.json 不应增加兼容 Provider 依赖",
);

console.log(`PASS ${passes.length}`);
for (const item of passes) console.log(`  ✓ ${item}`);

if (failures.length > 0) {
  console.error(`\nFAIL ${failures.length}`);
  for (const item of failures) console.error(`  ✗ ${item}`);
  process.exitCode = 1;
} else {
  console.log("\nPORTFOLIO_MODEL_NEUTRAL_R1 CHECK PASS");
}
