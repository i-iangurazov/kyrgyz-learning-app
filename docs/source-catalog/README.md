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

## Workflow

1. Add or update a source entry using `SOURCE_TEMPLATE.md`.
2. Mark rights status and allowed usage conservatively.
3. Record methodist/native speaker decisions using `METHODIST_DECISION_TEMPLATE.md`.
4. Use cataloged source IDs or decision IDs in revision briefs, lesson source notes, or future DB records.
5. Rewrite lesson content only after source grounding and review questions are documented.
6. Keep revised content marked unapproved until explicit methodist review changes the status.
