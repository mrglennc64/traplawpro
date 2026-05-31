import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attorneyRole } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Lists handshake cases for the CURRENT login only — an attorney never sees an
// admin's cases and vice versa (scoped by ownerRole).
export async function GET() {
  const role = attorneyRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cases = await prisma.attorneyCase.findMany({
    where: { ownerRole: role },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { documents: true } },
      handshakes: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  return NextResponse.json({
    success: true,
    cases: cases.map((c) => ({
      caseRef: c.caseRef,
      recordingTitle: c.recordingTitle,
      performerName: c.performerName,
      status: c.status,
      docCount: c._count.documents,
      signed: Boolean(c.handshakes[0]?.signedAt),
      signToken: c.signToken,
    })),
  });
}
