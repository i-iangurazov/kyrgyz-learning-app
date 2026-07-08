import { describe, expect, it } from "vitest";

import { defaultUiCopy, defaultUiLanguage, uiCopy } from "@/lib/copy";

describe("ui copy", () => {
  it("uses Russian as the default learner-facing language", () => {
    expect(defaultUiLanguage).toBe("ru");
    expect(defaultUiCopy).toBe(uiCopy.ru);
    expect(defaultUiCopy.home.heroTitle).toBe(
      "Начните говорить по-кыргызски",
    );
    expect(defaultUiCopy.app.tabs.practice).toBe("Практика");
  });

  it("keeps compact audio labels in the central copy", () => {
    expect(defaultUiCopy.audio.listen).toBe("Слушать");
    expect(defaultUiCopy.audio.soon).toBe("Скоро");
    expect(defaultUiCopy.audio.phraseAria).toBe("Слушать фразу");
  });
});
