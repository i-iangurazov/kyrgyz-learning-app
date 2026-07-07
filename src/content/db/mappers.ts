import {
  type Lesson,
  type Level,
  type Unit,
  lessonSchema,
} from "../schemas.ts";
import type {
  BreakdownGrammarPointRow,
  BreakdownVocabularyRow,
  ExerciseKind,
  ExerciseOptionRow,
  Slice1DbRows,
} from "./types.ts";

const supportedSlice1ExerciseKinds = [
  "multiple_choice",
  "fill_blank",
  "sentence_builder",
  "match_pairs",
  "error_correction",
] as const satisfies readonly ExerciseKind[];

type SupportedSlice1ExerciseKind = (typeof supportedSlice1ExerciseKinds)[number];

type MapLessonsToDbRowsOptions = {
  levels?: Level[];
  units?: Unit[];
};

type RowCollectionName = keyof Slice1DbRows;

export function mapLessonsToDbRows(
  lessons: Lesson[],
  options: MapLessonsToDbRowsOptions = {},
): Slice1DbRows {
  const rows = createEmptyRows();
  const vocabularyIds = new Set<string>();
  const grammarPointIds = new Set<string>();
  const sourceIds = new Set<string>();

  const lessonsByLevel = groupLessonsByLevel(lessons);
  const levels = options.levels ?? deriveLevelsFromLessons(lessonsByLevel);
  const units = options.units ?? deriveUnitsFromLessons(lessons);

  levels.forEach((level, index) => {
    const firstLesson = lessonsByLevel.get(level.id)?.[0];

    rows.levels.push({
      id: level.id,
      title: level.title,
      description: level.description,
      display_order: index + 1,
      kyrgyztest_level: firstLesson?.kyrgyztestLevel ?? "pending-alignment",
      cefr_placeholder: firstLesson?.cefrLevelPlaceholder ?? "pending-placeholder",
    });
  });

  units.forEach((unit, index) => {
    rows.units.push({
      id: unit.id,
      level_id: unit.levelId,
      title: unit.title,
      description: unit.description,
      display_order: index + 1,
      content_status: "demo",
      methodist_review_status: "not_reviewed",
    });
  });

  lessons.forEach((lesson) => {
    addLessonSources(lesson, rows, sourceIds);

    rows.lessons.push({
      id: lesson.id,
      schema_version: lesson.schemaVersion,
      level_id: lesson.levelId,
      unit_id: lesson.unitId,
      stable_lesson_id: lesson.stableLessonId,
      lesson_number: lesson.lessonNumber,
      display_order: lesson.order,
      title: lesson.title,
      subtitle: lesson.subtitle,
      story: lesson.story,
      estimated_duration_minutes: lesson.estimatedDurationMinutes,
      sample_notice: lesson.sampleNotice,
      validation_todos: lesson.validationTodos,
      content_status: lesson.contentStatus,
      methodist_review_status: lesson.methodistReviewStatus,
      is_demo_content: lesson.isDemoContent,
      is_original_content: lesson.isOriginalContent,
      requires_license: lesson.requiresLicense,
      source_notes: lesson.sourceNotes,
      rights_notes: lesson.rightsNotes,
      internal_notes: lesson.internalNotes,
      methodist_notes: lesson.methodistNotes,
      methodology_refs: lesson.methodologyRefs,
      validated_against: lesson.validatedAgainst,
      hsk_inspired_components: lesson.hskInspiredComponent,
      kyrgyztest_level: lesson.kyrgyztestLevel,
      cefr_level_placeholder: lesson.cefrLevelPlaceholder,
      texts: lesson.texts,
      mini_game: lesson.miniGame,
      speaking_prompt: lesson.speakingPrompt,
      ai_roleplay: lesson.aiRoleplay,
      review: lesson.review,
    });

    lesson.learningGoals.forEach((goal, index) => {
      rows.lesson_learning_goals.push({
        id: `${lesson.id}-goal-${index + 1}`,
        lesson_id: lesson.id,
        goal_text: goal,
        display_order: index + 1,
      });
    });

    lesson.supportedTracks.forEach((track, index) => {
      rows.lesson_tracks.push({
        lesson_id: lesson.id,
        track,
        display_order: index + 1,
      });
    });

    lesson.targetSkills.forEach((targetSkill, index) => {
      rows.lesson_target_skills.push({
        lesson_id: lesson.id,
        target_skill: targetSkill,
        display_order: index + 1,
      });
    });

    lesson.prerequisites.forEach((prerequisiteLessonId, index) => {
      rows.lesson_prerequisites.push({
        lesson_id: lesson.id,
        prerequisite_lesson_id: prerequisiteLessonId,
        display_order: index + 1,
      });
    });

    lesson.vocabulary.forEach((vocabularyItem, index) => {
      if (!vocabularyIds.has(vocabularyItem.id)) {
        rows.vocabulary_items.push({
          id: vocabularyItem.id,
          kyrgyz: vocabularyItem.kyrgyz,
          transliteration: vocabularyItem.transliteration ?? null,
          translations: vocabularyItem.translations,
          example: vocabularyItem.example,
          audio_placeholder: vocabularyItem.audio,
          tags: vocabularyItem.tags,
          linked_lesson_ids: vocabularyItem.linkedLessonIds,
          source_notes: vocabularyItem.sourceNotes,
          rights_notes: vocabularyItem.rightsNotes,
          methodist_review_status: vocabularyItem.methodistReviewStatus,
        });
        vocabularyIds.add(vocabularyItem.id);
      }

      rows.lesson_vocabulary.push({
        lesson_id: lesson.id,
        vocabulary_item_id: vocabularyItem.id,
        display_order: index + 1,
        introduced_here: vocabularyItem.linkedLessonIds.includes(lesson.id),
      });
    });

    lesson.grammarPoints.forEach((grammarPoint, index) => {
      if (!grammarPointIds.has(grammarPoint.id)) {
        rows.grammar_points.push({
          id: grammarPoint.id,
          level_id: grammarPoint.level,
          title: grammarPoint.title,
          simple_rule: grammarPoint.simpleRule,
          explanations_by_track: grammarPoint.explanationsByTrack,
          examples: grammarPoint.examples,
          common_mistakes: grammarPoint.commonMistakes,
          micro_practice_prompts: grammarPoint.microPracticePrompts,
          linked_exercise_ids: grammarPoint.linkedExerciseIds,
          methodology_refs: grammarPoint.methodologyRefs,
          source_notes: grammarPoint.sourceNotes,
          validation_notes: grammarPoint.validationNotes,
          validated_against: grammarPoint.validatedAgainst,
          methodist_review_status: grammarPoint.methodistReviewStatus,
        });
        grammarPointIds.add(grammarPoint.id);
      }

      rows.lesson_grammar_points.push({
        lesson_id: lesson.id,
        grammar_point_id: grammarPoint.id,
        display_order: index + 1,
        introduced_here: true,
      });
    });

    let breakdownDisplayOrder = 1;

    lesson.dialogues.forEach((dialogue, dialogueIndex) => {
      rows.dialogues.push({
        id: dialogue.id,
        lesson_id: lesson.id,
        title: dialogue.title,
        context: dialogue.context ?? null,
        reading_source_type: dialogue.readingSourceType,
        rights_notes: dialogue.rightsNotes,
        source_notes: dialogue.sourceNotes,
        naturalness_review_status: dialogue.naturalnessReviewStatus,
        methodist_review_status: dialogue.methodistReviewStatus,
        is_original_content: dialogue.isOriginalContent,
        requires_license: dialogue.requiresLicense,
        audio_placeholder: dialogue.audio,
        linked_vocabulary_ids: dialogue.linkedVocabularyIds,
        linked_grammar_point_ids: dialogue.linkedGrammarPointIds,
        display_order: dialogueIndex + 1,
      });

      dialogue.lines.forEach((line, lineIndex) => {
        rows.dialogue_lines.push({
          id: line.id,
          dialogue_id: dialogue.id,
          speaker: line.speaker,
          kyrgyz: line.kyrgyz,
          transliteration: line.transliteration ?? null,
          translations: line.translations,
          audio_placeholder: line.audio,
          display_order: lineIndex + 1,
        });
      });

      dialogue.breakdownItems.forEach((breakdownItem) => {
        rows.breakdown_items.push({
          id: breakdownItem.id,
          lesson_id: lesson.id,
          source_content_type: "dialogue",
          source_content_id: dialogue.id,
          phrase: breakdownItem.phrase,
          meaning_by_track: breakdownItem.meaningByTrack,
          notes_by_track: breakdownItem.notesByTrack,
          source_notes: breakdownItem.sourceNotes,
          methodist_review_status: breakdownItem.methodistReviewStatus,
          display_order: breakdownDisplayOrder,
        });
        addBreakdownLinks(breakdownItem, rows, breakdownDisplayOrder);
        breakdownDisplayOrder += 1;
      });
    });

    lesson.exercises.forEach((exercise, exerciseIndex) => {
      const kind = assertSupportedSlice1ExerciseKind(exercise.kind);

      rows.exercises.push({
        id: exercise.id,
        lesson_id: lesson.id,
        kind,
        prompt: exercise.prompt,
        helper_text_by_track: exercise.helperTextByTrack,
        hsk_inspired_components: exercise.hskInspiredComponent,
        source_notes: exercise.sourceNotes,
        methodist_review_status: exercise.methodistReviewStatus,
        display_order: exerciseIndex + 1,
      });

      exercise.linkedVocabularyIds.forEach((vocabularyItemId, index) => {
        rows.exercise_vocabulary.push({
          exercise_id: exercise.id,
          vocabulary_item_id: vocabularyItemId,
          display_order: index + 1,
        });
      });

      exercise.linkedGrammarPointIds.forEach((grammarPointId, index) => {
        rows.exercise_grammar_points.push({
          exercise_id: exercise.id,
          grammar_point_id: grammarPointId,
          display_order: index + 1,
        });
      });

      exercise.items.forEach((item, itemIndex) => {
        rows.exercise_items.push({
          id: item.id,
          exercise_id: exercise.id,
          question: item.question,
          explanation: item.explanation,
          audio_placeholder: item.audio ?? null,
          display_order: itemIndex + 1,
        });

        item.options?.forEach((option, optionIndex) => {
          rows.exercise_options.push({
            id: option.id,
            exercise_item_id: item.id,
            option_text: option.text,
            option_group: inferOptionGroup(exercise.kind, option.id),
            display_order: optionIndex + 1,
            metadata: {},
          });
        });

        rows.exercise_answers.push({
          id: `${item.id}-answer-primary`,
          exercise_item_id: item.id,
          answer_kind: item.correctAnswerData.kind,
          value: item.correctAnswerData.value,
          accepted_alternatives: [],
          display_value: formatAnswerDisplayValue(item.correctAnswerData.value),
          is_primary: true,
        });

        rows.exercise_feedback.push({
          exercise_item_id: item.id,
          correct_feedback: item.feedback.correct,
          incorrect_feedback: item.feedback.incorrect,
          hint: item.feedback.hint,
        });
      });
    });
  });

  return sortRows(rows);
}

