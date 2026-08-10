import { getApiConfigSync } from './storage';

function apiUrl(path: string): string {
  return `${getApiConfigSync().host}${path}`;
}

// Headers for authenticated management calls. The tracking pixel (getPixelUrl)
// is deliberately excluded: it is embedded in outgoing mail and must stay public.
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const { token } = getApiConfigSync();
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'X-Pinggy-No-Screen': 'true',
    ...extra,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function registerEmail(subject: string, recipient: string, sender: string): Promise<{ id: string } | null> {
  try {
    const res = await fetch(apiUrl('/api/emails'), {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify({ subject, recipient, sender }),
    });
    if (res.ok) return res.json();
    console.error('[Magio] Server error:', await res.text());
    return null;
  } catch (err) {
    console.error('[Magio] Network error:', err);
    return null;
  }
}

export function getPixelUrl(emailId: string): string {
  return apiUrl(`/api/track/${emailId}.gif`);
}

export type TrackingData = {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  totalViews: number;
  uniqueIps: number;
  lastView: string | null;
  views: {
    viewedAt: string;
    ipAddress: string | null;
    userAgent: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    browser?: string | null;
    os?: string | null;
    device?: string | null;
  }[];
};

export async function fetchTrackingData(subject: string): Promise<TrackingData | null> {
  try {
    const res = await fetch(apiUrl(`/api/emails/search?subject=${encodeURIComponent(subject)}`), {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteLatestTrackingView(emailId: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/api/emails/${emailId}/views/latest`), {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type EmailStatus = { subject: string; viewCount: number };

export async function fetchAllTrackingStatuses(): Promise<EmailStatus[]> {
  try {
    const res = await fetch(apiUrl('/api/emails'), { headers: authHeaders() });
    if (!res.ok) return [];
    const emails: { subject: string; views: unknown[] }[] = await res.json();
    return emails.map((e) => ({ subject: e.subject, viewCount: e.views.length }));
  } catch {
    return [];
  }
}
