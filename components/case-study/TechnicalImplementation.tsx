import type { FlagshipCaseStudy, NarrativePoint } from "@/content/flagship-cases";

function TechnicalPoint({ point, label }: { point: NarrativePoint; label: string }) {
  return (
    <article className="case-narrative-card">
      <span>{label}</span>
      <h3>{point.title}</h3>
      <p>{point.detail}</p>
      <small>证据：{point.evidenceRefs.join(" · ")}</small>
    </article>
  );
}

export function TechnicalImplementation({ id, study }: { id: string; study: FlagshipCaseStudy }) {
  return (
    <section id={id} className="flagship-section section-shell flagship-technical-section" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">04 · TECHNICAL IMPLEMENTATION</p>
        <h2 id={`${id}-heading`}>技术实现</h2>
        <p>架构、关键机制和取舍都绑定到公开证据；实现数量不替代产品质量判断。</p>
      </div>
      <div className="case-balanced-grid">
        <div className="case-card-stack">
          {study.technical.architecture.map((point) => <TechnicalPoint key={point.title} point={point} label="架构" />)}
          {study.technical.mechanisms.map((point) => <TechnicalPoint key={point.title} point={point} label="关键机制" />)}
        </div>
        <div className="case-card-stack">
          {study.technical.tradeoffs.map((point) => <TechnicalPoint key={point.title} point={point} label="工程取舍" />)}
        </div>
      </div>
    </section>
  );
}
