import Image from "next/image";
import { Header } from "@/components/Header";
import { ProjectGallery } from "@/components/ProjectGallery";
import { capabilities, projects } from "@/content/projects";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main id="top">
      <Header />

      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">AI NATIVE · AGENT · DATA PLATFORM</p>
          <h1>把复杂业务，<br />重构为可落地的 AI 产品。</h1>
          <p className="hero-lead">
            我是陈嘉伟，AI / Agent 产品经理。擅长从业务痛点出发，把 Agent、RAG、数据中台与多模态能力转化为可体验、可交付、可持续迭代的产品系统。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">查看项目矩阵 <span>↓</span></a>
            <a className="button button-ghost" href="https://github.com/Catcherog" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          </div>
        </div>

        <div className="hero-visual" aria-label="项目产品界面预览">
          <div className="hero-card hero-card-main">
            <Image src="/projects/lumen-ink/01.webp" alt="光砚 AI 图像编辑工作台" fill priority sizes="(max-width: 900px) 92vw, 600px" />
          </div>
          <div className="hero-card hero-card-side">
            <Image src="/projects/service-agent/01.webp" alt="Service Agent" fill priority sizes="300px" />
          </div>
          <div className="hero-status"><span /> 8 个产品案例 · 45 张真实截图</div>
        </div>

        <div className="hero-metrics">
          <div><strong>8</strong><span>核心产品案例</span></div>
          <div><strong>90%+</strong><span>RAG 检索准确率</span></div>
          <div><strong>12×</strong><span>内容调研效率</span></div>
          <div><strong>70%</strong><span>新人培训效率提升</span></div>
        </div>
      </section>

      <section className="capability-strip" aria-label="核心能力">
        <div className="section-shell capability-inner">
          <span className="capability-label">核心能力</span>
          <div className="capability-list">
            {capabilities.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section-shell section-block" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK</p>
            <h2>产品矩阵</h2>
          </div>
          <p>从业务底座到用户触点，覆盖获客、咨询、转化、交付与复盘全链路。</p>
        </div>

        <div className="project-index-grid">
          {projects.map((project) => (
            <a className="project-index-card" href={`#${project.slug}`} key={project.slug}>
              <div className="project-index-image">
                <Image src={project.images[0]} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" />
              </div>
              <div className="project-index-body">
                <span className="project-index-number">{project.index}</span>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
                <span className="project-index-link">查看案例 →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="projects-detail">
        {projects.map((project) => (
          <article className="project-section section-shell" id={project.slug} key={project.slug}>
            <div className="project-header">
              <div className="project-title-block">
                <p className="eyebrow">{project.index} / {project.category}</p>
                <h2>{project.title}</h2>
                <p className="project-subtitle">{project.subtitle}</p>
              </div>
              <p className="project-summary">{project.summary}</p>
            </div>

            <div className="project-metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
              ))}
            </div>

            <ProjectGallery title={project.title} images={project.images} mode={project.imageMode} />

            <div className="project-content-grid">
              <div>
                <p className="content-label">项目成果</p>
                <ul className="highlight-list">
                  {project.highlights.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="project-sidebar">
                <p className="content-label">技术栈</p>
                <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                {project.link && (
                  <a className="project-link" href={project.link.href} target={project.link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    <span>{project.link.label}<Arrow /></span>
                    {project.link.note && <small>{project.link.note}</small>}
                  </a>
                )}
              </div>
            </div>

            <details className="project-details">
              <summary>查看设计思路与技术细节 <span>+</span></summary>
              <div className="details-grid">
                <div>
                  <h3>产品设计</h3>
                  <ul>{project.design.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <h3>技术实现</h3>
                  <ul>{project.technical.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
            </details>
          </article>
        ))}
      </div>

      <section className="method-section" id="method">
        <div className="section-shell">
          <div className="section-heading method-heading">
            <div><p className="eyebrow">PRODUCT METHOD</p><h2>产品方法论</h2></div>
            <p>不从模型能力出发堆功能，而从业务约束、用户决策与数据闭环出发设计产品。</p>
          </div>
          <div className="method-grid">
            <div><span>01</span><h3>拆解业务链路</h3><p>识别关键角色、流转节点、异常路径和可量化结果，先明确真正需要被重构的问题。</p></div>
            <div><span>02</span><h3>产品化 AI 能力</h3><p>把提示词、模型、工具调用和专业经验封装为用户可理解的流程、参数和反馈。</p></div>
            <div><span>03</span><h3>建立质量闸门</h3><p>通过置信度、规则校验、人工确认和兜底策略控制错误，而不是追求无条件自动化。</p></div>
            <div><span>04</span><h3>形成数据飞轮</h3><p>让真实使用数据回流到知识库、规则和工作流，持续降低人工成本并提升结果质量。</p></div>
          </div>
        </div>
      </section>

      <section className="about-section section-shell" id="about">
        <div className="about-label"><p className="eyebrow">ABOUT</p><h2>专业摘要</h2></div>
        <div className="about-copy">
          <p>
            从业务痛点出发，用 AI 重构工作流，以数据飞轮持续迭代。擅长将复杂业务链路拆解为可标准化的产品模块，通过 Agent 架构与 RAG 知识库实现智能化，并以多端触点矩阵闭环转化。
          </p>
          <p>
            已在高端定制摄影场景完成从 0 到 1 的 AI Native 产品矩阵落地，覆盖获客、咨询、转化、交付与复盘全链路。
          </p>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="section-shell footer-inner">
          <div>
            <p className="eyebrow">CONTACT</p>
            <h2>讨论 AI 产品、Agent 与业务落地。</h2>
          </div>
          <div className="contact-list">
            <a href="mailto:Jael_Chen@foxmail.com"><span>邮箱</span><strong>Jael_Chen@foxmail.com</strong><Arrow /></a>
            <a href="tel:18874988048"><span>手机</span><strong>18874988048</strong><Arrow /></a>
            <a href="https://github.com/Catcherog" target="_blank" rel="noreferrer"><span>GitHub</span><strong>Catcherog</strong><Arrow /></a>
          </div>
          <div className="footer-bottom"><span>© 2026 陈嘉伟</span><a href="#top">返回顶部 ↑</a></div>
        </div>
      </footer>
    </main>
  );
}
