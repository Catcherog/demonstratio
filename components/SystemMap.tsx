import { businessOsLayers } from "@/content/portfolio-story";

const flagshipSlugs = new Set(["data-platform", "service-agent", "lumen-ink"]);

export function SystemMap() {
  return (
    <div className="system-map" aria-label="AI BUSINESS OS 四层产品架构">
      <div className="system-spine" aria-hidden="true" />
      {businessOsLayers.map((layer) => (
        <div className="system-layer" key={layer.label}>
          <div className="layer-heading">
            <span>{layer.index}</span>
            <div><h3>{layer.label}</h3><p>{layer.caption}</p></div>
          </div>
          <div className="layer-projects">
            {layer.nodes.map((node) => (
              <a href={`/projects/${node.slug}`} key={`${layer.index}-${node.slug}-${node.index}`}>
                <span>{node.index}</span>
                <div><strong>{node.label}</strong><small>{node.detail}</small></div>
                <i aria-hidden="true">{flagshipSlugs.has(node.slug) ? "旗舰" : "案例"}</i>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
