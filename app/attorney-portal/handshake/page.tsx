"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const QRCode = ({ value, size = 132 }: { value: string; size?: number }) => (
  <img
    src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`}
    alt="QR"
    width={size}
    height={size}
    style={{ borderRadius: "0.5rem" }}
  />
);

const STATUS_STEPS: { key: string; label: string }[] = [
  { key: "handshake_pending", label: "Link sent" },
  { key: "artist_signed", label: "Artist signed" },
  { key: "bundle_generated", label: "Bundle generated" },
  { key: "submitted_soundexchange", label: "Submitted to SoundExchange" },
  { key: "processing", label: "Processing" },
  { key: "paid", label: "Royalties paid" },
];
const statusIndex = (s: string) => {
  const i = STATUS_STEPS.findIndex((x) => x.key === s);
  return i < 0 ? 0 : i;
};

const DOC_LABELS: Record<string, string> = {
  cover_letter: "Cover Letter",
  lod_part_1: "Letter of Direction — Part 1",
  schedule_1: "Schedule 1 — Repertoire Chart",
  royalty_status_review: "Royalty Status Review",
  ivc: "Identity Verification Certificate",
  coc_hash: "Chain-of-Custody Hash",
};

type CaseDoc = { id: string; type: string; storageUrl: string };
type CaseHandshake = {
  id: string;
  legalName: string;
  email: string;
  biometricStatus: string;
  signedAt: string | null;
  hashAnchor: string | null;
};
type CaseData = {
  caseRef: string;
  signToken: string | null;
  status: string;
  recordingTitle: string;
  isrc: string;
  performerName: string;
  share: number;
  documents: CaseDoc[];
  handshakes: CaseHandshake[];
};

const input =
  "w-full px-4 py-3 bg-white border border-black/10 rounded-lg text-[#111] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#1d3557]";
const label = "block text-sm font-semibold text-[#333] mb-1";

function HandshakeInner() {
  const sp = useSearchParams();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  // create-case form
  const [form, setForm] = useState({
    caseRef: "",
    isrc: "",
    recordingTitle: "",
    primaryArtist: "",
    performerName: "",
    performerRole: "Featured Performer",
    share: "",
    performerLegalName: "",
    artistEmail: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (typeof document !== "undefined") {
      setUnlocked(document.cookie.split("; ").some((c) => c.startsWith("trp_attorney_unlocked=1")));
    }
    // Prefill from a launching matter (?ref=&isrc=&title=&artist=&share=&role=).
    setForm((f) => ({
      ...f,
      caseRef: sp.get("ref") ?? f.caseRef,
      isrc: sp.get("isrc") ?? f.isrc,
      recordingTitle: sp.get("title") ?? f.recordingTitle,
      primaryArtist: sp.get("artist") ?? f.primaryArtist,
      performerName: sp.get("artist") ?? f.performerName,
      share: sp.get("share") ?? f.share,
    }));
  }, [sp]);

  const signingLink = activeCase?.signToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/handshake/sign/${activeCase.signToken}`
    : "";

  const loadCase = async (caseRef: string) => {
    const res = await fetch(`/api/attorney-handshake/${encodeURIComponent(caseRef)}`);
    if (res.ok) {
      const data = await res.json();
      setActiveCase(data.case);
    }
  };

  // Poll the active case so the attorney sees the moment the artist signs.
  useEffect(() => {
    if (!activeCase?.caseRef) return;
    if (activeCase.status === "bundle_generated") return;
    const t = setInterval(() => loadCase(activeCase.caseRef), 5000);
    return () => clearInterval(t);
  }, [activeCase?.caseRef, activeCase?.status]);

  const createCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      const res = await fetch("/api/attorney-handshake/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, share: Number(form.share) || 0 }),
      });
      if (res.status === 401) {
        setError("Unlock the attorney portal first, then create the case.");
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create case");
        return;
      }
      await loadCase(form.caseRef);
    } catch {
      setError("Network error — try again.");
    } finally {
      setCreating(false);
    }
  };

  if (unlocked === false) {
    return (
      <Shell>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-900">
          <p className="font-bold mb-1">Attorney portal is locked</p>
          <p className="text-sm">
            Open the{" "}
            <Link href="/attorney-portal" className="underline font-semibold">
              Attorney Portal
            </Link>{" "}
            and unlock with your passcode, then return here to create a Digital Handshake.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create case */}
        <div className="bg-white border border-black/10 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-1 text-[#111]">Start a Case</h3>
          <p className="text-sm text-[#555] mb-6">
            Create the case, then send the artist a one-tap signing link. They confirm identity,
            verify with device biometrics, and sign — the bundle generates automatically.
          </p>
          <form onSubmit={createCase} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Case Reference</label>
                <input className={input} value={form.caseRef} onChange={(e) => set("caseRef", e.target.value)} placeholder="TR-KW-005" required />
              </div>
              <div>
                <label className={label}>ISRC</label>
                <input className={input} value={form.isrc} onChange={(e) => set("isrc", e.target.value)} placeholder="USUM71814031" required />
              </div>
            </div>
            <div>
              <label className={label}>Recording Title</label>
              <input className={input} value={form.recordingTitle} onChange={(e) => set("recordingTitle", e.target.value)} placeholder="I Love It" required />
            </div>
            <div>
              <label className={label}>Primary Artist (full credit)</label>
              <input className={input} value={form.primaryArtist} onChange={(e) => set("primaryArtist", e.target.value)} placeholder="Kanye West & Lil Pump ft. Adele Givens" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Performer (claimant)</label>
                <input className={input} value={form.performerName} onChange={(e) => set("performerName", e.target.value)} placeholder="Kanye West" required />
              </div>
              <div>
                <label className={label}>Share %</label>
                <input className={input} type="number" value={form.share} onChange={(e) => set("share", e.target.value)} placeholder="45" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Role</label>
                <select className={input} value={form.performerRole} onChange={(e) => set("performerRole", e.target.value)}>
                  <option>Featured Performer</option>
                  <option>Non-Featured Performer</option>
                </select>
              </div>
              <div>
                <label className={label}>Artist email (optional)</label>
                <input className={input} type="email" value={form.artistEmail} onChange={(e) => set("artistEmail", e.target.value)} placeholder="artist@label.com" />
              </div>
            </div>
            <button type="submit" disabled={creating} className="w-full py-4 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition disabled:opacity-60">
              {creating ? "Creating case…" : activeCase ? "Re-issue Signing Link" : "Create Case & Generate Link"}
            </button>
            {error && <p className="text-sm text-red-600 font-semibold text-center">{error}</p>}
          </form>
        </div>

        {/* Status / link / docs */}
        <div className="space-y-6">
          {!activeCase ? (
            <div className="bg-[#f2efe6] rounded-xl p-8 border border-black/10 text-center text-[#555]">
              <p className="text-sm">Create a case to generate the artist signing link and track progress here.</p>
            </div>
          ) : (
            <>
              <div className="bg-white border border-black/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#555]">{activeCase.caseRef}</p>
                    <h3 className="text-lg font-bold text-[#111]">{activeCase.recordingTitle}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1d3557]/10 text-[#1d3557]">
                    {STATUS_STEPS[statusIndex(activeCase.status)].label}
                  </span>
                </div>

                {activeCase.status === "handshake_pending" && signingLink && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#333]">Send this signing link to the artist:</p>
                    <div className="flex items-center gap-2">
                      <input readOnly value={signingLink} className="flex-1 px-3 py-2 bg-[#f2efe6] border border-black/15 rounded-lg text-xs text-[#333] font-mono" />
                      <button onClick={() => navigator.clipboard.writeText(signingLink)} className="px-3 py-2 bg-[#1d3557] text-white text-xs rounded-lg hover:bg-[#122947]">Copy</button>
                    </div>
                    <div className="flex justify-center pt-2"><QRCode value={signingLink} /></div>
                    <p className="text-xs text-[#555] text-center">Waiting for the artist to complete the handshake… (auto-refreshing)</p>
                  </div>
                )}

                {activeCase.handshakes[0]?.hashAnchor && (
                  <div className="mt-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-green-700 mb-1">✓ Signed & sealed by {activeCase.handshakes[0].legalName}</p>
                    <code className="text-[10px] text-[#333] break-all">SHA-256: {activeCase.handshakes[0].hashAnchor}</code>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white border border-black/10 rounded-xl p-6">
                <p className="text-sm font-bold text-[#111] mb-3">Case Status</p>
                <ol className="space-y-2">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= statusIndex(activeCase.status);
                    return (
                      <li key={step.key} className="flex items-center gap-3 text-sm">
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${done ? "bg-green-500 text-white" : "bg-black/10 text-[#999]"}`}>{done ? "✓" : i + 1}</span>
                        <span className={done ? "text-[#111] font-medium" : "text-[#999]"}>{step.label}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Documents */}
              {activeCase.documents.length > 0 && (
                <div className="bg-white border border-black/10 rounded-xl p-6">
                  <p className="text-sm font-bold text-[#111] mb-3">Submission Bundle</p>
                  <div className="space-y-2">
                    {activeCase.documents.map((d) => (
                      <a key={d.id} href={d.storageUrl} target="_blank" rel="noreferrer"
                        className="flex items-center justify-between px-4 py-3 bg-[#f2efe6] border border-black/10 rounded-lg hover:bg-[#ebe7da] transition">
                        <span className="text-sm text-[#111]">{DOC_LABELS[d.type] ?? d.type}</span>
                        <span className="text-xs text-[#1d3557] font-semibold">Open PDF →</span>
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-[#555] mt-3">Attach these to your SoundExchange submission (accounts@soundexchange.com or SXDirect).</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#111]">
      <header className="sticky top-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/attorney-portal" className="text-2xl font-bold text-[#1d3557]">TrapLaw<span className="text-[#1d3557]">Pro</span></Link>
            <span className="px-3 py-1 bg-[#1d3557]/10 text-[#1d3557] text-sm rounded-full font-medium">Digital Handshake</span>
          </div>
          <Link href="/attorney-portal" className="px-4 py-2 bg-[#1d3557]/5 hover:bg-[#1d3557]/10 border border-[#1d3557]/20 text-[#1d3557] rounded-lg text-sm transition">← Back to Portal</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#111] mb-1">Digital Handshake</h1>
        <p className="text-[#555] mb-8">Collect legally valid, biometrically-verified artist authorization — Georgia-law compliant, SoundExchange-ready.</p>
        {children}
      </main>
    </div>
  );
}

export default function AttorneyHandshakePage() {
  return (
    <Suspense fallback={null}>
      <HandshakeInner />
    </Suspense>
  );
}
