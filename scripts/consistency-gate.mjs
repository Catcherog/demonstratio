import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { extname, resolve } from "node:path";
import { getMetricBindings, loadPublicAuthority, resolveAuthorityDir } from "./lib/portfolio-authority.mjs";

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), "utf8");
const authorityDir = resolveAuthorityDir(root, process.env);
const authority = loadPublicAuthority(root, process.env);
const authorityFile = (name) => readFileSync(resolve(authorityDir, name), "utf8");

assert.equal(authority.package.id, "job-ready-r1.3", "authority package must be job-ready-r1.3");
assert.equal(authority.package.current_public_baseline, "R1.3", "authority baseline must be R1.3");
assert.equal(
  authority.package.authority_status,
  "PHASE_G_CLOSED_PROVISIONAL_PASS",
  "authority status must preserve the Phase G provisional closure",
);

const evidenceCatalog = authority.evidence_catalog ?? {};
const authorityEvidenceIds = new Set(Object.keys(evidenceCatalog));
const matrix = authorityFile("02-CLAIMS-EVIDENCE-MATRIX.md");
const publicClaims = JSON.parse(read("content/public-claims.json"));
const projectsSource = read("content/projects.ts");
const homeSource = read("app/page.tsx");
const featuredSource = read("components/home/FeaturedCases.tsx");
const routeSource = read("app/projects/[slug]/page.tsx");
const guideSource = read("lib/portfolio-guide.ts");
const evidenceSource = read("content/portfolio-evidence.ts");
const caseSources = {
  "data-platform": read("content/flagship-cases/data-platform.ts"),
  "service-agent": read("content/flagship-cases/service-agent.ts"),
  "lumen-ink": read("content/flagship-cases/lumen-ink.ts"),
};

// Every authority reference used by the claims matrix must exist in the catalog.
const matrixRefs = new Set([...matrix.matchAll(/\bE-[A-Z0-9-]+\b/g)].map((match) => match[0]));
for (const ref of matrixRefs) {
  assert(authorityEvidenceIds.has(ref), `claims matrix references undefined evidence: ${ref}`);
}

// The structured metric manifest is an exact, authority-derived 21-binding contract.
const metricBindings = getMetricBindings(authority);
const bindingById = new Map(metricBindings.map((binding) => [binding.id, binding]));
const expectedSurfaceCounts = new Map([
  ["hero", 4],
  ["data-platform", 5],
  ["service-agent", 7],
  ["lumen-ink", 5],
]);
assert.equal(metricBindings.length, 21, "authority must expose 21 metric-bearing public bindings");
assert.equal(publicClaims.length, 21, "public claim manifest must contain 21 structured claims");

const manifestIds = new Set();
const surfaceCounts = new Map();
for (const claim of publicClaims) {
  const required = ["surface", "claimId", "value", "label", "evidenceRef"];
  for (const field of required) {
    assert.equal(typeof claim[field], "string", `${claim.claimId ?? "unknown"} has invalid ${field}`);
    assert(claim[field].length > 0, `${claim.claimId ?? "unknown"} has empty ${field}`);
  }
  assert(expectedSurfaceCounts.has(claim.surface), `unknown public claim surface: ${claim.surface}`);
  assert(!manifestIds.has(claim.claimId), `duplicate public claim: ${claim.claimId}`);
  manifestIds.add(claim.claimId);
  surfaceCounts.set(claim.surface, (surfaceCounts.get(claim.surface) ?? 0) + 1);

  const binding = bindingById.get(claim.claimId);
  assert(binding, `public claim is absent from authority: ${claim.claimId}`);
  assert.equal(claim.value, binding.metric_value, `metric value mismatch: ${claim.claimId}`);
  assert.equal(claim.label, binding.metric_label, `metric label mismatch: ${claim.claimId}`);
  assert.equal(claim.evidenceRef, binding.evidence_ref, `metric evidence mismatch: ${claim.claimId}`);
  assert(authorityEvidenceIds.has(claim.evidenceRef), `undefined metric evidence: ${claim.claimId}`);
  assert(matrix.includes(claim.claimId), `metric absent from claims matrix: ${claim.claimId}`);
}
for (const binding of metricBindings) {
  assert(manifestIds.has(binding.id), `authority metric is missing from manifest: ${binding.id}`);
}
for (const [surface, count] of expectedSurfaceCounts) {
  assert.equal(surfaceCounts.get(surface), count, `public claim count mismatch for ${surface}`);
}

