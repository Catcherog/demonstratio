import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(path) {
  try {
    return await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") return "";
    throw error;
  }
}

test("homepage uses approved V5 tokens and drops the old blue accent", async () => {
  const css = (await read("app/globals.css")).toLowerCase();
  for (const token of [
    "#f2eee4",
    "#e9e2d7",
    "#faf7ef",
    "#1b181f",
    "#b9a7c1",
    "#65536d",
    "#493c50",
    "#6f6872",
  ]) {
    assert.match(css, new RegExp(token));
  }
  assert.doesNotMatch(css, /#5368e8/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("homepage keeps the approved section order and full guide", async () => {
  const page = await read("app/page.tsx");
  const expected = [
    "<Hero",
    "<FeaturedCases",
    "<ProductMethod",
    "<PortfolioGuide",
    "<ProjectLibrary",
    "<ExperienceContact",
  ];
  const positions = expected.map((token) => page.indexOf(token));
  assert.equal(positions.every((position) => position >= 0), true);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test("three flagship cases stay data-driven and use the current two-page resume", async () => {
  const projects = await read("content/projects.ts");
  const featured = await read("components/home/FeaturedCases.tsx");
  const hero = await read("components/home/Hero.tsx");
  assert.match(projects, /\["data-platform", "service-agent", "lumen-ink"\]/);
  assert.match(featured, /projects\.map/);
  assert.match(hero, /chen-jiawei-ai-agent-cn-two-page\.pdf/);
});

test("supporting library excludes the frontend-only Feishu Portal", async () => {
  const projects = await read("content/projects.ts");
  assert.doesNotMatch(projects, /slug:\s*"feishu-portal"/);
});

test("guide is a full section between product method and project library", async () => {
  const page = await read("app/page.tsx");
  const guide = await read("components/PortfolioGuide.tsx");
  assert.ok(page.indexOf("<ProductMethod") < page.indexOf("<PortfolioGuide"));
  assert.ok(page.indexOf("<PortfolioGuide") < page.indexOf("<ProjectLibrary"));
  assert.match(guide, /<section className="guide-section" id="portfolio-guide">/);
  assert.match(guide, /招聘官/);
  assert.match(guide, /产品负责人/);
  assert.match(guide, /技术面试官/);
});

test("continuous paper editorial layer unifies every homepage section", async () => {
  const css = (await read("app/editorial-responsive.css")).toLowerCase();

  for (const token of [
    "--editorial-paper: #f3eee4",
    "--editorial-paper-high: #fbf8f1",
    "--editorial-ink: #1c1820",
    "--editorial-plum: #4f4054",
    "--editorial-sage: #718c7b",
    "--editorial-sage-soft: #dfe7de",
    "--editorial-lilac-soft: #e7dde9",
  ]) {
    assert.match(css, new RegExp(token));
  }

  for (const selector of [
    ".system-section > .section-shell",
    ".method-section > .section-shell",
    ".guide-section > .section-shell",
    ".experience-section > .section-shell",
    ".contact-section > .contact-layout",
  ]) {
    assert.ok(css.includes(selector), `missing full-page selector: ${selector}`);
  }

  assert.match(css, /editorial_continuous_paper_a_start/);
  assert.match(css, /\.system-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.method-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.guide-section\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.guide-section\s*\{[^}]*background:\s*transparent\s*!important/s);
  assert.match(css, /\.guide-window-head\s*\{[^}]*background:\s*var\(--editorial-paper-high\)\s*!important/s);
  assert.match(css, /\.guide-form button\s*\{[^}]*background:\s*var\(--editorial-plum\)\s*!important/s);
  assert.match(css, /\.guide-intro > p:not\(\.eyebrow\)\s*\{[^}]*color:\s*#59655d\s*!important/s);
  assert.match(css, /editorial_readability_floor_start/);
  assert.match(css, /\.flagship-summary,[^}]*font-size:\s*14px/s);
  assert.match(css, /\.guide-role-tabs small,[^}]*font-size:\s*11px/s);
  assert.match(css, /\.flywheel-center strong\s*\{[^}]*color:\s*var\(--editorial-paper-high\)/s);
  assert.match(css, /\.guide-proof strong\s*\{[^}]*color:\s*var\(--editorial-ink\)/s);
  assert.match(css, /\.guide-proof span\s*\{[^}]*color:\s*#59655d/s);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(css, /#0c0f17|#0d1017|#191b18/);
});

test("Jael identity and guide submit states stay legible at compact sizes", async () => {
  const header = await read("components/Header.tsx");
  const guide = await read("components/PortfolioGuide.tsx");
  const icon = await read("app/icon.svg");
  const css = await read("app/editorial-responsive.css");

  assert.match(header, /className="brand-signature"[^>]*>\s*Jael\s*</);
  assert.doesNotMatch(header, /className="brand-mark"[^>]*>\s*CJ\s*</);

  assert.match(guide, /aria-label=\{loading \? "正在生成回答" : "发送问题"\}/);
  assert.match(guide, /guide-submit-icon/);
  assert.match(guide, /guide-submit-spinner/);
  assert.doesNotMatch(guide, /loading \? "思考中" : "发送"/);

  assert.match(icon, /<path\b/);
  assert.doesNotMatch(icon, /<text\b/);
  assert.match(css, /\.guide-submit-spinner\s*\{[^}]*animation:/s);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.guide-submit-spinner\s*\{[^}]*animation:\s*none/s);
});
