import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { sites } from "../src/generated/site-data";

const root = process.cwd();
const outDir = path.join(root, "out");
const CTA_URL = "https://b9.game/refer/MDMwMDAxMTIyNjY=";

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

function staticLayout(site: (typeof sites)[number], title: string, description: string, body: string, pathname = "") {
  const keywords = (site.keywords || []).join(", ");
  const canonical = `https://${site.domain}${pathname}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="keywords" content="${escapeHtml(keywords)}"><link rel="canonical" href="${canonical}"><style>body{margin:0;font-family:Arial,sans-serif;color:#0f172a;background:#f8fafc}a{color:inherit}.wrap{max-width:1120px;margin:auto;padding:24px}header,footer,.card{background:#fff;border-color:#e2e8f0}header{border-bottom:1px solid #e2e8f0}footer{border-top:1px solid #e2e8f0}.nav{display:flex;justify-content:space-between;gap:20px;align-items:center}.links{display:flex;gap:14px;flex-wrap:wrap}.hero{background:#fff;padding:56px 24px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}.card{border:1px solid #e2e8f0;border-radius:8px;padding:22px}.muted{color:#64748b;line-height:1.7}.btn{display:inline-block;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:700}.btn-outline{display:inline-block;border:1px solid #cbd5e1;padding:11px 17px;border-radius:6px;text-decoration:none;font-weight:700}h1{font-size:44px;line-height:1.08;margin:12px 0}h2{font-size:26px;margin:8px 0}@media(max-width:640px){h1{font-size:34px}.nav{align-items:flex-start;flex-direction:column}}</style></head><body><header><div class="wrap nav"><strong>${escapeHtml(site.siteName)}</strong><nav class="links"><a href="/about">About</a><a href="/blog">Blog</a><a href="/contact">Contact</a><a class="btn-outline" href="${CTA_URL}">Login</a><a class="btn" style="background:#0f172a" href="${CTA_URL}">Register</a></nav></div></header><main>${body}</main><footer><div class="wrap muted">Copyright ${new Date().getFullYear()} ${escapeHtml(site.siteName)} - ${escapeHtml(site.contactEmail)}</div></footer></body></html>`;
}

function staticArticleCards(site: (typeof sites)[number]) {
  return `<div class="grid">${site.resolvedArticles.map((article) => `<a class="card" href="/blog/${encodeURIComponent(article.id)}"><p class="muted">${escapeHtml(article.date)} by ${escapeHtml(article.author)}</p><h2>${escapeHtml(article.title)}</h2><p class="muted">${escapeHtml(article.excerpt)}</p></a>`).join("")}</div>`;
}

