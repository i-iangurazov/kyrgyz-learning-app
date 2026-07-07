# TTS Audio Pipeline

This document defines the temporary MVP pipeline for generating Kyrgyz lesson audio with built-in text-to-speech voices. It is a production aid, not a replacement for reviewed human recordings.

## Purpose

The MVP needs audio coverage for vocabulary, dialogue lines, reading paragraphs, grammar examples, and future listening prompts. Until human-recorded Kyrgyz audio is available, synthetic audio may be generated offline so the team can test lesson playback and listening workflows.

TTS audio must be treated as temporary unless it has passed product, methodist, pronunciation, and rights review.

## Hard Rules

- Do not clone any real person's voice.
- Do not imitate actors, celebrities, public figures, private people, or fictional characters.
- Do not create character or mascot voices for the MVP pipeline.
- Do not generate TTS at learner runtime.
- Do not require TTS provider API keys for normal build, tests, or local app use.
- Do not commit secrets.
- Do not label synthetic or unreviewed audio as native-speaker audio.
- Do not label synthetic or unreviewed audio as final production audio.
- Do not expose TTS provider, source notes, rights notes, storage keys, or review metadata in normal learner-facing UI.

## Review Rules

Synthetic audio can be used for internal MVP testing only while it has:

- `voiceType: synthetic`
- `audioReviewStatus: needs_review`
- methodist/audio review status recorded internally
- source and rights notes recorded internally

Before any generated audio is marked beta-approved, a Kyrgyz speaker or qualified reviewer must check:

- pronunciation
- stress and vowel quality
- pacing for the level
- naturalness
- match with the written transcript
- speaker/register fit for the lesson context
- absence of misleading "native quality" claims

Human-recorded Kyrgyz audio remains preferred for production.

## Manifest First

The pipeline starts with a generated manifest:

```bash
pnpm audio:manifest
```

The manifest is written to:

```text
test-results/audio/tts-manifest.json
```

This generated file is ignored by Git.

Each manifest item includes:

- stable audio ID
- lesson ID
- content type: `vocabulary`, `dialogue_line`, `reading_paragraph`, `grammar_example`, or `listening_prompt`
- source content ID
- text to speak
- language: `ky`
- suggested filename
- voice type: `synthetic`
- review status: `needs_audio_review`
- optional speaker label

Manifest IDs must be stable so generated files can be traced back to lesson, vocabulary, dialogue, reading, grammar, and future listening records.

## Dry Run

Before calling a TTS provider, run:

```bash
pnpm audio:generate:dry-run
```

Dry run behavior:

- reads the manifest
- prints the item count and sample output paths
- does not call a TTS provider
- does not require an API key
- does not write audio files

## Generation

Actual generation is explicit:

```bash
TTS_API_KEY=... pnpm audio:generate
```

Optional environment variables:

- `TTS_API_KEY` or `OPENAI_API_KEY`
- `TTS_VOICE`
- `TTS_MODEL`
- `TTS_API_URL`

Generated local files default to:

```text
test-results/audio/files/
```

Generated files are ignored by Git unless the team intentionally chooses to ship a small reviewed fixture later.

## Attachment Map

After manifest generation, dry-run review, and any intentional audio generation, create a reviewable attachment map:

```bash
pnpm audio:attachment-map
```

The attachment map is written to:

```text
test-results/audio/audio-attachment-map.json
```

This generated file is ignored by Git.

The attachment map:

- reads `test-results/audio/tts-manifest.json` when present
- generates the manifest in memory if the manifest file is missing
- checks for generated files under `test-results/audio/files/`
- records matching and missing files
- keeps `voiceType: synthetic`
- keeps `reviewStatus: needs_audio_review`
- does not mark anything approved
- does not mutate seed lessons

Missing files are expected before paid generation is intentionally run. They must be visible in the map rather than silently treated as success.

## End-To-End Offline Workflow

Recommended local workflow:

1. Run `pnpm audio:manifest`.
2. Run `pnpm audio:generate:dry-run`.
3. Run `pnpm audio:generate` only when intentionally generating audio with a provider key.
4. Run `pnpm audio:attachment-map`.
5. Review generated audio manually.
6. Attach reviewed audio to seed or DB content only in a later explicit task.
7. Keep synthetic audio marked as synthetic and in review until approved.
8. Never label synthetic or unreviewed audio as native-quality.

## Metadata Update Strategy

The current scripts do not automatically mutate seed lessons.

After generation, a future reviewed update step should:

- map generated file paths back to stable audio IDs
- update content audio references only after explicit approval
- set `voiceType: synthetic`
- set `audioReviewStatus: needs_review` until reviewed
- keep source and rights notes internal
- preserve TypeScript seed fallback and DB round-trip validation

An optional future command such as `audio:apply-attachments` may be added later, but it must be explicit, disabled by default, idempotent, reviewed, and tested before use. It must not silently mutate `src/content/seed/lessons.ts`.

## Runtime Boundary

The learner app must not call TTS APIs at runtime. The app should only play already generated or uploaded audio URLs, and it should keep showing a clean unavailable state when no playable URL exists.

The current audio UI remains honest:

- playable URL exists: show a play control
- no playable URL exists: show "Audio coming soon"

## Next Implementation Step

Once generated audio has been reviewed, add a safe metadata update/import flow that can attach approved synthetic or human-recorded files to audio records without exposing internal review details to learners.
