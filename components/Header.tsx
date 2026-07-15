"use client";

import { useState } from "react";

const Arrow = () => <span aria-hidden="true">↗</span>;

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="/#top" onClick={close} aria-label="返回首页顶部">
        <span className="brand-mark">CJ</span>
        <span className="brand-copy">
          <strong>陈嘉伟</strong>
          <small>AI / Agent Product</small>
        </span>
      </a>
      <button
        className="menu-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "关闭导航" : "打开导航"}
      >
        <span /> <span />
      </button>
      <nav className={open ? "nav nav-open" : "nav"} aria-label="主导航">
        <a href="/#featured" onClick={close}>重点案例</a>
        <a href="/#system" onClick={close}>产品架构</a>
        <a href="/#projects" onClick={close}>全部项目</a>
        <a href="/#experience" onClick={close}>经历</a>
        <a className="nav-resume" href="/resume/chen-jiawei-ai-agent-cn-one-page.pdf" target="_blank" rel="noreferrer">
          下载简历 <Arrow />
        </a>
      </nav>
    </header>
  );
}
