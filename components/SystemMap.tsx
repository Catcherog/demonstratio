const layers = [
  {
    label: "客户触点层",
    caption: "将 AI 能力转化为浏览、体验与咨询",
    projects: [
      ["03", "光砚", "lumen-ink"],
      ["08", "微信小程序", "mini-program"],
      ["06", "品牌官网", "brand-website"],
    ],
  },
  {
    label: "智能服务层",
    caption: "咨询应答、质量闸门与知识飞轮",
    projects: [
      ["02", "Service Agent", "service-agent"],
      ["04", "微信机器人", "wechat-bot"],
    ],
  },
  {
    label: "数据平台层",
    caption: "飞书 AI 业务数据平台:摄入、治理、写入与执行",
    projects: [["01", "飞书平台", "feishu-platform"]],
  },
  {
    label: "增长引擎层",
    caption: "跨平台调研与内容反哺",
    projects: [["05", "内容调研", "content-research"]],
  },
  {
    label: "模型层",
    caption: "业务语料、微调与本地推理",
    projects: [["07", "LoRA 微调", "lora-finetuning"]],
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
