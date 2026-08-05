import Image from "next/image";
import type { Project } from "@/content/projects";

type Props = { projects: Project[] };

export function FeaturedCases({ projects }: Props) {
  return (
    <section className="section-shell section-block featured-section" id="featured">
      <div className="section-heading featured-heading">
        <div>
          <p className="eyebrow">3 FLAGSHIP PRODUCTS + 1 MODEL CAPABILITY</p>
          <h2>三个旗舰产品案例，加一个模型能力项目。</h2>
        </div>
        <p>Service Agent、飞书 AI 业务数据平台与光砚，分别验证 Agent 可靠性、复杂业务系统设计与多模态产品化；LoRA 项目补充业务语料、微调训练和本地推理能力。</p>
      </div>

      <div className="flagship-grid">
        {projects.map((project, index) => {
          const isModelCapability = project.slug === "lora-finetuning";
          const isDiagramCover = project.images[0]?.endsWith(".svg") ?? false;
          const cardClassName = [
            "flagship-card",
            isModelCapability ? "flagship-card-model" : "",
            isDiagramCover ? "flagship-card-diagram" : "",
          ].filter(Boolean).join(" ");

          return (
          <article
            className={cardClassName}
            data-project-tier={isModelCapability ? "model-capability" : "flagship-product"}
            key={project.slug}
          >
            <a
              className={`flagship-media${isDiagramCover ? " flagship-media--diagram" : ""}`}
              href={`/projects/${project.slug}`}
              aria-label={`查看 ${project.title} 案例`}
            >
              <Image src={project.images[0]} alt={`${project.title} 产品界面`} fill sizes="(max-width: 1050px) 100vw, 50vw" />
            </a>
            <div className="flagship-body">
              <div className="flagship-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{isModelCapability ? "MODEL CAPABILITY" : project.category}</strong>
              </div>
              <p className="flagship-status-line" title={project.status}>{project.status}</p>
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
          );
        })}
      </div>
    </section>
  );
}
