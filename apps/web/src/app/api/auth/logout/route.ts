import { NextRequest, NextResponse } from 'next/server';
import { dbConnector } from '@/lib/db/connector';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await dbConnector.deleteSession(token);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
  return response;
}
