import type {
  AudioAsset,
  Lesson,
  Level,
  LocalizedText,
  Unit,
} from "../schemas.ts";

export type ContentStatus = Lesson["contentStatus"];
export type MethodistReviewStatus = Lesson["methodistReviewStatus"];
export type LearningTrack = Lesson["supportedTracks"][number];
export type TargetSkill = Lesson["targetSkills"][number];
export type ExerciseKind = Lesson["exercises"][number]["kind"];
export type AnswerKind =
  Lesson["exercises"][number]["items"][number]["correctAnswerData"]["kind"];

export type SourceCategory =
  | "methodology"
  | "grammar_reference"
  | "level_alignment"
  | "kyrgyz_as_foreign_language"
  | "school_curriculum"
  | "literature"
  | "folklore"
  | "public_domain"
  | "licensed"
  | "internal_original";

export type RightsStatus =
  | "unknown"
  | "methodology_only"
  | "validation_only"
  | "public_domain"
  | "licensed"
  | "permission_granted"
  | "original_app_authored"
  | "blocked";

export type UsagePermission =
  | "methodology_only"
  | "validation_only"
  | "theme_planning_only"
  | "copy_allowed"
  | "adaptation_allowed"
  | "excerpt_allowed"
  | "not_allowed";

export type SourceRow = {
  id: string;
  title: string;
  category: SourceCategory;
  language: "ky" | "ru" | "en" | "mixed";
  rights_status: RightsStatus;
  usage_permission: UsagePermission;
  reference_url: string | null;
  notes: string;
};

export type LevelRow = {
  id: Level["id"];
  title: Level["title"];
  description: Level["description"];
  display_order: number;
  kyrgyztest_level: string;
  cefr_placeholder: string;
};

export type UnitRow = {
  id: Unit["id"];
  level_id: Unit["levelId"];
  title: Unit["title"];
  description: Unit["description"];
  display_order: number;
  content_status: ContentStatus;
  methodist_review_status: MethodistReviewStatus;
};

export type LessonRow = {
  id: Lesson["id"];
  schema_version: Lesson["schemaVersion"];
  level_id: Lesson["levelId"];
  unit_id: Lesson["unitId"];
  stable_lesson_id: Lesson["stableLessonId"];
  lesson_number: Lesson["lessonNumber"];
  display_order: Lesson["order"];
  title: Lesson["title"];
  subtitle: Lesson["subtitle"];
  story: Lesson["story"];
  estimated_duration_minutes: Lesson["estimatedDurationMinutes"];
  sample_notice: Lesson["sampleNotice"];
  validation_todos: Lesson["validationTodos"];
  content_status: ContentStatus;
  methodist_review_status: MethodistReviewStatus;
  is_demo_content: Lesson["isDemoContent"];
  is_original_content: Lesson["isOriginalContent"];
  requires_license: Lesson["requiresLicense"];
  source_notes: Lesson["sourceNotes"];
  rights_notes: Lesson["rightsNotes"];
  internal_notes: Lesson["internalNotes"];
  methodist_notes: Lesson["methodistNotes"];
  methodology_refs: Lesson["methodologyRefs"];
  validated_against: Lesson["validatedAgainst"];
  hsk_inspired_components: Lesson["hskInspiredComponent"];
  kyrgyztest_level: Lesson["kyrgyztestLevel"];
  cefr_level_placeholder: Lesson["cefrLevelPlaceholder"];
  texts: Lesson["texts"];
  mini_game: Lesson["miniGame"];
  speaking_prompt: Lesson["speakingPrompt"];
  ai_roleplay: Lesson["aiRoleplay"];
  review: Lesson["review"];
};

export type LessonLearningGoalRow = {
  id: string;
  lesson_id: Lesson["id"];
  goal_text: LocalizedText;
  display_order: number;
};

export type LessonTrackRow = {
  lesson_id: Lesson["id"];
  track: LearningTrack;
  display_order: number;
};

export type LessonTargetSkillRow = {
  lesson_id: Lesson["id"];
  target_skill: TargetSkill;
  display_order: number;
};

