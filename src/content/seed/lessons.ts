import type { Lesson } from "@/content/schemas";

type HskComponent = Lesson["hskInspiredComponent"][number];
type TargetSkill = Lesson["targetSkills"][number];

const methodologyRefs = [
  "docs/SOURCE_METHODOLOGY.md",
  "docs/HSK_STRUCTURE_ANALYSIS.md",
  "docs/KYRGYZ_SOURCE_BASE.md",
  "docs/READING_AND_LITERATURE_PLAN.md",
];

const supportedTracks = ["RU_KY", "EN_KY", "KY_KY"] satisfies Lesson["supportedTracks"];

const demoRightsNotes =
  "Original app-authored demo content. No textbook, HSK, or literary passage copied. Requires methodist/rights review before production release.";

const pendingValidation = [
  "pending: Kyrgyz methodist review",
  "pending: Kyrgyz linguist review",
  "pending: Кыргызтест A1 alignment review",
];

const audioPlaceholder = {
  status: "placeholder",
  notes: "Native-speaker audio is not recorded for this demo item yet.",
} as const;

function text(ky: string, en: string, ru: string) {
  return { ky, en, ru };
}

function translations(en: string, ru: string) {
  return { en, ru };
}

function lifecycle(internalNotes: string[], methodistNotes: string[]) {
  return {
    contentStatus: "demo",
    methodistReviewStatus: "not_reviewed",
    isDemoContent: true,
    internalNotes,
    methodistNotes,
  } satisfies Pick<
    Lesson,
    | "contentStatus"
    | "methodistReviewStatus"
    | "isDemoContent"
    | "internalNotes"
    | "methodistNotes"
  >;
}

function sourceMetadata(
  kyrgyztestLevel: string,
  cefrLevelPlaceholder: string,
  hskInspiredComponent: HskComponent[],
  sourceNotes: string,
) {
  return {
    methodologyRefs,
    sourceNotes,
    rightsNotes: demoRightsNotes,
    validatedAgainst: pendingValidation,
    hskInspiredComponent,
    kyrgyztestLevel,
    cefrLevelPlaceholder,
    requiresLicense: false,
    isOriginalContent: true,
  } satisfies Pick<
    Lesson,
    | "methodologyRefs"
    | "sourceNotes"
    | "rightsNotes"
    | "validatedAgainst"
    | "hskInspiredComponent"
    | "kyrgyztestLevel"
    | "cefrLevelPlaceholder"
    | "requiresLicense"
    | "isOriginalContent"
  >;
}

function vocabularySource(lessonId: string) {
  return {
    linkedLessonIds: [lessonId],
    sourceNotes:
      "Original demo vocabulary entry selected for beginner sequencing; requires methodist validation.",
    rightsNotes: demoRightsNotes,
    methodistReviewStatus: "not_reviewed" as const,
  };
}

function originalInputSource(sourceNotes: string) {
  return {
    readingSourceType: "original" as const,
    rightsNotes: demoRightsNotes,
    sourceNotes,
    naturalnessReviewStatus: "not_reviewed" as const,
    methodistReviewStatus: "not_reviewed" as const,
    isOriginalContent: true,
    requiresLicense: false,
  };
}

function breakdownSource() {
  return {
    notesByTrack: {},
    methodistReviewStatus: "not_reviewed" as const,
    sourceNotes:
      "Original demo phrase breakdown. Meaning and track-specific notes require methodist validation.",
  };
}

function exerciseFeedback() {
  return {
    correct: text("Туура.", "Good. That fits this lesson.", "Верно. Это подходит к уроку."),
    incorrect: text(
      "Кайра аракет кыл.",
      "Not quite. Look at the lesson words again.",
      "Не совсем. Посмотрите ещё раз на слова урока.",
    ),
    hint: text(
      "Сабактагы сөздөрдү кара.",
      "Use the words from this lesson.",
      "Используйте слова из этого урока.",
    ),
  };
}

const lessonSourceComponents: HskComponent[] = [
  "lesson_title",
  "communication_goal",
  "vocabulary_list",
  "dialogue_or_reading_text",
  "phrase_breakdown",
  "grammar_point",
  "workbook_exercise",
  "speaking_task",
  "review_test",
];

