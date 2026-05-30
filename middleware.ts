import { NextResponse, type NextRequest } from 'next/server';

const CASES_COOKIE = 'trp_cases_session';
const CASES_VALID_KEYS = ['TRP-ATT-2026', 'Lerae'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/cases/') && pathname.endsWith('.html')) {
    const session = request.cookies.get(CASES_COOKIE)?.value;
    if (!session || !CASES_VALID_KEYS.includes(session)) {
      const url = request.nextUrl.clone();
      url.pathname = '/attorney-portal';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/cases/:path*.html'],
};
