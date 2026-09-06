import type { PortfolioEvidence } from "@/content/portfolio-evidence";
import type { DemoStatus } from "@/content/flagship-cases/types";
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

export function CaseEvidenceGallery({
  id,
  items,
  projectSlug,
  demoStatus,
  primaryEvidenceId,
}: {
  id: string;
  items: PortfolioEvidence[];
  projectSlug: string;
  demoStatus?: DemoStatus;
  primaryEvidenceId?: string;
}) {
  const safeItems = items.filter((item) => item.publicSafe);
  const demoItems = demoStatus
    ? safeItems.filter((item) => item.kind === "video" || item.kind === "interactive")
    : [];
  const registryPrimary = primaryEvidenceId
    ? safeItems.find(
        (item) =>
          item.id === primaryEvidenceId &&
          item.projectSlug === projectSlug &&
          item.state === "available",
      )
    : undefined;
  const safeFallbackPrimary = demoStatus === "fallback"
    ? demoItems.find((item) => item.id === "service-agent-live-demo-01" && item.projectSlug === projectSlug)
    : undefined;
  const configuredDemoPrimary = demoStatus
    ? demoItems.find((item) => item.id === "service-agent-live-frontend" && item.projectSlug === projectSlug)
    : undefined;
  const primaryEvidence = registryPrimary ?? safeFallbackPrimary ?? configuredDemoPrimary;
  const secondaryDemoLinks = primaryEvidence
    ? demoItems.filter((item) => item.id !== primaryEvidence.id && item.kind === "interactive")
    : [];
  const secondaryDemoIds = new Set(secondaryDemoLinks.map((item) => item.id));
  const evidenceItems = primaryEvidence
    ? safeItems.filter((item) => item.id !== primaryEvidence.id && !secondaryDemoIds.has(item.id))
    : safeItems;

  return (
    <section id={id} className="flagship-section section-shell" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">02 · PROJECT SHOWCASE</p>
        <h2 id={`${id}-heading`}>项目展示</h2>
        <p>集中展示已核验的产品界面、操作视频、体验入口与验证摘要；不可用素材会如实标注状态。</p>
      </div>
      {primaryEvidence && (
        <article className="case-demo-entry case-evidence-card evidence-available" data-demo-status={demoStatus} data-primary-evidence-id={primaryEvidence.id}>
          <div className="case-evidence-meta">
            <span>{KIND_LABELS[primaryEvidence.kind]}</span>
            <strong>{demoStatus === "fallback" ? "录屏主路径" : "首要证据路径"}</strong>
          </div>
          <EvidenceMedia item={primaryEvidence} />
          <div className="case-evidence-copy">
            <h3>{primaryEvidence.title}</h3>
            <p>{primaryEvidence.summary}</p>
            {secondaryDemoLinks.length > 0 && (
              <aside className="case-demo-fallback-note" role="note">
                <strong>次级路径</strong>
                {secondaryDemoLinks.map((item) => (
                  <div className="case-demo-secondary" key={item.id}>
                    <p>{item.title}：{item.summary}</p>
                    {item.href && (
                      <a className="button button-ghost" href={item.href} target="_blank" rel="noreferrer">
                        打开补充入口 <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                ))}
              </aside>
            )}
            <dl>
              <div><dt>状态</dt><dd>{STATE_LABELS[primaryEvidence.state]}</dd></div>
              <div><dt>验证时间</dt><dd>{primaryEvidence.verifiedAt ?? "待补素材"}</dd></div>
              <div><dt>范围</dt><dd>{primaryEvidence.scope}</dd></div>
              <div><dt>边界</dt><dd>{primaryEvidence.boundary}</dd></div>
            </dl>
            <small>证据：{primaryEvidence.evidenceRefs.join(" · ")}</small>
          </div>
        </article>
      )}
      <div className="case-evidence-grid">
        {evidenceItems.map((item, index) => (
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
