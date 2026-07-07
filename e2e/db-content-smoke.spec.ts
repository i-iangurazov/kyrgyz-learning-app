import { expect, test } from "@playwright/test";

test.describe("DB-backed content smoke", () => {
  test.skip(
    process.env.DB_E2E !== "1",
    "DB-backed smoke runs only through pnpm test:e2e:db.",
  );

  test("renders learner routes from Postgres content at mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByText("Build your Kyrgyz base")).toBeVisible();
    await expect(page.getByText("Lessons ready")).toBeVisible();

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Learn" })
      .click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByRole("heading", { name: "Level map" })).toBeVisible();
    await expect(page.getByText("K0 Absolute beginner")).toBeVisible();

    await page
      .getByRole("link", { name: /First Kyrgyz greetings/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/lesson\/k0-u1-l1$/);
    await expect(page.getByTestId("lesson-player")).toBeVisible();
    await expect(page.getByTestId("lesson-step-progress")).toContainText(
      "Step 1 of 11",
    );
    await expect(page.getByTestId("section-story")).toBeVisible();
    await expect(page.getByTestId("section-goals")).toBeVisible();
    await expect(page.getByTestId("section-vocabulary")).toBeVisible();
    await expect(page.getByTestId("section-dialogue")).toBeVisible();
    await expect(page.getByTestId("section-breakdown")).toBeVisible();
    await expect(page.getByTestId("section-grammar")).toBeVisible();

    const practice = page.getByTestId("section-exercise");
    await practice.scrollIntoViewIfNeeded();
    await expect(practice).toBeVisible();
    await expect(practice.getByTestId("practice-progress")).toContainText(
      "Practice 1 of 2",
    );

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Practice" })
      .click();
    await expect(page).toHaveURL(/\/practice$/);
    await expect(page.getByTestId("practice-review-page")).toBeVisible();
    await expect(page.getByTestId("practice-review-page")).toContainText(
      "Review your weak spots",
    );

    await expect(page.locator("body")).not.toContainText(
      /database|postgres|fallback|seed|schema|sourceNotes|rightsNotes|validatedAgainst|audioReviewStatus|storageKey|methodist|validation|not_recorded|not_reviewed/i,
    );
  });
});
