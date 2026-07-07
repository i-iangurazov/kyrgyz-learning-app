-- Slice 1 content schema for the Kyrgyz learning app.
-- This migration stores current lesson-v2 seed content only.
-- It intentionally excludes auth, learner progress, media storage, SRS,
-- AI roleplay runtime tables, speaking tables, mini-game tables, CMS,
-- content versioning, and audit logs.

create table public.sources (
  id text primary key,
  title text not null,
  category text not null,
  language text not null,
  rights_status text not null,
  usage_permission text not null,
  reference_url text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sources_category_check check (
    category in (
      'methodology',
      'grammar_reference',
      'level_alignment',
      'kyrgyz_as_foreign_language',
      'school_curriculum',
      'literature',
      'folklore',
      'public_domain',
      'licensed',
      'internal_original'
    )
  ),
  constraint sources_rights_status_check check (
    rights_status in (
      'unknown',
      'methodology_only',
      'validation_only',
      'public_domain',
      'licensed',
      'permission_granted',
      'original_app_authored',
      'blocked'
    )
  ),
  constraint sources_usage_permission_check check (
    usage_permission in (
      'methodology_only',
      'validation_only',
      'theme_planning_only',
      'copy_allowed',
      'adaptation_allowed',
      'excerpt_allowed',
      'not_allowed'
    )
  )
);

create table public.levels (
  id text primary key,
  title jsonb not null,
  description jsonb not null,
  display_order integer not null,
  kyrgyztest_level text not null,
  cefr_placeholder text not null,
  constraint levels_id_check check (id in ('K0', 'K1', 'K2', 'K3', 'K4', 'K5')),
  constraint levels_display_order_check check (display_order > 0),
  constraint levels_title_object_check check (jsonb_typeof(title) = 'object'),
  constraint levels_description_object_check check (jsonb_typeof(description) = 'object')
);

create table public.units (
  id text primary key,
  level_id text not null references public.levels(id) on delete restrict,
  title jsonb not null,
  description jsonb not null,
  display_order integer not null,
  content_status text not null,
  methodist_review_status text not null,
  constraint units_display_order_check check (display_order > 0),
  constraint units_title_object_check check (jsonb_typeof(title) = 'object'),
  constraint units_description_object_check check (jsonb_typeof(description) = 'object'),
  constraint units_content_status_check check (
    content_status in ('demo', 'draft', 'in_review', 'approved', 'published', 'archived')
  ),
  constraint units_methodist_review_status_check check (
    methodist_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  ),
  constraint units_level_order_unique unique (level_id, display_order)
);

create table public.lessons (
  id text primary key,
  schema_version text not null,
  level_id text not null references public.levels(id) on delete restrict,
  unit_id text not null references public.units(id) on delete restrict,
  stable_lesson_id text not null unique,
  lesson_number integer not null,
  display_order integer not null,
  title jsonb not null,
  subtitle jsonb not null,
  story jsonb not null,
  estimated_duration_minutes integer not null,
  sample_notice text not null,
  validation_todos jsonb not null,
  content_status text not null,
  methodist_review_status text not null,
  is_demo_content boolean not null,
  is_original_content boolean not null,
  requires_license boolean not null,
  source_notes text not null,
  rights_notes text not null,
  internal_notes jsonb not null,
  methodist_notes jsonb not null,
  methodology_refs jsonb not null,
  validated_against jsonb not null,
  hsk_inspired_components jsonb not null,
  kyrgyztest_level text not null,
  cefr_level_placeholder text not null,
  texts jsonb not null default '[]'::jsonb,
  mini_game jsonb not null,
  speaking_prompt jsonb not null,
  ai_roleplay jsonb not null,
  review jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_schema_version_check check (schema_version = 'lesson-v2'),
  constraint lessons_lesson_number_check check (lesson_number > 0),
  constraint lessons_display_order_check check (display_order > 0),
  constraint lessons_duration_check check (estimated_duration_minutes between 5 and 20),
  constraint lessons_title_object_check check (jsonb_typeof(title) = 'object'),
  constraint lessons_subtitle_object_check check (jsonb_typeof(subtitle) = 'object'),
  constraint lessons_story_object_check check (jsonb_typeof(story) = 'object'),
  constraint lessons_validation_todos_array_check check (jsonb_typeof(validation_todos) = 'array'),
  constraint lessons_internal_notes_array_check check (jsonb_typeof(internal_notes) = 'array'),
  constraint lessons_methodist_notes_array_check check (jsonb_typeof(methodist_notes) = 'array'),
  constraint lessons_methodology_refs_array_check check (jsonb_typeof(methodology_refs) = 'array'),
  constraint lessons_validated_against_array_check check (jsonb_typeof(validated_against) = 'array'),
  constraint lessons_hsk_components_array_check check (jsonb_typeof(hsk_inspired_components) = 'array'),
  constraint lessons_texts_array_check check (jsonb_typeof(texts) = 'array'),
  constraint lessons_mini_game_object_check check (jsonb_typeof(mini_game) = 'object'),
  constraint lessons_speaking_prompt_object_check check (jsonb_typeof(speaking_prompt) = 'object'),
  constraint lessons_ai_roleplay_object_check check (jsonb_typeof(ai_roleplay) = 'object'),
  constraint lessons_review_object_check check (jsonb_typeof(review) = 'object'),
  constraint lessons_content_status_check check (
    content_status in ('demo', 'draft', 'in_review', 'approved', 'published', 'archived')
  ),
  constraint lessons_methodist_review_status_check check (
    methodist_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  ),
  constraint lessons_unit_number_unique unique (unit_id, lesson_number)
);

