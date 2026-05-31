import { PdfBuilder } from "./layout";
import { type CaseLike, when } from "./caseTypes";

/** Identity Verification Certificate. */
export async function renderIVC(caseRecord: CaseLike): Promise<Uint8Array> {
  const b = await PdfBuilder.create();

  b.title("IDENTITY VERIFICATION CERTIFICATE", { center: true });
  b.subtitle("Digital Handshake — Attorney Authorization", { center: true });
  b.spacer(8);

  b.metaRow("Case Reference", caseRecord.caseRef);
  b.metaRow("Recording", caseRecord.recordingTitle);
  b.metaRow("ISRC", caseRecord.isrc);

  // Only certify completed, signed authorizations — never half-finished
  // ("pending") attempts.
  const signed = caseRecord.handshakes.filter((h) => h.signedAt);
  if (signed.length === 0) {
    b.spacer(8);
    b.paragraph("No completed authorization is on file for this case yet.", { italic: true });
  }
  for (const h of signed) {
    b.sectionHeading(`${h.legalName}${h.stageName ? ` (${h.stageName})` : ""}`);
    b.kvTable([
      { label: "Email", value: h.email },
      { label: "Biometric", value: h.biometricStatus },
      { label: "Signed At", value: when(h.signedAt) },
      { label: "Device", value: h.userAgent ?? "—" },
      { label: "IP Address", value: h.ipAddress ?? "—" },
      { label: "Hash Anchor", value: h.hashAnchor ?? "—" },
    ]);
    if (h.signature) {
      b.line("Captured Signature:", { bold: true });
      await b.image(h.signature);
    }
  }

  return b.save();
}
