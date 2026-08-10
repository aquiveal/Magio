import { NextRequest, NextResponse } from 'next/server';
import { dbConnector } from '@/lib/db/connector';
import { hashPassword, generateToken } from '@/lib/auth/crypto';
import { SESSION_COOKIE, SESSION_MAX_AGE, sessionCookieOptions } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await dbConnector.getUserByUsername(cleanUsername);
    if (existing) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const apiToken = generateToken();
    const user = await dbConnector.createUser({ username: cleanUsername, passwordHash, apiToken });

    const sessionToken = generateToken();
    await dbConnector.createSession({
      token: sessionToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    });

    const response = NextResponse.json({
      user: { username: user.username },
      apiToken: user.apiToken,
    }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