export const lessonSeedData = [
  {
    id: "k0-u1-l1",
    schemaVersion: "lesson-v2",
    levelId: "K0",
    unitId: "k0-u1",
    order: 1,
    lessonNumber: 1,
    stableLessonId: "k0-u1-l1",
    estimatedDurationMinutes: 8,
    prerequisites: [],
    supportedTracks,
    sampleNotice:
      "Sample/demo content only. Requires methodist and Kyrgyz linguist validation before learner-facing release.",
    validationTodos: [
      "TODO(methodist): confirm K0 pacing and whether greetings should appear before full alphabet work.",
      "TODO(linguist): validate wording, register, transliteration, and translations.",
    ],
    ...lifecycle(
      [
        "TODO(methodist): review K0 greeting sequence before production.",
        "TODO(linguist): validate all Kyrgyz forms and translations.",
      ],
      [
        "Demo lesson only. Treat all grammar, register, and translation choices as unapproved.",
      ],
    ),
    ...sourceMetadata(
      "A1-placeholder",
      "pre-A1 internal placeholder",
      lessonSourceComponents,
      "Original demo lesson using the HSK-inspired sequence for K0 greetings and micro-reading.",
    ),
    title: text("Кыргызча саламдашуу", "First Kyrgyz greetings", "Первые кыргызские приветствия"),
    subtitle: text("Салам, рахмат, жакшы", "Say hello, thank you, and good", "Сказать привет, спасибо и хорошо"),
    learningGoals: [
      text("Жөнөкөй саламдашууну тааныйм.", "Recognize simple greetings.", "Узнавать простые приветствия."),
      text("Рахмат жана жакшы сөздөрүн колдоном.", "Use the words for thanks and good.", "Использовать слова спасибо и хорошо."),
    ],
    targetSkills: ["reading", "speaking", "vocabulary", "grammar"] satisfies TargetSkill[],
    story: {
      title: text("Биринчи жолугушуу", "A first meeting", "Первая встреча"),
      body: text(
        "Айжан менен Тимур сабакта биринчи жолу саламдашат.",
        "Aijan and Timur greet each other for the first time in class.",
        "Айжан и Тимур впервые здороваются на уроке.",
      ),
      contextTags: ["classroom", "greeting", "k0"],
      sampleNotice:
        "Demo story only. Requires methodist and linguist validation before release.",
      methodologyRefs,
      sourceNotes:
        "Original app-authored story card for K0 greeting context; no external passage copied.",
      rightsNotes: demoRightsNotes,
      methodistReviewStatus: "not_reviewed",
    },
    vocabulary: [
      {
        id: "salam",
        kyrgyz: "Салам",
        transliteration: "salam",
        translations: translations("hello", "привет"),
        example: {
          kyrgyz: "Салам!",
          translations: translations("Hello!", "Привет!"),
        },
        audio: audioPlaceholder,
        tags: ["greeting", "k0"],
        ...vocabularySource("k0-u1-l1"),
      },
      {
        id: "rahmat",
        kyrgyz: "Рахмат",
        transliteration: "rahmat",
        translations: translations("thank you", "спасибо"),
        example: {
          kyrgyz: "Рахмат.",
          translations: translations("Thank you.", "Спасибо."),
        },
        audio: audioPlaceholder,
        tags: ["polite", "k0"],
        ...vocabularySource("k0-u1-l1"),
      },
      {
        id: "jakshy",
        kyrgyz: "Жакшы",
        transliteration: "jakshy",
        translations: translations("good", "хорошо"),
        example: {
          kyrgyz: "Жакшы.",
          translations: translations("Good.", "Хорошо."),
        },
        audio: audioPlaceholder,
        tags: ["response", "k0"],
        ...vocabularySource("k0-u1-l1"),
      },
      {
        id: "sen",
        kyrgyz: "Сен",
        transliteration: "sen",
        translations: translations("you", "ты"),
        example: {
          kyrgyz: "Сен жакшы.",
          translations: translations("You are good.", "У тебя хорошо."),
        },
        audio: audioPlaceholder,
        tags: ["pronoun", "register-review-needed"],
        ...vocabularySource("k0-u1-l1"),
      },
    ],
    dialogues: [
      {
        id: "dialogue-greeting",
        type: "dialogue",
        title: text("Саламдашуу", "Greeting", "Приветствие"),
        context: text("Сабак башында", "At the start of class", "В начале урока"),
        lines: [
          {
            id: "dialogue-greeting-1",
            speaker: "Айжан",
            kyrgyz: "Салам!",
            transliteration: "Salam!",
            translations: translations("Hello!", "Привет!"),
            audio: audioPlaceholder,
          },
          {
            id: "dialogue-greeting-2",
            speaker: "Тимур",
            kyrgyz: "Салам! Жакшы?",
            transliteration: "Salam! Jakshy?",
            translations: translations("Hello! Good?", "Привет! Хорошо?"),
            audio: audioPlaceholder,
          },
          {
            id: "dialogue-greeting-3",
            speaker: "Айжан",
            kyrgyz: "Жакшы, рахмат.",
            transliteration: "Jakshy, rahmat.",
            translations: translations("Good, thank you.", "Хорошо, спасибо."),
            audio: audioPlaceholder,
          },
        ],
        breakdownItems: [
          {
            id: "breakdown-salam",
            phrase: "Салам!",
            meaningByTrack: {
              RU_KY: "Простое приветствие.",
              EN_KY: "A simple greeting.",
              KY_KY: "Жөнөкөй саламдашуу.",
            },
            linkedVocabularyIds: ["salam"],
            linkedGrammarPointIds: [],
            ...breakdownSource(),
          },
          {
            id: "breakdown-jakshy-rahmat",
            phrase: "Жакшы, рахмат.",
            meaningByTrack: {
              RU_KY: "Короткий ответ: хорошо, спасибо.",
              EN_KY: "A short reply: good, thank you.",
              KY_KY: "Кыска жооп: жакшы, рахмат.",
            },
            linkedVocabularyIds: ["jakshy", "rahmat"],
            linkedGrammarPointIds: ["sample-short-replies"],
            ...breakdownSource(),
          },
        ],
        linkedVocabularyIds: ["salam", "rahmat", "jakshy", "sen"],
        linkedGrammarPointIds: ["sample-short-replies"],
        audio: audioPlaceholder,
        ...originalInputSource(
          "Original K0 demo dialogue drafted for greeting practice; naturalness requires review.",
        ),
      },
    ],
    texts: [
      {
        id: "reading-greeting",
        type: "reading_text",
        title: text("Кыска окуу", "Short reading", "Короткое чтение"),
        paragraphs: [
          {
            id: "reading-greeting-p1",
            kyrgyz: "Салам. Мен жакшы. Рахмат.",
            translations: translations("Hello. I am good. Thank you.", "Привет. У меня хорошо. Спасибо."),
            audio: audioPlaceholder,
          },
        ],
        breakdownItems: [
          {
            id: "breakdown-reading-greeting",
            phrase: "Салам. ... Рахмат.",
            meaningByTrack: {
              RU_KY: "Очень короткий текст с приветствием и благодарностью.",
              EN_KY: "A very short text with greeting and thanks.",
              KY_KY: "Саламдашуу жана ыраазычылык бар кыска текст.",
            },
            linkedVocabularyIds: ["salam", "rahmat", "jakshy"],
            linkedGrammarPointIds: ["sample-short-replies"],
            ...breakdownSource(),
          },
        ],
        linkedVocabularyIds: ["salam", "rahmat", "jakshy"],
        linkedGrammarPointIds: ["sample-short-replies"],
        ...originalInputSource(
          "Original K0 micro-reading text created for the app; grammar and wording require validation.",
        ),
      },
    ],
    grammarPoints: [
      {
        id: "sample-short-replies",
        title: text("Кыска жооптор", "Short replies", "Короткие ответы"),
        level: "K0",
        explanationsByTrack: {
          RU_KY: "В приветствиях часто используются очень короткие ответы. Эта демо-заметка требует проверки.",
          EN_KY: "Short replies are common in greetings. This demo note still needs review.",
          KY_KY: "Саламдашууда кыска жооптор көп колдонулат. Бул демо түшүндүрмө текшерилет.",
        },
        simpleRule: text(
          "Саламдашууда кыска жооптор көп колдонулат.",
          "Short replies are common in greetings.",
          "В приветствиях часто используются короткие ответы.",
        ),
        examples: [
          {
            id: "example-jakshy-rahmat",
            kyrgyz: "Жакшы, рахмат.",
            transliteration: "Jakshy, rahmat.",
            translations: translations("Good, thank you.", "Хорошо, спасибо."),
            linkedVocabularyIds: ["jakshy", "rahmat"],
          },
        ],
        commonMistakes: [],
        microPracticePrompts: [
          {
            id: "micro-short-reply",
            prompt: text("Рахмат дегенди тап.", "Find thank you.", "Найдите спасибо."),
            answer: text("Рахмат", "Rahmat", "Рахмат"),
            feedback: text("Рахмат - ыраазычылык.", "Rahmat means thank you.", "Рахмат значит спасибо."),
          },
        ],
        linkedExerciseIds: ["ex-greeting-match"],
        methodologyRefs,
        sourceNotes:
          "Original demo grammar note drafted for K0 greeting practice; grammar reference check required.",
        validationNotes:
          "TODO(linguist): verify the naturalness of abbreviated greeting responses for beginner teaching.",
        validatedAgainst: pendingValidation,
        methodistReviewStatus: "not_reviewed",
      },
    ],
    exercises: [
      {
        id: "ex-greeting-match",
        kind: "multiple_choice",
        prompt: text("Маанисин танда.", "Choose the meaning.", "Выберите значение."),
        helperTextByTrack: {
          RU_KY: "Выберите перевод слова из урока.",
          EN_KY: "Choose the meaning of the lesson word.",
          KY_KY: "Сабактагы сөздүн маанисин танда.",
        },
        linkedVocabularyIds: ["rahmat", "salam", "jakshy"],
        linkedGrammarPointIds: ["sample-short-replies"],
        items: [
          {
            id: "item-rahmat",
            question: text("Рахмат", "Рахмат", "Рахмат"),
            options: [
              { id: "hello", text: text("саламдашуу", "hello", "привет") },
              { id: "thank-you", text: text("ыраазычылык", "thank you", "спасибо") },
              { id: "goodbye", text: text("коштошуу", "goodbye", "пока") },
            ],
            correctAnswerData: { kind: "choice_id", value: "thank-you" },
            explanation: text("Рахмат - ыраазычылык.", "Rahmat means thank you.", "Рахмат значит спасибо."),
            feedback: exerciseFeedback(),
          },
        ],
        hskInspiredComponent: ["workbook_exercise"],
        sourceNotes:
          "Original demo multiple-choice item. Distractors and translations require methodist validation.",
        methodistReviewStatus: "not_reviewed",
      },
    ],
    miniGame: {
      id: "game-greeting-word-match",
      type: "word_match",
      title: text("Тез танда", "Quick pick", "Быстрый выбор"),
      description: text(
        "Саламдашуу сөзүн 5 секунд ичинде тап.",
        "Find the greeting word within 5 seconds.",
        "Найдите слово приветствия за 5 секунд.",
      ),
      config: {
        linkedVocabularyIds: ["salam", "rahmat", "jakshy"],
        linkedGrammarPointIds: ["sample-short-replies"],
        sourcePhraseIds: ["breakdown-salam", "breakdown-jakshy-rahmat"],
        targetSkill: "vocabulary",
        difficulty: "starter",
      },
      hskInspiredComponent: ["workbook_exercise"],
      methodistReviewStatus: "not_reviewed",
    },
    speakingPrompt: {
      id: "speak-first-hello",
      title: text("Үн менен айт", "Say it aloud", "Скажите вслух"),
      prompt: text(
        "Салам. Жакшы, рахмат.",
        "Say: Hello. Good, thank you.",
        "Скажите: Привет. Хорошо, спасибо.",
      ),
      expectedPhrases: ["Салам.", "Жакшы, рахмат."],
      linkedVocabularyIds: ["salam", "jakshy", "rahmat"],
      linkedGrammarPointIds: ["sample-short-replies"],
      pronunciationFocus:
        "TODO(linguist): add approved K0 pronunciation focus before production audio work.",
      sampleAnswer: "Салам. Жакшы, рахмат.",
      methodistReviewStatus: "not_reviewed",
    },
    aiRoleplay: {
      id: "roleplay-class-greeting",
      scenarioId: "k0-class-greeting",
      title: text("Биринчи сабак", "First class greeting", "Приветствие на первом уроке"),
      level: "K0",
      situation: text(
        "Сен биринчи сабакка келдиң.",
        "You arrive at your first class.",
        "Вы пришли на первый урок.",
      ),
      userGoal: text("Мугалим менен саламдаш.", "Greet the teacher.", "Поздоровайтесь с учителем."),
      aiCharacter: text("Мугалим", "Teacher", "Учитель"),
      allowedVocabularyIds: ["salam", "rahmat", "jakshy"],
      allowedGrammarPointIds: ["sample-short-replies"],
      allowedPhrases: ["Салам.", "Жакшы, рахмат.", "Рахмат."],
      correctionStyle: "gentle_short",
      uncertaintyRules: [
        "Tag any generated grammar explanation for methodist review.",
        "Prefer allowed phrases and avoid adding new vocabulary.",
      ],
      refusalRules: [
        "Do not answer as a grammar authority.",
        "Redirect off-level requests back to the greeting scenario.",
      ],
      systemPromptPlaceholder:
        "Internal placeholder for future constrained AI roleplay. Keep K0 turns short and use allowed phrases only after methodist validation.",
      methodistReviewStatus: "not_reviewed",
    },
    review: {
      summary: text(
        "Сен саламдашуу жана ыраазычылык сөздөрүн көрдүң.",
        "You saw greetings and thanks.",
        "Вы увидели приветствия и благодарность.",
      ),
      canDo: [
        text("Салам деген сөздү тааныйм.", "I can recognize Salam.", "Я могу узнать слово Салам."),
        text("Рахмат деген сөздү колдоном.", "I can use Rahmat.", "Я могу использовать Рахмат."),
      ],
      reviewVocabularyIds: ["salam", "rahmat", "jakshy"],
      reviewGrammarPointIds: ["sample-short-replies"],
      nextLessonId: "k0-u1-l2",
      methodologyRefs,
    },
  },
  {
    id: "k0-u1-l2",
    schemaVersion: "lesson-v2",
    levelId: "K0",
    unitId: "k0-u1",
    order: 2,
    lessonNumber: 2,
    stableLessonId: "k0-u1-l2",
    estimatedDurationMinutes: 8,
    prerequisites: ["k0-u1-l1"],
    supportedTracks,
    sampleNotice:
      "Sample/demo content only. Requires methodist and Kyrgyz linguist validation before learner-facing release.",
    validationTodos: [
      "TODO(linguist): validate phonetic descriptions and transliteration strategy.",
      "TODO(methodist): confirm order of introducing ө, ү, ң in K0.",
    ],
    ...lifecycle(
      [
        "TODO(linguist): approve K0 special-letter examples and pronunciation notation.",
        "TODO(methodist): confirm whether this lesson should follow greetings.",
      ],
      ["Demo phonology/reading lesson only. Pronunciation guidance is not authoritative."],
    ),
    ...sourceMetadata(
      "A1-placeholder",
      "pre-A1 internal placeholder",
      lessonSourceComponents,
      "Original demo lesson using K0 special-letter reading practice informed by the documented Kyrgyz source base.",
    ),
    title: text("Ө, Ү, Ң тамгалары", "The letters ө, ү, ң", "Буквы ө, ү, ң"),
    subtitle: text("Кыргыз тилиндеги өзгөчө үндөр", "Special Kyrgyz sounds", "Особые кыргызские звуки"),
    learningGoals: [
      text("Ө, ү, ң тамгаларын көрүп тааныйм.", "Recognize the letters ө, ү, ң.", "Узнавать буквы ө, ү, ң."),
      text("Кыска сөздөрдү окууга аракет кылам.", "Try reading short words.", "Пробовать читать короткие слова."),
    ],
    targetSkills: ["reading", "listening", "speaking", "vocabulary"] satisfies TargetSkill[],
    story: {
      title: text("Үн карталары", "Sound cards", "Карточки звуков"),
      body: text(
        "Бүгүн окуучу үч жаңы тамганы көрөт: ө, ү, ң.",
        "Today the learner sees three new letters: ө, ү, ң.",
        "Сегодня ученик видит три новые буквы: ө, ү, ң.",
      ),
      contextTags: ["alphabet", "special-letters", "k0"],
      sampleNotice:
        "Demo story only. Requires methodist and linguist validation before release.",
      methodologyRefs,
      sourceNotes:
        "Original app-authored story card for K0 special-letter practice; no external passage copied.",
      rightsNotes: demoRightsNotes,
      methodistReviewStatus: "not_reviewed",
    },
    vocabulary: [
      {
        id: "ozon",
        kyrgyz: "Өзөн",
        transliteration: "ozon",
        translations: translations("stream", "ручей"),
        example: {
          kyrgyz: "Бул өзөн.",
          translations: translations("This is a stream.", "Это ручей."),
        },
        audio: audioPlaceholder,
        tags: ["letter-o-special", "reading"],
        ...vocabularySource("k0-u1-l2"),
      },
      {
        id: "utuk",
        kyrgyz: "Үтүк",
        transliteration: "utuk",
        translations: translations("iron", "утюг"),
        example: {
          kyrgyz: "Бул үтүк.",
          translations: translations("This is an iron.", "Это утюг."),
        },
        audio: audioPlaceholder,
        tags: ["letter-u-special", "reading"],
        ...vocabularySource("k0-u1-l2"),
      },
      {
        id: "tan",
        kyrgyz: "Таң",
        transliteration: "tang",
        translations: translations("dawn", "рассвет"),
        example: {
          kyrgyz: "Бул таң.",
          translations: translations("This is dawn.", "Это рассвет."),
        },
        audio: audioPlaceholder,
        tags: ["letter-ng", "reading"],
        ...vocabularySource("k0-u1-l2"),
      },
    ],
    dialogues: [
      {
        id: "dialogue-sound-check",
        type: "dialogue",
        title: text("Үндү текшерүү", "Sound check", "Проверка звука"),
        context: text("Тамга сабагында", "In a letter lesson", "На уроке букв"),
        lines: [
          {
            id: "dialogue-sound-check-1",
            speaker: "Мугалим",
            kyrgyz: "Бул ө.",
            transliteration: "Bul o.",
            translations: translations("This is ө.", "Это ө."),
            audio: audioPlaceholder,
          },
          {
            id: "dialogue-sound-check-2",
            speaker: "Окуучу",
            kyrgyz: "Ө.",
            transliteration: "O.",
            translations: translations("Ө.", "Ө."),
            audio: audioPlaceholder,
          },
          {
            id: "dialogue-sound-check-3",
            speaker: "Мугалим",
            kyrgyz: "Бул ң.",
            transliteration: "Bul ng.",
            translations: translations("This is ң.", "Это ң."),
            audio: audioPlaceholder,
          },
        ],
        breakdownItems: [
          {
            id: "breakdown-letter-o",
            phrase: "ө",
            meaningByTrack: {
              RU_KY: "Особая кыргызская буква; произношение нужно проверить с лингвистом.",
              EN_KY: "A special Kyrgyz letter; pronunciation needs linguist validation.",
              KY_KY: "Кыргыз тилиндеги өзгөчө тамга; айтылышы текшерилет.",
            },
            linkedVocabularyIds: ["ozon"],
            linkedGrammarPointIds: ["letters-not-grammar"],
            ...breakdownSource(),
          },
          {
            id: "breakdown-letter-ng",
            phrase: "ң",
            meaningByTrack: {
              RU_KY: "Буква ң встречается в коротком слове Таң.",
              EN_KY: "The letter ң appears in the short word Таң.",
              KY_KY: "ң тамгасы Таң сөзүндө бар.",
            },
            linkedVocabularyIds: ["tan"],
            linkedGrammarPointIds: ["letters-not-grammar"],
            ...breakdownSource(),
          },
        ],
        linkedVocabularyIds: ["ozon", "utuk", "tan"],
        linkedGrammarPointIds: ["letters-not-grammar"],
        audio: audioPlaceholder,
        ...originalInputSource(
          "Original K0 sound-check dialogue drafted for special-letter recognition; pronunciation claims require review.",
        ),
      },
    ],
    texts: [
      {
        id: "reading-special-letters",
        type: "reading_text",
        title: text("Окуу", "Reading", "Чтение"),
        paragraphs: [
          {
            id: "reading-special-letters-p1",
            kyrgyz: "Өзөн. Үтүк. Таң.",
            translations: translations("Stream. Iron. Dawn.", "Ручей. Утюг. Рассвет."),
            audio: audioPlaceholder,
          },
        ],
        breakdownItems: [
          {
            id: "breakdown-special-reading",
            phrase: "Өзөн. Үтүк. Таң.",
            meaningByTrack: {
              RU_KY: "Короткие слова для распознавания ө, ү, ң.",
              EN_KY: "Short words for recognizing ө, ү, ң.",
              KY_KY: "ө, ү, ң тамгаларын таануу үчүн кыска сөздөр.",
            },
            linkedVocabularyIds: ["ozon", "utuk", "tan"],
            linkedGrammarPointIds: ["letters-not-grammar"],
            ...breakdownSource(),
          },
        ],
        linkedVocabularyIds: ["ozon", "utuk", "tan"],
        linkedGrammarPointIds: ["letters-not-grammar"],
        ...originalInputSource(
          "Original K0 micro-reading text using demo special-letter words; source and pronunciation review required.",
        ),
      },
    ],
    grammarPoints: [
      {
        id: "letters-not-grammar",
        title: text("Тамга жана үн", "Letter and sound", "Буква и звук"),
        level: "K0",
        explanationsByTrack: {
          RU_KY: "Это не полноценная грамматика. Урок готовит чтение через буквы ө, ү, ң.",
          EN_KY: "This is not a full grammar point. It prepares reading through ө, ү, ң.",
          KY_KY: "Бул толук грамматика эмес. Сабак ө, ү, ң аркылуу окууга даярдайт.",
        },
        simpleRule: text(
          "Бул сабак грамматика эмес, окуу көндүмүнө даярдык.",
          "This lesson prepares reading skill before heavier grammar.",
          "Этот урок готовит навык чтения перед более сложной грамматикой.",
        ),
        examples: [
          {
            id: "example-o-ozon",
            kyrgyz: "ө - өзөн",
            transliteration: "o - ozon",
            translations: translations("ө as in өзөн", "ө как в слове өзөн"),
            linkedVocabularyIds: ["ozon"],
          },
        ],
        commonMistakes: [],
        microPracticePrompts: [
          {
            id: "micro-find-ng",
            prompt: text("ң тамгасын тап.", "Find the letter ң.", "Найдите букву ң."),
            answer: text("Таң", "Таң", "Таң"),
            feedback: text("Таң сөзүндө ң бар.", "Таң has ң.", "В слове Таң есть ң."),
          },
        ],
        linkedExerciseIds: ["ex-letter-pick"],
        methodologyRefs,
        sourceNotes:
          "Original demo reading guidance for K0; not a final pronunciation or grammar explanation.",
        validationNotes:
          "TODO(linguist): replace placeholder transliteration with approved pronunciation notation.",
        validatedAgainst: pendingValidation,
        methodistReviewStatus: "not_reviewed",
      },
    ],
    exercises: [
      {
        id: "ex-letter-pick",
        kind: "multiple_choice",
        prompt: text("Кайсы сөздө ң бар?", "Which word has ң?", "В каком слове есть ң?"),
        helperTextByTrack: {
          RU_KY: "Найдите слово с буквой ң.",
          EN_KY: "Find the word with ң.",
          KY_KY: "ң тамгасы бар сөздү тап.",
        },
        linkedVocabularyIds: ["ozon", "utuk", "tan"],
        linkedGrammarPointIds: ["letters-not-grammar"],
        items: [
          {
            id: "item-ng",
            question: text("ң тамгасын тап", "Find the letter ң", "Найдите букву ң"),
            options: [
              { id: "ozon", text: text("Өзөн", "Өзөн", "Өзөн") },
              { id: "utuk", text: text("Үтүк", "Үтүк", "Үтүк") },
              { id: "tan", text: text("Таң", "Таң", "Таң") },
            ],
            correctAnswerData: { kind: "choice_id", value: "tan" },
            explanation: text("Таң сөзүндө ң бар.", "Таң has ң.", "В слове Таң есть ң."),
            feedback: exerciseFeedback(),
          },
        ],
        hskInspiredComponent: ["workbook_exercise"],
        sourceNotes:
          "Original demo recognition exercise for special-letter reading. Requires linguist validation.",
        methodistReviewStatus: "not_reviewed",
      },
    ],
    miniGame: {
      id: "game-special-letter-match",
      type: "word_match",
      title: text("Үн менен тамга", "Sound and letter", "Звук и буква"),
      description: text(
        "Азырынча тамганы сөз менен дал келтир.",
        "For now, match the letter to the word.",
        "Пока сопоставьте букву со словом.",
      ),
      config: {
        linkedVocabularyIds: ["ozon", "utuk", "tan"],
        linkedGrammarPointIds: ["letters-not-grammar"],
        sourcePhraseIds: ["breakdown-letter-o", "breakdown-letter-ng"],
        targetSkill: "reading",
        difficulty: "starter",
      },
      hskInspiredComponent: ["workbook_exercise", "listening_task"],
      methodistReviewStatus: "not_reviewed",
    },
    speakingPrompt: {
      id: "speak-special-letters",
      title: text("Тамгаларды айт", "Say the letters", "Произнесите буквы"),
      prompt: text("Ө, ү, ң тамгаларын жай айт.", "Say ө, ү, ң slowly.", "Медленно произнесите ө, ү, ң."),
      expectedPhrases: ["Ө.", "Ү.", "Ң."],
      linkedVocabularyIds: ["ozon", "utuk", "tan"],
      linkedGrammarPointIds: ["letters-not-grammar"],
      pronunciationFocus:
        "TODO(linguist): add safe pronunciation coaching copy for ө, ү, ң.",
      sampleAnswer: "Ө. Ү. Ң.",
      methodistReviewStatus: "not_reviewed",
    },
    aiRoleplay: {
      id: "roleplay-letter-coach",
      scenarioId: "k0-letter-coach",
      title: text("Тамга машыгуусу", "Letter practice", "Практика букв"),
      level: "K0",
      situation: text("Мугалим тамга көрсөтөт.", "A teacher shows a letter.", "Учитель показывает букву."),
      userGoal: text("Тамганы айтып, сөздү оку.", "Say the letter and read the word.", "Назовите букву и прочитайте слово."),
      aiCharacter: text("Мугалим", "Teacher", "Учитель"),
      allowedVocabularyIds: ["ozon", "utuk", "tan"],
      allowedGrammarPointIds: ["letters-not-grammar"],
      allowedPhrases: ["Ө.", "Ү.", "Ң.", "Өзөн.", "Үтүк.", "Таң."],
      correctionStyle: "gentle_short",
      uncertaintyRules: [
        "Tag all pronunciation feedback for linguist review.",
        "Do not introduce unapproved phonetic explanations.",
      ],
      refusalRules: [
        "Do not claim speech evaluation is accurate.",
        "Redirect requests for detailed pronunciation to reviewed lesson material.",
      ],
      systemPromptPlaceholder:
        "Internal placeholder for future pronunciation roleplay. Avoid false certainty until phonology guidance is approved.",
      methodistReviewStatus: "not_reviewed",
    },
    review: {
      summary: text("Сен ө, ү, ң тамгаларын көрдүң.", "You saw the letters ө, ү, ң.", "Вы увидели буквы ө, ү, ң."),
      canDo: [
        text("Ө, ү, ң тамгаларын айырмалайм.", "I can tell ө, ү, ң apart.", "Я могу различать ө, ү, ң."),
        text("Кыска сөздөрдө бул тамгаларды табам.", "I can find these letters in short words.", "Я могу находить эти буквы в коротких словах."),
      ],
      reviewVocabularyIds: ["ozon", "utuk", "tan"],
      reviewGrammarPointIds: ["letters-not-grammar"],
      nextLessonId: "k1-u1-l1",
      methodologyRefs,
    },
  },
  {
    id: "k1-u1-l1",
    schemaVersion: "lesson-v2",
    levelId: "K1",
    unitId: "k1-u1",
    order: 1,
    lessonNumber: 1,
    stableLessonId: "k1-u1-l1",
    estimatedDurationMinutes: 10,
    prerequisites: ["k0-u1-l1"],
    supportedTracks,
    sampleNotice:
      "Sample/demo content only. Requires methodist and Kyrgyz linguist validation before learner-facing release.",
    validationTodos: [
      "TODO(linguist): validate pronoun choice, name-question phrasing, and register.",
      "TODO(methodist): confirm this belongs in K1 after K0 reading basics.",
    ],
    ...lifecycle(
      [
        "TODO(linguist): validate Aтым/Aтың examples and register.",
        "TODO(methodist): confirm K1 introduction lesson sequencing and vocabulary count.",
      ],
      ["Demo K1 lesson only. Introduction grammar and dialogue are not approved."],
    ),
    ...sourceMetadata(
      "A1-placeholder",
      "A1 internal placeholder",
      lessonSourceComponents,
      "Original demo K1 introduction lesson using HSK-inspired dialogue-before-grammar sequencing.",
    ),
    title: text("Таанышуу", "Introductions", "Знакомство"),
    subtitle: text("Атың ким?", "What is your name?", "Как тебя зовут?"),
    learningGoals: [
      text("Атым ... деп айтам.", "Say My name is ...", "Сказать Меня зовут ..."),
      text("Башка адамдын атын сурайм.", "Ask another person's name.", "Спросить имя другого человека."),
    ],
    targetSkills: ["speaking", "reading", "grammar", "vocabulary"] satisfies TargetSkill[],
    story: {
      title: text("Кафедеги таанышуу", "Meeting at a cafe", "Знакомство в кафе"),
      body: text(
        "Эки адам кафеден чай алып, аттарын сурашат.",
        "Two people buy tea at a cafe and ask each other's names.",
        "Два человека покупают чай в кафе и спрашивают имена.",
      ),
      contextTags: ["cafe", "introduction", "k1"],
      sampleNotice:
        "Demo story only. Requires methodist and linguist validation before release.",
      methodologyRefs,
      sourceNotes:
        "Original app-authored story card for K1 introductions; no external passage copied.",
      rightsNotes: demoRightsNotes,
      methodistReviewStatus: "not_reviewed",
    },
    vocabulary: [
      {
        id: "at",
        kyrgyz: "Ат",
        transliteration: "at",
        translations: translations("name", "имя"),
        example: {
          kyrgyz: "Атым Нур.",
          translations: translations("My name is Nur.", "Меня зовут Нур."),
        },
        audio: audioPlaceholder,
        tags: ["introduction", "k1"],
        ...vocabularySource("k1-u1-l1"),
      },
      {
        id: "men",
        kyrgyz: "Мен",
        transliteration: "men",
        translations: translations("I", "я"),
        example: {
          kyrgyz: "Мен Нур.",
          translations: translations("I am Nur.", "Я Нур."),
        },
        audio: audioPlaceholder,
        tags: ["pronoun", "k1"],
        ...vocabularySource("k1-u1-l1"),
      },
      {
        id: "kim",
        kyrgyz: "Ким",
        transliteration: "kim",
        translations: translations("who", "кто"),
        example: {
          kyrgyz: "Атың ким?",
          translations: translations("What is your name?", "Как тебя зовут?"),
        },
        audio: audioPlaceholder,
        tags: ["question", "k1"],
        ...vocabularySource("k1-u1-l1"),
      },
      {
        id: "chai",
        kyrgyz: "Чай",
        transliteration: "chai",
        translations: translations("tea", "чай"),
        example: {
          kyrgyz: "Мен чай алам.",
          translations: translations("I get tea.", "Я беру чай."),
        },
        audio: audioPlaceholder,
        tags: ["cafe", "k1"],
        ...vocabularySource("k1-u1-l1"),
      },
      {
        id: "senchi",
        kyrgyz: "Сенчи?",
        transliteration: "senchi?",
        translations: translations("and you?", "а ты?"),
        example: {
          kyrgyz: "Сенчи?",
          translations: translations("And you?", "А ты?"),
        },
        audio: audioPlaceholder,
        tags: ["question", "conversation"],
        ...vocabularySource("k1-u1-l1"),
      },
    ],
    dialogues: [
      {
        id: "dialogue-introductions",
        type: "dialogue",
        title: text("Атың ким?", "What is your name?", "Как тебя зовут?"),
        context: text("Кафеде", "At a cafe", "В кафе"),
        lines: [
          {
            id: "dialogue-introductions-1",
            speaker: "Нур",
            kyrgyz: "Салам. Атың ким?",
            transliteration: "Salam. Atyn kim?",
            translations: translations("Hello. What is your name?", "Привет. Как тебя зовут?"),
            audio: audioPlaceholder,
          },
          {
            id: "dialogue-introductions-2",
            speaker: "Элина",
            kyrgyz: "Атым Элина. Сенчи?",
            transliteration: "Atym Elina. Senchi?",
            translations: translations("My name is Elina. And you?", "Меня зовут Элина. А ты?"),
            audio: audioPlaceholder,
          },
          {
            id: "dialogue-introductions-3",
            speaker: "Нур",
            kyrgyz: "Атым Нур.",
            transliteration: "Atym Nur.",
            translations: translations("My name is Nur.", "Меня зовут Нур."),
            audio: audioPlaceholder,
          },
        ],
        breakdownItems: [
          {
            id: "breakdown-atym",
            phrase: "Атым ...",
            meaningByTrack: {
              RU_KY: "Фраза для называния своего имени.",
              EN_KY: "A phrase for saying your name.",
              KY_KY: "Өз атыңды айтуучу үлгү.",
            },
            linkedVocabularyIds: ["at"],
            linkedGrammarPointIds: ["sample-name-pattern"],
            ...breakdownSource(),
          },
          {
            id: "breakdown-atyn-kim",
            phrase: "Атың ким?",
            meaningByTrack: {
              RU_KY: "Вопрос: как тебя зовут?",
              EN_KY: "The question: what is your name?",
              KY_KY: "Атын сураган суроо.",
            },
            linkedVocabularyIds: ["at", "kim"],
            linkedGrammarPointIds: ["sample-name-pattern"],
            ...breakdownSource(),
          },
        ],
        linkedVocabularyIds: ["at", "men", "kim", "chai", "senchi"],
        linkedGrammarPointIds: ["sample-name-pattern"],
        audio: audioPlaceholder,
        ...originalInputSource(
          "Original K1 introduction dialogue drafted for the app; register and naturalness require review.",
        ),
      },
    ],
    texts: [
      {
        id: "reading-intro",
        type: "reading_text",
        title: text("Кыска текст", "Short text", "Короткий текст"),
        paragraphs: [
          {
            id: "reading-intro-p1",
            kyrgyz: "Салам. Атым Нур. Мен чай алам.",
            translations: translations("Hello. My name is Nur. I get tea.", "Привет. Меня зовут Нур. Я беру чай."),
            audio: audioPlaceholder,
          },
        ],
        breakdownItems: [
          {
            id: "breakdown-intro-reading",
            phrase: "Атым Нур.",
            meaningByTrack: {
              RU_KY: "Короткое представление: меня зовут Нур.",
              EN_KY: "A short introduction: my name is Nur.",
              KY_KY: "Кыска таанышуу: атым Нур.",
            },
            linkedVocabularyIds: ["at"],
            linkedGrammarPointIds: ["sample-name-pattern"],
            ...breakdownSource(),
          },
        ],
        linkedVocabularyIds: ["at", "men", "chai"],
        linkedGrammarPointIds: ["sample-name-pattern"],
        ...originalInputSource(
          "Original K1 short reading drafted for the app; all forms require methodist review.",
        ),
      },
    ],
    grammarPoints: [
      {
        id: "sample-name-pattern",
        title: text("Атым ...", "The pattern Atym ...", "Модель Атым ..."),
        level: "K1",
        explanationsByTrack: {
          RU_KY: "Атым ... используется, чтобы назвать свое имя. Это демо-объяснение нужно проверить.",
          EN_KY: "Atym ... is used to give your name. This demo explanation needs review.",
          KY_KY: "Атым ... үлгүсү өз атыңды айтууга колдонулат. Бул демо түшүндүрмө текшерилет.",
        },
        simpleRule: text(
          "Атым ... үлгүсү өз атыңды айтууга колдонулат.",
          "The pattern Atym ... is used to give your name.",
          "Модель Атым ... используется, чтобы назвать свое имя.",
        ),
        examples: [
          {
            id: "example-atym-elina",
            kyrgyz: "Атым Элина.",
            transliteration: "Atym Elina.",
            translations: translations("My name is Elina.", "Меня зовут Элина."),
            linkedVocabularyIds: ["at"],
          },
          {
            id: "example-atyn-kim",
            kyrgyz: "Атың ким?",
            transliteration: "Atyn kim?",
            translations: translations("What is your name?", "Как тебя зовут?"),
            linkedVocabularyIds: ["at", "kim"],
          },
        ],
        commonMistakes: [
          {
            id: "mistake-name-word-order",
            track: "EN_KY",
            incorrectPattern: "Менин атым is introduced before validation.",
            correction: "Use the approved lesson phrase only after review.",
            explanation: text(
              "Бул демо эскертүү гана.",
              "This is a demo caution only.",
              "Это только демо-предупреждение.",
            ),
          },
        ],
        microPracticePrompts: [
          {
            id: "micro-atym",
            prompt: text("Бош жерди толтур: ___ Нур.", "Fill the blank: ___ Nur.", "Заполните пропуск: ___ Нур."),
            answer: text("Атым", "Atym", "Атым"),
            feedback: text("Атым Нур.", "Atym Nur.", "Атым Нур."),
          },
        ],
        linkedExerciseIds: ["ex-name-pattern"],
        methodologyRefs,
        sourceNotes:
          "Original demo grammar point for K1 introductions; validate against Kyrgyz grammar references.",
        validationNotes:
          "TODO(linguist): validate possessive forms, question form, and beginner explanation.",
        validatedAgainst: pendingValidation,
        methodistReviewStatus: "not_reviewed",
      },
    ],
    exercises: [
      {
        id: "ex-name-pattern",
        kind: "fill_blank",
        prompt: text("Бош жерди толтур.", "Fill the blank.", "Заполните пропуск."),
        helperTextByTrack: {
          RU_KY: "Введите форму из урока.",
          EN_KY: "Type the lesson phrase.",
          KY_KY: "Сабактагы үлгүнү жаз.",
        },
        linkedVocabularyIds: ["at"],
        linkedGrammarPointIds: ["sample-name-pattern"],
        items: [
          {
            id: "item-atym",
            question: text("___ Элина.", "___ Elina.", "___ Элина."),
            correctAnswerData: { kind: "text", value: "Атым" },
            explanation: text("Атым Элина.", "Atym Elina.", "Атым Элина."),
            feedback: exerciseFeedback(),
          },
        ],
        hskInspiredComponent: ["workbook_exercise"],
        sourceNotes:
          "Original demo fill-blank item for the K1 name pattern. Requires methodist validation.",
        methodistReviewStatus: "not_reviewed",
      },
    ],
    miniGame: {
      id: "game-sentence-puzzle-intro",
      type: "sentence_puzzle",
      title: text("Сөз тартиби", "Word order", "Порядок слов"),
      description: text(
        "Сөздөрдү тизип, Атым Элина сүйлөмүн түз.",
        "Arrange words to build Atym Elina.",
        "Расставьте слова, чтобы получить Атым Элина.",
      ),
      config: {
        linkedVocabularyIds: ["at"],
        linkedGrammarPointIds: ["sample-name-pattern"],
        sourcePhraseIds: ["breakdown-atym"],
        targetSkill: "grammar",
        difficulty: "easy",
      },
      hskInspiredComponent: ["workbook_exercise", "writing_reconstruction_task"],
      methodistReviewStatus: "not_reviewed",
    },
    speakingPrompt: {
      id: "speak-my-name",
      title: text("Өз атыңды айт", "Say your name", "Назовите свое имя"),
      prompt: text("Атым ... деп айт.", "Say: My name is ...", "Скажите: Меня зовут ..."),
      expectedPhrases: ["Атым ...", "Атым Нур."],
      linkedVocabularyIds: ["at"],
      linkedGrammarPointIds: ["sample-name-pattern"],
      pronunciationFocus:
        "TODO(linguist): validate speaking prompt wording and pronunciation focus.",
      sampleAnswer: "Атым ...",
      methodistReviewStatus: "not_reviewed",
    },
    aiRoleplay: {
      id: "roleplay-cafe-intro",
      scenarioId: "k1-cafe-intro",
      title: text("Кафеде таанышуу", "Cafe introduction", "Знакомство в кафе"),
      level: "K1",
      situation: text(
        "Кафеде жаңы адам менен таанышасың.",
        "You meet someone new at a cafe.",
        "Вы знакомитесь с новым человеком в кафе.",
      ),
      userGoal: text("Саламдашып, атыңды айт.", "Greet them and say your name.", "Поздоровайтесь и назовите свое имя."),
      aiCharacter: text("Кафедеги адам", "Cafe guest", "Гость в кафе"),
      allowedVocabularyIds: ["at", "men", "kim", "chai", "senchi"],
      allowedGrammarPointIds: ["sample-name-pattern"],
      allowedPhrases: ["Салам.", "Атым ...", "Атың ким?", "Сенчи?"],
      correctionStyle: "gentle_short",
      uncertaintyRules: [
        "Tag any generated phrase outside allowed vocabulary for review.",
        "Avoid grammar explanations beyond the current name pattern.",
      ],
      refusalRules: [
        "Do not continue into unrelated cafe ordering beyond approved lesson content.",
        "Redirect requests for advanced grammar to future lessons.",
      ],
      systemPromptPlaceholder:
        "Internal placeholder for future constrained AI roleplay. Keep conversation inside approved K1 introduction vocabulary.",
      methodistReviewStatus: "not_reviewed",
    },
    review: {
      summary: text(
        "Сен ат сурап, өз атыңды айтууга даярдандың.",
        "You practiced asking and giving a name.",
        "Вы потренировались спрашивать и называть имя.",
      ),
      canDo: [
        text("Атым ... деп айта алам.", "I can say Atym ...", "Я могу сказать Атым ..."),
        text("Атың ким? деген суроону тааныйм.", "I can recognize Atyn kim?", "Я могу узнать вопрос Атың ким?"),
      ],
      reviewVocabularyIds: ["at", "kim", "senchi"],
      reviewGrammarPointIds: ["sample-name-pattern"],
      methodologyRefs,
    },
  },
] satisfies Lesson[];
