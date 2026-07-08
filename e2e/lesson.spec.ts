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
    "1/11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "Далее: Цель",
  );
  await expect(page.getByTestId("section-goals")).toContainText(
    "После урока вы сможете",
  );
  await expect(page.getByTestId("vocabulary-audio-control")).toHaveCount(4);
  await expect(page.getByTestId("dialogue-audio-control")).toHaveCount(3);
  await expect(page.getByTestId("reading-audio-control")).toHaveCount(1);
  await expect(
    page.getByTestId("vocabulary-audio-control").first(),
  ).toContainText("Скоро");
  await expect(
    page.getByTestId("dialogue-audio-control").first(),
  ).toContainText("Скоро");
  await expect(
    page.getByTestId("reading-audio-control").first(),
  ).toContainText("Скоро");
  await expect(
    page.getByTestId("dialogue-audio-control").first(),
  ).not.toContainText("Салам! Жакшы?");
  await expect(
    page.getByRole("button", { name: /Слушать .*: скоро/ }).first(),
  ).toBeDisabled();

  const bottomNav = page.getByRole("navigation", { name: "Основная навигация" });
  await expect(bottomNav).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Главная" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Учиться" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Практика" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Игры" })).toBeVisible();
  await expect(bottomNav.getByRole("link", { name: "Профиль" })).toBeVisible();

  const practice = page.getByTestId("section-exercise");
  await practice.scrollIntoViewIfNeeded();
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Практика 1 из 2",
  );
  await practice.getByRole("button", { name: "привет" }).click();
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Почти.",
  );
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Рахмат значит спасибо.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Практика 2 из 2",
  );

  await practice.getByLabel("Жакшы, ___.").fill("рахмат");
  await practice.getByRole("button", { name: "Проверить" }).click();
  await expect(practice.getByTestId("missed-review")).toContainText(
    "Повторить ошибки",
  );
  await expect(practice.getByTestId("missed-review")).toContainText(
    "Ошибок: 1",
  );
  await practice
    .getByTestId("missed-review")
    .getByRole("button", { name: "спасибо" })
    .click();
  await expect(practice.getByTestId("missed-corrected")).toContainText(
    "Исправлено",
  );
  await practice.getByRole("button", { name: "Продолжить" }).click();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();

  await page.getByTestId("section-review").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "11/11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText("Итог");
  await expect(page.getByTestId("practice-summary")).toContainText(
    "Вы сделали 2 задания, сразу ответили верно на 1 и исправили 1.",
  );

  await expect(page.locator("body")).not.toContainText(
    /Seeded|typed lesson|schema|placeholder|Sample\/demo|methodist|validation|TODO|mock state|sourceNotes|rightsNotes|validatedAgainst|audioReviewStatus|storageKey|not_recorded|not_reviewed/i,
  );

  await page.goto("/lesson/k0-u1-l1#lesson-review");
  await expect(page.getByTestId("lesson-step-progress")).toContainText(
    "11/11",
  );
  await expect(page.getByTestId("lesson-step-progress")).toContainText("Итог");
});

