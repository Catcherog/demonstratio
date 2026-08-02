import { test, expect } from "@playwright/test";

const viewports = [
  { name: "phone", width: 390, height: 844, requiresHorizontalScroll: true },
  { name: "tablet", width: 768, height: 1024, requiresHorizontalScroll: true },
  { name: "laptop", width: 1024, height: 900, requiresHorizontalScroll: false },
  { name: "desktop", width: 1440, height: 900, requiresHorizontalScroll: false },
];

for (const viewport of viewports) {
  test(`case navigation is a real horizontal scroll rail at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/projects/service-agent", { waitUntil: "load" });

    const rail = page.locator(".case-section-nav-inner");
    const lastLink = rail.getByRole("link", { name: /迭代链路/ });

    await expect(rail).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveAttribute("aria-label", "Studio Customer Service");
    await expect(rail).toHaveCSS("overflow-x", "auto");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    if (viewport.requiresHorizontalScroll) {
      await expect.poll(() => rail.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);

      const initialScrollLeft = await rail.evaluate((node) => node.scrollLeft);
      await rail.evaluate((node) => {
        node.scrollLeft = node.scrollWidth - node.clientWidth;
      });
      await expect.poll(() => rail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(initialScrollLeft);
      await expect.poll(() => lastLink.evaluate((link) => {
        const linkRect = link.getBoundingClientRect();
        const railRect = link.parentElement.getBoundingClientRect();
        return linkRect.left >= railRect.left && linkRect.right <= railRect.right;
      })).toBe(true);

      await rail.evaluate((node) => {
        node.scrollLeft = 0;
      });
      await lastLink.focus();
      await expect(lastLink).toBeFocused();
      await expect.poll(() => lastLink.evaluate((link) => {
        const linkRect = link.getBoundingClientRect();
        const railRect = link.parentElement.getBoundingClientRect();
        return linkRect.left >= railRect.left && linkRect.right <= railRect.right;
      })).toBe(true);
    }
  });
}
