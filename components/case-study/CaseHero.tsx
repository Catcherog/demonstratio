import type { Project } from "@/content/projects";
import type { FlagshipCaseStudy } from "@/content/flagship-cases";

export function CaseHero({ project, study }: { project: Project; study: FlagshipCaseStudy }) {
  return (
    <header className="flagship-hero section-shell">
      <nav className="case-breadcrumb" aria-label="面包屑导航">
        <a href="/">首页</a><span>/</span><a href="/#featured">主案例</a><span>/</span><strong>{project.index}</strong>
      </nav>
      <div className="flagship-hero-grid">
        <div className="flagship-hero-copy">
          <p className="eyebrow">{project.categoryLabel}</p>
          <h1>{project.title}</h1>
          <p className="case-subtitle">{project.subtitle}</p>
          <p className="case-summary">{study.overview.oneLine}</p>
          <div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <aside className="flagship-status-card" aria-label="案例当前状态">
          <span>当前状态</span>
          <strong>{study.overview.status}</strong>
          <p>{study.overview.boundary}</p>
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
