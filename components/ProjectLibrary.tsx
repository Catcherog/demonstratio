"use client";

import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import { categories, type Project, type ProjectCategory } from "@/content/projects";

type Props = { projects: Project[] };

const MOBILE_QUERY = "(max-width: 720px)";

function subscribeToViewport(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getCompactViewport() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
}

function getServerCompactViewport() {
  return true;
}

function getProjectTierLabel(project: Project) {
  if (project.slug === "lora-finetuning") return "模型能力";
  if (project.featured) return "旗舰案例";
  return "更多案例";
}

function CompactLibraryCard({ project }: { project: Project }) {
  const metrics = project.metrics.slice(0, 2);
  const className = project.slug === "lora-finetuning"
    ? "library-card library-card-compact library-card-compact-focus"
    : "library-card library-card-compact";

  return (
    <a className={className} href={"/projects/" + project.slug}>
      <span className="library-compact-index">{project.index}</span>
      <div className="library-compact-body">
        <div className="library-compact-meta">
          <span>{project.category}</span>
          <span>{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.subtitle}</p>
        {metrics.length > 0 ? (
          <div className="library-compact-evidence">
            {metrics.map((metric) => (
              <span key={project.slug + "-" + metric.label}>
                <strong>{metric.value}</strong>
                {metric.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <span className="library-compact-arrow" aria-hidden="true">→</span>
    </a>
  );
}

function FullLibraryCard({ project }: { project: Project }) {
  return (
    <a
      className={project.featured ? "library-card library-card-featured" : "library-card library-card-supporting"}
      href={"/projects/" + project.slug}
      key={project.slug}
    >
      <div className="library-image">
        <Image
          src={project.images[0]}
          alt={project.title + " 项目预览"}
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
        />
        <span className="library-status">{project.status}</span>
        <span className="library-tier">{getProjectTierLabel(project)}</span>
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
              <span key={project.slug + "-" + metric.label}>
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
  );
}

export function ProjectLibrary({ projects }: Props) {
  const [active, setActive] = useState<ProjectCategory | "全部">("全部");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const isCompactViewport = useSyncExternalStore(
    subscribeToViewport,
    getCompactViewport,
    getServerCompactViewport,
  );

  const visible = useMemo(() => {
    const filtered = active === "全部" ? projects : projects.filter((project) => project.category === active);
    const available = filtered.filter((project) => !project.archived);
    if (isCompactViewport && !showAllProjects) {
      return available.filter((project) => !project.featured);
    }
    return available;
  }, [active, isCompactViewport, projects, showAllProjects]);

  return (
    <div className="project-library">
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

      {isCompactViewport ? (
        <div className="library-mobile-jump">
          <span>已查看 3 个旗舰案例 + 1 个模型能力项目</span>
          <button
            type="button"
            aria-expanded={showAllProjects}
            onClick={() => {
              setActive("全部");
              setShowAllProjects((current) => !current);
            }}
          >
            {showAllProjects ? "收起重点项目" : `查看全部 ${projects.length} 个项目`} <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}

      <div className="library-summary" aria-live="polite">
        <span>{active}</span>
        <strong>{visible.length} 个案例</strong>
        <small>
          {isCompactViewport && !showAllProjects
            ? "上方已展示四项重点项目；这里继续呈现其余五个支持案例。"
            : "三个旗舰产品案例与一个模型能力项目构成核心叙事；其余案例保留独立详情与真实状态。"}
        </small>
      </div>

      <div className={isCompactViewport ? "library-grid library-grid-compact" : "library-grid"}>
        {visible.map((project) =>
          isCompactViewport
            ? <CompactLibraryCard project={project} key={project.slug} />
            : <FullLibraryCard project={project} key={project.slug} />,
        )}
      </div>
    </div>
  );
}
