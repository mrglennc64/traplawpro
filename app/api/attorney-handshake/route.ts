import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAttorneyUnlocked } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Attorney-only: list all handshake cases so the attorney can open any one and
// retrieve its bundle (answers "where do I pick up a signed case afterward?").
export async function GET() {
  if (!isAttorneyUnlocked()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cases = await prisma.attorneyCase.findMany({
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
