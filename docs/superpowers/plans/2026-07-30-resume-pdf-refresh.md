# Website Resume PDF Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the website Chinese resume PDF and generate a matching verified two-page English PDF for user review before publication.

**Architecture:** Treat the supplied Chinese PDF as the Chinese delivery artifact. Reuse the existing two-page HTML/CSS resume as the English layout template, generate the English PDF with the existing Playwright renderer, and validate both PDFs with a small source/asset contract.

**Tech Stack:** HTML/CSS, Python 3, pypdf, pypdfium2, Playwright, Microsoft Edge, Node test runner.

## Global Constraints

- Preserve the supplied Chinese PDF without redesigning it.
- Preserve the black minimalist two-page A4 layout for English.
- Translate quantities exactly and do not infer accuracy or readiness claims.
- Keep existing website links and filenames unchanged.
- Present previews before commit, push, or deployment.

---

### Task 1: Lock resume asset and content requirements

**Files:**
- Create: `tests/resume-pdf-refresh.test.mjs`
- Test: `tests/resume-pdf-refresh.test.mjs`

**Interfaces:**
- Consumes: `public/resume/chen-jiawei-ai-agent-cn-two-page.pdf`, `public/resume/jiawei-chen-ai-agent-en.pdf`, and the English HTML source.
- Produces: a source-level contract for two-page output, approved links, and required quantitative claims.

- [ ] **Step 1: Write the failing contract**

Require the English source to include `282 SKUs`, `80+ concurrent projects`, `589 Python + 55 Web regression tests`, `10 production V2 Base tables / 216 fields`, `32 targeted / 195 client / 527 server regressions`, and `2/2 real model calls returned HTTP 200`; reject unsupported accuracy percentages.

- [ ] **Step 2: Run the contract and observe failure**

Run: `node --test tests/resume-pdf-refresh.test.mjs`

Expected: FAIL because the English source and refreshed assets do not yet exist.

### Task 2: Generate and review the two PDFs

**Files:**
- Create: `scripts/resume/resume-two-page-en.html`
- Modify: `public/resume/chen-jiawei-ai-agent-cn-two-page.pdf`
- Modify: `public/resume/jiawei-chen-ai-agent-en.pdf`
- Test: `tests/resume-pdf-refresh.test.mjs`

**Interfaces:**
- Consumes: the supplied Chinese PDF and the existing two-page HTML/CSS layout.
- Produces: stable website PDF filenames and four rendered preview pages.

- [ ] **Step 1: Replace the Chinese PDF asset**

Copy `C:\Users\Catcher\Desktop\陈嘉伟｜AI _ Agent 产品经理.pdf` to `public/resume/chen-jiawei-ai-agent-cn-two-page.pdf` and verify the SHA-256 hashes match.

- [ ] **Step 2: Build the English source**

Reuse the existing page CSS and translate each supplied section into concise English while preserving dates, ordering, project boundaries, and exact quantities.

- [ ] **Step 3: Render the English PDF**

Run `scripts/resume/render_html_resume.mjs` against the English HTML and write `public/resume/jiawei-chen-ai-agent-en.pdf`. Require exactly two A4 pages and zero page overflow.

- [ ] **Step 4: Verify and render previews**

Run the source contract, inspect both PDFs with `pypdf`, render all four pages with `pypdfium2`, and visually check every page for clipping, overlap, broken glyphs, and bad page breaks.

- [ ] **Step 5: Ask for publication approval**

Show the four preview pages to the user. Do not commit or push the resume artifacts until the user approves them.

