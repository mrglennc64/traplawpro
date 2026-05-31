import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { finalizeCaseHandshake } from "@/lib/handshake/flow";
import { attorneyRole } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Attorney-only, scoped to the current login: renders the bundle for own cases.
export async function POST(
  _req: Request,
  { params }: { params: { caseRef: string } }
) {
  const role = attorneyRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const owned = await prisma.attorneyCase.findUnique({
    where: { caseRef: params.caseRef },
    select: { ownerRole: true },
  });
  if (!owned || owned.ownerRole !== role) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  try {
    const result = await finalizeCaseHandshake(params.caseRef);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[attorney-handshake/finalize]", err);
    return NextResponse.json({ error: "Failed to finalize case" }, { status: 500 });
  }
}
