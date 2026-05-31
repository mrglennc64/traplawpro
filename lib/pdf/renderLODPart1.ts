import { PdfBuilder } from "./layout";
import { type CaseLike, legalName, stageName } from "./caseTypes";

export async function renderLODPart1(caseRecord: CaseLike): Promise<Uint8Array> {
  const b = await PdfBuilder.create();
  const claimBasis = caseRecord.claimBasis ?? "17 U.S.C. §114(g)(2)";
  const claimant = legalName(caseRecord);
  const stage = stageName(caseRecord);
  const ipi = caseRecord.ipiNumbers
    ? `${caseRecord.ipiNumbers}${caseRecord.ipiNote ? ` (${caseRecord.ipiNote})` : ""}`
    : "—";
  const signed = caseRecord.handshakes.find((h) => h.signedAt && h.signature);

  b.title("LETTER OF DIRECTION — PART 1", { center: true });
  b.subtitle("Featured Performer Claim", { center: true });
  b.spacer(8);

  b.metaRow("ISRC", caseRecord.isrc);
  b.metaRow("Recording Title", caseRecord.recordingTitle);
  b.metaRow("Primary Artist", caseRecord.primaryArtist);
  b.metaRow("Case Reference", caseRecord.caseRef);

  b.sectionHeading("1. Rights Holder Identification");
  b.kvTable([
    { label: "Legal Name", value: claimant },
    { label: "Stage Name", value: stage },
    { label: "Role", value: caseRecord.performerRole },
    {
      label: "Claim Share",
      value: `${caseRecord.share}% Featured Performer Share (${claimBasis})`,
    },
    { label: "IPI Number", value: ipi },
  ]);

  b.sectionHeading("2. Asset Metadata");
  b.kvTable([
    { label: "ISRC", value: caseRecord.isrc },
    { label: "Recording Title", value: caseRecord.recordingTitle },
    { label: "Primary Artist", value: caseRecord.primaryArtist },
    { label: "Featured Performer (Claimant)", value: stage },
    { label: "Case Reference", value: caseRecord.caseRef },
  ]);

  b.sectionHeading("3. Payment Direction");
  b.paragraph("I, the undersigned featured performer, direct SoundExchange, Inc. to:");
  b.bullets([
    "Register me as a featured performer for the above-referenced sound recording;",
    "Deposit any and all accrued and future digital performance royalties attributable to my featured performer share to the bank account I have on file with SoundExchange under my name; and",
    "Accept the attached Schedule 1 as supporting documentation.",
  ]);
  b.paragraph(
    "This Letter of Direction is submitted in connection with my featured performer claim under 17 U.S.C. §114.",
    { italic: true }
  );

  b.sectionHeading("4. Performer Signature");
  b.signatureField("Name (Printed)", claimant);
  if (signed?.signature) {
    b.line("Signature:", { bold: false });
    await b.image(signed.signature);
  } else {
    b.signatureField("Signature");
  }
  b.signatureField(
    "Date",
    signed?.signedAt ? new Date(signed.signedAt).toLocaleDateString("en-US") : undefined
  );

  b.sectionHeading("5. Authorized Representative Signature");
  const atty = caseRecord.attorney;
  b.signatureField("Name (Printed)", atty?.name ?? "");
  b.signatureField(
    "Firm",
    atty ? [atty.firm, atty.barNumber].filter(Boolean).join(" · ") : ""
  );
  b.signatureField("Relationship", "Legal Counsel / Authorized Representative");
  b.signatureField("Signature");
  b.signatureField("Date");

  return b.save();
}
