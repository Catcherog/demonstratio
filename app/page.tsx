import Image from "next/image";
import { DataFlywheel } from "@/components/DataFlywheel";
import { Header } from "@/components/Header";
import { ProjectLibrary } from "@/components/ProjectLibrary";
import { SystemMap } from "@/components/SystemMap";
import { capabilityChain, capabilities, experimentProjects, featuredProjects } from "@/content/projects";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  const featuredCount = featuredProjects.length;
  const experimentCount = experimentProjects.length;

  return (
    <main id="top">
      <Header />

      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="availability"><span /> OPEN TO AI PRODUCT OPPORTUNITIES</div>
          <p className="eyebrow">AI / AGENT PRODUCT MANAGER · TECHNICAL BUILDER</p>
          <h1>AI Agent 产品经理,专注把复杂业务流程转化为可治理、可协同、可交付的 AI 系统。</h1>
          <p className="hero-lead">
            我是陈嘉伟。曾在 TP-Link 管理复杂软硬件项目组合,现作为 3 人全职创业团队的创始人兼 AI 产品负责人,围绕业务建模、Agent 编排、数据治理、人工复核、多端产品与云端交付构建 AI 产品矩阵。
          </p>
          <div className="hero-tags">
            <span>业务建模</span>
            <span>Agent 编排</span>
            <span>数据治理</span>
            <span>人工复核</span>
            <span>多端产品</span>
            <span>云端交付</span>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#featured">查看重点案例 <span>↓</span></a>
            <a className="button button-ghost" href="#contact">联系 <Arrow /></a>
          </div>
          <div className="hero-links">
            <a href="https://github.com/Catcherog" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:Jael_Chen@foxmail.com">Email</a>
            <a href="#contact">联系</a>
          </div>
        </div>

        <div className="hero-visual" aria-label="重点项目界面预览">
          {featuredProjects.slice(0, 3).map((project, index) => {
            const positions = ["hero-panel-main", "hero-panel-top", "hero-panel-bottom"];
            return (
              <a key={project.slug} className={`hero-panel ${positions[index]}`} href={`/projects/${project.slug}`}>
                <Image src={project.images[0]} alt={`${project.title} 产品界面`} fill priority sizes="(max-width: 900px) 92vw, 620px" />
                <span>{project.index} · {project.categoryLabel.split("·")[0].trim()}</span>
              </a>
            );
          })}
        </div>

        <div className="hero-metrics">
          <div><strong>{featuredCount}</strong><span>Featured Case Studies</span></div>
          <div><strong>{experimentCount}</strong><span>Selected Experiments</span></div>
          <div><strong>17 / 12</strong><span>数据表 / 自动化(历史基线)</span></div>
          <div><strong>282 / 80+</strong><span>SKU / 峰值并行项目</span></div>
        </div>
      </section>

      <section className="proof-section">
        <div className="section-shell proof-grid">
          {capabilities.map((capability, index) => (
            <article className="proof-card" key={capability.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{capability.title}</h2>
              <p>{capability.body}</p>
              <small>{capability.evidence}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="capability-chain-section" id="capability">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CAPABILITY FRAMEWORK</p>
              <h2>从业务问题到可交付的 AI 系统,一条完整能力链。</h2>
            </div>
            <p>不把 LLM 直接等同于产品。先定义业务对象、风险和人工边界,再把可确定的规则、检索和工具调用放入工作流,最后用可复现证据验证输入、决策、写入和反馈闭环。</p>
          </div>
          <div className="capability-chain">
            {capabilityChain.map((step, index) => (
              <div className="chain-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
                {index < capabilityChain.length - 1 && <span className="chain-arrow" aria-hidden="true">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-block" id="featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FEATURED CASE STUDIES</p>
            <h2>{featuredCount} 个主案例,证明核心能力。</h2>
          </div>
          <p>飞书 AI 业务数据平台、Service Agent 与光砚分别证明数据治理、Agent 可靠性与多模态产品化能力;其余项目作为 Selected Experiments 保留在完整项目库。</p>
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
                <div className="featured-tags">
                  {project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <dl className="featured-scope">
                  <div><dt>当前状态</dt><dd>{project.status}</dd></div>
                  <div><dt>核心决策</dt><dd>{project.decisions[0]}</dd></div>
                  <div><dt>验证证据</dt><dd>{project.outcomes[0]}</dd></div>
                </dl>
                <div className="featured-actions">
                  <a className="case-link" href={`/projects/${project.slug}`}>阅读完整案例 <Arrow /></a>
                  {project.link && (
                    <a className="case-demo" href={project.link.href} target={project.link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {project.link.label}
                      {project.link.note && <small>{project.link.note}</small>}
                    </a>
                  )}
                </div>
              </div>
              <span className="featured-number">{String(index + 1).padStart(2, "0")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="system-section" id="system">
        <div className="section-shell">
          <div className="section-heading system-heading">
            <div>
              <p className="eyebrow">CROSS-PROJECT ARCHITECTURE</p>
              <h2>{featuredCount} 个主案例 + {experimentCount} 个实验项目,组成一套 AI 产品系统。</h2>
            </div>
            <p>客户触点负责体验与留资,智能服务处理咨询和数据摄入,数据平台统一业务流转,增长引擎反哺内容,模型层提供本地训练与推理。</p>
          </div>
          <SystemMap />
        </div>
      </section>

      <section className="method-section" id="method">
        <div className="section-shell method-layout">
          <div className="method-copy">
            <p className="eyebrow">RELIABILITY BY DESIGN</p>
            <h2>AI 产品的核心不是"自动化更多",而是错误可控。</h2>
            <p className="method-lead">先定义业务边界和失败成本,再设计模型、工具调用、人工接管与数据反馈。</p>
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
            <p className="eyebrow">SELECTED EXPERIMENTS</p>
            <h2>实验与辅助能力</h2>
          </div>
          <p>以下项目作为主案例的技术附录与辅助能力,不抢占首页主要视觉层级。按岗位需要筛选 Agent、数据、多模态、用户端、增长与模型训练案例。</p>
        </div>
        <ProjectLibrary projects={experimentProjects} />
        <p className="metric-note">指标说明:标注为"内部估算 / 业务估算"的数值来自小样本测试或运营观察,未作为经过大样本验证的业务结论。</p>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-shell experience-layout">
          <div>
            <p className="eyebrow">EXPERIENCE</p>
            <h2>从复杂项目交付,到 AI 产品创业。</h2>
          </div>
          <div className="timeline">
            <article>
              <div className="timeline-date">2026.02 - 至今</div>
              <div className="timeline-content">
                <span>全职创业 · 3 人团队</span>
                <h3>泽怀摄影工作室｜创始人兼 AI 产品负责人</h3>
                <p>从 0 到 1 构建 AI Native 产品矩阵,负责产品战略、业务建模、MVP 验证、技术方案与上线协同。</p>
                <ul>
                  <li>{featuredCount} 个主案例 + {experimentCount} 个实验项目</li>
                  <li>业务建模、Agent 编排、数据治理与多端产品端到端实践</li>
                  <li>LangGraph、RAG、多模态与 QLoRA 真实落地</li>
                </ul>
              </div>
            </article>
            <article>
              <div className="timeline-date">2024.07 - 2026.02</div>
              <div className="timeline-content">
                <span>复杂项目组合管理</span>
                <h3>TP-Link｜商用项目经理</h3>
                <p>负责 5 条软硬件产品线的项目组合、跨国需求和高风险交付,在供应链、研发与质量约束下推进决策。</p>
                <ul>
                  <li>282 个 SKU 全生命周期、峰值 80+ 项目并行</li>
                  <li>主导海外 NFC 功能定义与交互方案</li>
                  <li>高风险项目追回 2 周工期,5 款产品提前 15 天量产</li>
                </ul>
              </div>
            </article>
            <article>
              <div className="timeline-date">2020.09 - 2024.06</div>
              <div className="timeline-content">
                <span>材料科学与结构化思维</span>
                <h3>中南大学｜材料物理本科</h3>
                <p>大学生创新创业项目省级奖项,参与固态电池材料课题;校辩论队核心成员,CET-6。</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-layout">
          <div>
            <p className="eyebrow">CONTACT</p>
            <h2>目标方向:AI 应用 / Agent 产品经理。</h2>
            <p>倾向有技术深度、重视真实落地和产品评估的 AI 公司。接受全国、海外及远程机会。</p>
          </div>
          <div className="contact-actions">
            <a href="mailto:Jael_Chen@foxmail.com"><span>邮箱</span><strong>Jael_Chen@foxmail.com</strong><Arrow /></a>
            <a href="https://github.com/Catcherog" target="_blank" rel="noreferrer"><span>GitHub</span><strong>Catcherog</strong><Arrow /></a>
            <a href="/resume/chen-jiawei-ai-agent-cn-one-page.pdf" target="_blank" rel="noreferrer"><span>简历(临时入口)</span><strong>PDF</strong><Arrow /></a>
          </div>
        </div>
        <div className="section-shell footer-bottom"><span>© 2026 陈嘉伟</span><a href="#top">返回顶部 ↑</a></div>
      </section>
    </main>
  );
}
