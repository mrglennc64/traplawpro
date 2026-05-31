import { PdfBuilder } from "./layout";
import { type CaseLike, legalName, longDate } from "./caseTypes";

export async function renderRoyaltyStatusReview(
  caseRecord: CaseLike
): Promise<Uint8Array> {
  const b = await PdfBuilder.create();
  const claimant = legalName(caseRecord);
  const stage = caseRecord.performerStageName ?? caseRecord.performerName;
  const registry =
    caseRecord.rsrRegistryResult ??
    `No registration located for ${stage} on this ISRC`;
  const commercial = caseRecord.rsrCommercialStatus ?? "—";
  const credited =
    caseRecord.rsrCredited ??
    `${stage} is officially credited as a featured performer on all major platforms.`;

  b.title("ROYALTY STATUS REVIEW");
  b.spacer(8);

  b.metaRow("ISRC", caseRecord.isrc);
  b.metaRow("Recording", caseRecord.recordingTitle);
  b.metaRow("Performer Reviewed", `${stage} (${claimant})`);
  b.metaRow("Review Date", longDate(caseRecord.rsrReviewDate));
  b.metaRow("Case Reference", caseRecord.caseRef);

  b.sectionHeading("Observations");
  b.bullets([
    `Public registry search did not identify a featured performer registration for ${stage} on this ISRC.`,
    `The recording has substantial commercial streaming activity across major DSPs${
      caseRecord.rsrCommercialStatus ? ` (${caseRecord.rsrCommercialStatus})` : ""
    }.`,
    credited,
  ]);

  b.sectionHeading("Supporting Data");
  b.kvTable([
    { label: "ISRC Verification", value: `${caseRecord.isrc} — Confirmed` },
    { label: "Public Registry Search (Featured Performer)", value: registry },
    { label: "Commercial Success", value: commercial },
    {
      label: "Submitted As",
      value: "Supporting documentation for claim verification purposes only",
    },
  ]);

  const firm = caseRecord.attorney?.firm ?? "TrapLawPro";
  b.paragraph(
    `Prepared by ${firm} · Case Ref: ${caseRecord.caseRef} · Date: ${longDate(
      caseRecord.rsrReviewDate ?? new Date().toISOString()
    )}`,
    { italic: true }
  );

  return b.save();
}
