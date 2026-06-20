export const runtime = "edge";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-semibold uppercase text-slate-500">404</p>
      <h1 className="mt-4 text-4xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">The page you are looking for does not exist.</p>
    </section>
  );
}
