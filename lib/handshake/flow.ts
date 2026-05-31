import crypto from "crypto";
import { prisma } from "../db";
import { sendMail } from "../mailer";
import { buildAttorneyPayload, computeHash, stableStringify } from "./hash";
import {
  renderCoverLetter,
  renderLODPart1,
  renderSchedule1,
  renderRoyaltyStatusReview,
  renderIVC,
  renderChainOfCustody,
  saveDocument,
} from "../pdf";

// Case status pipeline (also consumed by the Phase-2 artist dashboard):
// handshake_pending -> artist_signed -> attorney_reviewing -> bundle_generated
//   -> submitted_soundexchange -> processing -> paid
export const CASE_STATUS = {
  PENDING: "handshake_pending",
  SIGNED: "artist_signed",
  REVIEWING: "attorney_reviewing",
  BUNDLE_GENERATED: "bundle_generated",
} as const;

export interface StartCaseInput {
  caseRef: string;
  isrc: string;
  recordingTitle: string;
  primaryArtist: string;
  performerName: string;
  performerRole: string;
  share: number;
  performerLegalName?: string;
  performerStageName?: string;
  ipiNumbers?: string;
  ipiNote?: string;
  claimBasis?: string;
  rsrReviewDate?: string | Date;
  rsrRegistryResult?: string;
  rsrCommercialStatus?: string;
  rsrCredited?: string;
  artistEmail?: string;
  attorneyId?: string;
  ownerRole?: string;
}

/** Create (or reset) an attorney case and mint an unguessable signing token. */
export async function startCaseHandshake(input: StartCaseInput) {
  const signToken = crypto.randomBytes(24).toString("hex");

  const data = {
    caseRef: input.caseRef,
    signToken,
    isrc: input.isrc,
    recordingTitle: input.recordingTitle,
    primaryArtist: input.primaryArtist,
    performerName: input.performerName,
    performerRole: input.performerRole,
    share: input.share,
    performerLegalName: input.performerLegalName,
    performerStageName: input.performerStageName,
    ipiNumbers: input.ipiNumbers,
    ipiNote: input.ipiNote,
    claimBasis: input.claimBasis,
    rsrReviewDate: input.rsrReviewDate ? new Date(input.rsrReviewDate) : undefined,
    rsrRegistryResult: input.rsrRegistryResult,
    rsrCommercialStatus: input.rsrCommercialStatus,
    rsrCredited: input.rsrCredited,
    artistEmail: input.artistEmail,
    attorneyId: input.attorneyId,
    ownerRole: input.ownerRole,
    status: CASE_STATUS.PENDING,
  };

  // Upsert so re-issuing a case for an existing caseRef rotates the token and
  // refreshes metadata rather than throwing on the unique constraint.
  const caseRecord = await prisma.attorneyCase.upsert({
    where: { caseRef: input.caseRef },
    create: data,
    update: data,
  });

  return {
    caseId: caseRecord.id,
    caseRef: caseRecord.caseRef,
    signToken: caseRecord.signToken,
  };
}

export interface CaptureIdentityInput {
  legalName: string;
  stageName?: string;
  email: string;
}

export async function captureIdentity(
  caseRef: string,
  input: CaptureIdentityInput
) {
  const caseRecord = await prisma.attorneyCase.findUnique({ where: { caseRef } });
  if (!caseRecord) throw new Error(`AttorneyCase ${caseRef} not found`);

  // Reuse an existing un-signed handshake for this case (e.g. the signer
  // reopened the link or went back to Identity) instead of spawning a duplicate
  // "pending" record that would otherwise pollute the certificate.
  const existing = await prisma.attorneyHandshake.findFirst({
    where: { caseId: caseRecord.id, signedAt: null },
    orderBy: { createdAt: "desc" },
  });

  const data = {
    legalName: input.legalName,
    stageName: input.stageName,
    email: input.email,
    biometricStatus: "pending",
  };

  const handshake = existing
    ? await prisma.attorneyHandshake.update({ where: { id: existing.id }, data })
    : await prisma.attorneyHandshake.create({ data: { caseId: caseRecord.id, ...data } });

  return { handshakeId: handshake.id };
}

export interface CompleteBiometricInput {
  handshakeId: string;
  biometricStatus: string;
}

export async function completeBiometric(input: CompleteBiometricInput) {
  await prisma.attorneyHandshake.update({
    where: { id: input.handshakeId },
    data: { biometricStatus: input.biometricStatus },
  });
  return { status: "ok" as const };
}

export interface SignAuthorizationInput {
  handshakeId: string;
  signature: string;
  userAgent?: string; // device fingerprint, captured by the sign route
  ipAddress?: string;
}

