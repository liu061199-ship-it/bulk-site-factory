import type { Metadata } from "next";
import { getCurrentSite, siteUrl } from "@/lib/site";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  return {
    title: "Contact",
    description: `Contact ${site.siteName}.`,
    alternates: {
      canonical: siteUrl(site, "/contact")
    },
    openGraph: {
      title: `Contact ${site.siteName}`,
      description: `Contact ${site.siteName}.`,
      url: siteUrl(site, "/contact"),
      siteName: site.siteName,
      type: "website"
    }
  };
}

export default async function ContactPage() {
  const site = await getCurrentSite();

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: site.themeColor }}>
        Contact
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-950">Get in touch</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        For questions, partnerships, or site updates, email the team at{" "}
        <a className="font-semibold" style={{ color: site.themeColor }} href={`mailto:${site.contactEmail}`}>
          {site.contactEmail}
        </a>
        .
      </p>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Site details</h2>
        <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-900">Website</dt>
            <dd className="mt-1 text-slate-600">{site.siteName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Domain</dt>
            <dd className="mt-1 text-slate-600">{site.domain}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
