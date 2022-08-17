import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("manager", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("manager");
    // browsersync redirects to correct page so we have to wait
    await page.waitForLoadState("networkidle");
  });

  test("page loads and has correct title", async ({ page }) => {
    // verify that title is correct
    expect(await page.title()).toContain("Space Haven Manager");
  });

  // https://playwright.dev/docs/accessibility-testing
  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
