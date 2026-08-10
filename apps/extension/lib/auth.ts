import { normalizeHost } from './storage';

const SKIP_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'X-Pinggy-No-Screen': 'true',
};

export type AuthResult =
  | { ok: true; token: string; username: string }
  | { ok: false; error: string };

async function authRequest(host: string, path: string, username: string, password: string): Promise<AuthResult> {
  const base = normalizeHost(host);
  try {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: SKIP_HEADERS,
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.error || `Request failed (${res.status})` };
    }
    if (!data?.apiToken) {
      return { ok: false, error: 'Server did not return an API token' };
    }
    return { ok: true, token: data.apiToken, username: data.user?.username || username };
  } catch {
    return { ok: false, error: 'Could not reach the server. Check the URL and try again.' };
  }
}

export function login(host: string, username: string, password: string): Promise<AuthResult> {
  return authRequest(host, '/api/auth/login', username, password);
}

export function register(host: string, username: string, password: string): Promise<AuthResult> {
  return authRequest(host, '/api/auth/register', username, password);
}
