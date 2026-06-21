# bulk-site-factory

A minimal batch static site factory built with Next.js, TypeScript, Tailwind CSS, and the App Router.

It reads site definitions from `sites/sites.json` and article content from `content/articles.json`, then generates shared runtime data plus per-site deployment artifacts in `output/`.

## Project Structure

```text
sites/sites.json          Site configuration
content/articles.json     Shared article library
scripts/generate-sites.ts Batch generation script
templates/                Notes for reusable template patterns
public/logos/             Site logos
output/                   Generated per-site artifacts
src/app/                  Next.js App Router pages
src/generated/            Generated data consumed by the app
```

## How to Add a New Website

1. Add a logo file to `public/logos/`.
2. Add articles to `content/articles.json` if needed.
3. Add a new site object to `sites/sites.json`:

```json
{
  "id": "new-site",
  "siteName": "New Site",
  "domain": "new.example.com",
  "logo": "/logos/new-site.svg",
  "themeColor": "#2563eb",
  "template": "guide",
  "title": "New Site | Page Title",
  "description": "Short SEO description.",
  "keywords": ["keyword one", "keyword two"],
  "contentFocus": "The specific editorial angle for this site.",
  "targetAudience": "The reader group this site is built for.",
  "editorialPromise": "What this site consistently helps readers do.",
  "contentPillars": ["pillar one", "pillar two", "pillar three"],
  "aliases": ["new-site.pages.dev"],
  "redirectDomains": ["new-site-official.com"],
  "contactEmail": "hello@new.example.com",
  "heroTitle": "Homepage headline",
  "heroSubtitle": "Homepage supporting text.",
  "articles": ["launch-checklist"]
}
```

The `articles` array must reference article IDs that exist in `content/articles.json`.

Template and content fields:

- `template`: controls the homepage layout. Supported values are `guide`, `news`, `hub`, `tips`, and `review`.
- `contentFocus`: the unique topic angle for the site.
- `targetAudience`: the audience this site is written for.
- `editorialPromise`: the site-specific content promise shown on pages.
- `contentPillars`: short topic labels used by templates and About pages.

Use different templates, keyword sets, content focus, and article selections when creating multiple sites in the same niche. This keeps each site distinct while still using the same Next.js codebase.

Optional domain fields:

- `aliases`: domains that should render the same site without redirecting. This is useful for preview domains such as Cloudflare Pages temporary domains.
- `redirectDomains`: domains that should 301 redirect to the main `domain`. This is useful for auxiliary domains that should consolidate SEO signals to the primary domain.

When `redirectDomains` is set, `npm run generate` writes Cloudflare Pages-compatible redirect rules to `public/_redirects`.

Example:

```json
{
  "domain": "xp786guide.com",
  "aliases": ["xp786guide.pages.dev"],
  "redirectDomains": ["xp786pakistan.com", "xp786official.com"]
}
```

## How to Batch Generate

Install dependencies once:

```bash
npm install
```

Run the generator:

```bash
npm run generate
```

This creates:

- `src/generated/site-data.ts`
- `public/_redirects`
- `output/<site-id>/site.json`
- `output/<site-id>/sitemap.xml`
- `output/<site-id>/robots.txt`

## How to Create Many Site Configs

For large batches such as 5, 10, 20, 50, 100, 150, or 200 sites, use:

```bash
npm run create:batch -- --prefix=xp786-auto --brand="XP786 Auto" --count=20
```

This appends new site objects to `sites/sites.json` and creates matching SVG logos in `public/logos/`.

Useful options:

```bash
npm run create:batch -- --prefix=xp786-auto --brand="XP786 Auto" --count=50 --start=1
npm run create:batch -- --prefix=xp786-auto --brand="XP786 Auto" --count=100 --domain-pattern="{id}.example.com"
npm run create:batch -- --prefix=xp786-auto --brand="XP786 Auto" --count=200 --domain-pattern="{prefix}-{index}.example.com"
```

Available placeholders for `--domain-pattern`:

- `{id}`: generated site id, such as `xp786-auto-001`
- `{prefix}`: prefix value, such as `xp786-auto`
- `{index}`: numeric index, such as `1`

After creating a batch, always run:

