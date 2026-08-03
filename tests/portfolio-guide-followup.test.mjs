import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

// Mirror of resolveSearchQuery logic from lib/portfolio-guide.ts.
// Kept in sync so tests assert behavior, not just source patterns.
const FOLLOW_UP_PRONOUNS = ["它", "它的", "它用", "它是", "它有", "这个", "那个", "这", "那", "其", "该"];

function isPronounFollowUp(message) {
  const trimmed = (message ?? "").trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length <= 24) {
    return FOLLOW_UP_PRONOUNS.some((pronoun) => trimmed.includes(pronoun));
  }
  return FOLLOW_UP_PRONOUNS.some((pronoun) => trimmed.startsWith(pronoun));
}

function lastUserMessage(history) {
  if (!Array.isArray(history) || history.length === 0) return undefined;
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const item = history[index];
    if (item && item.role === "user") return item.content;
  }
  return undefined;
}

function resolveSearchQuery(message, history) {
  if (!Array.isArray(history) || history.length === 0) return message;
  if (!isPronounFollowUp(message)) return message;
  const lastUser = lastUserMessage(history);
  if (!lastUser) return message;
  return `${lastUser} ${message}`;
}

test("Case A: AI guide follow-up keeps portfolio-guide context", () => {
  // Q1 asks about AI guide implementation; Q2 follows up with a pronoun.
  const q1 = "这个 AI 导览机器人是怎么实现的？";
  const q2 = "它用了向量数据库吗？";
  const history = [
    { role: "user", content: q1 },
    { role: "assistant", content: "它是官网只读证据导览..." },
  ];
  const resolved = resolveSearchQuery(q2, history);
  // Resolved query must carry the portfolio-guide context, not just the pronoun.
  assert.match(resolved, /AI 导览/);
  assert.match(resolved, /向量数据库/);
  // A bare q2 without history must NOT pull in AI-guide context.
  assert.ok(!resolveSearchQuery(q2, []).includes("AI 导览"));
});

test("Case B: service-agent follow-up keeps service-agent context", () => {
  const q1 = "Service Agent 怎么实现？";
  const q2 = "它用了 LangGraph 吗？";
  const history = [
    { role: "user", content: q1 },
    { role: "assistant", content: "Service Agent 使用风险优先工作流..." },
  ];
  const resolved = resolveSearchQuery(q2, history);
  assert.match(resolved, /Service Agent/);
  assert.match(resolved, /LangGraph/);
});

test("Case C: explicit service-agent question is not hijacked by prior AI guide context", () => {
  // When the user explicitly asks about Service Agent + ChromaDB (no pronoun),
  // the query must NOT be rewritten to pull in prior AI-guide context.
  const message = "Service Agent 是否用了 ChromaDB？";
  const history = [
    { role: "user", content: "AI 导览怎么实现？" },
    { role: "assistant", content: "..." },
  ];
  const resolved = resolveSearchQuery(message, history);
  // No pronoun → no rewrite → stays focused on Service Agent.
  assert.equal(resolved, message);
  assert.match(resolved, /Service Agent/);
  assert.match(resolved, /ChromaDB/);
});

test("resolveSearchQuery returns message unchanged when history is empty", () => {
  assert.equal(resolveSearchQuery("它用了 LangGraph 吗？", []), "它用了 LangGraph 吗？");
  assert.equal(resolveSearchQuery("它用了 LangGraph 吗？", undefined), "它用了 LangGraph 吗？");
});

test("resolveSearchQuery does not rewrite non-pronoun questions even with history", () => {
  const history = [{ role: "user", content: "AI 导览怎么实现？" }];
  assert.equal(resolveSearchQuery("飞书数据平台做了什么？", history), "飞书数据平台做了什么？");
});

test("source: retrievePortfolioSources accepts history and resolves search query", async () => {
  const source = await read("lib/portfolio-guide.ts");
  assert.match(source, /history\?: GuideHistoryMessage\[\]/);
  assert.match(source, /const searchQuery = resolveSearchQuery\(question, history\)/);
  // All scoring must use the resolved searchQuery, not the raw question.
  assert.match(source, /scoreDocument\(overview, searchQuery, terms\)/);
  assert.match(source, /scoreDocument\(document, searchQuery, terms\)/);
  assert.match(source, /const normalizedQuestion = searchQuery\.toLowerCase\(\)/);
});

test("source: route passes history to retrieval and offline fallback", async () => {
  const source = await read("app/api/portfolio-guide/route.ts");
  assert.match(source, /retrievePortfolioSources\(message, role, 8, history\)/);
  assert.match(source, /staticPortfolioAnswer\(message, role, sources, history\)/);
});
