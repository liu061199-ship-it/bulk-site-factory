import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite, getSiteArticles, siteConfigs } from "@/lib/site-data";

export function generateStaticParams() {
  return siteConfigs.map((site) => ({ site: site.slug }));
}

export function generateMetadata({ params }: { params: { site: string } }): Metadata {
  const site = getSite(params.site);
  if (!site) return {};
  return {
    title: `${site.siteName} Guides and APK Tutorials`,
    description: `Read ${site.siteName} APK download, registration, payment, feature, and FAQ guides.`,
    keywords: site.keywords
  };
}

export default function BlogPage({ params }: { params: { site: string } }) {
  const site = getSite(params.site);
  if (!site) notFound();

  const articles = getSiteArticles(site);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="mb-8 text-5xl font-black">{site.siteName} Blog</h1>
      <section className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/${site.slug}/blog/${article.slug}`}
            className="rounded-lg border border-line bg-white p-5"
          >
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="mt-2 text-slate-600">{article.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