export type LessonPrerequisiteRow = {
  lesson_id: Lesson["id"];
  prerequisite_lesson_id: string;
  display_order: number;
};

export type LessonMethodologyRefRow = {
  lesson_id: Lesson["id"];
  source_id: SourceRow["id"];
  relationship_type: "methodology_ref" | "source_note" | "validation_ref";
  hsk_component: Lesson["hskInspiredComponent"][number] | null;
  display_order: number;
};

export type VocabularyItemRow = {
  id: Lesson["vocabulary"][number]["id"];
  kyrgyz: string;
  transliteration: string | null;
  translations: Lesson["vocabulary"][number]["translations"];
  example: Lesson["vocabulary"][number]["example"];
  audio_placeholder: AudioAsset;
  tags: string[];
  linked_lesson_ids: string[];
  source_notes: string;
  rights_notes: string;
  methodist_review_status: MethodistReviewStatus;
};

export type LessonVocabularyRow = {
  lesson_id: Lesson["id"];
  vocabulary_item_id: VocabularyItemRow["id"];
  display_order: number;
  introduced_here: boolean;
};

export type GrammarPointRow = {
  id: Lesson["grammarPoints"][number]["id"];
  level_id: Lesson["grammarPoints"][number]["level"];
  title: Lesson["grammarPoints"][number]["title"];
  simple_rule: Lesson["grammarPoints"][number]["simpleRule"];
  explanations_by_track: Lesson["grammarPoints"][number]["explanationsByTrack"];
  examples: Lesson["grammarPoints"][number]["examples"];
  common_mistakes: Lesson["grammarPoints"][number]["commonMistakes"];
  micro_practice_prompts: Lesson["grammarPoints"][number]["microPracticePrompts"];
  linked_exercise_ids: Lesson["grammarPoints"][number]["linkedExerciseIds"];
  methodology_refs: Lesson["grammarPoints"][number]["methodologyRefs"];
  source_notes: Lesson["grammarPoints"][number]["sourceNotes"];
  validation_notes: Lesson["grammarPoints"][number]["validationNotes"];
  validated_against: Lesson["grammarPoints"][number]["validatedAgainst"];
  methodist_review_status: MethodistReviewStatus;
};

export type LessonGrammarPointRow = {
  lesson_id: Lesson["id"];
  grammar_point_id: GrammarPointRow["id"];
  display_order: number;
  introduced_here: boolean;
};

export type DialogueRow = {
  id: Lesson["dialogues"][number]["id"];
  lesson_id: Lesson["id"];
  title: Lesson["dialogues"][number]["title"];
  context: Lesson["dialogues"][number]["context"] | null;
  reading_source_type: Lesson["dialogues"][number]["readingSourceType"];
  rights_notes: string;
  source_notes: string;
  naturalness_review_status: MethodistReviewStatus;
  methodist_review_status: MethodistReviewStatus;
  is_original_content: boolean;
  requires_license: boolean;
  audio_placeholder: AudioAsset;
  linked_vocabulary_ids: string[];
  linked_grammar_point_ids: string[];
  display_order: number;
};

export type DialogueLineRow = {
  id: Lesson["dialogues"][number]["lines"][number]["id"];
  dialogue_id: DialogueRow["id"];
  speaker: string;
  kyrgyz: string;
  transliteration: string | null;
  translations: Lesson["dialogues"][number]["lines"][number]["translations"];
  audio_placeholder: AudioAsset;
  display_order: number;
};

export type BreakdownItemRow = {
  id: Lesson["dialogues"][number]["breakdownItems"][number]["id"];
  lesson_id: Lesson["id"];
  source_content_type: "dialogue" | "reading_text";
  source_content_id: string;
  phrase: string;
  meaning_by_track: Lesson["dialogues"][number]["breakdownItems"][number]["meaningByTrack"];
  notes_by_track: Lesson["dialogues"][number]["breakdownItems"][number]["notesByTrack"];
  source_notes: string;
  methodist_review_status: MethodistReviewStatus;
  display_order: number;
};

export type BreakdownVocabularyRow = {
  breakdown_item_id: BreakdownItemRow["id"];
  vocabulary_item_id: VocabularyItemRow["id"];
  display_order: number;
};

