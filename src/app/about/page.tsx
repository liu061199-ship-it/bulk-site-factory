import type { Metadata } from "next";
import {
  getCurrentSite,
  getSiteContentFocus,
  getSiteContentPillars,
  getSiteEditorialPromise,
  getSiteTargetAudience
} from "@/lib/site";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  return {
    title: "About",
    description: `Learn more about ${site.siteName}.`
  };
}

export default async function AboutPage() {
  const site = await getCurrentSite();
  const pillars = getSiteContentPillars(site);

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-semibold uppercase" style={{ color: site.themeColor }}>
        About
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-950">{site.siteName}</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">{site.description}</p>
      <div className="mt-8 rounded-md border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Editorial focus</h2>
        <p className="mt-3 leading-7 text-slate-600">{getSiteContentFocus(site)}</p>
        <p className="mt-3 leading-7 text-slate-600">{getSiteEditorialPromise(site)}</p>
      </div>
      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Who it serves</h2>
        <p className="mt-3 leading-7 text-slate-600">{getSiteTargetAudience(site)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {pillars.map((pillar) => (
            <span key={pillar} className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {pillar}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