export function mapDbRowsToLessons(rows: Slice1DbRows): Lesson[] {
  const vocabularyById = new Map(rows.vocabulary_items.map((row) => [row.id, row]));
  const grammarById = new Map(rows.grammar_points.map((row) => [row.id, row]));
  const dialogueLinesByDialogueId = groupBy(rows.dialogue_lines, (row) => row.dialogue_id);
  const breakdownItemsBySourceId = groupBy(
    rows.breakdown_items,
    (row) => `${row.source_content_type}:${row.source_content_id}`,
  );
  const breakdownVocabularyByItemId = groupBy(
    rows.breakdown_vocabulary,
    (row) => row.breakdown_item_id,
  );
  const breakdownGrammarByItemId = groupBy(
    rows.breakdown_grammar_points,
    (row) => row.breakdown_item_id,
  );
  const exercisesByLessonId = groupBy(rows.exercises, (row) => row.lesson_id);
  const exerciseItemsByExerciseId = groupBy(rows.exercise_items, (row) => row.exercise_id);
  const exerciseOptionsByItemId = groupBy(
    rows.exercise_options,
    (row) => row.exercise_item_id,
  );
  const exerciseAnswersByItemId = groupBy(
    rows.exercise_answers,
    (row) => row.exercise_item_id,
  );
  const exerciseFeedbackByItemId = new Map(
    rows.exercise_feedback.map((row) => [row.exercise_item_id, row]),
  );

  return rows.lessons
    .slice()
    .sort(byLessonHierarchyOrder)
    .map((lessonRow) => {
      const lessonId = lessonRow.id;
      const learningGoals = rows.lesson_learning_goals
        .filter((row) => row.lesson_id === lessonId)
        .sort(byDisplayOrder)
        .map((row) => row.goal_text);
      const supportedTracks = rows.lesson_tracks
        .filter((row) => row.lesson_id === lessonId)
        .sort(byDisplayOrder)
        .map((row) => row.track);
      const targetSkills = rows.lesson_target_skills
        .filter((row) => row.lesson_id === lessonId)
        .sort(byDisplayOrder)
        .map((row) => row.target_skill);
      const prerequisites = rows.lesson_prerequisites
        .filter((row) => row.lesson_id === lessonId)
        .sort(byDisplayOrder)
        .map((row) => row.prerequisite_lesson_id);

      const vocabulary = rows.lesson_vocabulary
        .filter((row) => row.lesson_id === lessonId)
        .sort(byDisplayOrder)
        .map((row) => {
          const vocabularyItem = requireRow(
            vocabularyById,
            row.vocabulary_item_id,
            "vocabulary item",
          );

          return {
            id: vocabularyItem.id,
            kyrgyz: vocabularyItem.kyrgyz,
            transliteration: vocabularyItem.transliteration ?? undefined,
            translations: vocabularyItem.translations,
            example: vocabularyItem.example,
            audio: vocabularyItem.audio_placeholder,
            tags: vocabularyItem.tags,
            linkedLessonIds: vocabularyItem.linked_lesson_ids,
            sourceNotes: vocabularyItem.source_notes,
            rightsNotes: vocabularyItem.rights_notes,
            methodistReviewStatus: vocabularyItem.methodist_review_status,
          };
        });

      const grammarPoints = rows.lesson_grammar_points
        .filter((row) => row.lesson_id === lessonId)
        .sort(byDisplayOrder)
        .map((row) => {
          const grammarPoint = requireRow(
            grammarById,
            row.grammar_point_id,
            "grammar point",
          );

          return {
            id: grammarPoint.id,
            title: grammarPoint.title,
            level: grammarPoint.level_id,
            explanationsByTrack: grammarPoint.explanations_by_track,
            simpleRule: grammarPoint.simple_rule,
            examples: grammarPoint.examples,
            commonMistakes: grammarPoint.common_mistakes,
            microPracticePrompts: grammarPoint.micro_practice_prompts,
            linkedExerciseIds: grammarPoint.linked_exercise_ids,
            methodologyRefs: grammarPoint.methodology_refs,
            sourceNotes: grammarPoint.source_notes,
            validationNotes: grammarPoint.validation_notes,
            validatedAgainst: grammarPoint.validated_against,
            methodistReviewStatus: grammarPoint.methodist_review_status,
          };
        });

      const dialogues = rows.dialogues
        .filter((row) => row.lesson_id === lessonId)
        .sort(byDisplayOrder)
        .map((dialogueRow) => ({
          id: dialogueRow.id,
          type: "dialogue" as const,
          title: dialogueRow.title,
          context: dialogueRow.context ?? undefined,
          lines: (dialogueLinesByDialogueId.get(dialogueRow.id) ?? [])
            .slice()
            .sort(byDisplayOrder)
            .map((lineRow) => ({
              id: lineRow.id,
              speaker: lineRow.speaker,
              kyrgyz: lineRow.kyrgyz,
              transliteration: lineRow.transliteration ?? undefined,
              translations: lineRow.translations,
              audio: lineRow.audio_placeholder,
            })),
          breakdownItems: mapBreakdownItems(
            breakdownItemsBySourceId.get(`dialogue:${dialogueRow.id}`) ?? [],
            breakdownVocabularyByItemId,
            breakdownGrammarByItemId,
          ),
          linkedVocabularyIds: dialogueRow.linked_vocabulary_ids,
          linkedGrammarPointIds: dialogueRow.linked_grammar_point_ids,
          audio: dialogueRow.audio_placeholder,
          readingSourceType: dialogueRow.reading_source_type,
          rightsNotes: dialogueRow.rights_notes,
          sourceNotes: dialogueRow.source_notes,
          naturalnessReviewStatus: dialogueRow.naturalness_review_status,
          methodistReviewStatus: dialogueRow.methodist_review_status,
          isOriginalContent: dialogueRow.is_original_content,
          requiresLicense: dialogueRow.requires_license,
        }));

      const exercises = (exercisesByLessonId.get(lessonId) ?? [])
        .slice()
        .sort(byDisplayOrder)
        .map((exerciseRow) => ({
          id: exerciseRow.id,
          kind: exerciseRow.kind,
          prompt: exerciseRow.prompt,
          helperTextByTrack: exerciseRow.helper_text_by_track,
          linkedVocabularyIds: rows.exercise_vocabulary
            .filter((row) => row.exercise_id === exerciseRow.id)
            .sort(byDisplayOrder)
            .map((row) => row.vocabulary_item_id),
          linkedGrammarPointIds: rows.exercise_grammar_points
            .filter((row) => row.exercise_id === exerciseRow.id)
            .sort(byDisplayOrder)
            .map((row) => row.grammar_point_id),
          items: (exerciseItemsByExerciseId.get(exerciseRow.id) ?? [])
            .slice()
            .sort(byDisplayOrder)
            .map((itemRow) => {
              const answer = requireFirst(
                exerciseAnswersByItemId.get(itemRow.id),
                `answer for exercise item ${itemRow.id}`,
              );
              const feedback = requireRow(
                exerciseFeedbackByItemId,
                itemRow.id,
                "exercise feedback",
              );
              const options = (exerciseOptionsByItemId.get(itemRow.id) ?? [])
                .slice()
                .sort(byDisplayOrder)
                .map((optionRow) => ({
                  id: optionRow.id,
                  text: optionRow.option_text,
                }));

              return {
                id: itemRow.id,
                question: itemRow.question,
                ...(options.length > 0 ? { options } : {}),
                correctAnswerData: {
                  kind: answer.answer_kind,
                  value: answer.value,
                },
                ...(itemRow.audio_placeholder ? { audio: itemRow.audio_placeholder } : {}),
                explanation: itemRow.explanation,
                feedback: {
                  correct: feedback.correct_feedback,
                  incorrect: feedback.incorrect_feedback,
                  hint: feedback.hint,
                },
              };
            }),
          hskInspiredComponent: exerciseRow.hsk_inspired_components,
          sourceNotes: exerciseRow.source_notes,
          methodistReviewStatus: exerciseRow.methodist_review_status,
        }));

      return lessonSchema.parse({
        id: lessonRow.id,
        schemaVersion: lessonRow.schema_version,
        levelId: lessonRow.level_id,
        unitId: lessonRow.unit_id,
        order: lessonRow.display_order,
        lessonNumber: lessonRow.lesson_number,
        stableLessonId: lessonRow.stable_lesson_id,
        estimatedDurationMinutes: lessonRow.estimated_duration_minutes,
        prerequisites,
        learningGoals,
        targetSkills,
        supportedTracks,
        sampleNotice: lessonRow.sample_notice,
        validationTodos: lessonRow.validation_todos,
        title: lessonRow.title,
        subtitle: lessonRow.subtitle,
        story: lessonRow.story,
        vocabulary,
        dialogues,
        texts: lessonRow.texts,
        grammarPoints,
        exercises,
        miniGame: lessonRow.mini_game,
        speakingPrompt: lessonRow.speaking_prompt,
        aiRoleplay: lessonRow.ai_roleplay,
        review: lessonRow.review,
        contentStatus: lessonRow.content_status,
        methodistReviewStatus: lessonRow.methodist_review_status,
        isDemoContent: lessonRow.is_demo_content,
        internalNotes: lessonRow.internal_notes,
        methodistNotes: lessonRow.methodist_notes,
        methodologyRefs: lessonRow.methodology_refs,
        sourceNotes: lessonRow.source_notes,
        rightsNotes: lessonRow.rights_notes,
        validatedAgainst: lessonRow.validated_against,
        hskInspiredComponent: lessonRow.hsk_inspired_components,
        kyrgyztestLevel: lessonRow.kyrgyztest_level,
        cefrLevelPlaceholder: lessonRow.cefr_level_placeholder,
        requiresLicense: lessonRow.requires_license,
        isOriginalContent: lessonRow.is_original_content,
      });
    });
}

