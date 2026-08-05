import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("flagship live entry stays in hero copy and never overlays the cover", async () => {
  const source = await read("components/case-study/CaseHero.tsx");
  const entry = source.indexOf('<div className="case-hero-experience">');
  const cover = source.indexOf('<div className="case-hero-cover">');
  assert.ok(entry >= 0 && cover >= 0 && entry < cover);
  const coverBlock = source.slice(cover, source.indexOf("</header>", cover));
  assert.doesNotMatch(coverBlock, /LiveExperienceBadge/);
});

test("homepage diagram cards are contained and status is outside media", async () => {
  const component = await read("components/home/FeaturedCases.tsx");
  const css = await read("app/portfolio-polish.css");
  assert.match(component, /flagship-card-diagram/);
  assert.match(component, /flagship-media--diagram/);
  assert.match(component, /flagship-status-line/);
  assert.doesNotMatch(component, /<span title=\{project\.status\}>/);
  assert.match(css, /\.flagship-card-diagram \.flagship-media--diagram img[\s\S]*object-fit:\s*contain/);
});

test("detailed workflow covers keep labels inside bounded nodes", async () => {
  const service = await read("public/evidence/service-agent/cover-detailed.svg");
  const data = await read("public/evidence/data-platform/cover-detailed.svg");

  assert.match(service, /Aux-02 · 失败升级/);
  assert.match(service, /REFLECT → RETRY ONCE/);
  assert.doesNotMatch(service, /stroke-width="18"/);
  assert.doesNotMatch(service, />输入与 Stage 初始化</);

  assert.match(data, /x="1270" y="454" width="250"/);
  assert.match(data, />角色化</);
  assert.match(data, />运营视图</);
  assert.doesNotMatch(data, /x="1360" y="576"/);
});
