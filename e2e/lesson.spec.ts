import { expect, test } from "@playwright/test";

test("lesson page renders core sections at mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/k0-u1-l1");

  await expect(page.getByTestId("lesson-player")).toBeVisible();
  await expect(page.getByTestId("lesson-step-progress")).toBeVisible();
  await expect(page.getByTestId("section-story")).toBeVisible();
  await expect(page.getByTestId("section-goals")).toBeVisible();
  await expect(page.getByTestId("section-vocabulary")).toBeVisible();
  await expect(page.getByTestId("section-dialogue")).toBeVisible();
  await expect(page.getByTestId("section-breakdown")).toBeVisible();
  await expect(page.getByTestId("section-grammar")).toBeVisible();
  await expect(page.getByTestId("section-exercise")).toBeVisible();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();
  await expect(page.getByTestId("section-speaking")).toBeVisible();
  await expect(page.getByTestId("section-ai-roleplay")).toBeVisible();
  await expect(page.getByTestId("section-review")).toBeVisible();
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "Step 1 of 11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "Next: Goals",
  );
  await expect(page.getByTestId("section-goals")).toContainText(
    "What you'll be able to do",
  );

  const bottomNav = page.getByRole("navigation", { name: "Primary" });
  await expect(bottomNav).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Learn" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Practice" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Games" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Profile" })).toBeVisible();

  const practice = page.getByTestId("section-exercise");
  await practice.scrollIntoViewIfNeeded();
  await practice.getByRole("button", { name: "thank you" }).click();
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Good. That fits this lesson.",
  );
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Rahmat means thank you.",
  );

  await page.getByTestId("section-review").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "Step 11 of 11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText("Review");
  await expect(page.getByTestId("practice-summary")).toContainText(
    "1 of 1 practice answers correct.",
  );

  await expect(page.locator("body")).not.toContainText(
    /Seeded|typed lesson|schema|placeholder|Sample\/demo|methodist|validation|TODO|mock state|sourceNotes|rightsNotes|validatedAgainst|not_reviewed/i,
  );

  await page.goto("/lesson/k0-u1-l1#lesson-review");
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "Step 11 of 11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText("Review");
});
