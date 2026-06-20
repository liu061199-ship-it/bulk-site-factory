import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type SiteConfig = {
  id: string;
  siteName: string;
  domain: string;
  logo: string;
  themeColor: string;
  title: string;
  description: string;
  keywords: string[];
  contactEmail: string;
  heroTitle: string;
  heroSubtitle: string;
  articles: string[];
};

type Article = {
  id: string;
};

type BatchOptions = {
  prefix: string;
  brand: string;
  count: number;
  start: number;
  domainPattern: string;
  emailDomain: string;
  articleCount: number;
  force: boolean;
};

const root = process.cwd();
const sitesPath = path.join(root, "sites", "sites.json");
const articlesPath = path.join(root, "content", "articles.json");
const logosDir = path.join(root, "public", "logos");

const colors = [
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#9333ea",
  "#0891b2",
  "#db2777",
  "#0f766e",
  "#ea580c",
  "#4f46e5"
];

function getArg(name: string) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match?.slice(prefix.length);
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string) {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function parseOptions(): BatchOptions {
  const prefix = slugify(getArg("prefix") ?? "batch-site");
  const count = Number.parseInt(getArg("count") ?? "5", 10);
  const start = Number.parseInt(getArg("start") ?? "1", 10);
  const articleCount = Number.parseInt(getArg("article-count") ?? "5", 10);
  const brand = getArg("brand") ?? titleCase(prefix);
  const domainPattern = getArg("domain-pattern") ?? "{id}.example.com";
  const emailDomain = getArg("email-domain") ?? "";

  if (!prefix) {
    throw new Error("Missing --prefix value.");
  }

  if (!Number.isInteger(count) || count < 1 || count > 200) {
    throw new Error("--count must be a number from 1 to 200.");
  }

  if (!Number.isInteger(start) || start < 1) {
    throw new Error("--start must be a positive number.");
  }

  if (!Number.isInteger(articleCount) || articleCount < 1) {
    throw new Error("--article-count must be a positive number.");
  }

  return {
    prefix,
    brand,
    count,
    start,
    domainPattern,
    emailDomain,
    articleCount,
    force: hasFlag("force")
  };
}

function buildDomain(pattern: string, id: string, index: number, prefix: string) {
  return pattern
    .replaceAll("{id}", id)
    .replaceAll("{index}", String(index))
    .replaceAll("{prefix}", prefix);
}

function pickArticles(articleIds: string[], startIndex: number, count: number) {
  if (articleIds.length < count) {
    throw new Error(`Need at least ${count} articles in content/articles.json.`);
  }

  return Array.from({ length: count }, (_, offset) => articleIds[(startIndex + offset) % articleIds.length]);
}

function buildLogoSvg(siteName: string, color: string) {
  const initials = siteName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="${siteName} logo">
  <rect width="96" height="96" rx="18" fill="${color}"/>
  <text x="48" y="57" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#fff">${initials}</text>
</svg>
`;
}

function buildSite(options: BatchOptions, articleIds: string[], offset: number): SiteConfig {
  const index = options.start + offset;
  const suffix = String(index).padStart(3, "0");
  const id = `${options.prefix}-${suffix}`;
  const siteName = `${options.brand} ${suffix}`;
  const domain = buildDomain(options.domainPattern, id, index, options.prefix);
  const themeColor = colors[offset % colors.length];
  const emailDomain = options.emailDomain || domain;

  return {
    id,
    siteName,
    domain,
    logo: `/logos/${id}.svg`,
    themeColor,
    title: `${siteName} | Practical Guides and Online Resources`,
    description: `${siteName} publishes practical guides, website checklists, and useful online resources for readers who want clear next steps.`,
    keywords: [siteName, options.brand, "online guide", "website tips", "content strategy"],
    contactEmail: `hello@${emailDomain}`,
    heroTitle: `${siteName} helps readers find clear online guidance`,
    heroSubtitle: "Browse practical articles, launch notes, and simple checklists built for quick action.",
    articles: pickArticles(articleIds, offset, options.articleCount)
  };
}

async function main() {
  const options = parseOptions();
  const sites = await readJson<SiteConfig[]>(sitesPath);
  const articles = await readJson<Article[]>(articlesPath);
  const articleIds = articles.map((article) => article.id);
  const existingIds = new Set(sites.map((site) => site.id));
  const existingDomains = new Set(sites.map((site) => site.domain));
  const newSites = Array.from({ length: options.count }, (_, offset) => buildSite(options, articleIds, offset));

  for (const site of newSites) {
    if (!options.force && existingIds.has(site.id)) {
      throw new Error(`Site id "${site.id}" already exists. Use --start or --force.`);
    }
    if (!options.force && existingDomains.has(site.domain)) {
      throw new Error(`Domain "${site.domain}" already exists. Use another --domain-pattern.`);
    }
  }

  const filteredSites = options.force
    ? sites.filter((site) => !newSites.some((newSite) => newSite.id === site.id || newSite.domain === site.domain))
    : sites;

  await mkdir(logosDir, { recursive: true });
  await writeFile(sitesPath, `${JSON.stringify([...filteredSites, ...newSites], null, 2)}\n`, "utf8");

  for (const site of newSites) {
    const logoPath = path.join(logosDir, `${site.id}.svg`);
    await writeFile(logoPath, buildLogoSvg(site.siteName, site.themeColor), "utf8");
  }

  console.log(`Added ${newSites.length} site${newSites.length === 1 ? "" : "s"} to sites/sites.json.`);
  console.log("Next: run npm run generate && npm run build");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
