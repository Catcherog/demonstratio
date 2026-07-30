#!/usr/bin/env python3
"""Build the English two-page resume from the approved Chinese HTML layout."""

from __future__ import annotations

import argparse
from pathlib import Path


STYLE_OVERRIDE = """
  <style>
    html[lang="en"] body { font-family: Arial, "Helvetica Neue", sans-serif; }
    html[lang="en"] .identity-line h1 { letter-spacing: -.045em; }
    html[lang="en"] .role,
    html[lang="en"] .credential-line,
    html[lang="en"] .section-title,
    html[lang="en"] .experience-name,
    html[lang="en"] .project-name,
    html[lang="en"] .skill-card b { font-family: Arial, "Helvetica Neue", sans-serif; }
    html[lang="en"] .section-title { letter-spacing: .01em; }
    html[lang="en"] .summary { font-size: 8.7pt; line-height: 1.52; }
    html[lang="en"] .page:nth-of-type(1) .bullets li { font-size: 8.1pt; line-height: 1.47; }
    html[lang="en"] .page:nth-of-type(2) { padding-top: 12mm; padding-bottom: 10.5mm; }
    html[lang="en"] .page:nth-of-type(2) .section-head { margin-bottom: 2.2mm; }
    html[lang="en"] .page:nth-of-type(2) .project-context {
      margin-bottom: 2.8mm;
      padding-top: 2.2mm;
      padding-bottom: 2.2mm;
    }
    html[lang="en"] .page:nth-of-type(2) .project-intro { margin-bottom: 1.45mm; }
    html[lang="en"] .page:nth-of-type(2) .project.section.compact { margin-top: 3mm; }
    html[lang="en"] .page:nth-of-type(2) .evidence-list li { padding: 1.4mm 0 1.3mm; }
    html[lang="en"] .page:nth-of-type(2) .evidence-list span { font-size: 7.75pt; line-height: 1.4; }
    html[lang="en"] .page:nth-of-type(2) .skills-grid { gap: 1.8mm; }
    html[lang="en"] .page:nth-of-type(2) .skill-card { padding: 2mm 2.5mm 2.1mm; }
    html[lang="en"] .page:nth-of-type(2) .skill-card p { font-size: 7.15pt; line-height: 1.38; }
  </style>
"""


