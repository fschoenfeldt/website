import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("laufmaus project page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("laufmaus");
    // browsersync redirects to correct page so we have to wait
    await page.waitForLoadState("networkidle");
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have any automatically detectable accessibility issues in dark mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("hero section matches snapshot", async ({ page }) => {
    const section = page.locator("#hero");
    await section.scrollIntoViewIfNeeded();
    expect(await section.screenshot()).toMatchSnapshot();
  });

  test("heart rate monitoring section matches snapshot", async ({ page }) => {
    const section = page.locator("#heart-rate-monitoring");
    await section.scrollIntoViewIfNeeded();
    expect(await section.screenshot()).toMatchSnapshot();
  });

  test("live activity section matches snapshot", async ({ page }) => {
    const section = page.locator("#live-activity");
    await section.scrollIntoViewIfNeeded();
    expect(await section.screenshot()).toMatchSnapshot();
  });

  test("speed control section matches snapshot", async ({ page }) => {
    const section = page.locator("#speed-control");
    await section.scrollIntoViewIfNeeded();
    expect(await section.screenshot()).toMatchSnapshot();
  });

  test("comparison section matches snapshot", async ({ page }) => {
    const section = page.locator("#comparison");
    await section.scrollIntoViewIfNeeded();
    expect(await section.screenshot()).toMatchSnapshot();
  });

  test("compatible devices section matches snapshot", async ({ page }) => {
    const section = page.locator("#compatible-devices");
    await section.scrollIntoViewIfNeeded();
    expect(await section.screenshot()).toMatchSnapshot();
  });
});
