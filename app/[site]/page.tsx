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
    title: site.title,
    description: site.description,
    keywords: site.keywords,
    openGraph: {
      title: site.title,
      description: site.description,
      type: "article",
      url: `https://${site.domain}`
    }
  };
}

export default function SiteHomePage({ params }: { params: { site: string } }) {
  const site = getSite(params.site);
  if (!site) notFound();

  const articles = getSiteArticles(site);

  return (
    <main>
      <section className="bg-slate-950 px-5 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_360px] md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase text-emerald-300">{site.offerText}</p>
            <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">{site.heroTitle}</h1>
            <p className="mb-8 text-lg leading-8 text-slate-200">{site.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={site.downloadUrl}
                className="inline-flex rounded-lg bg-emerald-400 px-5 py-3 font-black text-slate-950"
              >
                Download APK
              </a>
              <Link
                href={`/${site.slug}/blog`}
                className="inline-flex rounded-lg border border-white/25 px-5 py-3 font-semibold text-white"
              >
                Read Guides
              </Link>
            </div>
          </div>
          <aside className="rounded-lg bg-white p-5 text-ink shadow-2xl">
            <h2 className="text-2xl font-black">{site.siteName} APK</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="font-bold text-slate-500">Version</dt><dd>{site.appVersion}</dd></div>
              <div><dt className="font-bold text-slate-500">Size</dt><dd>{site.appSize}</dd></div>
              <div><dt className="font-bold text-slate-500">OS</dt><dd>Android</dd></div>
              <div><dt className="font-bold text-slate-500">Market</dt><dd>Pakistan</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-5">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-3xl font-black">PKPlus Pakistan Guide Structure</h2>
            <p className="mt-3 text-slate-600">{site.description}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {site.featureBullets.map((feature) => (
                <div key={feature} className="rounded-lg border border-line p-4">
                  <h3 className="font-bold">{feature}</h3>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-3xl font-black">Guides and Articles</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${site.slug}/blog/${article.slug}`}
                  className="rounded-lg border border-line p-5"
                >
                  <h3 className="text-xl font-bold">{article.title}</h3>
                  <p className="mt-2 text-slate-600">{article.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <aside className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-black">Payment Methods</h2>
          <ul className="mt-3 grid gap-2 text-slate-600">
            {site.paymentMethods.map((method) => (
              <li key={method}>{method}</li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
