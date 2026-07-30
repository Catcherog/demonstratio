import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlagshipCasePage } from "@/components/case-study/FlagshipCasePage";
import { LegacyProjectPage } from "@/components/case-study/LegacyProjectPage";
import { getFlagshipCaseStudy } from "@/content/flagship-cases";
import { evidenceByProject } from "@/content/portfolio-evidence";
import { getProject, projects } from "@/content/projects";

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

  const study = getFlagshipCaseStudy(slug);
  if (study) {
    return <FlagshipCasePage project={project} study={study} evidence={evidenceByProject[slug] ?? []} />;
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];
  return <LegacyProjectPage project={project} previous={previous} next={next} />;
}
