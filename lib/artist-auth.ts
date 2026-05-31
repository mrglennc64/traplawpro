import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

// Passwordless magic-link auth for the artist dashboard. Tokens are stored
// hashed; a verified login sets an HMAC-signed session cookie keyed to the
// artist's email. (Delivery is via lib/mailer, inert until a provider is set.)

const COOKIE = "trp_artist";
const TTL_MS = 30 * 60 * 1000; // magic link valid 30 min
const SESSION_DAYS = 14;

function secret(): string {
  return (
    process.env.ARTIST_SESSION_SECRET ||
    process.env.ADMIN_PASSCODE || // fallback so signing still works pre-config
    "traplawpro-artist-dev-secret"
  );
}
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

/** Create a single-use magic token for an email; returns the raw token. */
export async function createMagicToken(email: string): Promise<string> {
  const raw = crypto.randomBytes(32).toString("hex");
  await prisma.artistAuthToken.create({
    data: {
      email: email.toLowerCase().trim(),
      tokenHash: sha256(raw),
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
  return raw;
}

/** Consume a magic token; returns the email if valid+unused+unexpired. */
export async function consumeMagicToken(raw: string): Promise<string | null> {
  const rec = await prisma.artistAuthToken.findUnique({ where: { tokenHash: sha256(raw) } });
  if (!rec || rec.consumedAt || rec.expiresAt < new Date()) return null;
  await prisma.artistAuthToken.update({ where: { id: rec.id }, data: { consumedAt: new Date() } });
  return rec.email;
}

// --- session cookie (HMAC-signed email) ---
function sign(email: string): string {
  const exp = Date.now() + SESSION_DAYS * 86400_000;
  const body = `${email}|${exp}`;
  const mac = crypto.createHmac("sha256", secret()).update(body).digest("hex");
  return Buffer.from(`${body}|${mac}`).toString("base64url");
}

export function setArtistSession(email: string) {
  cookies().set(COOKIE, sign(email.toLowerCase().trim()), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

/** Returns the logged-in artist email, or null. Verifies HMAC + expiry. */
export function getArtistSession(): string | null {
  const c = cookies().get(COOKIE)?.value;
  if (!c) return null;
  try {
    const [email, exp, mac] = Buffer.from(c, "base64url").toString().split("|");
    if (!email || !exp || !mac) return null;
    const expected = crypto.createHmac("sha256", secret()).update(`${email}|${exp}`).digest("hex");
    if (mac !== expected) return null;
    if (Number(exp) < Date.now()) return null;
    return email;
  } catch {
    return null;
  }
}

export function clearArtistSession() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}
