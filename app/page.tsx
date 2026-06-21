import Link from "next/link";
import { siteConfigs } from "@/lib/site-data";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase text-teal-700">Bulk Site Factory</p>
        <h1 className="mb-6 text-5xl font-black leading-tight text-ink md:text-7xl">
          用 sites.json 批量生成静态网站。
        </h1>
        <p className="mb-8 text-lg leading-8 text-slate-600">
          在 `sites/sites.json` 添加网站配置，在 `content/articles.json` 添加文章，然后运行 `npm run generate` 生成可部署文件。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {siteConfigs.map((site) => (
          <Link key={site.slug} href={`/${site.slug}`} className="rounded-lg border border-line bg-white p-5">
            <div className="text-xl font-bold">{site.siteName}</div>
            <div className="mt-2 text-slate-600">{site.description}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
