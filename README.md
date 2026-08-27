# Tarun Ramprakash — portfolio

Personal portfolio for an aerospace researcher working in CFD and solver development.
Dark-first, Apple-inspired glass UI with a WebGL flow-field hero, and a schema-driven
admin so no content is hardcoded.

## Stack

| Concern       | Choice                                              |
| ------------- | --------------------------------------------------- |
| Framework     | Next.js 15 (App Router), React 19                   |
| Language      | TypeScript 5.7, `strict` + `noUncheckedIndexedAccess` |
| Styling       | Tailwind 4, design tokens as CSS custom properties  |
| Fonts         | Self-hosted via `@fontsource` (Latin subsets only)  |
| Content       | Zod-validated JSON/MDX committed to this repo       |
| Testing       | Vitest (unit), Playwright + axe (E2E, a11y)         |
| Package mgr   | pnpm 11, Node 22                                    |

## Getting started

```bash
corepack enable          # provides pnpm
pnpm install
pnpm dev                 # http://localhost:3000
```

## Scripts

| Script             | Does                                                |
| ------------------ | --------------------------------------------------- |
| `pnpm dev`         | Development server                                  |
| `pnpm build`       | Production build                                    |
| `pnpm verify`      | Typecheck, lint, format check, unit tests           |
| `pnpm test:e2e`    | Playwright end-to-end and accessibility suite       |

`pnpm verify` is what CI gates on. Run it before pushing.

## Configuration

| Variable               | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Unset falls back to `http://localhost:3000`. |
| `STATIC_EXPORT`        | Set to `1` for a fully static build (GitHub Pages).        |

Hosting is deliberately undecided; nothing outside `next.config.ts` branches on it.

## Theming

Dark is the signature theme and owns the bare `:root`. Light is defined under
`prefers-color-scheme: light` and again under `[data-theme='light']`, so an explicit
choice beats the OS preference in both directions. Every colour is a token — never
declare one inside a media or `[data-theme]` block only.

## Decisions

Architecture decision records live in `docs/adr/`.
