"use client";

import { Header } from "@/components/Header";
import "./demo.css";
import { useMemo, useState } from "react";

const fakeOcr = `客户：泽怀影像
项目类型：客片
拍摄日期：2026-08-04
拍摄地点：上海
联系人：陈女士
电话：138****2586
备注：补拍一组夜景客片，需二次修片`;

const fakeCandidate = {
  intakeType: "客片",
  customerName: "陈女士",
  projectName: "夜景客片补拍",
  shootDate: "2026-08-04",
  location: "上海",
  phone: "138****2586",
  status: "NEEDS_REVIEW",
};

export default function FeishuIntakeDemoPage() {
  const [uploaded, setUploaded] = useState(false);

  const candidateRows = useMemo(
    () => Object.entries(fakeCandidate).map(([key, value]) => ({ key, value })),
    [],
  );

  return (
    <main className="feishu-demo-page">
      <Header />
      <div className="feishu-demo-shell">
        <header className="feishu-demo-header">
          <div>
            <p className="eyebrow">FEISHU INTAKE DEMO · MOCK FLOW</p>
            <h1>飞书智能录入台 Mock 演示</h1>
            <p>
              用 mock 演示 “截图 / 文本 / 表单 → OCR → Candidate → SOP Gate → 写入前人工确认”
              的完整产品流程。该页面不连接正式业务 Base，不执行真实写入。
            </p>
          </div>
          <div className="feishu-demo-status">
            <span>演示模式</span>
            <strong>Mock only</strong>
            <small>不连接正式业务数据</small>
          </div>
        </header>

        <section className="feishu-demo-banner">
          <strong>真实 API 模式</strong>
          <span>当前站内仅提供 mock 演示；正式业务写入保持关闭。</span>
          <button type="button">受控写入环境</button>
        </section>

        <section className="feishu-demo-grid">
          <article className="feishu-panel">
            <div className="feishu-panel-head">
              <strong>01 · 上传截图</strong>
              <span>Upload / mock</span>
            </div>

            <button
              type="button"
              className="feishu-upload-box"
              onClick={() => setUploaded(true)}
            >
              <span className="feishu-upload-icon">⇪</span>
              <strong>点击模拟上传聊天截图</strong>
              <small>支持 JPEG / PNG，演示将注入 mock OCR 结果</small>
            </button>

            <div className="feishu-upload-note">
              {uploaded ? "已注入 1 份 mock 截图样本" : "尚未上传样本"}
            </div>
          </article>

          <article className="feishu-panel">
            <div className="feishu-panel-head">
              <strong>02 · OCR 与候选数据</strong>
              <span>OCR / candidate</span>
            </div>

            <div className="feishu-result-surface">
              {!uploaded ? (
                <div className="feishu-placeholder">
                  <strong>上传截图后开始智能录入流程</strong>
                  <small>支持 JPEG / PNG，最多 10 张</small>
                </div>
              ) : (
                <div className="feishu-result-grid">
                  <section className="feishu-result-column">
                    <h3>OCR 结果</h3>
                    <pre>{fakeOcr}</pre>
                  </section>

                  <section className="feishu-result-column">
                    <h3>Candidate</h3>
                    <div className="feishu-candidate-table">
                      {candidateRows.map((row) => (
                        <div className="feishu-candidate-row" key={row.key}>
                          <span>{row.key}</span>
                          <strong>{row.value}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="feishu-gate">
                      <span>SOP Gate</span>
                      <strong>NEEDS_REVIEW</strong>
                      <small>低风险可用，但需要人工确认后才能进入写入阶段。</small>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
