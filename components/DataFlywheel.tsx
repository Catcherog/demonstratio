const steps = [
  ["01", "咨询接入", "公众号 / 小程序 / 官网"],
  ["02", "置信度判断", "建议 / 复核 / 转人工"],
  ["03", "会话归档", "本地记录 + COS"],
  ["04", "清洗与确认", "人工质量闸门"],
  ["05", "知识同步", "飞书主源 + 检索镜像"],
  ["06", "检索增强", "查询改写 + 重排序"],
] as const;

export function DataFlywheel() {
  return (
    <div className="flywheel" aria-label="数据飞轮闭环">
      <div className="flywheel-center">
        <span>DATA</span>
        <strong>越用越准</strong>
        <small>不是一次性问答</small>
      </div>
      {steps.map(([number, title, detail], index) => (
        <div className={`flywheel-step flywheel-step-${index + 1}`} key={number}>
          <span>{number}</span><strong>{title}</strong><small>{detail}</small>
        </div>
      ))}
      <div className="flywheel-ring" aria-hidden="true" />
    </div>
  );
}
