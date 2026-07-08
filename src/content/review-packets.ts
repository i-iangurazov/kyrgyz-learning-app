import type { AudioAsset, Lesson, LocalizedText } from "@/content/schemas";

export type ReviewPacketCounts = {
  lessonsExported: number;
  vocabularyItems: number;
  dialogueLines: number;
  readingParagraphs: number;
  grammarPoints: number;
  exercises: number;
  audioTranscriptRefs: number;
};

export type ReviewPacketJson = {
  lessonId: string;
  levelId: Lesson["levelId"];
  unitId: string;
  title: LocalizedText;
  currentStatus: "prototype / not methodist reviewed";
  backlogStatus: ReviewBacklogStatus;
  priority: ReviewPriority;
  learningGoals: LocalizedText[];
  vocabulary: Lesson["vocabulary"];
  dialogues: Lesson["dialogues"];
  readingTexts: Lesson["texts"];
  grammarPoints: Lesson["grammarPoints"];
  exercises: Lesson["exercises"];
  audioRefs: ReviewAudioRef[];
  decision: {
    status: "not_selected";
    reviewerName: "";
    reviewDate: "";
    summaryNotes: "";
    requiredFixes: "";
  };
};

export type ReviewPacketFile = {
  lessonId: string;
  filename: string;
  markdown: string;
  json: ReviewPacketJson;
};

export type ReviewPacketExport = {
  readmeMarkdown: string;
  packets: ReviewPacketFile[];
  counts: ReviewPacketCounts;
};

type ReviewBacklogStatus =
  | "not_reviewed"
  | "needs_methodist_review"
  | "needs_revision"
  | "approved_for_beta"
  | "approved_for_production";

type ReviewPriority = "P0" | "P1" | "P2";

type LessonReviewMetadata = {
  backlogStatus: ReviewBacklogStatus;
  priority: ReviewPriority;
  focus: string;
};

export type ReviewAudioRef = {
  id: string;
  sourceType:
    | "vocabulary"
    | "dialogue"
    | "dialogue_line"
    | "reading_paragraph"
    | "exercise_item";
  sourceId: string;
  transcript: string;
  reviewStatus: string;
  voiceType: string;
  speakerLabel?: string;
};

const lessonReviewMetadata: Record<string, LessonReviewMetadata> = {
  "k0-u1-l1": {
    backlogStatus: "needs_methodist_review",
    priority: "P0",
    focus: "first greetings and short polite replies",
  },
  "k0-u1-l2": {
    backlogStatus: "needs_methodist_review",
    priority: "P0",
    focus: "recognizing special Kyrgyz letters ө, ү, ң",
  },
  "k1-u1-l1": {
    backlogStatus: "needs_methodist_review",
    priority: "P0",
    focus: "introductions, asking a name, saying a name",
  },
};

export function buildMethodistReviewPacketExport(
  lessons: Lesson[],
): ReviewPacketExport {
  const sortedLessons = [...lessons].sort((a, b) =>
    a.id.localeCompare(b.id, "en"),
  );
  const packets = sortedLessons.map(buildMethodistReviewPacket);
  const counts = countReviewPacketContent(sortedLessons);

  return {
    readmeMarkdown: buildReviewPacketsReadme(sortedLessons, counts),
    packets,
    counts,
  };
}

export function buildMethodistReviewPacket(lesson: Lesson): ReviewPacketFile {
  const metadata = getLessonReviewMetadata(lesson.id);
  const audioRefs = collectLessonAudioRefs(lesson);
  const json: ReviewPacketJson = {
    lessonId: lesson.id,
    levelId: lesson.levelId,
    unitId: lesson.unitId,
    title: lesson.title,
    currentStatus: "prototype / not methodist reviewed",
    backlogStatus: metadata.backlogStatus,
    priority: metadata.priority,
    learningGoals: lesson.learningGoals,
    vocabulary: lesson.vocabulary,
    dialogues: lesson.dialogues,
    readingTexts: lesson.texts,
    grammarPoints: lesson.grammarPoints,
    exercises: lesson.exercises,
    audioRefs,
    decision: {
      status: "not_selected",
      reviewerName: "",
      reviewDate: "",
      summaryNotes: "",
      requiredFixes: "",
    },
  };

  return {
    lessonId: lesson.id,
    filename: `${lesson.id}.md`,
    markdown: buildLessonMarkdown(lesson, metadata, audioRefs),
    json,
  };
}

