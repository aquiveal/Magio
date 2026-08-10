import { cookies } from 'next/headers';
import { dbConnector } from '@/lib/db/connector';

export const SESSION_COOKIE = 'magio_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

export function sessionCookieOptions(maxAge: number = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export type SessionUser = { id: string; username: string; apiToken: string };

/** Resolve the logged-in user from the session cookie (server components / route handlers). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await dbConnector.getSessionWithUser(token);
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await dbConnector.deleteSession(token);
    return null;
  }
  return { id: session.user.id, username: session.user.username, apiToken: session.user.apiToken };
}
