"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  title: string;
  images: string[];
  mode?: "desktop" | "mobile" | "mixed";
};

export function ProjectGallery({ title, images, mode = "desktop" }: Props) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((active + 1) % images.length);
      if (event.key === "ArrowLeft") setActive((active - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, images.length]);

  return (
    <>
      <div className={`gallery gallery-${mode}`} aria-label={`${title} 产品截图`}>
        {images.map((src, index) => (
          <button
            className={index === 0 ? "gallery-item gallery-featured" : "gallery-item"}
            key={src}
            onClick={() => setActive(index)}
            aria-label={`查看 ${title} 第 ${index + 1} 张截图`}
          >
            <Image
              src={src}
              alt={`${title} 产品截图 ${index + 1}`}
              fill
              sizes={index === 0 ? "(max-width: 800px) 100vw, 900px" : "(max-width: 800px) 75vw, 420px"}
              priority={index === 0}
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} 大图预览`}>
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="关闭预览">×</button>
          <button className="lightbox-nav lightbox-prev" onClick={() => setActive((active - 1 + images.length) % images.length)} aria-label="上一张">←</button>
          <div className="lightbox-image">
            <Image src={images[active]} alt={`${title} 产品截图 ${active + 1}`} fill sizes="96vw" />
          </div>
          <button className="lightbox-nav lightbox-next" onClick={() => setActive((active + 1) % images.length)} aria-label="下一张">→</button>
          <div className="lightbox-count">{active + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
}
