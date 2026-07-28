import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const root = process.cwd();
const read = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(`Portfolio consistency gate: ${message}`);
};

function findAuthorityDir() {
  const candidates = [
    resolve(root, "_portfolio_handoff/job-ready-r1.3"),
    resolve(root, "../_portfolio_handoff/job-ready-r1.3"),
    resolve(root, "../../_portfolio_handoff/job-ready-r1.3"),
  ];
  const found = candidates.find((candidate) => existsSync(resolve(candidate, "01-PUBLIC-SOURCE-OF-TRUTH.yaml")));
  assert(found, "R1.3 authority package is missing");
  return found;
}

const authorityDir = findAuthorityDir();
const authority = (name) => readFileSync(resolve(authorityDir, name), "utf8");
const source = JSON.parse(authority("01-PUBLIC-SOURCE-OF-TRUTH.yaml"));
const matrix = authority("02-CLAIMS-EVIDENCE-MATRIX.md");
const routes = authority("03-DEMO-ROUTES.md");
const resumeCanonical = authority("04-RESUME-CANONICAL.md");

const home = read("app/page.tsx");
const projects = read("content/projects.ts");
const layout = read("app/layout.tsx");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const casePage = read("app/projects/[slug]/page.tsx");
const header = read("components/Header.tsx");
const resumeText = read("public/resume/chen-jiawei-ai-agent-cn-two-page.txt");
const publicOrigin = source.website.public_url;
const evidenceIds = new Set(Object.keys(source.evidence_catalog));
const publicSurfaces = [home, projects, layout, sitemap, robots, casePage, resumeText, resumeCanonical].join("\n");

assert(source.package.current_public_baseline === "R1.3", "authority package baseline must be R1.3");
assert(source.package.job_readiness === "CHANGES_REQUIRED", "authority verdict mismatch");

const matrixRefs = [...matrix.matchAll(/\bE-[A-Z0-9-]+\b/g)].map((match) => match[0]);
for (const ref of new Set(matrixRefs)) {
  assert(evidenceIds.has(ref), `matrix references undefined evidence ID ${ref}`);
}

const featuredMatch = home.match(/const featuredProjects = \[([^\]]+)\]/s);
assert(featuredMatch, "homepage must declare the flagship order");
const featuredSlugs = [...featuredMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
assert(
  JSON.stringify(featuredSlugs) === JSON.stringify(["data-platform", "service-agent", "lumen-ink"]),
  "public flagship order must be data platform, Service Agent, then Lumen",
);
assert(home.includes("<ProjectLibrary projects={featuredProjects} />"), "public library must expose only the three evidence-bound flagship cases");
assert(casePage.includes("return featuredProjects.map"), "static case routes must expose only flagship cases");
assert(casePage.includes("if (!project?.featured) notFound()"), "non-flagship dynamic routes must fail closed");

for (const [slug, status] of [
  ["data-platform", source.public_cases.feishu_data_platform.status],
  ["service-agent", source.public_cases.service_agent.status],
  ["lumen-ink", source.public_cases.lumen.status],
]) {
  const start = projects.indexOf(`slug: "${slug}"`);
  assert(start >= 0, `missing flagship project ${slug}`);
  const next = projects.indexOf("\n  {\n    slug:", start + 1);
  const segment = projects.slice(start, next < 0 ? projects.length : next);
  assert(segment.includes(status), `${slug} status differs from authority package`);
  const metricBlock = segment.match(/metrics:\s*\[([\s\S]*?)\n\s*\],/);
  assert(metricBlock, `${slug} metrics block is missing`);
  const metrics = [...metricBlock[1].matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]);
  assert(metrics.length > 0, `${slug} has no public metrics`);
  for (const metric of metrics) {
    const ref = metric.match(/evidenceRef:\s*"(E-[A-Z0-9-]+)"/)?.[1];
    assert(ref, `${slug} public metric lacks an evidenceRef`);
    assert(evidenceIds.has(ref), `${slug} public metric references undefined ${ref}`);
  }
}

