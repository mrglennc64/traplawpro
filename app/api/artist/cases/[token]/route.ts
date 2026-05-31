import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Public, token-authorized: an artist resolves their own case via the
// unguessable signToken they received. Returns only their case, artist-safe.
export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const c = await prisma.attorneyCase.findUnique({
    where: { signToken: params.token },
    include: {
      attorney: true,
      documents: { orderBy: { createdAt: "asc" } },
      handshakes: { orderBy: { createdAt: "desc" }, take: 1 },
      notifications: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!c || !c.artistViewEnabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const latest = c.handshakes[0];
  const fileName = (storageUrl: string) => storageUrl.split("/").pop() ?? "";

  return NextResponse.json({
    caseRef: c.caseRef,
    recordingTitle: c.recordingTitle,
    isrc: c.isrc,
    primaryArtist: c.primaryArtist,
    performerName: c.performerName,
    performerRole: c.performerRole,
    share: c.share,
    status: c.status,
    attorney: c.attorney
      ? { name: c.attorney.name, firm: c.attorney.firm }
      : null,
    signed: Boolean(latest?.signedAt),
    hashAnchor: latest?.hashAnchor ?? null,
    documents: c.documents.map((d) => ({
      type: d.type,
      // Token-authorized artist download (separate from the attorney-gated route).
      downloadUrl: `/api/artist/cases/${params.token}/file/${fileName(d.storageUrl)}`,
    })),
    notifications: c.notifications.map((n) => ({
      message: n.message,
      createdAt: n.createdAt,
    })),
  });
}
