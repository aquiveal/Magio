import { NextRequest, NextResponse } from 'next/server';
import { dbConnector } from '@/lib/db/connector';
import { verifyPassword, generateToken } from '@/lib/auth/crypto';
import { SESSION_COOKIE, SESSION_MAX_AGE, sessionCookieOptions } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await dbConnector.getUserByUsername(username.trim());
    const valid = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !valid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const sessionToken = generateToken();
    await dbConnector.createSession({
      token: sessionToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    });

    const response = NextResponse.json({
      user: { username: user.username },
      apiToken: user.apiToken,
    });
    response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