BODY = r"""
<body>
  <header class="preview-bar" aria-label="Preview toolbar">
    <div>
      <div class="preview-kicker">Resume Preview · English Edition</div>
      <div class="preview-note">AI / Agent Product Manager · Two-page A4 resume</div>
    </div>
    <button class="print-button" type="button" onclick="window.print()">Print / Save PDF</button>
  </header>

  <main class="resume-stage">
    <article class="page" data-page="01 / 02" aria-label="Resume page one">
      <header class="masthead">
        <div>
          <div class="identity-line">
            <h1>Jiawei Chen</h1>
            <div class="role">AI / Agent Product Manager</div>
          </div>
          <div class="credential-line">Central South University (Project 985) · B.S. in Materials Physics · CET-6</div>
          <div class="contact-line">
            <span>Born 2002 · Hangzhou, China</span>
            <span>+86 188 7498 8048</span>
            <span>Jael_Chen@foxmail.com</span>
            <span><a href="https://github.com/Catcherog">github.com/Catcherog</a></span>
          </div>
          <a class="portfolio-link" href="https://www.jaelchen.com"><small>Product Portfolio</small>www.jaelchen.com</a>
        </div>
        <img class="portrait" src="../../public/resume/resume-portrait.png" alt="Portrait of Jiawei Chen">
      </header>

      <section class="section" aria-labelledby="summary-title">
        <div class="section-head">
          <span class="section-number">01</span>
          <h2 class="section-title" id="summary-title">Professional Profile</h2>
          <span class="section-rule"></span>
        </div>
        <p class="summary">
          Product manager combining <strong>complex delivery at a major technology company, hands-on business operations, and 0-to-1 AI product practice</strong>. Managed multiple hardware and software product lines at TP-Link; now independently leads, with AI-assisted implementation, a Feishu AI business data platform, Service Agent, and Lumen for a photography business. Translates business problems into product roadmaps, data models, and Agent workflows, and drives prototyping, API integration, evaluation, and delivery.
        </p>
        <div class="education-strip" aria-label="Education">
          <div>
            <b>Central South University · Materials Physics</b>
            <time>Sep 2020 — Jun 2024</time>
          </div>
          <div class="education-proof">
            <strong>STEM training · CET-6 · Provincial innovation project</strong>
            <span>Provincial award in a university innovation and entrepreneurship program; solid-state battery materials research; core debate team member; coursework in game theory and psychology.</span>
          </div>
        </div>
      </section>

      <section class="section compact" aria-labelledby="capabilities-title">
        <div class="section-head">
          <span class="section-number">02</span>
          <h2 class="section-title" id="capabilities-title">Core Strengths</h2>
          <span class="section-rule"></span>
        </div>
        <div class="capability-grid">
          <div class="capability"><b>Product Judgment</b><span>Business abstraction · Requirements<br>Roadmap · MVP · Acceptance</span></div>
          <div class="capability"><b>Agent / AI</b><span>RAG · Workflows · Prompting<br>Evaluation · Human handoff</span></div>
          <div class="capability"><b>Complex Delivery</b><span>Cross-team execution · API integration<br>Risk decisions · Fail-safe fallback</span></div>
        </div>
      </section>

      <section class="section" aria-labelledby="experience-title">
        <div class="section-head">
          <span class="section-number">03</span>
          <h2 class="section-title" id="experience-title">Experience</h2>
          <span class="section-rule"></span>
        </div>

        <div class="experience">
          <div class="experience-head">
            <div class="experience-name">TP-Link <span>｜Commercial Project Manager</span></div>
            <div class="date">Jul 2024 — Feb 2026</div>
          </div>
          <ul class="bullets">
            <li><strong>Multi-line delivery:</strong> Led the full lifecycle of <strong>282 SKUs</strong> and managed <strong>80+ concurrent projects</strong> at peak across five hardware and software product lines; delivered <strong>10 high-value prototypes in one day</strong>, each valued at RMB 30,000+.</li>
            <li><strong>High-risk bid recovery:</strong> Led an outdoor lightning-protection switch project for a Korean customer under a new industrial design, new TPU / Si-PC materials, and an aggressive schedule; established parallel cross-process execution after a supplier change caused a one-month delay and <strong>recovered two critical weeks</strong>.</li>
            <li><strong>Urgent production decision:</strong> Anticipated Lunar New Year supply-chain disruption across five urgent switch products, initiated an exception process, aligned multiple teams, and <strong>completed delivery 15 days early</strong>; all projects received excellent ratings.</li>
            <li><strong>International feature definition:</strong> Led NFC feature definition for an overseas customer, identified trademark and comprehension risks, and drove convergence on a combined <strong>Bluetooth + NFC interaction</strong> across engineering, design, and business teams.</li>
          </ul>
        </div>

        <div class="experience">
          <div class="experience-head">
            <div class="experience-name">Zehuai Imaging Studio <span>｜Founder / AI Product Lead</span></div>
            <div class="date">Feb 2026 — Present</div>
          </div>
          <ul class="bullets">
            <li><strong>AI product strategy and system architecture:</strong> Digitized a photography business with a <strong>typical order value of RMB 3,000+</strong> by leading a three-product portfolio: <strong>Feishu AI Business Data Platform, Service Agent, and Lumen</strong>. Defined the layered architecture, roadmaps, MVPs, product boundaries, and acceptance criteria.</li>
            <li><strong>Intelligent workflows and data governance:</strong> Modeled consultation, customers, projects, talent, styling, post-production, and delivery as <strong>business entities, states, and events</strong>; designed structured ingestion, RAG, human review, risk routing, three-layer idempotency, audit trails, and fail-closed fallback.</li>
            <li><strong>AI engineering and delivery loop:</strong> Used <strong>Codex / Trae</strong> to accelerate PRDs, prototypes, Prompt / Context design, LangGraph orchestration, REST API integration, test-set construction, log diagnosis, and deployment validation; converted frontline operating issues into product iterations within a <strong>three-person team</strong>.</li>
          </ul>
        </div>
      </section>

      <div class="footer-mark">Product judgment · AI systems · Delivery</div>
    </article>

    <article class="page" data-page="02 / 02" aria-label="Resume page two">
      <section aria-labelledby="projects-title">
        <div class="section-head">
          <span class="section-number">04</span>
          <h2 class="section-title" id="projects-title">Selected AI Products</h2>
          <span class="section-rule"></span>
        </div>

        <div class="project-context">
          <b>Role</b>
          <span>Independently led with AI-assisted implementation · Business modeling, PRD / prototypes, prompts / workflows, API integration, evaluation, and deployment diagnosis</span>
        </div>

        <div class="project">
          <div class="project-intro">
            <h3 class="project-name">Service Agent <small>RAG Service Workflow</small></h3>
            <span class="project-focus">Consultation automation · Risk governance</span>
          </div>
          <ul class="evidence-list">
            <li><b>Business context</b><span>Designed for real consultation operations to reduce repetitive questions, inconsistent knowledge, and high-risk situations such as price commitments and complaints while balancing response speed and service safety.</span></li>
            <li><b>Core design</b><span>Orchestrated intent detection, retrieval, response generation, quality checks, and human handoff with <strong>LangGraph + RAG</strong>; defined <strong>R0–R3 risk levels, low-confidence clarification, and fail-closed</strong> behavior.</span></li>
            <li><b>Product capability</b><span>Supports <strong>knowledge citations, scenario routing, risk interception, human-in-the-loop review, and conversation traces</strong>; completed <strong>589 Python + 55 Web regression tests</strong> and used a <strong>90-scenario evaluation set</strong> plus error taxonomy to iterate prompts, rules, and the knowledge base.</span></li>
          </ul>
        </div>

        <div class="project section compact">
          <div class="project-intro">
            <h3 class="project-name">Feishu AI Business Data Platform <small>Data Governance</small></h3>
            <span class="project-focus">Data ingestion · Business facts</span>
          </div>
          <ul class="evidence-list">
            <li><b>Business context</b><span>Consolidates cross-channel studio information and addresses fragmented chat screenshots, forms, and manual entries, inconsistent field definitions, and weak business traceability.</span></li>
            <li><b>Core design</b><span>Modeled customers, projects, talent, styling, resources, and tasks in a <strong>unified business data model</strong>; designed a controlled flow from extraction to <strong>Candidate, human correction, SOP Gate</strong>, and fact tables.</span></li>
            <li><b>Product capability</b><span>Supports structured screenshot / form extraction, human correction, <strong>three-layer idempotency, audit trails, and exact cleanup by record ID</strong>. Read-only validation covered <strong>10 production V2 Base tables and 216 fields</strong>; the local Pilot gate passed <strong>49/49</strong>.</span></li>
          </ul>
        </div>

        <div class="project section compact">
          <div class="project-intro">
            <h3 class="project-name">Lumen <small>Multimodal Workspace</small></h3>
            <span class="project-focus">Multimodal editing · Task workspace</span>
          </div>
          <ul class="evidence-list">
            <li><b>Business context</b><span>Supports photography post-production and creative work by making image-edit prompts reusable, normalizing model interfaces, and tracking task status and generated results.</span></li>
            <li><b>Core design</b><span>Converted style, lighting, skin treatment, and detail work into <strong>reusable editing recipes</strong>; defined <strong>Provider abstraction, task state machine, retry, history recovery, and BYO API Key</strong> boundaries.</span></li>
            <li><b>Product capability</b><span>Supports <strong>Seedream 4.5 text-to-image / image-to-image, recipe reuse, model switching, and task history</strong>; <strong>32 targeted, 195 client, and 527 server regression tests</strong> passed, and <strong>2/2 real text-to-image and image-to-image calls returned HTTP 200</strong>.</span></li>
          </ul>
        </div>
      </section>

      <section class="section compact" aria-labelledby="skills-title">
        <div class="section-head">
          <span class="section-number">05</span>
          <h2 class="section-title" id="skills-title">Skills</h2>
          <span class="section-rule"></span>
        </div>
        <div class="skills-grid">
          <div class="skill-card"><b>AI Product Management</b><p><strong>User and scenario research, requirement decomposition, roadmaps, PRDs / prototypes</strong>, MVPs, metric design, and cross-team delivery</p></div>
          <div class="skill-card"><b>Agents and LLM Applications</b><p><strong>Prompt / Context Engineering, RAG, workflows, MCP / Tool Calling</strong>, and human-in-the-loop design</p></div>
          <div class="skill-card"><b>Evaluation and Data Loops</b><p><strong>Test-set construction, error taxonomy, hallucination and prohibited-commitment checks</strong>, A/B tests, regression tests, logs, and feedback loops</p></div>
          <div class="skill-card"><b>AI Coding and Engineering</b><p><strong>Codex / Trae, LangGraph, REST APIs, and Git</strong>; API integration and deployment diagnosis; foundational <strong>Python, TypeScript, and SQL</strong></p></div>
          <div class="skill-card wide"><b>Models and Multimodal Systems</b><p>Understands <strong>Transformers, Attention, Embeddings</strong>, and model boundaries; hands-on <strong>LLaMA-Factory / LoRA fine-tuning experiments</strong> covering dataset construction, parameter setup, loss analysis, and inference comparison; practical experience with <strong>Seedream image generation and Provider selection</strong>.</p></div>
        </div>
      </section>

      <div class="footer-mark">www.jaelchen.com · github.com/Catcherog</div>
    </article>
  </main>
</body>
"""


def build(template: Path, output: Path) -> None:
    html = template.read_text(encoding="utf-8")
    head, body_and_tail = html.split("<body>", 1)
    _, tail = body_and_tail.split("</body>", 1)
    head = head.replace('lang="zh-CN"', 'lang="en"')
    head = head.replace(
        "<title>陈嘉伟｜AI / Agent 产品经理｜两页简历预览</title>",
        "<title>Jiawei Chen | AI / Agent Product Manager | Two-page Resume</title>",
    )
    head = head.replace("</head>", STYLE_OVERRIDE + "</head>")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(head + BODY + tail, encoding="utf-8", newline="\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("template", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    build(args.template.resolve(), args.output.resolve())
    print(f"BUILT {args.output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
