import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("portfolio exposes a real mobile viewport contract", async () => {
  const source = await read("app/layout.tsx");
  assert.match(source, /import type \{ Metadata, Viewport \}/);
  assert.match(source, /export const viewport\s*:\s*Viewport/);
  assert.match(source, /width:\s*"device-width"/);
  assert.match(source, /initialScale:\s*1/);
});

test("homepage leads with the AI BUSINESS OS umbrella before detailed cases", async () => {
  const home = await read("app/page.tsx");
  const story = await read("content/portfolio-story.ts");
  assert.match(home, /portfolioStory/);
  assert.match(story, /AI BUSINESS OS/);
  assert.ok(home.indexOf("<SystemMap") < home.indexOf("<FeaturedCases"), "architecture must precede flagship detail");
  assert.match(home, /buildLoop/);
});

test("the shared story registry exposes four ordered operating layers", async () => {
  const source = await read("content/portfolio-story.ts");
  for (const label of [
    "运营与人工复核",
    "Agent 与自动化",
    "业务数据与记忆",
    "适配器、API 与模型",
  ]) {
    assert.match(source, new RegExp(label));
  }
  const indexes = [
    source.indexOf("运营与人工复核"),
    source.indexOf("Agent 与自动化"),
    source.indexOf("业务数据与记忆"),
    source.indexOf("适配器、API 与模型"),
  ];
  assert.ok(indexes.every((index) => index >= 0));
  assert.deepEqual([...indexes].sort((a, b) => a - b), indexes);
});

test("interview mode has a concise presenter route and flagship links", async () => {
  const route = await read("app/interview/page.tsx");
  const component = await read("components/InterviewMode.tsx");
  const story = await read("content/portfolio-story.ts");
  assert.match(route, /InterviewMode/);
  for (const slug of ["data-platform", "service-agent", "lumen-ink"]) {
    assert.match(story, new RegExp(`/projects/${slug}`));
  }
  assert.match(component, /portfolioStory\.flagshipCases/);
  assert.match(component, /href=\{flagshipCase\.href\}/);
  assert.match(component, /href="\/resume"/);
  assert.match(component, /60|90/);
});

test("interview mode makes personal ownership and the engineering delivery loop explicit", async () => {
  const component = await read("components/InterviewMode.tsx");
  assert.match(component, /interview-ownership/);
  assert.match(component, /需求定义[\s\S]*产品架构[\s\S]*工程实现[\s\S]*评估验证[\s\S]*Preview 交付/);
});

test("public-safe status overlay is fallback-first without changing the raw authority manifest", async () => {
  const status = await read("content/portfolio-status.ts");
  const projects = await read("content/projects.ts");
  const claims = JSON.parse(await read("content/public-claims.json"));
  assert.match(status, /service-agent[\s\S]*mode:\s*"fallback"/);
  assert.match(status, /lumen-ink[\s\S]*mode:\s*"controlled"/);
  assert.match(status, /primaryEvidenceId:\s*"service-agent-live-demo-01"/);
  assert.match(projects, /claim\.claimId\s*!==\s*"SCS-DEPLOYED-SHA"/);
  assert.equal(claims.length, 21);
  assert.ok(claims.some((claim) => claim.claimId === "SCS-DEPLOYED-SHA"));
});

test("Lumen story names the server-only RunningHub boundary without claiming browser LIVE", async () => {
  const caseSource = await read("content/flagship-cases/lumen-ink.ts");
  const evidence = await read("content/portfolio-evidence.ts");
  assert.match(caseSource, /RunningHub/);
  assert.match(caseSource, /server-only|服务端|服务器/);
  assert.match(caseSource, /adapter|适配器/);
  assert.match(caseSource, /未验证|BLOCKED|不.*LIVE/);
  assert.match(evidence, /RunningHub/);
});

test("service evidence gallery makes recording primary in fallback mode", async () => {
  const source = await read("components/case-study/CaseEvidenceGallery.tsx");
  assert.match(source, /service-agent-live-demo-01/);
  assert.match(source, /录屏|recording|操作视频/);
  assert.match(source, /secondary|次要|备用/);
});

test("public fallback wins over runtime demo overrides and registry evidence drives the gallery", async () => {
  const page = await read("components/case-study/FlagshipCasePage.tsx");
  const gallery = await read("components/case-study/CaseEvidenceGallery.tsx");
  assert.match(page, /publicStatus\?\.mode\s*===\s*"fallback"[\s\S]*?"fallback"/);
  assert.match(page, /primaryEvidenceId=\{publicStatus\?\.primaryEvidenceId\}/);
  assert.match(gallery, /primaryEvidenceId\?:\s*string/);
  assert.match(gallery, /projectSlug:\s*string/);
  assert.match(gallery, /item\.projectSlug\s*===\s*projectSlug/);
  assert.match(gallery, /secondaryDemoLinks/);
  assert.doesNotMatch(gallery, /secondaryDemos\.map/);
});

test("guide chrome stays mode-neutral until the response reports a mode", async () => {
  const source = await read("components/PortfolioGuide.tsx");
  assert.doesNotMatch(source, /LIVE AI PORTFOLIO GUIDE/);
  assert.doesNotMatch(source, /在线 · 可连续追问/);
  assert.match(source, /只读 · 证据导览/);
  assert.match(source, /useState<MetaState>\(\{ mode: "guided" \}\)/);
  assert.match(source, /let meta: MetaState = \{ mode: "guided" \}/);
});
