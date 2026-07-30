# Website Resume PDF Refresh Design

## Goal

Replace the website's Chinese resume with the user-provided two-page PDF and publish a matching two-page English resume using the existing HTML resume source and render scripts.

## Chosen Approach

Use the smallest asset-focused change:

- Copy the supplied Chinese PDF to `public/resume/chen-jiawei-ai-agent-cn-two-page.pdf` without redesigning it.
- Preserve the existing black minimalist two-page A4 layout as the visual authority for English.
- Create an English HTML source from the existing resume HTML/CSS, translate the supplied Chinese resume section-by-section, and render it to `public/resume/jiawei-chen-ai-agent-en.pdf`.
- Keep existing website links and components unchanged because they already point to these filenames.
- Do not rebuild the DOCX or ATS TXT in this change; they are not linked by the website and expanding their scope would delay the requested PDF refresh.

## Content and Evidence Rules

- English section order mirrors the supplied Chinese PDF: profile, strengths, experience, selected AI products, skills.
- Preserve the three equal flagship projects: Service Agent, Feishu AI Business Data Platform, and Lumen.
- Translate quantities exactly rather than inventing new metrics.
- Validate the published quantities in code, including TP-Link delivery figures and the supplied project test/schema figures.
- Do not convert regression counts or evaluation sample counts into accuracy, readiness, or production-quality claims.

## Verification

- Both PDFs must be exactly two A4 pages.
- The English source must fit without clipping or overflow.
- Portfolio and GitHub links must remain clickable.
- Render every page to PNG and visually inspect all four pages.
- Present the Chinese and English previews to the user before commit, push, or deployment.
- After approval, replace only the resume assets/source and push the verified commit to `main`.

