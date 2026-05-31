import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAttorneyUnlocked } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Attorney-only: full case view (status, signing token, handshakes, documents).
export async function GET(
  _req: Request,
  { params }: { params: { caseRef: string } }
) {
  if (!isAttorneyUnlocked()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const caseRecord = await prisma.attorneyCase.findUnique({
    where: { caseRef: params.caseRef },
    include: {
      handshakes: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!caseRecord) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, case: caseRecord });
}