export function validateDbSeedRoundtrip(rows: Slice1DbRows): Lesson[] {
  return lessonSchema.array().parse(mapDbRowsToLessons(rows));
}

export function getDbRowCounts(rows: Slice1DbRows): Record<RowCollectionName, number> {
  return Object.fromEntries(
    (Object.keys(rows) as RowCollectionName[]).map((key) => [key, rows[key].length]),
  ) as Record<RowCollectionName, number>;
}

export function sourceIdFromRef(ref: string): string {
  const normalized = ref
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.length > 0 ? `source-${normalized}` : "source-unknown";
}

function createEmptyRows(): Slice1DbRows {
  return {
    sources: [],
    levels: [],
    units: [],
    lessons: [],
    lesson_learning_goals: [],
    lesson_tracks: [],
    lesson_target_skills: [],
    lesson_prerequisites: [],
    lesson_methodology_refs: [],
    vocabulary_items: [],
    lesson_vocabulary: [],
    grammar_points: [],
    lesson_grammar_points: [],
    dialogues: [],
    dialogue_lines: [],
    breakdown_items: [],
    breakdown_vocabulary: [],
    breakdown_grammar_points: [],
    exercises: [],
    exercise_items: [],
    exercise_options: [],
    exercise_answers: [],
    exercise_feedback: [],
    exercise_vocabulary: [],
    exercise_grammar_points: [],
  };
}

