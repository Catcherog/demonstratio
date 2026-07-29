import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("guide exposes a truthful staged wait state instead of a frozen placeholder", async () => {
  const source = await read("components/PortfolioGuide.tsx");
  assert.match(source, /elapsedSeconds/);
  assert.match(source, /通常 10–30 秒/);
  assert.match(source, /模型仍在组织答案/);
  assert.match(source, /guide-wait/);
  assert.match(source, /停止本次回答/);
  assert.doesNotMatch(source, /预计还剩\s*\d+/);
});

test("homepage explicitly invites recruiter and technical interviewer to use AI", async () => {
  const hero = await read("components/home/Hero.tsx");
  assert.match(hero, /让 AI 用 90 秒介绍我/);
  assert.match(hero, /AI 导览已上线/);
  assert.match(hero, /招聘官/);
  assert.match(hero, /技术面试官/);
  assert.match(hero, /基于公开证据回答/);
});

test("R2 visual overrides use neutral and sage surfaces for the chat", async () => {
  const css = await read("app/globals.css");
  const start = css.indexOf("PORTFOLIO_AI_GUIDE_UX_R2_START");
  const end = css.indexOf("PORTFOLIO_AI_GUIDE_UX_R2_END");
  assert.ok(start >= 0 && end > start);
  const block = css.slice(start, end);
  assert.match(block, /#355440/);
  assert.match(block, /#f5f1e8/);
  assert.match(block, /guide-thinking-track/);
  assert.doesNotMatch(block, /#65536d|#ded3e2/i);
});
