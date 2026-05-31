import { NextResponse } from "next/server";
import { consumeMagicToken, setArtistSession } from "@/lib/artist-auth";

export const runtime = "nodejs";

// GET ?token=... -> consume the magic token, set the session cookie, redirect
// to the dashboard. Invalid/expired tokens bounce to login with an error flag.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const base = process.env.NEXT_PUBLIC_BASE_URL || url.origin;

  const email = token ? await consumeMagicToken(token) : null;
  if (!email) {
    return NextResponse.redirect(`${base}/artist/login?error=expired`);
  }
  setArtistSession(email);
  return NextResponse.redirect(`${base}/artist/cases`);
}
