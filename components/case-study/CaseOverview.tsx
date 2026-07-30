import type { Project } from "@/content/projects";
import type { FlagshipCaseStudy } from "@/content/flagship-cases";

export function CaseOverview({ id, project, study }: { id: string; project: Project; study: FlagshipCaseStudy }) {
  return (
    <section id={id} className="flagship-section section-shell" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">01 · OVERVIEW</p>
        <h2 id={`${id}-heading`}>项目概览</h2>
        <p>先说明我负责什么、验证到了哪里，以及不能从现有证据推导什么。</p>
      </div>
      <div className="case-balanced-grid">
        <article className="case-narrative-card">
          <span>一句话定位</span>
          <h3>{study.overview.oneLine}</h3>
          <p>{project.summary}</p>
        </article>
        <article className="case-narrative-card case-boundary-card">
          <span>责任与边界</span>
          <h3>{study.overview.responsibility}</h3>
          <p>{study.overview.boundary}</p>
        </article>
      </div>
      <div className="flagship-metrics" aria-label="权威绑定指标">
        {project.metrics.map((metric) => (
          <article key={metric.claimId} data-claim-id={metric.claimId} data-evidence-ref={metric.evidenceRef}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            <small>{[metric.note, metric.evidenceRef && `证据：${metric.evidenceRef}`].filter(Boolean).join(" · ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
