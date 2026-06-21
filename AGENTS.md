# AGENTS.md

## Project Goal

Bulk Site Factory generates multiple static websites from JSON configuration.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS

## Data Files

- `sites/sites.json` contains website configuration.
- `content/articles.json` contains reusable articles.
- `scripts/generate-sites.ts` writes static sites to `output/<site-slug>/`.

## Development Rules

1. All features must remain runnable after changes.
2. After modifying code, run `npm run build` and fix any errors before handoff.
3. Do not hardcode site content in pages or templates. Site content must be read from `sites/sites.json`.
4. Pages must support SEO through title, description, keywords, sitemap, and robots output where relevant.
5. Batch generation logic must stay simple, deterministic, and easy to read.
6. Any new feature or workflow change must update `README.md`.
7. Pull request descriptions must include test results, including whether `npm run generate` and `npm run build` passed.

## Quality Bar

- Keep the generator small and predictable.
- Preserve the existing project structure unless a change clearly improves maintainability.
- Do not commit secrets. Keep runtime values in `.env.local` and document examples in `.env.example`.