export function collectLessonAudioRefs(lesson: Lesson): ReviewAudioRef[] {
  const refs: ReviewAudioRef[] = [];
  const seenAudioIds = new Set<string>();

  for (const vocabularyItem of lesson.vocabulary) {
    addAudioRef(refs, seenAudioIds, {
      sourceType: "vocabulary",
      sourceId: vocabularyItem.id,
      audio: vocabularyItem.audio,
    });
  }

  for (const dialogue of lesson.dialogues) {
    addAudioRef(refs, seenAudioIds, {
      sourceType: "dialogue",
      sourceId: dialogue.id,
      audio: dialogue.audio,
    });

    for (const line of dialogue.lines) {
      addAudioRef(refs, seenAudioIds, {
        sourceType: "dialogue_line",
        sourceId: line.id,
        audio: line.audio,
      });
    }
  }

  for (const readingText of lesson.texts) {
    for (const paragraph of readingText.paragraphs) {
      addAudioRef(refs, seenAudioIds, {
        sourceType: "reading_paragraph",
        sourceId: paragraph.id,
        audio: paragraph.audio,
      });
    }
  }

  for (const exercise of lesson.exercises) {
    for (const item of exercise.items) {
      addAudioRef(refs, seenAudioIds, {
        sourceType: "exercise_item",
        sourceId: item.id,
        audio: item.audio,
      });
    }
  }

  return refs;
}

function buildReviewPacketsReadme(
  lessons: Lesson[],
  counts: ReviewPacketCounts,
) {
  const packetLinks = lessons
    .map((lesson) => {
      const metadata = getLessonReviewMetadata(lesson.id);
      return `- [${lesson.id}](./${lesson.id}.md): ${lesson.levelId} / ${lesson.unitId}, ${metadata.priority}, ${textValue(lesson.title, "ru")} / ${lesson.title.ky}`;
    })
    .join("\n");

  return [
    "# Methodist Review Packets",
    "",
    "These packets export the current K0/K1 seed lessons into reviewer-friendly Markdown. They are for methodist/linguist review only.",
    "",
    "Important:",
    "",
    "- Current seed lessons are prototype samples, not final curriculum.",
    "- Do not approve content by editing these generated packets alone.",
    "- Apply reviewer feedback to seed/DB content only in a later explicit revision task.",
    "- Do not copy protected textbook or literary content into revisions unless licensed.",
    "- TTS or placeholder audio must be reviewed by a Kyrgyz speaker before beta use.",
    "",
    "## How To Regenerate",
    "",
    "Run:",
    "",
    "```bash",
    "pnpm content:review-packets",
    "```",
    "",
    "The command writes Markdown packets to `docs/review-packets/` and reviewer JSON to ignored `test-results/review-packets/`.",
    "",
    "## Current Export Counts",
    "",
    `- Lessons exported: ${counts.lessonsExported}`,
    `- Vocabulary items: ${counts.vocabularyItems}`,
    `- Dialogue lines: ${counts.dialogueLines}`,
    `- Reading paragraphs: ${counts.readingParagraphs}`,
    `- Grammar points: ${counts.grammarPoints}`,
    `- Exercises: ${counts.exercises}`,
    `- Audio transcript refs: ${counts.audioTranscriptRefs}`,
    "",
    "## Lesson Packets",
    "",
    packetLinks,
    "",
    "## Review Workflow",
    "",
    "1. Reviewer opens the relevant lesson packet.",
    "2. Reviewer checks Kyrgyz accuracy, naturalness, grammar, translations, exercises, level fit, and audio transcript needs.",
    "3. Reviewer fills the decision block or returns comments externally.",
    "4. Product/content owner creates a separate revision task.",
    "5. Seed or DB content is updated only after the explicit revision task.",
    "6. Content remains prototype/not reviewed until the source data is updated and validation status changes.",
    "",
  ].join("\n");
}