function addLessonSources(
  lesson: Lesson,
  rows: Slice1DbRows,
  sourceIds: Set<string>,
) {
  const refs = Array.from(
    new Set([
      ...lesson.methodologyRefs,
      ...lesson.story.methodologyRefs,
      ...lesson.review.methodologyRefs,
      ...lesson.grammarPoints.flatMap((grammarPoint) => grammarPoint.methodologyRefs),
    ]),
  );

  refs.forEach((ref, index) => {
    const sourceId = sourceIdFromRef(ref);

    if (!sourceIds.has(sourceId)) {
      rows.sources.push({
        id: sourceId,
        title: ref,
        category: "methodology",
        language: "mixed",
        rights_status: "methodology_only",
        usage_permission: "methodology_only",
        reference_url: null,
        notes:
          "Internal methodology/source reference imported from TypeScript seed content.",
      });
      sourceIds.add(sourceId);
    }

    rows.lesson_methodology_refs.push({
      lesson_id: lesson.id,
      source_id: sourceId,
      relationship_type: "methodology_ref",
      hsk_component: null,
      display_order: index + 1,
    });
  });
}

function addBreakdownLinks(
  breakdownItem: Lesson["dialogues"][number]["breakdownItems"][number],
  rows: Slice1DbRows,
  displayOrder: number,
) {
  const vocabularyRows: BreakdownVocabularyRow[] =
    breakdownItem.linkedVocabularyIds.map((vocabularyItemId, index) => ({
      breakdown_item_id: breakdownItem.id,
      vocabulary_item_id: vocabularyItemId,
      display_order: index + 1,
    }));
  const grammarRows: BreakdownGrammarPointRow[] =
    breakdownItem.linkedGrammarPointIds.map((grammarPointId, index) => ({
      breakdown_item_id: breakdownItem.id,
      grammar_point_id: grammarPointId,
      display_order: index + 1,
    }));

  rows.breakdown_vocabulary.push(...vocabularyRows);
  rows.breakdown_grammar_points.push(...grammarRows);

  if (vocabularyRows.length === 0 && grammarRows.length === 0 && displayOrder < 1) {
    throw new Error(`Invalid breakdown display order for ${breakdownItem.id}.`);
  }
}

