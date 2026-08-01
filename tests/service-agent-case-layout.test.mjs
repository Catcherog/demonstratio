import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL("../" + relativePath, import.meta.url), "utf8");
}

test("Service Agent uses a live data default and collapses duplicate interactive entries", async () => {
  const caseSource = await read("content/flagship-cases/service-agent.ts");
  const types = await read("content/flagship-cases/types.ts");
  const gallery = await read("components/case-study/CaseEvidenceGallery.tsx");
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  for (const id of ["overview", "evidence", "business", "product", "technical", "iterations"]) {
    assert.match(page, new RegExp(`id=\\"${id}\\"`));
  }
  assert.match(caseSource, /demoStatus:\s*"live"/);
  assert.match(types, /DemoStatus\s*=\s*"live"\s*\|\s*"fallback"/);
  assert.match(types, /override === "live" \|\| override === "fallback"/);
  assert.match(types, /:\s*defaultStatus;/);
  assert.match(page, /resolveDemoStatus/);
  assert.match(page, /demoStatus=/);
  assert.match(gallery, /primaryInteractive/);
  assert.match(gallery, /backupInteractive/);
  assert.match(gallery, /备用模式/);
  assert.match(gallery, /当前仅作为备用模式说明，不作为主入口展示/);
  assert.doesNotMatch(gallery, /实时入口异常时由 Demo 自身降级处理/);
  assert.match(gallery, /kind !== "interactive"/);
});

test("technical implementation keeps the seven-point grid and wide final card", async () => {
  const component = await read("components/case-study/TechnicalImplementation.tsx");
  const css = await read("app/case-study.css");
  assert.match(component, /case-technical-grid/);
  assert.match(component, /case-technical-card-wide/);
  assert.match(css, /\.case-technical-grid[\s\S]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.case-technical-card-wide[\s\S]*grid-column:\s*1\s*\/\s*-1/);
});

test("intermediate widths retain centered container gutters", async () => {
  const css = await read("app/case-study.css");
  assert.match(css, /@media \(max-width: 1279px\)[\s\S]*\.flagship-case \.flagship-case-body\s*\{[^}]*width:\s*min\(1120px,\s*calc\(100% - 48px\)\);[^}]*margin-inline:\s*auto;/);
  assert.match(css, /@media \(max-width: 1023px\)[\s\S]*\.flagship-case \.flagship-case-body\s*\{[^}]*width:\s*min\(1120px,\s*calc\(100% - 48px\)\);[^}]*margin-inline:\s*auto;/);
});

test("technical card evidence stays pinned to the bottom", async () => {
  const css = await read("app/case-study.css");
  assert.match(css, /\.case-technical-card \.case-narrative-card\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*height:\s*100%;/);
  assert.match(css, /\.case-technical-card \.case-narrative-card small\s*\{[^}]*margin-top:\s*auto;/);
  const sharedSmallRule = css.indexOf(".case-narrative-card small,");
  const technicalSmallRule = css.indexOf(".case-technical-card .case-narrative-card small");
  assert.ok(sharedSmallRule >= 0, "shared small rule should exist");
  assert.ok(technicalSmallRule > sharedSmallRule, "technical small override must follow shared small rule");
});

test("iteration path is a bounded 3/2/1 responsive grid", async () => {
  const css = await read("app/case-study.css");
  assert.match(css, /\.iteration-path[\s\S]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /@media \(max-width: 1180px\)[\s\S]*\.iteration-path[\s\S]*repeat\(2/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.iteration-path[\s\S]*repeat\(1/);
  assert.match(css, /\.iteration-path[\s\S]*overflow-x:\s*visible/);
  assert.doesNotMatch(css, /\.iteration-path[\s\S]*overflow-x:\s*auto/);
});

test("wide screens use an editorial horizontal track instead of a left navigation column", async () => {
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  const css = await read("app/case-study.css");
  assert.match(page, /CaseSectionNav/);
  assert.match(css, /\.case-section-nav[\s\S]*position:\s*sticky/);
  assert.match(css, /\.case-section-nav-inner[\s\S]*overflow-x:\s*(auto|scroll)/);
  assert.doesNotMatch(css, /grid-template-columns:\s*168px\s+minmax\(0,\s*1fr\)/);
  assert.doesNotMatch(css, /\.case-section-nav\s*\{[^}]*border-radius:\s*22px/);
});

test("homepage punctuation, Service Agent editorial structure and deterministic return links are explicit", async () => {
  const hero = await read("components/home/Hero.tsx");
  const caseHero = await read("components/case-study/CaseHero.tsx");
  const nav = await read("components/case-study/CaseSectionNav.tsx");
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  const header = await read("components/Header.tsx");

  assert.doesNotMatch(hero, /AI 产品。/);
  assert.match(caseHero, /project\.slug\s*===\s*["']service-agent["']/);
  for (const label of ["理解问题", "检索证据", "生成回答", "拒答或转人工"]) {
    assert.match(caseHero, new RegExp(label));
  }
  assert.match(nav, /window\.scrollTo/);
  assert.match(nav, /history\.replaceState/);
  assert.match(nav, /getBoundingClientRect/);
  assert.match(nav, /prefers-reduced-motion/);
  assert.match(page, /href=["']\/["'][^>]*>返回主页面/);
  assert.match(header, /className=["']brand["'][^>]*href=["']\/["']/);
});

test("section navigation measures its offset and re-calibrates after layout changes", async () => {
  const nav = await read("components/case-study/CaseSectionNav.tsx");
  assert.match(nav, /getStickyOffset/);
  assert.match(nav, /ResizeObserver/);
  assert.match(nav, /requestAnimationFrame/);
  assert.match(nav, /window\.history\.replaceState/);
  for (const id of ["overview", "evidence", "business", "product", "technical", "iterations"]) {
    assert.match(nav, new RegExp(`['"]${id}['"]`));
  }
});