create table public.lesson_learning_goals (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  goal_text jsonb not null,
  display_order integer not null,
  constraint lesson_learning_goals_goal_text_object_check check (jsonb_typeof(goal_text) = 'object'),
  constraint lesson_learning_goals_display_order_check check (display_order > 0),
  constraint lesson_learning_goals_lesson_order_unique unique (lesson_id, display_order)
);

create table public.lesson_tracks (
  lesson_id text not null references public.lessons(id) on delete cascade,
  track text not null,
  display_order integer not null,
  primary key (lesson_id, track),
  constraint lesson_tracks_track_check check (track in ('RU_KY', 'EN_KY', 'KY_KY')),
  constraint lesson_tracks_display_order_check check (display_order > 0),
  constraint lesson_tracks_lesson_order_unique unique (lesson_id, display_order)
);

create table public.lesson_target_skills (
  lesson_id text not null references public.lessons(id) on delete cascade,
  target_skill text not null,
  display_order integer not null,
  primary key (lesson_id, target_skill),
  constraint lesson_target_skills_skill_check check (
    target_skill in ('reading', 'listening', 'speaking', 'grammar', 'vocabulary', 'writing')
  ),
  constraint lesson_target_skills_display_order_check check (display_order > 0),
  constraint lesson_target_skills_lesson_order_unique unique (lesson_id, display_order)
);

create table public.lesson_prerequisites (
  lesson_id text not null references public.lessons(id) on delete cascade,
  prerequisite_lesson_id text not null references public.lessons(id) on delete restrict,
  display_order integer not null,
  primary key (lesson_id, prerequisite_lesson_id),
  constraint lesson_prerequisites_display_order_check check (display_order > 0)
);

create table public.lesson_methodology_refs (
  lesson_id text not null references public.lessons(id) on delete cascade,
  source_id text not null references public.sources(id) on delete restrict,
  relationship_type text not null,
  hsk_component text,
  display_order integer not null,
  primary key (lesson_id, source_id, relationship_type),
  constraint lesson_methodology_refs_relationship_check check (
    relationship_type in ('methodology_ref', 'source_note', 'validation_ref')
  ),
  constraint lesson_methodology_refs_display_order_check check (display_order > 0)
);

create table public.vocabulary_items (
  id text primary key,
  kyrgyz text not null,
  transliteration text,
  translations jsonb not null,
  example jsonb not null,
  audio_placeholder jsonb not null,
  tags jsonb not null default '[]'::jsonb,
  linked_lesson_ids jsonb not null,
  source_notes text not null,
  rights_notes text not null,
  methodist_review_status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vocabulary_translations_object_check check (jsonb_typeof(translations) = 'object'),
  constraint vocabulary_example_object_check check (jsonb_typeof(example) = 'object'),
  constraint vocabulary_audio_object_check check (jsonb_typeof(audio_placeholder) = 'object'),
  constraint vocabulary_tags_array_check check (jsonb_typeof(tags) = 'array'),
  constraint vocabulary_linked_lesson_ids_array_check check (jsonb_typeof(linked_lesson_ids) = 'array'),
  constraint vocabulary_methodist_review_status_check check (
    methodist_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  )
);

