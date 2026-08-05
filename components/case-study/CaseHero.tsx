import type { Project } from "@/content/projects";
import type { FlagshipCaseStudy } from "@/content/flagship-cases";
import { LiveExperienceBadge } from "./LiveExperienceBadge";

const SERVICE_AGENT_DECISION_CHAIN = [
  { index: "01", label: "理解问题", detail: "识别意图与风险" },
  { index: "02", label: "检索证据", detail: "只使用可追溯资料" },
  { index: "03", label: "生成回答", detail: "通过质量检查后回复" },
  { index: "04", label: "拒答或转人工", detail: "边界不确定时 fail-closed" },
] as const;

export function CaseHero({ project, study }: { project: Project; study: FlagshipCaseStudy }) {
  const isServiceAgent = project.slug === "service-agent";

  return (
    <header className={`flagship-hero section-shell${isServiceAgent ? " flagship-hero--editorial-flow" : ""}`}>
      <nav className="case-breadcrumb" aria-label="面包屑导航">
        <a href="/">首页</a><span>/</span><a href="/#featured">主案例</a><span>/</span><strong>{project.index}</strong>
      </nav>
      <a className="case-home-link" href="/">返回主页面 <span aria-hidden="true">↗</span></a>
      <div className="flagship-hero-grid">
        <div className="flagship-hero-copy">
          <p className="eyebrow">{project.categoryLabel}</p>
          {isServiceAgent ? (
            <h1 className="case-editorial-title" aria-label={project.title}>
              <span aria-hidden="true" className="case-editorial-title__scene">Studio</span>
              <span aria-hidden="true" className="case-editorial-title__main">Customer</span>
              <span aria-hidden="true" className="case-editorial-title__tail">Service Agent</span>
            </h1>
          ) : (
            <h1>{project.title}</h1>
          )}
          <p className="case-subtitle">{project.subtitle}</p>
          <p className="case-summary">{study.overview.oneLine}</p>
          <div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {project.link ? (
            <div className="case-hero-experience">
              <LiveExperienceBadge
                href={project.link.href}
                label="在线体验"
                caption={project.title}
                external={project.link.href.startsWith("http")}
              />
            </div>
          ) : null}
        </div>
        <aside className="flagship-status-card" aria-label="案例当前状态">
          <span>当前状态</span>
          <strong>{study.overview.status}</strong>
          <p>{study.overview.boundary}</p>
          {isServiceAgent && (
            <ol className="case-decision-chain" aria-label="Service Agent 决策链">
              {SERVICE_AGENT_DECISION_CHAIN.map((step) => (
                <li key={step.index}>
                  <span className="case-decision-chain__index">{step.index}</span>
                  <span><strong>{step.label}</strong><small>{step.detail}</small></span>
                </li>
              ))}
            </ol>
          )}
          <dl>
            <div><dt>我的角色</dt><dd>{project.role}</dd></div>
            <div><dt>团队</dt><dd>{project.team}</dd></div>
            <div><dt>周期</dt><dd>{project.period}</dd></div>
          </dl>
        </aside>
      </div>

      <div className="case-hero-cover">
        <div className="case-cover-frame">
          <img src={project.images[0]} alt={`${project.title} 封面`} />
        </div>
      </div>
    </header>
  );
}
