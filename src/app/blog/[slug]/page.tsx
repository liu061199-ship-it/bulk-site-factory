import type { Metadata } from "next";
import Link from "next/link";
import { getArticle, getCurrentSite } from "@/lib/site";

export const runtime = "edge";

type BlogArticlePageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const site = await getCurrentSite();
  const article = getArticle(site, params.slug);

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }]
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const site = await getCurrentSite();
  const article = getArticle(site, params.slug);

  return (
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
  );
}