create table public.lesson_vocabulary (
  lesson_id text not null references public.lessons(id) on delete cascade,
  vocabulary_item_id text not null references public.vocabulary_items(id) on delete restrict,
  display_order integer not null,
  introduced_here boolean not null default true,
  primary key (lesson_id, vocabulary_item_id),
  constraint lesson_vocabulary_display_order_check check (display_order > 0),
  constraint lesson_vocabulary_lesson_order_unique unique (lesson_id, display_order)
);

create table public.grammar_points (
  id text primary key,
  level_id text not null references public.levels(id) on delete restrict,
  title jsonb not null,
  simple_rule jsonb not null,
  explanations_by_track jsonb not null,
  examples jsonb not null,
  common_mistakes jsonb not null default '[]'::jsonb,
  micro_practice_prompts jsonb not null default '[]'::jsonb,
  linked_exercise_ids jsonb not null default '[]'::jsonb,
  methodology_refs jsonb not null,
  source_notes text not null,
  validation_notes text not null,
  validated_against jsonb not null,
  methodist_review_status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grammar_title_object_check check (jsonb_typeof(title) = 'object'),
  constraint grammar_simple_rule_object_check check (jsonb_typeof(simple_rule) = 'object'),
  constraint grammar_explanations_object_check check (jsonb_typeof(explanations_by_track) = 'object'),
  constraint grammar_examples_array_check check (jsonb_typeof(examples) = 'array'),
  constraint grammar_common_mistakes_array_check check (jsonb_typeof(common_mistakes) = 'array'),
  constraint grammar_micro_practice_array_check check (jsonb_typeof(micro_practice_prompts) = 'array'),
  constraint grammar_linked_exercise_ids_array_check check (jsonb_typeof(linked_exercise_ids) = 'array'),
  constraint grammar_methodology_refs_array_check check (jsonb_typeof(methodology_refs) = 'array'),
  constraint grammar_validated_against_array_check check (jsonb_typeof(validated_against) = 'array'),
  constraint grammar_methodist_review_status_check check (
    methodist_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  )
);

create table public.lesson_grammar_points (
  lesson_id text not null references public.lessons(id) on delete cascade,
  grammar_point_id text not null references public.grammar_points(id) on delete restrict,
  display_order integer not null,
  introduced_here boolean not null default true,
  primary key (lesson_id, grammar_point_id),
  constraint lesson_grammar_points_display_order_check check (display_order > 0),
  constraint lesson_grammar_points_lesson_order_unique unique (lesson_id, display_order)
);

create table public.dialogues (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  title jsonb not null,
  context jsonb,
  reading_source_type text not null,
  rights_notes text not null,
  source_notes text not null,
  naturalness_review_status text not null,
  methodist_review_status text not null,
  is_original_content boolean not null,
  requires_license boolean not null,
  audio_placeholder jsonb not null,
  linked_vocabulary_ids jsonb not null default '[]'::jsonb,
  linked_grammar_point_ids jsonb not null default '[]'::jsonb,
  display_order integer not null,
  constraint dialogues_title_object_check check (jsonb_typeof(title) = 'object'),
  constraint dialogues_context_object_check check (context is null or jsonb_typeof(context) = 'object'),
  constraint dialogues_audio_object_check check (jsonb_typeof(audio_placeholder) = 'object'),
  constraint dialogues_linked_vocabulary_array_check check (jsonb_typeof(linked_vocabulary_ids) = 'array'),
  constraint dialogues_linked_grammar_array_check check (jsonb_typeof(linked_grammar_point_ids) = 'array'),
  constraint dialogues_display_order_check check (display_order > 0),
  constraint dialogues_reading_source_type_check check (
    reading_source_type in ('original', 'adapted', 'public_domain', 'licensed', 'excerpt_requires_permission')
  ),
  constraint dialogues_naturalness_review_status_check check (
    naturalness_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  ),
  constraint dialogues_methodist_review_status_check check (
    methodist_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  ),
  constraint dialogues_lesson_order_unique unique (lesson_id, display_order)
);

