import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: "https://www.jaelchen.com",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `https://www.jaelchen.com/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.75,
    })),
  ];
}
