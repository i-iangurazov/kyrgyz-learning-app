import type { Lesson } from "@/content/schemas";

export const lessonSeedData = [
  {
    id: "k0-u1-l1",
    levelId: "K0",
    unitId: "k0-u1",
    order: 1,
    contentStatus: "demo",
    supportedTracks: ["en-ky", "ru-ky", "ky-ky"],
    title: {
      ky: "Кыргызча саламдашуу",
      en: "First Kyrgyz greetings",
      ru: "Первые кыргызские приветствия",
    },
    subtitle: {
      ky: "Салам, рахмат, жакшы",
      en: "Say hello, thank you, and good",
      ru: "Сказать привет, спасибо и хорошо",
    },
    sampleNotice:
      "Sample/demo content only. Requires methodist and Kyrgyz linguist validation before learner-facing release.",
    validationTodos: [
      "TODO(methodist): confirm K0 pacing and whether greetings should appear before full alphabet work.",
      "TODO(linguist): validate wording, register, transliteration, and translations.",
    ],
    objectives: [
      {
        ky: "Жөнөкөй саламдашууну тааныйм.",
        en: "Recognize simple greetings.",
        ru: "Узнавать простые приветствия.",
      },
      {
        ky: "Рахмат жана жакшы сөздөрүн колдоном.",
        en: "Use the words for thanks and good.",
        ru: "Использовать слова спасибо и хорошо.",
      },
    ],
    story: {
      title: {
        ky: "Биринчи жолугушуу",
        en: "A first meeting",
        ru: "Первая встреча",
      },
      body: {
        ky: "Айжан менен Тимур сабакта биринчи жолу саламдашат.",
        en: "Aijan and Timur greet each other for the first time in class.",
        ru: "Айжан и Тимур впервые здороваются на уроке.",
      },
    },
    vocabulary: [
      {
        id: "salam",
        kyrgyz: "Салам",
        transliteration: "salam",
        english: "hello",
        russian: "привет",
        tags: ["greeting"],
      },
      {
        id: "rahmat",
        kyrgyz: "Рахмат",
        transliteration: "rahmat",
        english: "thank you",
        russian: "спасибо",
        tags: ["polite"],
      },
      {
        id: "jakshy",
        kyrgyz: "Жакшы",
        transliteration: "jakshy",
        english: "good",
        russian: "хорошо",
        tags: ["response"],
      },
      {
        id: "sen",
        kyrgyz: "Сен",
        transliteration: "sen",
        english: "you",
        russian: "ты",
        notes: {
          ky: "Демо эскертүү: расмий/бейрасмий колдонулушу текшерилет.",
          en: "Demo note: formal and informal usage needs validation.",
          ru: "Демо-примечание: официальное и неофициальное употребление нужно проверить.",
        },
        tags: ["pronoun"],
      },
    ],
    dialogues: [
      {
        id: "dialogue-greeting",
        title: {
          ky: "Саламдашуу",
          en: "Greeting",
          ru: "Приветствие",
        },
        context: {
          ky: "Сабак башында",
          en: "At the start of class",
          ru: "В начале урока",
        },
        lines: [
          {
            speaker: "Айжан",
            kyrgyz: "Салам!",
            transliteration: "Salam!",
            english: "Hello!",
            russian: "Привет!",
          },
          {
            speaker: "Тимур",
            kyrgyz: "Салам! Жакшы?",
            transliteration: "Salam! Jakshy?",
            english: "Hello! Good?",
            russian: "Привет! Хорошо?",
          },
          {
            speaker: "Айжан",
            kyrgyz: "Жакшы, рахмат.",
            transliteration: "Jakshy, rahmat.",
            english: "Good, thank you.",
            russian: "Хорошо, спасибо.",
          },
        ],
      },
    ],
    texts: [
      {
        id: "reading-greeting",
        title: {
          ky: "Кыска окуу",
          en: "Short reading",
          ru: "Короткое чтение",
        },
        kyrgyz: "Салам. Мен жакшы. Рахмат.",
        english: "Hello. I am good. Thank you.",
        russian: "Привет. У меня хорошо. Спасибо.",
      },
    ],
    grammarPoints: [
      {
        id: "sample-short-replies",
        title: {
          ky: "Кыска жооптор",
          en: "Short replies",
          ru: "Короткие ответы",
        },
        explanation: {
          ky: "Саламдашууда кыска жооптор көп колдонулат.",
          en: "Short replies are common in greetings.",
          ru: "В приветствиях часто используются короткие ответы.",
        },
        examples: [
          {
            kyrgyz: "Жакшы, рахмат.",
            transliteration: "Jakshy, rahmat.",
            english: "Good, thank you.",
            russian: "Хорошо, спасибо.",
          },
        ],
        validationTodo:
          "TODO(linguist): verify the naturalness of abbreviated greeting responses for beginner teaching.",
      },
    ],
    exercises: [
      {
        id: "ex-greeting-match",
        type: "multiple-choice",
        prompt: {
          ky: "Маанисин танда.",
          en: "Choose the meaning.",
          ru: "Выберите значение.",
        },
        items: [
          {
            id: "item-rahmat",
            question: {
              ky: "Рахмат",
              en: "Рахмат",
              ru: "Рахмат",
            },
            answer: {
              ky: "ыраазычылык",
              en: "thank you",
              ru: "спасибо",
            },
            options: [
              {
                ky: "саламдашуу",
                en: "hello",
                ru: "привет",
              },
              {
                ky: "ыраазычылык",
                en: "thank you",
                ru: "спасибо",
              },
              {
                ky: "коштошуу",
                en: "goodbye",
                ru: "пока",
              },
            ],
          },
        ],
      },
    ],
    miniGame: {
      id: "game-greeting-quick-pick",
      type: "quick-pick",
      title: {
        ky: "Тез танда",
        en: "Quick pick",
        ru: "Быстрый выбор",
      },
      description: {
        ky: "Саламдашуу сөзүн 5 секунд ичинде тап.",
        en: "Find the greeting word within 5 seconds.",
        ru: "Найдите слово приветствия за 5 секунд.",
      },
      validationTodo: "TODO(methodist): confirm timing and distractor words for K0 learners.",
    },
    speakingPrompt: {
      id: "speak-first-hello",
      title: {
        ky: "Үн менен айт",
        en: "Say it aloud",
        ru: "Скажите вслух",
      },
      prompt: {
        ky: "Салам. Жакшы, рахмат.",
        en: "Say: Hello. Good, thank you.",
        ru: "Скажите: Привет. Хорошо, спасибо.",
      },
      sampleAnswer: "Салам. Жакшы, рахмат.",
      validationTodo: "TODO(linguist): add pronunciation guidance after validation.",
    },
    aiRoleplay: {
      id: "roleplay-class-greeting",
      scenario: {
        ky: "Сен биринчи сабакка келдиң.",
        en: "You arrive at your first class.",
        ru: "Вы пришли на первый урок.",
      },
      learnerGoal: {
        ky: "Мугалим менен саламдаш.",
        en: "Greet the teacher.",
        ru: "Поздоровайтесь с учителем.",
      },
      systemPromptPlaceholder:
        "AI roleplay placeholder: greet the learner with K0-safe Kyrgyz only after methodist validation.",
      validationTodo: "TODO(ai): define level-safe vocabulary and correction behavior.",
    },
    review: {
      summary: {
        ky: "Сен саламдашуу жана ыраазычылык сөздөрүн көрдүң.",
        en: "You saw greetings and thanks.",
        ru: "Вы увидели приветствия и благодарность.",
      },
      canDo: [
        {
          ky: "Салам деген сөздү тааныйм.",
          en: "I can recognize Salam.",
          ru: "Я могу узнать слово Салам.",
        },
        {
          ky: "Рахмат деген сөздү колдоном.",
          en: "I can use Rahmat.",
          ru: "Я могу использовать Рахмат.",
        },
      ],
    },
  },
  {
    id: "k0-u1-l2",
    levelId: "K0",
    unitId: "k0-u1",
    order: 2,
    contentStatus: "demo",
    supportedTracks: ["en-ky", "ru-ky", "ky-ky"],
    title: {
      ky: "Ө, Ү, Ң тамгалары",
      en: "The letters ө, ү, ң",
      ru: "Буквы ө, ү, ң",
    },
    subtitle: {
      ky: "Кыргыз тилиндеги өзгөчө үндөр",
      en: "Special Kyrgyz sounds",
      ru: "Особые кыргызские звуки",
    },
    sampleNotice:
      "Sample/demo content only. Requires methodist and Kyrgyz linguist validation before learner-facing release.",
    validationTodos: [
      "TODO(linguist): validate phonetic descriptions and transliteration strategy.",
      "TODO(methodist): confirm order of introducing ө, ү, ң in K0.",
    ],
    objectives: [
      {
        ky: "Ө, ү, ң тамгаларын көрүп тааныйм.",
        en: "Recognize the letters ө, ү, ң.",
        ru: "Узнавать буквы ө, ү, ң.",
      },
      {
        ky: "Кыска сөздөрдү окууга аракет кылам.",
        en: "Try reading short words.",
        ru: "Пробовать читать короткие слова.",
      },
    ],
    story: {
      title: {
        ky: "Үн карталары",
        en: "Sound cards",
        ru: "Карточки звуков",
      },
      body: {
        ky: "Бүгүн окуучу үч жаңы тамганы көрөт: ө, ү, ң.",
        en: "Today the learner sees three new letters: ө, ү, ң.",
        ru: "Сегодня ученик видит три новые буквы: ө, ү, ң.",
      },
    },
    vocabulary: [
      {
        id: "ozon",
        kyrgyz: "Өзөн",
        transliteration: "ozon",
        english: "stream",
        russian: "ручей",
        tags: ["letter-o-special"],
      },
      {
        id: "ut",
        kyrgyz: "Үтүк",
        transliteration: "utuk",
        english: "iron",
        russian: "утюг",
        tags: ["letter-u-special"],
      },
      {
        id: "tan",
        kyrgyz: "Таң",
        transliteration: "tang",
        english: "dawn",
        russian: "рассвет",
        tags: ["letter-ng"],
      },
    ],
    dialogues: [
      {
        id: "dialogue-sound-check",
        title: {
          ky: "Үндү текшерүү",
          en: "Sound check",
          ru: "Проверка звука",
        },
        lines: [
          {
            speaker: "Мугалим",
            kyrgyz: "Бул ө.",
            transliteration: "Bul o.",
            english: "This is ө.",
            russian: "Это ө.",
          },
          {
            speaker: "Окуучу",
            kyrgyz: "Ө.",
            transliteration: "O.",
            english: "Ө.",
            russian: "Ө.",
          },
          {
            speaker: "Мугалим",
            kyrgyz: "Бул ң.",
            transliteration: "Bul ng.",
            english: "This is ң.",
            russian: "Это ң.",
          },
        ],
      },
    ],
    texts: [
      {
        id: "reading-special-letters",
        title: {
          ky: "Окуу",
          en: "Reading",
          ru: "Чтение",
        },
        kyrgyz: "Өзөн. Үтүк. Таң.",
        english: "Stream. Iron. Dawn.",
        russian: "Ручей. Утюг. Рассвет.",
      },
    ],
    grammarPoints: [
      {
        id: "letters-not-grammar",
        title: {
          ky: "Тамга жана үн",
          en: "Letter and sound",
          ru: "Буква и звук",
        },
        explanation: {
          ky: "Бул сабак грамматика эмес, окуу көндүмүнө даярдык.",
          en: "This lesson prepares reading skill before heavier grammar.",
          ru: "Этот урок готовит навык чтения перед более сложной грамматикой.",
        },
        examples: [
          {
            kyrgyz: "ө - өзөн",
            transliteration: "o - ozon",
            english: "ө as in өзөн",
            russian: "ө как в слове өзөн",
          },
        ],
        validationTodo:
          "TODO(linguist): replace placeholder transliteration with approved pronunciation notation.",
      },
    ],
    exercises: [
      {
        id: "ex-letter-pick",
        type: "multiple-choice",
        prompt: {
          ky: "Кайсы сөздө ң бар?",
          en: "Which word has ң?",
          ru: "В каком слове есть ң?",
        },
        items: [
          {
            id: "item-ng",
            question: {
              ky: "ң тамгасын тап",
              en: "Find the letter ң",
              ru: "Найдите букву ң",
            },
            answer: {
              ky: "Таң",
              en: "Таң",
              ru: "Таң",
            },
            options: [
              {
                ky: "Өзөн",
                en: "Өзөн",
                ru: "Өзөн",
              },
              {
                ky: "Үтүк",
                en: "Үтүк",
                ru: "Үтүк",
              },
              {
                ky: "Таң",
                en: "Таң",
                ru: "Таң",
              },
            ],
          },
        ],
      },
    ],
    miniGame: {
      id: "game-sound-match",
      type: "sound-match",
      title: {
        ky: "Үн менен тамга",
        en: "Sound and letter",
        ru: "Звук и буква",
      },
      description: {
        ky: "Аудио кийин кошулат. Азырынча тамганы сөз менен дал келтир.",
        en: "Audio will be added later. For now, match the letter to the word.",
        ru: "Аудио будет добавлено позже. Пока сопоставьте букву со словом.",
      },
      validationTodo: "TODO(audio): record native-speaker audio before production use.",
    },
    speakingPrompt: {
      id: "speak-special-letters",
      title: {
        ky: "Тамгаларды айт",
        en: "Say the letters",
        ru: "Произнесите буквы",
      },
      prompt: {
        ky: "Ө, ү, ң тамгаларын жай айт.",
        en: "Say ө, ү, ң slowly.",
        ru: "Медленно произнесите ө, ү, ң.",
      },
      sampleAnswer: "Ө. Ү. Ң.",
      validationTodo: "TODO(linguist): add safe pronunciation coaching copy.",
    },
    aiRoleplay: {
      id: "roleplay-letter-coach",
      scenario: {
        ky: "Мугалим тамга көрсөтөт.",
        en: "A teacher shows a letter.",
        ru: "Учитель показывает букву.",
      },
      learnerGoal: {
        ky: "Тамганы айтып, сөздү оку.",
        en: "Say the letter and read the word.",
        ru: "Назовите букву и прочитайте слово.",
      },
      systemPromptPlaceholder:
        "AI roleplay placeholder: act as a pronunciation coach only after approved phonology guidance exists.",
      validationTodo: "TODO(ai): define pronunciation feedback limits and avoid false certainty.",
    },
    review: {
      summary: {
        ky: "Сен ө, ү, ң тамгаларын көрдүң.",
        en: "You saw the letters ө, ү, ң.",
        ru: "Вы увидели буквы ө, ү, ң.",
      },
      canDo: [
        {
          ky: "Ө, ү, ң тамгаларын айырмалайм.",
          en: "I can tell ө, ү, ң apart.",
          ru: "Я могу различать ө, ү, ң.",
        },
        {
          ky: "Кыска сөздөрдө бул тамгаларды табам.",
          en: "I can find these letters in short words.",
          ru: "Я могу находить эти буквы в коротких словах.",
        },
      ],
    },
  },
  {
    id: "k1-u1-l1",
    levelId: "K1",
    unitId: "k1-u1",
    order: 1,
    contentStatus: "demo",
    supportedTracks: ["en-ky", "ru-ky", "ky-ky"],
    title: {
      ky: "Таанышуу",
      en: "Introductions",
      ru: "Знакомство",
    },
    subtitle: {
      ky: "Атың ким?",
      en: "What is your name?",
      ru: "Как тебя зовут?",
    },
    sampleNotice:
      "Sample/demo content only. Requires methodist and Kyrgyz linguist validation before learner-facing release.",
    validationTodos: [
      "TODO(linguist): validate pronoun choice, name-question phrasing, and register.",
      "TODO(methodist): confirm this belongs in K1 after K0 reading basics.",
    ],
    objectives: [
      {
        ky: "Атым ... деп айтам.",
        en: "Say My name is ...",
        ru: "Сказать Меня зовут ...",
      },
      {
        ky: "Башка адамдын атын сурайм.",
        en: "Ask another person's name.",
        ru: "Спросить имя другого человека.",
      },
    ],
    story: {
      title: {
        ky: "Кафедеги таанышуу",
        en: "Meeting at a cafe",
        ru: "Знакомство в кафе",
      },
      body: {
        ky: "Эки адам кафеден чай алып, аттарын сурашат.",
        en: "Two people buy tea at a cafe and ask each other's names.",
        ru: "Два человека покупают чай в кафе и спрашивают имена.",
      },
    },
    vocabulary: [
      {
        id: "at",
        kyrgyz: "Ат",
        transliteration: "at",
        english: "name",
        russian: "имя",
        tags: ["introduction"],
      },
      {
        id: "men",
        kyrgyz: "Мен",
        transliteration: "men",
        english: "I",
        russian: "я",
        tags: ["pronoun"],
      },
      {
        id: "kim",
        kyrgyz: "Ким",
        transliteration: "kim",
        english: "who",
        russian: "кто",
        tags: ["question"],
      },
      {
        id: "chai",
        kyrgyz: "Чай",
        transliteration: "chai",
        english: "tea",
        russian: "чай",
        tags: ["cafe"],
      },
    ],
    dialogues: [
      {
        id: "dialogue-introductions",
        title: {
          ky: "Атың ким?",
          en: "What is your name?",
          ru: "Как тебя зовут?",
        },
        context: {
          ky: "Кафеде",
          en: "At a cafe",
          ru: "В кафе",
        },
        lines: [
          {
            speaker: "Нур",
            kyrgyz: "Салам. Атың ким?",
            transliteration: "Salam. Atyn kim?",
            english: "Hello. What is your name?",
            russian: "Привет. Как тебя зовут?",
          },
          {
            speaker: "Элина",
            kyrgyz: "Атым Элина. Сенчи?",
            transliteration: "Atym Elina. Senchi?",
            english: "My name is Elina. And you?",
            russian: "Меня зовут Элина. А ты?",
          },
          {
            speaker: "Нур",
            kyrgyz: "Атым Нур.",
            transliteration: "Atym Nur.",
            english: "My name is Nur.",
            russian: "Меня зовут Нур.",
          },
        ],
      },
    ],
    texts: [
      {
        id: "reading-intro",
        title: {
          ky: "Кыска текст",
          en: "Short text",
          ru: "Короткий текст",
        },
        kyrgyz: "Салам. Атым Нур. Мен чай алам.",
        english: "Hello. My name is Nur. I get tea.",
        russian: "Привет. Меня зовут Нур. Я беру чай.",
      },
    ],
    grammarPoints: [
      {
        id: "sample-name-pattern",
        title: {
          ky: "Атым ...",
          en: "The pattern Atym ...",
          ru: "Модель Атым ...",
        },
        explanation: {
          ky: "Атым ... үлгүсү өз атыңды айтууга колдонулат.",
          en: "The pattern Atym ... is used to give your name.",
          ru: "Модель Атым ... используется, чтобы назвать свое имя.",
        },
        examples: [
          {
            kyrgyz: "Атым Элина.",
            transliteration: "Atym Elina.",
            english: "My name is Elina.",
            russian: "Меня зовут Элина.",
          },
          {
            kyrgyz: "Атың ким?",
            transliteration: "Atyn kim?",
            english: "What is your name?",
            russian: "Как тебя зовут?",
          },
        ],
        validationTodo:
          "TODO(linguist): validate possessive forms, question form, and beginner explanation.",
      },
    ],
    exercises: [
      {
        id: "ex-name-pattern",
        type: "fill-blank",
        prompt: {
          ky: "Бош жерди толтур.",
          en: "Fill the blank.",
          ru: "Заполните пропуск.",
        },
        items: [
          {
            id: "item-atym",
            question: {
              ky: "___ Элина.",
              en: "___ Elina.",
              ru: "___ Элина.",
            },
            answer: {
              ky: "Атым",
              en: "Atym",
              ru: "Атым",
            },
          },
        ],
      },
    ],
    miniGame: {
      id: "game-word-order-intro",
      type: "word-order",
      title: {
        ky: "Сөз тартиби",
        en: "Word order",
        ru: "Порядок слов",
      },
      description: {
        ky: "Сөздөрдү тизип, Атым Элина сүйлөмүн түз.",
        en: "Arrange words to build Atym Elina.",
        ru: "Расставьте слова, чтобы получить Атым Элина.",
      },
      validationTodo: "TODO(methodist): confirm if word-order games are useful at early K1.",
    },
    speakingPrompt: {
      id: "speak-my-name",
      title: {
        ky: "Өз атыңды айт",
        en: "Say your name",
        ru: "Назовите свое имя",
      },
      prompt: {
        ky: "Атым ... деп айт.",
        en: "Say: My name is ...",
        ru: "Скажите: Меня зовут ...",
      },
      sampleAnswer: "Атым ...",
      validationTodo: "TODO(linguist): validate speaking prompt wording.",
    },
    aiRoleplay: {
      id: "roleplay-cafe-intro",
      scenario: {
        ky: "Кафеде жаңы адам менен таанышасың.",
        en: "You meet someone new at a cafe.",
        ru: "Вы знакомитесь с новым человеком в кафе.",
      },
      learnerGoal: {
        ky: "Саламдашып, атыңды айт.",
        en: "Greet them and say your name.",
        ru: "Поздоровайтесь и назовите свое имя.",
      },
      systemPromptPlaceholder:
        "AI roleplay placeholder: keep conversation inside approved K1 introduction and cafe vocabulary.",
      validationTodo: "TODO(ai): add safety, correction, and language-level rubric.",
    },
    review: {
      summary: {
        ky: "Сен ат сурап, өз атыңды айтууга даярдандың.",
        en: "You practiced asking and giving a name.",
        ru: "Вы потренировались спрашивать и называть имя.",
      },
      canDo: [
        {
          ky: "Атым ... деп айта алам.",
          en: "I can say Atym ...",
          ru: "Я могу сказать Атым ...",
        },
        {
          ky: "Атың ким? деген суроону тааныйм.",
          en: "I can recognize Atyn kim?",
          ru: "Я могу узнать вопрос Атың ким?",
        },
      ],
    },
  },
] satisfies Lesson[];
