import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jaelchen.com"),
  title: {
    default: "陈嘉伟｜AI / Agent 产品经理作品集",
    template: "%s｜陈嘉伟 AI 产品作品集",
  },
  description: "AI 应用与 Agent 产品经理作品集：数据中台、RAG、客服 Agent、多模态产品、微信产品与 QLoRA 模型微调。",
  keywords: ["AI 产品经理", "Agent 产品经理", "RAG", "AI 应用", "数据产品", "多模态", "QLoRA", "陈嘉伟"],
  authors: [{ name: "陈嘉伟", url: "https://www.jaelchen.com" }],
  creator: "陈嘉伟",
  alternates: { canonical: "/" },
  openGraph: {
    title: "陈嘉伟｜AI / Agent 产品经理作品集",
    description: "把复杂业务做成可上线、可评估、可持续迭代的 AI 产品。",
    url: "https://www.jaelchen.com",
    siteName: "Jael Chen AI Product Portfolio",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "陈嘉伟 AI / Agent 产品经理作品集" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "陈嘉伟｜AI / Agent 产品经理作品集",
    description: "9 个真实 AI 产品与工程案例：Agent、RAG、数据、多模态与模型微调。",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
