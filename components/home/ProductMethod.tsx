import { DataFlywheel } from "@/components/DataFlywheel";

const principles = [
  ["01", "业务链路先于模型", "先识别角色、关键节点、异常路径和可量化结果。"],
  ["02", "质量闸门先于全自动", "用置信度、规则校验和人工确认控制高风险输出。"],
  ["03", "评估先于规模化", "区分训练 loss、离线检索指标和真实业务效果。"],
  ["04", "数据回流先于一次性交付", "让确认后的真实数据持续更新知识、规则和模型。"],
];

export function ProductMethod() {
  return (
    <section className="method-section" id="method">
      <div className="section-shell method-layout">
        <div className="method-copy">
          <p className="eyebrow">RELIABILITY BY DESIGN</p>
          <h2>AI 产品的核心不是“自动化更多”，而是错误可控。</h2>
          <p className="method-lead">先定义业务边界和失败成本，再设计模型、工具调用、人工接管与数据反馈。</p>
          <div className="method-principles">
            {principles.map(([index, title, body]) => (
              <article key={index}><span>{index}</span><div><strong>{title}</strong><p>{body}</p></div></article>
            ))}
          </div>
        </div>
        <DataFlywheel />
      </div>
    </section>
  );
}
