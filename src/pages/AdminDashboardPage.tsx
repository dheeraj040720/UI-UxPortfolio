import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FolderKanban, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AnalyticsTab } from '../components/admin/AnalyticsTab';
import { ProjectsTab } from '../components/admin/ProjectsTab';

export function AdminDashboardPage() {
  const [tab, setTab] = useState<'analytics' | 'projects'>('analytics');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-container items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl font-medium">Portfolio Admin</span>
            <Link to="/" className="text-xs text-muted hover:text-ink">
              View Public Site ↗
            </Link>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-slate hover:bg-subtle hover:text-ink"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-container px-5 py-10 sm:px-8 lg:px-12">
        <div role="tablist" className="mb-8 flex gap-2 border-b border-line pb-4">
          <button
            role="tab"
            aria-selected={tab === 'analytics'}
            onClick={() => setTab('analytics')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'analytics'
                ? 'bg-accent text-accent-ink'
                : 'bg-surface text-slate hover:bg-subtle hover:text-ink'
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Analytics
          </button>

          <button
            role="tab"
            aria-selected={tab === 'projects'}
            onClick={() => setTab('projects')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'projects'
                ? 'bg-accent text-accent-ink'
                : 'bg-surface text-slate hover:bg-subtle hover:text-ink'
            }`}
          >
            <FolderKanban className="h-4 w-4" /> Projects
          </button>
        </div>

        {tab === 'analytics' ? <AnalyticsTab /> : <ProjectsTab />}
      </main>
    </div>
  );
}
