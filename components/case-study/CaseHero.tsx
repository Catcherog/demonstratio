import type { Project } from "@/content/projects";
import type { FlagshipCaseStudy } from "@/content/flagship-cases";

const SERVICE_AGENT_DECISION_CHAIN = [
  { index: "01", label: "理解问题", detail: "识别意图与风险" },
  { index: "02", label: "检索证据", detail: "只使用可追溯资料" },
  { index: "03", label: "生成回答", detail: "通过质量检查后回复" },
  { index: "04", label: "拒答或转人工", detail: "边界不确定时 fail-closed" },
] as const;

const LUMEN_DECISION_CHAIN = [
  {
    index: "01",
    label: "建立任务",
    detail: "上传图像并选择编辑目标",
  },
  {
    index: "02",
    label: "配置模型",
    detail: "选择 Provider、Model 与参数",
  },
  {
    index: "03",
    label: "执行编辑",
    detail: "结构化指令调用真实 Provider",
  },
  {
    index: "04",
    label: "复核结果",
    detail: "对比结果、回看历史并导出",
  },
] as const;

export function CaseHero({ project, study }: { project: Project; study: FlagshipCaseStudy }) {
  const isServiceAgent = project.slug === "service-agent";
  const isLumen = project.slug === "lumen-ink";
  const isEditorialFlow = isServiceAgent || isLumen;

  const decisionChain = isServiceAgent
    ? SERVICE_AGENT_DECISION_CHAIN
    : isLumen
      ? LUMEN_DECISION_CHAIN
      : null;

  return (
    <header className={`flagship-hero section-shell${isEditorialFlow ? " flagship-hero--editorial-flow" : ""}`}>
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
          ) : isLumen ? (
            <h1
              className="case-editorial-title case-editorial-title--lumen"
              aria-label={project.title}
            >
              <span aria-hidden="true" className="case-editorial-title__scene">
                Lumen
              </span>
              <span aria-hidden="true" className="case-editorial-title__main">
                光砚
              </span>
              <span
                aria-hidden="true"
                className="case-editorial-title__tail case-editorial-title__tail--lumen"
              >
                AI 图像编辑工作台
              </span>
            </h1>
          ) : (
            <h1>{project.title}</h1>
          )}
          <p className="case-subtitle">{project.subtitle}</p>
          <p className="case-summary">{study.overview.oneLine}</p>
          <div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <aside className="flagship-status-card" aria-label="案例当前状态">
          <span>当前状态</span>
          <strong>{study.overview.status}</strong>
          <p>{study.overview.boundary}</p>
          {decisionChain && (
            <ol
              className={`case-decision-chain${isLumen ? " case-decision-chain--lumen" : ""}`}
              aria-label={isLumen ? "光砚工作台决策链" : "Service Agent 决策链"}
            >
              {decisionChain.map((step) => (
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
    </header>
  );
}
