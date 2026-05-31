"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const expired = sp.get("error") === "expired";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/artist/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#111] flex flex-col">
      <header className="bg-white border-b border-black/10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-xl font-bold text-[#1d3557]">TrapLawPro</span>
          <span className="px-3 py-1 bg-[#1d3557]/10 text-[#1d3557] text-xs rounded-full font-medium">Artist Dashboard</span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-md mx-auto px-6 py-12">
        <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-500/15 text-green-600 flex items-center justify-center text-2xl">✓</div>
              <h1 className="text-xl font-bold">Check your email</h1>
              <p className="text-sm text-[#555]">If a case is associated with <strong>{email}</strong>, we&apos;ve sent a secure sign-in link. It expires in 30 minutes.</p>
              <p className="text-xs text-[#999]">Don&apos;t see it? Ask your attorney for the direct case link they shared with you.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h1 className="text-xl font-bold">Sign in to track your royalties</h1>
              <p className="text-sm text-[#555]">Enter the email your attorney used. We&apos;ll send you a secure sign-in link — no password needed.</p>
              {expired && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">That link expired. Request a new one below.</p>}
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-lg text-[#111] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#1d3557]" />
              <button type="submit" disabled={busy} className="w-full py-3 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition disabled:opacity-60">
                {busy ? "Sending…" : "Send sign-in link"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ArtistLoginPage() {
  return <Suspense fallback={null}><LoginInner /></Suspense>;
}
