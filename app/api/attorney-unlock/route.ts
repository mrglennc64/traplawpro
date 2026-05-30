import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let passcode = '';
  try {
    const body = await req.json();
    passcode = String(body?.passcode || '').trim();
  } catch {
    return NextResponse.json({ success: false, error: 'invalid body' }, { status: 400 });
  }

  const attorneyCode = process.env.ATTORNEY_PASSCODE;
  const adminCode = process.env.ADMIN_PASSCODE;

  let role: 'attorney' | 'admin' | null = null;
  if (attorneyCode && passcode === attorneyCode) role = 'attorney';
  else if (adminCode && passcode === adminCode) role = 'admin';

  if (!role) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const res = NextResponse.json({ success: true, role });
  const maxAge = 43200; // 12h
  const opts = { path: '/', maxAge, sameSite: 'lax' as const };
  res.cookies.set('trp_attorney_unlocked', '1', opts);
  res.cookies.set('trp_attorney_role', role, opts);
  res.cookies.set('trp_cases_session', 'TRP-ATT-2026', opts);
  return res;
}
