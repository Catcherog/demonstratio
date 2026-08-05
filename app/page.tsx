import { ExperienceContact } from "@/components/home/ExperienceContact";
import { FeaturedCases } from "@/components/home/FeaturedCases";
import { Hero } from "@/components/home/Hero";
import { ProductMethod } from "@/components/home/ProductMethod";
import { Header } from "@/components/Header";
import { PortfolioGuide } from "@/components/PortfolioGuide";
import { ProjectLibrary } from "@/components/ProjectLibrary";
import { SystemMap } from "@/components/SystemMap";
import { featuredProjects, getPublicMetrics, homepageProjects } from "@/content/projects";

const heroMetrics = getPublicMetrics("hero");

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "陈嘉伟",
    url: "https://www.jaelchen.com",
    jobTitle: "AI / Agent 产品经理",
    sameAs: ["https://github.com/Catcherog"],
    knowsAbout: ["AI 产品", "Agent 工作流", "RAG", "数据治理", "人机协作", "多模态产品", "LoRA 微调"],
  };
  const workSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "陈嘉伟 AI 产品案例",
    numberOfItems: homepageProjects.length,
    itemListElement: homepageProjects.map((project, index) => ({
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
            <div>
              <p className="eyebrow">CROSS-PROJECT ARCHITECTURE</p>
              <h2>3 个旗舰产品案例 + 1 个模型能力项目，组成一套五层 AI 产品系统。</h2>
            </div>
            <p>
              客户触点负责体验与留资，智能服务处理咨询和数据摄入，数据中台统一业务流转，
              增长引擎反哺内容，LoRA 项目验证业务语料训练与本地推理。
            </p>
          </div>
          <SystemMap />
        </div>
      </section>

      <ProductMethod />
      <PortfolioGuide />

      <section className="section-shell section-block project-library-section" id="projects">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">ALL PROJECTS</p><h2>完整项目库</h2></div>
          <p>前三个旗舰产品案例承担核心产品叙事，LoRA 作为第四项模型能力证明；其余五个案例保留独立详情、当前状态和能力边界。</p>
        </div>
        <ProjectLibrary projects={homepageProjects} />
      </section>

      <ExperienceContact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }} />
    </main>
  );
}
