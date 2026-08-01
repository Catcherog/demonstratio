import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "中英文简历",
  description: "陈嘉伟 AI / Agent 产品经理中文与英文简历下载。",
  alternates: { canonical: "/resume" },
};

const resumes = [
  {
    eyebrow: "中文简历 · CHINESE",
    title: "AI / Agent 产品经理｜中文两页简历",
    description: "适合国内招聘平台、HR 初筛与中文面试场景。",
    href: "/resume/chen-jiawei-ai-agent-cn-two-page.pdf",
    fileName: "chen-jiawei-ai-agent-cn-two-page.pdf",
    openLabel: "在线查看中文简历",
    downloadLabel: "下载中文 PDF",
  },
  {
    eyebrow: "ENGLISH RESUME",
    title: "AI / Agent Product Manager｜English Resume",
    description: "For international, overseas and English-language opportunities.",
    href: "/resume/jiawei-chen-ai-agent-en.pdf",
    fileName: "jiawei-chen-ai-agent-en.pdf",
    openLabel: "Open English Resume",
    downloadLabel: "Download English PDF",
  },
] as const;

export default function ResumePage() {
  return (
    <main className="resume-page" id="top">
      <Header />
      <section className="section-shell resume-hero" aria-labelledby="resume-title">
        <a className="resume-back" href="/">← 返回作品集</a>
        <p className="eyebrow">RESUME / 简历</p>
        <h1 id="resume-title">选择中文或英文简历。</h1>
        <p className="resume-intro">两个版本均可在线查看或直接下载，避免通用“查看简历”入口只打开中文版本。</p>

        <div className="resume-grid">
          {resumes.map((resume, index) => (
            <article className="resume-card" key={resume.href}>
              <div className="resume-card-head">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{resume.eyebrow}</p>
              </div>
              <h2>{resume.title}</h2>
              <p>{resume.description}</p>
              <div className="resume-card-actions">
                <a className="button button-primary" href={resume.href} target="_blank" rel="noreferrer">
                  {resume.openLabel} <span aria-hidden="true">↗</span>
                </a>
                <a className="button button-secondary" href={resume.href} download={resume.fileName}>
                  {resume.downloadLabel} <span aria-hidden="true">↓</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="resume-contact">
          <span>招聘与合作联系</span>
          <a href="mailto:Jael_Chen@foxmail.com">Jael_Chen@foxmail.com</a>
        </div>
      </section>
    </main>
  );
}
