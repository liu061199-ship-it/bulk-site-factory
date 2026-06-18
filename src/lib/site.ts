import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { sites, type GeneratedArticle, type GeneratedSite } from "@/generated/site-data";

export function getAllSites() {
  return [...sites];
}

export function getSiteById(siteId: string | undefined) {
  return sites.find((site) => site.id === siteId);
}

export function getSiteByDomain(domain: string | undefined) {
  if (!domain) {
    return undefined;
  }

  const hostname = domain.split(":")[0].toLowerCase();
  return sites.find((site) => site.domain.toLowerCase() === hostname);
}

export async function getCurrentSite(): Promise<GeneratedSite> {
  const configuredSite = getSiteById(process.env.SITE_ID);
  if (configuredSite) {
    return configuredSite;
  }

  const configuredDomain = getSiteByDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN);
  if (configuredDomain) {
    return configuredDomain;
  }

  const requestHeaders = await headers();
  const hostSite = getSiteByDomain(requestHeaders.get("host") ?? undefined);
  const fallbackSite = hostSite ?? sites[0];
  if (!fallbackSite) {
    throw new Error("No sites are configured. Add at least one site to sites/sites.json and run npm run generate.");
  }

  return fallbackSite;
}

export function getArticle(site: GeneratedSite, articleId: string): GeneratedArticle {
  const article = site.resolvedArticles.find((item) => item.id === articleId);
  if (!article) {
    notFound();
  }
  return article;
}

export function siteUrl(site: GeneratedSite, pathname = "") {
  return `https://${site.domain}${pathname}`;
}
