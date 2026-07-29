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

const page = read("app/page.tsx");
const guide = read("components/PortfolioGuide.tsx");
const route = read("app/api/portfolio-guide/route.ts");
const retrieval = read("lib/portfolio-guide.ts");
const library = read("components/ProjectLibrary.tsx");
const header = read("components/Header.tsx");
const projects = read("content/projects.ts");
const css = read("app/globals.css");
const packageJsonText = read("package.json");

let packageJson = {};
try {
  packageJson = JSON.parse(packageJsonText);
} catch {
  failures.push("package.json 不是有效 JSON");
}

check(page.includes("<PortfolioGuide"), "首页应渲染 PortfolioGuide");
check(page.includes("<ProjectLibrary projects={projects}"), "完整项目库应接收全部 projects");
check(!page.includes("<ProjectLibrary projects={featuredProjects}"), "完整项目库不能只接收 featuredProjects");
check(!page.includes("开始 90 秒导览"), "主入口不应继续叫“开始 90 秒导览”");
check(guide.includes("开始 AI 导览"), "导览组件应使用“开始 AI 导览”");
check(guide.includes("LLM · EVIDENCE RETRIEVAL · READ ONLY"), "导览组件应展示技术能力标识");
check(guide.includes('/api/portfolio-guide'), "导览组件应调用 Portfolio Guide API");
check(route.includes("streamText") || route.includes("callVolcengineArk") || (route.includes("chat/completions") && route.includes("text/event-stream")), "API 应接入流式模型调用（通过适配器或直接调用）");
check(route.includes("retrievePortfolioSources"), "API 应先执行作品集证据检索");
check(route.includes("staticPortfolioAnswer"), "API 应保留离线证据回退");
check(retrieval.includes("projects.flatMap"), "检索索引应覆盖全部项目");
check(library.includes("library-card-supporting"), "项目库应区分主案例和更多案例");
check(header.includes("AI 导览"), "导航应显示 AI 导览");
check(css.includes("PORTFOLIO_AI_GUIDE_R1"), "全局样式应包含 AI Guide 标记");
check(Boolean(packageJson.dependencies?.ai), "package.json 应包含 ai 依赖");

const expectedSlugs = [
  "data-platform",
  "service-agent",
  "lumen-ink",
  "wechat-bot",
  "collator",
  "content-research",
  "mini-program",
  "brand-website",
  "lora-finetuning",
];
for (const slug of expectedSlugs) {
  check(projects.includes(`"${slug}"`), `项目数据应保留 ${slug}`);
}

console.log(`PASS ${passes.length}`);
for (const item of passes) console.log(`  ✓ ${item}`);

if (failures.length > 0) {
  console.error(`\nFAIL ${failures.length}`);
  for (const item of failures) console.error(`  ✗ ${item}`);
  process.exitCode = 1;
} else {
  console.log("\nPORTFOLIO_AI_GUIDE_AND_FULL_LIBRARY_R1 CHECK PASS");
}
