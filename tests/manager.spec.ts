import { test, expect } from "@playwright/test";

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
});
