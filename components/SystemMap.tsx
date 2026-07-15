const layers = [
  {
    label: "客户触点层",
    caption: "将 AI 能力转化为浏览、体验与咨询",
    projects: [
      ["03", "光砚", "lumen-ink"],
      ["07", "微信小程序", "mini-program"],
      ["08", "品牌官网", "brand-website"],
    ],
  },
  {
    label: "智能服务层",
    caption: "咨询应答、质量闸门与非结构化摄入",
    projects: [
      ["02", "Service Agent", "service-agent"],
      ["04", "微信机器人", "wechat-bot"],
      ["05", "Collator", "collator"],
    ],
  },
  {
    label: "数据中台层",
    caption: "统一客户、项目、素材、内容与知识数据",
    projects: [["01", "数据中台 + APP", "data-platform"]],
  },
  {
    label: "增长引擎层",
    caption: "跨平台调研与内容反哺",
    projects: [["06", "内容调研", "content-research"]],
  },
  {
    label: "模型层",
    caption: "业务语料、微调与本地推理",
    projects: [["09", "LoRA 微调", "lora-finetuning"]],
  },
] as const;

export function SystemMap() {
  return (
    <div className="system-map" aria-label="五层 AI 产品架构">
      <div className="system-spine" aria-hidden="true" />
      {layers.map((layer, index) => (
        <div className="system-layer" key={layer.label}>
          <div className="layer-heading">
            <span>0{index + 1}</span>
            <div><h3>{layer.label}</h3><p>{layer.caption}</p></div>
          </div>
          <div className="layer-projects">
            {layer.projects.map(([number, title, slug]) => (
              <a href={`/projects/${slug}`} key={slug}>
                <span>{number}</span>
                <strong>{title}</strong>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
