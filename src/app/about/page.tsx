import type { Metadata } from "next";
import { getCurrentSite } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();
  return {
    title: "About",
    description: `Learn more about ${site.siteName}.`
  };
}

export default async function AboutPage() {
  const site = await getCurrentSite();

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: site.themeColor }}>
        About
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-950">{site.siteName}</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">{site.description}</p>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">What this site publishes</h2>
        <p className="mt-3 leading-7 text-slate-600">
          This website is generated from a shared configuration file and a shared article library. Each site can use its
          own branding, metadata, contact details, and article selection.
        </p>
      </div>
    </section>
  );
}
