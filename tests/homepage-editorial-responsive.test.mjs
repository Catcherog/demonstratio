import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(path) {
  try {
    return await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") return "";
    throw error;
  }
}

test("hero implements the approved editorial guide path without changing the full-guide target", async () => {
  const hero = await read("components/home/Hero.tsx");
  assert.match(hero, /hero-title-desktop/);
  assert.match(hero, /hero-title-mobile/);
  assert.match(hero, /hero-title-accent/);
  assert.match(hero, /hero-guide-route/);
  assert.match(hero, /promptIndex/);
  assert.match(hero, /href="#portfolio-guide"/);
  assert.match(hero, /进入 AI 导览/);
  assert.doesNotMatch(hero, /让 AI 用 90 秒介绍我/);
});

test("responsive editorial CSS is isolated, imported last, and defines tablet and phone contracts", async () => {
  const layout = await read("app/layout.tsx");
  const css = await read("app/editorial-responsive.css");
  assert.match(layout, /import "\.\/v5\.css";\s*import "\.\/editorial-responsive\.css";/);
  assert.match(css, /EDITORIAL_RESPONSIVE_R3_START/);
  assert.match(css, /--editorial-sage:/);
  assert.match(css, /\.hero-ai-invite::after/);
  assert.match(css, /@media \(max-width: 1050px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /\.hero-title-mobile\s*\{/);
  assert.match(css, /overflow-x:\s*(?:hidden|clip)/);
});

test("mobile header keeps a direct resume action while retaining the existing menu", async () => {
  const header = await read("components/Header.tsx");
  assert.match(header, /header-mobile-resume/);
  assert.match(header, /menu-button/);
  assert.match(header, /chen-jiawei-ai-agent-cn-two-page\.pdf/);
});