test("practice tab retries missed item directly at mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/k0-u1-l1");

  const practice = page.getByTestId("section-exercise");
  await practice.scrollIntoViewIfNeeded();
  await practice.getByRole("button", { name: "привет" }).click();
  await practice.getByLabel("Жакшы, ___.").fill("рахмат");
  await practice.getByRole("button", { name: "Проверить" }).click();

  await expect(practice.getByTestId("missed-review")).toContainText(
    "Повторить ошибки",
  );
  await practice.getByRole("button", { name: "Продолжить сейчас" }).click();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();

  await page
    .getByRole("navigation", { name: "Основная навигация" })
    .getByRole("link", { name: "Практика" })
    .click();

  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.getByTestId("practice-review-page")).toBeVisible();
  await expect(page.getByTestId("practice-review-page")).toContainText(
    "Повторите слабые места",
  );
  await expect(page.getByTestId("practice-progress-summary")).toContainText(
    "Ошибки",
  );
  await expect(page.getByTestId("review-queue")).toContainText("Закрепить");
  await expect(page.getByTestId("review-queue-filters")).toContainText(
    "Повторить",
  );
  await expect(page.getByRole("tab", { name: "Повторить" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Повторить",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Ваш ответ",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText("привет");
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Правильный ответ",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "спасибо",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Попробовать ещё раз",
  );
  await page
    .getByTestId("review-queue-item")
    .getByRole("button", { name: "Попробовать ещё раз" })
    .click();
  await page
    .getByTestId("review-queue-item")
    .getByRole("button", { name: "спасибо" })
    .click();
  await expect(page.getByTestId("review-queue-filter-empty")).toContainText(
    "Сейчас нечего повторять",
  );
  await expect(page.getByTestId("review-queue-complete")).toContainText(
    "Повтор завершён",
  );
  await expect(page.getByTestId("practice-summary-needs-review")).toContainText(
    "0",
  );
  await expect(page.getByTestId("practice-summary-corrected")).toContainText("1");
  await page.getByRole("tab", { name: "Исправлено" }).click();
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Исправлено",
  );
  await expect(page.getByTestId("review-queue-item")).toContainText("привет");
  await page.getByRole("tab", { name: "Все" }).click();
  await expect(page.getByTestId("review-queue-item")).toContainText(
    "Повторить в уроке",
  );
  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }),
  ).toBeVisible();
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
    "Практика 1 из 4",
  );
  const fillBlank = practice.getByTestId("exercise-item-item-atym");
  await fillBlank.getByLabel("___ Элина.").fill("Атым");
  await fillBlank.getByRole("button", { name: "Проверить" }).click();
  await expect(practice.getByTestId("exercise-feedback")).toContainText(
    "Верно. Это подходит к уроку.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Практика 2 из 4",
  );

  await expect(practice.getByTestId("sentence-builder-answer")).toContainText(
    "Нажимайте слова по порядку",
  );
  const sentenceBuilder = practice.getByTestId(
    "exercise-item-item-build-atym-elina",
  );
  await sentenceBuilder.getByRole("button", { name: "Добавить Атым" }).click();
  await sentenceBuilder.getByRole("button", { name: "Добавить Элина" }).click();
  await sentenceBuilder.getByRole("button", { name: "Проверить", exact: true }).click();

  await expect(sentenceBuilder.getByTestId("exercise-feedback")).toContainText(
    "Верно. Так подходит.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Практика 3 из 4",
  );

  const matchPairs = practice.getByTestId("exercise-item-item-intro-pairs");
  await matchPairs.scrollIntoViewIfNeeded();
  await expect(matchPairs).toContainText(
    "Сопоставьте кыргызские фразы с их значениями.",
  );

  const matchLeft = matchPairs.getByTestId("match-pairs-left");
  const matchRight = matchPairs.getByTestId("match-pairs-right");
  await matchLeft.getByRole("button", { name: "Атым ..." }).click();
  await matchRight.getByRole("button", { name: "Меня зовут ..." }).click();
  await matchLeft.getByRole("button", { name: "Атың ким?" }).click();
  await matchRight.getByRole("button", { name: "Как тебя зовут?" }).click();
  await matchLeft.getByRole("button", { name: "Сенчи?" }).click();
  await matchRight.getByRole("button", { name: "А ты?" }).click();
  await matchPairs.getByRole("button", { name: "Проверить", exact: true }).click();

  await expect(matchPairs.getByTestId("exercise-feedback")).toContainText(
    "Верно. Эти пары совпадают.",
  );
  await expect(practice.getByTestId("practice-progress")).toContainText(
    "Практика 4 из 4",
  );

  const errorCorrection = practice.getByTestId(
    "exercise-item-item-correct-atyn-kim",
  );
  await errorCorrection.scrollIntoViewIfNeeded();
  await expect(errorCorrection.getByTestId("error-correction-source")).toContainText(
    "Атым ким?",
  );
  await errorCorrection.getByLabel("Правильный вариант").fill("Атым ким?");
  await errorCorrection.getByRole("button", { name: "Проверить" }).click();

  await expect(errorCorrection.getByTestId("exercise-feedback")).toContainText(
    "Почти. Посмотрите на окончание.",
  );
  await expect(errorCorrection.getByTestId("exercise-feedback")).toContainText(
    "Правильный вариант: Атың ким?",
  );

  const missedReview = practice.getByTestId("missed-review");
  await expect(missedReview).toContainText("Повторить ошибки");
  await expect(missedReview).toContainText(
    "Ваш ответ: Атым ким?",
  );
  await missedReview.getByLabel("Правильный вариант").fill("Атың ким?");
  await missedReview.getByRole("button", { name: "Проверить" }).click();

  await expect(practice.getByTestId("missed-corrected")).toContainText(
    "Исправлено",
  );
  await practice.getByRole("button", { name: "Продолжить" }).click();
  await expect(page.getByTestId("section-mini-game")).toBeVisible();

  await page.getByTestId("section-review").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("practice-summary")).toContainText(
    "Вы сделали 4 задания, сразу ответили верно на 3 и исправили 1.",
  );
  await expect(page.locator("body")).not.toContainText(
    /array|pair id|tokens|error object|schema|exercise ID|sourceNotes|rightsNotes|audioReviewStatus|storageKey|methodist|validation|not_recorded|not_reviewed/i,
  );
});
