import { getCurrentSite, siteUrl } from "@/lib/site";

export async function GET() {
  const site = await getCurrentSite();
  const urls = ["", "/about", "/contact", "/blog", ...site.resolvedArticles.map((article) => `/blog/${article.id}`)];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteUrl(site, url)}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml"
    }
  });
}
