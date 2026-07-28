#!/usr/bin/env python3
"""Local DOCX-compatible PDF exporter used only when LibreOffice is absent.

The canonical DOCX remains the editable source. This exporter mirrors the
two-page resume geometry from its authoritative text, so the documents skill's
render_docx.py can still produce final PNG QA in a Windows session that has no
headless LibreOffice or accessible Word COM session.
"""
from __future__ import annotations

import argparse
import os
from pathlib import Path

from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

W, H = A4
M = 38
FONT_FILE = Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts" / "msyh.ttc"
FONT = "MSYH"
BOLD = "MSYH"


def register_fonts() -> None:
    if FONT not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(FONT, str(FONT_FILE), subfontIndex=0))


def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    lines, current = [], ""
    for char in text:
        candidate = current + char
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = char
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


class ResumeCanvas:
    def __init__(self, output: Path):
        self.c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
        self.c.setTitle("陈嘉伟｜AI / Agent 产品经理")
        self.c.setAuthor("陈嘉伟")
        self.y = H - M

    def text(self, text: str, x: float, y: float, size=9, bold=False, color=black):
        self.c.setFillColor(color)
        self.c.setFont(BOLD if bold else FONT, size)
        self.c.drawString(x, y, text)

    def paragraph(self, text: str, x: float, width: float, size=8.8, leading=12.2, bold_prefix=""):
        for line in wrap(text, FONT, size, width):
            if bold_prefix and line.startswith(bold_prefix):
                self.text(bold_prefix, x, self.y, size, True)
                self.text(line[len(bold_prefix):], x + pdfmetrics.stringWidth(bold_prefix, BOLD, size), self.y, size)
            else:
                self.text(line, x, self.y, size)
            self.y -= leading

    def heading(self, number: str, title: str, english: str):
        self.y -= 4
        self.text(f"{number}  {title}", M, self.y, 11, True)
        self.text(english.upper(), M + 125, self.y + 1.5, 6.5, False, HexColor("#666666"))
        self.y -= 5
        self.c.setStrokeColor(black); self.c.setLineWidth(1.15)
        self.c.line(M, self.y, W - M, self.y)
        self.y -= 12

    def bullet(self, label: str, body: str):
        label_w = pdfmetrics.stringWidth(label, BOLD, 8.55)
        parts = wrap(label + body, FONT, 8.55, W - 2 * M - 6)
        # Keep the label bold on the first visual line, then align continuations.
        self.text("•", M, self.y, 8.55)
        first = parts[0]
        if first.startswith(label):
            self.text(label, M + 9, self.y, 8.55, True)
            self.text(first[len(label):], M + 9 + label_w, self.y, 8.55)
        else:
            self.text(first, M + 9, self.y, 8.55)
        self.y -= 11.3
        for line in parts[1:]:
            self.text(line, M + 9, self.y, 8.55)
            self.y -= 11.3
        self.y -= 1.3

    def project(self, name: str, subtitle: str, bullets: list[tuple[str, str]]):
        self.text(name, M, self.y, 9.9, True)
        self.text("|  " + subtitle, M + pdfmetrics.stringWidth(name, BOLD, 9.9) + 8, self.y + 1, 8.25, False, HexColor("#666666"))
        self.y -= 13
        for label, body in bullets:
            self.bullet(label, body)

    def footer(self, page: str):
        self.c.saveState()
        self.c.setStrokeColor(HexColor("#BBBBBB")); self.c.setLineWidth(.45)
        self.c.line(M, 30, W - M, 30)
        label = f"陈嘉伟  |  AI / Agent 产品经理  |  {page}"
        self.c.setFillColor(HexColor("#666666"))
        self.c.setFont(FONT, 7)
        self.c.drawCentredString(W / 2, 18, label)
        self.c.restoreState()


