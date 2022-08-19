import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialRessources } from "../assets/js/lib/manager";

test.describe.parallel("manager", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("manager");
    // browsersync redirects to correct page so we have to wait
    await page.waitForLoadState("networkidle");
  });

  test("has correct title", async ({ page }) => {
    expect(await page.title()).toContain("Space Haven Manager");
  });

  test("index matches snapshop", async ({ page }) => {
    // TODO: as we don't have a custom font enabled for manager yet, this looks different on all machines...
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
    await page
      .locator(".ressources__item.ressources__item--change", {
        hasText: "Energium",
      })
      .click();

    await page.click("data-testid=toggleRessourceVisibility");

    const visibleRessources = await page.$$(
      "ul.ressources > li.ressources__item"
    );

    await expect(
      page.locator("ul.ressources li.ressources__item", {
        hasText: "Energium",
      })
    ).toBeVisible();
    // "toggleRessourceVisibility" button has to be subtracted from the count
    expect(visibleRessources.length - 1).toBe(1);
    expect(await page.screenshot()).toMatchSnapshot();
  });

  test("can enter price history value", async ({ page }) => {
    // activate ressource energium
    await page.click("data-testid=toggleRessourceVisibility");
    await page
      .locator(".ressources__item.ressources__item--change", {
        hasText: "Energium",
      })
      .click();
    await page.click("data-testid=toggleRessourceVisibility");

    await page.locator("li.ressources__item", { hasText: "Energium" }).click();
    expect(page.locator(".modal")).toBeVisible();
    expect(page.locator(".modal")).toContainText("Energium");
    expect(page.locator(".modal")).toContainText("no data for graph.. yet");

    await page.fill(".modal #number_input", "90");
    await page.click(".modal form button");

    await page.locator("li.ressources__item", { hasText: "Energium" }).click();
    await page.fill(".modal #number_input", "140");
    await page.click(".modal form button");

    const ressource = page.locator("li.ressources__item", {
      hasText: "Energium",
    });
    const priceInfos = ressource.locator(".ressources__item__priceinfo");
    await expect(priceInfos).toContainText("90");
    await expect(priceInfos).toContainText("140");
    await expect(priceInfos).toContainText("115");
    expect(await page.screenshot()).toMatchSnapshot();
  });
});
