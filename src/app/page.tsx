import Link from "next/link";
import type { GeneratedSite } from "@/generated/site-data";
import { CTA_URL } from "@/lib/cta";
import {
  getCurrentSite,
  getSiteContentFocus,
  getSiteContentPillars,
  getSiteEditorialPromise,
  getSiteFaq,
  getSiteOfficialSignals,
  getSiteTrustBadges,
  getSiteTargetAudience,
  getSiteTemplate,
  siteUrl
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

function BrandTrustPanel({ site, dark = false }: { site: GeneratedSite; dark?: boolean }) {
  const badges = getSiteTrustBadges(site);
  const panelClass = dark ? "border-white/15 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-950";
  const mutedClass = dark ? "text-slate-300" : "text-slate-600";
  const badgeClass = dark ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`rounded-md border p-6 ${panelClass}`}>
      <div className="flex items-center gap-4">
        <img src={site.logo} alt={`${site.siteName} logo`} className="h-16 w-16 rounded-md" />
        <div>
          <p className={`text-sm ${mutedClass}`}>Official resource</p>
          <h2 className="text-2xl font-semibold">{site.siteName}</h2>
          <p className={`mt-1 text-sm ${mutedClass}`}>{site.domain}</p>
        </div>
      </div>
      <p className={`mt-5 leading-7 ${mutedClass}`}>{getSiteEditorialPromise(site)}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span key={badge} className={`rounded-md border px-3 py-1 text-sm ${badgeClass}`}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

function OfficialSignals({ site }: { site: GeneratedSite }) {
  const signals = getSiteOfficialSignals(site);

  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
          Official access checks
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">Before using {site.siteName}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {signals.map((signal) => (
            <div key={signal} className="rounded-md border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-6 text-slate-700">{signal}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ site }: { site: GeneratedSite }) {
  const faq = getSiteFaq(site);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
        FAQ
      </p>
      <h2 className="mt-3 text-2xl font-bold text-slate-950">Common questions</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {faq.map((item) => (
          <div key={item.question} className="rounded-md border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-950">{item.question}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeSchema({ site }: { site: GeneratedSite }) {
  const faq = getSiteFaq(site);
  const schema = [
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
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
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
          <BrandTrustPanel site={site} />
        </div>
      </section>
      <OfficialSignals site={site} />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <TemplateFacts site={site} />
        <div className="mt-10">
          <ArticleLinks site={site} />
        </div>
      </section>
      <FaqSection site={site} />
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
          <div className="mt-8 max-w-xl">
            <BrandTrustPanel site={site} dark />
          </div>
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
      <OfficialSignals site={site} />
      <FaqSection site={site} />
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
            <div className="mt-8 max-w-xl">
              <BrandTrustPanel site={site} />
            </div>
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
      <OfficialSignals site={site} />
      <FaqSection site={site} />
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
          <div className="mt-8 max-w-xl">
            <BrandTrustPanel site={site} />
          </div>
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
      <OfficialSignals site={site} />
      <FaqSection site={site} />
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
          <div className="mt-8 max-w-xl">
            <BrandTrustPanel site={site} dark />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <TemplateFacts site={site} />
        </div>
        <ArticleLinks site={site} variant="list" />
      </section>
      <OfficialSignals site={site} />
      <FaqSection site={site} />
    </>
  );
}

export default async function HomePage() {
  const site = await getCurrentSite();
  const template = getSiteTemplate(site);

  return (
    <>
      <HomeSchema site={site} />
      {template === "news" ? <NewsHome site={site} /> : null}
      {template === "hub" ? <HubHome site={site} /> : null}
      {template === "tips" ? <TipsHome site={site} /> : null}
      {template === "review" ? <ReviewHome site={site} /> : null}
      {template === "guide" ? <GuideHome site={site} /> : null}
    </>
  );
}
