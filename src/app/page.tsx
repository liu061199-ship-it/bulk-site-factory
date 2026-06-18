import Link from "next/link";
import { getCurrentSite } from "@/lib/site";

export default async function HomePage() {
  const site = await getCurrentSite();
  const featuredArticles = site.resolvedArticles.slice(0, 3);

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide" style={{ color: site.themeColor }}>
              {site.domain}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
              {site.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{site.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="rounded-md px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: site.themeColor }}
              >
                Read the blog
              </Link>
              <Link href="/contact" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold">
                Contact us
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <img src={site.logo} alt="" className="h-16 w-16 rounded-lg" />
            <h2 className="mt-6 text-2xl font-semibold">{site.siteName}</h2>
            <p className="mt-3 leading-7 text-slate-600">{site.description}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Latest Articles</h2>
            <p className="mt-2 text-slate-600">Fresh content configured for this site.</p>
          </div>
          <Link href="/blog" className="text-sm font-semibold" style={{ color: site.themeColor }}>
            View all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.id}`} className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{article.date}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
