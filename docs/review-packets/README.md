# Methodist Review Packets

These packets export the current K0/K1 seed lessons into reviewer-friendly Markdown. They are for methodist/linguist review only.

Important:

- Current seed lessons are prototype samples, not final curriculum.
- Do not approve content by editing these generated packets alone.
- Apply reviewer feedback to seed/DB content only in a later explicit revision task.
- Do not copy protected textbook or literary content into revisions unless licensed.
- TTS or placeholder audio must be reviewed by a Kyrgyz speaker before beta use.

## How To Regenerate

Run:

```bash
pnpm content:review-packets
```

The command writes Markdown packets to `docs/review-packets/` and reviewer JSON to ignored `test-results/review-packets/`.

## Current Export Counts

- Lessons exported: 3
- Vocabulary items: 12
- Dialogue lines: 9
- Reading paragraphs: 3
- Grammar points: 3
- Exercises: 7
- Audio transcript refs: 27

## Lesson Packets

- [k0-u1-l1](./k0-u1-l1.md): K0 / k0-u1, P0, Первые кыргызские приветствия / Кыргызча саламдашуу
- [k0-u1-l2](./k0-u1-l2.md): K0 / k0-u1, P0, Буквы ө, ү, ң / Ө, Ү, Ң тамгалары
- [k1-u1-l1](./k1-u1-l1.md): K1 / k1-u1, P0, Знакомство / Таанышуу

## Review Workflow

1. Reviewer opens the relevant lesson packet.
2. Reviewer checks Kyrgyz accuracy, naturalness, grammar, translations, exercises, level fit, and audio transcript needs.
3. Reviewer fills the decision block or returns comments externally.
4. Product/content owner creates a separate revision task.
5. Seed or DB content is updated only after the explicit revision task.
6. Content remains prototype/not reviewed until the source data is updated and validation status changes.
