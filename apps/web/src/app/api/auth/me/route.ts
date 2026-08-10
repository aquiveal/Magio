import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser, isAuthResponse } from '@/lib/auth/api-auth';

// Used by the extension to verify a stored token is still valid, and by the
// dashboard to read the current session.
export async function GET(request: NextRequest) {
  const user = await requireApiUser(request);
  if (isAuthResponse(user)) return user;
  return NextResponse.json({ user: { username: user.username } });
}
