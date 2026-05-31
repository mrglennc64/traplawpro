import { NextResponse } from "next/server";
import { createMagicToken } from "@/lib/artist-auth";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

// POST { email } -> always responds generically (no account enumeration). When
// an email provider is configured, the magic link is delivered; otherwise it's
// logged server-side (see lib/mailer).
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }
    const token = await createMagicToken(email);
    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://traplawpro.com";
    const link = `${base}/api/artist/auth/verify?token=${token}`;
    await sendMail({
      to: email,
      subject: "Your TrapLawPro sign-in link",
      html: `<p>Tap to view your royalty case status:</p><p><a href="${link}">Sign in to your Artist Dashboard</a></p><p>This link expires in 30 minutes.</p>`,
      text: `Sign in to your Artist Dashboard: ${link} (expires in 30 minutes)`,
    });
    // Generic response regardless of delivery/existence.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not process request" }, { status: 500 });
  }
}
