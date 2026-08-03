import test from "node:test";
import assert from "node:assert/strict";
import {
  retrievePortfolioSources,
  resolveSearchContext,
  resolveSearchQuery,
  type GuideHistoryMessage,
} from "../lib/portfolio-guide.ts";

// Real retrieval behavior tests: these call the production
// retrievePortfolioSources and assert the actual projectSlug of returned
// sources, not a copy of the implementation.

function history(...messages: Array<{ role: "user" | "assistant"; content: string }>): GuideHistoryMessage[] {
  return messages;
}

test("Case 1: AI guide LangGraph follow-up stays in portfolio-guide", () => {
  // Q1 anchors on AI 导览. Q2 is a pronoun follow-up mentioning LangGraph /
  // 向量数据库. Technology words must NOT switch scope to service-agent.
  const sources = retrievePortfolioSources(
    "它用了 LangGraph 或向量数据库吗？",
    "technical",
    8,
    history(
      { role: "user", content: "这个 AI 导览机器人是怎么实现的？" },
      { role: "assistant", content: "它是官网中的只读证据导览。" },
    ),
  );

  assert.ok(sources.length > 0, "should return at least one source");
  for (const source of sources) {
    assert.equal(
      source.projectSlug,
      "portfolio-guide",
      `expected portfolio-guide, got ${source.projectSlug} (${source.title})`,
    );
  }
});

test("Case 2: Service Agent follow-up stays in service-agent", () => {
  const sources = retrievePortfolioSources(
    "它用了 LangGraph 吗？",
    "technical",
    8,
    history(
      { role: "user", content: "Service Agent 怎么实现？" },
      { role: "assistant", content: "Service Agent 使用风险优先工作流。" },
    ),
  );

  assert.ok(sources.length > 0);
  for (const source of sources) {
    assert.equal(
      source.projectSlug,
      "service-agent",
      `expected service-agent, got ${source.projectSlug} (${source.title})`,
    );
  }
});

test("Case 3: explicit Service Agent question is not hijacked by prior AI guide context", () => {
  // Even when history is about AI 导览, an explicit question naming
  // Service Agent must scope to service-agent only.
  const sources = retrievePortfolioSources(
    "这个 Service Agent 为什么使用 LangGraph？",
    "technical",
    8,
    history(
      { role: "user", content: "AI 导览怎么实现？" },
      { role: "assistant", content: "它是只读证据导览。" },
    ),
  );

  assert.ok(sources.length > 0);
  for (const source of sources) {
    assert.equal(
      source.projectSlug,
      "service-agent",
      `expected service-agent, got ${source.projectSlug} (${source.title})`,
    );
  }
});

test("Case 4: AI guide double follow-up keeps portfolio-guide context across two pronoun turns", () => {
  // Third turn is still a pronoun follow-up; scope must stay portfolio-guide.
  const sources = retrievePortfolioSources(
    "它有长期记忆吗？",
    "technical",
    8,
    history(
      { role: "user", content: "这个 AI 导览机器人是怎么实现的？" },
      { role: "assistant", content: "它是只读证据导览。" },
      { role: "user", content: "它用了 LangGraph 吗？" },
      { role: "assistant", content: "没有，它不使用 LangGraph。" },
    ),
  );

  assert.ok(sources.length > 0);
  for (const source of sources) {
    assert.equal(
      source.projectSlug,
      "portfolio-guide",
      `expected portfolio-guide, got ${source.projectSlug} (${source.title})`,
    );
  }
});

test("Case 5: feishu question is not polluted by prior AI guide context", () => {
  // “飞书这个项目怎么写入？” contains “这个” but is a long explicit-subject
  // question. It must scope to feishu / collator, not portfolio-guide.
  const sources = retrievePortfolioSources(
    "飞书这个项目怎么写入？",
    "technical",
    8,
    history(
      { role: "user", content: "AI 导览怎么实现？" },
      { role: "assistant", content: "它是只读证据导览。" },
    ),
  );

  assert.ok(sources.length > 0);
  const slugs = new Set(sources.map((source) => source.projectSlug));
  assert.ok(
    !slugs.has("portfolio-guide"),
    `feishu question should not return portfolio-guide, got: ${[...slugs].join(", ")}`,
  );
});

test("resolveSearchContext: empty history returns message and no scope", () => {
  const ctx = resolveSearchContext("它用了 LangGraph 吗？", []);
  assert.equal(ctx.searchQuery, "它用了 LangGraph 吗？");
  assert.deepEqual(ctx.scopedProjectSlugs, []);
});

test("resolveSearchContext: explicit current subject wins over history", () => {
  const ctx = resolveSearchContext(
    "Service Agent 是否用了 ChromaDB？",
    history({ role: "user", content: "AI 导览怎么实现？" }),
  );
  assert.equal(ctx.searchQuery, "Service Agent 是否用了 ChromaDB？");
  assert.deepEqual(ctx.scopedProjectSlugs, ["service-agent"]);
});

test("resolveSearchContext: pronoun follow-up inherits anchor scope", () => {
  const ctx = resolveSearchContext(
    "它用了向量数据库吗？",
    history(
      { role: "user", content: "这个 AI 导览怎么实现？" },
      { role: "assistant", content: "它是只读证据导览。" },
    ),
  );
  assert.match(ctx.searchQuery, /AI 导览/);
  assert.match(ctx.searchQuery, /向量数据库/);
  assert.deepEqual(ctx.scopedProjectSlugs, ["portfolio-guide"]);
});

test("resolveSearchQuery backwards-compat returns string only", () => {
  const query = resolveSearchQuery(
    "它用了 LangGraph 吗？",
    history({ role: "user", content: "AI 导览怎么实现？" }),
  );
  assert.match(query, /AI 导览/);
  assert.match(query, /LangGraph/);
});
