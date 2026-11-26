export interface CaseStudyImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  year: string;
  role: string;
  timeline: string;
  tools: string[];
  cover_image: string;
  cover_alt: string;
  problem: string;
  process: string;
  outcome: string;
  metrics: CaseStudyMetric[];
  wireframe_images: CaseStudyImage[];
  final_images: CaseStudyImage[];
  figma_url: string | null;
  live_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Visit {
  id: string;
  visitor_id: string;
  path: string;
  source: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  country: string;
  notified: boolean;
  created_at: string;
}

export interface AppSettings {
  id: number;
  notifications_enabled: boolean;
  updated_at: string;
}
