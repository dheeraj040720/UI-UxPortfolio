import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { siteConfig } from '../config/site';
import type { Project } from '../types/database';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProjectCard } from '../components/ProjectCard';
import { FadeUp } from '../components/MotionPrimitives';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects((data as Project[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (category === 'All') return projects;
    return projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }, [projects, category]);

  return (
    <section className="mx-auto max-w-container px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <FadeUp className="max-w-2xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">Work</p>
        <h1 className="type-page-title text-ink">Selected Projects</h1>
        <p className="text-lg text-slate">
          End-to-end case studies exploring user research, interface craft, and systems thinking.
        </p>
      </FadeUp>

      <div className="mt-10">
        <CategoryFilter
          categories={siteConfig.categories}
          active={category}
          onChange={setCategory}
        />
      </div>

      {loading ? (
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-[16/10] animate-pulse rounded-xl bg-subtle" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-line bg-surface p-12 text-center text-slate">
          No projects found in <span className="font-medium text-ink">{category}</span>.
        </div>
      ) : (
        <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {filtered.map((project, idx) => (
            <FadeUp key={project.id} delay={idx * 0.04}>
              <ProjectCard project={project} />
            </FadeUp>
          ))}
        </div>
      )}
    </section>
  );
}
