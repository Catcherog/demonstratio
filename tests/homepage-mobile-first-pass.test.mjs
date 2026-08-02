import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function read(relativePath) {
  return readFile(new URL("../" + relativePath, import.meta.url), "utf8");
}

test("mobile Hero exposes only a compact value path and three proof metrics", async () => {
  const hero = await read("components/home/Hero.tsx");
  const css = await read("app/portfolio-polish.css");

  assert.match(hero, /hero-lead-mobile/);
  assert.match(hero, /hero-mobile-proof/);
  assert.match(hero, /metrics\.slice\(0,\s*3\)/);
  assert.match(hero, /hero-ai-label-mobile/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.hero-ai-path[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.hero-mobile-proof[\s\S]*display:\s*grid/);
  assert.match(css, /\.hero-actions \.button[\s\S]*min-height:\s*48px[\s\S]*font-size:\s*14px/);
});

test("AI guide has one reusable full conversation window and a mobile Sheet entry", async () => {
  const guide = await read("components/PortfolioGuide.tsx");
  const css = await read("app/portfolio-polish.css");

  assert.match(guide, /guide-mobile-entry/);
  assert.match(guide, /guide-window-shell/);
  assert.match(guide, /guide-sheet-backdrop/);
  assert.match(guide, /guide-sheet-close/);
  assert.match(guide, /guide-role-description/);
  assert.match(guide, /guide-sheet-open/);
  assert.match(css, /\.guide-window-shell\.is-open/);
  assert.match(css, /\.guide-role-tabs[\s\S]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /\.guide-role-tabs button[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.guide-message > p[\s\S]*font-size:\s*14px/);
});

test("mobile project library conditionally renders six supporting projects without CSS-only hiding", async () => {
  const library = await read("components/ProjectLibrary.tsx");
  const css = await read("app/portfolio-polish.css");

  assert.match(library, /useSyncExternalStore/);
  assert.match(library, /!project\.featured/);
  assert.match(library, /project\.index/);
  assert.match(library, /library-card-compact/);
  assert.match(library, /已查看三个旗舰案例/);
  assert.match(library, /aria-expanded/);
  assert.doesNotMatch(css, /\.library-card-featured\s*\{\s*display:\s*none/);
});

test("mobile flywheel uses a semantic six-step list instead of compressed geometry", async () => {
  const flywheel = await read("components/DataFlywheel.tsx");
  const globals = await read("app/globals.css");
  const v5 = await read("app/v5.css");

  assert.match(flywheel, /flywheel-mobile/);
  assert.match(flywheel, /咨询接入/);
  assert.match(flywheel, /回到咨询接入/);
  assert.doesNotMatch(globals, /\.flywheel\s*\{[^}]*transform:\s*scale\(\.88\)/);
  assert.doesNotMatch(globals, /\.flywheel\s*\{[^}]*min-height:\s*620px/);
  assert.doesNotMatch(globals, /\.flywheel\s*\{[^}]*margin-(?:top|bottom):\s*-\d+px/);
  assert.doesNotMatch(v5, /overflow-x:\s*hidden/);
});

test("compact homepage typography keeps the mobile readability floor", async () => {
  const globals = await read("app/globals.css");
  const editorial = await read("app/editorial-responsive.css");
  const polish = await read("app/portfolio-polish.css");

  assert.doesNotMatch(globals, /@media \(max-width: 400px\)[\s\S]*font-size:\s*[6-9]px/);
  assert.doesNotMatch(editorial, /@media \(max-width: 720px\)[\s\S]*font-size:\s*[6-9]px/);
  assert.match(polish, /--mobile-gutter:\s*18px/);
  assert.match(polish, /--mobile-section-y:\s*64px/);
  assert.match(polish, /--mobile-subsection-y:\s*40px/);
  assert.match(polish, /--mobile-card-gap:\s*16px/);
});
