import { siteConfig } from '../config/site';

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-container flex-col gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">{siteConfig.location}</p>
          <p className="text-xs text-muted">
            Anonymous, cookie-free visit statistics are collected to understand portfolio traffic.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate">
          <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-ink">
            Email
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <span className="text-xs text-muted">© {new Date().getFullYear()} {siteConfig.name}</span>
        </div>
      </div>
    </footer>
  );
}