def render(output: Path) -> None:
    register_fonts()
    r = ResumeCanvas(output)
    c = r.c
    # Page 1 header.
    r.text("陈嘉伟", M, r.y, 23, True); r.y -= 18
    r.text("AI / Agent 产品经理", M, r.y, 10.8, True); r.y -= 14
    r.text("杭州  |  18874988048  |  Jael_Chen@foxmail.com  |  作品集  |  GitHub: Catcherog", M, r.y, 8.55)
    c.linkURL("https://jaelchen-portfolio-vercel-extracted.vercel.app", (M + 280, r.y - 2, M + 350, r.y + 10), relative=0)
    c.linkURL("https://github.com/Catcherog", (M + 415, r.y - 2, W - M, r.y + 10), relative=0)
    photo = Path(__file__).resolve().parents[2] / "public" / "resume" / "resume-portrait.png"
    if photo.exists():
        c.drawImage(str(photo), W - M - 48, H - M - 57, 48, 57, preserveAspectRatio=True, mask='auto')
    r.y -= 5; c.setLineWidth(1.4); c.line(M, r.y, W - M - 66, r.y); r.y -= 13
    r.heading("01", "专业摘要", "Profile")
    c.setFillColor(HexColor("#F2F2F2")); c.rect(M, r.y - 43, W - 2 * M, 43, fill=1, stroke=0)
    r.y -= 10
    r.paragraph("具备复杂项目交付与 AI 产品实践经验，擅长把真实业务流程拆解为可验证的产品链路，覆盖数据治理、Agent 编排、多模态工具与人机协作边界。能够推进需求定义、原型验证、开发协同和迭代复盘，并明确区分验证、试点与生产状态。", M + 10, W - 2 * M - 20, 8.75, 12)
    r.y -= 8
    r.heading("02", "工作经历", "Experience")
    r.text("泽怀摄影工作室", M, r.y, 9.8, True); r.text("|  创始人兼 AI 产品负责人  |  2026.02 - 至今", M + 79, r.y + 1, 8.3, False, HexColor("#666666")); r.y -= 13
    r.bullet("产品规划：", "面向摄影业务规划客户触点、数据中台、智能服务与图像工具的产品协同路径；负责业务问题拆解、产品定义、原型验证与迭代推进。")
    r.bullet("主案例协同：", "围绕飞书 AI 业务数据平台、Service Agent 与光砚 Lumen，完成数据治理、Agent 工作流与图像产品化的产品规划及最小可用原型开发协同。")
    r.y -= 3
    r.text("深圳市联洲国际技术有限公司（TP-Link）", M, r.y, 9.8, True); r.text("|  商用项目经理  |  2024.07 - 2026.02", M + 164, r.y + 1, 8.3, False, HexColor("#666666")); r.y -= 13
    r.bullet("多产品线交付：", "负责 282 个 SKU 全生命周期，峰值并行推进 80+ 项目，覆盖交换机、PoE 供电、光模块 / OLT、Omada Controller 与多国特制软件五条产品线。")
    r.bullet("跨国需求定义：", "主导海外客户 NFC 功能需求定义，识别 Logo 合规与用户认知风险，提出“蓝牙 + NFC”融合交互方案并推动采纳。")
    r.bullet("风险决策：", "在供应商更换和春节供应链中断风险下，建立并行验证与例外决策机制，追回 2 周工期，推动五款产品提前 15 天完成量产。")
    r.y -= 5
    r.text("代表项目", M, r.y, 16.5, True); r.text("PROJECT HIGHLIGHTS", M + 86, r.y + 2, 6.8, False, HexColor("#666666")); r.y -= 18
    r.heading("03", "飞书 AI 业务数据平台", "Data Governance")
    r.project("飞书 AI 业务数据平台", "数据治理与自动化", [("目标：", "将聊天记录、截图、表单与人工录入转化为可治理的业务数据。"), ("设计：", "设计 Candidate V1 合同、SOP BR-01~06 治理规则与审计链路。"), ("历史基线：", "17 张表 / 12 条自动化仅为测试 Base 历史验收基线，不是 V2 自动化已上线证据。"), ("验证边界：", "真实 Tesseract OCR、三层幂等与真实测试 Base E2E 已验证；正式业务 Base 与生产上线未开放。")])
    r.footer("01 / 02")
    c.showPage()

    r.y = H - M
    r.text("代表项目 · 续", M, r.y, 18, True); r.text("PROJECT HIGHLIGHTS", M + 124, r.y + 2, 7, False, HexColor("#666666")); r.y -= 19
    r.heading("04", "Service Agent", "RAG Service")
    r.project("Service Agent", "RAG 客服与知识飞轮", [("目标：", "使用 LangGraph 8 节点 11 边工作流编排检索、风险分流、生成、质量检查与人工接管，完成 Web/API 端到端 MVP。"), ("验证：", "589 tests 全量回归（2026-07-28，非准确率）；固定 90 样本保留为静态 runner 审计输入。"), ("评测边界：", "现有 runner 未验证 expected_route、实际澄清节点或生成输出，因此不发布路由准确率、回答正确率或禁止承诺结果。"), ("公网状态：", "Controlled Demo｜公网前端可访问，后端恢复中；未接通时安全转人工。")])
    r.heading("05", "光砚 Lumen", "Multimodal Workspace")
    r.project("光砚 Lumen", "AI 图像编辑工作台", [("产品：", "将多模型图像生成与编辑能力组织为含任务状态、版本与失败恢复的工作台，覆盖图片生成、编辑与多格式导出。"), ("工程协作：", "Provider 抽象，以及项目 / 任务 / 结果持久化与恢复。"), ("本地验证：", "_id 更新缺陷已修复；本地 client/server 回归与 build 通过。"), ("状态与边界：", "Controlled Demo｜后端健康已通过，真实核心编辑待有效凭据实测；采用 BYO Key 使用边界。")])
    r.heading("06", "教育背景与能力", "Education & Skills")
    r.text("中南大学", M, r.y, 9.4, True); r.text("|  材料物理  |  本科  |  2020.09 - 2024.06", M + 50, r.y + 1, 8.4, False, HexColor("#666666")); r.y -= 13
    r.text("CET-6；基础 SQL；大学生创新创业项目省级奖项。", M, r.y, 8.55); r.y -= 17
    boxes = [("AI 产品", "Agent / RAG / 知识库 / 评估与人工兜底"), ("产品交付", "需求分析 / PRD / 原型 / 跨团队推进"), ("技术基础", "Python / TypeScript / SQL / API"), ("工具与方法", "LangGraph、飞书多维表、CloudBase、React / Expo、Prompt 与上下文设计")]
    for idx, (label, body) in enumerate(boxes):
        col, row = idx % 2, idx // 2
        x = M + col * 260; y = r.y - row * 41
        c.setFillColor(HexColor("#F2F2F2")); c.rect(x, y - 34, 248, 34, fill=1, stroke=0)
        r.text(label, x + 7, y - 10, 8.1, True)
        r.text(body, x + 7, y - 23, 7.4)
    r.footer("02 / 02")
    c.showPage()
    c.save()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input_docx", type=Path)
    parser.add_argument("--outdir", type=Path, required=True)
    args = parser.parse_args()
    args.outdir.mkdir(parents=True, exist_ok=True)
    render(args.outdir / (args.input_docx.stem + ".pdf"))
