import { NextResponse } from "next/server";
import { startCaseHandshake } from "@/lib/handshake/flow";
import { isAttorneyUnlocked } from "@/lib/attorney-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAttorneyUnlocked()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.caseRef || !body.isrc || !body.recordingTitle || !body.performerName) {
      return NextResponse.json(
        { error: "caseRef, isrc, recordingTitle and performerName are required" },
        { status: 400 }
      );
    }
    const result = await startCaseHandshake({
      caseRef: body.caseRef,
      isrc: body.isrc,
      recordingTitle: body.recordingTitle,
      primaryArtist: body.primaryArtist ?? body.performerName,
      performerName: body.performerName,
      performerRole: body.performerRole ?? "Featured Performer",
      share: Number(body.share) || 0,
      performerLegalName: body.performerLegalName,
      performerStageName: body.performerStageName,
      ipiNumbers: body.ipiNumbers,
      ipiNote: body.ipiNote,
      claimBasis: body.claimBasis,
      rsrReviewDate: body.rsrReviewDate,
      rsrRegistryResult: body.rsrRegistryResult,
      rsrCommercialStatus: body.rsrCommercialStatus,
      rsrCredited: body.rsrCredited,
      artistEmail: body.artistEmail,
      attorneyId: body.attorneyId,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[attorney-handshake/start]", err);
    return NextResponse.json({ error: "Failed to start case handshake" }, { status: 500 });
  }
}
