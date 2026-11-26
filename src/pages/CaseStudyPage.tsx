import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types/database';

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        setProject((data as Project) || null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-5 py-20 sm:px-8 lg:px-12">
        <div className="h-96 animate-pulse rounded-xl bg-subtle" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-prose px-5 py-24 text-center">
        <h1 className="type-page-title text-ink">Case study not found</h1>
        <p className="mt-3 text-slate">This project may have been moved or unpublished.</p>
        <Link to="/projects" className="mt-6 inline-block font-medium text-accent underline">
          Back to all projects
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-24 pt-12 lg:pt-16">
      <header className="mx-auto max-w-container px-5 sm:px-8 lg:px-12">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="mt-8 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="rounded-full bg-subtle px-2.5 py-0.5 text-ink">{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h1 className="type-page-title text-ink">{project.title}</h1>
          <p className="text-lg leading-relaxed text-slate">{project.summary}</p>
        </div>

        <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Role</dt>
            <dd className="mt-1 text-sm font-medium text-ink">{project.role || 'Product Designer'}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Timeline</dt>
            <dd className="mt-1 text-sm font-medium text-ink">{project.timeline || '—'}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Tools</dt>
            <dd className="mt-1 text-sm font-medium text-ink">
              {project.tools?.length ? project.tools.join(', ') : 'Figma'}
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {project.figma_url && (
              <a
                href={project.figma_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-subtle"
              >
                Figma <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink hover:bg-accent-hover"
              >
                Live Site <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </dl>

        <div className="mt-10 aspect-[16/9] overflow-hidden rounded-xl border border-line bg-subtle">
          <img
            src={project.cover_image}
            alt={project.cover_alt || `${project.title} overview`}
            className="h-full w-full object-cover"
          />
        </div>
      </header>

      <div className="mx-auto mt-16 max-w-prose space-y-14 px-5 sm:px-8">
        {project.problem && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">01. The Problem</h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-slate">{project.problem}</p>
          </section>
        )}

        {project.process && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">02. Process &amp; Exploration</h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-slate">{project.process}</p>
          </section>
        )}
      </div>

      {project.wireframe_images?.length > 0 && (
        <section className="mx-auto mt-14 max-w-container px-5 sm:px-8 lg:px-12">
          <h2 className="mb-6 text-xl font-semibold text-ink">Wireframes &amp; Iterations</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {project.wireframe_images.map((img, i) => (
              <figure key={i} className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-line bg-surface">
                  <img
                    src={img.url}
                    alt={img.alt || `${project.title} wireframe ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-cover"
                  />
                </div>
                {img.caption && <figcaption className="text-xs text-muted">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {project.final_images?.length > 0 && (
        <section className="mx-auto mt-16 max-w-container px-5 sm:px-8 lg:px-12">
          <h2 className="mb-6 text-xl font-semibold text-ink">Final Screens</h2>
          <div className="grid gap-8">
            {project.final_images.map((img, i) => (
              <figure key={i} className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-line bg-surface">
                  <img
                    src={img.url}
                    alt={img.alt || `${project.title} final screen ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-cover"
                  />
                </div>
                {img.caption && <figcaption className="text-xs text-muted">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {(project.outcome || project.metrics?.length > 0) && (
        <section className="mx-auto mt-16 max-w-prose space-y-6 px-5 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">03. Outcome &amp; Impact</h2>
          {project.metrics?.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {project.metrics.map((m, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface p-5">
                  <div className="font-serif text-3xl font-medium text-accent">{m.value}</div>
                  <div className="mt-1 text-xs font-medium text-slate">{m.label}</div>
                </div>
              ))}
            </div>
          )}
          {project.outcome && (
            <p className="whitespace-pre-line text-base leading-relaxed text-slate">{project.outcome}</p>
          )}
        </section>
      )}
    </article>
  );
}