for (const ref of [...projects.matchAll(/ref:\s*"(E-[A-Z0-9-]+)"/g)].map((match) => match[1])) {
  assert(evidenceIds.has(ref), `case page references undefined evidence ID ${ref}`);
}

for (const required of [
  "五步真实测试链路",
  "三条核心业务规则",
  "PASS / NEEDS_REVIEW / REJECT",
  "三类自动化，三种边界",
  "B1 / B2 / B3",
  "评测缺口与修复方向",
  "微信小程序扩展路线",
  "DESIGNED_NOT_DEPLOYED",
]) {
  assert(projects.includes(required), `required case module is missing: ${required}`);
}

for (const forbidden of [
  "75/90=83.33%",
  "75/90 = 83.33%",
  "离线路由正确率",
  "高风险错误放行 0",
  "禁止承诺 0",
  "I00 21/21",
  "canonical-script adherence",
  "生产回答准确率为",
  "全量生产上线",
  "chen-jiawei-ai-agent-cn-one-page.pdf",
]) {
  assert(!publicSurfaces.includes(forbidden), `unsupported or superseded public claim: ${forbidden}`);
}

assert(layout.includes(`metadataBase: new URL("${publicOrigin}")`), "metadata origin differs from verified platform URL");
assert(layout.includes(`url: "${publicOrigin}"`), "OpenGraph origin differs from verified platform URL");
assert(sitemap.includes(publicOrigin), "sitemap origin differs from verified platform URL");
assert(robots.includes(`${publicOrigin}/sitemap.xml`), "robots sitemap differs from verified platform URL");
assert(casePage.includes(`${publicOrigin}/projects/`), "case OpenGraph URL differs from verified platform URL");
assert(source.resume.links.includes(publicOrigin), "resume authority links omit the verified platform URL");

for (const claim of source.public_numeric_bindings) {
  assert(evidenceIds.has(claim.evidence_ref), `numeric claim ${claim.id} references undefined evidence`);
  assert(matrix.includes(claim.id), `numeric claim ${claim.id} is absent from the claims matrix`);
  assert([publicSurfaces, matrix].join("\n").includes(claim.public_text), `bound public claim is absent: ${claim.id}`);
}

for (const resume of [
  "public/resume/chen-jiawei-ai-agent-cn-two-page.pdf",
  "public/resume/chen-jiawei-ai-agent-cn-two-page.docx",
  "public/resume/chen-jiawei-ai-agent-cn-two-page.txt",
  "public/resume/jiawei-chen-ai-agent-en.pdf",
]) {
  assert(existsSync(resolve(root, resume)), `resume asset missing: ${resume}`);
}
assert(header.includes("/resume/chen-jiawei-ai-agent-cn-two-page.pdf"), "shared resume CTA must target the canonical two-page resume");
assert(existsSync(resolve(root, "app/not-found.tsx")), "custom 404 page is missing");

const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean);
const binaryExtensions = new Set([".pdf", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".woff", ".woff2"]);
const sensitivePatterns = [
  /(?:base_token|app_token)\s+[`"']?[A-Za-z0-9_-]{16,}/i,
  /(?:app_secret|client_secret|api_key)\s*[:=]\s*[`"']?[A-Za-z0-9_-]{12,}/i,
];
for (const file of tracked) {
  if (binaryExtensions.has(extname(file).toLowerCase())) continue;
  const absolute = resolve(root, file);
  if (!existsSync(absolute)) continue;
  const body = readFileSync(absolute, "utf8");
  for (const pattern of sensitivePatterns) {
    assert(!pattern.test(body), `tracked release file contains a literal sensitive identifier: ${file}`);
  }
}

console.log(`Portfolio consistency gate passed: ${evidenceIds.size} evidence IDs, ${new Set(matrixRefs).size} matrix refs, ${tracked.length} tracked files scanned.`);
