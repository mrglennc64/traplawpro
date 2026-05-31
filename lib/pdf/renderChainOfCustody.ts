import { PdfBuilder } from "./layout";
import { type CaseLike, when } from "./caseTypes";

/** Chain of Custody / hash anchor record. */
export async function renderChainOfCustody(
  caseRecord: CaseLike
): Promise<Uint8Array> {
  const b = await PdfBuilder.create();

  b.title("CHAIN OF CUSTODY", { center: true });
  b.subtitle("Digital Handshake — Tamper-Evident Hash Record", { center: true });
  b.spacer(8);

  b.metaRow("Case Reference", caseRecord.caseRef);
  b.metaRow("ISRC", caseRecord.isrc);

  caseRecord.handshakes.forEach((h, i) => {
    b.sectionHeading(`Event ${i + 1} — ${h.legalName}`);
    b.kvTable([
      { label: "Biometric", value: h.biometricStatus },
      { label: "Signed At", value: when(h.signedAt) },
      { label: "Device", value: h.userAgent ?? "—" },
      { label: "IP Address", value: h.ipAddress ?? "—" },
      { label: "SHA-256", value: h.hashAnchor ?? "—" },
    ]);
  });

  b.note(
    "Verification: recompute SHA-256 over the canonical signed payload (stableStringify of {context, caseRef, isrc, performer, signature, signedAt, device}); the result must equal the SHA-256 anchor above. Any change to the signed data breaks the match."
  );

  return b.save();
}
