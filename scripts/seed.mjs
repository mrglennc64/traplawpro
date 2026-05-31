// Seeds the law firm + the TR-KW-005 (Kanye West) sample case with full metadata,
// matching the SoundExchange-style document templates. Idempotent: re-running
// resets the case and its handshakes/documents.
//
// Requires DATABASE_URL in the environment (PostgreSQL connection string). Run:
//   DATABASE_URL="postgresql://user:pass@host:5432/traplawpro" npm run db:seed
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  console.error("[seed] DATABASE_URL is not set. Export your PostgreSQL connection string first.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  // 1. Law firm / authorized representative
  const firmName = "Funderburg Law";
  let attorney = await prisma.attorney.findFirst({ where: { firm: firmName } });
  const attorneyData = {
    name: "Brashawna Lerae Funderburg, Esq.",
    firm: firmName,
    barNumber: "Georgia Bar #279167",
    email: "lerae@funderburglaw.com",
    phone: "(678) 814-6300",
    address: "PO Box 115233, Atlanta, GA 30310",
    website: "firm.funderburglaw.com",
  };
  attorney = attorney
    ? await prisma.attorney.update({ where: { id: attorney.id }, data: attorneyData })
    : await prisma.attorney.create({ data: attorneyData });
  console.log("[seed] attorney:", attorney.firm, attorney.id);

  // 2. TR-KW-005 — Kanye West (reset for idempotency)
  const caseRef = "TR-KW-005";
  await prisma.attorneyCase.deleteMany({ where: { caseRef } });
  const kase = await prisma.attorneyCase.create({
    data: {
      caseRef,
      isrc: "USUM71814031",
      recordingTitle: "I Love It",
      primaryArtist: "Kanye West & Lil Pump ft. Adele Givens",
      performerName: "Kanye West",
      performerRole: "Featured Performer",
      share: 45,
      performerLegalName: "Kanye Omari West",
      performerStageName: "Kanye West",
      ipiNumbers: "00335677734 · 00451108296",
      ipiNote: "MusicBrainz (two IPIs on file)",
      claimBasis: "17 U.S.C. §114(g)(2)",
      rsrReviewDate: new Date("2026-05-29"),
      rsrRegistryResult: "No registration located for Kanye West on this ISRC",
      rsrCommercialStatus: "2× Platinum (RIAA) — Major commercial hit",
      rsrCredited:
        "Kanye West is officially credited as a featured performer on all major platforms.",
      attorneyId: attorney.id,
      status: "handshake_pending",
    },
  });
  console.log("[seed] case:", kase.caseRef, kase.id);
  console.log("[seed] done. Run the attorney flow (identity → biometric → sign) for", caseRef);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
