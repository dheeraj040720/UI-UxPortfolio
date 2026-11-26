import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Project } from '../../types/database';
import { ProjectFormModal } from './ProjectFormModal';

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null | 'new'>(null);

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const moveProject = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;

    const current = projects[index];
    const swap = projects[target];

    await Promise.all([
      supabase.from('projects').update({ sort_order: target }).eq('id', current.id),
      supabase.from('projects').update({ sort_order: index }).eq('id', swap.id),
    ]);
    loadProjects();
  };

  const deleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate">{projects.length} total case studies</p>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface p-10 text-center text-sm text-slate">
          No projects yet. Click &ldquo;New Project&rdquo; to add your first case study.
        </div>
      ) : (
        <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {projects.map((p, idx) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <img src={p.cover_image} alt="" className="h-14 w-20 rounded-lg border border-line object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{p.title}</h3>
                    {!p.published && (
                      <span className="rounded bg-subtle px-2 py-0.5 text-[10px] font-medium text-muted">
                        Draft
                      </span>
                    )}
                    {p.featured && (
                      <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-muted">
                    {p.category} • {p.year}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => moveProject(idx, -1)} disabled={idx === 0} aria-label="Move up" className="rounded p-2 text-muted hover:bg-subtle hover:text-ink disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => moveProject(idx, 1)} disabled={idx === projects.length - 1} aria-label="Move down" className="rounded p-2 text-muted hover:bg-subtle hover:text-ink disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setEditing(p)} aria-label="Edit project" className="rounded p-2 text-slate hover:bg-subtle hover:text-ink">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => deleteProject(p.id, p.title)} aria-label="Delete project" className="rounded p-2 text-muted hover:bg-red-500/10 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProjectFormModal
          project={editing === 'new' ? null : editing}
          nextSortOrder={projects.length}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            loadProjects();
          }}
        />
      )}
    </div>
  );
}
