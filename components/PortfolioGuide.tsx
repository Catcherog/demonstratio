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

type WaitState = {
  title: string;
  detail: string;
};

const roles: Array<{ value: GuideRole; index: string; label: string; note: string }> = [
  { value: "recruiter", index: "01", label: "招聘官", note: "快速判断岗位匹配与交付证据" },
  { value: "product-lead", index: "02", label: "产品负责人", note: "追问判断、取舍与业务闭环" },
  { value: "technical", index: "03", label: "技术面试官", note: "核验架构、可靠性与实现边界" },
];

const suggestions: Record<GuideRole, string[]> = {
  recruiter: [
    "用 90 秒判断他是否匹配 AI 产品经理岗位。",
    "三个主案例分别证明了什么能力？",
    "他在项目里具体负责了什么，而不是团队做了什么？",
  ],
  "product-lead": [
    "三个主案例最关键的产品取舍是什么？",
    "飞书数据平台如何避免错误数据写入？",
    "他如何把 AI 能力推进到真实业务闭环？",
  ],
  technical: [
    "Service Agent 的 fail-closed 如何实现？",
    "飞书数据平台为什么需要 Candidate 与 SOP Gate？",
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

function getWaitState({
  elapsedSeconds,
  hasSources,
  hasAnswer,
}: {
  elapsedSeconds: number;
  hasSources: boolean;
  hasAnswer: boolean;
}): WaitState {
  if (hasAnswer) {
    return {
      title: "正在生成回答",
      detail: "首段内容已经返回，后续文字会继续流式出现。",
    };
  }

  if (hasSources) {
    if (elapsedSeconds >= 20) {
      return {
        title: "模型仍在组织答案",
        detail: "连接正常。跨项目比较或技术问题可能接近 30 秒。",
      };
    }
    return {
      title: "证据已命中，模型正在思考",
      detail: "正在把项目事实、当前边界与角色视角组织成回答。",
    };
  }

  if (elapsedSeconds >= 8) {
    return {
      title: "正在检索作品集证据",
      detail: "没有卡住。模型首个可见内容通常需要 10–30 秒。",
    };
  }

  return {
    title: "正在理解问题",
    detail: "先检索公开证据，再由大模型组织回答。",
  };
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
        const headingLike =
          /^(结论|关键证据|具体机制|技术实现|产品判断|能力边界|当前边界|建议追问|岗位判断建议|产品判断建议|技术判断建议)/.test(
            first,
          );

        if (headingLike && lines.length === 1) {
          return <h4 key={`${first}-${index}`}>{first}</h4>;
        }

        if (
          lines.length > 1 &&
          lines.every((line) => /^\d+[.、]/.test(line) || /^[-•]/.test(line))
        ) {
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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const lastSubmitAt = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, streamingAnswer, streamingSources, loading]);

  useEffect(() => {
    if (!loading || startedAtRef.current === null) {
      setElapsedSeconds(0);
      return;
    }

    const tick = () => {
      if (startedAtRef.current === null) return;
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1_000)));
    };

    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, [loading]);

  const recentTurns = turns.slice(-3);
  const waitState = getWaitState({
    elapsedSeconds,
    hasSources: streamingSources.length > 0 || Boolean(streamingMeta.retrievedCount),
    hasAnswer: Boolean(streamingAnswer),
  });

  function changeRole(nextRole: GuideRole) {
    setRole(nextRole);
    setQuestion(suggestions[nextRole][0]);
    setError("");
  }

  function stopGeneration() {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setStreamingAnswer("");
    setStreamingSources([]);
    setError("已停止本次回答，可以修改问题后重新发送。");
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
    startedAtRef.current = Date.now();
    setElapsedSeconds(0);
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
          const streamEvent = JSON.parse(line) as {
            type: "meta" | "delta" | "sources" | "error";
            mode?: StreamMode;
            model?: string;
            note?: string;
            retrievedCount?: number;
            text?: string;
            items?: SourceItem[];
            message?: string;
          };

          if (streamEvent.type === "meta") {
            meta = {
              mode: streamEvent.mode ?? meta.mode,
              model: streamEvent.model ?? meta.model,
              note: streamEvent.note ?? meta.note,
              retrievedCount: streamEvent.retrievedCount ?? meta.retrievedCount,
            };
            setStreamingMeta(meta);
          }

          if (streamEvent.type === "delta" && streamEvent.text) {
            answer += streamEvent.text;
            setStreamingAnswer(answer);
          }

          if (streamEvent.type === "sources" && streamEvent.items) {
            sources = streamEvent.items;
            setStreamingSources(sources);
          }

          if (streamEvent.type === "error") {
            streamError = streamEvent.message ?? "导览暂时不可用。";
          }
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
      if (abortRef.current === controller) abortRef.current = null;
      startedAtRef.current = null;
      setLoading(false);
      setStreamingAnswer("");
      setStreamingSources([]);
    }
  }

  return (
    <section className="guide-section" id="portfolio-guide">
      <div className="section-shell guide-layout">
        <div className="guide-intro">
          <p className="eyebrow">LIVE AI PORTFOLIO GUIDE</p>
          <h2>把面试官最想问的问题，交给 AI 先回答。</h2>
          <p>
            选择招聘官、产品负责人或技术面试官视角。AI 会先检索项目证据，再解释我做了什么、为什么这样设计、如何实现，以及哪些能力仍有边界。
          </p>
          <a className="button button-light" href="#guide-window">
            直接问 AI <span aria-hidden="true">↘</span>
          </a>

          <div className="guide-proof" aria-label="AI 导览说明">
            <div>
              <strong>10–30 秒</strong>
              <span>常见等待时间</span>
            </div>
            <div>
              <strong>只读</strong>
              <span>不修改任何数据</span>
            </div>
            <div>
              <strong>可追问</strong>
              <span>保留最近 6 条消息</span>
            </div>
          </div>

          <div className="guide-boundaries" aria-label="AI 导览技术能力">
            <span>服务端 LLM</span>
            <span>结构化证据检索</span>
            <span>流式回答</span>
            <span>确定性降级</span>
          </div>
        </div>

        <div className="guide-window" id="guide-window">
          <header className="guide-window-head">
            <div>
              <span className="guide-orb" aria-hidden="true" />
              <div>
                <strong>作品集 AI 导览</strong>
                <small>EVIDENCE-GROUNDED · READ ONLY</small>
              </div>
            </div>
            <span className="guide-online">
              <i aria-hidden="true" />
              在线 · 可连续追问
            </span>
          </header>

          <div className="guide-role-tabs" aria-label="选择导览视角">
            {roles.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={role === item.value}
                onClick={() => changeRole(item.value)}
              >
                <span>{item.index}</span>
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            ))}
          </div>

          <div className="guide-transcript" aria-live="polite" ref={transcriptRef}>
            <div className="guide-message guide-assistant guide-welcome">
              <span>AI 导览</span>
              <p>
                选一个视角，或直接使用下方推荐问题。我会先检索公开证据，再由模型组织回答；首个可见内容通常需要 10–30 秒。
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

                <div className="guide-wait" role="status" aria-live="polite">
                  <div className="guide-wait-head">
                    <span className="guide-thinking-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <strong>{waitState.title}</strong>
                    <time>{elapsedSeconds}s</time>
                  </div>
                  <p>{waitState.detail}</p>
                  <div className="guide-wait-track" aria-hidden="true">
                    <span />
                  </div>
                  <small>通常 10–30 秒返回首个可见内容，请保留当前页面。</small>
                </div>

                {streamingAnswer ? <GuideAnswer text={streamingAnswer} /> : null}

                {streamingSources.length > 0 && !streamingAnswer ? (
                  <p className="guide-mode-note">
                    已命中 {streamingSources.length} 个相关证据片段，正在组织回答。
                  </p>
                ) : null}

                <button className="guide-stop" type="button" onClick={stopGeneration}>
                  停止本次回答
                </button>
              </div>
            ) : null}
          </div>

          <div className="guide-suggestions" aria-label="推荐问题">
            <span>试着问：</span>
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
              <button
                type="submit"
                disabled={loading || !question.trim()}
                aria-label={loading ? "正在生成回答" : "发送问题"}
              >
                {loading ? (
                  <svg className="guide-submit-spinner" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                ) : (
                  <svg className="guide-submit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
                  </svg>
                )}
              </button>
            </div>
            <small>{question.length}/600 · 最近 6 条消息用于连续追问 · 不保存访客正文</small>
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