function buildLessonMarkdown(
  lesson: Lesson,
  metadata: LessonReviewMetadata,
  audioRefs: ReviewAudioRef[],
) {
  return [
    `# Review Packet: ${lesson.id}`,
    "",
    "## 1. Header",
    "",
    `- Lesson ID: \`${lesson.id}\``,
    `- Level/unit: ${lesson.levelId} / \`${lesson.unitId}\``,
    `- Lesson number: ${lesson.lessonNumber}`,
    `- Lesson title: ${textValue(lesson.title, "ru")} / ${lesson.title.ky}`,
    "- Current status: prototype / not methodist reviewed",
    `- Backlog status: \`${metadata.backlogStatus}\``,
    `- Priority: ${metadata.priority}`,
    `- Lesson focus: ${metadata.focus}`,
    "- Warning: this is not final curriculum and must not be published until reviewed.",
    "",
    "## 2. Learning Goals",
    "",
    ...lesson.learningGoals.flatMap((goal, index) => [
      `### Goal ${index + 1}`,
      "",
      formatLocalizedText(goal),
      "",
    ]),
    reviewerChecklist([
      "Are goals level-appropriate?",
      "Are goals useful for the target learner?",
      "Do goals match the lesson content and practice?",
      "Notes:",
    ]),
    "",
    "## 3. Vocabulary Review",
    "",
    ...lesson.vocabulary.flatMap((item) => [
      `### \`${item.id}\`: ${item.kyrgyz}`,
      "",
      `- Kyrgyz word: ${item.kyrgyz}`,
      `- Transliteration: ${item.transliteration ?? "_not provided_"}`,
      `- RU translation: ${item.translations.ru}`,
      `- EN translation: ${item.translations.en}`,
      `- Example: ${item.example.kyrgyz}`,
      `- Example RU: ${item.example.translations.ru}`,
      `- Example EN: ${item.example.translations.en}`,
      `- Linked audio ID: \`${item.audio.id}\``,
      "",
      reviewerChecklist([
        "Correct?",
        "Natural?",
        "Level-appropriate?",
        "Translation accurate?",
        "Notes:",
      ]),
      "",
    ]),
    "## 4. Dialogue Review",
    "",
    ...lesson.dialogues.flatMap((dialogue) => [
      `### Dialogue \`${dialogue.id}\`: ${textValue(dialogue.title, "ru")}`,
      "",
      dialogue.context ? formatLocalizedText(dialogue.context) : "_No context._",
      "",
      ...dialogue.lines.flatMap((line) => [
        `#### Line \`${line.id}\``,
        "",
        `- Speaker: ${line.speaker}`,
        `- Kyrgyz text: ${line.kyrgyz}`,
        `- RU translation: ${line.translations.ru}`,
        `- EN translation: ${line.translations.en}`,
        `- Audio ID: \`${line.audio.id}\``,
        "",
        reviewerChecklist([
          "Natural spoken Kyrgyz?",
          "Correct grammar?",
          "Appropriate tone?",
          "Translation accurate?",
          "Notes:",
        ]),
        "",
      ]),
    ]),
    "## 5. Reading Text Review",
    "",
    ...(lesson.texts.length > 0
      ? lesson.texts.flatMap((text) => [
          `### Reading \`${text.id}\`: ${textValue(text.title, "ru")}`,
          "",
          ...text.paragraphs.flatMap((paragraph) => [
            `#### Paragraph \`${paragraph.id}\``,
            "",
            `- Kyrgyz text: ${paragraph.kyrgyz}`,
            `- RU translation: ${paragraph.translations.ru}`,
            `- EN translation: ${paragraph.translations.en}`,
            `- Audio ID: \`${paragraph.audio.id}\``,
            "",
            reviewerChecklist([
              "Natural?",
              "Level-appropriate?",
              "Too artificial?",
              "Notes:",
            ]),
            "",
          ]),
        ])
      : ["_No reading text in this lesson._", ""]),
    "## 6. Grammar Review",
    "",
    ...lesson.grammarPoints.flatMap((grammarPoint) => [
      `### \`${grammarPoint.id}\`: ${textValue(grammarPoint.title, "ru")}`,
      "",
      "- Current explanation:",
      `  - RU_KY: ${grammarPoint.explanationsByTrack.RU_KY}`,
      `  - EN_KY: ${grammarPoint.explanationsByTrack.EN_KY}`,
      `  - KY_KY: ${grammarPoint.explanationsByTrack.KY_KY}`,
      "- Simple rule:",
      indentMarkdown(formatLocalizedText(grammarPoint.simpleRule)),
      "",
      "#### Examples",
      "",
      ...grammarPoint.examples.flatMap((example) => [
        `- \`${example.id}\`: ${example.kyrgyz}`,
        `  - RU: ${example.translations.ru}`,
        `  - EN: ${example.translations.en}`,
      ]),
      "",
      "#### Common Mistakes",
      "",
      ...(grammarPoint.commonMistakes.length > 0
        ? grammarPoint.commonMistakes.flatMap((mistake) => [
            `- \`${mistake.id}\` (${mistake.track})`,
            `  - Incorrect pattern: ${mistake.incorrectPattern}`,
            `  - Correction: ${mistake.correction}`,
            `  - Explanation: ${textValue(mistake.explanation, "ru")}`,
          ])
        : ["_No common mistakes recorded._"]),
      "",
      "#### Micro-Practice",
      "",
      ...(grammarPoint.microPracticePrompts.length > 0
        ? grammarPoint.microPracticePrompts.flatMap((prompt) => [
            `- \`${prompt.id}\`: ${textValue(prompt.prompt, "ru")}`,
            `  - Answer: ${textValue(prompt.answer, "ru")}`,
            `  - Feedback: ${textValue(prompt.feedback, "ru")}`,
          ])
        : ["_No micro-practice recorded._"]),
      "",
      reviewerChecklist([
        "Rule accurate?",
        "Explanation clear for RU learner?",
        "Examples correct?",
        "Better explanation suggestion?",
        "Notes:",
      ]),
      "",
    ]),
    "## 7. Exercise Review",
    "",
    ...lesson.exercises.flatMap((exercise) => [
      `### Exercise \`${exercise.id}\``,
      "",
      `- Kind: \`${exercise.kind}\``,
      `- Prompt RU: ${textValue(exercise.prompt, "ru")}`,
      `- Prompt KY: ${exercise.prompt.ky}`,
      `- Linked vocabulary IDs: ${formatInlineCodeList(exercise.linkedVocabularyIds)}`,
      `- Linked grammar IDs: ${formatInlineCodeList(exercise.linkedGrammarPointIds)}`,
      "",
      ...exercise.items.flatMap((item) => [
        `#### Item \`${item.id}\``,
        "",
        `- Question RU: ${textValue(item.question, "ru")}`,
        `- Question KY: ${item.question.ky}`,
        "",
        ...(item.options && item.options.length > 0
          ? [
              "Options:",
              "",
              ...item.options.map(
                (option) =>
                  `- \`${option.id}\`: ${textValue(option.text, "ru")} / ${option.text.ky}`,
              ),
              "",
            ]
          : []),
        "Correct answer data:",
        "",
        fencedJson(item.correctAnswerData),
        "",
        "- Feedback/explanation:",
        `  - Explanation RU: ${textValue(item.explanation, "ru")}`,
        `  - Explanation KY: ${item.explanation.ky}`,
        `  - Correct feedback RU: ${textValue(item.feedback.correct, "ru")}`,
        `  - Incorrect feedback RU: ${textValue(item.feedback.incorrect, "ru")}`,
        `  - Hint RU: ${textValue(item.feedback.hint, "ru")}`,
        "",
      ]),
      reviewerChecklist([
        "Correct answer correct?",
        "Distractors reasonable?",
        "Feedback helpful?",
        "Level-appropriate?",
        "Notes:",
      ]),
      "",
    ]),
    "## 8. Audio/TTS Review",
    "",
    ...audioRefs.flatMap((audioRef) => [
      `### Audio \`${audioRef.id}\``,
      "",
      `- Source type: ${audioRef.sourceType}`,
      `- Source ID: \`${audioRef.sourceId}\``,
      `- Transcript: ${audioRef.transcript}`,
      `- Voice type: ${audioRef.voiceType}`,
      `- Review status: ${audioRef.reviewStatus}`,
      ...(audioRef.speakerLabel ? [`- Speaker label: ${audioRef.speakerLabel}`] : []),
      "",
      reviewerChecklist([
        "Pronunciation acceptable?",
        "Stress/accent natural?",
        "TTS usable for MVP?",
        "Should be re-recorded by human speaker?",
        "Notes:",
      ]),
      "",
    ]),
    "## Additional Lesson Flow Items",
    "",
    "These sections are placeholders or future-facing lesson flow items. Review only for language, level fit, and safety; do not treat them as implemented production features.",
    "",
    "### Mini-game",
    "",
    `- ID: \`${lesson.miniGame.id}\``,
    `- Type: \`${lesson.miniGame.type}\``,
    `- Title RU: ${textValue(lesson.miniGame.title, "ru")}`,
    `- Description RU: ${textValue(lesson.miniGame.description, "ru")}`,
    "",
    "### Speaking Prompt",
    "",
    `- ID: \`${lesson.speakingPrompt.id}\``,
    `- Prompt RU: ${textValue(lesson.speakingPrompt.prompt, "ru")}`,
    `- Prompt KY: ${lesson.speakingPrompt.prompt.ky}`,
    `- Expected phrases: ${lesson.speakingPrompt.expectedPhrases.map((phrase) => `\`${phrase}\``).join(", ")}`,
    `- Pronunciation focus: ${lesson.speakingPrompt.pronunciationFocus}`,
    "",
    "### AI Roleplay Placeholder",
    "",
    `- ID: \`${lesson.aiRoleplay.id}\``,
    `- Situation RU: ${textValue(lesson.aiRoleplay.situation, "ru")}`,
    `- User goal RU: ${textValue(lesson.aiRoleplay.userGoal, "ru")}`,
    `- Allowed phrases: ${lesson.aiRoleplay.allowedPhrases.map((phrase) => `\`${phrase}\``).join(", ")}`,
    "",
    "## 9. Overall Review Decision",
    "",
    "- Status:",
    "  - [ ] not_reviewed",
    "  - [ ] needs_revision",
    "  - [ ] approved_for_beta",
    "  - [ ] approved_for_production",
    "- Reviewer name:",
    "- Review date:",
    "- Summary notes:",
    "- Required fixes:",
    "",
  ].join("\n");
}

function countReviewPacketContent(lessons: Lesson[]): ReviewPacketCounts {
  return {
    lessonsExported: lessons.length,
    vocabularyItems: lessons.reduce(
      (total, lesson) => total + lesson.vocabulary.length,
      0,
    ),
    dialogueLines: lessons.reduce(
      (total, lesson) =>
        total +
        lesson.dialogues.reduce(
          (dialogueTotal, dialogue) => dialogueTotal + dialogue.lines.length,
          0,
        ),
      0,
    ),
    readingParagraphs: lessons.reduce(
      (total, lesson) =>
        total +
        lesson.texts.reduce(
          (textTotal, text) => textTotal + text.paragraphs.length,
          0,
        ),
      0,
    ),
    grammarPoints: lessons.reduce(
      (total, lesson) => total + lesson.grammarPoints.length,
      0,
    ),
    exercises: lessons.reduce(
      (total, lesson) => total + lesson.exercises.length,
      0,
    ),
    audioTranscriptRefs: lessons.reduce(
      (total, lesson) => total + collectLessonAudioRefs(lesson).length,
      0,
    ),
  };
}

function getLessonReviewMetadata(lessonId: string): LessonReviewMetadata {
  return (
    lessonReviewMetadata[lessonId] ?? {
      backlogStatus: "not_reviewed",
      priority: "P1",
      focus: "review required",
    }
  );
}

function addAudioRef(
  refs: ReviewAudioRef[],
  seenAudioIds: Set<string>,
  {
    sourceType,
    sourceId,
    audio,
  }: {
    sourceType: ReviewAudioRef["sourceType"];
    sourceId: string;
    audio?: AudioAsset;
  },
) {
  if (!audio || seenAudioIds.has(audio.id)) {
    return;
  }

  seenAudioIds.add(audio.id);
  refs.push({
    id: audio.id,
    sourceType,
    sourceId,
    transcript: audio.transcript,
    reviewStatus: audio.audioReviewStatus,
    voiceType: audio.voiceType,
    ...(audio.speakerLabel ? { speakerLabel: audio.speakerLabel } : {}),
  });
}

function textValue(text: LocalizedText, language: "ru" | "en" | "ky") {
  return text[language] ?? text.ky;
}

function formatLocalizedText(text: LocalizedText) {
  return [
    `- KY: ${text.ky}`,
    `- RU: ${text.ru ?? "_not provided_"}`,
    `- EN: ${text.en}`,
  ].join("\n");
}

function reviewerChecklist(items: string[]) {
  return ["Reviewer checklist:", "", ...items.map((item) => `- [ ] ${item}`)].join(
    "\n",
  );
}

function indentMarkdown(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function formatInlineCodeList(values: string[]) {
  return values.length > 0
    ? values.map((value) => `\`${value}\``).join(", ")
    : "_none_";
}

function fencedJson(value: unknown) {
  return ["```json", JSON.stringify(value, null, 2), "```"].join("\n");
}
