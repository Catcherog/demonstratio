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
    "service-agent": "Controlled Demo｜后端已上线 CloudBase Deploy 039（Phase G 验证通过），前端仍指向 Render 静态降级",
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
