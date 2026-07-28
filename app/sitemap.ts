import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: "https://jaelchen-portfolio-vercel-extracted.vercel.app",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...featuredProjects.map((project) => ({
      url: `https://jaelchen-portfolio-vercel-extracted.vercel.app/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.75,
    })),
  ];
}
