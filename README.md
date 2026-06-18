# bulk-site-factory

A minimal batch static site factory built with Next.js, TypeScript, Tailwind CSS, and the App Router.

It reads site definitions from `sites/sites.json` and article content from `content/articles.json`, then generates shared runtime data plus per-site deployment artifacts in `output/`.

## Project Structure

```text
sites/sites.json          Site configuration
content/articles.json     Shared article library
scripts/generate-sites.ts Batch generation script
templates/                Reserved for future reusable templates
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
  "title": "New Site | Page Title",
  "description": "Short SEO description.",
  "keywords": ["keyword one", "keyword two"],
  "contactEmail": "hello@new.example.com",
  "heroTitle": "Homepage headline",
  "heroSubtitle": "Homepage supporting text.",
  "articles": ["launch-checklist"]
}
```

The `articles` array must reference article IDs that exist in `content/articles.json`.

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
- `output/<site-id>/site.json`
- `output/<site-id>/sitemap.xml`
- `output/<site-id>/robots.txt`

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

Use these variables to choose which configured site is rendered in a deployment:

```bash
SITE_ID=alpha-studio
```

`SITE_ID` should match one of the site IDs in `sites/sites.json`. This is the simplest option for Vercel, Cloudflare Pages, and local previews.

```bash
NEXT_PUBLIC_SITE_DOMAIN=alpha.example.com
```

`NEXT_PUBLIC_SITE_DOMAIN` is optional. Use it when a deployment platform or preview environment cannot provide the final host name reliably.

If neither variable is set, the app tries to match the request host to a configured domain. If no match is found, it falls back to the first site in `sites/sites.json`.

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

4. Set environment variables for the site being deployed:

```bash
SITE_ID=alpha-studio
```

5. Set the output directory according to the Cloudflare Pages Next.js integration you choose.
6. Use the Cloudflare Pages Next.js adapter if your account/project requires it for the selected Next.js mode.
7. Add the matching custom domain in Cloudflare.
8. When deploying multiple sites from the same repository, create one Cloudflare Pages project per site and give each project a different `SITE_ID`.

## Available Commands

```bash
npm run dev
npm run build
npm run generate
```

## Notes

This first version is intentionally small. It supports multiple configured sites, shared article content, generated metadata, generated sitemap and robots routes, and per-site output artifacts ready for deployment automation.
