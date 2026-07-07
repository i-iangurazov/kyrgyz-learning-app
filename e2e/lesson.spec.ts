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
  await expect(page.getByTestId("vocabulary-audio-control")).toHaveCount(4);
  await expect(page.getByTestId("dialogue-audio-control")).toHaveCount(3);
  await expect(page.getByTestId("reading-audio-control")).toHaveCount(1);
  await expect(
    page.getByTestId("vocabulary-audio-control").first(),
  ).toContainText("Audio coming soon");
  await expect(
    page.getByTestId("dialogue-audio-control").first(),
  ).toContainText("Audio coming soon");
  await expect(
    page.getByTestId("reading-audio-control").first(),
  ).toContainText("Audio coming soon");
  await expect(
    page.getByRole("button", { name: "Audio coming soon" }).first(),
  ).toBeDisabled();

  const bottomNav = page.getByRole("navigation", { name: "Primary" });
  await expect(bottomNav).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Learn" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Practice" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Games" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Profile" })).toBeVisible();

  const practice = page.getByTestId("section-exercise");
  await practice.scrollIntoViewIfNeeded();
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Practice 1 of 2",
  );
  await practice.getByRole("button", { name: "hello" }).click();
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Not quite yet.",
  );
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Rahmat means thank you.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Practice 2 of 2",
  );

  await practice.getByLabel("Жакшы, ___.").fill("рахмат");
  await practice.getByRole("button", { name: "Check answer" }).click();
  await expect(practice.getByTestId("missed-review")).toContainText(
    "Review missed items",
  );
  await expect(practice.getByTestId("missed-review")).toContainText(
    "You missed 1 item",
  );
  await practice
    .getByTestId("missed-review")
    .getByRole("button", { name: "thank you" })
    .click();
  await expect(practice.getByTestId("missed-corrected")).toContainText(
    "Nice - corrected",
  );
  await practice.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();

  await page.getByTestId("section-review").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "Step 11 of 11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText("Review");
  await expect(page.getByTestId("practice-summary")).toContainText(
    "You completed 2 practice items, got 1 correct on the first try, and corrected 1 missed answer.",
  );

  await expect(page.locator("body")).not.toContainText(
    /Seeded|typed lesson|schema|placeholder|Sample\/demo|methodist|validation|TODO|mock state|sourceNotes|rightsNotes|validatedAgainst|audioReviewStatus|storageKey|not_recorded|not_reviewed/i,
  );

  await page.goto("/lesson/k0-u1-l1#lesson-review");
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "Step 11 of 11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText("Review");
});

test("practice tab retries missed item directly at mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/k0-u1-l1");

  const practice = page.getByTestId("section-exercise");
  await practice.scrollIntoViewIfNeeded();
  await practice.getByRole("button", { name: "hello" }).click();
  await practice.getByLabel("Жакшы, ___.").fill("рахмат");
  await practice.getByRole("button", { name: "Check answer" }).click();

  await expect(practice.getByTestId("missed-review")).toContainText(
    "Review missed items",
  );
  await practice.getByRole("button", { name: "Continue anyway" }).click();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Practice" })
    .click();

  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.getByTestId("practice-review-page")).toBeVisible();
  await expect(page.getByTestId("practice-review-page")).toContainText(
    "Review your weak spots",
  );
  await expect(page.getByTestId("practice-progress-summary")).toContainText(
    "Missed items",
  );
  await expect(page.getByTestId("review-queue")).toContainText("Keep it fresh");
  await expect(page.getByTestId("review-queue-filters")).toContainText(
    "Needs review",
  );
  await expect(page.getByRole("tab", { name: "Needs review" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Needs review",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Your answer",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText("hello");
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Answer to remember",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "ыраазычылык",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText("Try again");
  await page
    .getByTestId("review-queue-item")
    .getByRole("button", { name: "Try again" })
    .click();
  await page
    .getByTestId("review-queue-item")
    .getByRole("button", { name: "thank you" })
    .click();
  await expect(page.getByTestId("review-queue-filter-empty")).toContainText(
    "Nothing needs review right now",
  );
  await expect(page.getByTestId("review-queue-complete")).toContainText(
    "Review complete",
  );
  await expect(page.getByTestId("practice-summary-needs-review")).toContainText(
    "0",
  );
  await expect(page.getByTestId("practice-summary-corrected")).toContainText("1");
  await page.getByRole("tab", { name: "Corrected" }).click();
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Nice - corrected",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText("hello");
  await page.getByRole("tab", { name: "All" }).click();
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Review in lesson",
  );
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    /localStorage|exercise IDs?|schema|progress object|sourceNotes|rightsNotes|audioReviewStatus|storageKey|methodist|validation|not_recorded|not_reviewed/i,
  );
});