create table public.dialogue_lines (
  id text primary key,
  dialogue_id text not null references public.dialogues(id) on delete cascade,
  speaker text not null,
  kyrgyz text not null,
  transliteration text,
  translations jsonb not null,
  audio_placeholder jsonb not null,
  display_order integer not null,
  constraint dialogue_lines_translations_object_check check (jsonb_typeof(translations) = 'object'),
  constraint dialogue_lines_audio_object_check check (jsonb_typeof(audio_placeholder) = 'object'),
  constraint dialogue_lines_display_order_check check (display_order > 0),
  constraint dialogue_lines_dialogue_order_unique unique (dialogue_id, display_order)
);

create table public.breakdown_items (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  source_content_type text not null,
  source_content_id text not null,
  phrase text not null,
  meaning_by_track jsonb not null,
  notes_by_track jsonb not null default '{}'::jsonb,
  source_notes text not null,
  methodist_review_status text not null,
  display_order integer not null,
  constraint breakdown_source_content_type_check check (
    source_content_type in ('dialogue', 'reading_text')
  ),
  constraint breakdown_meaning_object_check check (jsonb_typeof(meaning_by_track) = 'object'),
  constraint breakdown_notes_object_check check (jsonb_typeof(notes_by_track) = 'object'),
  constraint breakdown_display_order_check check (display_order > 0),
  constraint breakdown_methodist_review_status_check check (
    methodist_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  ),
  constraint breakdown_lesson_order_unique unique (lesson_id, display_order)
);

create table public.breakdown_vocabulary (
  breakdown_item_id text not null references public.breakdown_items(id) on delete cascade,
  vocabulary_item_id text not null references public.vocabulary_items(id) on delete restrict,
  display_order integer not null,
  primary key (breakdown_item_id, vocabulary_item_id),
  constraint breakdown_vocabulary_display_order_check check (display_order > 0)
);

create table public.breakdown_grammar_points (
  breakdown_item_id text not null references public.breakdown_items(id) on delete cascade,
  grammar_point_id text not null references public.grammar_points(id) on delete restrict,
  display_order integer not null,
  primary key (breakdown_item_id, grammar_point_id),
  constraint breakdown_grammar_points_display_order_check check (display_order > 0)
);

create table public.exercises (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  kind text not null,
  prompt jsonb not null,
  helper_text_by_track jsonb not null,
  hsk_inspired_components jsonb not null,
  source_notes text not null,
  methodist_review_status text not null,
  display_order integer not null,
  constraint exercises_kind_check check (
    kind in ('multiple_choice', 'fill_blank', 'sentence_builder', 'match_pairs', 'error_correction')
  ),
  constraint exercises_prompt_object_check check (jsonb_typeof(prompt) = 'object'),
  constraint exercises_helper_object_check check (jsonb_typeof(helper_text_by_track) = 'object'),
  constraint exercises_hsk_components_array_check check (jsonb_typeof(hsk_inspired_components) = 'array'),
  constraint exercises_display_order_check check (display_order > 0),
  constraint exercises_methodist_review_status_check check (
    methodist_review_status in ('not_reviewed', 'needs_revision', 'reviewed', 'approved')
  ),
  constraint exercises_lesson_order_unique unique (lesson_id, display_order)
);

create table public.exercise_items (
  id text primary key,
  exercise_id text not null references public.exercises(id) on delete cascade,
  question jsonb not null,
  explanation jsonb not null,
  audio_placeholder jsonb,
  display_order integer not null,
  constraint exercise_items_question_object_check check (jsonb_typeof(question) = 'object'),
  constraint exercise_items_explanation_object_check check (jsonb_typeof(explanation) = 'object'),
  constraint exercise_items_audio_object_check check (
    audio_placeholder is null or jsonb_typeof(audio_placeholder) = 'object'
  ),
  constraint exercise_items_display_order_check check (display_order > 0),
  constraint exercise_items_exercise_order_unique unique (exercise_id, display_order)
);

