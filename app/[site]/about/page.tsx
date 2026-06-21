import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite, siteConfigs } from "@/lib/site-data";

export function generateStaticParams() {
  return siteConfigs.map((site) => ({ site: site.slug }));
}

export function generateMetadata({ params }: { params: { site: string } }): Metadata {
  const site = getSite(params.site);
  if (!site) return {};
  return {
    title: `About ${site.siteName}`,
    description: site.description,
    keywords: site.keywords
  };
}

export default function AboutPage({ params }: { params: { site: string } }) {
  const site = getSite(params.site);
  if (!site) notFound();

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-5 text-5xl font-black">About {site.siteName}</h1>
      <p className="text-lg leading-8 text-slate-600">{site.description}</p>
    </main>
  );
}
