import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("vacation page without params", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("vacation");
    // browsersync redirects to correct page so we have to wait
    await page.waitForLoadState("networkidle");
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("can enter vacation date", async ({ page }) => {
    await page.getByTestId("vacationDate").fill("2000-01-01");
    await page.getByTestId("submitButton").click();
    expect(await page.getByTestId("result").innerText()).toContain(
      "?date=2000-01-01",
    );
  });

  test("can enter vacation location", async ({ page }) => {
    await page.getByTestId("vacationDate").fill("2000-01-01");
    await page.getByTestId("vacationLocation").fill("Test Location");
    await page.getByTestId("submitButton").click();
    expect(await page.getByTestId("result").innerText()).toContain(
      "Test+Location",
    );
  });

  // TODO: to properly test this we need to mock the API call
  // test("can choose vacation background image", async ({ page }) => {
  //   await page.getByTestId("vacationDate").fill("2000-01-01");
  //   await page.getByTestId("vacationImageSearch").fill("Brompton");
  //   await page.getByTestId("vacationImageSearchSubmit").click();
  //   const searchResults = page.getByTestId("vacationImageResultList");
  //   const firstResult = searchResults.first();
  //   await firstResult.click();

  //   await page.getByTestId("submitButton").click();
  //   expect(await page.getByTestId("result").innerText()).toContain(
  //     "Test+Location",
  //   );
  //   expect(await page.getByTestId("result").innerText()).toContain(
  //     `vacationImage=${await firstResult.getAttribute("id")}`,
  //   );
  // });
});

test.describe("vacation page with params", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/vacation/?date=2030-01-01");
    // browsersync redirects to correct page so we have to wait
    await page.waitForLoadState("networkidle");
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("can click new vacation date button", async ({ page }) => {
    await page.getByTestId("newVacation").click();
    await expect(page.getByTestId("vacationForm")).toBeVisible();
  });
});
