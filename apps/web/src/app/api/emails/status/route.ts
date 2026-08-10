import { NextRequest, NextResponse } from 'next/server';
import { dbConnector } from '@/lib/db/connector';
import { requireApiUser, isAuthResponse } from '@/lib/auth/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiUser(request);
    if (isAuthResponse(auth)) return auth;

    const emails = await dbConnector.getEmailStatuses();
    const statuses = emails.map((e) => ({
      subject: e.subject,
      viewCount: e._count.views,
    }));
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Error fetching email statuses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
