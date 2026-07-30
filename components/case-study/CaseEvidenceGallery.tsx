import type { PortfolioEvidence } from "@/content/portfolio-evidence";

export function CaseEvidenceGallery({ id, items }: { id: string; items: PortfolioEvidence[] }) {
  const safeItems = items.filter((item) => item.publicSafe);
  return (
    <section id={id} className="flagship-section section-shell" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">06 · PROJECT EVIDENCE</p>
        <h2 id={`${id}-heading`}>项目证据</h2>
        <p>证据按可用、计划与不可用状态展示；缺少素材不会被包装成可播放或可点击体验。</p>
      </div>
      <div className="case-evidence-grid">
        {safeItems.map((item) => (
          <article key={item.id} className={`case-evidence-card evidence-${item.state}`}>
            <div className="case-evidence-meta"><span>{item.kind}</span><strong>{item.state}</strong></div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <dl>
              <div><dt>范围</dt><dd>{item.scope}</dd></div>
              <div><dt>边界</dt><dd>{item.boundary}</dd></div>
              <div><dt>验证时间</dt><dd>{item.verifiedAt ?? "待补素材"}</dd></div>
            </dl>
            <small>证据：{item.evidenceRefs.join(" · ")}</small>
            {item.state === "planned" && <span className="evidence-planned-label">待补素材</span>}
          </article>
        ))}
      </div>
    </section>
  );
}
