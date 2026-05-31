import { NextResponse } from "next/server";
import { finalizeCaseHandshake } from "@/lib/handshake/flow";
import { isAttorneyUnlocked } from "@/lib/attorney-auth";

export const runtime = "nodejs";

// Attorney-only: renders the document bundle and records it on the case.
export async function POST(
  _req: Request,
  { params }: { params: { caseRef: string } }
) {
  if (!isAttorneyUnlocked()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await finalizeCaseHandshake(params.caseRef);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[attorney-handshake/finalize]", err);
    return NextResponse.json({ error: "Failed to finalize case" }, { status: 500 });
  }
}
