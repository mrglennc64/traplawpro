import { NextRequest, NextResponse } from 'next/server';

type Role = 'attorney' | 'admin';

function resolveRole(passcode: string): Role | null {
  const code = passcode.trim();
  if (process.env.ATTORNEY_PASSCODE && code === process.env.ATTORNEY_PASSCODE) return 'attorney';
  if (process.env.ADMIN_PASSCODE && code === process.env.ADMIN_PASSCODE) return 'admin';
  return null;
}

function setUnlockCookies(res: NextResponse, role: Role) {
  const opts = { path: '/', maxAge: 43200 /* 12h */, sameSite: 'lax' as const };
  res.cookies.set('trp_attorney_unlocked', '1', opts);
  res.cookies.set('trp_attorney_role', role, opts);
  res.cookies.set('trp_cases_session', 'TRP-ATT-2026', opts);
}

// JSON API used by the unlock modal.
export async function POST(req: NextRequest) {
  let passcode = '';
  try {
    const body = await req.json();
    passcode = String(body?.passcode || '');
  } catch {
    return NextResponse.json({ success: false, error: 'invalid body' }, { status: 400 });
  }
  const role = resolveRole(passcode);
  if (!role) return NextResponse.json({ success: false }, { status: 401 });

  const res = NextResponse.json({ success: true, role });
  setUnlockCookies(res, role);
  return res;
}

// One-click login link: /api/attorney-unlock?key=<passcode>[&to=/attorney-portal/...]
// Sets the unlock cookies and redirects into the portal. NOTE: the key in the
// URL is a bearer secret — anyone with the link gets in. The `to` target is
// restricted to the /attorney-portal area to prevent open redirects.
export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  const key = req.nextUrl.searchParams.get('key') || '';
  const role = resolveRole(key);

  if (!role) {
    return NextResponse.redirect(`${base}/attorney-portal?login=failed`);
  }

  const toParam = req.nextUrl.searchParams.get('to') || '/attorney-portal';
  const to = toParam.startsWith('/attorney-portal') ? toParam : '/attorney-portal';

  const res = NextResponse.redirect(`${base}${to}`);
  setUnlockCookies(res, role);
  return res;
}
