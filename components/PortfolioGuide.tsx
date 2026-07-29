"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { GuideRole } from "@/lib/portfolio-guide";

type StreamMode = "live" | "guided" | "fallback";

type SourceItem = {
  evidenceId: string;
  projectSlug: string;
  title: string;
  status: string;
  href: string;
  section: string;
  excerpt: string;
};

type Turn = {
  question: string;
  answer: string;
  sources: SourceItem[];
  mode: StreamMode;
  model?: string;
  retrievedCount?: number;
  note?: string;
};

type MetaState = {
  mode: StreamMode;
  model?: string;
  retrievedCount?: number;
  note?: string;
};

const roles: Array<{ value: GuideRole; label: string; note: string }> = [
  { value: "recruiter", label: "招聘官", note: "职责、交付与岗位证据" },
  { value: "product-lead", label: "产品负责人", note: "判断、取舍与业务闭环" },
  { value: "technical", label: "技术面试官", note: "架构、可靠性与实现边界" },
];

const suggestions: Record<GuideRole, string[]> = {
  recruiter: [
    "用 90 秒带我看三个最能说明岗位匹配的证据。",
    "除了三个主案例，他还做过哪些项目？",
    "他在这些项目里具体负责了什么？",
  ],
  "product-lead": [
    "三个主案例最关键的产品取舍是什么？",
    "飞书数据平台如何避免错误数据写入？",
    "他如何把 AI 能力推进到业务闭环？",
  ],
  technical: [
    "Service Agent 的 fail-closed 如何实现？",
    "光砚如何统一多个图像模型 Provider？",
    "对比 Service Agent、Collator 与 LoRA 的技术关系。",
  ],
};

function modeLabel(mode: StreamMode): string {
  if (mode === "live") return "AI 实时生成";
  if (mode === "fallback") return "离线证据回退";
  return "证据导览";
}

function modelLabel(model?: string): string {
  if (!model) return "";
  const [, name = model] = model.split("/");
  return name.replaceAll("-", " ");
}

function GuideAnswer({ text }: { text: string }) {
  const blocks = useMemo(
    () => text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean),
    [text],
  );

  return (
    <div className="guide-answer-text">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const first = lines[0] ?? "";
        const headingLike = /^(结论|关键证据|具体机制|技术实现|产品判断|能力边界|当前边界|建议追问|岗位判断建议|产品判断建议|技术判断建议)/.test(first);

        if (headingLike && lines.length === 1) {
          return <h4 key={`${first}-${index}`}>{first}</h4>;
        }

        if (lines.length > 1 && lines.every((line) => /^\d+[.、]/.test(line) || /^[-•]/.test(line))) {
          return (
            <ul key={`list-${index}`}>
              {lines.map((line) => (
                <li key={line}>{line.replace(/^\d+[.、]\s*|^[-•]\s*/, "")}</li>
              ))}
            </ul>
          );
        }

        return <p key={`paragraph-${index}`}>{block}</p>;
      })}
    </div>
  );
}

