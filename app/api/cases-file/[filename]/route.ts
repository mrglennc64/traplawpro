import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const VALID_KEYS = ['TRP-ATT-2026', 'Lerae'];
const COOKIE_NAME = 'trp_cases_session';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  // Check session cookie
  const session = req.cookies.get(COOKIE_NAME)?.value;
  if (!session || !VALID_KEYS.includes(session)) {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  const filename = params.filename;

  // Only allow PDF files, block path traversal
  if (!filename.endsWith('.pdf') || filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const filePath = join(process.cwd(), 'public', 'cases', filename);
  if (!existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const file = readFileSync(filePath);
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
