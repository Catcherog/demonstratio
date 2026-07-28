import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <main id="top" className="case-page">
      <Header />
      <section className="case-hero section-shell">
        <p className="eyebrow">404 · NOT FOUND</p>
        <h1>这个页面不在作品集里。</h1>
        <p className="case-summary">你可以回到首页查看三个主案例，或从完整项目库继续浏览。</p>
        <div className="hero-actions">
          <a className="button button-primary" href="/#featured">查看主案例 <span>↓</span></a>
          <a className="button button-ghost" href="/#projects">完整项目库 <span>↗</span></a>
        </div>
      </section>
    </main>
  );
}
