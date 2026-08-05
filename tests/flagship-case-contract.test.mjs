import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const caseFiles = {
  "data-platform": "content/flagship-cases/data-platform.ts",
  "service-agent": "content/flagship-cases/service-agent.ts",
  "lumen-ink": "content/flagship-cases/lumen-ink.ts",
};

function countInBlock(source, key, token) {
  const start = source.indexOf(`${key}:`);
  assert.ok(start >= 0, `missing block ${key}`);
  const tail = source.slice(start);
  const nextTopLevel = tail.slice(1).search(/\n  [a-zA-Z]+:/);
  const block = nextTopLevel >= 0 ? tail.slice(0, nextTopLevel + 1) : tail;
  return (block.match(new RegExp(token, "g")) ?? []).length;
}

test("flagship registry is strict and exposes only the three approved slugs", async () => {
  const registry = await read("content/flagship-cases/index.ts");
  assert.match(registry, /const flagshipCases = \{/);
  for (const slug of Object.keys(caseFiles)) assert.match(registry, new RegExp(`"${slug}"`));
  assert.doesNotMatch(registry, /"(?:wechat-bot|collator|content-research|mini-program|brand-website|lora-finetuning)"\s*:/);
  assert.match(registry, /satisfies Record<FlagshipSlug, FlagshipCaseStudy>/);
});

test("every flagship case defines the six-section narrative contract", async () => {
  for (const [slug, file] of Object.entries(caseFiles)) {
    const source = await read(file);
    assert.match(source, new RegExp(`slug: "${slug}"`));
    for (const key of ["overview", "business", "product", "technical", "iterations", "evidenceIds"]) {
      assert.match(source, new RegExp(`\\b${key}:`), `${slug} missing ${key}`);
    }
    assert.ok(countInBlock(source, "business", "evidenceRefs:") >= 4, `${slug} needs business evidence points`);
    assert.ok(countInBlock(source, "product", "evidenceRefs:") >= 5, `${slug} needs product evidence points`);
    assert.ok(countInBlock(source, "technical", "evidenceRefs:") >= 6, `${slug} needs technical evidence points`);
    assert.ok(countInBlock(source, "iterations", "version:") >= 3, `${slug} needs iteration entries`);
    const evidenceBlock = source.slice(source.indexOf("evidenceIds:"));
    assert.ok((evidenceBlock.match(/"[a-z0-9-]+"/g) ?? []).length >= 4, `${slug} needs evidence IDs`);
    assert.doesNotMatch(source, /metricValue|metricLabel|metric:\s*\{/);
  }
});

test("public status lines exactly match the R1.3 content contract", async () => {
  const expected = {
    "data-platform": "Portfolio Pilot｜真实测试 Base E2E 已验证，生产 V2 Schema 表级匹配通过（10/10），正式业务 Pilot 待启用",
    "service-agent": "公网实时 Demo｜受控生产验证",
    "lumen-ink": "Live Demo｜真实 Provider 编辑已验证",
  };
  const projects = await read("content/projects.ts");
  for (const [slug, status] of Object.entries(expected)) {
    const source = await read(caseFiles[slug]);
    assert.ok(source.includes(status), `${slug} case status mismatch`);
    const start = projects.indexOf(`
    slug: "${slug}"`);
    const next = projects.indexOf("\n  {\n    slug:", start + 1);
    assert.ok(projects.slice(start, next < 0 ? projects.length : next).includes(status), `${slug} project status mismatch`);
  }
});

test("Service Agent keeps Phase G public while report-only values stay internal", async () => {
  const source = await read(caseFiles["service-agent"]);
  assert.match(source, /Phase G 已验证/);
  for (const forbidden of ["16/16", "3/3", "52/90", "589", "准确率为", "准确率：", "准确率="]) {
    assert.equal(source.includes(forbidden), false, `Service Agent contains ${forbidden}`);
  }
});

test("data platform separates Test Base history from production read-only inspection", async () => {
  const source = await read(caseFiles["data-platform"]);
  assert.match(source, /历史 Test Base 的 17 \/ 12/);
  assert.match(source, /生产只读检查为 10 \/ 216/);
  assert.match(source, /字段级差异/);
  assert.match(source, /正式业务写入仍保持 fail-closed/);
});

test("Lumen limits verification to two Seedream operations", async () => {
  const source = await read(caseFiles["lumen-ink"]);
  assert.match(source, /仅 Seedream 4\.5 文生图与图生图两项操作完成真实验证/);
  assert.match(source, /液化、修复、消除/);
  assert.match(source, /LUMEN-EDIT-VERIFY/);
  assert.match(source, /登录链路仍可能/);
  assert.match(source, /fail-closed 返回 503/);
  assert.match(source, /不能表述为全面可用/);
});

test("Service Agent public workflow distinguishes core nodes from auxiliary stages", async () => {
  const projects = await read("content/projects.ts");
  const caseSource = await read(
    "content/flagship-cases/service-agent.ts",
  );

  const combined = `${projects}\n${caseSource}`;

  for (const label of [
    "N01 输入与 Stage 初始化",
    "N02 意图识别",
    "N03 R0–R3 风险分级",
    "N03.5 多轮查询解析与改写",
    "N04 知识检索",
    "N04.5 候选重排与上下文构建",
    "N05 标准话术或 LLM 回答生成",
    "N06 回答质量与证据检查",
    "Aux-01 单次反思",
    "Aux-02 失败升级",
    "N07 fail-closed 人工接管",
    "N08 输出与执行轨迹",
  ]) {
    assert.ok(combined.includes(label), `missing workflow stage: ${label}`);
  }

  assert.match(combined, /8 个核心节点、11 条主边/);
  assert.doesNotMatch(combined, /公开前端仍为静态降级/);
});

test("shared project summaries contain no superseded flagship language", async () => {
  const source = await read("content/projects.ts");
  for (const stale of ["589", "后端修复中", "真实编辑待验证", "缺少生产只读权限", "只读授权缺失"]) {
    assert.equal(source.includes(stale), false, `stale phrase: ${stale}`);
  }
});

test("evidence catalog uses exact states and keeps planned items non-interactive", async () => {
  const source = await read("content/portfolio-evidence.ts");
  assert.match(source, /export type EvidenceState = "available" \| "planned" \| "unavailable"/);
  assert.doesNotMatch(source, /\bmock\b/);
  assert.match(source, /Planned evidence cannot expose a live primary control/);
  for (const id of [
    "data-platform-closed-loop",
    "data-platform-schema-verification",
    "data-platform-e2e-verification",
    "data-platform-portal-entry",
    "data-platform-walkthrough",
    "service-agent-risk-workflow",
    "service-agent-phase-g-summary",
    "service-agent-controlled-demo",
    "service-agent-live-frontend",
    "service-agent-live-demo-01",
    "service-agent-live-demo-02",
    "lumen-workbench",
    "lumen-provider-boundary",
    "lumen-edit-verification",
    "lumen-live-entry",
    "lumen-walkthrough",
  ]) assert.ok(source.includes(`id: "${id}"`), `missing evidence ${id}`);
  // data-platform-walkthrough / lumen-walkthrough are now available
  // validation-boundary cards, replacing the old "待补素材" planned stubs.
  // Keep guarding ANY remaining planned evidence so it never exposes a live control.
  for (const block of source.split("\n  buildEvidence(").slice(1)) {
    if (!/state: "planned"/.test(block)) continue;
    assert.doesNotMatch(block, /\bhref:/);
    assert.doesNotMatch(block, /\bassetUrl:/);
  }
  const portalStart = source.indexOf('id: "data-platform-portal-entry"');
  const portalNext = source.indexOf("\n  buildEvidence(", portalStart + 1);
  const portalBlock = source.slice(
    portalStart,
    portalNext < 0 ? source.length : portalNext,
  );

  assert.match(portalBlock, /state: "available"/);
  assert.match(
    portalBlock,
    /href: "https:\/\/portal-seven-jade-47\.vercel\.app\/"/,
  );
  assert.match(portalBlock, /不作为成功写入案例/);
  for (const [videoId, assetName] of [
    ["service-agent-live-demo-01", "live-demo-01"],
    ["service-agent-live-demo-02", "live-demo-02"],
  ]) {
    const start = source.indexOf(`id: "${videoId}"`);
    const next = source.indexOf("\n  buildEvidence(", start + 1);
    const block = source.slice(start, next < 0 ? source.length : next);
    assert.match(block, /state: "available"/);
    assert.ok(block.includes(`assetUrl: "/evidence/service-agent/${assetName}.mp4"`));
    assert.ok(block.includes(`thumbnailUrl: "/evidence/service-agent/${assetName}.webp"`));
  }
});

test("available local assets are public-safe diagrams or the reviewed Lumen UI", async () => {
  const evidence = await read("content/portfolio-evidence.ts");
  for (const match of evidence.matchAll(/assetUrl: "([^"]+)"/g)) {
    const path = match[1];
    assert.ok(path.startsWith("/evidence/") || path === "/projects/lumen-ink/01.webp", `unsafe asset path: ${path}`);
  }
  assert.doesNotMatch(evidence, /\/projects\/service-agent\/(?:0[1-7])\.webp/);
  assert.doesNotMatch(evidence, /\/projects\/data-platform\/01\.webp/);
  const projects = await read("content/projects.ts");
  assert.doesNotMatch(projects, /Array\.from\(\{ length: 7 \}[^\n]+service-agent/);
  assert.doesNotMatch(projects, /Array\.from\(\{ length: 10 \}[^\n]+data-platform/);
});

test("flagship evidence sources contain no literal private identifiers", async () => {
  const combined = await Promise.all([
    read("content/portfolio-evidence.ts"),
    ...Object.values(caseFiles).map(read),
    read("public/evidence/data-platform/closed-loop.svg"),
    read("public/evidence/service-agent/risk-workflow.svg"),
    read("public/evidence/lumen/provider-boundary.svg"),
  ]).then((parts) => parts.join("\n"));
  for (const pattern of [
    /[A-Z]:\\/,
    /\bcli_[A-Za-z0-9]+\b/,
    /\btbl[A-Za-z0-9]{8,}\b/,
    /Bearer\s+[A-Za-z0-9._-]+/,
    /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\./,
    /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,
    /\b1[3-9]\d{9}\b/,
  ]) assert.doesNotMatch(combined, pattern);
});

test("dynamic route selects the flagship renderer without regressing supporting projects", async () => {
  const route = await read("app/projects/[slug]/page.tsx");
  assert.match(route, /getFlagshipCaseStudy\(slug\)/);
  assert.match(route, /if \(study\) \{[\s\S]*<FlagshipCasePage/);
  assert.match(route, /<LegacyProjectPage project=\{project\} previous=\{previous\} next=\{next\}/);
  assert.match(route, /return projects\.map\(\(project\) => \(\{ slug: project\.slug \}\)\)/);
  assert.match(route, /if \(!project\) notFound\(\)/);
  assert.match(route, /generateMetadata/);
});

test("flagship renderer exposes exactly six addressable server-rendered sections", async () => {
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  const expected = [
    '<CaseOverview id="overview"',
    '<CaseEvidenceGallery id="evidence"',
    '<BusinessContext id="business"',
    '<ProductDesign id="product"',
    '<TechnicalImplementation id="technical"',
    '<IterationPath id="iterations"',
  ];
  const positions = expected.map((token) => page.indexOf(token));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(page, /<CaseSectionNav items=\{CASE_SECTIONS\}/);
});

test("product and technical sections expose bounded grid contracts", async () => {
  const product = await read("components/case-study/ProductDesign.tsx");
  const technical = await read("components/case-study/TechnicalImplementation.tsx");
  assert.match(product, /className="case-balanced-grid"/);
  assert.match(technical, /className="case-technical-grid"/);
  assert.match(technical, /case-technical-card-wide/);
});

test("section navigation is ordered, active, scroll-aware and progressively enhanced", async () => {
  const source = await read("components/case-study/CaseSectionNav.tsx");
  assert.match(source, /^"use client";/);
  const labels = ["项目概览", "项目展示", "业务判断", "产品方案", "技术实现", "迭代链路"];
  const ids = ["overview", "evidence", "business", "product", "technical", "iterations"];
  const positions = labels.map((label) => source.indexOf(`"${label}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  for (const id of ids) assert.ok(source.includes(`"${id}"`));
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /rootMargin: `-\$\{offset\}px 0px -55% 0px`/);
  assert.match(source, /threshold: \[0, 0\.2, 0\.6\]/);
  assert.match(source, /!\("IntersectionObserver" in window\)/);
  assert.match(source, /aria-current=\{activeId === item\.id \? "location" : undefined\}/);
  assert.match(source, /aria-label="案例板块导航"/);
  assert.match(source, /getStickyOffset/);
  assert.match(source, /ResizeObserver/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /window\.scrollTo/);
  assert.match(source, /window\.history\.replaceState/);
  assert.match(source, /preventDefault/);
});

test("evidence gallery renders bounded media, links and explicit missing states", async () => {
  const gallery = await read("components/case-study/CaseEvidenceGallery.tsx");
  const media = await read("components/case-study/EvidenceMedia.tsx");
  assert.match(gallery, /planned: "待补素材"/);
  assert.match(gallery, /unavailable: "暂不可用"/);
  assert.match(gallery, /item\.verifiedAt \?\? "待补素材"/);
  assert.match(gallery, /item\.scope/);
  assert.match(gallery, /item\.boundary/);
  assert.match(gallery, /item\.evidenceRefs\.join/);
  assert.match(media, /if \(item\.state !== "available"\) return null/);
  assert.match(media, /<video[\s\S]*controls[\s\S]*preload="metadata"[\s\S]*poster=\{item\.thumbnailUrl\}/);
  assert.doesNotMatch(media, /autoPlay/);
  assert.match(media, /playsInline/);
  assert.doesNotMatch(media, /<iframe/);
  assert.match(media, /item\.transcript \?\? item\.summary/);
  assert.match(media, /target="_blank" rel="noreferrer"/);
  assert.match(media, /item\.kind === "interactive" && item\.href/);
  assert.match(media, /onError=\{\(\) => setFailed\(true\)\}/);
  assert.match(media, /item\.state === "available" && item\.fallbackHref/);
  assert.match(media, /解释性架构图/);
  assert.match(media, /公开产品界面/);
});

test("case stylesheet implements the approved paper palette and responsive navigation", async () => {
  const css = await read("app/case-study.css");
  const lower = css.toLowerCase();
  for (const color of ["#f2eee4", "#fbf8f1", "#1c1820", "#4f4054", "#b9a7c1", "#e7dde9", "#718c7b", "#d4ccc1"]) {
    assert.ok(lower.includes(color), `missing color ${color}`);
  }
  assert.match(css, /\.flagship-case-body\s*\{[^}]*display:\s*block;/s);
  assert.match(css, /\.case-section-nav\s*\{[^}]*top:\s*106px;[^}]*max-height:\s*none;/s);
  assert.match(css, /\.case-section-nav-inner\s*\{[^}]*overflow-x:\s*auto;/s);
  assert.match(css, /background:\s*rgba\(251, 248, 241, \.82\)/);
  assert.doesNotMatch(css, /\.case-section-nav\s*\{[^}]*(?:#000|#111|#171b27|#1C1820)/s);
  assert.match(css, /\.flagship-section\s*\{[^}]*scroll-margin-top:\s*178px;/s);
  assert.match(css, /\.flagship-product-section \.case-balanced-grid[\s\S]*grid-template-columns:/);
  assert.match(css, /\.case-technical-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.case-technical-card-wide\s*\{[^}]*grid-column:\s*1 \/ -1;/);
  assert.match(css, /@media \(max-width: 1279px\)[\s\S]*\.case-section-nav\s*\{[^}]*top:\s*92px;[^}]*height:\s*auto;[^}]*max-height:\s*none;/);
  assert.match(css, /@media \(max-width: 1279px\)[\s\S]*\.case-section-nav-inner\s*\{[^}]*min-height:\s*50px;/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.iteration-path\s*\{[^}]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.case-section-nav\s*\{[^}]*top:\s*76px;/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.iteration-path\s*\{[^}]*grid-template-columns:\s*repeat\(1/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /white-space:\s*nowrap/);
  assert.match(css, /min-height:\s*40px/);
  assert.match(css, /:focus-visible/);
  const layout = await read("app/layout.tsx");
  assert.ok(layout.indexOf('import "./case-study.css";') > layout.indexOf('import "./editorial-responsive.css";'));
});
