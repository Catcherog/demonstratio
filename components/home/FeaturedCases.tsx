import Image from "next/image";
import type { Project } from "@/content/projects";

type Props = { projects: Project[] };

export function FeaturedCases({ projects }: Props) {
  return (
    <section className="section-shell section-block featured-section" id="featured">
      <div className="section-heading featured-heading">
        <div><p className="eyebrow">THREE FLAGSHIP CASES</p><h2>三个主案例，验证三类核心能力。</h2></div>
        <p>飞书 AI 业务数据平台、Service Agent 与光砚，分别展示业务系统设计、Agent 可靠性与多模态产品化能力；每个案例均公开当前证据与能力边界。</p>
      </div>

      <div className="flagship-grid">
        {projects.map((project) => (
          <article className="flagship-card" key={project.slug}>
            <a className="flagship-media" href={`/projects/${project.slug}`} aria-label={`查看 ${project.title} 案例`}>
              <Image src={project.images[0]} alt={`${project.title} 产品界面`} fill sizes="(max-width: 900px) 100vw, 33vw" />
              <span title={project.status}>{project.status}</span>
            </a>
            <div className="flagship-body">
              <div className="flagship-meta"><span>{project.index}</span><strong>{project.category}</strong></div>
              <h3>{project.title}</h3>
              <p className="flagship-subtitle">{project.subtitle}</p>
              <p className="flagship-summary">{project.summary}</p>
              <dl>
                <div><dt>我的角色</dt><dd>{project.role}</dd></div>
              </dl>
              <div className="flagship-metrics">
                {project.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label} data-claim-id={metric.claimId} data-evidence-ref={metric.evidenceRef}>
                    <strong>{metric.value}</strong><span>{metric.label}{metric.note ? ` · ${metric.note}` : ""}</span>
                  </div>
                ))}
              </div>
              <a className="editorial-link" href={`/projects/${project.slug}`}>阅读完整案例 <span aria-hidden="true">→</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
