import { NextResponse, type NextRequest } from "next/server";
import { sites, type GeneratedSite } from "@/generated/site-data";

function normalizeHost(host: string | null) {
  return host?.split(":")[0].toLowerCase();
}

function getRedirectDomains(site: GeneratedSite) {
  return "redirectDomains" in site ? [...(site.redirectDomains as readonly string[])] : [];
}

export function proxy(request: NextRequest) {
  const hostname = normalizeHost(request.headers.get("host"));

  if (!hostname) {
    return NextResponse.next();
  }

  const site = sites.find((item) => {
    return getRedirectDomains(item).some((domain) => domain.toLowerCase() === hostname);
  });

  if (!site) {
    return NextResponse.next();
  }

  const targetUrl = request.nextUrl.clone();
  targetUrl.protocol = "https:";
  targetUrl.hostname = site.domain;
  targetUrl.port = "";

  return NextResponse.redirect(targetUrl, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
