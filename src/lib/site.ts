import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { sites, type GeneratedArticle, type GeneratedSite } from "@/generated/site-data";

export type SiteTemplate = "guide" | "news" | "hub" | "tips" | "review";

export function getAllSites() {
  return [...sites];
}

export function getSiteById(siteId: string | undefined) {
  return sites.find((site) => site.id === siteId);
}

function getAliases(site: GeneratedSite) {
  return "aliases" in site ? [...(site.aliases as readonly string[])] : [];
}

function getRedirectDomains(site: GeneratedSite) {
  return "redirectDomains" in site ? [...(site.redirectDomains as readonly string[])] : [];
}

export function getSiteByDomain(domain: string | undefined) {
  if (!domain) {
    return undefined;
  }

  const hostname = domain.split(":")[0].toLowerCase();
  return sites.find((site) => {
    const domains = [site.domain, ...getAliases(site), ...getRedirectDomains(site)];
    return domains.some((item) => item.toLowerCase() === hostname);
  });
}

export async function getCurrentSite(): Promise<GeneratedSite> {
  const configuredDomain = getSiteByDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN);
  if (configuredDomain) {
    return configuredDomain;
  }

  const requestHeaders = await headers();
  const hostSite = getSiteByDomain(requestHeaders.get("host") ?? undefined);
  if (hostSite) {
    return hostSite;
  }

  const configuredSite = getSiteById(process.env.SITE_ID);
  const fallbackSite = configuredSite ?? sites[0];
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

export function getSiteTemplate(site: GeneratedSite): SiteTemplate {
  if ("template" in site) {
    return site.template as SiteTemplate;
  }
  return "guide";
}

export function getSiteContentFocus(site: GeneratedSite) {
  if ("contentFocus" in site) {
    return site.contentFocus as string;
  }
  return site.description;
}

export function getSiteTargetAudience(site: GeneratedSite) {
  if ("targetAudience" in site) {
    return site.targetAudience as string;
  }
  return "readers who want practical, clear online guidance";
}

export function getSiteEditorialPromise(site: GeneratedSite) {
  if ("editorialPromise" in site) {
    return site.editorialPromise as string;
  }
  return site.heroSubtitle;
}

export function getSiteContentPillars(site: GeneratedSite) {
  if ("contentPillars" in site) {
    return [...(site.contentPillars as readonly string[])];
  }
  return [...site.keywords].slice(0, 4);
}

export function getSiteOfficialSignals(site: GeneratedSite) {
  if ("officialSignals" in site) {
    return [...(site.officialSignals as readonly string[])];
  }
  return [
    "Clear domain and HTTPS access",
    "Updated sitemap and robots.txt",
    "Mobile-friendly guide pages"
  ];
}

export function getSiteFaq(site: GeneratedSite) {
  if ("faq" in site) {
    return [...(site.faq as readonly { question: string; answer: string }[])];
  }
  return [
    {
      question: `What is ${site.siteName}?`,
      answer: site.description
    },
    {
      question: `Where should readers start on ${site.siteName}?`,
      answer: site.heroSubtitle
    }
  ];
}
