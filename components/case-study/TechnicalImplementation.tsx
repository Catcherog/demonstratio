import type { FlagshipCaseStudy, NarrativePoint } from "@/content/flagship-cases";

type TechnicalCard = {
  point: NarrativePoint;
  label: string;
};

function buildTechnicalCards(study: FlagshipCaseStudy): TechnicalCard[] {
  const cards: TechnicalCard[] = [];
  const pairedCount = Math.max(study.technical.architecture.length, study.technical.tradeoffs.length);

  for (let index = 0; index < pairedCount; index += 1) {
    const architecture = study.technical.architecture[index];
    const tradeoff = study.technical.tradeoffs[index];

    if (architecture) cards.push({ point: architecture, label: "架构" });
    if (tradeoff) cards.push({ point: tradeoff, label: "工程取舍" });
  }

  cards.push(...study.technical.mechanisms.map((point) => ({ point, label: "关键机制" })));
  return cards;
}

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
  const technicalCards = buildTechnicalCards(study);

  return (
    <section id={id} className="flagship-section section-shell flagship-technical-section" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">05 · TECHNICAL IMPLEMENTATION</p>
        <h2 id={`${id}-heading`}>技术实现</h2>
        <p>架构、关键机制和取舍都绑定到公开证据；实现数量不替代产品质量判断。</p>
      </div>
      <div className="case-technical-grid">
        {technicalCards.map(({ point, label }, index) => (
          <div
            key={point.title}
            className={
              "case-technical-card" +
              (index === technicalCards.length - 1 && technicalCards.length % 2 === 1 ? " case-technical-card-wide" : "")
            }
          >
            <TechnicalPoint point={point} label={label} />
          </div>
        ))}
      </div>
    </section>
  );
}
