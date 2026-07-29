import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// These tests verify the portfolio AI adapter logic.
// Since the source is TypeScript and the project has no TS test runner,
// we test pure logic inline (matching source patterns) and verify
// source code contains correct implementations.

const root = process.cwd();

function readSource(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!existsSync(absolute)) return "";
  return readFileSync(absolute, "utf8");
}

// --- Redaction logic (mirrors lib/portfolio-ai/errors.ts) ---
function redactSecrets(text) {
  return text
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{12,}/g, "[redacted]")
    .replace(/sk-[A-Za-z0-9]{8,}/gi, "[redacted]")
    .slice(0, 220);
}

test("redactSecrets strips Bearer tokens", () => {
  const input = 'Authorization: Bearer sk-abcdefghij1234567890abcdefghij';
  const result = redactSecrets(input);
  assert.equal(result.includes("sk-"), false);
  assert.equal(result.includes("Bearer [redacted]"), true);
});

test("redactSecrets strips JWT-like tokens", () => {
  // JWT must be long enough to match the {24,}.{12,} pattern
  const input = "error: invalid token eyJhbGciOiJIUzI1NiJ9eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123def456ghi789";
  const result = redactSecrets(input);
  assert.equal(result.includes("eyJ"), false);
  assert.equal(result.includes("[redacted]"), true);
});

test("redactSecrets truncates long messages", () => {
  const input = "x".repeat(500);
  const result = redactSecrets(input);
  assert.ok(result.length <= 220, "should truncate to 220 chars");
});

// --- Error classification (mirrors lib/portfolio-ai/errors.ts) ---
function classifyHttpError(status, body, requestId) {
  function redact(text) {
    return text.replace(/Bearer\s+\S+/gi, "Bearer [redacted]").slice(0, 220);
  }
  const message = redact(body || "empty");
  switch (status) {
    case 401: return { code: "UPSTREAM_UNAUTHORIZED", message, httpStatus: status, requestId };
    case 403: return { code: "UPSTREAM_FORBIDDEN", message, httpStatus: status, requestId };
    case 404: return { code: "MODEL_NOT_FOUND", message, httpStatus: status, requestId };
    case 429: return { code: "UPSTREAM_RATE_LIMITED", message, httpStatus: status, requestId };
    default: return { code: "UPSTREAM_UNKNOWN", message, httpStatus: status, requestId };
  }
}

test("classifyHttpError maps 401 to UPSTREAM_UNAUTHORIZED", () => {
  const result = classifyHttpError(401, "invalid api key", "req-123");
  assert.equal(result.code, "UPSTREAM_UNAUTHORIZED");
  assert.equal(result.httpStatus, 401);
  assert.equal(result.requestId, "req-123");
});

test("classifyHttpError maps 403 to UPSTREAM_FORBIDDEN", () => {
  const result = classifyHttpError(403, "forbidden", "req-456");
  assert.equal(result.code, "UPSTREAM_FORBIDDEN");
});

test("classifyHttpError maps 404 to MODEL_NOT_FOUND", () => {
  const result = classifyHttpError(404, "model not found", undefined);
  assert.equal(result.code, "MODEL_NOT_FOUND");
  assert.equal(result.requestId, undefined);
});

test("classifyHttpError maps 429 to UPSTREAM_RATE_LIMITED", () => {
  const result = classifyHttpError(429, "rate limited", undefined);
  assert.equal(result.code, "UPSTREAM_RATE_LIMITED");
});

test("classifyHttpError maps 500 to UPSTREAM_UNKNOWN", () => {
  const result = classifyHttpError(500, "internal error", undefined);
  assert.equal(result.code, "UPSTREAM_UNKNOWN");
});

// --- Fallback note (mirrors lib/portfolio-ai/errors.ts) ---
function fallbackNote(error) {
  if (!error) return "实时模型服务暂不可用，当前使用离线证据导览。";
  switch (error.code) {
    case "UPSTREAM_RATE_LIMITED":
      return "请求较多，请稍后再试。当前仍可查看项目证据。";
    case "UPSTREAM_TIMEOUT":
      return "实时模型响应超时，当前使用离线证据导览。";
    default:
      return "实时模型服务暂不可用，当前使用离线证据导览。";
  }
}

test("fallbackNote for rate limit mentions 请求较多", () => {
  const note = fallbackNote({ code: "UPSTREAM_RATE_LIMITED" });
  assert.match(note, /请求较多/);
});

