import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { detectTrafficSource, getAnonymousVisitorId } from '../lib/analytics';
import { supabase } from '../lib/supabase';

/**
 * Sends one lightweight visit event per route navigation to /api/track.
 * Skips /admin routes and skips tracking when the owner is signed in.
 */
export function usePageTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const fullPath = location.pathname;
    if (fullPath.startsWith('/admin')) return;
    if (lastTrackedPath.current === fullPath) return;

    let cancelled = false;

    async function sendVisit() {
      const { data } = await supabase.auth.getSession();
      if (cancelled || data.session) return;

      lastTrackedPath.current = fullPath;

      const payload = {
        visitorId: getAnonymousVisitorId(),
        path: fullPath,
        source: detectTrafficSource(),
      };

      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }

    sendVisit();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);
}
