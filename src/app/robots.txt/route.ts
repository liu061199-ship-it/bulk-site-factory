import { getCurrentSite, siteUrl } from "@/lib/site";

export async function GET() {
  const site = await getCurrentSite();
  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl(site, "/sitemap.xml")}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain"
    }
  });
}