function inferOptionGroup(
  exerciseKind: ExerciseKind,
  optionId: string,
): ExerciseOptionRow["option_group"] {
  if (exerciseKind === "sentence_builder") {
    return "tile";
  }

  if (exerciseKind === "match_pairs") {
    if (optionId.startsWith("left-")) {
      return "left";
    }

    if (optionId.startsWith("right-")) {
      return "right";
    }
  }

  return "choice";
}

function formatAnswerDisplayValue(
  value: Lesson["exercises"][number]["items"][number]["correctAnswerData"]["value"],
): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.join(" ");
  }

  return Object.entries(value)
    .map(([left, right]) => `${left} -> ${right}`)
    .join("; ");
}

function assertSupportedSlice1ExerciseKind(
  kind: ExerciseKind,
): SupportedSlice1ExerciseKind {
  if (
    supportedSlice1ExerciseKinds.includes(kind as SupportedSlice1ExerciseKind)
  ) {
    return kind as SupportedSlice1ExerciseKind;
  }

  throw new Error(`Exercise kind ${kind} is outside the Slice 1 migration scope.`);
}

function groupLessonsByLevel(lessons: Lesson[]) {
  return groupBy(lessons, (lesson) => lesson.levelId);
}

function deriveLevelsFromLessons(lessonsByLevel: Map<string, Lesson[]>): Level[] {
  return Array.from(lessonsByLevel.entries())
    .sort(([levelA], [levelB]) => levelA.localeCompare(levelB))
    .map(([levelId]) => ({
      id: levelId as Level["id"],
      title: { ky: levelId, en: levelId, ru: levelId },
      description: { ky: levelId, en: levelId, ru: levelId },
      unitIds: [],
    }));
}

