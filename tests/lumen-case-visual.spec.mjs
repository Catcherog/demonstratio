import { test, expect } from "@playwright/test";

const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
];

for (const viewport of viewports) {
  test(`lumen case page has no horizontal overflow and renders editorial layout at ${viewport.name}`, async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/projects/lumen-ink", { waitUntil: "load" });

    // Header uses editorial-flow for Lumen
    const header = page.locator(".flagship-hero");
    await expect(header).toHaveClass(/flagship-hero--editorial-flow/);

    // Editorial title is visible and uses Lumen variant
    const title = page.locator("h1.case-editorial-title--lumen");
    await expect(title).toBeVisible();
    await expect(title).toHaveAttribute("aria-label", "光砚 AI 图像编辑工作台");
    await expect(title.locator(".case-editorial-title__main")).toHaveText("光砚");
    await expect(title.locator(".case-editorial-title__tail--lumen")).toContainText("AI 图像编辑工作台");

    // Status card is visible and complete
    const statusCard = page.locator(".flagship-status-card");
    await expect(statusCard).toBeVisible();
    await expect(statusCard.locator("strong").first()).toContainText("Live Demo");

    // Decision chain has 4 steps with Lumen variant class
    const decisionChain = page.locator(".case-decision-chain--lumen");
    await expect(decisionChain).toBeVisible();
    await expect(decisionChain.locator("li")).toHaveCount(4);

    // No "待补素材" text on the page
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("待补素材");

    // "打开体验" button is visible and links to the public workbench
    const demoLink = page.locator(".evidence-interactive-entry a", { hasText: "打开体验" });
    await expect(demoLink).toBeVisible();
    await expect(demoLink).toHaveAttribute("href", "https://lumen-ink.vercel.app/");
    await expect(demoLink).toHaveAttribute("target", "_blank");
    const rel = await demoLink.getAttribute("rel");
    expect(rel).toContain("noreferrer");

    // No horizontal overflow
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    // Title and status card are fully visible (no clipping)
    await expect.poll(() => page.evaluate(() => {
      const title = document.querySelector("h1.case-editorial-title--lumen");
      const card = document.querySelector(".flagship-status-card");
      if (!title || !card) return false;
      const titleRect = title.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return titleRect.right <= window.innerWidth && cardRect.right <= window.innerWidth;
    })).toBe(true);

    // No runtime errors
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
}
