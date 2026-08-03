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
    "lumen-live-demo",
  ]) assert.ok(source.includes(`id: "${id}"`), `missing evidence ${id}`);
  for (const plannedId of ["data-platform-portal-entry", "data-platform-walkthrough"]) {
    const start = source.indexOf(`id: "${plannedId}"`);
    const next = source.indexOf("\n  buildEvidence(", start + 1);
    const block = source.slice(start, next < 0 ? source.length : next);
    assert.match(block, /state: "planned"/);
    assert.doesNotMatch(block, /\bhref:/);
    assert.doesNotMatch(block, /\bassetUrl:/);
  }
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

test("lumen-live-demo evidence is an available interactive entry pointing to the public workbench", async () => {
  const source = await read("content/portfolio-evidence.ts");
  assert.ok(source.includes('id: "lumen-live-demo"'), "lumen-live-demo evidence must exist");
  assert.ok(!source.includes('id: "lumen-walkthrough"'), "lumen-walkthrough must be fully removed");

  const start = source.indexOf('id: "lumen-live-demo"');
  const next = source.indexOf("\n  buildEvidence(", start + 1);
  const block = source.slice(start, next < 0 ? source.length : next);
  assert.match(block, /kind: "interactive"/, "lumen-live-demo must be interactive");
  assert.match(block, /state: "available"/, "lumen-live-demo must be available");
  assert.ok(
    block.includes('href: "https://lumen-ink.vercel.app/"'),
    "lumen-live-demo href must be exactly https://lumen-ink.vercel.app/",
  );
  assert.match(block, /verifiedAt: "2026-08-03"/, "lumen-live-demo must carry verifiedAt from HTTP verification");
});

test("lumen-ink public evidence catalog has no planned items", async () => {
  const source = await read("content/portfolio-evidence.ts");
  const lumenBlocks = [...source.matchAll(/buildEvidence\(lumenInk,\s*\{([\s\S]*?)\n\s*\}\),/g)];
  assert.ok(lumenBlocks.length >= 5, "lumen-ink must have at least 5 evidence items");
  for (const block of lumenBlocks) {
    assert.doesNotMatch(block[1], /state: "planned"/, "lumen-ink must not expose planned public evidence");
  }
});

test("lumen-ink case binds lumen-live-demo and drops lumen-walkthrough from evidenceIds", async () => {
  const source = await read("content/flagship-cases/lumen-ink.ts");
  const evidenceBlock = source.slice(source.indexOf("evidenceIds:"));
  assert.ok(evidenceBlock.includes('"lumen-live-demo"'), "lumen-ink evidenceIds must include lumen-live-demo");
  assert.ok(!evidenceBlock.includes('"lumen-walkthrough"'), "lumen-ink evidenceIds must not include lumen-walkthrough");
  const expectedIds = ["lumen-workbench", "lumen-provider-boundary", "lumen-edit-verification", "lumen-live-entry", "lumen-live-demo"];
  for (const id of expectedIds) {
    assert.ok(evidenceBlock.includes(`"${id}"`), `lumen-ink evidenceIds missing ${id}`);
  }
});

test("CaseHero applies editorial-flow to both Service Agent and Lumen with intact decision chains", async () => {
  const source = await readFile(new URL("../components/case-study/CaseHero.tsx", import.meta.url), "utf8");
  assert.match(source, /const SERVICE_AGENT_DECISION_CHAIN/);
  assert.match(source, /const LUMEN_DECISION_CHAIN/);
  assert.match(source, /const isEditorialFlow = isServiceAgent \|\| isLumen/);
  assert.match(source, /isEditorialFlow \? " flagship-hero--editorial-flow"/);
  // Service Agent title stays unchanged
  assert.match(source, /case-editorial-title__scene">Studio/);
  assert.match(source, /case-editorial-title__main">Customer/);
  assert.match(source, /case-editorial-title__tail">Service Agent/);
  // Lumen title uses the --lumen modifier
  assert.match(source, /case-editorial-title--lumen/);
  assert.match(source, /case-editorial-title__tail--lumen/);
  assert.match(source, /case-editorial-title__main">\s*光砚/);
  assert.ok(source.includes("AI 图像编辑工作台"), "Lumen tail text must be present");
  // Decision chain renders for both via decisionChain variable
  assert.match(source, /\{decisionChain && \(/);
  assert.match(source, /case-decision-chain--lumen/);
  // Both chains have 4 steps
  const saSteps = (source.match(/index: "0[1-4]"/g) ?? []).length;
  assert.ok(saSteps >= 8, "Service Agent + Lumen decision chains must have 8 step entries total");
});

test("case stylesheet scopes Lumen-only title and decision chain variants", async () => {
  const css = await read("app/case-study.css");
  assert.match(css, /\.case-editorial-title--lumen \.case-editorial-title__main\s*\{/);
  assert.match(css, /\.case-editorial-title__tail--lumen\s*\{/);
  assert.match(css, /\.case-decision-chain--lumen li:last-child/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.case-editorial-title--lumen \.case-editorial-title__tail--lumen/);
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
