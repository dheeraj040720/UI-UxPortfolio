import { useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Visit } from '../../types/database';

function countBy(items: Visit[], key: (v: Visit) => string): [string, number][] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item) || 'Unknown';
    map.set(k, (map.get(k) || 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function BreakdownCard({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = rows[0]?.[1] || 1;
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-4 text-xs text-muted">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.slice(0, 6).map(([label, count]) => (
            <li key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="truncate font-medium text-ink">{label}</span>
                <span className="font-mono text-muted">{count}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.round((count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AnalyticsTab() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savingToggle, setSavingToggle] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [{ data: visitRows }, { data: settingsRow }] = await Promise.all([
      supabase.from('visits').select('*').order('created_at', { ascending: false }).limit(1000),
      supabase.from('app_settings').select('notifications_enabled').eq('id', 1).maybeSingle(),
    ]);

    setVisits((visitRows as Visit[]) || []);
    if (settingsRow) setNotificationsEnabled(settingsRow.notifications_enabled);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleNotifications = async () => {
    setSavingToggle(true);
    const next = !notificationsEnabled;
    const { error } = await supabase
      .from('app_settings')
      .update({ notifications_enabled: next })
      .eq('id', 1);

    if (!error) setNotificationsEnabled(next);
    setSavingToggle(false);
  };

  const stats = useMemo(() => {
    const uniqueVisitors = new Set(visits.map((v) => v.visitor_id)).size;

    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const iso = d.toISOString().slice(0, 10);
      days.push({
        date: iso,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        count: 0,
      });
    }
    const dayMap = new Map(days.map((d) => [d.date, d]));
    for (const v of visits) {
      const dayKey = v.created_at.slice(0, 10);
      const entry = dayMap.get(dayKey);
      if (entry) entry.count += 1;
    }

    return {
      totalViews: visits.length,
      uniqueVisitors,
      days,
      maxDay: Math.max(1, ...days.map((d) => d.count)),
      topPages: countBy(visits, (v) => v.path),
      sources: countBy(visits, (v) => v.source),
      countries: countBy(visits, (v) => v.country),
    };
  }, [visits]);

  if (loading) return <div className="py-12 text-sm text-muted">Loading analytics...</div>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Total Views</p>
          <p className="mt-2 font-serif text-4xl font-medium text-ink">{stats.totalViews}</p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Unique Visitors</p>
          <p className="mt-2 font-serif text-4xl font-medium text-ink">{stats.uniqueVisitors}</p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Visitor Alerts</p>
            <button
              type="button"
              onClick={loadData}
              aria-label="Refresh analytics"
              className="rounded-md p-1 text-muted hover:bg-subtle hover:text-ink"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            disabled={savingToggle}
            onClick={toggleNotifications}
            className={`mt-3 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              notificationsEnabled
                ? 'bg-accent-soft text-accent'
                : 'border border-line bg-subtle text-slate'
            }`}
          >
            {notificationsEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            {notificationsEnabled ? 'Alerts On' : 'Alerts Paused'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-6">
        <h3 className="text-sm font-semibold text-ink">Views per Day (Last 14 Days)</h3>
        <div className="mt-6 flex h-40 items-end gap-2">
          {stats.days.map((d) => {
            const pct = Math.round((d.count / stats.maxDay) * 100);
            return (
              <div key={d.date} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-32 w-full items-end justify-center">
                  <div
                    title={`${d.label}: ${d.count} views`}
                    className="w-full max-w-[28px] rounded-t-md bg-accent/85 transition-all group-hover:bg-accent"
                    style={{ height: `${Math.max(pct, d.count > 0 ? 6 : 2)}%` }}
                  />
                </div>
                <span className="hidden font-mono text-[10px] text-muted sm:block">
                  {d.label.split(' ')[1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <BreakdownCard title="Top Pages" rows={stats.topPages} />
        <BreakdownCard title="Traffic Sources" rows={stats.sources} />
        <BreakdownCard title="Countries" rows={stats.countries} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-5 py-4">
          <h3 className="text-sm font-semibold text-ink">Recent Visits (Latest 25)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-subtle/50 font-mono uppercase text-muted">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Page</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visits.slice(0, 25).map((v) => (
                <tr key={v.id} className="hover:bg-subtle/30">
                  <td className="whitespace-nowrap px-5 py-3 text-muted">
                    {new Date(v.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-medium text-ink">{v.path}</td>
                  <td className="px-5 py-3 font-mono text-accent">{v.source}</td>
                  <td className="px-5 py-3 capitalize text-slate">{v.device_type}</td>
                  <td className="px-5 py-3 text-slate">{v.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
