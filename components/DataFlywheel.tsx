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
    <>
      <div className="flywheel flywheel-desktop" aria-label="数据飞轮闭环">
        <div className="flywheel-center">
          <span>DATA</span>
          <strong>越用越准</strong>
          <small>不是一次性问答</small>
        </div>
        {steps.map(([number, title, detail], index) => (
          <div className={"flywheel-step flywheel-step-" + (index + 1)} key={number}>
            <span>{number}</span><strong>{title}</strong><small>{detail}</small>
          </div>
        ))}
        <div className="flywheel-ring" aria-hidden="true" />
      </div>

      <ol className="flywheel-mobile" aria-label="手机端数据飞轮六步闭环">
        {steps.map(([number, title, detail], index) => (
          <li key={number}>
            <span className="flywheel-mobile-number">{number}</span>
            <div>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
            {index < steps.length - 1 ? (
              <span className="flywheel-mobile-arrow" aria-hidden="true">↓</span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="flywheel-mobile-loop" aria-hidden="true">↺ 回到咨询接入</p>
    </>
  );
}
