"use client";

import { useEffect, useRef, useState } from "react";
import { verifyBiometric } from "@/lib/biometric";

type CaseInfo = {
  caseRef: string;
  recordingTitle: string;
  isrc: string;
  primaryArtist: string;
  performerName: string;
  performerRole: string;
  share: number;
  status: string;
  handshake: { id: string; signed: boolean; hashAnchor: string | null } | null;
};

const input =
  "w-full px-4 py-3 bg-white border border-black/10 rounded-lg text-[#111] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#1d3557]";

/** Canvas signature pad — mouse + touch, exports a PNG data URL. */
function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111";

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      drawing.current = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drawing.current) return;
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      dirty.current = true;
    };
    const up = () => {
      if (!drawing.current) return;
      drawing.current = false;
      if (dirty.current) onChange(canvas.toDataURL("image/png"));
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", up);
    };
  }, [onChange]);

  const clear = () => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dirty.current = false;
      onChange(null);
    }
  };

  return (
    <div>
      <canvas
        ref={ref}
        width={520}
        height={180}
        className="w-full bg-white border-2 border-dashed border-[#1d3557]/40 rounded-lg touch-none"
        style={{ touchAction: "none" }}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-[#555]">Sign above with your mouse or finger.</span>
        <button type="button" onClick={clear} className="text-xs text-[#1d3557] font-semibold underline">Clear</button>
      </div>
    </div>
  );
}

