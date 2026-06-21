import type { MetadataRoute } from "next";
import { getSiteArticles, siteConfigs } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const now = new Date();
  return [
    {
      url: appUrl,
      lastModified: now
    },
    ...siteConfigs.flatMap((site) => [
      { url: `${appUrl}/${site.slug}`, lastModified: now },
      { url: `${appUrl}/${site.slug}/about`, lastModified: now },
      { url: `${appUrl}/${site.slug}/contact`, lastModified: now },
      { url: `${appUrl}/${site.slug}/blog`, lastModified: now },
      ...getSiteArticles(site).map((article) => ({
        url: `${appUrl}/${site.slug}/blog/${article.slug}`,
        lastModified: now
      }))
    ])
  ];
}
