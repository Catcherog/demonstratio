import { businessOsLayers, portfolioStory } from "@/content/portfolio-story";

export function BusinessOsOverview() {
  return (
    <section className="business-os-section section-shell" id="business-os" aria-labelledby="business-os-heading">
      <div className="business-os-intro">
        <p className="eyebrow">{portfolioStory.eyebrow}</p>
        <h2 id="business-os-heading">{portfolioStory.headline}</h2>
        <p>{portfolioStory.positioning}</p>
        <a className="editorial-link" href="/interview">打开面试模式 <span aria-hidden="true">→</span></a>
      </div>
      <div className="business-os-support">
        <p>{portfolioStory.systemDescription}</p>
        <div className="business-os-layer-index" aria-label="AI BUSINESS OS 四层结构">
          {businessOsLayers.map((layer) => (
            <div key={layer.index}>
              <span>{layer.index}</span>
              <strong>{layer.label}</strong>
            </div>
          ))}
        </div>
        <ol className="business-os-loop" aria-label="AI 产品交付闭环">
          {portfolioStory.buildLoop.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              {index < portfolioStory.buildLoop.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
