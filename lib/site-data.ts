import articles from "@/content/articles.json";
import sites from "@/sites/sites.json";
import type { Article, SiteConfig } from "@/lib/site-types";

export const siteConfigs = sites as SiteConfig[];
export const articleConfigs = articles as Article[];

export function getSite(slug: string) {
  return siteConfigs.find((site) => site.slug === slug);
}

export function getSiteArticles(site: SiteConfig) {
  return site.articles
    .map((slug) => articleConfigs.find((article) => article.slug === slug))
    .filter((article): article is Article => Boolean(article));
}
