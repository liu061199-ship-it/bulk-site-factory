import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bulk Site Factory",
  description: "Generate multiple static websites from JSON configuration"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-bold text-ink">
              Bulk Site Factory
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/">Sites</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