test("sentence builder, match pairs, and error correction work inside a guided lesson flow at mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/k1-u1-l1");

  const practice = page.getByTestId("section-exercise");
  await practice.scrollIntoViewIfNeeded();

  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Practice 1 of 4",
  );
  await practice.getByLabel("___ Elina.").fill("Атым");
  await practice.getByRole("button", { name: "Check answer" }).click();
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Good. That fits this lesson.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Practice 2 of 4",
  );

  await expect(practice.getByTestId("sentence-builder-answer")).toContainText(
    "Tap the words in order",
  );
  const sentenceBuilder = practice.getByTestId(
    "exercise-item-item-build-atym-elina",
  );
  await sentenceBuilder.getByRole("button", { name: "Add Атым" }).click();
  await sentenceBuilder.getByRole("button", { name: "Add Элина" }).click();
  await sentenceBuilder.getByRole("button", { name: "Check", exact: true }).click();

  await expect(sentenceBuilder.getByTestId("exercise-feedback")).toContainText(
    "Nice - that works.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Practice 3 of 4",
  );

  const matchPairs = practice.getByTestId("exercise-item-item-intro-pairs");
  await matchPairs.scrollIntoViewIfNeeded();
  await expect(matchPairs.getByTestId("match-pairs-control")).toContainText(
    "Tap one item from each side.",
  );

  const matchLeft = matchPairs.getByTestId("match-pairs-left");
  const matchRight = matchPairs.getByTestId("match-pairs-right");
  await matchLeft.getByRole("button", { name: "Атым ..." }).click();
  await matchRight.getByRole("button", { name: "My name is ..." }).click();
  await matchLeft.getByRole("button", { name: "Атың ким?" }).click();
  await matchRight.getByRole("button", { name: "What is your name?" }).click();
  await matchLeft.getByRole("button", { name: "Сенчи?" }).click();
  await matchRight.getByRole("button", { name: "And you?" }).click();
  await matchPairs.getByRole("button", { name: "Check", exact: true }).click();

  await expect(matchPairs.getByTestId("exercise-feedback")).toContainText(
    "Nice - these match.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Practice 4 of 4",
  );

  const errorCorrection = practice.getByTestId(
    "exercise-item-item-correct-atyn-kim",
  );
  await errorCorrection.scrollIntoViewIfNeeded();
  await expect(errorCorrection.getByTestId("error-correction-source")).toContainText(
    "Атым ким?",
  );
  await errorCorrection.getByLabel("Correct version").fill("Атым ким?");
  await errorCorrection.getByRole("button", { name: "Check" }).click();

  await expect(errorCorrection.getByTestId("exercise-feedback")).toContainText(
    "Almost. Look at the ending.",
  );
  await expect(errorCorrection.getByTestId("exercise-feedback")).toContainText(
    "Correct version: Атың ким?",
  );

  const missedReview = practice.getByTestId("missed-review");
  await expect(missedReview).toContainText("Review missed items");
  await expect(missedReview).toContainText(
    "Your answer: Атым ким?",
  );
  await missedReview.getByLabel("Correct version").fill("Атың ким?");
  await missedReview.getByRole("button", { name: "Try again" }).click();

  await expect(practice.getByTestId("missed-corrected")).toContainText(
    "Nice - corrected",
  );
  await practice.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();

  await page.getByTestId("section-review").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("practice-summary")).toContainText(
    "You completed 4 practice items, got 3 correct on the first try, and corrected 1 missed answer.",
  );
  await expect(page.locator("body")).not.toContainText(
    /array|pair id|tokens|error object|schema|exercise ID|sourceNotes|rightsNotes|audioReviewStatus|storageKey|methodist|validation|not_recorded|not_reviewed/i,
  );
});
