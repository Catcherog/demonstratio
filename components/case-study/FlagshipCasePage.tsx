import { Header } from "@/components/Header";
import type { Project } from "@/content/projects";
import type { FlagshipCaseStudy } from "@/content/flagship-cases";
import type { PortfolioEvidence } from "@/content/portfolio-evidence";
import { BusinessContext } from "./BusinessContext";
import { CaseEvidenceGallery } from "./CaseEvidenceGallery";
import { CaseHero } from "./CaseHero";
import { CaseOverview } from "./CaseOverview";
import { CASE_SECTIONS, CaseSectionNav } from "./CaseSectionNav";
import { IterationPath } from "./IterationPath";
import { ProductDesign } from "./ProductDesign";
import { TechnicalImplementation } from "./TechnicalImplementation";

export function FlagshipCasePage({ project, study, evidence }: { project: Project; study: FlagshipCaseStudy; evidence: PortfolioEvidence[] }) {
  return (
    <main id="top" className="case-page flagship-case">
      <Header />
      <article>
        <CaseHero project={project} study={study} />
        <div className="flagship-case-body section-shell">
          <CaseSectionNav items={CASE_SECTIONS} />
          <div className="flagship-case-sections">
            <CaseOverview id="overview" project={project} study={study} />
            <CaseEvidenceGallery id="evidence" items={evidence} />
            <BusinessContext id="business" study={study} />
            <ProductDesign id="product" study={study} />
            <TechnicalImplementation id="technical" study={study} />
            <IterationPath id="iterations" entries={study.iterations} />
          </div>
        </div>
      </article>
      <nav className="flagship-footer-nav section-shell" aria-label="案例后续操作">
        <a href="/#featured">返回三个主案例</a>
        <a href="mailto:Jael_Chen@foxmail.com">联系讨论案例</a>
      </nav>
    </main>
  );
}
