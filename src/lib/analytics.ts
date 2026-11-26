const VISITOR_ID_KEY = 'portfolio_anon_visitor_id';

/**
 * Returns a persistent random UUID stored in localStorage.
 * No IP, cookies, or personal data are collected.
 */
export function getAnonymousVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

/**
 * Extracts traffic source from ?ref= query param (e.g. ?ref=linkedin)
 * or falls back to document.referrer hostname.
 */
export function detectTrafficSource(): string {
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref')?.trim().toLowerCase();
  if (refParam) return refParam.slice(0, 64);

  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (host && host !== window.location.hostname) {
        return host.slice(0, 64);
      }
    } catch {
      return 'direct';
    }
  }
  return 'direct';
}
