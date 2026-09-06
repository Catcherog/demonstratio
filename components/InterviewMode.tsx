import { businessOsLayers, portfolioStory } from "@/content/portfolio-story";
import { getPublicProjectStatus } from "@/content/portfolio-status";

export function InterviewMode() {
  return (
    <main className="interview-page" id="top">
      <section className="interview-hero section-shell" aria-labelledby="interview-heading">
        <p className="eyebrow">{portfolioStory.eyebrow} · 03 MINUTE PATH</p>
        <h1 id="interview-heading">用三分钟看懂我如何把复杂业务做成 AI 产品。</h1>
        <p className="interview-lead">{portfolioStory.positioning} 下面按系统、案例、证据和边界给出一条可直接讲解的路径。</p>
        <div className="interview-actions">
          <a className="button button-primary" href="#interview-cases">从三个旗舰案例开始 <span aria-hidden="true">↓</span></a>
          <a className="button button-secondary" href="/resume">查看中英文简历 <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="interview-system section-shell" aria-labelledby="interview-system-heading">
        <div className="section-heading">
          <p className="eyebrow">01 · SYSTEM</p>
          <h2 id="interview-system-heading">四层结构，一条可靠性回路。</h2>
        </div>
        <div className="interview-system-grid">
          {businessOsLayers.map((layer) => (
            <article key={layer.index}>
              <span>{layer.index}</span>
              <h3>{layer.label}</h3>
              <p>{layer.caption}</p>
            </article>
          ))}
        </div>
        <p className="interview-loop-note">{portfolioStory.buildLoop.join(" → ")}。</p>
      </section>

      <section className="interview-cases section-shell" id="interview-cases" aria-labelledby="interview-cases-heading">
        <div className="section-heading">
          <p className="eyebrow">02 · FLAGSHIP CASES</p>
          <h2 id="interview-cases-heading">每个案例回答一个关键问题。</h2>
        </div>
        <div className="interview-case-grid">
          {portfolioStory.flagshipCases.map((flagshipCase, index) => {
            const status = getPublicProjectStatus(flagshipCase.slug);
            return (
              <article key={flagshipCase.slug} className="interview-case-card">
                <div className="interview-case-meta"><span>0{index + 1}</span><strong>{flagshipCase.label}</strong></div>
                <h3>{flagshipCase.title}</h3>
                <p>{flagshipCase.capability}</p>
                <p className="interview-case-proof"><strong>现在能证明：</strong>{flagshipCase.proof}</p>
                {status && <small>{status.label}</small>}
                <a className="editorial-link" href={flagshipCase.href}>阅读案例 <span aria-hidden="true">→</span></a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="interview-demo section-shell" aria-labelledby="interview-demo-heading">
        <div className="interview-demo-copy">
          <p className="eyebrow">03 · DEMO ORDER</p>
          <h2 id="interview-demo-heading">先展示可复核证据，再打开实时入口。</h2>
          <p>建议用 60–90 秒讲清每个关键证据：Service Agent 先讲真实录屏和 B1 / B2 / B3 受控路径；Feishu 先讲 Test Base E2E 与生产只读 Schema；Lumen 只演示已验证的两项 Seedream 操作。</p>
        </div>
        <ol className="interview-demo-order">
          <li><span>01</span><strong>录屏 / 解释性架构图</strong><small>不依赖实时上游，先让判断链清楚。</small></li>
          <li><span>02</span><strong>受控入口 / Test Base</strong><small>演示边界、人工接管和可回收验证。</small></li>
          <li><span>03</span><strong>实时入口（次级）</strong><small>只有当前可达且不改变已声明边界时才补充打开。</small></li>
        </ol>
      </section>
    </main>
  );
}
