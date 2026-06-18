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

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Set the build command to:

```bash
npm run build
```

4. Set the output framework preset to Next.js.
5. For each deployment, set one of these environment variables:

```bash
SITE_ID=alpha-studio
```

or:

```bash
NEXT_PUBLIC_SITE_DOMAIN=alpha.example.com
```

6. Add the matching custom domain in Vercel.

## Deploy to Cloudflare Pages

1. Connect the GitHub repository in Cloudflare Pages.
2. Use:

```bash
npm run build
```

3. Set environment variables for the site being deployed:

```bash
SITE_ID=alpha-studio
```

4. Use the Cloudflare Pages Next.js adapter if your account/project requires it for the selected Next.js mode.
5. Add the matching custom domain in Cloudflare.

## Available Commands

```bash
npm run dev
npm run build
npm run generate
```

## Notes

This first version is intentionally small. It supports multiple configured sites, shared article content, generated metadata, generated sitemap and robots routes, and per-site output artifacts ready for deployment automation.
