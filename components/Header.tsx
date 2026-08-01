"use client";

import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={close} aria-label="陈嘉伟作品集首页">
        <span className="brand-signature" aria-hidden="true">
          Jael
          <svg viewBox="0 0 84 12" focusable="false">
            <path d="M2 8.5C19 3.5 35 3 51 6.4C62 8.8 72 8.6 82 4.2" />
          </svg>
        </span>
        <span className="brand-copy">
          <strong>陈嘉伟</strong>
          <small>AI / Agent Product</small>
        </span>
      </a>

      <a
        className="header-mobile-resume"
        href="/resume"
        onClick={close}
        aria-label="选择中文或英文简历"
      >
        简历 CN / EN <span aria-hidden="true">→</span>
      </a>

      <button
        className="menu-button"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "关闭导航" : "打开导航"}
      >
        <span />
        <span />
      </button>

      <nav className={open ? "nav nav-open" : "nav"} aria-label="主导航">
        <a href="/#featured" onClick={close}>旗舰案例</a>
        <a href="/#system" onClick={close}>产品架构</a>
        <a href="/#method" onClick={close}>产品方法</a>
        <a href="/#portfolio-guide" onClick={close}>AI 导览</a>
        <a href="/#projects" onClick={close}>案例库</a>
        <a href="/#experience" onClick={close}>经历</a>
        <a
          className="nav-resume"
          href="/resume"
          onClick={close}
          aria-label="选择中文或英文简历"
        >
          中 / EN 简历 <span aria-hidden="true">→</span>
        </a>
      </nav>
    </header>
  );
}
