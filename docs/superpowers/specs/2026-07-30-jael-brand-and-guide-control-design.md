# Jael Brand and Guide Control Design

## Objective

Fix the clipped AI guide submit state and replace the browser's fallback globe with a small, recognizable personal brand mark without changing the homepage structure, information hierarchy, or approved editorial palette.

## Approved Direction

- Use a handwritten `Jael` wordmark in the site header.
- Keep the adjacent `陈嘉伟 / AI / Agent Product` copy so the compact signature does not carry the entire identity alone.
- Use a matching handwritten `J` for the favicon because the full wordmark is not legible at 16–32 px.
- Preserve the warm beige, deep plum, muted lilac, sage, and ink palette.
- Keep the style expressive but restrained: one signature flourish, no gradients, glow, or decorative animation.

## AI Guide Submit Control

- Keep the existing 44 px circular target and layout.
- Replace the variable-width Chinese labels with an inline SVG upward arrow in the idle state.
- Replace the arrow with a compact circular progress indicator while an answer is being generated.
- Expose the current state through `aria-label`: `发送问题` when idle and `正在生成回答` while loading.
- Preserve the current disabled behavior and all guide form logic.
- Respect `prefers-reduced-motion`; the loading indicator must remain visible without rotation when reduced motion is enabled.

## Brand Mark

- Header wordmark: `Jael` rendered as a dedicated signature element rather than the former circular `CJ` badge.
- Desktop size should remain visually balanced with the two-line identity copy; mobile may scale down but must stay readable.
- Favicon: valid standalone SVG with a square viewBox, deep-plum field, warm-paper handwritten `J`, and no external font dependency.
- The favicon must not rely on SVG `<text>` so browser rendering does not depend on installed fonts.

## Responsive and Accessibility Requirements

- The header must retain its existing 44 px minimum interaction target.
- The wordmark must not collide with the resume or menu controls at mobile widths.
- Decorative SVG content must be hidden from assistive technology; interactive state is expressed by the button label.
- No change to homepage section order or navigation labels.

## Verification

- Contract test rejects the old `CJ` badge and variable-width `思考中`/`发送` button content.
- Contract test requires the `Jael` wordmark, accessible button-state labels, and a path-based favicon.
- Run the guide tests, homepage contract tests, TypeScript check, and production build.
- Verify desktop and mobile screenshots and inspect the rendered favicon link in a real browser.

