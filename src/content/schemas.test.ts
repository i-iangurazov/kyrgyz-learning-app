import { describe, expect, it } from "vitest";

import { lessons, levels, units } from "@/content/curriculum";
import { lessonSeedData } from "@/content/seed/lessons";
import { lessonSchema } from "@/content/schemas";

describe("curriculum content schemas", () => {
  it("validates all seeded lessons against schema v2", () => {
    expect(() => lessonSchema.array().parse(lessonSeedData)).not.toThrow();

    for (const lesson of lessons) {
      expect(lesson.schemaVersion).toBe("lesson-v2");
      expect(lesson.stableLessonId).toBe(lesson.id);
    }
  });

  it("requires lifecycle and demo review fields on every lesson", () => {
    for (const lesson of lessons) {
      expect(lesson.contentStatus).toBe("demo");
      expect(lesson.methodistReviewStatus).toBe("not_reviewed");
      expect(lesson.isDemoContent).toBe(true);
      expect(lesson.sampleNotice).toContain("Sample/demo content");
      expect(lesson.validationTodos.join(" ")).toContain("TODO");
      expect(lesson.internalNotes.length).toBeGreaterThan(0);
      expect(lesson.methodistNotes.length).toBeGreaterThan(0);
    }
  });

  it("requires source, rights, level alignment, and methodology fields", () => {
    for (const lesson of lessons) {
      expect(lesson.methodologyRefs.length).toBeGreaterThan(0);
      expect(lesson.sourceNotes).toContain("Original");
      expect(lesson.rightsNotes).toContain("No textbook");
      expect(lesson.validatedAgainst.join(" ")).toContain("pending");
      expect(lesson.hskInspiredComponent).toContain("vocabulary_list");
      expect(lesson.kyrgyztestLevel).toContain("placeholder");
      expect(lesson.cefrLevelPlaceholder).toContain("placeholder");
      expect(lesson.requiresLicense).toBe(false);
      expect(lesson.isOriginalContent).toBe(true);
      expect(lesson.story.sourceNotes).toContain("Original");
      expect(lesson.story.rightsNotes).toContain("No textbook");
      expect(lesson.story.methodistReviewStatus).toBe("not_reviewed");

      for (const item of lesson.vocabulary) {
        expect(item.translations.en).toBeTruthy();
        expect(item.translations.ru).toBeTruthy();
        expect(item.example.kyrgyz).toBeTruthy();
        expect(item.audio.status).toBe("placeholder");
        expect(item.linkedLessonIds).toContain(lesson.id);
        expect(item.sourceNotes).toContain("Original");
        expect(item.rightsNotes).toContain("No textbook");
        expect(item.methodistReviewStatus).toBe("not_reviewed");
      }

      for (const text of lesson.texts) {
        expect(text.readingSourceType).toBe("original");
        expect(text.rightsNotes).toContain("No textbook");
        expect(text.isOriginalContent).toBe(true);
        expect(text.requiresLicense).toBe(false);
      }
    }
  });

  it("keeps learning tracks and target skills structurally ready", () => {
    for (const lesson of lessons) {
      expect(lesson.supportedTracks).toEqual(
        expect.arrayContaining(["RU_KY", "EN_KY", "KY_KY"]),
      );
      expect(lesson.learningGoals.length).toBeGreaterThanOrEqual(1);
      expect(lesson.learningGoals.length).toBeLessThanOrEqual(4);
      expect(lesson.targetSkills.length).toBeGreaterThan(0);
    }
  });

  it("models future interactive exercises with answer and feedback data", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        expect([
          "multiple_choice",
          "fill_blank",
          "sentence_builder",
          "match_pairs",
          "error_correction",
          "listening_choice",
          "short_answer",
        ]).toContain(exercise.kind);
        expect(exercise.helperTextByTrack.EN_KY).toBeTruthy();
        expect(exercise.linkedVocabularyIds.length).toBeGreaterThan(0);
        expect(exercise.methodistReviewStatus).toBe("not_reviewed");

        for (const item of exercise.items) {
          expect(item.correctAnswerData.kind).toBeTruthy();
          expect(item.explanation.en).toBeTruthy();
          expect(item.feedback.correct.en).toBeTruthy();
          expect(item.feedback.incorrect.en).toBeTruthy();
          expect(item.feedback.hint.en).toBeTruthy();
        }
      }
    }
  });

  it("models constrained AI roleplay scenarios", () => {
    for (const lesson of lessons) {
      const vocabularyIds = new Set(lesson.vocabulary.map((item) => item.id));
      const grammarPointIds = new Set(lesson.grammarPoints.map((item) => item.id));

      expect(lesson.aiRoleplay.scenarioId).toBeTruthy();
      expect(lesson.aiRoleplay.level).toBe(lesson.levelId);
      expect(lesson.aiRoleplay.allowedVocabularyIds.length).toBeGreaterThan(0);
      expect(lesson.aiRoleplay.allowedPhrases.length).toBeGreaterThan(0);
      expect(lesson.aiRoleplay.uncertaintyRules.length).toBeGreaterThan(0);
      expect(lesson.aiRoleplay.refusalRules.length).toBeGreaterThan(0);
      expect(lesson.aiRoleplay.methodistReviewStatus).toBe("not_reviewed");

      for (const vocabularyId of lesson.aiRoleplay.allowedVocabularyIds) {
        expect(vocabularyIds.has(vocabularyId)).toBe(true);
      }

      for (const grammarPointId of lesson.aiRoleplay.allowedGrammarPointIds) {
        expect(grammarPointIds.has(grammarPointId)).toBe(true);
      }
    }
  });

  it("keeps unit and level references connected", () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id));
    const unitIds = new Set(units.map((unit) => unit.id));

    for (const unit of units) {
      expect(unitIds.has(unit.id)).toBe(true);
      for (const lessonId of unit.lessonIds) {
        expect(lessonIds.has(lessonId)).toBe(true);
      }
    }

    for (const level of levels) {
      for (const unitId of level.unitIds) {
        expect(unitIds.has(unitId)).toBe(true);
      }
    }
  });
});
