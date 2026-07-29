"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { categories, type Project, type ProjectCategory } from "@/content/projects";

type Props = { projects: Project[] };

export function ProjectLibrary({ projects }: Props) {
  const [active, setActive] = useState<ProjectCategory | "全部">("全部");

  const visible = useMemo(() => {
    const filtered = active === "全部" ? projects : projects.filter((project) => project.category === active);
    return [...filtered].sort((left, right) => {
      if (Boolean(left.featured) !== Boolean(right.featured)) return left.featured ? -1 : 1;
      return left.index.localeCompare(right.index, "zh-CN", { numeric: true });
    });
  }, [active, projects]);

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
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="library-summary" aria-live="polite">
        <span>{active}</span>
        <strong>{visible.length} 个案例</strong>
        <small>三个主案例优先展示，其余案例保留独立详情与真实状态。</small>
      </div>

      <div className="library-grid">
        {visible.map((project) => (
          <a
            className={project.featured ? "library-card library-card-featured" : "library-card library-card-supporting"}
            href={`/projects/${project.slug}`}
            key={project.slug}
          >
            <div className="library-image">
              <Image
                src={project.images[0]}
                alt={`${project.title} 项目预览`}
                fill
                sizes="(max-width: 760px) 100vw, 33vw"
              />
              <span className="library-status">{project.status}</span>
              <span className="library-tier">{project.featured ? "旗舰案例" : "更多案例"}</span>
            </div>

            <div className="library-body">
              <div className="library-meta">
                <span>{project.index}</span>
                <span>{project.category}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.subtitle}</p>
              <small className="library-role">我的角色：{project.role}</small>

              {project.metrics.length > 0 ? (
                <div className="library-evidence">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <span key={`${project.slug}-${metric.label}`}>
                      <strong>{metric.value}</strong>
                      {metric.label}
                      {metric.note ? <em>{metric.note}</em> : null}
                    </span>
                  ))}
                </div>
              ) : null}

              <span className="text-link">阅读案例 <span aria-hidden="true">→</span></span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