export type BreakdownGrammarPointRow = {
  breakdown_item_id: BreakdownItemRow["id"];
  grammar_point_id: GrammarPointRow["id"];
  display_order: number;
};

export type ExerciseRow = {
  id: Lesson["exercises"][number]["id"];
  lesson_id: Lesson["id"];
  kind: Extract<
    ExerciseKind,
    | "multiple_choice"
    | "fill_blank"
    | "sentence_builder"
    | "match_pairs"
    | "error_correction"
  >;
  prompt: Lesson["exercises"][number]["prompt"];
  helper_text_by_track: Lesson["exercises"][number]["helperTextByTrack"];
  hsk_inspired_components: Lesson["exercises"][number]["hskInspiredComponent"];
  source_notes: string;
  methodist_review_status: MethodistReviewStatus;
  display_order: number;
};

export type ExerciseItemRow = {
  id: Lesson["exercises"][number]["items"][number]["id"];
  exercise_id: ExerciseRow["id"];
  question: Lesson["exercises"][number]["items"][number]["question"];
  explanation: Lesson["exercises"][number]["items"][number]["explanation"];
  audio_placeholder: AudioAsset | null;
  display_order: number;
};

export type ExerciseOptionRow = {
  id: NonNullable<
    Lesson["exercises"][number]["items"][number]["options"]
  >[number]["id"];
  exercise_item_id: ExerciseItemRow["id"];
  option_text: NonNullable<
    Lesson["exercises"][number]["items"][number]["options"]
  >[number]["text"];
  option_group: "left" | "right" | "tile" | "choice" | null;
  display_order: number;
  metadata: Record<string, string>;
};

export type ExerciseAnswerRow = {
  id: string;
  exercise_item_id: ExerciseItemRow["id"];
  answer_kind: AnswerKind;
  value: Lesson["exercises"][number]["items"][number]["correctAnswerData"]["value"];
  accepted_alternatives: string[];
  display_value: string;
  is_primary: boolean;
};

export type ExerciseFeedbackRow = {
  exercise_item_id: ExerciseItemRow["id"];
  correct_feedback: Lesson["exercises"][number]["items"][number]["feedback"]["correct"];
  incorrect_feedback: Lesson["exercises"][number]["items"][number]["feedback"]["incorrect"];
  hint: Lesson["exercises"][number]["items"][number]["feedback"]["hint"];
};

export type ExerciseVocabularyRow = {
  exercise_id: ExerciseRow["id"];
  vocabulary_item_id: VocabularyItemRow["id"];
  display_order: number;
};

export type ExerciseGrammarPointRow = {
  exercise_id: ExerciseRow["id"];
  grammar_point_id: GrammarPointRow["id"];
  display_order: number;
};

export type Slice1DbRows = {
  sources: SourceRow[];
  levels: LevelRow[];
  units: UnitRow[];
  lessons: LessonRow[];
  lesson_learning_goals: LessonLearningGoalRow[];
  lesson_tracks: LessonTrackRow[];
  lesson_target_skills: LessonTargetSkillRow[];
  lesson_prerequisites: LessonPrerequisiteRow[];
  lesson_methodology_refs: LessonMethodologyRefRow[];
  vocabulary_items: VocabularyItemRow[];
  lesson_vocabulary: LessonVocabularyRow[];
  grammar_points: GrammarPointRow[];
  lesson_grammar_points: LessonGrammarPointRow[];
  dialogues: DialogueRow[];
  dialogue_lines: DialogueLineRow[];
  breakdown_items: BreakdownItemRow[];
  breakdown_vocabulary: BreakdownVocabularyRow[];
  breakdown_grammar_points: BreakdownGrammarPointRow[];
  exercises: ExerciseRow[];
  exercise_items: ExerciseItemRow[];
  exercise_options: ExerciseOptionRow[];
  exercise_answers: ExerciseAnswerRow[];
  exercise_feedback: ExerciseFeedbackRow[];
  exercise_vocabulary: ExerciseVocabularyRow[];
  exercise_grammar_points: ExerciseGrammarPointRow[];
};
