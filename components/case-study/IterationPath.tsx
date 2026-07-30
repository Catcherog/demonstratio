import type { IterationEntry } from "@/content/flagship-cases";

export function IterationPath({ id, entries }: { id: string; entries: IterationEntry[] }) {
  return (
    <section id={id} className="flagship-section section-shell" aria-labelledby={`${id}-heading`}>
      <div className="flagship-section-heading">
        <p className="eyebrow">06 · ITERATION PATH</p>
        <h2 id={`${id}-heading`}>迭代链路</h2>
        <p>每一轮都从触发问题出发，同时说明产品变化、技术变化、验证结果和仍未完成的边界。</p>
      </div>
      <ol className="iteration-path">
        {entries.map((entry, index) => (
          <li key={entry.version}>
            <span className="iteration-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{entry.version}</h3>
            <dl>
              <div><dt>触发</dt><dd>{entry.trigger}</dd></div>
              <div><dt>产品变化</dt><dd>{entry.productChange}</dd></div>
              <div><dt>技术变化</dt><dd>{entry.technicalChange}</dd></div>
              <div><dt>结果</dt><dd>{entry.result}</dd></div>
              <div><dt>边界</dt><dd>{entry.boundary}</dd></div>
            </dl>
            <small>证据：{entry.evidenceRefs.join(" · ")}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
