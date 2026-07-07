import { describe, expect, it } from "vitest";

import { mapDbRowsToCurriculum } from "@/content/db/curriculum-mappers";
import {
  getDbRowCounts,
  mapDbRowsToLessons,
  mapLessonsToDbRows,
} from "@/content/db/mappers";
import { lessons as runtimeLessons } from "@/content/curriculum";
import { levelSeedData, unitSeedData } from "@/content/seed/curriculum";
import { lessonSeedData } from "@/content/seed/lessons";
import { lessonSchema, levelSchema, unitSchema } from "@/content/schemas";

const sourceLessons = lessonSchema.array().parse(lessonSeedData);
const levels = levelSchema.array().parse(levelSeedData);
const units = unitSchema.array().parse(unitSeedData);

function createRows() {
  return mapLessonsToDbRows(sourceLessons, { levels, units });
}

describe("Slice 1 DB seed mappers", () => {
  it("creates DB-shaped row groups for all current seed lessons", () => {
    const rows = createRows();
    const counts = getDbRowCounts(rows);

    expect(counts.levels).toBe(levels.length);
    expect(counts.units).toBe(units.length);
    expect(counts.lessons).toBe(sourceLessons.length);
    expect(counts.lesson_learning_goals).toBe(
      sourceLessons.reduce((count, lesson) => count + lesson.learningGoals.length, 0),
    );
    expect(counts.lesson_tracks).toBe(
      sourceLessons.reduce((count, lesson) => count + lesson.supportedTracks.length, 0),
    );
    expect(counts.lesson_target_skills).toBe(
      sourceLessons.reduce((count, lesson) => count + lesson.targetSkills.length, 0),
    );
    expect(counts.vocabulary_items).toBe(
      new Set(sourceLessons.flatMap((lesson) => lesson.vocabulary.map((item) => item.id)))
        .size,
    );
    expect(counts.lesson_vocabulary).toBe(
      sourceLessons.reduce((count, lesson) => count + lesson.vocabulary.length, 0),
    );
    expect(counts.grammar_points).toBe(
      new Set(
        sourceLessons.flatMap((lesson) =>
          lesson.grammarPoints.map((grammarPoint) => grammarPoint.id),
        ),
      ).size,
    );
    expect(counts.lesson_grammar_points).toBe(
      sourceLessons.reduce((count, lesson) => count + lesson.grammarPoints.length, 0),
    );
    expect(counts.dialogues).toBe(
      sourceLessons.reduce((count, lesson) => count + lesson.dialogues.length, 0),
    );
    expect(counts.dialogue_lines).toBe(
      sourceLessons.reduce(
        (count, lesson) =>
          count +
          lesson.dialogues.reduce(
            (lineCount, dialogue) => lineCount + dialogue.lines.length,
            0,
          ),
        0,
      ),
    );
    expect(counts.exercises).toBe(
      sourceLessons.reduce((count, lesson) => count + lesson.exercises.length, 0),
    );
    expect(counts.exercise_items).toBe(
      sourceLessons.reduce(
        (count, lesson) =>
          count +
          lesson.exercises.reduce(
            (itemCount, exercise) => itemCount + exercise.items.length,
            0,
          ),
        0,
      ),
    );
    expect(counts.exercise_answers).toBe(counts.exercise_items);
    expect(counts.exercise_feedback).toBe(counts.exercise_items);
  });

  it("preserves stable lesson, vocabulary, grammar, and exercise IDs", () => {
    const rows = createRows();

    expect(rows.lessons.map((row) => row.id)).toEqual(
      sourceLessons.map((lesson) => lesson.id),
    );
    expect(rows.lessons.map((row) => row.stable_lesson_id)).toEqual(
      sourceLessons.map((lesson) => lesson.stableLessonId),
    );
    expect(new Set(rows.vocabulary_items.map((row) => row.id))).toEqual(
      new Set(sourceLessons.flatMap((lesson) => lesson.vocabulary.map((item) => item.id))),
    );
    expect(new Set(rows.grammar_points.map((row) => row.id))).toEqual(
      new Set(
        sourceLessons.flatMap((lesson) =>
          lesson.grammarPoints.map((grammarPoint) => grammarPoint.id),
        ),
      ),
    );
    expect(new Set(rows.exercises.map((row) => row.id))).toEqual(
      new Set(sourceLessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id))),
    );
  });

  it("round-trips DB-shaped rows back into valid lesson-v2 content", () => {
    const rows = createRows();
    const roundTrippedLessons = lessonSchema.array().parse(mapDbRowsToLessons(rows));

    expect(roundTrippedLessons).toEqual(sourceLessons);
  });

  it("reconstructs the curriculum hierarchy from DB-shaped rows", () => {
    const rows = createRows();
    const curriculum = mapDbRowsToCurriculum(rows);

    expect(curriculum.levels).toEqual(levels);
    expect(curriculum.units).toEqual(units);
    expect(curriculum.lessons).toEqual(sourceLessons);
  });

  it("preserves answer and feedback data for all supported exercise kinds", () => {
    const rows = createRows();
    const roundTrippedLessons = mapDbRowsToLessons(rows);
    const sourceExercises = sourceLessons.flatMap((lesson) => lesson.exercises);
    const roundTrippedExercises = roundTrippedLessons.flatMap((lesson) => lesson.exercises);

    expect(new Set(sourceExercises.map((exercise) => exercise.kind))).toEqual(
      new Set([
        "multiple_choice",
        "fill_blank",
        "sentence_builder",
        "match_pairs",
        "error_correction",
      ]),
    );

    sourceExercises.forEach((sourceExercise) => {
      const roundTrippedExercise = roundTrippedExercises.find(
        (exercise) => exercise.id === sourceExercise.id,
      );

      expect(roundTrippedExercise?.kind).toBe(sourceExercise.kind);
      expect(roundTrippedExercise?.items.map((item) => item.correctAnswerData)).toEqual(
        sourceExercise.items.map((item) => item.correctAnswerData),
      );
      expect(roundTrippedExercise?.items.map((item) => item.feedback)).toEqual(
        sourceExercise.items.map((item) => item.feedback),
      );
    });
  });

  it("keeps the app runtime seed export unchanged", () => {
    expect(runtimeLessons).toEqual(sourceLessons);
  });
});
