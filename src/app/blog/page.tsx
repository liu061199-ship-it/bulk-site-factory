import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentSite } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  return {
    title: "Blog",
    description: `Articles from ${site.siteName}.`
  };
}

export default async function BlogPage() {
  const site = await getCurrentSite();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: site.themeColor }}>
        Blog
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-950">Articles</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {site.resolvedArticles.map((article) => (
          <Link key={article.id} href={`/blog/${article.id}`} className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">{article.date} by {article.author}</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{article.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
