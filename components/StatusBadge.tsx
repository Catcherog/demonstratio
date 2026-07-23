type Props = {
  verified: string[];
  inProgress: string[];
  planned: string[];
};

export function StatusBadge({ verified, inProgress, planned }: Props) {
  return (
    <div className="status-badge-container">
      {verified.length > 0 && (
        <div className="status-group status-verified">
          <h3>Current Version · 已验证</h3>
          <ul>
            {verified.map((item) => <li key={item}><span className="status-dot" />{item}</li>)}
          </ul>
        </div>
      )}
      {inProgress.length > 0 && (
        <div className="status-group status-in-progress">
          <h3>In Closure · 收尾中</h3>
          <ul>
            {inProgress.map((item) => <li key={item}><span className="status-dot" />{item}</li>)}
          </ul>
        </div>
      )}
      {planned.length > 0 && (
        <div className="status-group status-planned">
          <h3>Next Iteration · 后续计划</h3>
          <ul>
            {planned.map((item) => <li key={item}><span className="status-dot" />{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
