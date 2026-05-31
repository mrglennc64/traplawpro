import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attorneyRole } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Full case view, scoped to the current login (an attorney can't load an
// admin's case by ref, or vice versa).
export async function GET(
  _req: Request,
  { params }: { params: { caseRef: string } }
) {
  const role = attorneyRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const caseRecord = await prisma.attorneyCase.findUnique({
    where: { caseRef: params.caseRef },
    include: {
      handshakes: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!caseRecord || caseRecord.ownerRole !== role) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, case: caseRecord });
}
