import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelReq extends IncomingMessage {
  body?: unknown;
}

interface VercelRes extends ServerResponse {
  status: (code: number) => VercelRes;
  json: (data: unknown) => void;
}

const BOT_REGEX =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|puppeteer|playwright|curl|wget|python-requests|axios|node-fetch|postman|linkedinbot|facebookexternalhit|twitterbot|slackbot|discordbot|whatsapp|preview/i;

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getHeader(req: VercelReq, name: string): string {
  const val = req.headers[name.toLowerCase()];
  return Array.isArray(val) ? val[0] : val || '';
}

async function sendNotification(details: {
  path: string;
  source: string;
  country: string;
  deviceType: string;
}): Promise<boolean> {
  const summary = `New portfolio visitor (${details.country}, ${details.deviceType}) on ${details.path} via ${details.source}`;

  const resendKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.ALERT_EMAIL_TO;
  const emailFrom = process.env.ALERT_EMAIL_FROM || 'Portfolio Alerts <onboarding@resend.dev>';

  if (resendKey && emailTo) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [emailTo],
        subject: `Portfolio Visit: ${details.source} (${details.country})`,
        text: `${summary}\n\nTime (UTC): ${new Date().toISOString()}`,
      }),
    });
    return res.ok;
  }

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;

  if (tgToken && tgChatId) {
    const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: tgChatId,
        text: summary,
      }),
    });
    return res.ok;
  }

  return false;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ua = getHeader(req, 'user-agent');
  if (!ua || BOT_REGEX.test(ua)) {
    return res.status(200).json({ ok: true, ignored: 'bot' });
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}) as Record<
    string,
    unknown
  >;

  const visitorId = String(body.visitorId || '').trim().slice(0, 64);
  const path = String(body.path || '/').trim().slice(0, 200);
  const source = String(body.source || 'direct').trim().slice(0, 64);

  if (!visitorId || path.startsWith('/admin')) {
    return res.status(200).json({ ok: true, ignored: 'excluded' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server analytics configuration missing' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const rawCountry = getHeader(req, 'x-vercel-ip-country');
  const country = rawCountry ? decodeURIComponent(rawCountry).slice(0, 16) : 'Unknown';
  const deviceType = getDeviceType(ua);

  let shouldNotify = false;
  const { data: settings } = await supabaseAdmin
    .from('app_settings')
    .select('notifications_enabled')
    .eq('id', 1)
    .maybeSingle();

  if (settings?.notifications_enabled) {
    const startOfTodayUtc = `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;
    const { data: priorAlert } = await supabaseAdmin
      .from('visits')
      .select('id')
      .eq('visitor_id', visitorId)
      .eq('notified', true)
      .gte('created_at', startOfTodayUtc)
      .limit(1)
      .maybeSingle();

    if (!priorAlert) {
      shouldNotify = true;
    }
  }

  let notified = false;
  if (shouldNotify) {
    try {
      notified = await sendNotification({ path, source, country, deviceType });
    } catch {
      notified = false;
    }
  }

  const { error: insertError } = await supabaseAdmin.from('visits').insert({
    visitor_id: visitorId,
    path,
    source,
    device_type: deviceType,
    country,
    notified,
  });

  if (insertError) {
    return res.status(500).json({ error: 'Failed to record visit' });
  }

  return res.status(200).json({ ok: true, notified });
}
