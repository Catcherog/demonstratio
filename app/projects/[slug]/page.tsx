import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ProjectGallery } from "@/components/ProjectGallery";
import { StatusBadge } from "@/components/StatusBadge";
import { getProject, projects } from "@/content/projects";

const Arrow = () => <span aria-hidden="true">↗</span>;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title}｜陈嘉伟 AI 产品案例`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title}｜陈嘉伟 AI 产品案例`,
      description: project.summary,
      url: `https://www.jaelchen.com/projects/${project.slug}`,
      images: [{ url: project.images[0], alt: `${project.title} 项目预览` }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];
  const totalCount = projects.length;

  // 动态计算实际渲染的章节，生成连续编号（避免条件章节导致跳号）
  const visibleSections = [
    { id: "overview", render: true },
    { id: "problem", render: true },
    { id: "strategy", render: Boolean(project.productStrategy) },
    { id: "architecture", render: true },
    { id: "workflow", render: Boolean(project.keyWorkflow) },
    { id: "decisions", render: true },
    { id: "evidence", render: true },
    { id: "capability", render: true },
    { id: "contribution", render: Boolean(project.myContribution) },
    { id: "gallery", render: true },
    { id: "tradeoffs", render: true },
    { id: "relationships", render: true },
  ].filter((s) => s.render);

  const sectionNum = (id: string) => {
    const idx = visibleSections.findIndex((s) => s.id === id);
    return String(idx + 1).padStart(2, "0");
  };

  // SCS 工作流特有：检测是否使用 N 前缀节点标签（仅 SCS 的 keyWorkflow 使用 N1-N8）
  const hasNamedNodes = Boolean(
    project.keyWorkflow?.some((step) => /^N\d+\s/.test(step.label)),
  );

  return (
    <main id="top" className="case-page">
      <Header />

      <section className="case-hero section-shell">
        <div className="case-breadcrumb"><a href="/">首页</a><span>/</span><a href="/#projects">项目库</a><span>/</span><strong>{project.index}</strong></div>
        <div className="case-hero-grid">
          <div>
            <p className="eyebrow">{project.categoryLabel}</p>
            <h1>{project.title}</h1>
            <p className="case-subtitle">{project.subtitle}</p>
            <p className="case-summary">{project.summary}</p>
            <div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <aside className="case-facts">
            <div><span>状态</span><strong>{project.status}</strong></div>
            <div><span>我的角色</span><strong>{project.role}</strong></div>
            <div><span>团队</span><strong>{project.team}</strong></div>
            <div><span>周期</span><strong>{project.period}</strong></div>
            {project.link && (
              <a href={project.link.href} target={project.link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                {project.link.label} <Arrow />
                {project.link.note && <small>{project.link.note}</small>}
              </a>
            )}
          </aside>
        </div>

        <div className="case-metrics">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              {metric.note && <small>{metric.note}</small>}
            </div>
          ))}
        </div>
        {project.evidenceLabel && <p className="case-disclaimer">口径说明:{project.evidenceLabel}</p>}
        {project.provisional && <p className="case-disclaimer provisional">PROVISIONAL:当前公开状态待 Codex 最终校正,不得自行上调。</p>}
      </section>

      <section className="case-overview section-shell">
        <div className="case-section-title"><span>{sectionNum("overview")}</span><div><p className="eyebrow">OVERVIEW</p><h2>项目概览。</h2></div></div>
        <div className="case-two-column">
          <div className="case-panel">
            <h3>项目一句话</h3>
            <p>{project.subtitle}</p>
            <h3>目标用户</h3>
            <p>{project.team}</p>
          </div>
          <div className="case-panel case-panel-accent">
            <h3>项目状态</h3>
            <p>{project.status}</p>
            <dl>
              <div><dt>我的角色</dt><dd>{project.role}</dd></div>
              <div><dt>时间范围</dt><dd>{project.period}</dd></div>
              <div><dt>当前演示方式</dt><dd>{project.demoType === "public" ? "公开演示" : project.demoType === "controlled" ? "受控演示" : project.demoType === "local-only" ? "本地运行" : "演示维护中"}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="case-overview section-shell">
        <div className="case-section-title"><span>{sectionNum("problem")}</span><div><p className="eyebrow">PROBLEM</p><h2>业务问题与痛点。</h2></div></div>
        <div className="case-two-column">
          <div className="case-panel">
            <h3>原业务流程</h3>
            <ul>{project.problem.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="case-panel case-panel-accent">
            <h3>为什么普通表单或单次 LLM 不够</h3>
            <ul>{project.tradeoffs.slice(0, 1).map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      {project.productStrategy && (
        <section className="case-overview section-shell">
          <div className="case-section-title"><span>{sectionNum("strategy")}</span><div><p className="eyebrow">PRODUCT STRATEGY</p><h2>产品策略与边界。</h2></div></div>
          <div className="decision-grid">
            {project.productStrategy.map((strategy, index) => (
              <article key={strategy}><span>0{index + 1}</span><p>{strategy}</p></article>
            ))}
          </div>
        </section>
      )}

      <section className="case-architecture section-shell">
        <div className="case-section-title"><span>{sectionNum("architecture")}</span><div><p className="eyebrow">SYSTEM ARCHITECTURE</p><h2>系统架构。</h2></div></div>
        <div className="architecture-flow">
          {project.architecture.map((step, index) => (
            <article key={step.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.label}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
        <div className="implementation-strip">
          <span>实现栈</span>
          <div>{project.stack.map((item) => <strong key={item}>{item}</strong>)}</div>
        </div>
      </section>

      {project.keyWorkflow && (
        <section className="case-workflow-section section-shell">
          <div className="case-section-title"><span>{sectionNum("workflow")}</span><div><p className="eyebrow">{hasNamedNodes ? "AGENT WORKFLOW" : "KEY WORKFLOW"}</p><h2>{hasNamedNodes ? "受控工作流编排。" : "关键用户路径。"}</h2></div></div>
          <div className="workflow-flow">
            {project.keyWorkflow.map((step) => {
              const isFailClosed = step.label.includes("人工接管");
              const isFeedback = step.label.includes("反馈飞轮");
              const itemClass = isFailClosed ? "wf-fail-closed" : isFeedback ? "wf-feedback" : "";
              const heading = hasNamedNodes ? step.label.replace(/^N\d+\s/, "") : step.label;
              return (
                <article key={step.label} className={itemClass}>
                  <span className="wf-node-tag">{step.label}</span>
                  <h3>{heading}</h3>
                  <p>{step.detail}</p>
                </article>
              );
            })}
          </div>
          {hasNamedNodes && (
            <div className="workflow-meta">
              <div>
                <strong>FAIL-CLOSED 人工接管路径</strong>
                <p>N6 质量闸门低置信度、高风险承诺与敏感边界统一进入 N7 人工接管,不在公网 Demo 中自动回复,确保价格、档期等敏感场景不产生不可控承诺。</p>
              </div>
              <div>
                <strong>反馈飞轮闭环</strong>
                <p>N8 将归档会话经清洗与人工确认后写回飞书主源、ChromaDB 与本地 JSON 镜像,形成可解释的知识更新链路,避免单一向量库成为不可解释的知识黑箱。</p>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="case-dark-section">
        <div className="section-shell">
          <div className="case-section-title case-title-light"><span>{sectionNum("decisions")}</span><div><p className="eyebrow">KEY PRODUCT DECISIONS</p><h2>关键决策,不只是功能列表。</h2></div></div>
          <div className="decision-grid">
            {project.decisions.map((decision, index) => (
              <article key={decision}><span>0{index + 1}</span><p>{decision}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-evidence-section">
        <div className="section-shell">
          <div className="case-section-title"><span>{sectionNum("evidence")}</span><div><p className="eyebrow">EVIDENCE</p><h2>展示证据,也说明证据边界。</h2></div></div>
          <div className="outcome-list">
            {project.outcomes.map((outcome, index) => (
              <article key={outcome}><span>{String(index + 1).padStart(2, "0")}</span><p>{outcome}</p></article>
            ))}
          </div>
          {project.evidenceLinks && project.evidenceLinks.length > 0 && (
            <div className="evidence-links">
              <h3>结构化证据清单</h3>
              <ul>
                {project.evidenceLinks.map((evidence) => (
                  <li key={evidence.ref}><strong>{evidence.ref}</strong> · {evidence.label} <small>({evidence.type})</small></li>
                ))}
              </ul>
            </div>
          )}
          {project.evidenceLabel && <div className="evidence-warning"><strong>指标边界</strong><p>{project.evidenceLabel}</p></div>}
          {project.lastVerifiedAt && (
            <p className="case-verified-meta">最后验证时间:{project.lastVerifiedAt}</p>
          )}
        </div>
      </section>

      <section className="case-gallery-section section-shell">
        <div className="case-section-title"><span>{sectionNum("capability")}</span><div><p className="eyebrow">CURRENT VERSION & ROADMAP</p><h2>当前版本与路线图。</h2></div></div>
        <StatusBadge
          verified={project.verifiedCapabilities}
          inProgress={project.inProgressCapabilities}
          planned={project.plannedCapabilities}
        />
      </section>

      {project.myContribution && (
        <section className="case-contribution-section section-shell">
          <div className="case-section-title"><span>{sectionNum("contribution")}</span><div><p className="eyebrow">MY CONTRIBUTION</p><h2>我的贡献。</h2></div></div>
          <div className="contribution-grid">
            {project.myContribution.map((contribution) => (
              <article key={contribution.area}>
                <h3>{contribution.area}</h3>
                <p>{contribution.detail}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="case-gallery-section section-shell">
        <div className="case-section-title"><span>{sectionNum("gallery")}</span><div><p className="eyebrow">PRODUCT EVIDENCE</p><h2>界面、流程与实现证据。</h2></div></div>
        <ProjectGallery title={project.title} images={project.images} mode={project.imageMode} />
      </section>

      <section className="case-reflection section-shell">
        <div className="case-section-title"><span>{sectionNum("tradeoffs")}</span><div><p className="eyebrow">TRADE-OFFS & NEXT</p><h2>取舍、风险和下一步。</h2></div></div>
        <div className="case-two-column">
          <div className="case-panel">
            <h3>关键取舍</h3>
            <ul>{project.tradeoffs.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="case-panel">
            <h3>下一步验证</h3>
            <ul>{project.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="relationship-section">
        <div className="section-shell">
          <div className="case-section-title case-title-light"><span>{sectionNum("relationships")}</span><div><p className="eyebrow">CROSS-PROJECT RELATIONSHIPS</p><h2>它如何进入完整产品系统。</h2></div></div>
          <div className="relationship-grid">
            {project.relationships.map((relation) => (
              <a href={`/projects/${relation.slug}`} key={relation.slug}>
                <strong>{relation.label}</strong>
                <p>{relation.detail}</p>
                <span>查看关联项目 →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <nav className="case-navigation section-shell" aria-label="项目翻页">
        <a href={`/projects/${previous.slug}`}><span>← 上一个案例</span><strong>{previous.title}</strong></a>
        <a href="/#projects" className="case-all-link">全部 {totalCount} 个项目</a>
        <a href={`/projects/${next.slug}`}><span>下一个案例 →</span><strong>{next.title}</strong></a>
      </nav>

      <section className="case-contact">
        <div className="section-shell">
          <p className="eyebrow">CONTACT</p>
          <h2>正在寻找 AI 应用 / Agent 产品经理机会。</h2>
          <div>
            <a className="button button-primary" href="mailto:Jael_Chen@foxmail.com">联系我 <Arrow /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
