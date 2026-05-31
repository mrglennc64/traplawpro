import { NextResponse } from "next/server";
import { completeBiometric } from "@/lib/handshake/flow";

export const runtime = "nodejs";

// Public (signer-facing): records the WebAuthn biometric result.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.handshakeId || !body.biometricStatus) {
      return NextResponse.json(
        { error: "handshakeId and biometricStatus are required" },
        { status: 400 }
      );
    }
    const result = await completeBiometric({
      handshakeId: body.handshakeId,
      biometricStatus: body.biometricStatus,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[attorney-handshake/biometric]", err);
    return NextResponse.json({ error: "Failed to record biometric" }, { status: 500 });
  }
}