function deriveUnitsFromLessons(lessons: Lesson[]): Unit[] {
  const unitsById = new Map<string, Unit>();

  lessons.forEach((lesson) => {
    if (!unitsById.has(lesson.unitId)) {
      unitsById.set(lesson.unitId, {
        id: lesson.unitId,
        levelId: lesson.levelId,
        title: {
          ky: lesson.unitId,
          en: lesson.unitId,
          ru: lesson.unitId,
        },
        description: {
          ky: lesson.unitId,
          en: lesson.unitId,
          ru: lesson.unitId,
        },
        lessonIds: [],
      });
    }

    unitsById.get(lesson.unitId)?.lessonIds.push(lesson.id);
  });

  return Array.from(unitsById.values());
}

function mapBreakdownItems(
  breakdownRows: Slice1DbRows["breakdown_items"],
  vocabularyLinksByItemId: Map<string, Slice1DbRows["breakdown_vocabulary"]>,
  grammarLinksByItemId: Map<string, Slice1DbRows["breakdown_grammar_points"]>,
) {
  return breakdownRows
    .slice()
    .sort(byDisplayOrder)
    .map((breakdownRow) => ({
      id: breakdownRow.id,
      phrase: breakdownRow.phrase,
      meaningByTrack: breakdownRow.meaning_by_track,
      notesByTrack: breakdownRow.notes_by_track,
      linkedVocabularyIds: (vocabularyLinksByItemId.get(breakdownRow.id) ?? [])
        .slice()
        .sort(byDisplayOrder)
        .map((row) => row.vocabulary_item_id),
      linkedGrammarPointIds: (grammarLinksByItemId.get(breakdownRow.id) ?? [])
        .slice()
        .sort(byDisplayOrder)
        .map((row) => row.grammar_point_id),
      methodistReviewStatus: breakdownRow.methodist_review_status,
      sourceNotes: breakdownRow.source_notes,
    }));
}

