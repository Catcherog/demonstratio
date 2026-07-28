import { ExperienceContact } from "@/components/home/ExperienceContact";
import { FeaturedCases } from "@/components/home/FeaturedCases";
import { Hero } from "@/components/home/Hero";
import { PortfolioGuide } from "@/components/home/PortfolioGuide";
import { ProductMethod } from "@/components/home/ProductMethod";
import { Header } from "@/components/Header";
import { ProjectLibrary } from "@/components/ProjectLibrary";
import { SystemMap } from "@/components/SystemMap";
import { getPublicMetrics, projects } from "@/content/projects";

const featuredProjects = ["data-platform", "service-agent", "lumen-ink"]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

const heroMetrics = getPublicMetrics("hero");

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "陈嘉伟",
    url: "https://www.jaelchen.com",
    jobTitle: "AI / Agent 产品经理",
    sameAs: ["https://github.com/Catcherog"],
    knowsAbout: ["AI 产品", "Agent 工作流", "RAG", "数据治理", "人机协作", "多模态产品"],
  };
  const workSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "陈嘉伟 AI 产品案例",
    numberOfItems: projects.length,
    itemListElement: featuredProjects.map((project, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: project.title,
      description: project.summary,
      url: `https://www.jaelchen.com/projects/${project.slug}`,
      creator: { "@type": "Person", name: "陈嘉伟" },
    })),
  };

  return (
    <main id="top">
      <Header />
      <Hero metrics={heroMetrics} />
      <FeaturedCases projects={featuredProjects} />

      <section className="system-section" id="system">
        <div className="section-shell">
          <div className="section-heading system-heading">
            <div><p className="eyebrow">CROSS-PROJECT ARCHITECTURE</p><h2>3 个主案例 + 飞书子系统，组成一套五层 AI 产品系统。</h2></div>
            <p>客户触点负责体验与留资，智能服务处理咨询和数据摄入，数据中台统一业务流转，增长引擎反哺内容，模型层提供本地训练与推理。</p>
          </div>
          <SystemMap />
        </div>
      </section>

      <ProductMethod />
      <PortfolioGuide />

      <section className="section-shell section-block project-library-section" id="projects">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">ALL PROJECTS</p><h2>完整项目库</h2></div>
          <p>公开案例库只展示三个同优先级主案例；支撑模块仅作为架构关系出现，不发布缺少 R1.3 证据绑定的量化结果。</p>
        </div>
        <ProjectLibrary projects={featuredProjects} />
      </section>

      <ExperienceContact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }} />
    </main>
  );
}
