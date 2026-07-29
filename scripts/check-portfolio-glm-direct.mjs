#!/usr/bin/env node

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
const envExample = read(".env.example");
const packageText = read("package.json");
let packageJson = {};

try {
  packageJson = JSON.parse(packageText);
} catch {
  failures.push("package.json 不是有效 JSON");
}

check(route.includes("fetch(`${zhipuBaseURL()}/chat/completions`"), "API 应直连智谱对话补全接口");
check(route.includes("Authorization: `Bearer ${options.apiKey}`"), "API 应使用服务端 Bearer API Key");
check(route.includes("ZHIPU_API_KEY"), "API 应读取服务端 ZHIPU_API_KEY");
check(route.includes("https://open.bigmodel.cn/api/paas/v4"), "API 应默认使用智谱通用开放平台地址");
check(route.includes('const DEFAULT_MODEL = "glm-5.2"'), "API 默认模型应为 glm-5.2");
check(route.includes('Accept: "text/event-stream"'), "API 应请求智谱 SSE 流式响应");
check(route.includes('payload === "[DONE]"'), "API 应正确处理 SSE 结束标记");
check(route.includes("staticPortfolioAnswer"), "API 应保留离线证据回退");
check(route.includes("retrievePortfolioSources"), "API 应在生成前检索公开证据");
check(route.includes("PORTFOLIO_AI_MAX_OUTPUT_TOKENS"), "API 应限制模型输出 Token");
check(route.includes("PORTFOLIO_AI_TIMEOUT_MS"), "API 应设置上游调用超时");
check(!route.includes("AI_GATEWAY_API_KEY"), "API 不应继续依赖 AI Gateway Key");
check(!route.includes("createOpenAICompatible"), "API 不应依赖额外兼容 Provider 包");
check(!packageJson.dependencies?.["@ai-sdk/openai-compatible"], "package.json 不应增加兼容 Provider 依赖");
check(envExample.includes("ZHIPU_API_KEY="), ".env.example 应声明 ZHIPU_API_KEY");
check(envExample.includes("PORTFOLIO_AI_MODEL=glm-5.2"), ".env.example 应默认使用 glm-5.2");
check(!envExample.includes("AI_GATEWAY_API_KEY="), ".env.example 不应再要求 AI_GATEWAY_API_KEY");
check(!envExample.includes("NEXT_PUBLIC_ZHIPU_API_KEY"), "智谱 Key 不得使用 NEXT_PUBLIC_ 前缀");

console.log(`PASS ${passes.length}`);
for (const item of passes) console.log(`  ✓ ${item}`);

if (failures.length > 0) {
  console.error(`\nFAIL ${failures.length}`);
  for (const item of failures) console.error(`  ✗ ${item}`);
  process.exitCode = 1;
} else {
  console.log("\nPORTFOLIO_GLM_DIRECT_R1 CHECK PASS");
}
