// PORTFOLIO CONSISTENCY GATE
// 最小自动检查:不调用 build,独立运行
// 用法: node scripts/consistency-gate.mjs

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let errors = [];
let warnings = [];
let passed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    errors.push(`${name}${detail ? ": " + detail : ""}`);
    console.log(`  ✗ ${name}${detail ? " — " + detail : ""}`);
  }
}

function readContent(relativePath) {
  const fullPath = join(root, relativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, "utf-8");
}

console.log("\n=== PORTFOLIO CONSISTENCY GATE ===\n");

// 读取 projects.ts 源文件
const projectsSource = readContent("content/projects.ts");
if (!projectsSource) {
  console.error("FATAL: content/projects.ts not found");
  process.exit(1);
}

// 读取 evidence json
const evidenceDir = join(root, "content", "evidence");
let allEvidence = [];
if (existsSync(evidenceDir)) {
  for (const file of readdirSync(evidenceDir)) {
    if (file.endsWith(".json")) {
      try {
        const data = JSON.parse(readFileSync(join(evidenceDir, file), "utf-8"));
        allEvidence = allEvidence.concat(data);
      } catch (e) {
        errors.push(`evidence json parse error: ${file}`);
      }
    }
  }
}

// 读取 next.config.ts
const nextConfig = readContent("next.config.ts") || "";
// 读取 page.tsx
const pageSource = readContent("app/page.tsx") || "";

// === 检查 1: Featured 项目恰好为 3 个 ===
console.log("检查 1: Featured 项目数量");
const featuredMatches = projectsSource.match(/featured:\s*true/g) || [];
check("Featured 项目恰好为 3 个", featuredMatches.length === 3, `实际 ${featuredMatches.length} 个`);

// === 检查 2: 所有项目 slug 唯一(只检查项目定义,不检查 relationships) ===
console.log("检查 2: slug 唯一性");
// 只匹配行首的 slug(项目定义),不匹配 relationships 中的 { slug: "..." }
const slugMatches = projectsSource.match(/^\s+slug:\s*"([^"]+)"/gm) || [];
const slugs = slugMatches.map((s) => s.match(/"([^"]+)"/)[1]);
const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
check("所有项目 slug 唯一", duplicateSlugs.length === 0, duplicateSlugs.length > 0 ? `重复: ${duplicateSlugs.join(", ")}` : `共 ${slugs.length} 个 slug`);

// === 检查 3: 三个旧路由存在重定向 ===
console.log("检查 3: 历史路由重定向");
const oldSlugs = ["data-platform", "collator", "feishu-portal"];
const redirectChecks = oldSlugs.map((slug) => {
  return nextConfig.includes(slug) && nextConfig.includes("feishu-platform");
});
check("三个旧路由存在重定向到 feishu-platform", redirectChecks.every(Boolean), "检查 next.config.ts redirects 配置");

// === 检查 4: evidence ID 唯一 ===
console.log("检查 4: evidence ID 唯一性");
const evidenceIds = allEvidence.map((e) => e.evidenceId);
const duplicateEvidenceIds = evidenceIds.filter((id, index) => evidenceIds.indexOf(id) !== index);
check("evidence ID 唯一", duplicateEvidenceIds.length === 0, duplicateEvidenceIds.length > 0 ? `重复: ${duplicateEvidenceIds.join(", ")}` : "");

// === 检查 5: evidence 引用文件存在(避免匹配 href) ===
console.log("检查 5: evidence 引用存在");
// 用 [^a-zA-Z] 确保 ref 前面不是字母(避免匹配 href 中的 ref)
const evidenceRefMatches = projectsSource.match(/[^a-zA-Z]ref:\s*"([^"]+)"/g) || [];
const evidenceRefs = evidenceRefMatches.map((m) => m.match(/"([^"]+)"/)[1]);
const missingRefs = evidenceRefs.filter((ref) => !evidenceIds.includes(ref));
check("所有 evidence ref 在 evidence json 中存在", missingRefs.length === 0, missingRefs.length > 0 ? `缺失: ${missingRefs.join(", ")}` : `共 ${evidenceRefs.length} 个 ref`);

// === 检查 6: 状态分层完整(featured 项目) ===
console.log("检查 6: 状态分层完整");
const featuredSectionRegex = /featured:\s*true[\s\S]*?(?=slug:|$)/g;
const featuredSections = projectsSource.match(featuredSectionRegex) || [];
const statusComplete = featuredSections.every((section) => {
  return section.includes("verifiedCapabilities") &&
         section.includes("inProgressCapabilities") &&
         section.includes("plannedCapabilities");
});
check("每个 featured 项目有 verified/inProgress/planned", statusComplete);

