# Kyrgyz Learning App

Mobile-first web MVP foundation for learning Kyrgyz with an HSK-style curriculum model.

## Current Scope

- Next.js, TypeScript, Tailwind CSS, shadcn-style UI primitives
- K0/K1 curriculum and lesson content foundation
- Zod-validated lesson schemas
- Demo seed lessons marked for methodist/linguist validation
- Mobile app shell with floating bottom tab navigation
- Lesson player, level map, placeholders for practice, games, and profile
- Mock local progress state
- Vitest and Playwright coverage for core lesson rendering

## Documentation

Methodology and content rules live in [`docs/`](docs/):

- Kyrgyz learning framework
- Lesson template
- Content guidelines
- Grammar point guidelines
- AI roleplay guidelines
- Methodist review checklist
- MVP scope

## Development

```bash
pnpm install
pnpm dev
```

Run checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

All sample Kyrgyz content is demo-only and requires methodist/linguist validation before production use.
