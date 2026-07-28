import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(`Portfolio consistency gate: ${message}`);
};

const home = read("app/page.tsx");
const projects = read("content/projects.ts");
const layout = read("app/layout.tsx");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const casePage = read("app/projects/[slug]/page.tsx");

const featuredMatch = home.match(/const featuredProjects = \[([^\]]+)\]/s);
assert(featuredMatch, "homepage must declare the featured-project order");
const featuredSlugs = [...featuredMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
assert(
  JSON.stringify(featuredSlugs) === JSON.stringify(["data-platform", "service-agent", "lumen-ink"]),
  "the three flagship cases must be data platform, Service Agent, then Lumen only",
);
assert(home.includes("三个主案例，同优先级展示。"), "homepage must state the three equal-priority flagship cases");
assert(!home.includes("四个案例，证明四项关键能力"), "homepage must not market four flagship cases");
assert(!home.includes("Collator 与光砚分别"), "homepage must not position Collator as a fourth flagship case");
assert(home.includes("AI / Agent 产品经理"), "homepage must state the AI / Agent PM positioning");
assert(home.includes("https://github.com/Catcherog"), "homepage must expose the GitHub CTA");
assert(home.includes("mailto:Jael_Chen@foxmail.com"), "homepage must expose the email CTA");

for (const resume of [
  "public/resume/chen-jiawei-ai-agent-cn-one-page.pdf",
  "public/resume/chen-jiawei-ai-agent-cn-two-page.pdf",
  "public/resume/jiawei-chen-ai-agent-en.pdf",
]) {
  assert(existsSync(resolve(root, resume)), `resume asset missing: ${resume}`);
}
assert(home.includes("/resume/chen-jiawei-ai-agent-cn-one-page.pdf"), "homepage resume CTA must target the shipped resume");

assert(
  projects.includes("Portfolio Pilot｜真实测试 Base E2E 已验证，正式业务 Pilot 与通知自动化待启用"),
  "Feishu status must use the approved conservative Portfolio Pilot language",
);
assert(projects.includes("75/90=83.33%"), "Service Agent must include the fixed offline routing result");
assert(projects.includes("不是生产准确率/回答总体准确率"), "Service Agent result must carry its required accuracy boundary");
assert(projects.includes("维护中 / fallback"), "Service Agent must expose a maintenance fallback when its public URL is unverified");
assert(projects.includes("Online Beta 候选/受限状态"), "Lumen must use the approved Online Beta candidate status");
assert(projects.includes("BYO key"), "Lumen must disclose the BYO key requirement");
assert(projects.includes("Collator（飞书子系统）"), "Collator must be framed as a Feishu subsystem");

for (const slug of ["data-platform", "service-agent", "lumen-ink"]) {
  assert(projects.includes(`slug: \"${slug}\"`), `missing flagship project: ${slug}`);
}

for (const forbidden of ["零数据丢失", "生产回答准确率为", "全量生产上线"]) {
  assert(!projects.includes(forbidden), `forbidden unsupported claim: ${forbidden}`);
}

assert(layout.includes('metadataBase: new URL("https://www.jaelchen.com")'), "site metadata must set the canonical origin");
assert(sitemap.includes("https://www.jaelchen.com"), "sitemap must include the canonical origin");
assert(robots.includes("sitemap"), "robots must expose the sitemap");
assert(existsSync(resolve(root, "app/not-found.tsx")), "site must provide a custom 404 page");
assert(casePage.includes("const contributionAreas = project.myContribution ??"), "every project page must provide a user-contribution fallback");
assert(casePage.includes("const evidenceBoundary = project.evidenceLabel ??"), "every project page must provide an evidence-boundary fallback");
assert(casePage.includes("风险治理、取舍与下一步"), "every project page must explicitly include risk governance");
assert(casePage.includes("PRIMARY DEMO · 主入口") && casePage.includes("FALLBACK · 备用入口"), "every project page must show primary and fallback demo paths");

console.log("Portfolio consistency gate passed.");
