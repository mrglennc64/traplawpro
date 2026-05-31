import crypto from "crypto";

/**
 * Deterministic SHA-256 anchor for a handshake payload.
 * Pair with `buildAttorneyPayload` so the JSON key order is stable and the hash
 * is reproducible from the stored payload (the verifiability guarantee).
 */
export function computeHash(payload: unknown): string {
  const json = typeof payload === "string" ? payload : stableStringify(payload);
  return crypto.createHash("sha256").update(json).digest("hex");
}

/** JSON.stringify with object keys sorted recursively, so hashing is stable. */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

export interface AttorneyPayloadInput {
  caseRef: string;
  isrc: string;
  performer: string;
  signature: string;
  signedAt: string; // ISO timestamp
  device?: string; // device fingerprint (user-agent) captured at signing
}

/**
 * Canonical payload for an attorney handshake. Hashed via computeHash and stored
 * verbatim so the anchor can be recomputed later for verification. The device
 * fingerprint is part of the sealed payload so it is tamper-evident too.
 */
export function buildAttorneyPayload(input: AttorneyPayloadInput) {
  return {
    context: "attorney_handshake" as const,
    caseRef: input.caseRef,
    isrc: input.isrc,
    performer: input.performer,
    signature: input.signature,
    signedAt: input.signedAt,
    device: input.device ?? "",
  };
}
