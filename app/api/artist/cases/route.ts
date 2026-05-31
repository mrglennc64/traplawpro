import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getArtistSession } from "@/lib/artist-auth";

export const runtime = "nodejs";

// Session-gated: list all cases for the logged-in artist's email. An artist's
// email is matched against their handshake identity (or the case artistEmail).
export async function GET() {
  const email = getArtistSession();
  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const cases = await prisma.attorneyCase.findMany({
    where: {
      artistViewEnabled: true,
      OR: [
        { artistEmail: { equals: email, mode: "insensitive" } },
        { handshakes: { some: { email: { equals: email, mode: "insensitive" } } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    email,
    cases: cases.map((c) => ({
      token: c.signToken, // artists navigate to their tokenized detail view
      caseRef: c.caseRef,
      recordingTitle: c.recordingTitle,
      status: c.status,
      share: c.share,
    })),
  });
}
