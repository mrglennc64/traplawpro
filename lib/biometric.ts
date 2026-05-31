export type BioResult = "ok" | "unsupported" | "failed";

/**
 * Device biometric gate (Windows Hello / Face ID / fingerprint) via the WebAuthn
 * platform authenticator. Returns 'unsupported' when no platform authenticator
 * exists so callers can degrade gracefully; 'failed' when the user cancels or
 * verification errors. Extracted from the attorney portal so the public signer
 * wizard can reuse it.
 */
export async function verifyBiometric(): Promise<BioResult> {
  try {
    if (
      typeof window === "undefined" ||
      !window.PublicKeyCredential ||
      !navigator.credentials?.create
    ) {
      return "unsupported";
    }
    const isAvail = (window.PublicKeyCredential as any)
      .isUserVerifyingPlatformAuthenticatorAvailable;
    if (typeof isAvail === "function") {
      const ok = await isAvail.call(window.PublicKeyCredential);
      if (!ok) return "unsupported";
    }
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);
    await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "TrapLawPro", id: window.location.hostname },
        user: {
          id: userId,
          name: "signer@traplawpro",
          displayName: "TrapLawPro Signer",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      },
    });
    return "ok";
  } catch {
    return "failed";
  }
}
