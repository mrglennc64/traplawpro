import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startCaseHandshake } from "@/lib/handshake/flow";
import { attorneyRole } from "@/lib/attorney-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const role = attorneyRole();
  if (!role) {
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
    // For an attorney login, auto-link the firm identity so her email
    // (for notifications) populates automatically — she never types it.
    let attorneyId: string | undefined = body.attorneyId;
    if (role === "attorney" && !attorneyId) {
      const atty =
        (await prisma.attorney.findFirst({ where: { firm: "Funderburg Law" } })) ??
        (await prisma.attorney.findFirst());
      attorneyId = atty?.id;
    }
    const result = await startCaseHandshake({
      ownerRole: role,
      attorneyId,
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
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[attorney-handshake/start]", err);
    return NextResponse.json({ error: "Failed to start case handshake" }, { status: 500 });
  }
}