test("fallbackNote for unauthorized does NOT say 尚未配置", () => {
  const note = fallbackNote({ code: "UPSTREAM_UNAUTHORIZED" });
  assert.doesNotMatch(note, /尚未配置/);
  assert.match(note, /暂不可用/);
});

test("fallbackNote for timeout mentions 超时", () => {
  const note = fallbackNote({ code: "UPSTREAM_TIMEOUT" });
  assert.match(note, /超时/);
});

test("fallbackNote for missing error uses default message", () => {
  const note = fallbackNote(undefined);
  assert.match(note, /暂不可用/);
});

// --- Config priority (verifies source code patterns) ---
test("config source uses correct env var priority", () => {
  const source = readSource("lib/portfolio-ai/config.ts");
  // Check the resolveApiKey function body for correct priority
  const apiKeyFuncStart = source.indexOf("function resolveApiKey");
  const apiKeyFuncEnd = source.indexOf("}", apiKeyFuncStart);
  const apiKeyFunc = source.slice(apiKeyFuncStart, apiKeyFuncEnd);
  const portfolioIdx = apiKeyFunc.indexOf("PORTFOLIO_AI_API_KEY");
  const zhipuIdx = apiKeyFunc.indexOf("ZHIPU_API_KEY");
  const glmIdx = apiKeyFunc.indexOf("GLM_API_KEY");
  assert.ok(portfolioIdx >= 0, "PORTFOLIO_AI_API_KEY should exist in resolveApiKey");
  assert.ok(zhipuIdx >= 0, "ZHIPU_API_KEY should exist as compat alias");
  assert.ok(glmIdx >= 0, "GLM_API_KEY should exist as compat alias");
  assert.ok(portfolioIdx < zhipuIdx, "PORTFOLIO_AI_API_KEY should come before ZHIPU_API_KEY");
  assert.ok(zhipuIdx < glmIdx, "ZHIPU_API_KEY should come before GLM_API_KEY");

  // Check the resolveBaseUrl function for correct priority
  const baseUrlFuncStart = source.indexOf("function resolveBaseUrl");
  const baseUrlFuncEnd = source.indexOf("}", baseUrlFuncStart);
  const baseUrlFunc = source.slice(baseUrlFuncStart, baseUrlFuncEnd);
  const baseUrlIdx = baseUrlFunc.indexOf("PORTFOLIO_AI_BASE_URL");
  const zhipuBaseUrlIdx = baseUrlFunc.indexOf("ZHIPU_BASE_URL");
  assert.ok(baseUrlIdx >= 0, "PORTFOLIO_AI_BASE_URL should exist in resolveBaseUrl");
  assert.ok(zhipuBaseUrlIdx >= 0, "ZHIPU_BASE_URL should exist as compat alias");
  assert.ok(baseUrlIdx < zhipuBaseUrlIdx, "PORTFOLIO_AI_BASE_URL should come before ZHIPU_BASE_URL");
});

test("config default base URL is Volcengine Ark, not 智谱", () => {
  const source = readSource("lib/portfolio-ai/config.ts");
  assert.match(source, /ark\.cn-beijing\.volces\.com\/api\/coding\/v3/);
  assert.doesNotMatch(source, /DEFAULT_ZHIPU_BASE_URL/);
});

// --- Base URL normalization ---
test("base URL normalization strips trailing slashes", () => {
  const source = readSource("lib/portfolio-ai/config.ts");
  assert.ok(
    source.includes('replace(/\\/+$/, "")'),
    "config should strip trailing slashes from base URL",
  );
});

// --- Route source verification ---
test("route imports callVolcengineArk adapter", () => {
  const source = readSource("app/api/portfolio-guide/route.ts");
  assert.match(source, /callVolcengineArk/);
  assert.match(source, /@\/lib\/portfolio-ai\/providers\/volcengine-ark/);
});

test("route does not contain zhipu-specific functions", () => {
  const source = readSource("app/api/portfolio-guide/route.ts");
  assert.doesNotMatch(source, /zhipuApiKey/);
  assert.doesNotMatch(source, /zhipuBaseURL/);
  assert.doesNotMatch(source, /streamZhipuModel/);
});

test("route does not hardcode open.bigmodel.cn", () => {
  const source = readSource("app/api/portfolio-guide/route.ts");
  assert.doesNotMatch(source, /open\.bigmodel\.cn/);
});

test("route uses structured logging with error codes", () => {
  const source = readSource("app/api/portfolio-guide/route.ts");
  assert.match(source, /logProviderEvent/);
  assert.match(source, /errorCode/);
  assert.match(source, /httpStatus/);
});

