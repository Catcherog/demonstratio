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
  demoStatus,
}: {
  id: string;
  items: PortfolioEvidence[];
  demoStatus?: DemoStatus;
}) {
  const safeItems = items.filter((item) => item.publicSafe);
  const interactiveItems = demoStatus ? safeItems.filter((item) => item.kind === "interactive") : [];
  const preferredInteractiveId = demoStatus === "live"
    ? "service-agent-live-frontend"
    : "service-agent-controlled-demo";
  const primaryInteractive = interactiveItems.find((item) => item.id === preferredInteractiveId) ?? interactiveItems[0];
  const backupInteractive = interactiveItems.find((item) => item.id !== primaryInteractive?.id);
  const evidenceItems = demoStatus && primaryInteractive
    ? safeItems.filter((item) => item.kind !== "interactive")
    : safeItems;

  return (
    <section id={id} className="flagship-section section-shell" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">02 · PROJECT SHOWCASE</p>
        <h2 id={`${id}-heading`}>项目展示</h2>
        <p>集中展示已核验的产品界面、操作视频、体验入口与验证摘要；不可用素材会如实标注状态。</p>
      </div>
      {primaryInteractive && (
        <article className="case-demo-entry case-evidence-card evidence-available" data-demo-status={demoStatus}>
          <div className="case-evidence-meta">
            <span>体验入口</span>
            <strong>{demoStatus === "live" ? "实时主入口" : "受控备用入口"}</strong>
          </div>
          <EvidenceMedia item={primaryInteractive} />
          <div className="case-evidence-copy">
            <h3>{primaryInteractive.title}</h3>
            <p>{primaryInteractive.summary}</p>
            {backupInteractive && (
              <aside className="case-demo-fallback-note" role="note">
                <strong>备用模式</strong>
                <p>{backupInteractive.title}：{backupInteractive.summary} 当前仅作为备用模式说明，不作为主入口展示。</p>
                {demoStatus === "live" && backupInteractive.id === "service-agent-controlled-demo" && backupInteractive.href && (
                  <a className="button button-ghost" href={backupInteractive.href} target="_blank" rel="noreferrer">
                    打开 B1 / B2 / B3 备用演示 <span aria-hidden="true">↗</span>
                  </a>
                )}
              </aside>
            )}
            <dl>
              <div><dt>状态</dt><dd>{STATE_LABELS[primaryInteractive.state]}</dd></div>
              <div><dt>验证时间</dt><dd>{primaryInteractive.verifiedAt ?? "待补素材"}</dd></div>
              <div><dt>范围</dt><dd>{primaryInteractive.scope}</dd></div>
              <div><dt>边界</dt><dd>{primaryInteractive.boundary}</dd></div>
            </dl>
            <small>证据：{primaryInteractive.evidenceRefs.join(" · ")}</small>
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
