import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jaelchen.com"),
  title: "陈嘉伟｜AI / Agent 产品经理作品集",
  description: "AI Native 产品架构、Agent 产品设计、RAG 知识库、数据中台与多模态产品案例。",
  keywords: ["AI 产品经理", "Agent 产品", "RAG", "数据中台", "产品作品集", "陈嘉伟"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "陈嘉伟｜AI / Agent 产品经理作品集",
    description: "从业务痛点出发，把复杂工作流重构为可落地、可体验、可规模化的 AI 产品。",
    url: "https://www.jaelchen.com",
    siteName: "陈嘉伟 AI Product Portfolio",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "陈嘉伟 AI / Agent 产品经理作品集" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "陈嘉伟｜AI / Agent 产品经理作品集",
    description: "AI Native、Agent、RAG、数据中台与多模态产品案例。",
    images: ["/og.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
