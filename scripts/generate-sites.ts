import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Article, SiteConfig } from "../lib/site-types";
import {
  renderAbout,
  renderBlogList,
  renderBlogPost,
  renderContact,
  renderHome,
  renderRobots,
  renderSitemap
} from "../templates/site-template";

const root = process.cwd();
const sitesPath = path.join(root, "sites", "sites.json");
const articlesPath = path.join(root, "content", "articles.json");
const outputRoot = path.join(root, "output");

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function writePage(filePath: string, html: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html, "utf8");
}

function articlesForSite(site: SiteConfig, articles: Article[]) {
  return site.articles
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is Article => Boolean(article));
}

async function generateSite(site: SiteConfig, allArticles: Article[]) {
  const siteArticles = articlesForSite(site, allArticles);
  const siteOutput = path.join(outputRoot, site.slug);

  await writePage(path.join(siteOutput, "index.html"), renderHome(site, siteArticles));
  await writePage(path.join(siteOutput, "about", "index.html"), renderAbout(site));
  await writePage(path.join(siteOutput, "contact", "index.html"), renderContact(site));
  await writePage(path.join(siteOutput, "blog", "index.html"), renderBlogList(site, siteArticles));

  for (const article of siteArticles) {
    await writePage(
      path.join(siteOutput, "blog", article.slug, "index.html"),
      renderBlogPost(site, article)
    );
  }

  await writePage(path.join(siteOutput, "sitemap.xml"), renderSitemap(site, siteArticles));
  await writePage(path.join(siteOutput, "robots.txt"), renderRobots(site));
}

async function main() {
  const [sites, articles] = await Promise.all([
    readJson<SiteConfig[]>(sitesPath),
    readJson<Article[]>(articlesPath)
  ]);

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await writeFile(path.join(outputRoot, ".gitkeep"), "", "utf8");

  for (const site of sites) {
    await generateSite(site, articles);
  }

  console.log(`Generated ${sites.length} sites in output/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
