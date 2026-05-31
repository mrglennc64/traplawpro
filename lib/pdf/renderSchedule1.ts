import { PdfBuilder } from "./layout";
import { type CaseLike, legalName, stageName, longDate } from "./caseTypes";

export async function renderSchedule1(caseRecord: CaseLike): Promise<Uint8Array> {
  const b = await PdfBuilder.create();
  const claimBasis = caseRecord.claimBasis ?? "17 U.S.C. §114(g)(2)";
  const claimant = legalName(caseRecord);
  const stage = stageName(caseRecord);

  b.title("SCHEDULE 1 — REPERTOIRE CHART", { center: true });
  b.spacer(8);

  b.metaRow("Case Reference", caseRecord.caseRef);
  b.metaRow("Claimant Legal Name", claimant);
  b.metaRow("Claimant Stage Name", stage);
  b.metaRow("Role Claimed", caseRecord.performerRole);
  b.metaRow(
    "Claimed Share",
    `${caseRecord.share}% of Featured Performer Royalties (${claimBasis})`
  );
  b.metaRow("Date", longDate(caseRecord.rsrReviewDate ?? new Date().toISOString()));
  b.spacer(8);

  b.table(
    ["ISRC", "Recording Title", "Primary Artist(s)", "Featured Performer (Claimant)", "Claimed Share"],
    [
      [
        caseRecord.isrc,
        caseRecord.recordingTitle,
        caseRecord.primaryArtist,
        `${stage} (${claimant})`,
        `${caseRecord.share}%`,
      ],
    ],
    [1.1, 1, 1.4, 1.4, 0.7]
  );

  b.note(
    `Note: No existing featured performer registration for the Claimant was located in the publicly accessible SoundExchange registry for this ISRC. This claim is for non-interactive digital transmissions only under 17 U.S.C. §114.`
  );

  return b.save();
}