function sortRows(rows: Slice1DbRows): Slice1DbRows {
  return {
    sources: rows.sources.sort(byId),
    levels: rows.levels.sort(byDisplayOrder),
    units: rows.units.sort(byDisplayOrder),
    lessons: rows.lessons.sort(byLessonHierarchyOrder),
    lesson_learning_goals: rows.lesson_learning_goals.sort(byLessonThenDisplayOrder),
    lesson_tracks: rows.lesson_tracks.sort(byLessonThenDisplayOrder),
    lesson_target_skills: rows.lesson_target_skills.sort(byLessonThenDisplayOrder),
    lesson_prerequisites: rows.lesson_prerequisites.sort(byLessonThenDisplayOrder),
    lesson_methodology_refs: rows.lesson_methodology_refs.sort(
      byLessonThenDisplayOrder,
    ),
    vocabulary_items: rows.vocabulary_items.sort(byId),
    lesson_vocabulary: rows.lesson_vocabulary.sort(byLessonThenDisplayOrder),
    grammar_points: rows.grammar_points.sort(byId),
    lesson_grammar_points: rows.lesson_grammar_points.sort(byLessonThenDisplayOrder),
    dialogues: rows.dialogues.sort(byLessonThenDisplayOrder),
    dialogue_lines: rows.dialogue_lines.sort(byDialogueThenDisplayOrder),
    breakdown_items: rows.breakdown_items.sort(byLessonThenDisplayOrder),
    breakdown_vocabulary: rows.breakdown_vocabulary.sort(
      byBreakdownThenDisplayOrder,
    ),
    breakdown_grammar_points: rows.breakdown_grammar_points.sort(
      byBreakdownThenDisplayOrder,
    ),
    exercises: rows.exercises.sort(byLessonThenDisplayOrder),
    exercise_items: rows.exercise_items.sort(byExerciseThenDisplayOrder),
    exercise_options: rows.exercise_options.sort(byExerciseItemThenDisplayOrder),
    exercise_answers: rows.exercise_answers.sort(byExerciseItemThenId),
    exercise_feedback: rows.exercise_feedback.sort(byExerciseItemThenId),
    exercise_vocabulary: rows.exercise_vocabulary.sort(byExerciseThenDisplayOrder),
    exercise_grammar_points: rows.exercise_grammar_points.sort(
      byExerciseThenDisplayOrder,
    ),
  };
}

