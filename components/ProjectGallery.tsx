"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  images: string[];
  mode?: "desktop" | "mobile" | "mixed";
};

export function ProjectGallery({ title, images, mode = "desktop" }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);

  const previous = () => setActive((current) => current === null ? null : (current - 1 + images.length) % images.length);
  const next = () => setActive((current) => current === null ? null : (current + 1) % images.length);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, images.length]);

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 45) delta > 0 ? previous() : next();
    touchStart.current = null;
  };

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
              sizes={index === 0 ? "(max-width: 800px) 100vw, 1000px" : "(max-width: 800px) 78vw, 520px"}
              priority={index === 0}
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} 大图预览`}
          onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
          onTouchEnd={onTouchEnd}
        >
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="关闭预览">×</button>
          <button className="lightbox-nav lightbox-prev" onClick={previous} aria-label="上一张">←</button>
          <div className="lightbox-image">
            <Image src={images[active]} alt={`${title} 产品截图 ${active + 1}`} fill sizes="96vw" />
          </div>
          <button className="lightbox-nav lightbox-next" onClick={next} aria-label="下一张">→</button>
          <div className="lightbox-count">{active + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
}
