import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { InterviewMode } from "@/components/InterviewMode";

export const metadata: Metadata = {
  title: "面试模式｜AI BUSINESS OS",
  description: "用三分钟理解陈嘉伟的 AI BUSINESS OS、三个旗舰案例、证据边界和演示顺序。",
};

export default function InterviewPage() {
  return (
    <>
      <Header />
      <InterviewMode />
    </>
  );
}
