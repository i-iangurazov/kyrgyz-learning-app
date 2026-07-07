import { z } from "zod";

export const localizedTextSchema = z.object({
  ky: z.string().min(1),
  en: z.string().min(1),
  ru: z.string().min(1).optional(),
});

export const trackTranslationsSchema = z.object({
  en: z.string().min(1),
  ru: z.string().min(1),
});

export const learningTrackSchema = z.enum(["RU_KY", "EN_KY", "KY_KY"]);
export const levelIdSchema = z.enum(["K0", "K1", "K2", "K3", "K4", "K5"]);
export const currentLevelIdSchema = z.enum(["K0", "K1"]);

export const contentStatusSchema = z.enum([
  "demo",
  "draft",
  "in_review",
  "approved",
  "published",
  "archived",
]);

export const methodistReviewStatusSchema = z.enum([
  "not_reviewed",
  "needs_revision",
  "reviewed",
  "approved",
]);

export const targetSkillSchema = z.enum([
  "reading",
  "listening",
  "speaking",
  "grammar",
  "vocabulary",
  "writing",
]);

export const hskInspiredComponentSchema = z.enum([
  "lesson_title",
  "communication_goal",
  "vocabulary_list",
  "dialogue_or_reading_text",
  "phrase_breakdown",
  "grammar_point",
  "workbook_exercise",
  "listening_task",
  "speaking_task",
  "writing_reconstruction_task",
  "review_test",
]);

export const readingSourceTypeSchema = z.enum([
  "original",
  "adapted",
  "public_domain",
  "licensed",
  "excerpt_requires_permission",
]);

export const audioLanguageSchema = z.enum(["ky", "ru", "en"]);

export const audioVoiceTypeSchema = z.enum([
  "human",
  "synthetic",
  "placeholder",
]);

export const audioReviewStatusSchema = z.enum([
  "not_recorded",
  "needs_review",
  "approved",
]);

const contentLifecycleShape = {
  contentStatus: contentStatusSchema,
  methodistReviewStatus: methodistReviewStatusSchema,
  isDemoContent: z.boolean(),
  internalNotes: z.array(z.string().min(1)).min(1),
  methodistNotes: z.array(z.string().min(1)).min(1),
};

const sourceMethodologyShape = {
  methodologyRefs: z.array(z.string().min(1)).min(1),
  sourceNotes: z.string().min(1),
  rightsNotes: z.string().min(1),
  validatedAgainst: z.array(z.string().min(1)).min(1),
  hskInspiredComponent: z.array(hskInspiredComponentSchema).min(1),
  kyrgyztestLevel: z.string().min(1),
  cefrLevelPlaceholder: z.string().min(1),
  requiresLicense: z.boolean(),
  isOriginalContent: z.boolean(),
};

export const audioAssetSchema = z
  .object({
    id: z.string().min(1),
    url: z.string().url().optional(),
    storageKey: z.string().min(1).optional(),
    transcript: z.string().min(1),
    language: audioLanguageSchema,
    voiceType: audioVoiceTypeSchema,
    speakerLabel: z.string().min(1).optional(),
    durationSeconds: z.number().positive().optional(),
    sourceNotes: z.string().min(1),
    rightsNotes: z.string().min(1),
    methodistReviewStatus: methodistReviewStatusSchema,
    audioReviewStatus: audioReviewStatusSchema,
  })
  .refine((audio) => Boolean(audio.url || audio.storageKey), {
    message: "Audio assets require a playable URL or storage key placeholder.",
    path: ["url"],
  });

export const breakdownItemSchema = z.object({
  id: z.string().min(1),
  phrase: z.string().min(1),
  meaningByTrack: z.object({
    RU_KY: z.string().min(1),
    EN_KY: z.string().min(1),
    KY_KY: z.string().min(1),
  }),
  notesByTrack: z
    .object({
      RU_KY: z.string().min(1).optional(),
      EN_KY: z.string().min(1).optional(),
      KY_KY: z.string().min(1).optional(),
    })
    .default({}),
  linkedVocabularyIds: z.array(z.string().min(1)).default([]),
  linkedGrammarPointIds: z.array(z.string().min(1)).default([]),
  methodistReviewStatus: methodistReviewStatusSchema,
  sourceNotes: z.string().min(1),
});

export const vocabularyItemSchema = z.object({
  id: z.string().min(1),
  kyrgyz: z.string().min(1),
  transliteration: z.string().min(1).optional(),
  translations: trackTranslationsSchema,
  example: z.object({
    kyrgyz: z.string().min(1),
    translations: trackTranslationsSchema,
  }),
  audio: audioAssetSchema,
  tags: z.array(z.string().min(1)).default([]),
  linkedLessonIds: z.array(z.string().min(1)).min(1),
  sourceNotes: z.string().min(1),
  rightsNotes: z.string().min(1),
  methodistReviewStatus: methodistReviewStatusSchema,
});

