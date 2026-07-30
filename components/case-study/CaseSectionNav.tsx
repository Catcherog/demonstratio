"use client";

import { useEffect, useState } from "react";

export const CASE_SECTIONS = [
  ["overview", "项目概览"],
  ["business", "业务判断"],
  ["product", "产品方案"],
  ["technical", "技术实现"],
  ["iterations", "迭代链路"],
  ["evidence", "项目证据"],
] as const;

type SectionItem = Readonly<{ id: string; label: string }> | readonly [string, string];

function normalizeItem(item: SectionItem) {
  return Array.isArray(item) ? { id: item[0], label: item[1] } : item;
}

export function CaseSectionNav({ items = CASE_SECTIONS }: { items?: ReadonlyArray<SectionItem> }) {
  const normalizedItems = items.map(normalizeItem);
  const itemKey = normalizedItems.map((item) => item.id).join("|");
  const [activeId, setActiveId] = useState(normalizedItems[0]?.id ?? "overview");

  useEffect(() => {
    const ids = normalizedItems.map((item) => item.id);
    const hashId = window.location.hash.slice(1);
    if (ids.includes(hashId)) setActiveId(hashId);

    if (!("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => Math.abs(left.boundingClientRect.top - 132) - Math.abs(right.boundingClientRect.top - 132));
        const next = visible[0]?.target.id;
        if (next) setActiveId(next);
      },
      { rootMargin: "-132px 0px -58% 0px", threshold: [0, 0.2, 0.6] },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [itemKey]);

  return (
    <nav className="case-section-nav" aria-label="案例板块导航">
      <div className="case-section-nav-inner">
        {normalizedItems.map((item) => (
          <a key={item.id} href={`#${item.id}`} aria-current={activeId === item.id ? "location" : undefined}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
