import type { PortfolioEvidence } from "@/content/portfolio-evidence";
import { EvidenceMedia } from "./EvidenceMedia";

const STATE_LABELS: Record<PortfolioEvidence["state"], string> = {
  available: "已核验",
  planned: "待补素材",
  unavailable: "暂不可用",
};

const KIND_LABELS: Record<PortfolioEvidence["kind"], string> = {
  image: "产品界面",
  video: "操作视频",
  interactive: "体验入口",
  architecture: "解释性架构图",
  test: "验证摘要",
  document: "证据文档",
};

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
        {safeItems.map((item, index) => (
          <article key={item.id} className={`case-evidence-card evidence-${item.state}${index === 0 ? " evidence-featured" : ""}`}>
            <div className="case-evidence-meta">
              <span>{KIND_LABELS[item.kind]}</span>
              <strong>{STATE_LABELS[item.state]}</strong>
            </div>
            <EvidenceMedia item={item} />
            <div className="case-evidence-copy">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <dl>
                <div><dt>状态</dt><dd>{STATE_LABELS[item.state]}</dd></div>
                <div><dt>验证时间</dt><dd>{item.verifiedAt ?? "待补素材"}</dd></div>
                <div><dt>范围</dt><dd>{item.scope}</dd></div>
                <div><dt>边界</dt><dd>{item.boundary}</dd></div>
              </dl>
              <small>证据：{item.evidenceRefs.join(" · ")}</small>
              {item.state === "planned" && <span className="evidence-planned-label">待补素材</span>}
              {item.state === "unavailable" && <span className="evidence-unavailable-label">暂不可用</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
