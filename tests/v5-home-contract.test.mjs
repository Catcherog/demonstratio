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

test("guide is a full section between product method and project library", async () => {
  const page = await read("app/page.tsx");
  const guide = await read("components/home/PortfolioGuide.tsx");
  assert.ok(page.indexOf("<ProductMethod") < page.indexOf("<PortfolioGuide"));
  assert.ok(page.indexOf("<PortfolioGuide") < page.indexOf("<ProjectLibrary"));
  assert.match(guide, /<section className="guide-section" id="portfolio-guide">/);
  assert.match(guide, /招聘官/);
  assert.match(guide, /产品负责人/);
  assert.match(guide, /技术面试官/);
});
