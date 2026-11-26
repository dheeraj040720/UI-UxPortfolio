import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { siteConfig } from '../config/site';
import type { Project } from '../types/database';
import { ProjectCard } from '../components/ProjectCard';
import { FadeUp } from '../components/MotionPrimitives';

export function HomePage() {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .limit(4)
      .then(({ data }) => {
        setFeatured((data as Project[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-container px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:px-12 lg:pb-28">
        <FadeUp className="max-w-3xl space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
            {siteConfig.eyebrow}
          </p>
          <h1 className="type-hero text-ink">{siteConfig.headline}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate">{siteConfig.intro}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
            >
              View Selected Work
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-subtle"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>
        </FadeUp>
      </section>

      <section className="border-t border-line py-20 lg:py-28">
        <div className="mx-auto max-w-container px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted">Selected Work</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Featured Case Studies
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              All projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-10 md:grid-cols-2">
              {[1, 2].map((n) => (
                <div key={n} className="aspect-[16/10] animate-pulse rounded-xl bg-subtle" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-xl border border-line bg-surface p-10 text-center text-slate">
              No projects published yet. Add your first case study in{' '}
              <Link to="/admin" className="font-medium text-accent underline">
                /admin
              </Link>
              .
            </div>
          ) : (
            <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
              {featured.map((project, idx) => (
                <FadeUp key={project.id} delay={idx * 0.06}>
                  <ProjectCard project={project} />
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-line bg-surface/60 py-20 lg:py-28">
        <div className="mx-auto max-w-container px-5 sm:px-8 lg:px-12">
          <FadeUp className="mb-12 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Capabilities</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Where design craft meets engineering fluency
            </h2>
          </FadeUp>

          <div className="grid gap-8 md:grid-cols-3">
            {siteConfig.capabilities.map((cap, idx) => (
              <FadeUp
                key={cap.title}
                delay={idx * 0.06}
                className="flex flex-col justify-between rounded-xl border border-line bg-surface p-7"
              >
                <div>
                  <h3 className="text-lg font-semibold text-ink">{cap.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{cap.description}</p>
                </div>
                <ul className="mt-6 space-y-1.5 border-t border-line pt-4 font-mono text-xs text-muted">
                  {cap.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-20 lg:py-24">
        <div className="mx-auto flex max-w-container flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center lg:px-12">
          <div className="space-y-2">
            <h2 className="type-page-title text-ink">Let&apos;s build something thoughtful.</h2>
            <p className="text-slate">Open to Product Designer &amp; UI/UX Engineer opportunities.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            Get in touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
