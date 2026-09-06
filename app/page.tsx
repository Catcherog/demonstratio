import { ExperienceContact } from "@/components/home/ExperienceContact";
import { FeaturedCases } from "@/components/home/FeaturedCases";
import { Hero } from "@/components/home/Hero";
import { BusinessOsOverview } from "@/components/home/BusinessOsOverview";
import { ProductMethod } from "@/components/home/ProductMethod";
import { Header } from "@/components/Header";
import { PortfolioGuide } from "@/components/PortfolioGuide";
import { ProjectLibrary } from "@/components/ProjectLibrary";
import { SystemMap } from "@/components/SystemMap";
import { portfolioStory } from "@/content/portfolio-story";
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
    knowsAbout: ["AI 产品", "Agent 工作流", "RAG", "数据治理", "人机协作", "多模态产品"],
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
    about: portfolioStory.buildLoop,
  };

  return (
    <main id="top">
      <Header />
      <Hero metrics={heroMetrics} />
      <BusinessOsOverview />

      <section className="system-section" id="system">
        <div className="section-shell">
          <div className="section-heading system-heading">
            <div><p className="eyebrow">CROSS-PROJECT ARCHITECTURE</p><h2>{portfolioStory.headline}</h2></div>
            <p>{portfolioStory.systemDescription}</p>
          </div>
          <SystemMap />
        </div>
      </section>

      <FeaturedCases projects={featuredProjects} />

      <ProductMethod />
      <PortfolioGuide />

      <section className="section-shell section-block project-library-section" id="projects">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">ALL PROJECTS</p><h2>完整项目库</h2></div>
          <p>三个主案例继续承担核心叙事；另外六个案例保留独立详情、当前状态和能力边界，可按 Agent、数据、多模态、用户产品、增长与模型训练筛选。</p>
        </div>
        <ProjectLibrary projects={homepageProjects} />
      </section>

      <ExperienceContact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }} />
    </main>
  );
}