// === 检查 7: CTA 措辞与 demoType 一致 ===
console.log("检查 7: CTA 措辞检查");
// 检查整个文件不含禁止的 CTA 措辞
const forbiddenCta = ["立即在线体验", "无门槛公开体验", "可在线体验"];
const foundForbiddenCta = forbiddenCta.filter((word) => projectsSource.includes(word));
check("不存在禁止的 CTA 措辞", foundForbiddenCta.length === 0, foundForbiddenCta.length > 0 ? `发现: ${foundForbiddenCta.join(", ")}` : "");

// === 检查 8: 不存在禁止主张 ===
console.log("检查 8: 禁止词检查");
const forbiddenWords = [
  "OCR/ASR/CLIP 全部落地",
  "全面生产上线",
  "生产级高可用",
  "零漏单",
  "准确率 92%",
  "转化率翻倍",
  "7×24 秒级",
];
const foundForbidden = forbiddenWords.filter((word) => projectsSource.includes(word) || pageSource.includes(word));
check("不存在禁止主张", foundForbidden.length === 0, foundForbidden.length > 0 ? `发现: ${foundForbidden.join(", ")}` : "");

// === 检查 9: 不存在公开手机号 ===
console.log("检查 9: 公开手机号检查");
const phonePattern = /1[3-9]\d{9}/g;
const phoneInProjects = projectsSource.match(phonePattern) || [];
const phoneInPage = pageSource.match(phonePattern) || [];
const allPhones = [...phoneInProjects, ...phoneInPage];
check("不存在公开手机号(11 位)", allPhones.length === 0, allPhones.length > 0 ? `发现: ${allPhones.join(", ")}` : "");

// === 检查 10: 简历入口不超过一个 ===
console.log("检查 10: 简历入口数量");
const resumeLinksInPage = (pageSource.match(/\/resume\/[^"]+\.pdf/g) || []).length;
check("首页简历入口不超过一个", resumeLinksInPage <= 1, `实际 ${resumeLinksInPage} 个`);

// === 检查 11: canonical 简历文件存在 ===
console.log("检查 11: canonical 简历文件存在");
const canonicalResume = existsSync(join(root, "public", "resume", "chen-jiawei-ai-agent-cn-one-page.pdf"));
check("canonical 简历文件存在", canonicalResume);

// === 检查 12: 外部 Demo 链接格式有效 ===
console.log("检查 12: 外部 Demo 链接格式");
const httpLinks = pageSource.match(/href:\s*"(https?:\/\/[^"]+)"/g) || [];
const invalidLinks = httpLinks.filter((link) => !link.includes("https://"));
check("外部 Demo 链接使用 https", invalidLinks.length === 0);

// === 检查 13: 项目数量不硬编码 ===
console.log("检查 13: 项目数量不硬编码");
const hardcodedCounts = [
  { pattern: /9 个项目/g, label: "9 个项目" },
  { pattern: /4 个核心/g, label: "4 个核心" },
  { pattern: /5 个支撑/g, label: "5 个支撑" },
  { pattern: /4 核心产品/g, label: "4 核心产品" },
];
const foundHardcoded = hardcodedCounts.filter((c) => c.pattern.test(pageSource) || c.pattern.test(projectsSource));
check("不存在硬编码项目数量", foundHardcoded.length === 0, foundHardcoded.length > 0 ? `发现: ${foundHardcoded.map((c) => c.label).join(", ")}` : "");

// === 检查 14: 三个主案例各有 evidence ===
console.log("检查 14: 主案例证据");
const featuredSlugs = ["feishu-platform", "service-agent", "lumen-ink"];
const evidenceByProject = {};
allEvidence.forEach((e) => {
  evidenceByProject[e.project] = (evidenceByProject[e.project] || 0) + 1;
});
const missingEvidence = featuredSlugs.filter((slug) => !evidenceByProject[slug] || evidenceByProject[slug] < 1);
check("三个主案例各有至少一项 evidence", missingEvidence.length === 0, missingEvidence.length > 0 ? `缺失: ${missingEvidence.join(", ")}` : "");

// === 检查 15: 三个旧 slug 不在 projects 数组中 ===
console.log("检查 15: 旧 slug 已移除");
const oldSlugsStillPresent = oldSlugs.filter((slug) => {
  const regex = new RegExp(`slug:\\s*"${slug}"`);
  return regex.test(projectsSource);
});
check("data-platform/collator/feishu-portal slug 已移除", oldSlugsStillPresent.length === 0, oldSlugsStillPresent.length > 0 ? `仍存在: ${oldSlugsStillPresent.join(", ")}` : "");

// === 汇总 ===
console.log("\n=== 汇总 ===");
console.log(`通过: ${passed}`);
console.log(`失败: ${errors.length}`);
if (warnings.length > 0) {
  console.log(`警告: ${warnings.length}`);
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}
if (errors.length > 0) {
  console.log("\n失败项:");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("\n❌ CONSISTENCY GATE FAILED");
  process.exit(1);
} else {
  console.log("\n✅ CONSISTENCY GATE PASSED");
  process.exit(0);
}
