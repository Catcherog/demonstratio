"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project, ProjectCategory } from "@/content/projects";
import { categories } from "@/content/projects";

type Props = { projects: Project[] };

export function ProjectLibrary({ projects }: Props) {
  const [active, setActive] = useState<ProjectCategory | "全部">("全部");
  const visible = active === "全部" ? projects : projects.filter((project) => project.category === active);

  return (
    <>
      <div className="filter-row" role="tablist" aria-label="项目分类筛选">
        {categories.map((category) => (
          <button
            key={category}
            className={active === category ? "filter-button filter-active" : "filter-button"}
            onClick={() => setActive(category)}
            role="tab"
            aria-selected={active === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="library-grid">
        {visible.map((project) => (
          <a className="library-card" href={`/projects/${project.slug}`} key={project.slug}>
            <div className="library-image">
              <Image src={project.images[0]} alt={`${project.title} 项目预览`} fill sizes="(max-width: 760px) 100vw, 33vw" />
              <span className="library-status">{project.status}</span>
            </div>
            <div className="library-body">
              <div className="library-meta"><span>{project.index}</span><span>{project.category}</span></div>
              <h3>{project.title}</h3>
              <p>{project.subtitle}</p>
              <div className="library-evidence">
                {project.metrics.slice(0, 2).map((metric) => (
                  <span key={metric.label}><strong>{metric.value}</strong>{metric.label}</span>
                ))}
              </div>
              <span className="text-link">阅读案例 <span aria-hidden="true">→</span></span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
