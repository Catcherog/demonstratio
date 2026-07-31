import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "中英文简历",
  description: "陈嘉伟 AI / Agent 产品经理中文与英文简历下载页。",
  alternates: { canonical: "/resume" },
};

const resumes = [
  {
    locale: "ZH-CN",
    title: "中文两页简历",
    description: "适合国内招聘平台、HR 初筛与中文面试。突出 AI 产品、Agent、数据平台与端到端交付经历。",
    file: "/resume/chen-jiawei-ai-agent-cn-two-page.pdf",
    openLabel: "在线查看中文简历",
    downloadLabel: "下载 PDF",
  },
  {
    locale: "EN",
    title: "English Resume",
    description: "For international roles and English-language interviews, covering AI product strategy, agent systems and end-to-end delivery.",
    file: "/resume/jiawei-chen-ai-agent-en.pdf",
    openLabel: "Open English Resume",
    downloadLabel: "Download PDF",
  },
];

export default function ResumePage() {
  return (
    <main className="resume-page">
      <Header />
      <section className="resume-hero section-shell" aria-labelledby="resume-title">
        <div className="resume-hero-copy">
          <p className="eyebrow">RESUME / CV</p>
          <h1 id="resume-title">选择适合招聘场景的简历版本。</h1>
          <p>中文与英文版本均为独立 PDF。可先在线查看，也可直接下载后转发给招聘方。</p>
          <a className="resume-back-link" href="/">← 返回作品集首页</a>
        </div>

        <div className="resume-grid">
          {resumes.map((resume, index) => (
            <article className="resume-card" key={resume.locale}>
              <div className="resume-card-head">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{resume.locale}</strong>
              </div>
              <h2>{resume.title}</h2>
              <p>{resume.description}</p>
              <div className="resume-actions">
                <a className="button button-primary" href={resume.file} target="_blank" rel="noreferrer">
                  {resume.openLabel} <span aria-hidden="true">↗</span>
                </a>
                <a className="button resume-download" href={resume.file} download>
                  {resume.downloadLabel} <span aria-hidden="true">↓</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
