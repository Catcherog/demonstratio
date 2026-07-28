"use client";

import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="/#top" onClick={close} aria-label="陈嘉伟作品集首页">
        <span className="brand-mark">CJ</span>
        <span className="brand-copy"><strong>陈嘉伟</strong><small>AI / Agent Product</small></span>
      </a>
      <button className="menu-button" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "关闭导航" : "打开导航"}>
        <span /><span />
      </button>
      <nav className={open ? "nav nav-open" : "nav"} aria-label="主导航">
        <a href="/#featured" onClick={close}>旗舰案例</a>
        <a href="/#system" onClick={close}>产品架构</a>
        <a href="/#method" onClick={close}>产品方法</a>
        <a href="/#portfolio-guide" onClick={close}>导览 Agent</a>
        <a href="/#projects" onClick={close}>案例库</a>
        <a href="/#experience" onClick={close}>经历</a>
        <a className="nav-resume" href="/resume/chen-jiawei-ai-agent-cn-two-page.pdf" target="_blank" rel="noreferrer">查看简历 <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}
