import { expect, test } from "@playwright/test";

test("lesson page renders core sections at mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/k0-u1-l1");

  await expect(page.getByTestId("lesson-player")).toBeVisible();
  await expect(page.getByTestId("section-story")).toBeVisible();
  await expect(page.getByTestId("section-vocabulary")).toBeVisible();
  await expect(page.getByTestId("section-dialogue")).toBeVisible();
  await expect(page.getByTestId("section-grammar")).toBeVisible();
  await expect(page.getByTestId("section-exercise")).toBeVisible();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();
  await expect(page.getByTestId("section-speaking")).toBeVisible();
  await expect(page.getByTestId("section-ai-roleplay")).toBeVisible();
  await expect(page.getByTestId("section-review")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
});
