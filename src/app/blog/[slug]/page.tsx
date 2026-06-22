import type { Metadata } from "next";
import Link from "next/link";
import { getArticle, getCurrentSite, getRelatedArticles, getRelatedSites, siteUrl } from "@/lib/site";

export const runtime = "edge";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const site = await getCurrentSite();
  const { slug } = await params;
  const article = getArticle(site, slug);

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }]
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const article = getArticle(site, slug);
  const relatedArticles = getRelatedArticles(site, slug);
  const relatedSites = getRelatedSites(site);
  const articleSchema = {
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
    mainEntityOfPage: siteUrl(site, `/blog/${article.id}`)
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="mx-auto max-w-3xl px-5 py-16">
        <Link href="/blog" className="text-sm font-semibold" style={{ color: site.themeColor }}>
          Back to blog
        </Link>
        <p className="mt-8 text-sm text-slate-500">{article.date} by {article.author}</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950">{article.title}</h1>
        <p className="mt-5 text-xl leading-8 text-slate-600">{article.excerpt}</p>
        <div className="mt-10 space-y-6 text-lg leading-8 text-slate-700">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
              Related reading
            </p>
            <div className="mt-4 space-y-3">
              {relatedArticles.map((item) => (
                <Link key={item.id} href={`/blog/${item.id}`} className="block rounded-md border border-slate-200 bg-white p-4">
                  <h2 className="font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
              XP786 resource network
            </p>
            <div className="mt-4 space-y-3">
              {relatedSites.map((item) => (
                <a key={item.id} href={`https://${item.domain}`} className="block rounded-md border border-slate-200 bg-white p-4">
                  <h2 className="font-semibold text-slate-950">{item.siteName}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