/** Capture the signature, compute the SHA-256 anchor, and store the payload. */
export async function signAuthorization(input: SignAuthorizationInput) {
  const handshake = await prisma.attorneyHandshake.findUnique({
    where: { id: input.handshakeId },
    include: { case: true },
  });
  if (!handshake) {
    throw new Error(`AttorneyHandshake ${input.handshakeId} not found`);
  }

  const signedAt = new Date();
  const payload = buildAttorneyPayload({
    caseRef: handshake.case.caseRef,
    isrc: handshake.case.isrc,
    performer: handshake.legalName,
    signature: input.signature,
    signedAt: signedAt.toISOString(),
    device: input.userAgent ?? "",
  });
  const payloadJson = stableStringify(payload);
  const hash = computeHash(payloadJson);

  await prisma.attorneyHandshake.update({
    where: { id: handshake.id },
    data: {
      signedAt,
      signature: input.signature,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      hashAnchor: hash,
      payload: payloadJson,
    },
  });

  // Advance the case so the attorney (and the Phase-2 artist view) sees it moved.
  await prisma.attorneyCase.update({
    where: { id: handshake.caseId },
    data: { status: CASE_STATUS.SIGNED },
  });

  return { hash, signedAt: signedAt.toISOString() };
}

const DOC_RENDERERS = [
  { type: "cover_letter", file: (ref: string) => `cover-letter-${ref}.pdf`, render: renderCoverLetter },
  { type: "lod_part_1", file: (ref: string) => `lod-part1-${ref}.pdf`, render: renderLODPart1 },
  { type: "schedule_1", file: (ref: string) => `schedule1-${ref}.pdf`, render: renderSchedule1 },
  { type: "royalty_status_review", file: (ref: string) => `royalty-status-review-${ref}.pdf`, render: renderRoyaltyStatusReview },
  { type: "ivc", file: (ref: string) => `ivc-${ref}.pdf`, render: renderIVC },
  { type: "coc_hash", file: (ref: string) => `coc-hash-${ref}.pdf`, render: renderChainOfCustody },
] as const;

/** Render the full superset of documents and record them on the case. */
export async function finalizeCaseHandshake(caseRef: string) {
  const caseRecord = await prisma.attorneyCase.findUnique({
    where: { caseRef },
    include: { handshakes: true, attorney: true },
  });
  if (!caseRecord) throw new Error(`AttorneyCase ${caseRef} not found`);

  const anchor =
    caseRecord.handshakes.find((h) => h.hashAnchor)?.hashAnchor ?? null;

  // Render + persist each document. Regenerating replaces prior rows.
  await prisma.document.deleteMany({ where: { caseId: caseRecord.id } });

  const documents: Record<string, string> = {};
  for (const def of DOC_RENDERERS) {
    const bytes = await def.render(caseRecord as any);
    const saved = await saveDocument(def.file(caseRef), bytes);
    await prisma.document.create({
      data: {
        caseId: caseRecord.id,
        type: def.type,
        storageUrl: saved.storageUrl,
        hashAnchor: anchor,
      },
    });
    documents[def.type] = saved.storageUrl;
  }

  await prisma.attorneyCase.update({
    where: { caseRef },
    data: { status: CASE_STATUS.BUNDLE_GENERATED },
  });

  return { status: "complete" as const, hash: anchor, documents };
}

/**
 * Best-effort notification after an artist signs: record an artist-facing
 * timeline entry and email the attorney. Never throws (email is non-critical;
 * delivery only works once a Resend domain is verified — see lib/mailer).
 */
export async function notifyOnSigned(caseRef: string) {
  try {
    const c = await prisma.attorneyCase.findUnique({
      where: { caseRef },
      include: { attorney: true, handshakes: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
    if (!c) return;
    const signer = c.handshakes[0];

    await prisma.artistNotification.create({
      data: {
        caseId: c.id,
        message: "Your authorization is signed and sealed. Your attorney has been notified and your document bundle is ready.",
      },
    });

    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://traplawpro.com";

    // NOTE: We intentionally do NOT email the attorney. She is notified in-app
    // via the auto-refreshing Cases list in the attorney portal. Only the artist
    // receives an email (their own confirmation).

    // Artist confirmation (to the signer's own email).
    if (signer?.email) {
      await sendMail({
        to: signer.email,
        subject: `Your authorization is complete — ${c.recordingTitle}`,
        html: `<p>Thank you, ${signer.legalName}. Your authorization for <strong>${c.recordingTitle}</strong> (ISRC ${c.isrc}) is signed and sealed.</p><p>Tamper-evident seal (SHA-256): <code>${signer.hashAnchor ?? "—"}</code></p><p><a href="${base}/artist/cases/${c.signToken}">View your case status and documents</a>.</p>`,
        text: `Your authorization for ${c.recordingTitle} is signed and sealed. Track it: ${base}/artist/cases/${c.signToken}`,
      });
    }
  } catch (e) {
    console.error("[notifyOnSigned]", e);
  }
}
