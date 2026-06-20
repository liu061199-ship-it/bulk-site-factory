import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentSite, getSiteContentFocus, getSiteTemplate } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  return {
    title: "Blog",
    description: `${site.siteName} articles about ${getSiteContentFocus(site)}`
  };
}

export default async function BlogPage() {
  const site = await getCurrentSite();
  const template = getSiteTemplate(site);
  const label = template === "news" ? "Updates" : template === "tips" ? "Tips" : template === "review" ? "Reviews" : "Articles";

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
        {label}
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-950">{site.siteName} {label}</h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600">{getSiteContentFocus(site)}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {site.resolvedArticles.map((article) => (
          <Link key={article.id} href={`/blog/${article.id}`} className="rounded-md border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">{article.date} by {article.author}</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{article.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