async function writeStaticFallback(site: (typeof sites)[number]) {
  const contentFocus = "contentFocus" in site ? site.contentFocus : site.heroSubtitle;
  const homeBody = `<section class="hero"><div class="wrap"><p style="color:${escapeHtml(site.themeColor)};font-weight:700;text-transform:uppercase">${escapeHtml(site.domain)}</p><h1>${escapeHtml(site.heroTitle)}</h1><p class="muted" style="font-size:18px;max-width:760px">${escapeHtml(site.heroSubtitle)}</p><p><a class="btn" style="background:${escapeHtml(site.themeColor)}" href="${CTA_URL}">Login</a> <a class="btn-outline" href="${CTA_URL}">Register</a></p></div></section><section class="wrap">${staticArticleCards(site)}</section>`;
  await writeFile(path.join(outDir, "index.html"), staticLayout(site, site.title, site.description, homeBody), "utf8");
  await mkdir(path.join(outDir, "about"), { recursive: true });
  await writeFile(path.join(outDir, "about", "index.html"), staticLayout(site, `About | ${site.siteName}`, site.description, `<section class="wrap"><h1>${escapeHtml(site.siteName)}</h1><p class="muted">${escapeHtml(site.description)}</p><div class="card"><h2>Editorial focus</h2><p class="muted">${escapeHtml(contentFocus)}</p></div></section>`, "/about"), "utf8");
  await mkdir(path.join(outDir, "contact"), { recursive: true });
  await writeFile(path.join(outDir, "contact", "index.html"), staticLayout(site, `Contact | ${site.siteName}`, `Contact ${site.siteName}.`, `<section class="wrap"><h1>Get in touch</h1><p class="muted">For questions or updates, email <a href="mailto:${escapeHtml(site.contactEmail)}">${escapeHtml(site.contactEmail)}</a>.</p></section>`, "/contact"), "utf8");
  await mkdir(path.join(outDir, "blog"), { recursive: true });
  await writeFile(path.join(outDir, "blog", "index.html"), staticLayout(site, `Blog | ${site.siteName}`, site.description, `<section class="wrap"><h1>${escapeHtml(site.siteName)} Blog</h1>${staticArticleCards(site)}</section>`, "/blog"), "utf8");
  for (const article of site.resolvedArticles) {
    const articleDir = path.join(outDir, "blog", article.id);
    await mkdir(articleDir, { recursive: true });
    const body = article.body.map((paragraph) => `<p class="muted" style="font-size:18px">${escapeHtml(paragraph)}</p>`).join("");
    await writeFile(path.join(articleDir, "index.html"), staticLayout(site, `${article.title} | ${site.siteName}`, article.excerpt, `<article class="wrap" style="max-width:820px"><a href="/blog">Back to blog</a><p class="muted">${escapeHtml(article.date)} by ${escapeHtml(article.author)}</p><h1>${escapeHtml(article.title)}</h1><p class="muted" style="font-size:20px">${escapeHtml(article.excerpt)}</p>${body}</article>`, `/blog/${article.id}`), "utf8");
  }
  const urls = ["", "/about", "/contact", "/blog", ...site.resolvedArticles.map((article) => `/blog/${article.id}`)];
  await writeFile(path.join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>https://${site.domain}${url}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
  await writeFile(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: https://${site.domain}/sitemap.xml\n`, "utf8");
}

function workerSource() {
  return `const sites = ${JSON.stringify(sites, null, 2)};
const CTA_URL = "https://b9.game/refer/MDMwMDAxMTIyNjY=";

function text(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function normalizedHost(host) {
  const hostname = (host || "").split(":")[0].toLowerCase();
  return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
}

function exactHost(host) {
  return (host || "").split(":")[0].toLowerCase();
}

function siteByHost(host) {
  const hostname = normalizedHost(host);
  return sites.find((site) => [site.domain, ...(site.aliases || [])].some((domain) => normalizedHost(domain) === hostname)) || sites[0];
}

function redirectForHost(host, url) {
  const hostname = exactHost(host);
  const site = sites.find((item) => (item.redirectDomains || []).some((domain) => exactHost(domain) === hostname));
  if (!site) return null;
  const target = new URL(url);
  target.hostname = site.domain;
  target.protocol = "https:";
  target.port = "";
  return Response.redirect(target.toString(), 301);
}

function siteUrl(site, path = "") {
  return "https://" + site.domain + path;
}

function jsonLd(data) {
  return "<script type=\\"application/ld+json\\">" + JSON.stringify(data).replace(/<\\//g, "<\\\\/") + "</script>";
}

function layout(site, title, description, body, pathname = "") {
  const keywords = (site.keywords || []).join(", ");
  const canonicalUrl = siteUrl(site, pathname);
  return "<!doctype html><html lang=\\"en\\"><head><meta charset=\\"utf-8\\"><meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\">" +
    "<title>" + text(title) + "</title><meta name=\\"description\\" content=\\"" + text(description) + "\\"><meta name=\\"keywords\\" content=\\"" + text(keywords) + "\\">" +
    "<link rel=\\"canonical\\" href=\\"" + canonicalUrl + "\\"><meta property=\\"og:title\\" content=\\"" + text(title) + "\\"><meta property=\\"og:description\\" content=\\"" + text(description) + "\\"><meta property=\\"og:url\\" content=\\"" + canonicalUrl + "\\"><meta property=\\"og:site_name\\" content=\\"" + text(site.siteName) + "\\"><style>body{margin:0;font-family:Arial,sans-serif;color:#0f172a;background:#f8fafc}a{color:inherit}header,footer{background:#fff;border-color:#e2e8f0}header{border-bottom:1px solid #e2e8f0}footer{border-top:1px solid #e2e8f0}.wrap{max-width:1120px;margin:auto;padding:24px}.nav{display:flex;justify-content:space-between;gap:20px;align-items:center}.links{display:flex;gap:14px;font-size:14px;align-items:center;flex-wrap:wrap}.hero{padding:56px 24px;background:#fff}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:22px}.muted{color:#64748b;line-height:1.7}.btn{display:inline-block;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:700}.btn-outline{display:inline-block;border:1px solid #cbd5e1;padding:11px 17px;border-radius:6px;text-decoration:none;font-weight:700}.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}h1{font-size:44px;line-height:1.08;margin:12px 0}h2{font-size:26px;margin:8px 0}main{min-height:70vh}@media(max-width:640px){h1{font-size:34px}.nav{align-items:flex-start;flex-direction:column}}</style></head><body>" +
    "<header><div class=\\"wrap nav\\"><strong>" + text(site.siteName) + "</strong><nav class=\\"links\\"><a href=\\"/about\\">About</a><a href=\\"/blog\\">Blog</a><a href=\\"/contact\\">Contact</a><a class=\\"btn-outline\\" href=\\"" + CTA_URL + "\\">Login</a><a class=\\"btn\\" style=\\"background:#0f172a\\" href=\\"" + CTA_URL + "\\">Register</a></nav></div></header><main>" +
    body + "</main><footer><div class=\\"wrap muted\\">Copyright " + new Date().getFullYear() + " " + text(site.siteName) + " - " + text(site.contactEmail) + "</div></footer></body></html>";
}

function ctaButtons(site) {
  return "<div class=\\"cta-row\\"><a class=\\"btn\\" style=\\"background:" + text(site.themeColor) + "\\" href=\\"" + CTA_URL + "\\">Login</a><a class=\\"btn-outline\\" href=\\"" + CTA_URL + "\\">Register</a></div>";
}

function trustPanel(site) {
  const badges = site.trustBadges || ["HTTPS checked", "Mobile ready", "Updated sitemap"];
  return "<div class=\\"card\\"><div style=\\"display:flex;gap:16px;align-items:center\\"><img src=\\"" + text(site.logo) + "\\" alt=\\"" + text(site.siteName) + " logo\\" style=\\"width:64px;height:64px;border-radius:8px\\"><div><p class=\\"muted\\" style=\\"margin:0\\">Official resource</p><h2>" + text(site.siteName) + "</h2><p class=\\"muted\\" style=\\"margin:0\\">" + text(site.domain) + "</p></div></div><p class=\\"muted\\">" + text(site.editorialPromise || site.heroSubtitle) + "</p><div style=\\"display:flex;flex-wrap:wrap;gap:8px\\">" + badges.map((badge) => "<span style=\\"border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 10px;font-size:14px\\">" + text(badge) + "</span>").join("") + "</div></div>";
}

function officialSignals(site) {
  const signals = site.officialSignals || [
    "Clear domain and HTTPS access",
    "Updated sitemap and robots.txt",
    "Mobile-friendly guide pages"
  ];
  return "<section class=\\"wrap\\"><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">Official access checks</p><h2>Before using " + text(site.siteName) + "</h2><div class=\\"grid\\">" + signals.map((signal) => "<div class=\\"card\\"><p class=\\"muted\\">" + text(signal) + "</p></div>").join("") + "</div></section>";
}

function faqSection(site) {
  const faq = site.faq || [
    { question: "What is " + site.siteName + "?", answer: site.description },
    { question: "Where should readers start on " + site.siteName + "?", answer: site.heroSubtitle }
  ];
  return "<section class=\\"wrap\\"><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">FAQ</p><h2>Common questions</h2><div class=\\"grid\\">" + faq.map((item) => "<div class=\\"card\\"><h2>" + text(item.question) + "</h2><p class=\\"muted\\">" + text(item.answer) + "</p></div>").join("") + "</div></section>";
}

function homeSchema(site) {
  const faq = site.faq || [
    { question: "What is " + site.siteName + "?", answer: site.description },
    { question: "Where should readers start on " + site.siteName + "?", answer: site.heroSubtitle }
  ];
  return jsonLd([
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.siteName,
      url: siteUrl(site),
      description: site.description,
      inLanguage: "en"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }
  ]);
}

function articleSchema(site, article) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: site.siteName
    },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: siteUrl(site, "/blog/" + article.id)
  });
}

function articleCards(site) {
  return "<div class=\\"grid\\">" + site.resolvedArticles.map((article) => "<a class=\\"card\\" href=\\"/blog/" + encodeURIComponent(article.id) + "\\"><p class=\\"muted\\">" + text(article.date) + " by " + text(article.author) + "</p><h2>" + text(article.title) + "</h2><p class=\\"muted\\">" + text(article.excerpt) + "</p></a>").join("") + "</div>";
}

function relatedBlocks(site, articleId) {
  const relatedArticles = site.resolvedArticles.filter((item) => item.id !== articleId).slice(0, 3);
  const relatedSites = sites.filter((item) => item.id !== site.id && item.domain.includes("xp786")).slice(0, 4);
  const articles = relatedArticles.map((item) => "<a class=\\"card\\" href=\\"/blog/" + encodeURIComponent(item.id) + "\\"><h2>" + text(item.title) + "</h2><p class=\\"muted\\">" + text(item.excerpt) + "</p></a>").join("");
  const network = relatedSites.map((item) => "<a class=\\"card\\" href=\\"https://" + text(item.domain) + "\\"><h2>" + text(item.siteName) + "</h2><p class=\\"muted\\">" + text(item.description) + "</p></a>").join("");
  return "<section class=\\"wrap\\"><div class=\\"grid\\"><div><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">Related reading</p><div class=\\"grid\\">" + articles + "</div></div><div><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">XP786 resource network</p><div class=\\"grid\\">" + network + "</div></div></div></section>";
}

function home(site) {
  return layout(site, site.title, site.description, homeSchema(site) + "<section class=\\"hero\\"><div class=\\"wrap\\" style=\\"display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:32px;align-items:center\\"><div><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">" + text(site.domain) + "</p><h1>" + text(site.heroTitle) + "</h1><p class=\\"muted\\" style=\\"font-size:18px;max-width:760px\\">" + text(site.heroSubtitle) + "</p>" + ctaButtons(site) + "</div>" + trustPanel(site) + "</div></section>" + officialSignals(site) + "<section class=\\"wrap\\">" + articleCards(site) + "</section>" + faqSection(site));
}

function about(site) {
  return layout(site, "About | " + site.siteName, site.description, "<section class=\\"wrap\\"><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">About</p><h1>" + text(site.siteName) + "</h1><p class=\\"muted\\">" + text(site.description) + "</p><div class=\\"card\\"><h2>Editorial focus</h2><p class=\\"muted\\">" + text(site.contentFocus || site.heroSubtitle) + "</p></div></section>", "/about");
}

function contact(site) {
  return layout(site, "Contact | " + site.siteName, "Contact " + site.siteName + ".", "<section class=\\"wrap\\"><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">Contact</p><h1>Get in touch</h1><p class=\\"muted\\">For questions or updates, email <a href=\\"mailto:" + text(site.contactEmail) + "\\">" + text(site.contactEmail) + "</a>.</p><div class=\\"card\\"><h2>Site details</h2><p class=\\"muted\\">" + text(site.siteName) + " - " + text(site.domain) + "</p></div></section>", "/contact");
}

function blog(site) {
  return layout(site, "Blog | " + site.siteName, site.description, "<section class=\\"wrap\\"><p style=\\"color:" + text(site.themeColor) + ";font-weight:700;text-transform:uppercase\\">Articles</p><h1>" + text(site.siteName) + " Blog</h1>" + articleCards(site) + "</section>", "/blog");
}

function article(site, slug) {
  const found = site.resolvedArticles.find((item) => item.id === slug);
  if (!found) return notFound(site);
  const body = found.body.map((p) => "<p class=\\"muted\\" style=\\"font-size:18px\\">" + text(p) + "</p>").join("");
  return layout(site, found.title + " | " + site.siteName, found.excerpt, articleSchema(site, found) + "<article class=\\"wrap\\" style=\\"max-width:820px\\"><a href=\\"/blog\\">Back to blog</a><p class=\\"muted\\">" + text(found.date) + " by " + text(found.author) + "</p><h1>" + text(found.title) + "</h1><p class=\\"muted\\" style=\\"font-size:20px\\">" + text(found.excerpt) + "</p>" + body + "</article>" + relatedBlocks(site, found.id), "/blog/" + found.id);
}

function sitemap(site) {
  const urls = ["", "/about", "/contact", "/blog", ...site.resolvedArticles.map((article) => "/blog/" + article.id)];
  return "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\">\\n" + urls.map((url) => "  <url><loc>" + siteUrl(site, url) + "</loc></url>").join("\\n") + "\\n</urlset>\\n";
}

function robots(site) {
  return "User-agent: *\\nAllow: /\\n\\nSitemap: " + siteUrl(site, "/sitemap.xml") + "\\n";
}

function googleVerification(pathname) {
  const files = new Set(["/googlea464782b9d486411.html"]);
  if (!files.has(pathname)) return null;
  return "google-site-verification: " + pathname.slice(1);
}

function notFound(site) {
  return layout(site, "Page not found | " + site.siteName, site.description, "<section class=\\"wrap\\"><h1>Page not found</h1><p class=\\"muted\\">The page you are looking for does not exist.</p></section>");
}

export default {
  async fetch(request) {
    const redirect = redirectForHost(request.headers.get("host"), request.url);
    if (redirect) return redirect;
    const site = siteByHost(request.headers.get("host"));
    const url = new URL(request.url);
    const verification = googleVerification(url.pathname);
    if (verification) return new Response(verification, { headers: { "content-type": "text/plain;charset=utf-8" } });
    if (url.pathname === "/robots.txt") return new Response(robots(site), { headers: { "content-type": "text/plain;charset=utf-8" } });
    if (url.pathname === "/sitemap.xml") return new Response(sitemap(site), { headers: { "content-type": "application/xml;charset=utf-8" } });
    let html;
    if (url.pathname === "/" || url.pathname === "") html = home(site);
    else if (url.pathname === "/about") html = about(site);
    else if (url.pathname === "/contact") html = contact(site);
    else if (url.pathname === "/blog") html = blog(site);
    else if (url.pathname.startsWith("/blog/")) html = article(site, decodeURIComponent(url.pathname.slice(6)));
    else html = notFound(site);
    return new Response(html, { status: html.includes("Page not found") ? 404 : 200, headers: { "content-type": "text/html;charset=utf-8" } });
  }
};
`;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await writeStaticFallback(sites.find((site) => site.id === "xp786-guide") || sites[0]);
  await writeFile(path.join(outDir, "_worker.js"), workerSource(), "utf8");
  await writeFile(
    path.join(outDir, "_routes.json"),
    JSON.stringify({ version: 1, include: ["/*"], exclude: [] }, null, 2),
    "utf8",
  );
  console.log(`Generated Cloudflare Pages worker for ${sites.length} sites.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
