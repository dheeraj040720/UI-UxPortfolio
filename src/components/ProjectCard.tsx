import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../types/database';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col">
      <Link to={`/projects/${project.slug}`} className="block space-y-4">
        <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-subtle">
          <img
            src={project.cover_image}
            alt={project.cover_alt || `${project.title} cover image`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="rounded-full bg-subtle px-2.5 py-0.5 text-ink">{project.category}</span>
            <span>{project.year}</span>
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
            {project.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-slate">{project.summary}</p>

          <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-ink">
            Read case study
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
