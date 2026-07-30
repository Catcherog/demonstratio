"use client";

import { useState } from "react";
import type { PortfolioEvidence } from "@/content/portfolio-evidence";

function MediaFallback({ item }: { item: PortfolioEvidence }) {
  return (
    <div className="evidence-media-fallback" role="status">
      <strong>{item.title}</strong>
      <p>{item.summary}</p>
      <small>{item.boundary}</small>
      {item.state === "available" && item.fallbackHref && (
        <a href={item.fallbackHref} target="_blank" rel="noreferrer">打开已验证备用入口</a>
      )}
    </div>
  );
}

export function EvidenceMedia({ item }: { item: PortfolioEvidence }) {
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  if (item.state !== "available") return null;
  if (failed) return <MediaFallback item={item} />;

  if ((item.kind === "image" || item.kind === "architecture") && item.assetUrl) {
    const alt = item.kind === "architecture" ? `${item.title}，解释性架构图` : `${item.title}，公开产品界面`;
    return (
      <div className="evidence-image-shell">
        <button type="button" className="evidence-image-button" onClick={() => setZoomed(true)} aria-label={`放大查看：${item.title}`}>
          <img src={item.assetUrl} alt={alt} onError={() => setFailed(true)} />
        </button>
        {zoomed && (
          <div className="evidence-zoom" role="dialog" aria-modal="true" aria-label={`${item.title} 放大图`}>
            <button type="button" onClick={() => setZoomed(false)} aria-label="关闭放大图">关闭</button>
            <img src={item.assetUrl} alt={alt} onError={() => setFailed(true)} />
          </div>
        )}
      </div>
    );
  }

  if (item.kind === "video" && item.assetUrl) {
    return (
      <div className="evidence-video-shell">
        <video
          src={item.assetUrl}
          controls
          preload="metadata"
          poster={item.thumbnailUrl}
          onError={() => setFailed(true)}
        >
          <p>{item.transcript ?? item.summary}</p>
        </video>
        {item.durationSeconds !== undefined && <small>时长：{item.durationSeconds} 秒</small>}
        {item.chapters && item.chapters.length > 0 && (
          <ol className="evidence-chapters">
            {item.chapters.map((chapter) => <li key={`${chapter.label}-${chapter.seconds}`}>{chapter.label} · {chapter.seconds}s</li>)}
          </ol>
        )}
        <details>
          <summary>文字摘要</summary>
          <p>{item.transcript ?? item.summary}</p>
        </details>
      </div>
    );
  }

  if (item.kind === "interactive" && item.href) {
    return (
      <div className="evidence-interactive-entry">
        <a href={item.href} target="_blank" rel="noreferrer">打开体验 <span aria-hidden="true">↗</span></a>
        <p>{item.boundary}</p>
      </div>
    );
  }

  return null;
}
