import { cookies } from "next/headers";

/**
 * True when the request carries a valid attorney-portal unlock cookie — the
 * same `trp_attorney_unlocked` cookie set by /api/attorney-unlock and checked
 * for the gated case files. Gate attorney-only handshake routes with this.
 */
export function isAttorneyUnlocked(): boolean {
  return cookies().get("trp_attorney_unlocked")?.value === "1";
}

/** The unlocked login's role ('attorney' | 'admin'), or null if not unlocked. */
export function attorneyRole(): "attorney" | "admin" | null {
  if (!isAttorneyUnlocked()) return null;
  const r = cookies().get("trp_attorney_role")?.value;
  return r === "attorney" || r === "admin" ? r : "attorney";
}