export const dialogueLineSchema = z.object({
  id: z.string().min(1),
  speaker: z.string().min(1),
  kyrgyz: z.string().min(1),
  transliteration: z.string().min(1).optional(),
  translations: trackTranslationsSchema,
  audio: audioAssetSchema,
});

export const dialogueSchema = z.object({
  id: z.string().min(1),
  type: z.literal("dialogue"),
  title: localizedTextSchema,
  context: localizedTextSchema.optional(),
  lines: z.array(dialogueLineSchema).min(1),
  breakdownItems: z.array(breakdownItemSchema).default([]),
  linkedVocabularyIds: z.array(z.string().min(1)).default([]),
  linkedGrammarPointIds: z.array(z.string().min(1)).default([]),
  audio: audioAssetSchema,
  readingSourceType: readingSourceTypeSchema,
  rightsNotes: z.string().min(1),
  sourceNotes: z.string().min(1),
  naturalnessReviewStatus: methodistReviewStatusSchema,
  methodistReviewStatus: methodistReviewStatusSchema,
  isOriginalContent: z.boolean(),
  requiresLicense: z.boolean(),
});

export const readingParagraphSchema = z.object({
  id: z.string().min(1),
  kyrgyz: z.string().min(1),
  translations: trackTranslationsSchema,
  audio: audioAssetSchema,
});

export const readingTextSchema = z.object({
  id: z.string().min(1),
  type: z.literal("reading_text"),
  title: localizedTextSchema,
  paragraphs: z.array(readingParagraphSchema).min(1),
  breakdownItems: z.array(breakdownItemSchema).default([]),
  linkedVocabularyIds: z.array(z.string().min(1)).default([]),
  linkedGrammarPointIds: z.array(z.string().min(1)).default([]),
  readingSourceType: readingSourceTypeSchema,
  rightsNotes: z.string().min(1),
  sourceNotes: z.string().min(1),
  naturalnessReviewStatus: methodistReviewStatusSchema,
  methodistReviewStatus: methodistReviewStatusSchema,
  isOriginalContent: z.boolean(),
  requiresLicense: z.boolean(),
});

export const grammarExampleSchema = z.object({
  id: z.string().min(1),
  kyrgyz: z.string().min(1),
  transliteration: z.string().min(1).optional(),
  translations: trackTranslationsSchema,
  linkedVocabularyIds: z.array(z.string().min(1)).default([]),
});

export const grammarPointSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  level: levelIdSchema,
  explanationsByTrack: z.object({
    RU_KY: z.string().min(1),
    EN_KY: z.string().min(1),
    KY_KY: z.string().min(1),
  }),
  simpleRule: localizedTextSchema,
  examples: z.array(grammarExampleSchema).min(1),
  commonMistakes: z
    .array(
      z.object({
        id: z.string().min(1),
        track: learningTrackSchema,
        incorrectPattern: z.string().min(1),
        correction: z.string().min(1),
        explanation: localizedTextSchema,
      }),
    )
    .default([]),
  microPracticePrompts: z
    .array(
      z.object({
        id: z.string().min(1),
        prompt: localizedTextSchema,
        answer: localizedTextSchema,
        feedback: localizedTextSchema,
      }),
    )
    .default([]),
  linkedExerciseIds: z.array(z.string().min(1)).default([]),
  methodologyRefs: z.array(z.string().min(1)).min(1),
  sourceNotes: z.string().min(1),
  validationNotes: z.string().min(1),
  validatedAgainst: z.array(z.string().min(1)).min(1),
  methodistReviewStatus: methodistReviewStatusSchema,
});

export const exerciseKindSchema = z.enum([
  "multiple_choice",
  "fill_blank",
  "sentence_builder",
  "match_pairs",
  "error_correction",
  "listening_choice",
  "short_answer",
]);

export const answerDataSchema = z.object({
  kind: z.enum(["choice_id", "text", "ordered_ids", "pairs", "free_text"]),
  value: z.union([
    z.string().min(1),
    z.array(z.string().min(1)).min(1),
    z.record(z.string().min(1), z.string().min(1)),
  ]),
});

export const exerciseSchema = z.object({
  id: z.string().min(1),
  kind: exerciseKindSchema,
  prompt: localizedTextSchema,
  helperTextByTrack: z.object({
    RU_KY: z.string().min(1),
    EN_KY: z.string().min(1),
    KY_KY: z.string().min(1),
  }),
  linkedVocabularyIds: z.array(z.string().min(1)).default([]),
  linkedGrammarPointIds: z.array(z.string().min(1)).default([]),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        question: localizedTextSchema,
        options: z
          .array(
            z.object({
              id: z.string().min(1),
              text: localizedTextSchema,
            }),
          )
          .optional(),
        correctAnswerData: answerDataSchema,
        audio: audioAssetSchema.optional(),
        explanation: localizedTextSchema,
        feedback: z.object({
          correct: localizedTextSchema,
          incorrect: localizedTextSchema,
          hint: localizedTextSchema,
        }),
      }),
    )
    .min(1),
  hskInspiredComponent: z.array(hskInspiredComponentSchema).min(1),
  sourceNotes: z.string().min(1),
  methodistReviewStatus: methodistReviewStatusSchema,
});

