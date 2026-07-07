import { z } from "zod";

export const localizedTextSchema = z.object({
  ky: z.string().min(1),
  en: z.string().min(1),
  ru: z.string().min(1).optional(),
});

export const learningTrackSchema = z.enum(["en-ky", "ru-ky", "ky-ky"]);

export const vocabularyItemSchema = z.object({
  id: z.string().min(1),
  kyrgyz: z.string().min(1),
  transliteration: z.string().min(1).optional(),
  english: z.string().min(1).optional(),
  russian: z.string().min(1).optional(),
  notes: localizedTextSchema.optional(),
  tags: z.array(z.string().min(1)).default([]),
});

export const dialogueLineSchema = z.object({
  speaker: z.string().min(1),
  kyrgyz: z.string().min(1),
  transliteration: z.string().min(1).optional(),
  english: z.string().min(1).optional(),
  russian: z.string().min(1).optional(),
});

export const dialogueSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  context: localizedTextSchema.optional(),
  lines: z.array(dialogueLineSchema).min(1),
});

export const readingTextSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  kyrgyz: z.string().min(1),
  english: z.string().min(1).optional(),
  russian: z.string().min(1).optional(),
});

export const grammarExampleSchema = z.object({
  kyrgyz: z.string().min(1),
  transliteration: z.string().min(1).optional(),
  english: z.string().min(1).optional(),
  russian: z.string().min(1).optional(),
});

export const grammarPointSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  explanation: localizedTextSchema,
  examples: z.array(grammarExampleSchema).min(1),
  validationTodo: z.string().min(1),
});

export const exerciseSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["multiple-choice", "translation", "matching", "fill-blank", "reading"]),
  prompt: localizedTextSchema,
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        question: localizedTextSchema,
        answer: localizedTextSchema,
        options: z.array(localizedTextSchema).optional(),
      }),
    )
    .min(1),
});

export const miniGameSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["sound-match", "quick-pick", "word-order", "memory"]),
  title: localizedTextSchema,
  description: localizedTextSchema,
  validationTodo: z.string().min(1),
});

export const speakingPromptSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  prompt: localizedTextSchema,
  sampleAnswer: z.string().min(1).optional(),
  validationTodo: z.string().min(1),
});

export const aiRoleplaySchema = z.object({
  id: z.string().min(1),
  scenario: localizedTextSchema,
  learnerGoal: localizedTextSchema,
  systemPromptPlaceholder: z.string().min(1),
  validationTodo: z.string().min(1),
});

export const lessonSchema = z.object({
  id: z.string().min(1),
  levelId: z.enum(["K0", "K1"]),
  unitId: z.string().min(1),
  order: z.number().int().positive(),
  contentStatus: z.literal("demo"),
  supportedTracks: z.array(learningTrackSchema).min(1),
  title: localizedTextSchema,
  subtitle: localizedTextSchema,
  sampleNotice: z.string().min(1),
  validationTodos: z.array(z.string().min(1)).min(1),
  objectives: z.array(localizedTextSchema).min(1),
  story: z.object({
    title: localizedTextSchema,
    body: localizedTextSchema,
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
  }),
});

export const unitSchema = z.object({
  id: z.string().min(1),
  levelId: z.enum(["K0", "K1"]),
  title: localizedTextSchema,
  description: localizedTextSchema,
  lessonIds: z.array(z.string().min(1)).min(1),
});

export const levelSchema = z.object({
  id: z.enum(["K0", "K1"]),
  title: localizedTextSchema,
  description: localizedTextSchema,
  unitIds: z.array(z.string().min(1)).min(1),
});

export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type Level = z.infer<typeof levelSchema>;
