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

test("iteration path is a bounded 3/2/1 responsive grid", async () => {
  const css = await read("app/case-study.css");
  assert.match(css, /\.iteration-path[\s\S]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /@media \(max-width: 1180px\)[\s\S]*\.iteration-path[\s\S]*repeat\(2/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.iteration-path[\s\S]*repeat\(1/);
  assert.match(css, /\.iteration-path[\s\S]*overflow-x:\s*visible/);
  assert.doesNotMatch(css, /\.iteration-path[\s\S]*overflow-x:\s*auto/);
});

test("wide-screen section navigation owns a separate sticky layout column", async () => {
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  const css = await read("app/case-study.css");
  assert.match(page, /flagship-case-body/);
  assert.match(page, /flagship-case-sections/);
  assert.match(css, /@media \(min-width: 1280px\)[\s\S]*flagship-case-body[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(min-width: 1280px\)[\s\S]*case-section-nav[\s\S]*position:\s*sticky/);
});
