import { NextResponse } from "next/server";
import { signAuthorization, finalizeCaseHandshake } from "@/lib/handshake/flow";

export const runtime = "nodejs";

// Public (signer-facing): captures the signature, seals the SHA-256 anchor, and
// auto-generates the document bundle (so the attorney sees a complete handshake
// the moment the artist signs — no separate finalize step required).
export async function POST(
  req: Request,
  { params }: { params: { caseRef: string } }
) {
  try {
    const body = await req.json();
    if (!body.handshakeId || !body.signature) {
      return NextResponse.json(
        { error: "handshakeId and signature are required" },
        { status: 400 }
      );
    }
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      undefined;

    const result = await signAuthorization({
      handshakeId: body.handshakeId,
      signature: body.signature,
      userAgent,
      ipAddress,
    });

    // Auto-finalize the bundle. A render failure must NOT void the seal (the
    // signature is the legal act); the attorney can regenerate via /finalize.
    let documents: Record<string, string> | undefined;
    try {
      const finalized = await finalizeCaseHandshake(params.caseRef);
      documents = finalized.documents;
    } catch (e) {
      console.error("[attorney-handshake/sign] auto-finalize failed", e);
    }

    return NextResponse.json({ success: true, ...result, documents });
  } catch (err) {
    console.error("[attorney-handshake/sign]", err);
    return NextResponse.json({ error: "Failed to sign authorization" }, { status: 500 });
  }
}
