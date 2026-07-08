# Source Catalog

The source catalog records the references, rights status, allowed usage, and methodist/native speaker decisions that support curriculum work. It exists so K0/K1 rewrites are grounded in documented sources and review decisions rather than untracked guesses.

Every real lesson rewrite must reference cataloged sources or methodist decisions before content changes are treated as release candidates.

## Core Rules

- Sources may be used only according to their rights and allowed-usage status.
- Copyrighted content must not be copied unless licensed or explicitly permitted.
- Protected textbook dialogues, reading passages, exercise sets, examples, and grammar explanations must not be copied into app content.
- Source materials can guide methodology, sequencing, validation, theme selection, and adaptation only when rights allow.
- Methodist/native speaker validation is required before beta or production approval.
- Catalog records are internal planning artifacts and must not be shown in learner-facing UI.

## Source Status Values

- `candidate`: proposed source; not reviewed yet.
- `under_review`: being evaluated for rights, relevance, or methodist usefulness.
- `approved_reference`: approved for reference or validation use.
- `approved_adaptation`: approved for adaptation within documented limits.
- `licensed_direct_use`: license or permission allows direct use within terms.
- `rejected`: not suitable or not rights-safe.
- `needs_rights_clarification`: do not use for learner-facing content until rights are clarified.

## Usage Types

- `methodology_only`: may guide structure, sequencing, or teaching approach only.
- `reference_only`: may be used to verify facts, grammar, spelling, level fit, or meaning only.
- `adaptation_allowed`: adaptation is allowed by license or explicit permission.
- `direct_use_allowed`: direct use is allowed by license, permission, or public-domain status.
- `license_required`: usage requires a license before any learner-facing use.
- `public_domain`: direct use may be possible if public-domain status is documented.
- `open_license`: usage may be possible within the license terms.

## Files

- `SOURCE_TEMPLATE.md`: reusable source entry template.
- `METHODIST_DECISION_TEMPLATE.md`: reusable methodist/native speaker decision template.
- `initial-k0-k1-candidates.md`: first candidate categories for K0/K1 grounding.

## Current K0/K1 Starter Records

Initial source records for `k0-u1-l1` grounding:

- [`kyrgyztest-a1-level-reference.md`](./kyrgyztest-a1-level-reference.md): candidate official A1/beginner level reference, pending exact source and rights verification.
- [`beginner-grammar-reference-needed.md`](./beginner-grammar-reference-needed.md): candidate beginner grammar/reference need for greetings, short replies, and formal/informal handling.
- [`dictionary-translation-reference-needed.md`](./dictionary-translation-reference-needed.md): candidate dictionary/translation reference need for first words and phrase meanings.

Open methodist decision records for `k0-u1-l1`:

- [`methodist-decisions/k0-u1-l1-greeting-choice.md`](./methodist-decisions/k0-u1-l1-greeting-choice.md): whether lesson 1 should teach `Салам`, `Саламатсызбы`, or both.
- [`methodist-decisions/k0-u1-l1-formal-informal.md`](./methodist-decisions/k0-u1-l1-formal-informal.md): whether `сен` / `сиз` and register should appear in lesson 1.
- [`methodist-decisions/k0-u1-l1-first-dialogue-naturalness.md`](./methodist-decisions/k0-u1-l1-first-dialogue-naturalness.md): whether the prototype dialogue is natural and what should replace it if needed.
- [`methodist-decisions/k0-u1-l1-audio-transcripts.md`](./methodist-decisions/k0-u1-l1-audio-transcripts.md): whether current audio transcripts are suitable for review and temporary TTS work.

## Workflow

1. Add or update a source entry using `SOURCE_TEMPLATE.md`.
2. Mark rights status and allowed usage conservatively.
3. Record methodist/native speaker decisions using `METHODIST_DECISION_TEMPLATE.md`.
4. Use cataloged source IDs or decision IDs in revision briefs, lesson source notes, or future DB records.
5. Rewrite lesson content only after source grounding and review questions are documented.
6. Keep revised content marked unapproved until explicit methodist review changes the status.
