export interface AttorneyLike {
  name: string;
  firm: string;
  barNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
}

export interface CaseHandshakeLike {
  legalName: string;
  stageName?: string | null;
  email: string;
  biometricStatus: string;
  signature?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  signedAt?: Date | string | null;
  hashAnchor?: string | null;
}

export interface CaseLike {
  caseRef: string;
  isrc: string;
  recordingTitle: string;
  primaryArtist: string;
  performerName: string;
  performerRole: string;
  share: number;
  performerLegalName?: string | null;
  performerStageName?: string | null;
  ipiNumbers?: string | null;
  ipiNote?: string | null;
  claimBasis?: string | null;
  rsrReviewDate?: Date | string | null;
  rsrRegistryResult?: string | null;
  rsrCommercialStatus?: string | null;
  rsrCredited?: string | null;
  attorney?: AttorneyLike | null;
  handshakes: CaseHandshakeLike[];
}

export const when = (d?: Date | string | null) =>
  d ? new Date(d).toISOString() : "—";

export const longDate = (d?: Date | string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

/** Recipient is constant across claims. */
export const SOUNDEXCHANGE = {
  name: "SoundExchange, Inc.",
  attn: "Attn: Member / Claims Services",
  address: "733 10th Street NW, 10th Floor",
  cityStateZip: "Washington, DC 20001",
  email: "accounts@soundexchange.com",
};

export const legalName = (c: CaseLike) =>
  c.performerLegalName ?? c.performerName;
export const stageName = (c: CaseLike) =>
  c.performerStageName ?? c.performerName;