export function PortfolioGuide() {
  const [role, setRole] = useState<GuideRole>("recruiter");
  const [question, setQuestion] = useState(suggestions.recruiter[0]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [streamingSources, setStreamingSources] = useState<SourceItem[]>([]);
  const [streamingMeta, setStreamingMeta] = useState<MetaState>({ mode: "live" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const lastSubmitAt = useRef(0);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, streamingAnswer, loading]);

  const recentTurns = turns.slice(-3);

  function changeRole(nextRole: GuideRole) {
    setRole(nextRole);
    setQuestion(suggestions[nextRole][0]);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = question.trim();
    if (!message || loading) return;

    const now = Date.now();
    if (now - lastSubmitAt.current < 2_000) {
      setError("请稍等 2 秒再继续追问。");
      return;
    }
    lastSubmitAt.current = now;

    setLoading(true);
    setError("");
    setStreamingAnswer("");
    setStreamingSources([]);
    setStreamingMeta({ mode: "live" });
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    const history = turns.slice(-3).flatMap((turn) => [
      { role: "user" as const, content: turn.question },
      { role: "assistant" as const, content: turn.answer.slice(0, 1_200) },
    ]);

    let answer = "";
    let sources: SourceItem[] = [];
    let meta: MetaState = { mode: "live" };
    let streamError = "";

    try {
      const response = await fetch("/api/portfolio-guide", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, message, history }),
      });

      if (!response.body) throw new Error("导览暂时不可用，请稍后再试。");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as {
            type: "meta" | "delta" | "sources" | "error";
            mode?: StreamMode;
            model?: string;
            note?: string;
            retrievedCount?: number;
            text?: string;
            items?: SourceItem[];
            message?: string;
          };

          if (event.type === "meta") {
            meta = {
              mode: event.mode ?? meta.mode,
              model: event.model ?? meta.model,
              note: event.note ?? meta.note,
              retrievedCount: event.retrievedCount ?? meta.retrievedCount,
            };
            setStreamingMeta(meta);
          }
          if (event.type === "delta" && event.text) {
            answer += event.text;
            setStreamingAnswer(answer);
          }
          if (event.type === "sources" && event.items) {
            sources = event.items;
            setStreamingSources(sources);
          }
          if (event.type === "error") streamError = event.message ?? "导览暂时不可用。";
        }

        if (done) break;
      }

      if (streamError) {
        setError(streamError);
        return;
      }

      if (answer.trim()) {
        setTurns((current) => [
          ...current.slice(-2),
          {
            question: message,
            answer: answer.trim(),
            sources,
            mode: meta.mode,
            model: meta.model,
            retrievedCount: meta.retrievedCount,
            note: meta.note,
          },
        ]);
        setQuestion("");
      } else {
        setError("导览没有返回可展示内容，请换一个问法重试。");
      }
    } catch (caught) {
      if (caught instanceof Error && caught.name === "AbortError") return;
      setError("导览暂时不可用，请稍后再试。");
    } finally {
      setLoading(false);
      setStreamingAnswer("");
      setStreamingSources([]);
    }
  }

  return (
    <section className="guide-section" id="portfolio-guide">
      <div className="section-shell guide-layout">
        <div className="guide-intro">
          <p className="eyebrow">AI PORTFOLIO GUIDE</p>
          <h2>让 AI 带你理解我的项目、决策与技术实现。</h2>
          <p>
            按招聘官、产品负责人或技术面试官视角提问。AI 会检索九个案例、工作经历与公开证据，解释我做了什么、为什么这样设计、如何实现，以及当前能力边界。
          </p>
          <a className="button button-light" href="#guide-window">
            开始 AI 导览 <span aria-hidden="true">↘</span>
          </a>
          <div className="guide-boundaries" aria-label="AI 导览技术能力">
            <span>服务端 LLM</span>
            <span>证据检索</span>
            <span>流式回答</span>
            <span>只读边界</span>
          </div>
        </div>

        <div className="guide-window" id="guide-window">
          <header className="guide-window-head">
            <div>
              <span className="guide-orb" aria-hidden="true" />
              <div>
                <strong>作品集 AI 导览</strong>
                <small>LLM · EVIDENCE RETRIEVAL · READ ONLY</small>
              </div>
            </div>
            <span className="guide-online">可连续追问</span>
          </header>

          <div className="guide-role-tabs" aria-label="选择导览视角">
            {roles.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={role === item.value}
                onClick={() => changeRole(item.value)}
              >
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            ))}
          </div>

          <div className="guide-transcript" aria-live="polite" ref={transcriptRef}>
            <div className="guide-message guide-assistant">
              <span>AI 导览</span>
              <p>
                你好。你可以直接问项目功能、产品取舍、技术架构、本人贡献或证据边界。我会先检索相关案例，再组织回答；需要跨项目比较时，也会把三个主案例与其他六个项目一起纳入。
              </p>
            </div>

            {recentTurns.map((turn, index) => (
              <div className="guide-turn" key={`${turn.question}-${index}`}>
                <div className="guide-message guide-user">
                  <span>你的问题</span>
                  <p>{turn.question}</p>
                </div>
                <div className="guide-message guide-assistant">
                  <div className="guide-answer-meta">
                    <span>AI 导览</span>
                    <small>{modeLabel(turn.mode)}</small>
                    {turn.model ? <small>{modelLabel(turn.model)}</small> : null}
                    {turn.retrievedCount ? <small>检索 {turn.retrievedCount} 条证据</small> : null}
                  </div>
                  <GuideAnswer text={turn.answer} />
                  {turn.note ? <p className="guide-mode-note">{turn.note}</p> : null}
                  {turn.sources.length > 0 ? (
                    <div className="guide-sources" aria-label="回答来源">
                      {turn.sources.map((source) => (
                        <a href={source.href} key={source.evidenceId}>
                          <span>{source.title}</span>
                          <small>{source.section}</small>
                          <em>{source.status}</em>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="guide-message guide-assistant guide-streaming">
                <div className="guide-answer-meta">
                  <span>AI 导览</span>
                  <small>{modeLabel(streamingMeta.mode)}</small>
                  {streamingMeta.model ? <small>{modelLabel(streamingMeta.model)}</small> : null}
                  {streamingMeta.retrievedCount ? (
                    <small>检索 {streamingMeta.retrievedCount} 条证据</small>
                  ) : null}
                </div>
                <GuideAnswer text={streamingAnswer || "正在检索项目与公开证据…"} />
                {streamingSources.length > 0 && !streamingAnswer ? (
                  <p className="guide-mode-note">已命中 {streamingSources.length} 个相关证据片段，正在组织回答。</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="guide-suggestions" aria-label="推荐问题">
            {suggestions[role].map((item) => (
              <button type="button" onClick={() => setQuestion(item)} key={item}>
                {item}
              </button>
            ))}
          </div>

          <form className="guide-form" onSubmit={submit}>
            <label htmlFor="guide-question">向作品集提问</label>
            <div>
              <textarea
                id="guide-question"
                value={question}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setQuestion(event.target.value)}
                maxLength={600}
                rows={2}
                placeholder="例如：Service Agent 的 fail-closed 如何实现？"
              />
              <button type="submit" disabled={loading || !question.trim()} aria-label="发送问题">
                {loading ? "…" : "↑"}
              </button>
            </div>
            <small>{question.length}/600 · 最多保留 6 条历史消息 · 不保存访客正文</small>
          </form>

          {error ? (
            <p className="guide-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