create table public.exercise_options (
  id text primary key,
  exercise_item_id text not null references public.exercise_items(id) on delete cascade,
  option_text jsonb not null,
  option_group text,
  display_order integer not null,
  metadata jsonb not null default '{}'::jsonb,
  constraint exercise_options_text_object_check check (jsonb_typeof(option_text) = 'object'),
  constraint exercise_options_metadata_object_check check (jsonb_typeof(metadata) = 'object'),
  constraint exercise_options_display_order_check check (display_order > 0),
  constraint exercise_options_item_order_unique unique (exercise_item_id, display_order)
);

create table public.exercise_answers (
  id text primary key,
  exercise_item_id text not null references public.exercise_items(id) on delete cascade,
  answer_kind text not null,
  value jsonb not null,
  accepted_alternatives jsonb not null default '[]'::jsonb,
  display_value text not null,
  is_primary boolean not null default true,
  constraint exercise_answers_kind_check check (
    answer_kind in ('choice_id', 'text', 'ordered_ids', 'pairs', 'free_text')
  ),
  constraint exercise_answers_accepted_alternatives_array_check check (
    jsonb_typeof(accepted_alternatives) = 'array'
  )
);

create table public.exercise_feedback (
  exercise_item_id text primary key references public.exercise_items(id) on delete cascade,
  correct_feedback jsonb not null,
  incorrect_feedback jsonb not null,
  hint jsonb not null,
  constraint exercise_feedback_correct_object_check check (jsonb_typeof(correct_feedback) = 'object'),
  constraint exercise_feedback_incorrect_object_check check (jsonb_typeof(incorrect_feedback) = 'object'),
  constraint exercise_feedback_hint_object_check check (jsonb_typeof(hint) = 'object')
);

create table public.exercise_vocabulary (
  exercise_id text not null references public.exercises(id) on delete cascade,
  vocabulary_item_id text not null references public.vocabulary_items(id) on delete restrict,
  display_order integer not null,
  primary key (exercise_id, vocabulary_item_id),
  constraint exercise_vocabulary_display_order_check check (display_order > 0)
);

create table public.exercise_grammar_points (
  exercise_id text not null references public.exercises(id) on delete cascade,
  grammar_point_id text not null references public.grammar_points(id) on delete restrict,
  display_order integer not null,
  primary key (exercise_id, grammar_point_id),
  constraint exercise_grammar_points_display_order_check check (display_order > 0)
);

create index levels_display_order_idx on public.levels(display_order);
create index units_level_order_idx on public.units(level_id, display_order);
create index lessons_unit_order_idx on public.lessons(unit_id, display_order);
create index lessons_level_idx on public.lessons(level_id);
create index lesson_learning_goals_lesson_idx on public.lesson_learning_goals(lesson_id, display_order);
create index lesson_tracks_track_idx on public.lesson_tracks(track);
create index lesson_target_skills_skill_idx on public.lesson_target_skills(target_skill);
create index lesson_methodology_refs_source_idx on public.lesson_methodology_refs(source_id);
create index vocabulary_kyrgyz_idx on public.vocabulary_items(kyrgyz);
create index lesson_vocabulary_vocab_idx on public.lesson_vocabulary(vocabulary_item_id);
create index grammar_points_level_idx on public.grammar_points(level_id);
create index lesson_grammar_points_grammar_idx on public.lesson_grammar_points(grammar_point_id);
create index dialogues_lesson_idx on public.dialogues(lesson_id, display_order);
create index dialogue_lines_dialogue_idx on public.dialogue_lines(dialogue_id, display_order);
create index breakdown_items_lesson_idx on public.breakdown_items(lesson_id, display_order);
create index exercises_lesson_kind_idx on public.exercises(lesson_id, kind);
create index exercise_items_exercise_idx on public.exercise_items(exercise_id, display_order);
create index exercise_options_item_idx on public.exercise_options(exercise_item_id, display_order);
create index exercise_answers_item_idx on public.exercise_answers(exercise_item_id);
create index exercise_vocabulary_vocab_idx on public.exercise_vocabulary(vocabulary_item_id);
create index exercise_grammar_points_grammar_idx on public.exercise_grammar_points(grammar_point_id);
