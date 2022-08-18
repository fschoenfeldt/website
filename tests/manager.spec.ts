import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialRessources } from "../assets/js/lib/manager";

test.describe("manager", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("manager");
    // browsersync redirects to correct page so we have to wait
    await page.waitForLoadState("networkidle");
  });

  test("has correct title", async ({ page }) => {
    expect(await page.title()).toContain("Space Haven Manager");
  });

  test("index matches snapshop", async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot();
  });

  // https://playwright.dev/docs/accessibility-testing
  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("shows all ressources in addable list", async ({ page }) => {
    await page.click("data-testid=toggleRessourceVisibility");

    const ressources = await page.$$(
      "ul.ressources > li.ressources__item.ressources__item--change"
    );

    expect(ressources.length).toBe(initialRessources.length);
  });

  test("can add a new ressource to watch list", async ({ page }) => {
    await page.click("data-testid=toggleRessourceVisibility");
    await page.click(".ressources__item.ressources__item--change");

    await page.pause();
  });
});
