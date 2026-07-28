"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { GuideEvent, GuideRequest, GuideRole } from "@/content/portfolio-evidence";

type SourceItem = Extract<GuideEvent, { type: "sources" }>["items"][number];
type Turn = { question: string; answer: string; sources: SourceItem[]; mode: "live" | "guided" };

const roles: Array<{ value: GuideRole; label: string; note: string }> = [
  { value: "recruiter", label: "招聘官", note: "职责、交付与岗位证据" },
  { value: "product-lead", label: "产品负责人", note: "判断、取舍与业务闭环" },
  { value: "technical", label: "技术面试官", note: "架构、可靠性与实现边界" },
];

const prompts = {
  recruiter: ["用 90 秒带我看三个最能说明岗位匹配的证据。", "他在项目里具体负责了什么？"],
  "product-lead": ["三个项目最关键的产品取舍是什么？", "他如何把 AI 能力推进到交付？"],
  technical: ["Service Agent 如何控制高风险回答？", "飞书平台和光砚的技术边界是什么？"],
};

export function PortfolioGuide() {
  const [role, setRole] = useState<GuideRole>("recruiter");
  const [message, setMessage] = useState(prompts.recruiter[0]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const lastRequestAt = useRef(0);

  useEffect(() => () => abortRef.current?.abort(), []);

  const chooseRole = (nextRole: GuideRole) => {
    setRole(nextRole);
    setMessage(prompts[nextRole][0]);
    setError("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const question = message.trim();
    if (!question || pending) return;
    const now = Date.now();
    if (now - lastRequestAt.current < 2_000) {
      setError("请稍等 2 秒再继续追问。");
      return;
    }

    lastRequestAt.current = now;
    setPending(true);
    setError("");
    setStreamingText("");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const history: NonNullable<GuideRequest["history"]> = turns
      .slice(-3)
      .flatMap((turn) => [
        { role: "user" as const, content: turn.question },
        { role: "assistant" as const, content: turn.answer.slice(0, 600) },
      ]);

    let answer = "";
    let sources: SourceItem[] = [];
    let mode: "live" | "guided" = "guided";
    let protocolError = "";

    try {
      const response = await fetch("/api/portfolio-guide", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, message: question, history }),
      });
      if (!response.body) throw new Error("导览暂时不可用，请稍后再试。");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const payload = JSON.parse(line) as GuideEvent;
          if (payload.type === "meta") mode = payload.mode;
          if (payload.type === "delta") {
            answer += payload.text;
            setStreamingText(answer);
          }
          if (payload.type === "sources") sources = payload.items;
          if (payload.type === "error") protocolError = payload.message;
        }
        if (done) break;
      }

      if (protocolError) {
        setError(protocolError);
      } else if (answer) {
        setTurns((current) => [...current.slice(-2), { question, answer, sources, mode }]);
        setMessage("");
      }
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") setError("导览暂时不可用，请稍后再试。");
    } finally {
      setPending(false);
      setStreamingText("");
    }
  };

  const latest = turns.at(-1);

  return (
    <section className="guide-section" id="portfolio-guide">
      <div className="section-shell guide-layout">
        <div className="guide-intro">
          <p className="eyebrow">PORTFOLIO GUIDE AGENT</p>
          <h2>让作品集先回答你的第一个问题。</h2>
          <p>这是一个只读的作品集导览助手。它会从公开证据中找到相关案例，说明当前能力与边界；不会替招聘方作判断，也不会执行任何外部操作。</p>
          <a className="button button-light" href="#guide-window">开始 90 秒导览 <span aria-hidden="true">↘</span></a>
          <div className="guide-boundaries">
            <span>回答附来源</span><span>无密钥自动回退</span><span>只读公开事实</span>
          </div>
        </div>

        <div className="guide-window" id="guide-window">
          <header className="guide-window-head">
            <div><span className="guide-orb" aria-hidden="true" /><div><strong>作品集导览 Agent</strong><small>PUBLIC EVIDENCE · READ ONLY</small></div></div>
            <span className="guide-online">可追问</span>
          </header>

          <div className="guide-role-tabs" aria-label="选择导览视角">
            {roles.map((item) => (
              <button key={item.value} type="button" aria-pressed={role === item.value} onClick={() => chooseRole(item.value)}>
                <strong>{item.label}</strong><small>{item.note}</small>
              </button>
            ))}
          </div>

          <div className="guide-transcript" aria-live="polite">
            <div className="guide-message guide-assistant">
              <span>导览助手</span>
              <p>你好，我是这份作品集的导览助手。你可以问我：陈嘉伟怎样定义 Agent 产品、处理风险边界，或把项目推进到交付。我会直接引用相关案例和公开证据。</p>
            </div>
            {latest && (
              <>
                <div className="guide-message guide-user"><span>你的问题</span><p>{latest.question}</p></div>
                <div className="guide-message guide-assistant">
                  <div className="guide-answer-meta"><span>导览助手</span><small>{latest.mode === "live" ? "实时生成" : "预设导览"}</small></div>
                  <p className="guide-answer-text">{latest.answer}</p>
                  {latest.sources.length > 0 && (
                    <div className="guide-sources">
                      {latest.sources.map((source) => (
                        <a href={source.href} key={source.evidenceId}>
                          <span>{source.title}</span><small>{source.status}</small>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {pending && <div className="guide-message guide-assistant guide-streaming"><span>正在查找公开证据</span><p>{streamingText || "…"}</p></div>}
          </div>

          <div className="guide-suggestions">
            {prompts[role].map((prompt) => <button type="button" key={prompt} onClick={() => setMessage(prompt)}>{prompt}</button>)}
          </div>

          <form className="guide-form" onSubmit={submit}>
            <label htmlFor="guide-question">向作品集提问</label>
            <div>
              <textarea id="guide-question" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={600} rows={2} />
              <button type="submit" disabled={pending || !message.trim()} aria-label="发送问题">{pending ? "…" : "↑"}</button>
            </div>
            <small>{message.length}/600 · 最多保留 6 条历史消息</small>
          </form>
          {error && <p className="guide-error" role="alert">{error}</p>}
        </div>
      </div>
    </section>
  );
}
