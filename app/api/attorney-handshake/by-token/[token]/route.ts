import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Public: resolve a signing token to the signer-safe subset of case fields.
// Never returns the attorney's internal metadata or other cases.
export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const caseRecord = await prisma.attorneyCase.findUnique({
    where: { signToken: params.token },
    include: { handshakes: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
  }

  const latest = caseRecord.handshakes[0];
  return NextResponse.json({
    caseRef: caseRecord.caseRef,
    recordingTitle: caseRecord.recordingTitle,
    isrc: caseRecord.isrc,
    primaryArtist: caseRecord.primaryArtist,
    performerName: caseRecord.performerName,
    performerRole: caseRecord.performerRole,
    share: caseRecord.share,
    status: caseRecord.status,
    handshake: latest
      ? {
          id: latest.id,
          biometricStatus: latest.biometricStatus,
          signed: Boolean(latest.signedAt),
          hashAnchor: latest.hashAnchor,
        }
      : null,
  });
}
