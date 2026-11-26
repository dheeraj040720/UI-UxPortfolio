-- Portfolio database schema: projects, private visits, settings, RLS, and storage.

-- 1. Enable UUID helper
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Projects table (publicly readable when published, admin-only writes)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '2026',
  role TEXT NOT NULL DEFAULT '',
  timeline TEXT NOT NULL DEFAULT '',
  tools TEXT[] NOT NULL DEFAULT '{}',
  cover_image TEXT NOT NULL,
  cover_alt TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  process TEXT NOT NULL DEFAULT '',
  outcome TEXT NOT NULL DEFAULT '',
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  wireframe_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  final_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  figma_url TEXT,
  live_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_sort
  ON public.projects (sort_order ASC, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Private visitor analytics table
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'direct',
  device_type TEXT NOT NULL DEFAULT 'desktop',
  country TEXT NOT NULL DEFAULT 'Unknown',
  notified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_created_at
  ON public.visits (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_visits_visitor_day
  ON public.visits (visitor_id, created_at DESC);

-- 4. App settings table (single row for notification toggle)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.app_settings (id, notifications_enabled)
VALUES (1, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published projects" ON public.projects;
CREATE POLICY "Public can read published projects"
  ON public.projects
  FOR SELECT
  USING (published = TRUE OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can insert projects" ON public.projects;
CREATE POLICY "Admin can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update projects" ON public.projects;
CREATE POLICY "Admin can update projects"
  ON public.projects
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete projects" ON public.projects;
CREATE POLICY "Admin can delete projects"
  ON public.projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can read visits" ON public.visits;
CREATE POLICY "Admin can read visits"
  ON public.visits
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can read settings" ON public.app_settings;
CREATE POLICY "Admin can read settings"
  ON public.app_settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update settings" ON public.app_settings;
CREATE POLICY "Admin can update settings"
  ON public.app_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKET & POLICIES (Project images & Resume PDF)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
CREATE POLICY "Public can view portfolio assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Admin can upload portfolio assets" ON storage.objects;
CREATE POLICY "Admin can upload portfolio assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update portfolio assets" ON storage.objects;
CREATE POLICY "Admin can update portfolio assets"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete portfolio assets" ON storage.objects;
CREATE POLICY "Admin can delete portfolio assets"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
