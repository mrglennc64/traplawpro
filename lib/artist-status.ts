// Shared case-status pipeline for the artist dashboard + attorney views.
// Mirrors AttorneyCase.status values written by lib/handshake/flow.ts.
export const ARTIST_TIMELINE: { key: string; label: string }[] = [
  { key: "handshake_pending", label: "Handshake sent" },
  { key: "artist_signed", label: "Signed by artist" },
  { key: "attorney_reviewing", label: "Attorney reviewing" },
  { key: "bundle_generated", label: "Bundle generated" },
  { key: "submitted_soundexchange", label: "Submitted to SoundExchange" },
  { key: "processing", label: "SoundExchange processing" },
  { key: "paid", label: "Royalty recovery complete" },
];

export function statusStepIndex(status: string): number {
  const i = ARTIST_TIMELINE.findIndex((s) => s.key === status);
  return i < 0 ? 0 : i;
}

export const DOC_LABELS: Record<string, string> = {
  ivc: "Identity Verification Certificate",
  lod_part_1: "Letter of Direction — Part 1",
  schedule_1: "Schedule 1 — Repertoire Chart",
  coc_hash: "Chain-of-Custody Hash",
  royalty_status_review: "Royalty Status Review",
  cover_letter: "Cover Letter",
};