export default function SignerPage({ params }: { params: { token: string } }) {
  const [info, setInfo] = useState<CaseInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState<"identity" | "biometric" | "sign" | "done">("identity");
  const [handshakeId, setHandshakeId] = useState<string | null>(null);
  const [bioNote, setBioNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hash, setHash] = useState<string | null>(null);

  const [identity, setIdentity] = useState({ legalName: "", stageName: "", email: "" });
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/attorney-handshake/by-token/${params.token}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data: CaseInfo = await res.json();
      setInfo(data);
      if (data.handshake?.signed) {
        setHash(data.handshake.hashAnchor);
        setStep("done");
      }
    })();
  }, [params.token]);

  const submitIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/attorney-handshake/${encodeURIComponent(info.caseRef)}/identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identity),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not save your details.");
        return;
      }
      setHandshakeId(data.handshakeId);
      setStep("biometric");
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  };

  const doBiometric = async () => {
    if (!info || !handshakeId) return;
    setError("");
    setBusy(true);
    try {
      const result = await verifyBiometric();
      if (result === "failed") {
        setError("Verification was cancelled or failed. Please try again.");
        return;
      }
      const status = result === "ok" ? "verified" : "unsupported";
      if (result === "unsupported") {
        setBioNote("No device biometric was available — proceeding with device verification noted as unsupported.");
      }
      await fetch(`/api/attorney-handshake/${encodeURIComponent(info.caseRef)}/biometric`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handshakeId, biometricStatus: status }),
      });
      setStep("sign");
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitSignature = async () => {
    if (!info || !handshakeId || !signature) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/attorney-handshake/${encodeURIComponent(info.caseRef)}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handshakeId, signature }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not record your signature.");
        return;
      }
      setHash(data.hash);
      setStep("done");
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  };

  if (notFound) {
    return (
      <Frame>
        <div className="text-center py-12">
          <p className="text-xl font-bold text-[#111] mb-2">Link not valid</p>
          <p className="text-[#555] text-sm">This signing link is invalid or has expired. Ask your attorney to re-issue it.</p>
        </div>
      </Frame>
    );
  }

  if (!info) {
    return <Frame><p className="text-center text-[#555] py-12">Loading…</p></Frame>;
  }

  return (
    <Frame>
      {/* Case summary */}
      <div className="bg-[#f2efe6] border border-black/10 rounded-xl p-5 mb-6">
        <p className="text-xs uppercase tracking-widest text-[#555] mb-1">{info.caseRef}</p>
        <h2 className="text-lg font-bold text-[#111]">{info.recordingTitle}</h2>
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div><span className="text-[#555]">ISRC: </span><span className="font-mono text-[#111]">{info.isrc}</span></div>
          <div><span className="text-[#555]">Role: </span><span className="text-[#111]">{info.performerRole}</span></div>
          <div><span className="text-[#555]">Performer: </span><span className="text-[#111]">{info.performerName}</span></div>
          <div><span className="text-[#555]">Share: </span><span className="text-[#111]">{info.share}%</span></div>
        </div>
      </div>

      <Stepper step={step} />

      {error && <p className="text-sm text-red-600 font-semibold mb-4">{error}</p>}

      {step === "identity" && (
        <form onSubmit={submitIdentity} className="space-y-4">
          <p className="text-sm text-[#555]">Confirm your identity to authorize this royalty claim.</p>
          <input className={input} placeholder="Full legal name" value={identity.legalName} onChange={(e) => setIdentity({ ...identity, legalName: e.target.value })} required />
          <input className={input} placeholder="Stage name (optional)" value={identity.stageName} onChange={(e) => setIdentity({ ...identity, stageName: e.target.value })} />
          <input className={input} type="email" placeholder="Email" value={identity.email} onChange={(e) => setIdentity({ ...identity, email: e.target.value })} required />
          <button type="submit" disabled={busy} className="w-full py-4 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition disabled:opacity-60">
            {busy ? "Saving…" : "Continue"}
          </button>
        </form>
      )}

      {step === "biometric" && (
        <div className="space-y-4 text-center">
          <p className="text-sm text-[#555]">Verify it&apos;s really you using your device biometrics — Windows Hello, Face ID, or fingerprint.</p>
          <button onClick={doBiometric} disabled={busy} className="w-full py-4 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition disabled:opacity-60">
            {busy ? "Verifying…" : "Verify with device biometrics"}
          </button>
        </div>
      )}

      {step === "sign" && (
        <div className="space-y-4">
          {bioNote && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">{bioNote}</p>}
          <div className="border-t border-black/10 pt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#111] mb-2">Authorization</p>
            <p className="text-sm text-[#555]">
              By signing, I authorize the filing of a featured-performer royalty claim and Letter of
              Direction for the recording above under 17 U.S.C. §114.
            </p>
            <p className="text-sm text-[#555] mt-2">
              I also authorize TrapRoyalties Pro and its partnered entertainment attorneys to prepare
              and file the necessary SoundExchange claim documents on my behalf.
            </p>
          </div>
          <SignaturePad onChange={setSignature} />
          <button onClick={submitSignature} disabled={busy || !signature} className="w-full py-4 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition disabled:opacity-60">
            {busy ? "Sealing authorization…" : "Sign & Authorize"}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-green-500/15 text-green-600 flex items-center justify-center text-3xl">✓</div>
          <h2 className="text-xl font-bold text-[#111]">Your authorization is complete</h2>
          <p className="text-sm text-[#555]">Your attorney has received your signed authorization and will file your SoundExchange claim.</p>
          {hash && (
            <div className="p-3 bg-[#f2efe6] border border-black/10 rounded-lg text-left">
              <p className="text-xs font-semibold text-[#555] mb-1">Tamper-evident verification seal (SHA-256):</p>
              <code className="text-[10px] text-[#333] break-all">{hash}</code>
            </div>
          )}
          <a href={`/artist/cases/${params.token}`}
            className="inline-block w-full py-3 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition">
            View Case Status
          </a>
        </div>
      )}
    </Frame>
  );
}

function Stepper({ step }: { step: string }) {
  const order = ["identity", "biometric", "sign", "done"];
  const labels: Record<string, string> = { identity: "Identity", biometric: "Biometric", sign: "Signature", done: "Done" };
  const idx = order.indexOf(step);
  return (
    <div className="flex items-center justify-between mb-6">
      {order.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= idx ? "bg-[#1d3557] text-white" : "bg-black/10 text-[#999]"}`}>{i < idx ? "✓" : i + 1}</div>
          <span className={`ml-2 text-xs ${i <= idx ? "text-[#111] font-medium" : "text-[#999]"}`}>{labels[s]}</span>
          {i < order.length - 1 && <div className={`h-px flex-1 mx-2 ${i < idx ? "bg-[#1d3557]" : "bg-black/10"}`} />}
        </div>
      ))}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#111] flex flex-col">
      <header className="bg-white border-b border-black/10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-xl font-bold text-[#1d3557]">TrapLawPro</span>
          <span className="px-3 py-1 bg-[#1d3557]/10 text-[#1d3557] text-xs rounded-full font-medium">Secure Authorization</span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 shadow-sm">{children}</div>
        <p className="text-center text-xs text-[#999] mt-4">Protected by device biometrics + tamper-evident SHA-256 sealing.</p>
      </main>
    </div>
  );
}