function groupBy<T, K>(items: T[], getKey: (item: T) => K): Map<K, T[]> {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
    return groups;
  }, new Map<K, T[]>());
}

function requireRow<K, T>(rowsByKey: Map<K, T>, key: K, label: string): T {
  const row = rowsByKey.get(key);

  if (!row) {
    throw new Error(`Missing ${label}: ${String(key)}`);
  }

  return row;
}

function requireFirst<T>(rows: T[] | undefined, label: string): T {
  if (!rows?.length) {
    throw new Error(`Missing ${label}.`);
  }

  return rows[0];
}

function byId<T extends { id: string }>(a: T, b: T) {
  return a.id.localeCompare(b.id);
}

function byDisplayOrder<T extends { display_order: number }>(a: T, b: T) {
  return a.display_order - b.display_order;
}

function byLessonHierarchyOrder<
  T extends { level_id: string; unit_id: string; display_order: number },
>(a: T, b: T) {
  return (
    a.level_id.localeCompare(b.level_id) ||
    a.unit_id.localeCompare(b.unit_id) ||
    a.display_order - b.display_order
  );
}

function byLessonThenDisplayOrder<
  T extends { lesson_id: string; display_order: number },
>(a: T, b: T) {
  return (
    a.lesson_id.localeCompare(b.lesson_id) ||
    a.display_order - b.display_order
  );
}

function byDialogueThenDisplayOrder<
  T extends { dialogue_id: string; display_order: number },
>(a: T, b: T) {
  return (
    a.dialogue_id.localeCompare(b.dialogue_id) ||
    a.display_order - b.display_order
  );
}

function byExerciseThenDisplayOrder<
  T extends { exercise_id: string; display_order: number },
>(a: T, b: T) {
  return (
    a.exercise_id.localeCompare(b.exercise_id) ||
    a.display_order - b.display_order
  );
}

function byExerciseItemThenDisplayOrder<
  T extends { exercise_item_id: string; display_order: number },
>(a: T, b: T) {
  return (
    a.exercise_item_id.localeCompare(b.exercise_item_id) ||
    a.display_order - b.display_order
  );
}

function byExerciseItemThenId<
  T extends { exercise_item_id: string; id?: string },
>(a: T, b: T) {
  return (
    a.exercise_item_id.localeCompare(b.exercise_item_id) ||
    (a.id ?? "").localeCompare(b.id ?? "")
  );
}

function byBreakdownThenDisplayOrder<
  T extends { breakdown_item_id: string; display_order: number },
>(a: T, b: T) {
  return (
    a.breakdown_item_id.localeCompare(b.breakdown_item_id) ||
    a.display_order - b.display_order
  );
}
