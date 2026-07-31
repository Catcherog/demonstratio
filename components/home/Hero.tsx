import type { BoundPublicMetric } from "@/content/projects";
import { capabilities } from "@/content/projects";

const guidePrompts = [
  { promptIndex: "01", label: "招聘官", text: "90 秒判断岗位匹配" },
  { promptIndex: "02", label: "产品负责人", text: "追问产品取舍与闭环" },
  { promptIndex: "03", label: "技术面试官", text: "核验 Agent 架构与边界" },
];

export function Hero({ metrics }: { metrics: BoundPublicMetric[] }) {
  return (
    <section className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-copy">
        <p className="availability"><span aria-hidden="true" /> OPEN TO AI PRODUCT OPPORTUNITIES</p>
        <p className="eyebrow">AI / AGENT 产品经理 · TECHNICAL BUILDER</p>
        <h1 id="hero-title" aria-label="把复杂业务，做成可上线、可评估的 AI 产品。">
          <span className="hero-title-desktop" aria-hidden="true">
            <span className="hero-title-line">把复杂业务，</span>
            <span className="hero-title-line hero-title-line-shift">
              做成<span className="hero-title-accent">可上线、可评估</span>的
            </span>
            <span className="hero-title-line">AI 产品。</span>
          </span>
          <span className="hero-title-mobile" aria-hidden="true">
            <span className="hero-title-line">把复杂业务，</span>
            <span className="hero-title-line hero-title-line-shift">
              做成<span className="hero-title-accent">可上线、</span>
            </span>
            <span className="hero-title-line">可评估的 AI 产品。</span>
          </span>
        </h1>
        <p className="hero-lead">
          我是陈嘉伟。曾在 TP-Link 管理复杂软硬件项目组合，现作为 3 人全职创业团队的创始人兼 AI 产品负责人，围绕飞书 AI 业务数据平台、Service Agent 与光砚构建可验证的 AI 产品；Collator 作为飞书子系统处理非结构化数据摄入。
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#featured">
            查看三个主案例 <span aria-hidden="true">↓</span>
          </a>
          <a className="button button-secondary hero-ai-button" href="#portfolio-guide">
            <i aria-hidden="true" />
            进入 AI 导览 <span aria-hidden="true">→</span>
          </a>
          <a className="button button-tertiary" href="/resume">
            查看中英文简历 <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="hero-ai-path">
          <svg className="hero-guide-route" viewBox="0 0 235 126" aria-hidden="true">
            <path d="M225 5 C 150 10, 33 14, 28 72 C 25 103, 70 113, 102 113" />
            <circle cx="102" cy="113" r="4" />
          </svg>
          <aside className="hero-ai-invite" aria-label="AI 作品集导览入口">
            <div className="hero-ai-invite-head">
              <span><i aria-hidden="true" /> AI 导览已上线</span>
              <strong>不必从头翻案例，直接问你最关心的问题。</strong>
            </div>
            <div className="hero-ai-prompts">
              {guidePrompts.map((prompt) => (
                <a href="#portfolio-guide" key={prompt.label}>
                  <span><b>{prompt.promptIndex}</b>{prompt.label}</span>
                  <strong>{prompt.text}</strong>
                  <i aria-hidden="true">↘</i>
                </a>
              ))}
            </div>
            <small>基于公开证据回答 · 可连续追问 · 首个可见内容通常需要 10–30 秒</small>
          </aside>
        </div>

        <div className="hero-links">
          <a href="/resume/chen-jiawei-ai-agent-cn-two-page.pdf" target="_blank" rel="noreferrer">中文简历</a>
          <a href="/resume/jiawei-chen-ai-agent-en.pdf" target="_blank" rel="noreferrer">English Resume</a>
          <a href="https://github.com/Catcherog" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:Jael_Chen@foxmail.com">Email</a>
        </div>
      </div>

      <div className="capability-index" aria-label="三项核心能力">
        <div className="capability-index-head"><span>CORE CAPABILITIES</span><strong>03</strong></div>
        {capabilities.map((capability, index) => (
          <a href="#featured" className="capability-line" key={capability.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{capability.title}</strong><p>{capability.body}</p><small>{capability.evidence}</small></div>
            <i aria-hidden="true">↘</i>
          </a>
        ))}
        <div className="hero-proof-strip" aria-label="公开证据摘要">
          {metrics.map((metric) => (
            <div key={metric.claimId} data-claim-id={metric.claimId} data-evidence-ref={metric.evidenceRef}>
              <strong>{metric.value}</strong><span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