export const miniGameSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "crossword",
    "word_match",
    "sentence_puzzle",
    "find_mistake",
    "kyrgyz_wordle",
  ]),
  title: localizedTextSchema,
  description: localizedTextSchema,
  config: z.object({
    linkedVocabularyIds: z.array(z.string().min(1)).default([]),
    linkedGrammarPointIds: z.array(z.string().min(1)).default([]),
    sourcePhraseIds: z.array(z.string().min(1)).default([]),
    targetSkill: targetSkillSchema,
    difficulty: z.enum(["starter", "easy", "medium"]),
  }),
  hskInspiredComponent: z.array(hskInspiredComponentSchema).min(1),
  methodistReviewStatus: methodistReviewStatusSchema,
});

export const speakingPromptSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  prompt: localizedTextSchema,
  expectedPhrases: z.array(z.string().min(1)).min(1),
  linkedVocabularyIds: z.array(z.string().min(1)).default([]),
  linkedGrammarPointIds: z.array(z.string().min(1)).default([]),
  pronunciationFocus: z.string().min(1),
  sampleAnswer: z.string().min(1).optional(),
  methodistReviewStatus: methodistReviewStatusSchema,
});

export const aiRoleplaySchema = z.object({
  id: z.string().min(1),
  scenarioId: z.string().min(1),
  title: localizedTextSchema,
  level: levelIdSchema,
  situation: localizedTextSchema,
  userGoal: localizedTextSchema,
  aiCharacter: localizedTextSchema,
  allowedVocabularyIds: z.array(z.string().min(1)).min(1),
  allowedGrammarPointIds: z.array(z.string().min(1)).default([]),
  allowedPhrases: z.array(z.string().min(1)).min(1),
  correctionStyle: z.enum(["gentle_short", "model_then_retry", "minimal"]),
  uncertaintyRules: z.array(z.string().min(1)).min(1),
  refusalRules: z.array(z.string().min(1)).min(1),
  systemPromptPlaceholder: z.string().min(1),
  methodistReviewStatus: methodistReviewStatusSchema,
});

export const lessonSchema = z.object({
  id: z.string().min(1),
  schemaVersion: z.literal("lesson-v2"),
  levelId: currentLevelIdSchema,
  unitId: z.string().min(1),
  order: z.number().int().positive(),
  lessonNumber: z.number().int().positive(),
  stableLessonId: z.string().min(1),
  estimatedDurationMinutes: z.number().int().min(5).max(20),
  prerequisites: z.array(z.string().min(1)).default([]),
  learningGoals: z.array(localizedTextSchema).min(1).max(4),
  targetSkills: z.array(targetSkillSchema).min(1),
  supportedTracks: z.array(learningTrackSchema).min(1),
  sampleNotice: z.string().min(1),
  validationTodos: z.array(z.string().min(1)).min(1),
  title: localizedTextSchema,
  subtitle: localizedTextSchema,
  story: z.object({
    title: localizedTextSchema,
    body: localizedTextSchema,
    contextTags: z.array(z.string().min(1)).default([]),
    sampleNotice: z.string().min(1),
    methodologyRefs: z.array(z.string().min(1)).min(1),
    sourceNotes: z.string().min(1),
    rightsNotes: z.string().min(1),
    methodistReviewStatus: methodistReviewStatusSchema,
  }),
  vocabulary: z.array(vocabularyItemSchema).min(1),
  dialogues: z.array(dialogueSchema).min(1),
  texts: z.array(readingTextSchema).default([]),
  grammarPoints: z.array(grammarPointSchema).min(1),
  exercises: z.array(exerciseSchema).min(1),
  miniGame: miniGameSchema,
  speakingPrompt: speakingPromptSchema,
  aiRoleplay: aiRoleplaySchema,
  review: z.object({
    summary: localizedTextSchema,
    canDo: z.array(localizedTextSchema).min(1),
    reviewVocabularyIds: z.array(z.string().min(1)).default([]),
    reviewGrammarPointIds: z.array(z.string().min(1)).default([]),
    nextLessonId: z.string().min(1).optional(),
    methodologyRefs: z.array(z.string().min(1)).min(1),
  }),
  ...contentLifecycleShape,
  ...sourceMethodologyShape,
});

export const unitSchema = z.object({
  id: z.string().min(1),
  levelId: currentLevelIdSchema,
  title: localizedTextSchema,
  description: localizedTextSchema,
  lessonIds: z.array(z.string().min(1)).min(1),
});

export const levelSchema = z.object({
  id: currentLevelIdSchema,
  title: localizedTextSchema,
  description: localizedTextSchema,
  unitIds: z.array(z.string().min(1)).min(1),
});

export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type AudioAsset = z.infer<typeof audioAssetSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type Level = z.infer<typeof levelSchema>;
