"use client";

import { useEffect, useState } from "react";

export const CASE_SECTIONS = [
  ["overview", "项目概览"],
  ["evidence", "项目展示"],
  ["business", "业务判断"],
  ["product", "产品方案"],
  ["technical", "技术实现"],
  ["iterations", "迭代链路"],
] as const;

type SectionItem = Readonly<{ id: string; label: string }> | readonly [string, string];

function normalizeItem(item: SectionItem): { id: string; label: string } {
  if ("id" in item) return { id: item.id, label: item.label };
  return { id: item[0], label: item[1] };
}

function getStickyOffset(): number {
  const header = document.querySelector<HTMLElement>(".site-header");
  const rail = document.querySelector<HTMLElement>(".case-section-nav");
  const headerRect = header?.getBoundingClientRect();
  const headerBottom = headerRect ? Math.max(headerRect.bottom, headerRect.height) : 0;
  const railHeight = rail?.getBoundingClientRect().height ?? 0;
  return Math.ceil(headerBottom + railHeight + 12);
}

function scrollToSection(id: string, behavior: ScrollBehavior): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const top = window.scrollY + target.getBoundingClientRect().top - getStickyOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
  return true;
}

function revealNavLink(link: HTMLAnchorElement): void {
  const rail = link.closest<HTMLElement>(".case-section-nav-inner");
  if (!rail) return;

  const desiredLeft = link.offsetLeft - (rail.clientWidth - link.offsetWidth) / 2;
  const maxLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  const nextLeft = Math.min(maxLeft, Math.max(0, desiredLeft));
  if (Math.abs(rail.scrollLeft - nextLeft) < 0.5) return;

  rail.scrollTo({ left: nextLeft, behavior: "auto" });
}

export function CaseSectionNav({ items = CASE_SECTIONS }: { items?: ReadonlyArray<SectionItem> }) {
  const normalizedItems = items.map(normalizeItem);
  const itemKey = normalizedItems.map((item) => item.id).join("|");
  const [activeId, setActiveId] = useState(normalizedItems[0]?.id ?? "overview");

  useEffect(() => {
    const ids = normalizedItems.map((item) => item.id);
    const revealActiveLink = (id: string) => {
      const link = Array.from(document.querySelectorAll<HTMLAnchorElement>(".case-section-nav a"))
        .find((candidate) => candidate.getAttribute("href") === `#${id}`);
      if (link) revealNavLink(link);
    };
    const setActive = (id: string) => {
      if (!ids.includes(id)) return;
      setActiveId(id);
      revealActiveLink(id);
    };

    let observer: IntersectionObserver | null = null;
    const observeSections = () => {
      observer?.disconnect();
      if (!("IntersectionObserver" in window)) return;

      const offset = getStickyOffset();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (left, right) =>
                Math.abs(left.boundingClientRect.top - offset) -
                Math.abs(right.boundingClientRect.top - offset),
            );
          const next = visible[0]?.target.id;
          if (next) setActive(next);
        },
        { rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0, 0.2, 0.6] },
      );

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }
    };

    observeSections();

    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(observeSections) : null;
    const header = document.querySelector<HTMLElement>(".site-header");
    const rail = document.querySelector<HTMLElement>(".case-section-nav");
    if (header) resizeObserver?.observe(header);
    if (rail) resizeObserver?.observe(rail);

    const initialHash = window.location.hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      if (ids.includes(initialHash)) {
        if (scrollToSection(initialHash, "auto")) setActive(initialHash);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
    };
  }, [itemKey]);

  return (
    <nav className="case-section-nav" aria-label="案例板块导航">
      <div className="case-section-nav-inner">
        {normalizedItems.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={activeId === item.id ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              if (scrollToSection(item.id, reducedMotion ? "auto" : "smooth")) {
                setActiveId(item.id);
                revealNavLink(event.currentTarget);
              }
            }}
            onFocus={(event) => {
              revealNavLink(event.currentTarget);
            }}
          >
            <span className="case-section-nav__index">{String(index + 1).padStart(2, "0")}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
