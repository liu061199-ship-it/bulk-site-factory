import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import { getCurrentSite, siteUrl } from "@/lib/site";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite();

  return {
    title: {
      default: site.title,
      template: `%s | ${site.siteName}`
    },
    description: site.description,
    keywords: [...site.keywords],
    metadataBase: new URL(siteUrl(site)),
    openGraph: {
      title: site.title,
      description: site.description,
      url: siteUrl(site),
      siteName: site.siteName,
      type: "website"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const site = await getCurrentSite();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
              <Link href="/" className="flex items-center gap-3 font-semibold">
                <img src={site.logo} alt={`${site.siteName} logo`} className="h-9 w-9 rounded-md" />
                <span>{site.siteName}</span>
              </Link>
              <div className="flex items-center gap-5 text-sm text-slate-700">
                <Link href="/about">About</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
              <p>&copy; {new Date().getFullYear()} {site.siteName}. All rights reserved.</p>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
