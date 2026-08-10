import { NextRequest, NextResponse } from 'next/server';
import { dbConnector } from '@/lib/db/connector';
import { getCurrentUser } from './session';

export type AuthedUser = { id: string; username: string };

/**
 * Authenticate an API request. Accepts either:
 *  - `Authorization: Bearer <apiToken>` (used by the browser extension), or
 *  - the session cookie (used by same-origin dashboard requests).
 * Returns the user, or a 401 NextResponse the caller should return as-is.
 */
export async function requireApiUser(request: NextRequest): Promise<AuthedUser | NextResponse> {
  const header = request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7).trim();
    if (token) {
      const user = await dbConnector.getUserByApiToken(token);
      if (user) return { id: user.id, username: user.username };
    }
    return unauthorized();
  }

  const sessionUser = await getCurrentUser();
  if (sessionUser) return { id: sessionUser.id, username: sessionUser.username };

  return unauthorized();
}

export function isAuthResponse(value: AuthedUser | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}

function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
