"use client";

import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={close} aria-label="返回顶部">
        <span className="brand-mark">CJ</span>
        <span className="brand-text">AI Product Portfolio</span>
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="打开导航">
        <span /> <span />
      </button>
      <nav className={open ? "nav nav-open" : "nav"} aria-label="主导航">
        <a href="#work" onClick={close}>项目矩阵</a>
        <a href="#method" onClick={close}>方法论</a>
        <a href="#about" onClick={close}>关于</a>
        <a className="nav-contact" href="#contact" onClick={close}>联系我</a>
      </nav>
    </header>
  );
}