// Current public statuses are single-source and exact across card/detail data.
const statusContract = new Map([
  ["data-platform", authority.public_cases.feishu_data_platform.status],
  ["service-agent", authority.public_cases.service_agent.status],
  ["lumen-ink", authority.public_cases.lumen.status],
]);
const normalizedProjectsSource = projectsSource.replace(/\r\n/g, "\n");
for (const [slug, status] of statusContract) {
  const projectStart = normalizedProjectsSource.indexOf(`\n  {\n    slug: "${slug}",\n    index:`);
  assert(projectStart >= 0, `missing flagship project: ${slug}`);
  const projectEnd = normalizedProjectsSource.indexOf("\n  {\n    slug:", projectStart + 5);
  const projectSegment = normalizedProjectsSource.slice(
    projectStart,
    projectEnd < 0 ? normalizedProjectsSource.indexOf("\n];", projectStart) : projectEnd,
  );
  assert(projectSegment.includes(`status: "${status}"`), `${slug} project status differs from authority`);
  assert(projectSegment.includes(`metrics: getPublicMetrics("${slug}")`), `${slug} metrics are not manifest-driven`);
  assert(caseSources[slug].includes(`status: "${status}"`), `${slug} case status differs from authority`);
}
assert(featuredSource.includes("projects.map"), "featured cards must stay data-driven");
for (const status of statusContract.values()) {
  assert(!featuredSource.includes(status), "FeaturedCases must not duplicate a flagship status literal");
}

// Homepage and route selection remain data-driven; supporting projects preserve the legacy renderer.
assert(homeSource.includes('const featuredProjects = ["data-platform", "service-agent", "lumen-ink"]'), "flagship homepage order changed");
assert(homeSource.includes('const heroMetrics = getPublicMetrics("hero")'), "hero metrics must use the public manifest");
assert(routeSource.includes("return projects.map"), "static params must derive from projects");
assert(routeSource.includes("if (!project) notFound()"), "unknown project routes must fail closed");
assert(routeSource.includes("getFlagshipCaseStudy(slug)"), "route must resolve the flagship registry");
assert(routeSource.includes("<FlagshipCasePage"), "flagship renderer is not selected");
assert(routeSource.includes("<LegacyProjectPage"), "supporting projects lost the legacy renderer");

