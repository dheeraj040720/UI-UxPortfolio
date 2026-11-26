import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadProjectImage } from '../../lib/imageCompression';
import type { CaseStudyImage, CaseStudyMetric, Project } from '../../types/database';

interface Props {
  project: Project | null;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

function GalleryUploader({
  label,
  images,
  folder,
  onChange,
}: {
  label: string;
  images: CaseStudyImage[];
  folder: string;
  onChange: (next: CaseStudyImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadProjectImage(f, folder)));
      onChange([...images, ...urls.map((url) => ({ url, alt: '', caption: '' }))]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink hover:bg-subtle">
          <Upload className="h-3.5 w-3.5" />
          {uploading ? 'Compressing & uploading...' : 'Add Images'}
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="sr-only" />
        </label>
      </div>

      {images.map((img, idx) => (
        <div key={idx} className="flex items-start gap-3 rounded-lg border border-line bg-canvas p-2.5">
          <img src={img.url} alt={img.alt} className="h-14 w-20 rounded object-cover" />
          <div className="flex-1 space-y-1.5">
            <input
              type="text"
              placeholder="Alt text (required for accessibility)"
              value={img.alt}
              onChange={(e) => {
                const copy = [...images];
                copy[idx] = { ...copy[idx], alt: e.target.value };
                onChange(copy);
              }}
              className="w-full rounded border border-line bg-surface px-2.5 py-1 text-xs text-ink"
            />
            <input
              type="text"
              placeholder="Optional caption"
              value={img.caption || ''}
              onChange={(e) => {
                const copy = [...images];
                copy[idx] = { ...copy[idx], caption: e.target.value };
                onChange(copy);
              }}
              className="w-full rounded border border-line bg-surface px-2.5 py-1 text-xs text-ink"
            />
          </div>
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onChange(images.filter((_, i) => i !== idx))}
            className="p-1 text-muted hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ProjectFormModal({ project, nextSortOrder, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [summary, setSummary] = useState(project?.summary || '');
  const [category, setCategory] = useState(project?.category || 'Web');
  const [year, setYear] = useState(project?.year || '2026');
  const [role, setRole] = useState(project?.role || 'Product Designer');
  const [timeline, setTimeline] = useState(project?.timeline || '');
  const [toolsText, setToolsText] = useState(project?.tools?.join(', ') || 'Figma, React');
  const [coverImage, setCoverImage] = useState(project?.cover_image || '');
  const [coverAlt, setCoverAlt] = useState(project?.cover_alt || '');
  const [problem, setProblem] = useState(project?.problem || '');
  const [process, setProcess] = useState(project?.process || '');
  const [outcome, setOutcome] = useState(project?.outcome || '');
  const [figmaUrl, setFigmaUrl] = useState(project?.figma_url || '');
  const [liveUrl, setLiveUrl] = useState(project?.live_url || '');
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? true);
  const [metrics, setMetrics] = useState<CaseStudyMetric[]>(project?.metrics || []);
  const [wireframes, setWireframes] = useState<CaseStudyImage[]>(project?.wireframe_images || []);
  const [finals, setFinals] = useState<CaseStudyImage[]>(project?.final_images || []);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadProjectImage(file, 'covers');
      setCoverImage(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      setError('Please upload a cover image.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: title.trim(),
      slug: (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      summary: summary.trim(),
      category,
      year: year.trim(),
      role: role.trim(),
      timeline: timeline.trim(),
      tools: toolsText.split(',').map((t) => t.trim()).filter(Boolean),
      cover_image: coverImage,
      cover_alt: coverAlt.trim(),
      problem,
      process,
      outcome,
      metrics,
      wireframe_images: wireframes,
      final_images: finals,
      figma_url: figmaUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      featured,
      published,
      sort_order: project ? project.sort_order : nextSortOrder,
    };

    const query = project
      ? supabase.from('projects').update(payload).eq('id', project.id)
      : supabase.from('projects').insert(payload);

    const { error: dbError } = await query;
    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="font-serif text-2xl font-medium text-ink">
            {project ? 'Edit Project' : 'New Case Study'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="p-1 text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && <p className="rounded-lg bg-red-500/10 p-3 text-xs text-red-600">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-ink">Title *</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink">URL Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated-from-title" className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink">1–2 Line Summary *</label>
            <textarea required rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-ink">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink">
                <option>Web</option>
                <option>Mobile</option>
                <option>Dashboard</option>
                <option>Design System</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink">Year</label>
              <input value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink">Role</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink">Timeline</label>
              <input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 6 weeks" className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink">Tools (comma separated)</label>
            <input value={toolsText} onChange={(e) => setToolsText(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
          </div>

          <div className="space-y-2 rounded-lg border border-line bg-canvas p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Cover Image *</span>
              <label className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-subtle">
                {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="sr-only" />
              </label>
            </div>
            {coverImage && <img src={coverImage} alt={coverAlt} className="h-36 w-full rounded-lg object-cover" />}
            <input
              placeholder="Cover alt text (accessibility)"
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              className="w-full rounded border border-line bg-surface px-3 py-1.5 text-xs text-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink">The Problem</label>
            <textarea rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink">Process &amp; Research</label>
            <textarea rows={4} value={process} onChange={(e) => setProcess(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
          </div>

          <GalleryUploader label="Wireframes & Explorations" images={wireframes} folder="wireframes" onChange={setWireframes} />
          <GalleryUploader label="Final Screens" images={finals} folder="finals" onChange={setFinals} />

          <div>
            <label className="block text-xs font-medium text-ink">Outcome &amp; Learnings</label>
            <textarea rows={3} value={outcome} onChange={(e) => setOutcome(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink">Outcome Metrics</span>
              <button
                type="button"
                onClick={() => setMetrics([...metrics, { label: '', value: '' }])}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Add Metric
              </button>
            </div>
            {metrics.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Value (e.g. -38%)" value={m.value} onChange={(e) => { const c = [...metrics]; c[i].value = e.target.value; setMetrics(c); }} className="w-1/3 rounded border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink" />
                <input placeholder="Label (e.g. Checkout time)" value={m.label} onChange={(e) => { const c = [...metrics]; c[i].label = e.target.value; setMetrics(c); }} className="flex-1 rounded border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink" />
                <button type="button" onClick={() => setMetrics(metrics.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-ink">Figma / Prototype URL</label>
              <input type="url" value={figmaUrl} onChange={(e) => setFigmaUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink">Live Site URL</label>
              <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink" />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured on Home
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2 text-sm text-slate">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-accent-ink hover:bg-accent-hover disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
