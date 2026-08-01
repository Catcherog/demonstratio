import { test, expect } from "@playwright/test";

async function expectFocusInsideDialog(page) {
  await expect.poll(() => page.locator(".guide-window-shell.is-open").evaluate((shell) => shell.contains(document.activeElement))).toBe(true);
}

test.describe("mobile AI guide dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load" });
  });

  test("traps keyboard focus, removes backdrop from tab order, and restores focus on Escape", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /AI 快速判断/ });
    const dialog = page.locator('[role="dialog"]');

    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(page.locator(".guide-sheet-backdrop")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".guide-sheet-backdrop")).not.toHaveAttribute("tabindex");
    await expect(page.locator(".guide-sheet-close")).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expectFocusInsideDialog(page);
    await page.keyboard.press("Tab");
    await expect(page.locator(".guide-sheet-close")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.locator(".guide-window-shell.is-open")).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveClass(/guide-sheet-open/);
    await expect(trigger).toBeFocused();
  });

  test("closes the mobile dialog and removes modal semantics when resized to desktop", async ({ page }) => {
    await page.getByRole("button", { name: /AI 快速判断/ }).click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 844 });

    await expect(page.locator(".guide-window-shell.is-open")).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveClass(/guide-sheet-open/);
    await expect(page.locator(".guide-window-shell")).not.toHaveAttribute("role", "dialog");
    await expect(page.locator(".guide-window-shell")).not.toHaveAttribute("aria-modal", "true");
  });
});
