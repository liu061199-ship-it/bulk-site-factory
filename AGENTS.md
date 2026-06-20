# AGENTS.md

Development rules for Codex and future contributors working on this repository.

## Core Rules

1. Keep every feature runnable.
   - Do not leave broken scripts, broken routes, invalid JSON, or incomplete generated data.
   - Preserve the existing project structure unless a change is clearly documented.

2. Run the production build after changes.
   - After modifying code, configuration, generated data, or documentation that affects usage, run:

```bash
npm run build
```

3. Do not hard-code site content in pages.
   - Site-specific content must come from `sites/sites.json`.
   - Article content must come from `content/articles.json`.
   - Pages should read generated site data from `src/generated/site-data.ts`.

4. Keep pages SEO-ready.
   - New pages should define useful metadata.
   - Titles, descriptions, keywords, canonical URLs, sitemap output, and robots output should remain driven by site configuration where appropriate.

5. Keep batch generation simple and clear.
   - `scripts/generate-sites.ts` should remain easy to read and safe to modify.
   - Prefer explicit validation and plain data transforms over complex abstractions.
   - Do not add unnecessary frameworks or hidden generation steps.

6. Update `README.md` for new features.
   - Any new command, config option, deployment behavior, environment variable, or workflow must be documented.
   - Keep examples copy-friendly for adding or modifying sites.

7. Pull request descriptions must include test results.
   - Every PR should mention the commands that were run.
   - At minimum, include the result of:

```bash
npm run build
```

## Preferred Change Flow

1. Make the smallest clear change that satisfies the request.
2. Run `npm run generate` when changing site or article data.
3. Run `npm run build` before finishing.
4. Update `README.md` when behavior or usage changes.
5. Summarize what changed and list test results in the PR.
