import { NextRequest, NextResponse } from 'next/server';
import { dbConnector } from '@/lib/db/connector';
import { getViewDetails } from '@/lib/tracking/view-details';

export const dynamic = 'force-dynamic';

const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

const PIXEL_RESPONSE_HEADERS = {
  'Content-Type': 'image/gif',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.replace('.gif', '');

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const email = await dbConnector.getEmailById(cleanId);
    const ts = new Date().toISOString();

    if (!email) {
      console.log(`[track ${ts}] pixel hit for unknown id="${cleanId}" from ${ipAddress}`);
      return new NextResponse(PIXEL, { headers: PIXEL_RESPONSE_HEADERS });
    }

    const isSenderView = email.senderIp && email.senderIp === ipAddress;
    const isImmediateOpen = Date.now() - email.createdAt.getTime() < 5 * 60_000;

    if (isSenderView) {
      console.log(`[track ${ts}] skipped id="${cleanId}" subject="${email.subject}" (sender self-view from ${ipAddress})`);
    } else if (isImmediateOpen) {
      console.log(`[track ${ts}] skipped id="${cleanId}" subject="${email.subject}" (immediate open within 5m)`);
    } else {
      console.log(`[track ${ts}] logging view id="${cleanId}" subject="${email.subject}" from ${ipAddress}`);
      getViewDetails(ipAddress, userAgent)
        .then((details) => dbConnector.logEmailView(cleanId, {
          ipAddress,
          userAgent,
          ...details,
        }))
        .catch((err) => {
          console.error(`[track ${ts}] failed to log view for id="${cleanId}":`, err);
        });
    }

    return new NextResponse(PIXEL, { headers: PIXEL_RESPONSE_HEADERS });
  } catch (error) {
    console.error('Error in tracking pixel:', error);
    return new NextResponse(PIXEL, { headers: PIXEL_RESPONSE_HEADERS });
  }
}
