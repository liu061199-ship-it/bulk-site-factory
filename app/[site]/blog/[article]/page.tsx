import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleConfigs, getSite, getSiteArticles, siteConfigs } from "@/lib/site-data";

export function generateStaticParams() {
  return siteConfigs.flatMap((site) =>
    getSiteArticles(site).map((article) => ({ site: site.slug, article: article.slug }))
  );
}

export function generateMetadata({ params }: { params: { site: string; article: string } }): Metadata {
  const site = getSite(params.site);
  const article = articleConfigs.find((item) => item.slug === params.article);
  if (!site || !article) return {};
  return {
    title: `${article.title} - ${site.siteName}`,
    description: article.description,
    keywords: site.keywords
  };
}

export default function BlogPostPage({ params }: { params: { site: string; article: string } }) {
  const site = getSite(params.site);
  const article = articleConfigs.find((item) => item.slug === params.article);
  if (!site || !article || !site.articles.includes(article.slug)) notFound();

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="mb-3 text-sm font-semibold text-slate-500">{article.date}</p>
      <h1 className="mb-5 text-5xl font-black">{article.title}</h1>
      <p className="mb-6 text-lg leading-8 text-slate-600">{article.description}</p>
      <article className="rounded-lg border border-line bg-white p-6 text-lg leading-8">
        {article.content}
      </article>
    </main>
  );
}