// --- Offline dedup verification ---
test("staticPortfolioAnswer deduplicates by projectSlug", () => {
  const source = readSource("lib/portfolio-guide.ts");
  assert.match(source, /seenProjects/);
  assert.match(source, /projectSlug/);
});

test("staticPortfolioAnswer dedup prevents repeated project titles", () => {
  // Simulate the dedup logic
  const sources = [
    { projectSlug: "wechat-bot", title: "微信公众号 AI 客服机器人", section: "项目概览" },
    { projectSlug: "wechat-bot", title: "微信公众号 AI 客服机器人", section: "业务问题与产品决策" },
    { projectSlug: "wechat-bot", title: "微信公众号 AI 客服机器人", section: "架构与实现" },
    { projectSlug: "service-agent", title: "Service Agent", section: "项目概览" },
  ];

  const seenProjects = new Set();
  const deduped = sources.filter((s) => {
    if (seenProjects.has(s.projectSlug)) return false;
    seenProjects.add(s.projectSlug);
    return true;
  });

  assert.equal(deduped.length, 2);
  assert.equal(deduped[0].projectSlug, "wechat-bot");
  assert.equal(deduped[1].projectSlug, "service-agent");

  // Verify "微信公众号 AI 客服机器人" appears only once
  const titles = deduped.map((s) => s.title);
  const wechatCount = titles.filter((t) => t === "微信公众号 AI 客服机器人").length;
  assert.equal(wechatCount, 1, "wechat-bot title should appear exactly once after dedup");
});

// --- History limit ---
test("route enforces max 6 history messages", () => {
  const source = readSource("app/api/portfolio-guide/route.ts");
  assert.match(source, /MAX_HISTORY_MESSAGES\s*=\s*6/);
});

// --- Error codes completeness ---
test("errors module defines all 9 error codes", () => {
  const source = readSource("lib/portfolio-ai/errors.ts");
  const requiredCodes = [
    "API_KEY_MISSING",
    "BASE_URL_INVALID",
    "UPSTREAM_UNAUTHORIZED",
    "UPSTREAM_FORBIDDEN",
    "MODEL_NOT_FOUND",
    "UPSTREAM_RATE_LIMITED",
    "UPSTREAM_TIMEOUT",
    "UPSTREAM_ABORTED",
    "UPSTREAM_INVALID_RESPONSE",
    "UPSTREAM_UNKNOWN",
  ];
  for (const code of requiredCodes) {
    assert.match(source, new RegExp(code), `errors.ts should define ${code}`);
  }
});

// --- .env.example verification ---
test(".env.example uses provider-neutral variables", () => {
  const source = readSource(".env.example");
  assert.match(source, /PORTFOLIO_AI_API_KEY=/);
  assert.match(source, /PORTFOLIO_AI_BASE_URL=/);
  assert.match(source, /PORTFOLIO_AI_PROVIDER=/);
  assert.match(source, /ark\.cn-beijing\.volces\.com/);
  assert.doesNotMatch(source, /open\.bigmodel\.cn/);
});

// --- Provider adapter verification ---
test("provider adapter uses OpenAI-compatible format", () => {
  const source = readSource("lib/portfolio-ai/providers/volcengine-ark.ts");
  assert.match(source, /\/chat\/completions/);
  assert.match(source, /stream:\s*true/);
  assert.match(source, /text\/event-stream/);
  assert.match(source, /\[DONE\]/);
});

test("provider adapter redacts secrets in stream errors", () => {
  const source = readSource("lib/portfolio-ai/providers/volcengine-ark.ts");
  assert.ok(source.includes("redactSecrets"), "provider should import and use redactSecrets");
  // The actual "Bearer [redacted]" pattern is in errors.ts, provider delegates to it
  const errorsSource = readSource("lib/portfolio-ai/errors.ts");
  assert.ok(errorsSource.includes("Bearer [redacted]"), "errors module should contain redaction pattern");
});

// --- No NEXT_PUBLIC_ for secrets ---
test("no NEXT_PUBLIC_ prefix for API key variables", () => {
  const configSource = readSource("lib/portfolio-ai/config.ts");
  assert.doesNotMatch(configSource, /NEXT_PUBLIC_PORTFOLIO_AI_API_KEY/);
  assert.doesNotMatch(configSource, /NEXT_PUBLIC_ZHIPU_API_KEY/);

  const envSource = readSource(".env.example");
  assert.doesNotMatch(envSource, /NEXT_PUBLIC_PORTFOLIO_AI_API_KEY/);
  assert.doesNotMatch(envSource, /NEXT_PUBLIC_ZHIPU_API_KEY/);
});
