# Portfolio Website Pre-Implementation Audit — 2026-09

审计时间：2026-09-06（Asia/Shanghai）
审计对象：`demonstratio` source authority and `https://www.jaelchen.com` public surface
审计模式：read-only discovery; no production, DNS, external data, or user traffic mutation

## Current baseline

The public site already has a polished editorial base: a hero, three featured cases, a five-layer system map, product method/data flywheel, AI guide, project library, experience, and contact. The source has a data-driven project registry, flagship six-section case studies, a public claim manifest, an evidence catalog, resume assets, and an existing browser/test harness.

The current page is still presented primarily as a collection of projects. The umbrella AI BUSINESS OS story is implied by the system map but is not the first organizing sentence. A visitor has to read too far before understanding how the customer interaction layer, business data layer, multimodal capability, and human reliability loop form one product system.

## Public browser audit

Read-only checks covered `/`, the three flagship case routes, `/resume`, and homepage internal links. Tested routes returned HTTP 200 and the sampled pages produced no console/page errors. Internal links resolved successfully, and the existing pages had accessible image alt text in the sampled DOM.

The material failures are structural rather than server reachability:

| Dimension | Score (0–3) | Finding |
| --- | ---: | --- |
| Candidate positioning | 2 | Strong hero, but the umbrella system is not yet the primary frame. |
| Three-minute comprehension | 1 | Project collection framing delays ownership, system boundary, and proof order. |
| AI BUSINESS OS architecture | 2 | A five-layer map exists, but it reads as a list of products rather than four reusable operating layers. |
| Flagship case clarity | 2 | Three strong case pages exist; role and technical depth are distributed across long sections. |
| Technical depth | 3 | Agent, schema, model/provider abstraction, risk gates, and iteration content are substantial. |
| Evidence credibility | 2 | Central registries exist, but some public labels are stale or broader than currently verified authority. |
| Demo resilience | 1 | Service Agent currently foregrounds a live label/entry even though recording/controlled fallback must be the interview-safe path. |
| Lumen boundary | 1 | “Live Demo” is broader than the verified two-operation Seedream scope. |
| Mobile behavior | 0 | At a 390px browser viewport, `document.documentElement.clientWidth` and `scrollWidth` remained 1280px because the page had no valid viewport contract. |
| Responsive visual hierarchy | 2 | Desktop is calm and readable; mobile therefore renders as a compressed desktop surface. |
| Accessibility interaction | 2 | Existing labels/alt text are good in sampled pages; focus, reduced motion, and mobile navigation need explicit closure checks. |
| Performance/media resilience | 2 | The source uses lazy media; a single full-page audit left some supporting lazy assets unresolved and needs explicit priority/load verification. |

Baseline score: **20/36 — not interview-ready yet**.

## Claim and evidence risks

- The public homepage and Service Agent surface currently use `公网实时 Demo｜受控生产验证`; the interview closure must make recording/controlled evidence primary and keep live URLs secondary until current upstream and source-SHA authority is available.
- The Lumen surface currently uses `Live Demo｜真实 Provider 编辑已验证`; the safe public wording is a controlled demo naming only the verified Seedream text-to-image and image-to-image operations, with auth and unsupported modes bounded.
- The R1.3 authority package has 21 exact metric bindings, including the historical `SCS-DEPLOYED-SHA` binding. That raw contract must remain unchanged for consistency parity, but the deployment-SHA claim must not render as current public provenance when deployment metadata is unavailable.
- Existing evidence already distinguishes historical Test Base, production schema read-only checks, partial writes, backend/frontend boundaries, auth limitations, and unsupported modes. The implementation must preserve those boundaries rather than compressing them into a generic “live” badge.
- No unsupported accuracy percentage, business KPI, production guarantee, or current deployment source SHA may be introduced.

## Required closure direction

1. Reframe the first scroll as AI BUSINESS OS: customer interaction intelligence, business data platform, multimodal production, and human review/operations/evaluation reliability.
2. Use four ordered layers: operations/human review; agent/automation; business data/memory; adapters/APIs/models.
3. Keep Service Agent as the flagship customer interaction case, Feishu as the data-platform case, and Lumen as the multimodal production case. Supporting projects remain in the library, not equal-weighted in the first scroll.
4. Add `/interview` as a concise presenter path with a fixed evidence order and fallback demo scripts.
5. Make the current public-safe status an explicit local display overlay while preserving the historical authority package and its exact 21-binding check.
6. Fix the viewport contract and verify 1440/1024/768/390, internal links, media, focus, reduced motion, overflow, and console/page errors in a real browser.

## Non-goals

- No rewrite of the Service Agent backend or Lumen runtime.
- No new production deployment, DNS change, alias promotion, external database write, or credential handling.
- No claim that local readiness equals Preview readiness, production readiness, or current deployment-SHA authority.
- No removal of the existing project library, legacy supporting-project renderer, or evidence IDs solely for visual simplification.

## Design and plan references

- Design: `docs/superpowers/specs/2026-09-06-portfolio-interview-full-closure-design.md`
- Implementation plan: `docs/superpowers/plans/2026-09-06-portfolio-interview-full-closure.md`
- Source authority: `project-control/PORTFOLIO-WEBSITE-AUTHORITY-2026-09.md`
