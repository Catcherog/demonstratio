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

const deepNavigationTargets = ["business", "product", "technical", "iterations"];

for (const targetId of deepNavigationTargets) {
  test(`deep case navigation reaches #${targetId} after a real smooth scroll`, async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.addInitScript(() => {
      window.__caseNavigationRuntimeErrors = [];
      window.__caseNavigationScrollCalls = [];
      const nativeScrollTo = window.scrollTo.bind(window);
      window.scrollTo = (...args) => {
        const optionsOrX = args[0];
        if (typeof optionsOrX === "object" && optionsOrX !== null) {
          window.__caseNavigationScrollCalls.push({
            behavior: optionsOrX.behavior,
            top: optionsOrX.top,
          });
        }
        return nativeScrollTo(...args);
      };
      window.addEventListener("error", (event) => {
        window.__caseNavigationRuntimeErrors.push(event.message || "window error");
      });
      window.addEventListener("unhandledrejection", (event) => {
        window.__caseNavigationRuntimeErrors.push(String(event.reason));
      });
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/projects/service-agent", { waitUntil: "load" });
    await expect(page.locator(".case-section-nav")).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(false);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.evaluate(() => {
      window.__caseNavigationScrollCalls = [];
    });

    const nav = page.locator(".case-section-nav");
    const target = page.locator(`#${targetId}`);
    const targetLink = page.locator(`.case-section-nav a[href="#${targetId}"]`);
    await targetLink.evaluate((link) => {
      const rail = link.closest(".case-section-nav-inner");
      if (!rail) return;
      const desiredLeft = link.offsetLeft - (rail.clientWidth - link.offsetWidth) / 2;
      const maxLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
      rail.scrollLeft = Math.min(maxLeft, Math.max(0, desiredLeft));
    });
    await targetLink.click();

    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe(`#${targetId}`);
    await expect.poll(() => page.evaluate(() => window.__caseNavigationScrollCalls.at(-1)?.behavior)).toBe("smooth");
    await expect.poll(() => targetLink.getAttribute("aria-current")).toBe("location");

    try {
      await page.waitForFunction(
        (id) => {
          const section = document.getElementById(id);
          const navigation = document.querySelector(".case-section-nav");
          if (!section || !navigation) return false;

          const targetTop = section.getBoundingClientRect().top;
          const railBottom = navigation.getBoundingClientRect().bottom;
          const placedAfterRail = targetTop >= railBottom - 12 && targetTop <= railBottom + 44;
          const previous = window.__caseNavigationScrollProbe;
          const current = { scrollY: window.scrollY, targetTop };
          const stableSamples = previous
            && Math.abs(previous.scrollY - current.scrollY) < 0.5
            && Math.abs(previous.targetTop - current.targetTop) < 0.5
            ? previous.stableSamples + 1
            : 0;
          window.__caseNavigationScrollProbe = { ...current, stableSamples };

          return placedAfterRail && stableSamples >= 4;
        },
        targetId,
        { polling: 50, timeout: 10_000 },
      );
    } catch (error) {
      const metrics = await page.evaluate((id) => {
        const section = document.getElementById(id);
        const navigation = document.querySelector(".case-section-nav");
        return {
          scrollY: window.scrollY,
          targetTop: section?.getBoundingClientRect().top,
          railBottom: navigation?.getBoundingClientRect().bottom,
          activeId: document.querySelector('.case-section-nav a[aria-current="location"]')?.getAttribute("href"),
        };
      }, targetId);
      throw new Error(`${error.message}; final metrics: ${JSON.stringify(metrics)}`);
    }

    await expect(target).toBeVisible();
    await expect(targetLink).toHaveAttribute("aria-current", "location");
    await expect.poll(() => page.evaluate((id) => {
      const section = document.getElementById(id);
      const navigation = document.querySelector(".case-section-nav");
      if (!section || !navigation) return false;
      const targetTop = section.getBoundingClientRect().top;
      const railBottom = navigation.getBoundingClientRect().bottom;
      return targetTop >= railBottom - 12 && targetTop <= railBottom + 44;
    }, targetId)).toBe(true);

    const runtimeErrors = await page.evaluate(() => window.__caseNavigationRuntimeErrors);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(runtimeErrors).toEqual([]);
    await expect(nav).toBeVisible();
  });
}
