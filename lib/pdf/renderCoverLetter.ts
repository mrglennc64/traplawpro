import { PdfBuilder } from "./layout";
import { type CaseLike, SOUNDEXCHANGE, legalName, longDate } from "./caseTypes";

export async function renderCoverLetter(
  caseRecord: CaseLike
): Promise<Uint8Array> {
  const b = await PdfBuilder.create();
  const atty = caseRecord.attorney;
  const claimant = legalName(caseRecord);
  const stage = caseRecord.performerStageName ?? caseRecord.performerName;
  const sharePct = `${caseRecord.share}%`;

  // Letterhead
  if (atty) {
    b.line(atty.firm.toUpperCase(), { bold: true, size: 15 });
    if (atty.address) b.line(atty.address, { muted: true });
    const contact = [atty.email, atty.phone].filter(Boolean).join(" · ");
    if (contact) b.line(contact, { muted: true });
    if (atty.website) b.line(atty.website, { muted: true });
  }
  b.spacer(14);

  b.line(longDate(caseRecord.rsrReviewDate ?? new Date().toISOString()));
  b.spacer(10);

  // Recipient
  b.line(SOUNDEXCHANGE.name);
  b.line(SOUNDEXCHANGE.attn);
  b.line(SOUNDEXCHANGE.address);
  b.line(SOUNDEXCHANGE.cityStateZip);
  b.line(SOUNDEXCHANGE.email);
  b.spacer(12);

  b.paragraph(
    `RE: Featured Performer Claim — ISRC ${caseRecord.isrc} — "${caseRecord.recordingTitle}" — ${stage} (${claimant})`
  );

  b.paragraph("To Whom It May Concern:");
  b.paragraph(
    `On behalf of our client, ${claimant} (professionally known as ${stage}), we submit this claim for his featured performer share of digital performance royalties under 17 U.S.C. §114 for the sound recording identified above.`
  );

  b.line("Enclosed please find:", { bold: true });
  b.spacer(4);
  b.bullets([
    "Letter of Direction — Part 1 (signed by the artist and counsel)",
    `Schedule 1 — Repertoire Chart (ISRC ${caseRecord.isrc})`,
  ]);

  b.paragraph(
    "This claim is for the featured-performer share of non-interactive digital performance royalties under 17 U.S.C. §114 only. It does not assert any claim against on-demand interactive streaming services or against the master owner's sound-recording-copyright share."
  );

  b.line("Our client requests:", { bold: true });
  b.spacer(4);
  b.bullets([
    "Confirmation that he is registered as a featured performer for this ISRC;",
    `Release of any accrued royalties properly attributable to his ${sharePct} featured performer share; and`,
    "Direction on any additional documentation required.",
  ]);

  b.paragraph("Please direct all correspondence to the undersigned.");
  b.paragraph("Respectfully,");
  b.spacer(28);

  if (atty) {
    b.line(`${atty.name}${atty.barNumber ? ` · ${atty.barNumber}` : ""}`, {
      bold: true,
    });
    const l2 = [atty.firm, atty.address].filter(Boolean).join(" · ");
    if (l2) b.line(l2, { muted: true });
    const l3 = [atty.email, atty.phone, atty.website].filter(Boolean).join(" · ");
    if (l3) b.line(l3, { muted: true });
  }

  return b.save();
}
