import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-prose px-5 py-28 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">404</p>
      <h1 className="type-page-title mt-2 text-ink">Page not found</h1>
      <p className="mt-3 text-slate">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-ink"
      >
        Back to Home
      </Link>
    </section>
  );
}
