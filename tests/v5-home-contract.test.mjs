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

test("four highlighted projects stay data-driven and the shared resume entry exposes both languages", async () => {
  const projects = await read("content/projects.ts");
  const featured = await read("components/home/FeaturedCases.tsx");
  const hero = await read("components/home/Hero.tsx");
  const header = await read("components/Header.tsx");
  const resume = await read("app/resume/page.tsx");

  assert.match(projects, /\["service-agent", "data-platform", "lumen-ink", "lora-finetuning"\]/);
  assert.match(featured, /projects\.map/);
  assert.match(hero, /href="\/resume"/);
  assert.match(header, /href="\/resume"/);
  assert.match(resume, /chen-jiawei-ai-agent-cn-two-page\.pdf/);
  assert.match(resume, /jiawei-chen-ai-agent-en\.pdf/);
  assert.match(resume, /download=\{resume\.fileName\}/);
});

test("homepage ranks LoRA fourth and numbers only visible cards", async () => {
  const projectsSource = await read("content/projects.ts");
  const page = await read("app/page.tsx");
  const library = await read("components/ProjectLibrary.tsx");
  const featured = await read("components/home/FeaturedCases.tsx");
  const projectRegistry = projectsSource.slice(
    projectsSource.indexOf("export const projects"),
    projectsSource.indexOf("export const categories"),
  );
  const featuredTrueCount = (projectRegistry.match(/^    featured: true,$/gm) ?? []).length;
  const loraStart = projectRegistry.indexOf('    slug: "lora-finetuning"');
  const loraEnd = projectRegistry.indexOf("\n  },", loraStart);

  assert.equal(featuredTrueCount, 4);
  assert.match(projectsSource, /const homepagePriority = \["service-agent", "data-platform", "lumen-ink", "lora-finetuning"\] as const/);
  assert.match(projectRegistry.slice(loraStart, loraEnd), /featured: true/);
  assert.match(projectRegistry.slice(loraStart, loraEnd), /业务效果独立评测待补/);
  assert.match(page, /homepageProjects/);
  assert.match(library, /\.filter\(\(project\) => !project\.archived\)/);
  assert.match(library, /visible\.map\(\(project\)/);
  assert.match(library, /project\.index/);
  assert.match(featured, /projects\.map\(\(project, index\)/);
  assert.match(featured, /String\(index \+ 1\)\.padStart\(2, "0"\)/);
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

test("public polish layer is loaded last and replaces large purple surfaces with forest and sand", async () => {
  const layout = await read("app/layout.tsx");
  const css = (await read("app/portfolio-polish.css")).toLowerCase();
  const imports = [
    'import "./globals.css"',
    'import "./v5.css"',
    'import "./editorial-responsive.css"',
    'import "./case-study.css"',
    'import "./portfolio-polish.css"',
  ];
  const positions = imports.map((token) => layout.indexOf(token));
  assert.equal(positions.every((position) => position >= 0), true);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);

  for (const token of [
    "--portfolio-paper: #f4efe6",
    "--portfolio-ink: #202824",
    "--portfolio-forest: #2f463b",
    "--portfolio-sage: #728978",
    "--portfolio-sand: #eadfce",
  ]) {
    assert.ok(css.includes(token), `missing public palette token: ${token}`);
  }

  assert.match(css, /\.system-section > \.section-shell,[\s\S]*background:\s*var\(--portfolio-forest\)/);
  assert.match(css, /\.hero-proof-strip div:nth-child\(2\),[\s\S]*transform:\s*none\s*!important/);
});

test("highlighted cards separate flagship products from the LoRA model capability project", async () => {
  const featured = await read("components/home/FeaturedCases.tsx");
  assert.match(featured, /三个旗舰产品案例，加一个模型能力项目。/);
  assert.match(featured, /data-project-tier/);
  assert.match(featured, /MODEL CAPABILITY/);
  assert.doesNotMatch(featured, /同一优先级/);
  assert.doesNotMatch(featured, /project\.decisions\[0\]/);
  assert.match(featured, /project\.metrics\.slice\(0, 2\)/);
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

test("homepage and flagship details share the exact R1.3 status contract", async () => {
  const projects = await read("content/projects.ts");
  const featured = await read("components/home/FeaturedCases.tsx");
  const statuses = [
    "Portfolio Pilot｜真实测试 Base E2E 已验证，生产 V2 Schema 表级匹配通过（10/10），正式业务 Pilot 待启用",
    "公网实时 Demo｜受控生产验证",
    "Live Demo｜真实 Provider 编辑已验证",
    "训练与本地验证完成｜业务效果独立评测待补",
  ];
  for (const status of statuses) assert.ok(projects.includes(status), `missing status: ${status}`);
  assert.match(featured, /projects\.map/);
  for (const status of statuses) assert.equal(featured.includes(status), false, "FeaturedCases must stay data-driven");
});

test("public source trees contain no superseded flagship claims", async () => {
  const paths = [
    "content/projects.ts",
    "content/flagship-cases/data-platform.ts",
    "content/flagship-cases/service-agent.ts",
    "content/flagship-cases/lumen-ink.ts",
    "content/portfolio-evidence.ts",
    "components/home/FeaturedCases.tsx",
    "lib/portfolio-guide.ts",
  ];
  const source = (await Promise.all(paths.map(read))).join("\n");
  for (const stale of ["589", "后端修复中", "真实编辑待验证", "缺少生产只读权限", "52/90", "16/16", "3/3"]) {
    assert.equal(source.includes(stale), false, `stale public phrase: ${stale}`);
  }
  assert.doesNotMatch(source, /(?:准确率|accuracy)\s*(?:为|[:：=])?\s*\d+(?:\.\d+)?%/i);
});