function quotedValues(block) {
  return [...block.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function findArray(source, field) {
  const match = source.match(new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]`));
  assert(match, `missing array field: ${field}`);
  return quotedValues(match[1]);
}

// Narrative facts are evidence-bound, and overview claims resolve to the metric manifest.
for (const [slug, source] of Object.entries(caseSources)) {
  for (const claimId of findArray(source, "claimIds")) {
    assert(manifestIds.has(claimId), `${slug} overview references an unknown claim: ${claimId}`);
  }
  const refs = new Set([...source.matchAll(/"(E-[A-Z0-9-]+)"/g)].map((match) => match[1]));
  for (const ref of refs) {
    assert(authorityEvidenceIds.has(ref), `${slug} narrative references undefined authority evidence: ${ref}`);
  }
}

// Parse the shared evidence inventory and bind every case evidence ID to the same project slug.
const projectVariableToSlug = new Map([
  ["dataPlatform", "data-platform"],
  ["serviceAgent", "service-agent"],
  ["lumenInk", "lumen-ink"],
]);
const evidenceProjectById = new Map();
for (const match of evidenceSource.matchAll(/buildEvidence\((dataPlatform|serviceAgent|lumenInk),\s*\{([\s\S]*?)\n\s*\}\),/g)) {
  const idMatch = match[2].match(/\bid:\s*"([^"]+)"/);
  assert(idMatch, `evidence record for ${match[1]} is missing an ID`);
  const id = idMatch[1];
  assert(!evidenceProjectById.has(id), `duplicate evidence record: ${id}`);
  evidenceProjectById.set(id, projectVariableToSlug.get(match[1]));
}
assert(evidenceProjectById.size >= 14, "flagship evidence inventory is incomplete");
for (const [slug, source] of Object.entries(caseSources)) {
  for (const evidenceId of findArray(source, "evidenceIds")) {
    assert(evidenceProjectById.has(evidenceId), `${slug} references missing evidence item: ${evidenceId}`);
    assert.equal(evidenceProjectById.get(evidenceId), slug, `${evidenceId} is bound to the wrong project`);
  }
}

// Available guide sources are restricted to public-safe evidence with authority refs.
assert(guideSource.includes('item.publicSafe && item.state === "available" && item.evidenceRefs.length > 0'), "guide filtering is not fail-closed");
assert(guideSource.includes("flagshipCaseStudies"), "guide does not consume the flagship narrative registry");
assert(guideSource.includes('公开证据 ${document.evidenceIds.join("、")}'), "guide context omits evidence IDs");
for (const label of ["项目概览", "业务判断", "产品方案", "技术实现", "迭代链路", "项目证据"]) {
  assert(guideSource.includes(label), `guide is missing flagship section: ${label}`);
}

// Public case surfaces must not expose superseded or report-only values.
const publicCaseSurface = [projectsSource, evidenceSource, guideSource, ...Object.values(caseSources)].join("\n");
for (const forbidden of ["589", "后端修复中", "真实编辑待验证", "缺少生产只读权限", "52/90", "16/16", "3/3"]) {
  assert(!publicCaseSurface.includes(forbidden), `superseded or internal-only public phrase: ${forbidden}`);
}
assert(!/(?:准确率|accuracy)\s*(?:为|[:：=])?\s*\d+(?:\.\d+)?%/i.test(publicCaseSurface), "public surface contains an unsupported accuracy percentage");
const regressionClaim = publicClaims.find((claim) => claim.claimId === "SCS-REGRESSION-COUNT");
assert.equal(regressionClaim?.note, "工程回归计数，不代表准确率或回答质量", "regression count boundary is missing");
assert(publicCaseSurface.includes("公网前端已接入 CloudBase Deploy 039 后端"), "Service Agent frontend/backend boundary is missing");
assert(publicCaseSurface.includes("历史 Test Base"), "Feishu historical baseline boundary is missing");
assert(publicCaseSurface.includes("生产 Schema 元数据只读检查"), "Feishu production read-only boundary is missing");
assert(publicCaseSurface.includes("液化、修复、消除和其他模式仍未验证"), "Lumen unverified mode boundary is missing");

// Evidence source and derived diagrams are public-safe and avoid legacy screenshots.
for (const legacyAsset of [
  "/projects/service-agent/01.webp",
  "/projects/service-agent/02.webp",
  "/projects/service-agent/03.webp",
  "/projects/service-agent/04.webp",
  "/projects/service-agent/05.webp",
  "/projects/service-agent/06.webp",
  "/projects/service-agent/07.webp",
  "/projects/data-platform/01.webp",
]) {
  assert(!publicCaseSurface.includes(legacyAsset), `unsafe legacy asset is still referenced: ${legacyAsset}`);
}
for (const asset of [
  "public/evidence/data-platform/closed-loop.svg",
  "public/evidence/service-agent/risk-workflow.svg",
  "public/evidence/lumen/provider-boundary.svg",
]) {
  assert(existsSync(resolve(root, asset)), `derived evidence asset is missing: ${asset}`);
  const svg = read(asset);
  assert(/<title(?:\s|>)/.test(svg), `${asset} is missing an accessible title`);
  assert(/<desc(?:\s|>)/.test(svg), `${asset} is missing an accessible description`);
}
const operationalSecretPatterns = [
  /\b(?:cli|tbl)[A-Za-z0-9_-]{8,}\b/,
  /Bearer\s+[A-Za-z0-9._-]+/i,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/,
  /[A-Z]:\\/,
];
for (const [name, body] of Object.entries({ evidenceSource, ...caseSources })) {
  for (const pattern of operationalSecretPatterns) {
    assert(!pattern.test(body), `${name} contains a public-safety identifier: ${pattern}`);
  }
}

// Canonical public-origin and resume contracts remain intact.
const publicOrigin = authority.website.public_url;
const layout = read("app/layout.tsx");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const header = read("components/Header.tsx");
assert(layout.includes(`metadataBase: new URL("${publicOrigin}")`), "metadata origin differs from authority");
assert(sitemap.includes(publicOrigin), "sitemap origin differs from authority");
assert(robots.includes(`${publicOrigin}/sitemap.xml`), "robots sitemap differs from authority");
assert(routeSource.includes(`${publicOrigin}/projects/`), "case OpenGraph origin differs from authority");
assert(header.includes("/resume/chen-jiawei-ai-agent-cn-two-page.pdf"), "resume CTA is not canonical");
for (const resume of [
  "public/resume/chen-jiawei-ai-agent-cn-two-page.pdf",
  "public/resume/chen-jiawei-ai-agent-cn-two-page.docx",
  "public/resume/chen-jiawei-ai-agent-cn-two-page.txt",
  "public/resume/jiawei-chen-ai-agent-en.pdf",
]) {
  assert(existsSync(resolve(root, resume)), `resume asset missing: ${resume}`);
}

// Scan tracked text files for literal credentials. Public contact details are intentionally out of scope.
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const binaryExtensions = new Set([".pdf", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".woff", ".woff2"]);
const credentialPatterns = [
  /(?:base_token|app_token)\s+[`"']?[A-Za-z0-9_-]{16,}/i,
  /(?:app_secret|client_secret|api_key)\s*[:=]\s*[`"']?[A-Za-z0-9_-]{12,}/i,
  /Bearer\s+[A-Za-z0-9._-]{16,}/i,
];
for (const file of tracked) {
  if (file.startsWith("tests/")) continue;
  if (binaryExtensions.has(extname(file).toLowerCase())) continue;
  const absolute = resolve(root, file);
  if (!existsSync(absolute)) continue;
  const body = readFileSync(absolute, "utf8");
  for (const pattern of credentialPatterns) {
    assert(!pattern.test(body), `tracked release file contains a literal credential: ${file}`);
  }
}

console.log(
  `Portfolio consistency gate passed: 21 structured claims from package ${authority.package.id}; ` +
    `${authorityEvidenceIds.size} authority evidence IDs; ${evidenceProjectById.size} public evidence records; ${tracked.length} tracked files scanned.`,
);
