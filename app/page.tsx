import Image from "next/image";
import { DataFlywheel } from "@/components/DataFlywheel";
import { Header } from "@/components/Header";
import { ProjectLibrary } from "@/components/ProjectLibrary";
import { SystemMap } from "@/components/SystemMap";
import { capabilities, projects } from "@/content/projects";

const Arrow = () => <span aria-hidden="true">↗</span>;

const featuredProjects = ["data-platform", "service-agent", "collator", "lumen-ink"]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

export default function Home() {
  return (
    <main id="top">
      <Header />

      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="availability"><span /> OPEN TO AI PRODUCT OPPORTUNITIES</div>
          <p className="eyebrow">AI / AGENT PRODUCT MANAGER · TECHNICAL BUILDER</p>
          <h1>把复杂业务，做成可上线、可评估的 AI 产品。</h1>
          <p className="hero-lead">
            我是陈嘉伟。曾在 TP-Link 管理复杂软硬件项目组合，现作为 3 人全职创业团队的创始人兼 AI 产品负责人，围绕数据中台、Service Agent、Collator 与光砚构建 4 个核心产品，并以 5 个支撑模块完成业务闭环。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#featured">查看重点案例 <span>↓</span></a>
            <a className="button button-ghost" href="/resume/chen-jiawei-ai-agent-cn-one-page.pdf" target="_blank" rel="noreferrer">下载中文简历 <Arrow /></a>
          </div>
          <div className="hero-links">
            <a href="/resume/jiawei-chen-ai-agent-en.pdf" target="_blank" rel="noreferrer">English Resume</a>
            <a href="https://github.com/Catcherog" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:Jael_Chen@foxmail.com">Email</a>
          </div>
        </div>

        <div className="hero-visual" aria-label="重点项目界面预览">
          <a className="hero-panel hero-panel-main" href="/projects/service-agent">
            <Image src="/projects/service-agent/01.webp" alt="Service Agent 产品界面" fill priority sizes="(max-width: 900px) 92vw, 620px" />
            <span>02 · SERVICE AGENT</span>
          </a>
          <a className="hero-panel hero-panel-top" href="/projects/lumen-ink">
            <Image src="/projects/lumen-ink/01.webp" alt="光砚 AI 图像编辑工作台" fill priority sizes="300px" />
            <span>03 · MULTIMODAL</span>
          </a>
          <a className="hero-panel hero-panel-bottom" href="/projects/collator">
            <Image src="/projects/collator/01.webp" alt="Collator 数据摄入 Agent" fill priority sizes="320px" />
            <span>05 · DATA AGENT</span>
          </a>
        </div>

        <div className="hero-metrics">
          <div><strong>4</strong><span>核心 AI 产品</span></div>
          <div><strong>5</strong><span>业务支撑模块</span></div>
          <div><strong>17 / 12</strong><span>数据表 / 自动化规则</span></div>
          <div><strong>282 / 80+</strong><span>SKU / 峰值并行项目</span></div>
        </div>
      </section>

      <section className="proof-section">
        <div className="section-shell proof-grid">
          {capabilities.map((capability, index) => (
            <article className="proof-card" key={capability.title}>
              <span>0{index + 1}</span>
              <h2>{capability.title}</h2>
              <p>{capability.body}</p>
              <small>{capability.evidence}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell section-block" id="featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FEATURED CASE STUDIES</p>
            <h2>四个案例，证明四项关键能力。</h2>
          </div>
          <p>数据中台、Service Agent、Collator 与光砚分别证明业务系统设计、Agent 可靠性、数据智能和多模态产品化能力；其余五个模块作为系统支撑保留在完整项目库，并随验证进度持续迭代。</p>
        </div>

        <div className="featured-list">
          {featuredProjects.map((project, index) => (
            <article className="featured-card" key={project.slug}>
              <a className="featured-image" href={`/projects/${project.slug}`}>
                <Image src={project.images[0]} alt={`${project.title} 项目预览`} fill sizes="(max-width: 900px) 100vw, 58vw" />
                <span>{project.status}</span>
              </a>
              <div className="featured-copy">
                <div className="featured-index"><span>{project.index}</span><strong>{project.category}</strong></div>
                <h3>{project.title}</h3>
                <p className="featured-subtitle">{project.subtitle}</p>
                <p className="featured-summary">{project.summary}</p>
                <dl className="featured-scope">
                  <div><dt>我的角色</dt><dd>{project.role}</dd></div>
                  <div><dt>核心决策</dt><dd>{project.decisions[0]}</dd></div>
                  <div><dt>验证证据</dt><dd>{project.outcomes[0]}</dd></div>
                </dl>
                <div className="featured-metrics">
                  {project.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}{metric.note ? ` · ${metric.note}` : ""}</span></div>
                  ))}
                </div>
                <a className="case-link" href={`/projects/${project.slug}`}>阅读完整案例 <Arrow /></a>
              </div>
              <span className="featured-number">0{index + 1}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="system-section" id="system">
        <div className="section-shell">
          <div className="section-heading system-heading">
            <div>
              <p className="eyebrow">CROSS-PROJECT ARCHITECTURE</p>
              <h2>4 个核心产品 + 5 个支撑模块，组成一套五层 AI 产品系统。</h2>
            </div>
            <p>客户触点负责体验与留资，智能服务处理咨询和数据摄入，数据中台统一业务流转，增长引擎反哺内容，模型层提供本地训练与推理。</p>
          </div>
          <SystemMap />
        </div>
      </section>

      <section className="method-section" id="method">
        <div className="section-shell method-layout">
          <div className="method-copy">
            <p className="eyebrow">RELIABILITY BY DESIGN</p>
            <h2>AI 产品的核心不是“自动化更多”，而是错误可控。</h2>
            <p className="method-lead">我的方法是先定义业务边界和失败成本，再设计模型、工具调用、人工接管与数据反馈。</p>
            <div className="method-principles">
              <div><span>01</span><strong>业务链路先于模型</strong><p>先识别角色、关键节点、异常路径和可量化结果。</p></div>
              <div><span>02</span><strong>质量闸门先于全自动</strong><p>用置信度、规则校验和人工确认控制高风险输出。</p></div>
              <div><span>03</span><strong>评估先于规模化</strong><p>区分训练 loss、离线检索指标和真实业务效果。</p></div>
              <div><span>04</span><strong>数据回流先于一次性交付</strong><p>让确认后的真实数据持续更新知识、规则和模型。</p></div>
            </div>
          </div>
          <DataFlywheel />
        </div>
      </section>

      <section className="section-shell section-block project-library-section" id="projects">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ALL PROJECTS</p>
            <h2>完整项目库</h2>
          </div>
          <p>按岗位需要筛选 Agent、数据、多模态、用户端、增长与模型训练案例。重点项目优先补强在线体验与评测证据，支撑模块保留当前可信状态并持续更新。</p>
        </div>
        <ProjectLibrary projects={projects} />
        <p className="metric-note">指标说明：标注为“内部估算 / 业务估算”的数值来自小样本测试或运营观察，未作为经过大样本验证的业务结论。</p>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-shell experience-layout">
          <div>
            <p className="eyebrow">EXPERIENCE</p>
            <h2>从复杂项目交付，到 AI 产品创业。</h2>
          </div>
          <div className="timeline">
            <article>
              <div className="timeline-date">2026.02 - 至今</div>
              <div className="timeline-content">
                <span>全职创业 · 3 人团队</span>
                <h3>泽怀摄影工作室｜创始人兼 AI 产品负责人</h3>
                <p>从 0 到 1 构建五层 AI Native 产品矩阵，负责产品战略、业务建模、MVP 验证、技术方案与上线协同。</p>
                <ul>
                  <li>4 个核心 AI 产品 + 5 个业务支撑模块</li>
                  <li>12 个关键业务节点、17 张数据表、12 条自动化</li>
                  <li>Agent、RAG、多模态与 QLoRA 端到端实践</li>
                </ul>
              </div>
            </article>
            <article>
              <div className="timeline-date">2024.07 - 2026.02</div>
              <div className="timeline-content">
                <span>复杂项目组合管理</span>
                <h3>TP-Link｜商用项目经理</h3>
                <p>负责 5 条软硬件产品线的项目组合、跨国需求和高风险交付，在供应链、研发与质量约束下推进决策。</p>
                <ul>
                  <li>282 个 SKU 全生命周期、峰值 80+ 项目并行</li>
                  <li>主导海外 NFC 功能定义与交互方案</li>
                  <li>高风险项目追回 2 周工期，5 款产品提前 15 天量产</li>
                </ul>
              </div>
            </article>
            <article>
              <div className="timeline-date">2020.09 - 2024.06</div>
              <div className="timeline-content">
                <span>材料科学与结构化思维</span>
                <h3>中南大学｜材料物理本科</h3>
                <p>大学生创新创业项目省级奖项，参与固态电池材料课题；校辩论队核心成员，CET-6。</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-layout">
          <div>
            <p className="eyebrow">CONTACT</p>
            <h2>目标方向：AI 应用 / Agent 产品经理。</h2>
            <p>倾向有技术深度、重视真实落地和产品评估的 AI 公司。接受全国、海外及远程机会。</p>
          </div>
          <div className="contact-actions">
            <a href="mailto:Jael_Chen@foxmail.com"><span>邮箱</span><strong>Jael_Chen@foxmail.com</strong><Arrow /></a>
            <a href="tel:18874988048"><span>手机</span><strong>18874988048</strong><Arrow /></a>
            <a href="/resume/chen-jiawei-ai-agent-cn-one-page.pdf" target="_blank" rel="noreferrer"><span>中文一页简历</span><strong>PDF</strong><Arrow /></a>
            <a href="/resume/chen-jiawei-ai-agent-cn-two-page.pdf" target="_blank" rel="noreferrer"><span>中文项目简历</span><strong>PDF</strong><Arrow /></a>
            <a href="/resume/jiawei-chen-ai-agent-en.pdf" target="_blank" rel="noreferrer"><span>English Resume</span><strong>PDF</strong><Arrow /></a>
          </div>
        </div>
        <div className="section-shell footer-bottom"><span>© 2026 陈嘉伟</span><a href="#top">返回顶部 ↑</a></div>
      </section>
    </main>
  );
}
