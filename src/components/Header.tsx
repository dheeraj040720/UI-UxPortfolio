import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '../config/site';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-accent' : 'text-slate hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="font-serif text-xl font-medium tracking-tight text-ink transition-opacity hover:opacity-80"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-subtle"
          >
            Resume
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-line bg-canvas px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="py-1.5 text-base font-medium text-ink"
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex w-fit rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink"
            >
              Download Resume
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