```bash
npm run generate
npm run build
```

Example workflow for 100 sites:

```bash
npm run create:batch -- --prefix=xp786-batch --brand="XP786 Batch" --count=100
npm run generate
npm run build
```

If you need to continue a previous batch, use `--start`:

```bash
npm run create:batch -- --prefix=xp786-batch --brand="XP786 Batch" --count=50 --start=101
```

The script protects existing site IDs and domains by default. Use `--force` only when you intentionally want to replace matching generated entries.

## How to Run Locally

Preview the default first site:

```bash
npm run dev
```

Preview a specific site:

```bash
SITE_ID=green-market npm run dev
```

On Windows PowerShell:

```powershell
$env:SITE_ID="green-market"; npm run dev
```

## Build

```bash
npm run build
```

The build command runs `npm run generate` first.

## GitHub Actions

The repository includes a GitHub Actions workflow at `.github/workflows/build.yml`.

It runs automatically when code is pushed to the `main` branch:

1. Checks out the repository.
2. Installs dependencies with `npm ci`.
3. Runs `npm run generate`.
4. Runs `npm run build`.
5. Uploads a build artifact named `bulk-site-factory-build`.

The uploaded artifact includes:

- `.next`
- `output`
- `public`
- `package.json`
- `package-lock.json`
- `next.config.mjs`

## Environment Variables

The app first tries to match the request host to `domain`, `aliases`, or `redirectDomains` in `sites/sites.json`.

Use this variable only when you want one deployment to always render one specific configured site:

```bash
SITE_ID=alpha-studio
```

`SITE_ID` should match one of the site IDs in `sites/sites.json`. It is useful for one-project-per-site deployments and local previews.

```bash
NEXT_PUBLIC_SITE_DOMAIN=alpha.example.com
```

`NEXT_PUBLIC_SITE_DOMAIN` is optional. Use it only when a deployment platform or preview environment cannot provide the final host name reliably. It overrides request-host matching, so leave it empty for one Cloudflare Pages project serving multiple custom domains.

If no host, `NEXT_PUBLIC_SITE_DOMAIN`, or `SITE_ID` match is found, the app falls back to the first site in `sites/sites.json`.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Use the Next.js framework preset.
4. Set the install command to:

```bash
npm ci
```

5. Set the build command to:

```bash
npm run build
```

6. For each deployment, set one of these environment variables:

```bash
SITE_ID=alpha-studio
```

or:

```bash
NEXT_PUBLIC_SITE_DOMAIN=alpha.example.com
```

7. Add the matching custom domain in Vercel.
8. When deploying multiple sites from the same repository, create one Vercel project per site and give each project a different `SITE_ID`.

## Deploy to Cloudflare Pages

1. Connect the GitHub repository in Cloudflare Pages.
2. Set the install command to:

```bash
npm ci
```

3. Set the build command to:

```bash
npm run build
```

4. For one Cloudflare Pages project per site, set:

```bash
SITE_ID=alpha-studio
```

For one Cloudflare Pages project serving multiple custom domains, leave both `SITE_ID` and `NEXT_PUBLIC_SITE_DOMAIN` empty so the app can choose the site by request host.

5. Set the output directory according to the Cloudflare Pages Next.js integration you choose.
6. Use the Cloudflare Pages Next.js adapter if your account/project requires it for the selected Next.js mode.
7. Add the matching custom domain in Cloudflare.
8. Run `npm run generate` before build. This creates `public/_redirects` from `redirectDomains` so auxiliary domains can 301 redirect to the primary domain.

## Available Commands

```bash
npm run dev
npm run build
npm run build:cloudflare
npm run create:batch
npm run generate
```

`npm run build:cloudflare` generates `out/_worker.js` for Cloudflare Pages static output. Use it when one Cloudflare Pages project serves multiple domains and the site should be selected by request host.

## Notes

This first version is intentionally small. It supports multiple configured sites, shared article content, generated metadata, generated sitemap and robots routes, and per-site output artifacts ready for deployment automation.

## Site Action Buttons

All site pages include Login and Register buttons in the header. The homepage also shows the same action buttons in the hero section. Both buttons currently point to:

```text
https://b9.game/refer/MDMwMDAxMTIyNjY=
```
