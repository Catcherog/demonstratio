type Props = {
  href: string;
  label?: string;
  caption?: string;
  external?: boolean;
};

export function LiveExperienceBadge({
  href,
  label = "在线体验",
  caption = "Open demo",
  external = false,
}: Props) {
  return (
    <a
      className="live-experience-badge"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={`${label}：${caption}`}
    >
      <span className="live-experience-dot" aria-hidden="true" />
      <span className="live-experience-copy">
        <strong>{label}</strong>
        <small>{caption}</small>
      </span>
      <span className="live-experience-arrow" aria-hidden="true">↗</span>
    </a>
  );
}
