import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:3004";
const executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const screenshotDir = "C:\\Users\\Catcher\\.codex\\visualizations\\2026\\09\\06\\01a074ba-b4a2-7942-8027-fc47be96231b";
const routes = [
  "/",
  "/interview",
  "/projects/data-platform",
  "/projects/service-agent",
  "/projects/lumen-ink",
  "/resume",
];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1024, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "phone", width: 390, height: 844 },
];

async function settleMedia(page) {
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 350));
    await Promise.all([...document.images].map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(350);
}

async function audit(page, route, viewport) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await settleMedia(page);

  const browserState = await page.evaluate(() => {
    const images = [...document.images].map((image) => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      width: image.getBoundingClientRect().width,
      height: image.getBoundingClientRect().height,
    }));
    const focusTarget = document.activeElement;
    const focusStyle = focusTarget ? getComputedStyle(focusTarget) : null;
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      imageCount: images.length,
      brokenImages: images.filter((image) => !image.complete || image.naturalWidth === 0),
      missingAlt: images.filter((image) => !image.alt.trim()),
      primaryEvidence: document.querySelector("[data-primary-evidence-id]")?.getAttribute("data-primary-evidence-id"),
      demoStatus: document.querySelector("[data-demo-status]")?.getAttribute("data-demo-status"),
      statusText: [...document.querySelectorAll(".flagship-status-card strong, .case-public-status-strip strong, .flagship-media > span, .library-status")]
        .map((node) => node.textContent?.trim())
        .filter(Boolean),
      focus: focusTarget
        ? {
            tag: focusTarget.tagName,
            text: focusTarget.textContent?.trim().slice(0, 80),
            outlineStyle: focusStyle?.outlineStyle,
            outlineWidth: focusStyle?.outlineWidth,
          }
        : null,
      mobileNav: document.querySelector(".nav")?.className ?? "",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });

  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return null;
    const style = getComputedStyle(active);
    return { tag: active.tagName, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });

  if (viewport.width <= 720 && route === "/") {
    const menu = page.getByRole("button", { name: "打开导航" });
    await menu.click();
    browserState.mobileNav = await page.locator(".nav").getAttribute("class");
  }

  assert.equal(response?.status(), 200, `${route} ${viewport.name} response`);
  assert.equal(browserState.clientWidth, viewport.width, `${route} ${viewport.name} clientWidth`);
  assert.equal(browserState.innerWidth, viewport.width, `${route} ${viewport.name} innerWidth`);
  assert.ok(browserState.scrollWidth <= browserState.clientWidth + 1, `${route} ${viewport.name} horizontal overflow`);
  assert.deepEqual(browserState.brokenImages, [], `${route} ${viewport.name} broken images`);
  assert.deepEqual(browserState.missingAlt, [], `${route} ${viewport.name} missing alt`);
  assert.deepEqual(consoleErrors, [], `${route} ${viewport.name} console errors`);
  assert.deepEqual(pageErrors, [], `${route} ${viewport.name} page errors`);
  assert.ok(focus?.outlineWidth && focus.outlineWidth !== "0px", `${route} ${viewport.name} keyboard focus`);
  if (viewport.width <= 720 && route === "/") {
    assert.equal(browserState.mobileNav, "nav nav-open", `${route} ${viewport.name} mobile nav`);
  }

  return {
    route,
    viewport: viewport.name,
    status: response?.status() ?? null,
    clientWidth: browserState.clientWidth,
    scrollWidth: browserState.scrollWidth,
    imageCount: browserState.imageCount,
    primaryEvidence: browserState.primaryEvidence,
    demoStatus: browserState.demoStatus,
    statusText: browserState.statusText,
    keyboardFocus: focus,
    mobileNav: browserState.mobileNav,
  };
}

const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const results = [];

for (const viewport of viewports) {
  for (const route of routes) results.push(await audit(page, route, viewport));
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const internalHrefs = await page.locator("a[href]").evaluateAll((links) =>
  [...new Set(links.map((link) => link.getAttribute("href")))]
    .filter((href) => href && href.startsWith("/") && !href.startsWith("//#")),
);
const internalLinkResults = [];
for (const href of internalHrefs) {
  const linkResponse = await context.request.get(`${baseUrl}${href}`);
  internalLinkResults.push({ href, status: linkResponse.status() });
  assert.equal(linkResponse.status(), 200, `internal link ${href}`);
}

await page.emulateMedia({ reducedMotion: "no-preference" });
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await settleMedia(page);
await page.screenshot({ path: `${screenshotDir}\\portfolio-local-desktop.png`, fullPage: true });
await page.screenshot({ path: `${screenshotDir}\\portfolio-local-desktop-top.png` });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await settleMedia(page);
await page.screenshot({ path: `${screenshotDir}\\portfolio-local-mobile.png`, fullPage: true });
await page.screenshot({ path: `${screenshotDir}\\portfolio-local-mobile-top.png` });

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${baseUrl}/interview`, { waitUntil: "networkidle" });
const reducedMotionState = await page.evaluate(() => ({
  matches: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
}));
assert.equal(reducedMotionState.matches, true, "reduced motion media query");
assert.equal(reducedMotionState.scrollBehavior, "auto", "reduced motion scroll behavior");

await browser.close();

const summaries = results.filter((result) => ["/", "/interview", "/projects/service-agent", "/projects/lumen-ink"].includes(result.route) && ["desktop", "phone"].includes(result.viewport));
console.log(JSON.stringify({
  checked: results.length,
  internalLinks: internalLinkResults,
  reducedMotion: reducedMotionState,
  summaries,
}, null, 2));
