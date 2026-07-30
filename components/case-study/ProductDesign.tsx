import type { FlagshipCaseStudy, NarrativePoint } from "@/content/flagship-cases";

function ProductPoint({ point, index }: { point: NarrativePoint; index: number }) {
  return (
    <article className="case-narrative-card">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <h3>{point.title}</h3>
      <p>{point.detail}</p>
      <small>证据：{point.evidenceRefs.join(" · ")}</small>
    </article>
  );
}

export function ProductDesign({ id, study }: { id: string; study: FlagshipCaseStudy }) {
  return (
    <section id={id} className="flagship-section section-shell flagship-product-section" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">03 · PRODUCT DESIGN</p>
        <h2 id={`${id}-heading`}>产品方案</h2>
        <p>{study.product.form}</p>
      </div>
      <div className="case-balanced-grid">
        <div>
          <h3 className="case-subheading">用户与工作流</h3>
          <p className="case-user-line">{study.product.users.join(" · ")}</p>
          <div className="case-card-stack">
            {study.product.workflow.map((point, index) => <ProductPoint key={point.title} point={point} index={index} />)}
          </div>
        </div>
        <div>
          <h3 className="case-subheading">产品决策</h3>
          <div className="case-card-stack">
            {study.product.decisions.map((point, index) => <ProductPoint key={point.title} point={point} index={index} />)}
          </div>
          <aside className="case-nongoals">
            <strong>本阶段不做</strong>
            <ul>{study.product.nonGoals.map((item) => <li key={item}>{item}</li>)}</ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
