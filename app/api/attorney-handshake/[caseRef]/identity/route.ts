import { NextResponse } from "next/server";
import { captureIdentity } from "@/lib/handshake/flow";

export const runtime = "nodejs";

// Public (signer-facing): the performer reaches this via their signing link.
export async function POST(
  req: Request,
  { params }: { params: { caseRef: string } }
) {
  try {
    const body = await req.json();
    if (!body.legalName || !body.email) {
      return NextResponse.json(
        { error: "legalName and email are required" },
        { status: 400 }
      );
    }
    const result = await captureIdentity(params.caseRef, {
      legalName: body.legalName,
      stageName: body.stageName,
      email: body.email,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[attorney-handshake/identity]", err);
    return NextResponse.json({ error: "Failed to capture identity" }, { status: 500 });
  }
}
