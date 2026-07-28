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
    resolve(root, "_portfolio_handoff/job-ready-r1.3.1"),
    resolve(root, "../_portfolio_handoff/job-ready-r1.3.1"),
    resolve(root, "../../_portfolio_handoff/job-ready-r1.3.1"),
    resolve(root, "_portfolio_handoff/job-ready-r1.3"),
    resolve(root, "../_portfolio_handoff/job-ready-r1.3"),
    resolve(root, "../../_portfolio_handoff/job-ready-r1.3"),
  ];
  const found = candidates.find((candidate) => existsSync(resolve(candidate, "01-PUBLIC-SOURCE-OF-TRUTH.yaml")));
  assert(found, "R1.3.1 authority package is missing");
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
const publicClaims = JSON.parse(read("content/public-claims.json"));
const layout = read("app/layout.tsx");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const casePage = read("app/projects/[slug]/page.tsx");
const header = read("components/Header.tsx");
const systemMap = read("components/SystemMap.tsx");
const homepageComponents = [
  "components/home/Hero.tsx",
  "components/home/FeaturedCases.tsx",
  "components/home/ProductMethod.tsx",
  "components/home/PortfolioGuide.tsx",
  "components/home/ExperienceContact.tsx",
  "components/ProjectLibrary.tsx",
].map(read).join("\n");
const resumeText = read("public/resume/chen-jiawei-ai-agent-cn-two-page.txt");
const completion = authority("PORTFOLIO-JOB-READY-CLOSURE-R1.3-CODEX-COMPLETION.md");
const publicOrigin = source.website.public_url;
const evidenceIds = new Set(Object.keys(source.evidence_catalog));
const publicSurfaces = [home, homepageComponents, projects, layout, sitemap, robots, casePage, resumeText, resumeCanonical].join("\n");
const publicClaimSurfaces = [publicSurfaces, completion].join("\n");

assert(source.package.current_public_baseline === "R1.3.1", "authority package baseline must be R1.3.1");
assert(
  ["CHANGES_REQUIRED", "CONTROLLED_APPLICATION_READY", "JOB_READY_PASS"].includes(source.package.job_readiness),
  "authority verdict mismatch",
);

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
assert(home.includes('const heroMetrics = getPublicMetrics("hero");'), "homepage metrics must come from the public claim manifest");
assert(casePage.includes("return featuredProjects.map"), "static case routes must expose only flagship cases");
assert(casePage.includes("if (!project?.featured) notFound()"), "non-flagship dynamic routes must fail closed");
const publicMapMatch = systemMap.match(/const publicProjectSlugs = new Set\(\[([^\]]+)\]\)/s);
assert(publicMapMatch, "system map must declare its public project allowlist");
const publicMapSlugs = [...publicMapMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
assert(
  JSON.stringify(publicMapSlugs) === JSON.stringify(featuredSlugs),
  "system map links must be limited to the three public flagship routes",
);
assert(systemMap.includes('className="system-project-label"'), "support modules must render as non-link labels");

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
  assert(segment.includes(`metrics: getPublicMetrics("${slug}"),`), `${slug} metrics must come from the public claim manifest`);
}
assert(!/\bclaimId\s*:/.test(`${home}\n${projects}`), "public claims must not be declared outside the manifest");

for (const ref of [...projects.matchAll(/(?:evidenceRef|ref):\s*"([^"]+)"/g)].map((match) => match[1])) {
  if (/^(?:https?:|mailto:|#)/.test(ref)) continue;
  assert(evidenceIds.has(ref), `case content references undefined evidence ID ${ref}`);
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

const bindingById = new Map(source.public_numeric_bindings.map((claim) => [claim.id, claim]));
assert(Array.isArray(publicClaims), "public claim manifest must be an array");
assert(publicClaims.length === 18, "public claim manifest must contain the 18 approved structured claims");
const expectedSurfaceCounts = new Map([["hero", 4], ["data-platform", 4], ["service-agent", 6], ["lumen-ink", 4]]);
const surfaceCounts = new Map();
const structuredIds = new Set();
for (const claim of publicClaims) {
  const keys = Object.keys(claim).sort();
  const expectedKeys = ["claimId", "evidenceRef", "label", "surface", "value", ...(claim.note === undefined ? [] : ["note"])].sort();
  assert(JSON.stringify(keys) === JSON.stringify(expectedKeys), `public claim has an unexpected schema: ${claim.claimId ?? "unknown"}`);
  for (const field of ["surface", "claimId", "value", "label", "evidenceRef"]) {
    assert(typeof claim[field] === "string" && claim[field].length > 0, `public claim has invalid ${field}`);
  }
  assert(expectedSurfaceCounts.has(claim.surface), `public claim has an unknown surface: ${claim.surface}`);
  surfaceCounts.set(claim.surface, (surfaceCounts.get(claim.surface) ?? 0) + 1);
  const id = claim.claimId;
  assert(!structuredIds.has(id), `structured public claim ID is duplicated: ${id}`);
  structuredIds.add(id);
  const binding = bindingById.get(id);
  assert(binding, `structured public claim is absent from authority: ${id}`);
  assert(binding.metric_value === claim.value, `metric value differs from authority: ${id}`);
  assert(binding.metric_label === claim.label, `metric label differs from authority: ${id}`);
  assert(binding.evidence_ref === claim.evidenceRef, `metric evidence differs from authority: ${id}`);
  assert(evidenceIds.has(claim.evidenceRef), `structured public claim references undefined evidence: ${id}`);
  assert(matrix.includes(id), `structured public claim is absent from the claims matrix: ${id}`);
}
for (const [surface, count] of expectedSurfaceCounts) {
  assert(surfaceCounts.get(surface) === count, `public claim count differs for ${surface}`);
}

for (const claim of source.public_numeric_bindings) {
  assert(evidenceIds.has(claim.evidence_ref), `numeric claim ${claim.id} references undefined evidence`);
  assert(matrix.includes(claim.id), `numeric claim ${claim.id} is absent from the claims matrix`);
  if (claim.metric_value !== undefined) {
    assert(structuredIds.has(claim.id), `authority metric has no structured public claim: ${claim.id}`);
  } else {
    assert(publicClaimSurfaces.includes(claim.public_text), `bound public claim is absent from public surfaces: ${claim.id}`);
  }
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
