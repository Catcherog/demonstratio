import type { FlagshipCaseStudy, NarrativePoint } from "@/content/flagship-cases";

function PointCard({ point, label }: { point: NarrativePoint; label: string }) {
  return (
    <article className="case-narrative-card">
      <span>{label}</span>
      <h3>{point.title}</h3>
      <p>{point.detail}</p>
      <small>证据：{point.evidenceRefs.join(" · ")}</small>
    </article>
  );
}

export function BusinessContext({ id, study }: { id: string; study: FlagshipCaseStudy }) {
  return (
    <section id={id} className="flagship-section section-shell" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">03 · BUSINESS JUDGMENT</p>
        <h2 id={`${id}-heading`}>业务判断</h2>
        <p>{study.business.whyBuild}</p>
      </div>
      <div className="case-balanced-grid">
        <div className="case-card-stack">
          {study.business.signals.map((point) => <PointCard key={point.title} point={point} label="业务信号" />)}
        </div>
        <div className="case-card-stack">
          {study.business.judgments.map((point) => <PointCard key={point.title} point={point} label="关键判断" />)}
        </div>
      </div>
      <aside className="case-constraint-strip">
        <strong>约束条件</strong>
        <ul>{study.business.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
      </aside>
    </section>
  );
}
