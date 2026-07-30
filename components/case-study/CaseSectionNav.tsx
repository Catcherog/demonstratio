export const CASE_SECTIONS = [
  { id: "overview", label: "项目概览" },
  { id: "business", label: "业务判断" },
  { id: "product", label: "产品方案" },
  { id: "technical", label: "技术实现" },
  { id: "iterations", label: "迭代链路" },
  { id: "evidence", label: "项目证据" },
] as const;

export function CaseSectionNav({ items = CASE_SECTIONS }: { items?: ReadonlyArray<{ id: string; label: string }> }) {
  return (
    <nav className="case-section-nav" aria-label="案例板块导航">
      <div className="case-section-nav-inner">
        {items.map((item, index) => (
          <a key={item.id} href={`#${item.id}`} aria-current={index === 0 ? "location" : undefined}>{item.label}</a>
        ))}
      </div>
    </nav>
  );
}
