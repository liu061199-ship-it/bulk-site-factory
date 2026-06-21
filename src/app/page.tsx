import Link from "next/link";
import type { GeneratedSite } from "@/generated/site-data";
import { CTA_URL } from "@/lib/cta";
import {
  getCurrentSite,
  getSiteContentFocus,
  getSiteContentPillars,
  getSiteEditorialPromise,
  getSiteTargetAudience,
  getSiteTemplate
} from "@/lib/site";

export const runtime = "edge";

function ArticleLinks({ site, variant = "grid" }: { site: GeneratedSite; variant?: "grid" | "list" }) {
  const articles = site.resolvedArticles.slice(0, 4);

  if (variant === "list") {
    return (
      <div className="divide-y divide-slate-200">
        {articles.map((article) => (
          <Link key={article.id} href={`/blog/${article.id}`} className="block py-5">
            <p className="text-sm text-slate-500">{article.date}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">{article.title}</h3>
            <p className="mt-2 leading-7 text-slate-600">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {articles.map((article) => (
        <Link key={article.id} href={`/blog/${article.id}`} className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">{article.date}</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-950">{article.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}

function TemplateFacts({ site }: { site: GeneratedSite }) {
  const pillars = getSiteContentPillars(site);

  return (
    <dl className="grid gap-4 text-sm md:grid-cols-3">
      <div>
        <dt className="font-semibold text-slate-950">Focus</dt>
        <dd className="mt-2 leading-6 text-slate-600">{getSiteContentFocus(site)}</dd>
      </div>
      <div>
        <dt className="font-semibold text-slate-950">Audience</dt>
        <dd className="mt-2 leading-6 text-slate-600">{getSiteTargetAudience(site)}</dd>
      </div>
      <div>
        <dt className="font-semibold text-slate-950">Topics</dt>
        <dd className="mt-2 flex flex-wrap gap-2">
          {pillars.map((pillar) => (
            <span key={pillar} className="rounded-md bg-slate-100 px-3 py-1 text-slate-700">
              {pillar}
            </span>
          ))}
        </dd>
      </div>
    </dl>
  );
}

function CtaButtons({ site, dark = false }: { site: GeneratedSite; dark?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a href={CTA_URL} className="rounded-md px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: site.themeColor }}>
        Login
      </a>
      <a
        href={CTA_URL}
        className={`rounded-md border px-5 py-3 text-sm font-semibold ${dark ? "border-white/30 text-white" : "border-slate-300 text-slate-950"}`}
      >
        Register
      </a>
    </div>
  );
}

function GuideHome({ site }: { site: GeneratedSite }) {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
              {site.domain}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
              {site.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{site.heroSubtitle}</p>
            <CtaButtons site={site} />
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-6">
            <img src={site.logo} alt="" className="h-16 w-16 rounded-md" />
            <h2 className="mt-6 text-2xl font-semibold">{site.siteName}</h2>
            <p className="mt-3 leading-7 text-slate-600">{getSiteEditorialPromise(site)}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <TemplateFacts site={site} />
        <div className="mt-10">
          <ArticleLinks site={site} />
        </div>
      </section>
    </>
  );
}

function NewsHome({ site }: { site: GeneratedSite }) {
  const lead = site.resolvedArticles[0];
  const otherArticles = site.resolvedArticles.slice(1, 5);

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
            {site.siteName}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{site.heroTitle}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{site.heroSubtitle}</p>
          <CtaButtons site={site} dark />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1.3fr_0.7fr]">
        <Link href={`/blog/${lead.id}`} className="block border-b-4 bg-white p-6" style={{ borderColor: site.themeColor }}>
          <p className="text-sm text-slate-500">{lead.date}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-950">{lead.title}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">{lead.excerpt}</p>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Latest updates</h2>
          <div className="mt-3 divide-y divide-slate-200">
            {otherArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.id}`} className="block py-4">
                <h3 className="font-semibold text-slate-950">{article.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{article.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function HubHome({ site }: { site: GeneratedSite }) {
  return (
    <>
      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
              Resource hub
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 md:text-6xl">{site.heroTitle}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{site.heroSubtitle}</p>
            <CtaButtons site={site} />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="self-start rounded-md border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Resource map</h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            {getSiteContentPillars(site).map((pillar) => (
              <li key={pillar} className="border-l-4 pl-3" style={{ borderColor: site.themeColor }}>
                {pillar}
              </li>
            ))}
          </ul>
        </aside>
        <ArticleLinks site={site} />
      </section>
    </>
  );
}

function TipsHome({ site }: { site: GeneratedSite }) {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
            Short practical tips
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">{site.heroTitle}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{site.heroSubtitle}</p>
          <CtaButtons site={site} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {site.resolvedArticles.slice(0, 4).map((article, index) => (
            <Link key={article.id} href={`/blog/${article.id}`} className="rounded-md border border-slate-200 bg-white p-5">
              <span className="text-3xl font-bold" style={{ color: site.themeColor }}>
                {index + 1}
              </span>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function ReviewHome({ site }: { site: GeneratedSite }) {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
            Review notes
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{site.heroTitle}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{site.heroSubtitle}</p>
          <CtaButtons site={site} dark />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <TemplateFacts site={site} />
        </div>
        <ArticleLinks site={site} variant="list" />
      </section>
    </>
  );
}

export default async function HomePage() {
  const site = await getCurrentSite();
  const template = getSiteTemplate(site);

  if (template === "news") return <NewsHome site={site} />;
  if (template === "hub") return <HubHome site={site} />;
  if (template === "tips") return <TipsHome site={site} />;
  if (template === "review") return <ReviewHome site={site} />;
  return <GuideHome site={site} />;
}
